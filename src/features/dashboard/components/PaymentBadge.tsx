interface Props {
  method: string;
}

export default function PaymentBadge({ method }: Props) {
  const isCOD = method.toLowerCase() === "cod";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isCOD
          ? "bg-orange-100 text-orange-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {method.toUpperCase()}
    </span>
  );
}