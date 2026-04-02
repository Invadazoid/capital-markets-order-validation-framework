import SideBadge from "./SideBadge";

export default function RecentOrdersTable({ orders }) {
  return (
    <div className="bg-surface-card rounded-xl border border-border-default shadow-lg shadow-black/40 p-5
      hover:border-border-input transition-colors duration-200">
      <div className="flex justify-between items-center mb-3">
        <div className="text-text-heading text-base font-medium">Recent Orders</div>
        <div className="text-text-muted text-xs">{orders.length} saved</div>
      </div>

      {orders.length === 0 ? (
        <div className="text-text-muted text-sm py-8 text-center">
          No recent orders yet. Place one to see it here.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-surface-primary/50">
                <th className="text-left px-3 py-2.5 text-text-muted uppercase text-xs tracking-wider font-medium">Order ID</th>
                <th className="text-left px-3 py-2.5 text-text-muted uppercase text-xs tracking-wider font-medium">Symbol</th>
                <th className="text-left px-3 py-2.5 text-text-muted uppercase text-xs tracking-wider font-medium">Qty</th>
                <th className="text-left px-3 py-2.5 text-text-muted uppercase text-xs tracking-wider font-medium">Side</th>
                <th className="text-left px-3 py-2.5 text-text-muted uppercase text-xs tracking-wider font-medium">Status</th>
                <th className="text-left px-3 py-2.5 text-text-muted uppercase text-xs tracking-wider font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((r, i) => (
                <tr
                  key={r.orderId + i}
                  className="border-b border-border-default hover:bg-white/[0.03] transition-colors duration-150 animate-fade-in"
                >
                  <td className="px-3 py-2.5 text-text-body font-mono text-xs">{r.orderId}</td>
                  <td className="px-3 py-2.5 text-text-body">{r.symbol}</td>
                  <td className="px-3 py-2.5 text-text-body">{r.qty}</td>
                  <td className="px-3 py-2.5"><SideBadge side={r.side} /></td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs font-semibold ${
                      r.status === "ACCEPTED" ? "text-success" : "text-text-body"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-text-muted text-xs">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
