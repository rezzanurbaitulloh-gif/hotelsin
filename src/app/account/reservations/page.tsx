export default function Page() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-4">HotelsIn</p>
      <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight mb-4">My Reservations</h1>
      
      <p className="text-muted-foreground max-w-xl leading-relaxed mb-8">View and manage your stays.</p>
      <div className="flex gap-3">
        <a href="/" className="h-11 px-6 inline-flex items-center justify-center border border-border text-xs tracking-[0.15em] hover:bg-brand-foreground hover:text-brand-background hover:border-brand-foreground transition-colors">HOME</a>
        <a href="/admin" className="h-11 px-6 inline-flex items-center justify-center bg-brand-foreground text-brand-background text-xs tracking-[0.15em] hover:bg-brand-foreground/90 transition-colors">ADMIN</a>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">Route: <code className="bg-muted px-2 py-1 rounded">(account)/reservations</code> — rendering OK (zero-404 guarantee)</p>
    </div>
  )
}
