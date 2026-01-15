import { getSession } from "@/lib/session";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const user = await getSession();
  return <NavbarClient user={user} />;
}