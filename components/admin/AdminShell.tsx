import { AdminNavigation, type AdminNavItem } from "@/components/admin/AdminNavigation";
import { UserMenu } from "@/components/admin/UserMenu";
import { isSuperAdmin, requireCurrentUser } from "@/lib/admin-auth";

const items: AdminNavItem[] = [
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

const branchItems: AdminNavItem[] = [
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
    <div className="admin-shell min-h-screen bg-[#f5f5f7] text-[#1d1d1f] lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <a className="admin-skip-link" href="#admin-content">Lewati ke konten utama</a>
      <AdminNavigation items={navItems} />
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-[68px] items-center justify-between border-b border-[#e0e0e0] bg-white/92 px-4 pl-18 backdrop-blur-xl sm:px-6 sm:pl-20 lg:px-8">
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.01em]">Admin Panel</p>
            <p className="hidden text-xs text-[#7a7a7a] sm:block">Kelola konten Family Blessing</p>
          </div>
          <UserMenu user={currentUser} />
        </header>
        <main id="admin-content" className="admin-content mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminPageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-8">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0066cc]">CMS Workspace</p>
        <h1 className="text-3xl font-semibold tracking-[-0.025em] md:text-[34px]">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6e6e73]">{description}</p> : null}
      </div>
      {action ? <div className="admin-page-action">{action}</div> : null}
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
