import type { ButtonHTMLAttributes } from "react";

export default function CircleIconButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button type="button" className={`btn-circle ${className}`} {...rest}>
      {children}
    </button>
  );
}
