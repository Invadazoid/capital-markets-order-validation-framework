export default function StatusMessage({ message }) {
  const lower = message.toLowerCase();
  const isError = lower.startsWith("error") || lower.startsWith("network error");
  const isSuccess = lower.includes("accepted");

  const colorClass = isError
    ? "text-error"
    : isSuccess
      ? "text-success"
      : "text-text-label";

  return (
    <div
      id="statusMessage"
      className={`mt-4 text-base min-h-[24px] transition-colors duration-300 ${colorClass}`}
    >
      {message}
    </div>
  );
}
