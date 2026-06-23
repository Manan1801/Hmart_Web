import { cookies } from "next/headers";
import { AuthCard } from "@/src/components/auth/auth-card";
import { ResetPasswordForm } from "@/src/components/auth/reset-password-form";
import { PASSWORD_RECOVERY_COOKIE } from "@/src/lib/auth/recovery";
import { getCurrentUser } from "@/src/lib/auth/session";

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const hasRecoveryCookie =
    cookieStore.get(PASSWORD_RECOVERY_COOKIE)?.value === "1";

  return (
    <AuthCard
      subtitle="Choose a new password for your HMART account."
      title="Set a new password"
    >
      <ResetPasswordForm canReset={Boolean(user) && hasRecoveryCookie} />
    </AuthCard>
  );
}
