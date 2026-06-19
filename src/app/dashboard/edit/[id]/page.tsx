"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { PropertyForm } from "@/components/PropertyForm";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { formValuesToJson, propertyToFormValues } from "@/lib/property-form";
import { Property, PropertyFormValues } from "@/types";

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProperty() {
      setError("");
      setIsLoading(true);
      try {
        const result = await apiRequest<Property>(`/api/properties/${params.id}`, {
          cache: "no-store",
        });
        setProperty(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load property");
      } finally {
        setIsLoading(false);
      }
    }

    loadProperty();
  }, [params.id]);

  const updateListing = async (values: PropertyFormValues) => {
    await apiRequest(`/api/properties/${params.id}`, {
      method: "PATCH",
      token: accessToken,
      body: JSON.stringify(formValuesToJson(values)),
    });
    router.push("/dashboard");
  };

  return (
    <AuthGuard>
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ink">Edit listing</h1>
          <p className="mt-2 text-muted">This uses the protected update API and ownership check.</p>
        </div>

        {error ? <p className="alert-error">{error}</p> : null}
        {isLoading ? <div className="skeleton h-96" /> : null}

        {!isLoading && property ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <PropertyForm
              initialValues={propertyToFormValues(property)}
              mode="edit"
              onSubmit={updateListing}
            />
          </div>
        ) : null}
      </section>
    </AuthGuard>
  );
}
