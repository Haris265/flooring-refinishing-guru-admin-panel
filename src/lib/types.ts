export type AdminUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
};

export type LeadStatus = "new" | "contacted" | "scheduled" | "closed";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  zip_code: string;
  rooms_area: string;
  current_flooring: string;
  material_preference: string;
  budget: string;
  timing: string;
  message: string;
  photo_url: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  icon_key: string;
  featured_image_url: string | null;
  order: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectImage = {
  id: number;
  image_url: string | null;
  caption: string;
  order: number;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  cover_image_url: string | null;
  images: ProjectImage[];
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_active: boolean;
};

export type SiteSettings = {
  company_name: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  contact_name: string;
  service_area: string;
  address_blurb: string;
  years_experience: number;
  updated_at?: string;
};

export type Stats = {
  new_leads: number;
  total_leads: number;
  services: number;
  projects: number;
  faqs: number;
  recent_leads: Lead[];
};

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "closed",
];

export const PROJECT_CATEGORIES = [
  "flooring",
  "stairs",
  "tile",
  "kitchen",
  "bathroom",
  "remodel",
  "other",
] as const;
