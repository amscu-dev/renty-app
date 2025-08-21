import ConfirmSignUp from "@/components/custom/ConfirmSignUp";
import { redirect } from "next/navigation";

async function ConfirmSignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ data: string }>;
}) {
  const { data } = await searchParams;
  if (!data) redirect("/signin");
  const { email } = JSON.parse(decodeURIComponent(data));
  return <ConfirmSignUp email={email} />;
}
export default ConfirmSignUpPage;
