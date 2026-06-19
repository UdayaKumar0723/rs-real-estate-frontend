export default function Loading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="skeleton h-32" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="skeleton h-80" key={index} />
        ))}
      </div>
    </section>
  );
}
