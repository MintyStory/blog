import AdminGuard from "@/components/admin/AdminGuard";
import CategoriesManager from "@/components/admin/CategoriesManager";
import Eyebrow from "@/components/ui/Eyebrow";

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <div className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container-blog">
          <div className="mb-11">
            <Eyebrow>Admin</Eyebrow>
            <h1 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">카테고리 관리</h1>
          </div>
          <CategoriesManager />
        </div>
      </div>
    </AdminGuard>
  );
}
