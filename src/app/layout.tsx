import "./globals.css";
import AuthListener from "@/modules/shared/providers/AuthListener";
import { isDemo, locale } from "@/modules/shared/config";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={locale}>
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
        {!isDemo && <AuthListener />}
        {children}
        {isDemo && (
          <div className="fixed bottom-2 right-2 z-50 md:hidden rounded-md bg-sky-100 text-sky-800 px-2 py-1 text-xs shadow">
            Public demo (shared data)
          </div>
        )}
      </body>
    </html>
  );
}
