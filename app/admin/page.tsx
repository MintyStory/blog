import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import ViewsDashboard from "@/components/admin/ViewsDashboard";
import Eyebrow from "@/components/ui/Eyebrow";

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container-blog">
          <div className="flex items-end justify-between mb-11">
            <div>
              <Eyebrow>Admin</Eyebrow>
              <h1 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">방문자 조회수 관리</h1>
            </div>
            <Link href="/admin/posts" className="btn-pill">
              글 관리 &rarr;
            </Link>
          </div>
          <ViewsDashboard />
        </div>
      </div>
    </AdminGuard>
  );
}
