import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";

export default function SectionHeader({
  eyebrow,
  title,
  trailing,
}: {
  eyebrow: string;
  title: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-11">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">{title}</h2>
      </div>
      {trailing}
    </div>
  );
}
