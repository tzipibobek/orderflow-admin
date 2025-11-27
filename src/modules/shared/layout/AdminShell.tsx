"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-slate-50">
      <Topbar onMenu={() => setOpen(true)} />

      <div className="md:pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <main className="py-6">{children}</main>
        </div>
      </div>

      <Sidebar open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
