export default function Toast({ message, type, onDismiss }) {
  const isError = type === "error";
  return (
    <div
      className={`animate-toast-in pointer-events-auto flex items-start gap-3 rounded-lg border
        px-4 py-3 shadow-lg backdrop-blur-sm max-w-sm
        ${isError
          ? "bg-toast-error-bg border-accent-red/30 text-accent-red"
          : "bg-toast-success-bg border-accent-green/30 text-accent-green"
        }`}
    >
      <span className="text-sm flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="text-current opacity-60 hover:opacity-100 transition-opacity text-lg leading-none cursor-pointer"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}
