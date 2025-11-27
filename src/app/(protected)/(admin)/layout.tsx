import { ReactNode } from "react";
import AdminShell from "@/modules/shared/layout/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
