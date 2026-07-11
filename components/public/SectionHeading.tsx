export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="text-sm font-semibold text-[#0066cc]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#1d1d1f] md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-[#7a7a7a]">{description}</p> : null}
    </div>
  );
}
