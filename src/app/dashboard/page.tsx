"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatDate, titleCase } from "@/lib/format";
import { PropertyListResponse } from "@/types";

export default function DashboardPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<PropertyListResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadListings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await apiRequest<PropertyListResponse>("/api/properties/my/listings?limit=50", {
        token: accessToken,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load listings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadListings();
    }
  }, [accessToken]);

  const deleteListing = async (id: string) => {
    const confirmed = window.confirm("Delete this listing?");
    if (!confirmed) return;

    try {
      await apiRequest(`/api/properties/${id}`, {
        method: "DELETE",
        token: accessToken,
      });
      await loadListings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete listing");
    }
  };

  return (
    <AuthGuard>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink">My listings</h1>
            <p className="mt-2 text-muted">Create, edit and delete properties owned by your account.</p>
          </div>
          <Link className="btn-primary" href="/dashboard/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Listing
          </Link>
        </div>

        {error ? <p className="alert-error mb-5">{error}</p> : null}
        {isLoading ? <div className="skeleton h-64" /> : null}

        {!isLoading && data?.items.length === 0 ? (
          <EmptyState
            title="No listings yet"
            message="Create your first property listing to test the protected create API."
            actionHref="/dashboard/new"
            actionLabel="Add Listing"
          />
        ) : null}

        {!isLoading && data?.items.length ? (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items.map((property) => (
                    <tr key={property.id}>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-ink">{property.title}</p>
                        <p className="text-muted">
                          {property.locality}, {property.city}
                        </p>
                      </td>
                      <td className="px-4 py-4">{titleCase(property.propertyType)}</td>
                      <td className="px-4 py-4 font-semibold">{formatCurrency(property.price)}</td>
                      <td className="px-4 py-4">{formatDate(property.createdAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Link className="icon-btn" href={`/dashboard/edit/${property.id}`} title="Edit">
                            <Edit className="h-4 w-4" aria-hidden="true" />
                          </Link>
                          <button
                            className="icon-btn text-red-700"
                            onClick={() => deleteListing(property.id)}
                            title="Delete"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>
    </AuthGuard>
  );
}
