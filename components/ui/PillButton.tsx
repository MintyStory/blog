import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type CommonProps = {
  children: React.ReactNode;
  variant?: "default" | "white";
  className?: string;
};

export function PillLink({
  href,
  children,
  variant = "default",
  className = "",
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`btn-pill ${variant === "white" ? "btn-pill-white" : ""} ${className}`}>
      {children}
    </Link>
  );
}

export function PillButton({
  children,
  variant = "default",
  className = "",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`btn-pill ${variant === "white" ? "btn-pill-white" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
