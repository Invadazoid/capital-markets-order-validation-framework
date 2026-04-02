import { useState } from "react";
import Spinner from "./Spinner";
import StatusMessage from "./StatusMessage";

export default function OrderForm({ onOrderPlaced, lastOrder, addToast }) {
  const [symbol, setSymbol] = useState("DEF");
  const [qty, setQty] = useState(300);
  const [side, setSide] = useState("BUY");
  const [statusMsg, setStatusMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ symbol: "", qty: "" });

  function validate() {
    const newErrors = { symbol: "", qty: "" };
    let valid = true;

    if (!symbol.trim()) {
      newErrors.symbol = "Symbol is required";
      valid = false;
    }

    const numQty = Number(qty);
    if (!qty || numQty <= 0 || !Number.isFinite(numQty)) {
      newErrors.qty = "Quantity must be greater than 0";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handlePlaceOrder(e) {
    e?.preventDefault?.();
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      orderId: `ORD-UI-${Date.now()}`,
      symbol: symbol.trim(),
      qty: Number(qty),
      side
    };

    const syncStatus = `Order ${payload.orderId} ACCEPTED`;
    setStatusMsg(syncStatus);

    try {
      const resp = await fetch("http://localhost:8080/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        const errMsg = `Error: ${resp.status} ${txt}`;
        setStatusMsg(errMsg);
        addToast(errMsg, "error");
        return;
      }

      const data = await resp.json().catch(() => null);
      if (!data) {
        const msg = "Placed but response JSON parse failed";
        setStatusMsg(msg);
        addToast(msg, "error");
        return;
      }

      const finalStatus = `Order ${data.orderId || payload.orderId} ${(
        data.status || "ACCEPTED"
      ).toString().toUpperCase()}`.trim();

      setStatusMsg(finalStatus);
      onOrderPlaced(data, payload);
      addToast("Order placed successfully", "success");

      // Reset form
      setSymbol("DEF");
      setQty(300);
      setSide("BUY");
    } catch (err) {
      const msg = "Network error: " + (err?.message || err);
      setStatusMsg(msg);
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputBase = `w-full px-3 py-2.5 rounded-lg border bg-surface-input text-white text-[15px]
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue/50`;

  return (
    <div className="bg-surface-card rounded-xl border border-border-default shadow-lg shadow-black/40 p-5
      hover:border-border-input transition-colors duration-200">
      <form onSubmit={handlePlaceOrder}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-text-heading text-base font-medium">New Order</div>
          <div className="text-text-muted text-xs">POST /placeOrder</div>
        </div>

        {/* Symbol */}
        <div className="flex items-start gap-3 mb-3">
          <label className="min-w-[72px] text-[15px] text-text-label pt-2.5" htmlFor="symbol">Symbol</label>
          <div className="flex-1">
            <input
              id="symbol"
              value={symbol}
              onChange={(e) => { setSymbol(e.target.value); if (errors.symbol) setErrors(prev => ({ ...prev, symbol: "" })); }}
              className={`${inputBase} ${errors.symbol ? "border-accent-red" : "border-border-input"}`}
            />
            {errors.symbol && <p className="mt-1 text-sm text-error animate-fade-in">{errors.symbol}</p>}
          </div>
        </div>

        {/* Qty */}
        <div className="flex items-start gap-3 mb-3">
          <label className="min-w-[72px] text-[15px] text-text-label pt-2.5" htmlFor="qty">Qty</label>
          <div className="flex-1 max-w-[200px]">
            <input
              id="qty"
              type="number"
              value={qty}
              onChange={(e) => { setQty(e.target.value); if (errors.qty) setErrors(prev => ({ ...prev, qty: "" })); }}
              className={`${inputBase} ${errors.qty ? "border-accent-red" : "border-border-input"}`}
            />
            {errors.qty && <p className="mt-1 text-sm text-error animate-fade-in">{errors.qty}</p>}
          </div>
        </div>

        {/* Side + Button */}
        <div className="flex items-center gap-3 mb-3">
          <label className="min-w-[72px] text-[15px] text-text-label" htmlFor="side">Side</label>
          <select
            id="side"
            value={side}
            onChange={(e) => setSide(e.target.value)}
            className={`${inputBase} max-w-[140px] cursor-pointer`}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>

          <div className="ml-auto">
            <button
              id="placeOrderBtn"
              type="submit"
              disabled={isSubmitting}
              className="bg-accent-blue text-white px-5 py-2.5 rounded-lg font-medium text-[15px]
                hover:bg-accent-blue-hover hover:shadow-md hover:shadow-accent-blue/20
                active:bg-accent-blue-active active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent-blue disabled:hover:shadow-none
                focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:ring-offset-2 focus:ring-offset-surface-card
                transition-all duration-150 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner size={16} />
                  Placing...
                </span>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </form>

      <StatusMessage message={statusMsg} />

      {lastOrder && (
        <div className="mt-5 animate-fade-in">
          <h3 className="text-text-heading text-sm font-medium mb-2">Last order details</h3>
          <div className="p-3 bg-surface-primary rounded-lg border border-border-default text-sm space-y-1">
            <p><span className="text-text-muted">Order ID:</span> <span className="text-white">{lastOrder.orderId}</span></p>
            <p><span className="text-text-muted">Symbol:</span> <span className="text-white">{lastOrder.symbol}</span></p>
            <p><span className="text-text-muted">Qty:</span> <span className="text-white">{lastOrder.qty}</span></p>
            <p><span className="text-text-muted">Side:</span> <span className="text-white">{lastOrder.side}</span></p>
            <p><span className="text-text-muted">Status:</span> <span className="text-white">{lastOrder.status}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
