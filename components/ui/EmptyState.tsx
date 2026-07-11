import Link from "next/link";

export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-8 text-center">
      <p className="text-lg font-semibold text-[#1d1d1f]">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#7a7a7a]">{description}</p>
      {href && action ? (
        <Link className="mt-5 inline-flex rounded-full bg-[#0066cc] px-5 py-2.5 text-sm text-white" href={href}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}
