import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { email, password } = req.body;
  const now = new Date();

  const { data: attemptData, error: attemptError } = await supabaseAdmin
    .from("login_event_logs")
    .select("*")
    .eq("email", email)
    .single();

  if (attemptError && attemptError.code !== "PGRST116") {
    console.error("Server error:", attemptError.message);
    return res.status(500).json({ message: "Server error" });
  }

  const locked_until = attemptData?.locked_until;
  if (locked_until && new Date(locked_until) > now) {
    const remaining = Math.ceil((new Date(locked_until) - now) / 1000);
    return res.status(429).json({
      error: "Account locked. Try again in (" + remaining + "s)",
    });
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    const failedAttempts = attemptData ? attemptData.failed_attempts + 1 : 1;
    let lockedUntil = null;
    if (failedAttempts >= 5) {
      timeout = 1; // Lock for 1 minute
      lockedUntil = new Date(now.getTime() + timeout * 60 * 1000); // Lock for 1 minute
    }

    await supabaseAdmin.from("login_event_logs").upsert({
      email: email,
      failed_attempts: failedAttempts,
      locked_until: lockedUntil,
    });

    console.error("Error signing in:", error.message);
    return res.status(401).json({ message: error.message });
  }

  await supabaseAdmin.from("login_event_logs").delete().eq("email", email);

  return res.status(200).json({
    message: "Login successful",
    data: data,
  });
}
