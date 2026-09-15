import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SidebarProvider } from "@/components/providers/SidebarProvider";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PageShell from "@/components/layout/PageShell";
import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";

export const metadata: Metadata = {
  title: "DEV LOG — 개발 블로그",
  description: "코드로 담아내는 생각의 공간",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <AuthProvider>
          <SidebarProvider>
            <Sidebar />
            <Header />
            <PageShell>
              <main>{children}</main>
              <Footer />
            </PageShell>
            <ScrollToTopButton />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
