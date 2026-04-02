import { useState } from "react";
import OrderForm from "./components/OrderForm";
import RecentOrdersTable from "./components/RecentOrdersTable";
import ToastContainer from "./components/ToastContainer";
import { useToast } from "./hooks/useToast";

export default function App() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  function handleOrderPlaced(data, payload) {
    setLastOrder(data);
    const row = {
      orderId: data.orderId || payload.orderId,
      symbol: data.symbol || payload.symbol,
      qty: data.qty ?? payload.qty,
      side: data.side || payload.side,
      status: data.status || "ACCEPTED",
      time: new Date().toLocaleString()
    };
    setRecentOrders(prev => [row, ...prev].slice(0, 12));
  }

  return (
    <div className="min-h-screen bg-surface-primary p-7">
      <h1 className="text-center text-4xl font-bold text-text-primary mb-5 mt-1.5">
        Order Frontend
      </h1>

      <div className="grid grid-cols-1 min-[880px]:grid-cols-[1fr_420px] gap-5 max-w-[1100px] mx-auto">
        <OrderForm
          onOrderPlaced={handleOrderPlaced}
          lastOrder={lastOrder}
          addToast={addToast}
        />
        <RecentOrdersTable orders={recentOrders} />
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
