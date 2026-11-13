import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

// Responsive so the lockup fits beside the menu button on narrow phones.
const SIZES = {
  sm: { tree: 'h-8 sm:h-9', gap: 'gap-2.5', name: 'text-[12px] sm:text-[13px]', cap: 'text-[6.5px] sm:text-[7px]' },
  md: { tree: 'h-10 sm:h-12', gap: 'gap-3 sm:gap-3.5', name: 'text-[14px] sm:text-[17px]', cap: 'text-[7.5px] sm:text-[9px]' },
  lg: { tree: 'h-24 sm:h-32', gap: 'gap-5 sm:gap-7', name: 'text-[26px] sm:text-[36px]', cap: 'text-[12px] sm:text-[16px]' },
};

// The Golden Teak Capital lockup: the tree mark, a thin gold rule, then the wordmark in
// tracked EB Garamond capitals with "Capital" set small beneath.
export function Logo({ variant = 'light', size = 'md' }: LogoProps) {
  const s = SIZES[size];
  const dark = variant === 'dark';
  const treeSrc = dark ? '/brand/tree-gold.png' : '/brand/tree.png';

  return (
    <span className={`inline-flex items-center ${s.gap}`}>
      <Image
        src={treeSrc}
        alt=""
        width={512}
        height={480}
        priority={size !== 'lg'}
        className={`${s.tree} w-auto select-none`}
      />
      <span className={`self-stretch w-px ${dark ? 'bg-gold-soft/50' : 'bg-gold/50'}`} aria-hidden="true" />
      <span className="flex flex-col whitespace-nowrap">
        <span
          className={`font-wordmark font-medium uppercase leading-none tracking-[0.14em] ${s.name} ${dark ? 'text-on-dark' : 'text-ink'}`}
        >
          Golden Teak
        </span>
        <span
          className={`mt-[0.55em] font-wordmark font-medium uppercase leading-none tracking-[0.42em] ${s.cap} ${dark ? 'text-gold-soft' : 'text-gold-deep'}`}
        >
          Capital
        </span>
      </span>
      <span className="sr-only">Golden Teak Capital</span>
    </span>
  );
}
