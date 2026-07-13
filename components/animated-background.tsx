export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-neon-blue/20 blur-3xl animate-drift" />
      <div
        className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-neon-cyan/15 blur-3xl animate-drift"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-neon-blue/15 blur-3xl animate-drift"
        style={{ animationDelay: "-12s" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />
    </div>
  )
}
