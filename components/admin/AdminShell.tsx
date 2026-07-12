import Link from "next/link";
import { UserMenu } from "@/components/admin/UserMenu";
import { isSuperAdmin, requireCurrentUser } from "@/lib/admin-auth";

type NavItem = readonly [string, string];

const items: NavItem[] = [
  ["Dashboard", "/admin"],
  ["Branches", "/admin/branches"],
  ["Events", "/admin/events"],
  ["Sermons", "/admin/sermons"],
  ["Gallery", "/admin/gallery"],
  ["Prayer Requests", "/admin/prayer-requests"],
  ["Contact Messages", "/admin/contact-messages"],
  ["Users", "/admin/users"],
  ["Media Library", "/admin/media"],
];

const branchItems: NavItem[] = [
  ["Dashboard", "/admin"],
  ["Events", "/admin/events"],
  ["Sermons", "/admin/sermons"],
  ["Gallery", "/admin/gallery"],
  ["Prayer Requests", "/admin/prayer-requests"],
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const currentUser = await requireCurrentUser();
  const navItems = isSuperAdmin(currentUser) ? items : branchItems;

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-black p-5 text-white">
        <Link href="/admin" className="text-xl font-semibold">Family Blessing CMS</Link>
        <nav className="mt-8 grid gap-1 text-sm text-white/75">
          {navItems.map(([label, href]: NavItem) => <Link key={href} className="rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white" href={href}>{label}</Link>)}
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between border-b border-[#e0e0e0] bg-white px-6 py-4">
          <p className="font-semibold">Admin Panel</p>
          <UserMenu user={currentUser} />
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description ? <p className="mt-2 text-sm text-[#7a7a7a]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ children }: { children: React.ReactNode }) {
  const label = String(children);
  const normalized = label.replace(/[ _-]/g, "").toUpperCase();
  const colorClass = badgeColor(normalized);

  return (
    <span className={`inline-flex min-w-20 items-center justify-center rounded-full px-2.5 py-1 text-center text-[11px] font-semibold leading-none ${colorClass}`}>
      {children}
    </span>
  );
}

function badgeColor(label: string) {
  if (["ACTIVE", "ONSITE", "PUBLISHED", "BRANCHADMIN"].includes(label)) {
    return "bg-[#e8f7ee] text-[#16803c]";
  }

  if (["ZOOM", "SUPERADMIN", "ADMIN"].includes(label)) {
    return "bg-[#e9f2ff] text-[#0066cc]";
  }

  if (label === "EDITOR") {
    return "bg-[#fff0df] text-[#bd6512]";
  }

  if (label === "ARCHIVED") {
    return "bg-[#fff7d6] text-[#8a6500]";
  }

  return "bg-[#f1f1f3] text-[#6e6e73]";
}
