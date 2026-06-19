import { Search } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PropertyCard } from "@/components/PropertyCard";
import { apiRequest } from "@/lib/api";
import { propertyTypes } from "@/lib/config";
import { PropertyListResponse } from "@/types";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const valueOf = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

async function fetchProperties(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  const allowed = [
    "city",
    "propertyType",
    "bedrooms",
    "minPrice",
    "maxPrice",
    "sortBy",
    "sortOrder",
    "page",
  ];

  allowed.forEach((key) => {
    const value = valueOf(params[key]);
    if (value) query.set(key, value);
  });
  query.set("limit", "9");

  return apiRequest<PropertyListResponse>(`/api/properties?${query.toString()}`, {
    cache: "no-store",
  });
}

export default async function Home({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const currentPage = Number(valueOf(params.page) || "1");
  let data: PropertyListResponse | null = null;
  let error = "";

  try {
    data = await fetchProperties(params);
  } catch (err) {
    error = err instanceof Error ? err.message : "Unable to load properties";
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Real estate search</p>
        <h1 className="mt-2 text-3xl font-bold text-ink md:text-4xl">
          Find homes, plots and commercial spaces
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Search by city, budget, property type and bedrooms.
        </p>
      </div>

      <form className="mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-5">
          <label className="field md:col-span-2">
            <span>City or location</span>
            <input name="city" defaultValue={valueOf(params.city)} placeholder="Hyderabad" />
          </label>
          <label className="field">
            <span>Type</span>
            <select name="propertyType" defaultValue={valueOf(params.propertyType)}>
              <option value="">Any</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Bedrooms</span>
            <input name="bedrooms" min={0} max={20} type="number" defaultValue={valueOf(params.bedrooms)} />
          </label>
          <label className="field">
            <span>Min Price</span>
            <input name="minPrice" min={1} type="number" defaultValue={valueOf(params.minPrice)} />
          </label>
          <label className="field">
            <span>Max Price</span>
            <input name="maxPrice" min={1} type="number" defaultValue={valueOf(params.maxPrice)} />
          </label>
          <label className="field">
            <span>Sort By</span>
            <select name="sortBy" defaultValue={valueOf(params.sortBy) || "createdAt"}>
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
            </select>
          </label>
          <label className="field">
            <span>Order</span>
            <select name="sortOrder" defaultValue={valueOf(params.sortOrder) || "desc"}>
              <option value="desc">High to low</option>
              <option value="asc">Low to high</option>
            </select>
          </label>
          <div className="flex items-end gap-2 md:col-span-2">
            <button className="btn-primary w-full" type="submit">
              <Search className="h-4 w-4" aria-hidden="true" />
              Search
            </button>
            <Link className="btn-secondary" href="/">
              Reset
            </Link>
          </div>
        </div>
      </form>

      {error ? <p className="alert-error">{error}</p> : null}

      {data && data.items.length > 0 ? (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Showing {data.items.length} of {data.pagination.total} properties
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              aria-disabled={currentPage <= 1}
              className={`btn-secondary ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
              href={{ pathname: "/", query: { ...params, page: String(currentPage - 1) } }}
            >
              Previous
            </Link>
            <span className="text-sm font-medium text-slate-700">
              Page {data.pagination.page} of {Math.max(data.pagination.totalPages, 1)}
            </span>
            <Link
              aria-disabled={currentPage >= data.pagination.totalPages}
              className={`btn-secondary ${
                currentPage >= data.pagination.totalPages ? "pointer-events-none opacity-50" : ""
              }`}
              href={{ pathname: "/", query: { ...params, page: String(currentPage + 1) } }}
            >
              Next
            </Link>
          </div>
        </>
      ) : !error ? (
        <EmptyState
          title="No properties found"
          message="Try changing city, budget or property type filters."
          actionHref="/"
          actionLabel="Clear Filters"
        />
      ) : null}
    </section>
  );
}
