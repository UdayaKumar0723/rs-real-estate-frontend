import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { PropertyCard } from "@/components/PropertyCard";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatDate, titleCase } from "@/lib/format";
import { Property } from "@/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getProperty(id: string) {
  try {
    return await apiRequest<Property>(`/api/properties/${id}`, {
      next: { revalidate: 60 },
    });
  } catch {
    return null;
  }
}

async function getSimilar(id: string) {
  try {
    return await apiRequest<Property[]>(`/api/properties/${id}/similar`, {
      next: { revalidate: 60 },
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: "Property not found",
    };
  }

  const title = `${property.title} in ${property.locality}, ${property.city}`;
  const description = `${formatCurrency(property.price)} ${titleCase(property.propertyType)} with ${
    property.bedrooms
  } bedrooms and ${property.areaSqft} sqft.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: property.images?.[0]?.imageUrl ? [property.images[0].imageUrl] : [],
      type: "article",
    },
  };
}

export default async function PropertyDetails({ params }: PageProps) {
  const { id } = await params;
  const [property, similar] = await Promise.all([getProperty(id), getSimilar(id)]);

  if (!property) {
    notFound();
  }

  const heroImage = property.images?.[0]?.imageUrl;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="aspect-[16/9] bg-slate-100">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-50 to-amber-50 text-slate-500">
                  No property image uploaded
                </div>
              )}
            </div>
          </div>

          {property.images.length > 1 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {property.images.slice(1).map((image) => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt={property.title}
                  className="aspect-[4/3] rounded-lg border border-slate-200 object-cover"
                />
              ))}
            </div>
          ) : null}

          <article className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-bold text-brand">{formatCurrency(property.price)}</p>
                <h1 className="mt-2 text-3xl font-bold text-ink">{property.title}</h1>
                <p className="mt-3 flex items-center gap-2 text-muted">
                  <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                  {property.locality}, {property.city}
                </p>
              </div>
              <span className="pill">{titleCase(property.propertyType)}</span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-surface p-4">
                <BedDouble className="mb-2 h-5 w-5 text-brand" aria-hidden="true" />
                <p className="font-semibold text-ink">{property.bedrooms} Bedrooms</p>
              </div>
              <div className="rounded-lg bg-surface p-4">
                <Bath className="mb-2 h-5 w-5 text-brand" aria-hidden="true" />
                <p className="font-semibold text-ink">{property.bathrooms} Bathrooms</p>
              </div>
              <div className="rounded-lg bg-surface p-4">
                <Ruler className="mb-2 h-5 w-5 text-brand" aria-hidden="true" />
                <p className="font-semibold text-ink">{property.areaSqft} Sqft</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-ink">Description</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                {property.description}
              </p>
            </div>

            <p className="mt-6 text-sm text-muted">Listed on {formatDate(property.createdAt)}</p>
          </article>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-ink">Owner details</h2>
            <p className="mt-3 font-medium text-slate-800">{property.owner?.name || "Owner"}</p>
            <p className="text-sm text-muted">{property.owner?.email || "Login to contact"}</p>
          </div>
          <InquiryForm propertyId={property.id} />
        </aside>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-ink">Similar properties</h2>
        {similar.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-muted">
            No similar properties found yet.
          </p>
        )}
      </div>
    </section>
  );
}
