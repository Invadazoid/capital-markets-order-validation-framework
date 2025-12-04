# 🚀 Capital Markets Order Validation Framework
End-to-End QA/SDET Automation Project (UI + API + DB + WireMock + Playwright + k6 + CI)


## 📹 Demo (Loom)
📽 [![Demo Loom Link](https://github.com/Invadazoid/capital-markets-order-validation-framework/blob/master/Loom_Thumbnail.png?raw=true)](https://www.loom.com/share/9a209f7cdbc147c487c42abebee3dfea)


## 📘 Overview

This project simulates a capital-markets order validation flow:

Place Order → Validate → Persist to Ledger → UI Confirmation + API/DB Assertions

It showcases a full-stack SDET portfolio, combining:

✔ UI Tests (Selenium + TestNG)\
✔ API Tests (RestAssured)\
✔ DB Validation (PostgreSQL)\
✔ WireMock for upstream market-feed stubbing\
✔ Playwright End-to-End tests on the React UI\
✔ Performance smoke tests using k6\
✔ GitHub Actions CI pipeline (API + UI + Playwright + k6)\
✔ Allure-ready test reports

### This repo is designed as a hire-me proof-of-work project that demonstrates modern automation capabilities used in fintech/capital-markets QA.

## 🛠 Tech Stack
| Area                       | Tools                                             |
| -------------------------- | ------------------------------------------------- |
| **UI Automation**          | Selenium WebDriver, TestNG                        |
| **API Automation**         | RestAssured                                       |
| **Database**               | PostgreSQL (Docker)                               |
| **Service Virtualization** | WireMock                                          |
| **Frontend**               | React (served locally at `http://localhost:3000`) |
| **E2E Tests**              | Playwright                                        |
| **Performance**            | k6                                                |
| **Build/CI**               | Maven, GitHub Actions                             |
| **Reports**                | Allure-ready                                      |


## 🏗 Architecture Diagram
                      +------------------------+
                      |     React UI (3000)    |
                      | place order form (#symbol, qty)
                      +-----------+------------+
                                  |
                             Playwright
                             Selenium UI
                                  |
                                  v
        +---------------------------------------------------------+
        |               Order API / Test Suite                    |
        |   - TestNG (UI)  - RestAssured (API)  - SQL checks      |
        +-------------------+-------------------+------------------+
                            | 
                            v
                   +-------------------+
                   |   WireMock (8080) |
                   |  stub upstream    |
                   +---------+---------+
                             |
                             v
                 +---------------------------+
                 |     PostgreSQL (captest)  |
                 | orders table validation   |
                 +-------------+-------------+
                               |
                               v
                         +------------+
                         |   k6 perf  |
                         | smoke test |
                         +------------+

                    +-----------------------------+
                    |     GitHub Actions CI       |
                    | mvn test + UI + API + DB +  |
                    |  WireMock + Playwright + k6 |
                    +-----------------------------+


## ⚙️ Setup & Running Tests

The FULL setup instructions are in docs/runbook.md, but here is the quickstart:

### 1) Start PostgreSQL (Docker recommended)
docker run -d --name cm-pg \
  -e POSTGRES_DB=captest \
  -e POSTGRES_USER=capuser \
  -e POSTGRES_PASSWORD='cap@123' \
  -p 5432:5432 \
  postgres:14

### 2) Apply schema & seed data

Run these from the repository root:

psql -h localhost -U capuser -d captest -f db/schema.sql\
psql -h localhost -U capuser -d captest -f db/seed.sql

### 3) Start WireMock server (Docker recommended)
docker run -d --name wiremock \
  -p 8080:8080 \
  -v $(pwd)/wiremock:/home/wiremock \
  wiremock/wiremock:latest \
  --root-dir=/home/wiremock \
  --verbose

### 4) Confirm WireMock mappings are loaded
curl -s http://localhost:8080/__admin/mappings | jq '.'

### 5) Serve the React Frontend Demo UI
cd frontend\
npm install\
npm start   # runs at http://localhost:3000

### 6) Run only the UI Test (PlaceOrderUiTest)

In another terminal:

mvn -Dtest=ui.PlaceOrderUiTest#placeOrderUi \
  -Dwiremock.base=http://localhost:8080 \
  -Dui.url=http://localhost:3000 \
  test

### 7) Run only the API Test (OrderApiTest)
mvn -Dtest=api.OrderApiTest#testPlaceOrderAndDbValidation \
  -Dwiremock.base=http://localhost:8080 \
  test

### 8) Run both UI + API tests via TestNG suite
mvn test \
  -Dwiremock.base=http://localhost:8080 \
  -Dui.url=http://localhost:3000

### 9) Manual UI Testing at localhost:3000

Open browser → http://localhost:3000

Place a sample order

Verify confirmation UI and network request results

### 10) Playwright End-to-End Tests

Ensure the UI is already running at http://localhost:3000.

cd frontend\
npm install\
npx playwright install\
npx playwright test\
cd ..

### 11) Install k6 (Performance Testing)

Ubuntu/Debian:

sudo apt update\
sudo apt install gnupg ca-certificates\
curl -s https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6.gpg\
echo "deb [signed-by=/usr/share/keyrings/k6.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list\
sudo apt update\
sudo apt install k6

Ensure backend endpoint works\
curl -X POST http://localhost:8080/placeOrder \
  -H "Content-Type: application/json" \
  -d '{"symbol":"ABC","qty":10}'


Expected: 201 Created.

### 12) Run k6 Perf Smoke Test with Web Dashboard
cd k6\
k6 run --out web-dashboard place_order_test.js


Open dashboard:

http://localhost:5665

### 13) Clean up Docker containers
docker stop cm-pg && docker rm -f cm-pg\
docker stop wiremock && docker rm -f wiremock


## 🧰 CI Pipeline
GitHub Actions runs:

✔ PostgreSQL service\
✔ WireMock docker container\
✔ UI server\
✔ API + UI + DB tests\
✔ Playwright E2E tests\
✔ Upload Allure results\

Pipeline badge is at the top of this README.


## 🧾 License
MIT License



