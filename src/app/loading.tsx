/** Shown automatically while the landing page loads (Next.js loading UI). */
export default function HomeLoading() {
  return (
    <main className="relative flex flex-col overflow-x-clip pb-32">
      {/* hero */}
      <section className="flex min-h-[90svh] flex-col justify-center px-4 md:px-12">
        <div className="container mx-auto">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-16 w-64 animate-pulse rounded-xl bg-muted md:h-24 md:w-96" />
          <div className="mt-8 space-y-3">
            <div className="h-5 w-3/4 max-w-xl animate-pulse rounded bg-muted" />
            <div className="h-5 w-2/3 max-w-lg animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-10 flex gap-3">
            <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
            <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </section>

      {/* feature / showcase */}
      <section className="px-4 py-12 md:px-12">
        <div className="container mx-auto grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
            <div className="h-5 w-full animate-pulse rounded bg-muted" />
            <div className="h-5 w-5/6 animate-pulse rounded bg-muted" />
          </div>
          <div className="aspect-square w-full animate-pulse rounded-3xl bg-muted lg:aspect-auto" />
        </div>
      </section>

      {/* a product range section */}
      <section className="flex min-h-[70svh] flex-col justify-center py-6">
        <div className="container mx-auto mb-6 px-4 md:px-12">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-9 w-52 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="px-4">
          <div className="container mx-auto h-[55vh] w-full animate-pulse rounded-3xl bg-muted" />
        </div>
      </section>

      {/* floating dock placeholder */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
        <div className="h-14 w-72 animate-pulse rounded-full bg-muted/80 shadow-lg" />
      </div>
    </main>
  );
}
