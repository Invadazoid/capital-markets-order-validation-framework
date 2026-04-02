import Toast from "./Toast";

export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onDismiss={() => onDismiss(t.id)}
        />
      ))}
    </div>
  );
}
