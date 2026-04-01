package ui;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.*;

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
    public void placeOrderUi() {
        String url = System.getProperty("ui.url", "http://localhost:3000/place-order");
        driver.get(url);

        driver.findElement(By.id("symbol")).clear();
        driver.findElement(By.id("symbol")).sendKeys("ABC");
        driver.findElement(By.id("qty")).clear();
        driver.findElement(By.id("qty")).sendKeys("10");
        driver.findElement(By.id("placeOrderBtn")).click();

        // Wait for status message to update
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.id("statusMessage"), "ACCEPTED"));

        String msg = driver.findElement(By.id("statusMessage")).getText();
        assertTrue(msg.toLowerCase().contains("accepted"), "Status message should indicate success");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
