"use client";
import { Toaster, toast } from "sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export function useToast() {
  return {
    success: (m: string) => toast.success(m),
    error: (m: string) => toast.error(m),
    info: (m: string) => toast(m),
  };
}
