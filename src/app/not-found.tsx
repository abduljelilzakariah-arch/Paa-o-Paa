import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-margin-mobile text-center">
      <span className="material-symbols-outlined text-[80px] text-primary/30 mb-md">handyman</span>
      <h1 className="font-display text-display text-on-surface mb-sm">404</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
        This page could not be found.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
