export interface CommissionPackage {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
  style?: string;
  includes?: string[];
  turnaround_days?: number;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionRequest {
  id: string;
  package_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  custom_requirements?: string;
  estimated_price?: number;
  reference_images?: string[];
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  voice_note_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionPackageCardProps {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  style?: string;
  includes?: string[];
  turnaroundDays?: number;
  imageUrl?: string;
  onSelect: (id: string) => void;
}

export interface CommissionFilters {
  category?: string;
  style?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  isActive?: boolean;
}