import Link from "next/link";

type EmptyStateProps = {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ title, message, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{message}</p>
      {actionHref && actionLabel ? (
        <Link className="btn-primary mt-5 inline-flex" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
