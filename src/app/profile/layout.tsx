import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { CustomerNav } from "@/components/profile/CustomerNav";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role === "artisan" || user.role === "business") redirect("/dashboard");

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-container-max mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-xl">
        <CustomerNav user={user} />
        <div>{children}</div>
      </div>
    </div>
  );
}
