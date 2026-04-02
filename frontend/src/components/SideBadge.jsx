export default function SideBadge({ side }) {
  const isBuy = side === "BUY";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
        ${isBuy
          ? "bg-accent-green/15 text-accent-green border-accent-green/25"
          : "bg-accent-red/15 text-accent-red border-accent-red/25"
        }`}
    >
      {side}
    </span>
  );
}
