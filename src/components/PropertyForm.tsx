"use client";

import { ImagePlus, Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { propertyTypes } from "@/lib/config";
import { PropertyFormValues } from "@/types";

type PropertyFormProps = {
  initialValues: PropertyFormValues;
  mode: "create" | "edit";
  onSubmit: (values: PropertyFormValues, files: FileList | null) => Promise<void>;
};

export function PropertyForm({ initialValues, mode, onSubmit }: PropertyFormProps) {
  const [values, setValues] = useState(initialValues);
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof PropertyFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(values, files);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? <p className="alert-error">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field md:col-span-2">
          <span>Title</span>
          <input
            required
            minLength={5}
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="2 BHK apartment near metro"
          />
        </label>

        <label className="field md:col-span-2">
          <span>Description</span>
          <textarea
            required
            minLength={20}
            rows={5}
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Mention amenities, nearby landmarks, parking, ventilation and ownership details."
          />
        </label>

        <label className="field">
          <span>City</span>
          <input
            required
            value={values.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="Hyderabad"
          />
        </label>

        <label className="field">
          <span>Locality</span>
          <input
            required
            value={values.locality}
            onChange={(event) => updateField("locality", event.target.value)}
            placeholder="Gachibowli"
          />
        </label>

        <label className="field">
          <span>Property Type</span>
          <select
            value={values.propertyType}
            onChange={(event) => updateField("propertyType", event.target.value)}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Price</span>
          <input
            required
            min={1}
            type="number"
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
            placeholder="8500000"
          />
        </label>

        <label className="field">
          <span>Bedrooms</span>
          <input
            required
            min={0}
            max={20}
            type="number"
            value={values.bedrooms}
            onChange={(event) => updateField("bedrooms", event.target.value)}
          />
        </label>

        <label className="field">
          <span>Bathrooms</span>
          <input
            required
            min={0}
            max={20}
            type="number"
            value={values.bathrooms}
            onChange={(event) => updateField("bathrooms", event.target.value)}
          />
        </label>

        <label className="field">
          <span>Area Sqft</span>
          <input
            required
            min={50}
            type="number"
            value={values.areaSqft}
            onChange={(event) => updateField("areaSqft", event.target.value)}
          />
        </label>

        {mode === "create" ? (
          <label className="field">
            <span>Images</span>
            <span className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-muted">
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              <input
                className="w-full border-0 p-0 text-sm"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setFiles(event.target.files)}
              />
            </span>
          </label>
        ) : null}
      </div>

      <button className="btn-primary" disabled={isSubmitting} type="submit">
        <Save className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Saving..." : mode === "create" ? "Create Listing" : "Update Listing"}
      </button>
    </form>
  );
}
