import type { UserRole } from "@/types/auth";

export function getHomeRoute(role: UserRole): `/student` | `/staff` | `/admin` {
  switch (role) {
    case "student":
      return "/student";
    case "staff":
      return "/staff";
    case "admin":
      return "/admin";
  }
}

export function getRoleFromGroup(group: string): UserRole | null {
  if (group === "student") return "student";
  if (group === "staff") return "staff";
  if (group === "admin") return "admin";
  return null;
}
