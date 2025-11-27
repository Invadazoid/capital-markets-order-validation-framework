INSERT INTO orders (order_id, symbol, qty, status) VALUES ('ORD-INIT-1','ABC',10,'PENDING') ON CONFLICT DO NOTHING;
