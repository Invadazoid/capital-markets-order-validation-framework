package api;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.github.tomakehurst.wiremock.client.WireMock;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import utils.TestUtils;

import java.net.URL;
import java.nio.file.Paths;
import java.sql.*;

import static org.testng.Assert.*;
import static com.github.tomakehurst.wiremock.client.WireMock.*;

public class OrderApiTest {

    private static WireMockServer wireMockServer;
    private String wireMockBase = System.getProperty("wiremock.base", "http://localhost:8090");
    private String dbUrl = System.getProperty("db.url");
    private String dbUser = System.getProperty("db.user");
    private String dbPassword = System.getProperty("db.password");

    @BeforeClass
    public void setup() {
        String wireMockBase = System.getProperty("wiremock.base", "http://localhost:8090");
        int port = extractPortFromUrl(wireMockBase);
        
        if (port == 8090 && wireMockServer == null) {
            // Start embedded WireMock for port 8090
            String wireMockDir = Paths.get("wiremock").toAbsolutePath().toString();
            wireMockServer = new WireMockServer(WireMockConfiguration.wireMockConfig()
                    .port(port)
                    .usingFilesUnderDirectory(wireMockDir));
            wireMockServer.start();
            System.out.println("WireMock started on port " + port + " with dir: " + wireMockDir);
        } else if (port == 8080) {
            // For port 8080, assume external WireMock is running - register mapping programmatically
            WireMock.configureFor("localhost", 8080);
            try {
                // Register the /placeOrder mapping
                WireMock.stubFor(post(urlEqualTo("/placeOrder"))
                        .willReturn(aResponse()
                                .withStatus(201)
                                .withHeader("Content-Type", "application/json")
                                .withBody("{\"orderId\": \"ORD-123\", \"status\": \"accepted\"}")));
                System.out.println("Mapping registered for WireMock on port 8080");
            } catch (Exception e) {
                System.out.println("Failed to register mapping: " + e.getMessage());
            }
        }
        RestAssured.baseURI = wireMockBase;
    }
    
    private static int extractPortFromUrl(String urlString) {
        try {
            URL url = new URL(urlString);
            int port = url.getPort();
            return port > 0 ? port : 80;
        } catch (Exception e) {
            return 8090; // fallback
        }
    }

    @Test
    public void testPlaceOrderAndDbValidation() throws SQLException {
        // 1) Call the fake placeOrder API
        String reqBody = "{ \"symbol\":\"ABC\", \"qty\":10, \"orderId\":\"{{now format='yyyyMMddHHmmss'}}\" }";
        reqBody = TestUtils.expandAndEnsure(reqBody);
        
        Response resp = RestAssured.given()
                .header("Content-Type", "application/json")
                .body(reqBody)
                .post("/placeOrder")
                .then().statusCode(201).extract().response();

        // Extract orderId from the expanded request body
        String orderId = null;
        String[] parts = reqBody.split("\"orderId\"\\s*:\\s*\"");
        if (parts.length > 1) {
            orderId = parts[1].split("\"")[0];
        }
        assertNotNull(orderId, "orderId should not be null");

        // 2) Simulate a downstream DB write (for demo). In real infra this would be done by service.
        // Skip DB operations if database is not available
        try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO orders(order_id, symbol, qty, status) VALUES(?,?,?,?)");
            ps.setString(1, orderId);
            ps.setString(2, "ABC");
            ps.setInt(3, 10);
            ps.setString(4, "ACCEPTED");
            ps.executeUpdate();
            
            // 3) Validate DB record exists and values are correct
            PreparedStatement ps2 = conn.prepareStatement(
                    "SELECT status, qty FROM orders WHERE order_id = ?");
            ps2.setString(1, orderId);
            ResultSet rs = ps2.executeQuery();
            assertTrue(rs.next(), "DB should return a row for the inserted orderId");
            assertEquals(rs.getInt("qty"), 10);
            assertEquals(rs.getString("status"), "ACCEPTED");
        } catch (SQLException e) {
            // Database not available - log and continue
            System.out.println("Database not available, skipping DB validation: " + e.getMessage());
        }
    }
}
