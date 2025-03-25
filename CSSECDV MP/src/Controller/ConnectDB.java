package Controller;

import java.sql.*;

public class ConnectDB {
    
    public static Connection DBConnect() {
        try {
            String driverURL = "jdbc:sqlite:" + "database.db";
            Connection conn = DriverManager.getConnection(driverURL);
            System.out.println("Connection Established");
            return conn;
        } catch (SQLException e) {
            System.out.println("Connection Failed:" + e);
            return null;
        }
    }
}
