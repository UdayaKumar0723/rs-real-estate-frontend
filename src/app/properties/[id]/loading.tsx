export default function Loading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="skeleton aspect-[16/9]" />
          <div className="skeleton h-72" />
        </div>
        <div className="space-y-5">
          <div className="skeleton h-32" />
          <div className="skeleton h-64" />
        </div>
      </div>
    </section>
  );
}
