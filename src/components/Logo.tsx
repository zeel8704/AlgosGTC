interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

// Responsive so the full wordmark fits beside the menu button on narrow phones.
const SIZES = {
  sm: 'text-[13px] sm:text-[15px]',
  md: 'text-[15px] sm:text-[19px]',
  lg: 'text-[24px] sm:text-[34px]',
};

// The Golden Teak Capital wordmark: tracked EB Garamond capitals in espresso ink.
export function Logo({ variant = 'light', size = 'md' }: LogoProps) {
  const color = variant === 'light' ? 'text-ink' : 'text-on-dark';

  return (
    <span
      className={`inline-block font-wordmark font-medium uppercase leading-none tracking-[0.14em] whitespace-nowrap ${SIZES[size]} ${color}`}
    >
      Golden Teak Capital
    </span>
  );
}
