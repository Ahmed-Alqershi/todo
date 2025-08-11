import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyToken } from "@/lib/server/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) redirect("/login");
  try {
    const user = await verifyToken(token);
    if (user.role === "admin") {
      redirect("/admin/users");
    } else {
      redirect("/dashboard");
    }
  } catch {
    redirect("/login");
  }
}
