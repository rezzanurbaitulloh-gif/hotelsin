export type Locale = 'en' | 'id'
export type Currency = 'USD' | 'IDR'

export interface LocalizedString {
  en: string
  id: string
}

export interface LocalizedContent {
  title: LocalizedString
  description: LocalizedString
  content?: LocalizedString
}

export type RoomStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'RESERVED'
  | 'CLEANING'
  | 'DIRTY'
  | 'MAINTENANCE'
  | 'OUT_OF_SERVICE'

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW'

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type UserRole =
  | 'SUPER_ADMIN'
  | 'HOTEL_ADMIN'
  | 'FRONT_DESK'
  | 'HOUSEKEEPING'
  | 'REVENUE_MANAGER'
  | 'CONTENT_MANAGER'

export type Permission =
  | 'rooms.read'
  | 'rooms.create'
  | 'rooms.update'
  | 'rooms.delete'
  | 'reservations.read'
  | 'reservations.create'
  | 'reservations.update'
  | 'reservations.cancel'
  | 'guests.read'
  | 'guests.create'
  | 'guests.update'
  | 'guests.delete'
  | 'content.read'
  | 'content.create'
  | 'content.update'
  | 'content.delete'
  | 'content.publish'
  | 'users.read'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'revenue.read'
  | 'revenue.manage'
  | 'housekeeping.read'
  | 'housekeeping.manage'
  | 'maintenance.read'
  | 'maintenance.manage'
  | 'settings.read'
  | 'settings.manage'

export interface Property {
  id: string
  name: LocalizedString
  tagline: LocalizedString
  description: LocalizedString
  address: LocalizedString
  city: LocalizedString
  country: LocalizedString
  phone: string
  email: string
  website: string
  latitude: number
  longitude: number
  timezone: string
  check_in_time: string
  check_out_time: string
  currency: Currency
  default_locale: Locale
  logo_url: string
  hero_image_url: string
  gallery_images: string[]
  created_at: string
  updated_at: string
}

export interface RoomType {
  id: string
  property_id: string
  name: LocalizedString
  description: LocalizedString
  short_description: LocalizedString
  base_price: number
  max_occupancy: number
  size_sqm: number
  bed_type: LocalizedString
  amenities: string[]
  images: string[]
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  property_id: string
  room_type_id: string
  room_number: string
  floor: number
  status: RoomStatus
  notes: string
  created_at: string
  updated_at: string
}

export interface Amenity {
  id: string
  name: LocalizedString
  icon: string
  category: string
  created_at: string
}

export interface Guest {
  id: string
  property_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  nationality: string
  date_of_birth: string | null
  id_type: string
  id_number: string
  vip_status: boolean
  preferences: Record<string, unknown>
  notes: string
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: string
  property_id: string
  guest_id: string
  room_id: string | null
  room_type_id: string
  check_in: string
  check_out: string
  nights: number
  adults: number
  children: number
  status: ReservationStatus
  source: string
  special_requests: string
  rate_plan_id: string | null
  room_rate: number
  subtotal: number
  tax_amount: number
  fee_amount: number
  discount_amount: number
  total_amount: number
  currency: Currency
  confirmation_code: string
  checked_in_at: string | null
  checked_out_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
}

export interface RatePlan {
  id: string
  property_id: string
  name: LocalizedString
  description: LocalizedString
  room_type_id: string
  base_price: number
  min_stay: number
  max_stay: number | null
  advance_purchase_days: number | null
  cancellation_policy: LocalizedString
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Offer {
  id: string
  property_id: string
  name: LocalizedString
  description: LocalizedString
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_nights: number
  applicable_room_type_ids: string[]
  valid_from: string
  valid_to: string
  is_active: boolean
  image_url: string
  terms: LocalizedString
  created_at: string
  updated_at: string
}

export interface Restaurant {
  id: string
  property_id: string
  name: LocalizedString
  description: LocalizedString
  cuisine: LocalizedString
  atmosphere: LocalizedString
  hours: LocalizedString
  images: string[]
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SpaService {
  id: string
  property_id: string
  name: LocalizedString
  description: LocalizedString
  duration_minutes: number
  price: number
  category: string
  images: string[]
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  property_id: string
  name: LocalizedString
  description: LocalizedString
  duration: LocalizedString
  price: number
  category: string
  images: string[]
  includes: LocalizedString[]
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  property_id: string
  image_url: string
  alt_text: LocalizedString
  caption: LocalizedString
  category: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface JournalPost {
  id: string
  property_id: string
  slug: string
  title: LocalizedString
  excerpt: LocalizedString
  content: LocalizedString
  cover_image_url: string
  author: string
  category: string
  tags: string[]
  status: ContentStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PageSection {
  id: string
  page_id: string
  section_key: string
  section_type: string
  content: Record<string, unknown>
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HousekeepingTask {
  id: string
  property_id: string
  room_id: string
  assigned_to: string | null
  status: 'PENDING' | 'IN_PROGRESS' | 'INSPECTION' | 'COMPLETED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  started_at: string | null
  completed_at: string | null
  inspected_at: string | null
  notes: string
  created_at: string
  updated_at: string
}

export interface MaintenanceTask {
  id: string
  property_id: string
  room_id: string | null
  title: string
  description: string
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  assigned_to: string | null
  reported_by: string
  estimated_cost: number | null
  actual_cost: number | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface GuestRequest {
  id: string
  property_id: string
  guest_id: string
  room_id: string | null
  title: string
  description: string
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  assigned_to: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  property_id: string
  reservation_id: string | null
  guest_id: string | null
  type: 'ROOM_REVENUE' | 'F&B' | 'SPA' | 'EXPERIENCE' | 'OTHER'
  amount: number
  currency: Currency
  payment_method: string
  status: 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'FAILED'
  reference: string
  notes: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  property_id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  permissions: Permission[]
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: string
  property_id: string
  key: string
  value: Record<string, unknown>
  created_at: string
  updated_at: string
}