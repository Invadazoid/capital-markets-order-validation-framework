-- orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE,
  symbol VARCHAR(10),
  qty INT,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- trades
CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  trade_id VARCHAR(50) UNIQUE,
  order_id VARCHAR(50),
  executed_qty INT,
  price NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ledger
CREATE TABLE IF NOT EXISTS ledger (
  id SERIAL PRIMARY KEY,
  ledger_id SERIAL,
  order_id VARCHAR(50),
  balance_change NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
