import { redirect } from "next/navigation";

// v2 step 1 starts on Home; onboarding and the rest of the flows come later.
export default function Index() {
  redirect("/home");
}
