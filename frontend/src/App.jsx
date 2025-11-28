import React, { useState } from "react";

export default function App() {
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [status, setStatus] = useState("");

  const base = import.meta.env.VITE_API_BASE || "http://localhost:8080";

  async function placeOrder(e) {
    e.preventDefault();
    setStatus("Placing order...");
    try {
      const res = await fetch(`${base}/placeOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, qty: Number(qty) }),
      });
      const json = await res.json();
      setStatus(`Order ${json.orderId} ${json.status}`);
    } catch (err) {
      console.error(err);
      setStatus("Error placing order");
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 30 }}>
      <h1>Place Order</h1>
      <form onSubmit={placeOrder}>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="symbol">Symbol</label><br />
          <input id="symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="qty">Qty</label><br />
          <input id="qty" type="number" value={qty} onChange={e => setQty(e.target.value)} />
        </div>

        <button id="placeOrderBtn" type="submit">Place Order</button>
      </form>

      <div id="statusMessage" style={{ marginTop: 20 }}>{status}</div>
    </div>
  );
}
