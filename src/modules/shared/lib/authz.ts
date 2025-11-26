export function isOwner(email?: string | null) {
  if (!email) return false;
  const owners = (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return owners.includes(email.toLowerCase());
}

export type Role = "owner" | "employee" | "guest";
export const roleAllowsManagement = (role?: Role | null) => role === "owner";
