export function Stars({
  rating,
  size = 14,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const full = Math.round(rating);
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= full ? "#C9184A" : "none"}
          stroke="#C9184A"
          strokeWidth="1.4"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 17.3l-6.2 3.7 1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.8 1.6 7z" />
        </svg>
      ))}
    </span>
  );
}
