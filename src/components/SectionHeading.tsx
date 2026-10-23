interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
  /** Rendered opposite the title on wide screens (e.g. a note or link). */
  aside?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className = '',
  aside,
}: SectionHeadingProps) {
  const center = align === 'center';
  const titleColor = tone === 'light' ? 'text-ink' : 'text-on-dark';
  const bodyColor = tone === 'light' ? 'text-ink-2' : 'text-on-dark-2';

  return (
    <div
      className={`${center ? 'text-center mx-auto max-w-2xl' : 'flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6'} ${className}`}
    >
      <div className={center ? '' : 'max-w-2xl'}>
        {eyebrow && <p className={tone === 'light' ? 'eyebrow' : 'eyebrow-dark'}>{eyebrow}</p>}
        <h2
          className={`${eyebrow ? 'mt-4' : ''} font-display text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.015em] ${titleColor}`}
        >
          {title}
        </h2>
        {description && <p className={`mt-5 text-base leading-relaxed ${bodyColor}`}>{description}</p>}
      </div>
      {aside && !center && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
