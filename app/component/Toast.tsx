interface ToastProps {
  message: string;
  type: "success" | "error";
}

export default function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } animate-slideIn`}
    >
      {message}
    </div>
  );
}