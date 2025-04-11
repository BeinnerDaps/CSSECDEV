import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

export const getLogs = () => {
  const [logs, setLogs] = useState([]);
  const [logsError, setLogsError] = useState(null);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from("logs")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setLogs(data);
      } catch (error) {
        setLogsError(error.message);
      } finally {
        setLogsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { logs, logsError, logsLoading };
};

export const insertLog = async (userId, message) => {
  try {
    const { data, error } = await supabase
      .from("logs")
      .insert({ user_id: userId, message })
      .single();
    if (error) throw error;
    console.log("Log inserted successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error inserting log:", error.message);
    return { success: false, error: error.message };
  }
};
