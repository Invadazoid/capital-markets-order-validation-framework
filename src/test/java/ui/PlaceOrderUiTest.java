package ui;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.*;
import org.testng.annotations.BeforeSuite;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

import java.time.Duration;

import static org.testng.Assert.*;

public class PlaceOrderUiTest {

    private WebDriver driver;

    @BeforeClass
    public void beforeClass() {
        // Intentionally empty — no WebDriverManager
    }

    @BeforeMethod
    public void setUp() {
        // Force using distro chromedriver and disable managers
        System.setProperty("webdriver.manager.enabled", "false");
        System.setProperty("selenium.manager.enabled", "false");
        System.setProperty("webdriver.chrome.driver", "/usr/lib/chromium-browser/chromedriver");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--user-data-dir=/tmp/chrome-user-data-" + System.nanoTime());
        options.setBinary("/usr/bin/chromium-browser");

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.get(System.getProperty("ui.url", "http://localhost:3000"));
    }

    @Test
    public void placeOrderUi() throws InterruptedException {
        String url = System.getProperty("ui.url", "http://localhost:3000/place-order");
        driver.get(url);

        driver.findElement(By.id("symbol")).clear();
        driver.findElement(By.id("symbol")).sendKeys("ABC");
        driver.findElement(By.id("qty")).clear();
        driver.findElement(By.id("qty")).sendKeys("10");
        driver.findElement(By.id("placeOrderBtn")).click();

        // short wait for UI update
        Thread.sleep(1000);

        String msg = driver.findElement(By.id("statusMessage")).getText();
        assertTrue(msg.toLowerCase().contains("accepted") || msg.toLowerCase().contains("order"), "Status message should indicate success");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
