"use client";

import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { PropertyForm } from "@/components/PropertyForm";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { emptyPropertyForm, formValuesToFormData } from "@/lib/property-form";
import { PropertyFormValues } from "@/types";

export default function NewListingPage() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const createListing = async (values: PropertyFormValues, files: FileList | null) => {
    await apiRequest("/api/properties", {
      method: "POST",
      token: accessToken,
      body: formValuesToFormData(values, files),
    });
    router.push("/dashboard");
  };

  return (
    <AuthGuard>
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ink">Create listing</h1>
          <p className="mt-2 text-muted">
            This submits multipart form data to the protected property create API.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <PropertyForm initialValues={emptyPropertyForm} mode="create" onSubmit={createListing} />
        </div>
      </section>
    </AuthGuard>
  );
}
