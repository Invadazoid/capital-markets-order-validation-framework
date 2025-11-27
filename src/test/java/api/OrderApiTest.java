package api;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.sql.*;

import static org.testng.Assert.*;

public class OrderApiTest {

    private String wireMockBase = System.getProperty("wiremock.base", "http://localhost:8080");
    private String dbUrl = System.getProperty("db.url");
    private String dbUser = System.getProperty("db.user");
    private String dbPassword = System.getProperty("db.password");

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = wireMockBase;
    }

    @Test
    public void testPlaceOrderAndDbValidation() throws SQLException {
        // 1) Call the fake placeOrder API
        String reqBody = "{ \"symbol\":\"ABC\", \"qty\":10 }";
        Response resp = RestAssured.given()
                .header("Content-Type", "application/json")
                .body(reqBody)
                .post("/placeOrder")
                .then().statusCode(201).extract().response();

        String orderId = resp.jsonPath().getString("orderId");
        assertNotNull(orderId, "orderId should not be null");

        // 2) Simulate a downstream DB write (for demo). In real infra this would be done by service.
        try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO orders(order_id, symbol, qty, status) VALUES(?,?,?,?)");
            ps.setString(1, orderId);
            ps.setString(2, "ABC");
            ps.setInt(3, 10);
            ps.setString(4, "ACCEPTED");
            ps.executeUpdate();
        }

        // 3) Validate DB record exists and values are correct
        try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {
            PreparedStatement ps = conn.prepareStatement(
                    "SELECT status, qty FROM orders WHERE order_id = ?");
            ps.setString(1, orderId);
            ResultSet rs = ps.executeQuery();
            assertTrue(rs.next(), "DB should return a row for the inserted orderId");
            assertEquals(rs.getInt("qty"), 10);
            assertEquals(rs.getString("status"), "ACCEPTED");
        }
    }
}
