import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/server/auth";

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) redirect("/login");
  let currentUser;
  try {
    currentUser = verifyToken(token);
  } catch {
    redirect("/login");
  }
  if (currentUser.role !== "admin") redirect("/");

  async function addUser(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;
    if (!token) return;
    const user = verifyToken(token);
    if (user.role !== "admin") return;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as Role;
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, hashed_password: hashed, role },
    });
    revalidatePath("/admin/users");
  }

  const users = await prisma.user.findMany();

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">User Management</h1>
      <ul className="mb-4">
        {users.map((u) => (
          <li key={u.id}>{u.email} - {u.role}</li>
        ))}
      </ul>
      <form action={addUser} className="flex flex-col gap-2 max-w-sm">
        <input className="border p-2" name="email" type="email" placeholder="Email" required />
        <input className="border p-2" name="password" type="text" placeholder="Password" required />
        <select className="border p-2" name="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-blue-500 text-white p-2" type="submit">Add User</button>
      </form>
    </div>
  );
}
