"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "@/modules/shared/i18n";

export default function BackButton({
  fallback = "/dashboard",
  label = t("back"),
  className = "text-slate-600 hover:text-slate-900",
}: {
  fallback?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const idx = (window.history.state && (window.history.state as any).idx) ?? 0;
    const ref = document.referrer || "";
    const sameOrigin = ref.startsWith(window.location.origin);
    setCanGoBack(idx > 0 || (window.history.length > 1 && sameOrigin));
  }, []);

  const goBack = () => (canGoBack ? router.back() : router.replace(fallback));

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={t("back")}
    >
      <ArrowLeft className="h-6 w-6" strokeWidth={2} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
