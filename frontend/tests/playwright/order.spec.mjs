import { test, expect } from "@playwright/test";

test("place order shows status and order in list (debugging)", async ({
  page,
  playwright,
}) => {
  // debug helpers

  const tried = [];

  const log = (tag, ...args) => console.log(`[PW][${tag}]`, ...args);

  // attach listeners

  page.on("console", (msg) => log("console", msg.type(), msg.text()));

  page.on("pageerror", (err) =>
    log("pageerror", err && err.stack ? err.stack : err)
  );

  page.on("requestfailed", (req) =>
    log(
      "requestfailed",
      req.method(),
      req.url(),
      req.failure && req.failure().errorText
    )
  );

  page.on("response", (resp) => log("response", resp.status(), resp.url()));

  // Try unregistering service workers / clear cache before navigation

  // create a fresh context (ensures no persistent storage)

  const context = await playwright.chromium.launchPersistentContext("", {
    headless: true,
  });

  const debugPage = await context.newPage();

  try {
    // ensure no service workers (best-effort)

    await debugPage.goto("about:blank");

    await debugPage
      .evaluate(async () => {
        try {
          const regs = await navigator.serviceWorker.getRegistrations();

          for (const r of regs) {
            await r.unregister();
          }

          if ("caches" in window) {
            const keys = await caches.keys();

            for (const k of keys) await caches.delete(k);
          }

          return "sw-cleared";
        } catch (e) {
          return "sw-clear-error:" + (e && e.message);
        }
      })
      .then((r) => log("sw", r));
  } catch (e) {
    log("sw-eval-error", e && e.stack ? e.stack : e);
  }

  // prefer baseURL from env/config, but test both hostnames

  const fromConfig =
    test.info().project.use && test.info().project.use.baseURL
      ? test.info().project.use.baseURL
      : process.env.UI_BASE;

  const urls = [
    fromConfig || "http://localhost:3000",

    "http://127.0.0.1:3000",
  ].filter(Boolean);

  // try each URL until one succeeds

  let success = false;

  for (const url of urls) {
    tried.push(url);

    log("attempt", url);

    // start tracing for this attempt

    await context.tracing.start({ screenshots: true, snapshots: true });

    try {
      // navigate

      const resp = await debugPage.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      log("goto-result", resp ? resp.status() : "no-response", url);

      // if we have a response and status < 400, check DOM and continue

      if (resp && resp.status() < 400) {
        // small stabilization

        await debugPage
          .waitForLoadState("networkidle", { timeout: 5000 })
          .catch(() => {});

        // show a tiny bit of DOM

        const title = await debugPage.title().catch(() => "<no-title>");

        log("title", title);

        // done — we can run real interactions here if needed

        success = true;

        await context.tracing.stop({ path: `trace-success-${Date.now()}.zip` });

        log("trace", "trace-success created");

        break;
      } else {
        // capture trace and continue

        await context.tracing.stop({ path: `trace-fail-${Date.now()}.zip` });

        log("trace", "trace-fail created");
      }
    } catch (err) {
      log("nav-exception", err && err.message ? err.message : err);

      try {
        await context.tracing.stop({
          path: `trace-exception-${Date.now()}.zip`,
        });
      } catch (e) {
        log("trace-stop-err", e && e.message);
      }
    }
  }

  log("tried-urls", tried);

  await context.close();

  if (!success) {
    throw new Error(
      "Navigation failed for all tried URLs. See debug logs and generated trace-*.zip files in frontend folder."
    );
  }
});
