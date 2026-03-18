// Zinnia Group logo — three variants:
// 'on-dark'        → white text + white icon
// 'on-dark-accent' → white text + #DFF266 icon (default)
// 'on-light'       → #1B2035 text + #1B2035 icon

export default function ZinniaLogo({ variant = 'on-dark-accent', width = 140, className = '' }) {
  const height = Math.round(width * (29 / 150));
  const textColor = variant === 'on-light' ? '#1B2035' : '#FAF8F8';
  const iconColor = variant === 'on-dark-accent' ? '#DFF266' : variant === 'on-light' ? '#1B2035' : '#FAF8F8';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 150 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Zinnia Group"
    >
      {/* ZINNIA wordmark */}
      <path d="M35.0127 26.3702V24.0267L53.2241 4.47661L54.7727 5.71005H35.1366V3.24316H55.9496V5.55587L37.7382 25.1368L36.3445 23.9033H56.0425V26.3702H35.0127Z" fill={textColor} />
      <path d="M58.4561 3.24316H61.3675V26.3702H58.4561V3.24316Z" fill={textColor} />
      <path d="M86.8693 24.9209L85.4446 25.0134V3.24316H88.263V26.3702H84.5154L66.8306 4.59995L68.2553 4.50744V26.3702H65.4369V3.24316H69.2154L86.8693 24.9209Z" fill={textColor} />
      <path d="M113.752 24.9209L112.327 25.0134V3.24316H115.146V26.3702H111.398L93.7131 4.59995L95.1378 4.50744V26.3702H92.3194V3.24316H96.0979L113.752 24.9209Z" fill={textColor} />
      <path d="M119.202 3.24316H122.113V26.3702H119.202V3.24316Z" fill={textColor} />
      <path d="M128.567 20.6347V18.1678H144.92V20.6347H128.567ZM138.571 3.24316L150 26.3702H146.841L136.094 4.22992H137.642L126.864 26.3702H123.705L135.133 3.24316H138.571Z" fill={textColor} />
      {/* Z icon mark */}
      <path d="M10.2582 10.8612L18.1023 3.01709H25.9464V10.8612L18.1023 18.7053V10.8612H10.2582Z" fill={iconColor} />
      <path d="M18.1023 18.7053H25.9464V26.5494H18.1023V18.7053Z" fill={iconColor} />
      <path d="M10.2582 10.8612L2.41406 18.7053V26.5494H10.2582L18.1023 18.7053H10.2582V10.8612Z" fill={iconColor} />
      <path d="M10.2582 10.8612H2.41406V3.01709H10.2582V10.8612Z" fill={iconColor} />
    </svg>
  );
}
