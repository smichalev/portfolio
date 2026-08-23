import * as React from "react"

function RuFlag({ className }: { className?: string }) {
  const clipId = React.useId()

  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      role="img"
      aria-label="Флаг России"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="16" rx="2" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="24" height="5.333" fill="#FFFFFF" />
        <rect y="5.333" width="24" height="5.333" fill="#0039A6" />
        <rect y="10.667" width="24" height="5.333" fill="#D52B1E" />
      </g>
    </svg>
  )
}

function UsFlag({ className }: { className?: string }) {
  const clipId = React.useId()
  const stripeHeight = 16 / 13
  const stripes = Array.from({ length: 13 }, (_, i) => (
    <rect
      key={i}
      x="0"
      y={i * stripeHeight}
      width="24"
      height={stripeHeight}
      fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
    />
  ))

  const starRows = [
    { y: 1.4, count: 5 },
    { y: 2.9, count: 4 },
    { y: 4.4, count: 5 },
    { y: 5.9, count: 4 },
    { y: 7.4, count: 5 },
  ]

  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      role="img"
      aria-label="Флаг США"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="16" rx="2" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {stripes}
        <rect x="0" y="0" width="10.5" height="8.615" fill="#3C3B6E" />
        {starRows.flatMap((row, rowIndex) =>
          Array.from({ length: row.count }, (_, i) => {
            const spacing = 10.5 / (row.count + 1)
            return (
              <circle
                key={`${rowIndex}-${i}`}
                cx={spacing * (i + 1)}
                cy={row.y}
                r="0.45"
                fill="#FFFFFF"
              />
            )
          })
        )}
      </g>
    </svg>
  )
}

export { RuFlag, UsFlag }
