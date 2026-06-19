import { MapPin } from "lucide-react";
import Link from "next/link";
import { formatCurrency, titleCase } from "@/lib/format";
import { Property } from "@/types";

export function PropertyCard({ property }: { property: Property }) {
  const imageUrl = property.images?.[0]?.imageUrl;

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="aspect-[16/10] bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-50 to-amber-50 text-sm font-medium text-slate-500">
              No image uploaded
            </div>
          )}
        </div>
        <div className="space-y-3 p-4">
          <div>
            <p className="text-lg font-semibold text-ink">{formatCurrency(property.price)}</p>
            <h2 className="line-clamp-2 min-h-12 text-base font-semibold text-slate-800">
              {property.title}
            </h2>
          </div>
          <p className="flex items-center gap-1 text-sm text-muted">
            <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
            {property.locality}, {property.city}
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="pill">{titleCase(property.propertyType)}</span>
            <span className="pill">{property.bedrooms} bed</span>
            <span className="pill">{property.bathrooms} bath</span>
            <span className="pill">{property.areaSqft} sqft</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
