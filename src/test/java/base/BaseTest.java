package base;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import org.testng.ITestNGListener;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.AfterSuite;
import java.nio.file.Paths;

public class BaseTest implements ITestNGListener {
    protected static WireMockServer wireMockServer;

    @BeforeSuite(alwaysRun = true)
    public static void startWireMock() {
        int port = Integer.parseInt(System.getProperty("wiremock.port", "8080"));
        String wireMockDir = Paths.get("wiremock").toAbsolutePath().toString();
        wireMockServer = new WireMockServer(WireMockConfiguration.wireMockConfig()
                .port(port)
                .usingFilesUnderDirectory(wireMockDir));
        wireMockServer.start();
        System.out.println("WireMock started on port " + port + " with dir: " + wireMockDir);
    }

    @AfterSuite(alwaysRun = true)
    public static void stopWireMock() {
        if (wireMockServer != null) {
            wireMockServer.stop();
            System.out.println("WireMock stopped");
        }
    }
}
