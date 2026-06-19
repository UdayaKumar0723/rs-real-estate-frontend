import { Property, PropertyFormValues } from "@/types";

export const emptyPropertyForm: PropertyFormValues = {
  title: "",
  description: "",
  city: "",
  locality: "",
  propertyType: "APARTMENT",
  bedrooms: "2",
  bathrooms: "2",
  areaSqft: "1000",
  price: "",
};

export const propertyToFormValues = (property: Property): PropertyFormValues => ({
  title: property.title,
  description: property.description,
  city: property.city,
  locality: property.locality,
  propertyType: property.propertyType,
  bedrooms: String(property.bedrooms),
  bathrooms: String(property.bathrooms),
  areaSqft: String(property.areaSqft),
  price: String(property.price),
});

export const formValuesToJson = (values: PropertyFormValues) => ({
  title: values.title,
  description: values.description,
  city: values.city,
  locality: values.locality,
  propertyType: values.propertyType,
  bedrooms: Number(values.bedrooms),
  bathrooms: Number(values.bathrooms),
  areaSqft: Number(values.areaSqft),
  price: Number(values.price),
});

export const formValuesToFormData = (values: PropertyFormValues, files: FileList | null) => {
  const formData = new FormData();
  const json = formValuesToJson(values);

  Object.entries(json).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  Array.from(files || []).forEach((file) => {
    formData.append("images", file);
  });

  return formData;
};
