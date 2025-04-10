interface KitStatusBadgeProps {
  received?: boolean;
}

export default function KitStatusBadge({ received }: KitStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        received
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {received ? 'Reçu' : 'Non reçu'}
    </span>
  );
}