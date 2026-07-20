import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  return (
    <div className="craft-pattern min-h-[80vh] flex items-center justify-center px-margin-mobile py-xl">
      <div className="w-full max-w-md bg-surface-white p-xl rounded-2xl shadow-card border border-border-tan text-center">
        <span className="material-symbols-outlined text-[48px] text-primary mb-md">lock_reset</span>
        <h1 className="font-headline-lg text-headline-lg mb-sm">Reset Password</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl">
          Enter your email and we&apos;ll send a reset link. (Demo: this is a placeholder screen.)
        </p>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-md py-3 rounded-lg border border-border-tan bg-surface-white focus:border-primary outline-none mb-lg font-body-sm"
        />
        <Button className="w-full mb-md">Send Reset Link</Button>
        <Link href="/login" className="text-primary font-body-sm hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
