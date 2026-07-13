export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-widest text-cyan-400">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance font-heading text-3xl font-bold text-white text-glow sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-pretty leading-relaxed text-slate-400">{subtitle}</p> : null}
    </div>
  )
}
