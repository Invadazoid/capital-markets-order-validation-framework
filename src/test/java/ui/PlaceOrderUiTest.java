package ui;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.*;

import static org.testng.Assert.*;

public class PlaceOrderUiTest {

    private WebDriver driver;

    @BeforeClass
    public void beforeClass() {
        WebDriverManager.chromedriver().setup();
    }

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @Test
    public void placeOrderUi() throws InterruptedException {
        // This test expects a small demo UI to be running locally (see README for optional React app).
        String url = System.getProperty("ui.url", "http://localhost:3000/place-order");
        driver.get(url);

        // Example form element ids: symbol, qty, placeOrderBtn, statusMessage
        driver.findElement(By.id("symbol")).clear();
        driver.findElement(By.id("symbol")).sendKeys("ABC");
        driver.findElement(By.id("qty")).clear();
        driver.findElement(By.id("qty")).sendKeys("10");
        driver.findElement(By.id("placeOrderBtn")).click();

        // small wait for update (explicit wait would be better - simplified here)
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
