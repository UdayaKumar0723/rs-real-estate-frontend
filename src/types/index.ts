export type User = {
  id: string;
  name: string;
  email: string;
};

export type PropertyType = "APARTMENT" | "VILLA" | "PLOT" | "HOUSE" | "COMMERCIAL";

export type PropertyImage = {
  id: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
};

export type Property = {
  id: string;
  userId: string;
  owner?: {
    name: string;
    email: string;
  };
  title: string;
  description: string;
  city: string;
  locality: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  price: number;
  status: string;
  images: PropertyImage[];
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PropertyListResponse = {
  items: Property[];
  pagination: Pagination;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type SentInquiry = {
  id: string;
  message: string;
  created_at: string;
  property_id: string;
  property_title: string;
  city: string;
  locality: string;
  owner_name: string;
  owner_email: string;
};

export type ReceivedInquiry = {
  id: string;
  message: string;
  created_at: string;
  property_id: string;
  property_title: string;
  sender_name: string;
  sender_email: string;
};

export type PropertyFormValues = {
  title: string;
  description: string;
  city: string;
  locality: string;
  propertyType: PropertyType;
  bedrooms: string;
  bathrooms: string;
  areaSqft: string;
  price: string;
};
