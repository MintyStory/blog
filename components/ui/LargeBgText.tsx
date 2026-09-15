export default function LargeBgText({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[72px] md:text-[200px] font-black tracking-[-0.05em] text-transparent whitespace-nowrap pointer-events-none select-none z-0"
      style={{ WebkitTextStroke: "1px rgba(0,0,0,0.055)" }}
    >
      {children}
    </div>
  );
}
