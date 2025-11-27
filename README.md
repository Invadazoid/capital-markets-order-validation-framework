# Capital Markets Order Validation Framework

## What this is
A compact SDET framework demonstrating UI + API + DB validations for a simple Order → Trade → Ledger flow. Uses WireMock to simulate upstream services and PostgreSQL for DB validation.

## Quick prerequisites
- Java 11+
- Maven
- Node (optional for static server / Playwright)
- PostgreSQL
- WireMock standalone jar
- (Optional) k6 for perf smoke

## Quick start (developer)
1. Start Postgres and create DB/user:
sudo -u postgres psql -c "CREATE DATABASE captest;"
sudo -u postgres psql -c "CREATE USER capuser WITH ENCRYPTED PASSWORD 'cap@123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE captest TO capuser;"
psql -U capuser -d captest -f db/schema.sql
psql -U capuser -d captest -f db/seed.sql


2. Start WireMock:
java -jar wiremock-standalone.jar --port 8080 --root-dir wiremock


3. (Optional) Serve demo UI:
npm i -g http-server
http-server ui/demo -p 3000


4. Run tests:
mvn test -Ddb.url=jdbc:postgresql://localhost:5432/captest -Ddb.user=capuser -Ddb.password=cap@123


5. Generate / view Allure report locally:
mvn allure:serve


6. Run perf smoke:
k6 run k6/place_order_test.js