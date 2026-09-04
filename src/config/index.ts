export const APP_CONFIG = {
  name: 'HotelsIn',
  tagline: 'A QUIETER WAY TO ARRIVE',
  description: 'A private sanctuary shaped by architecture, nature and time.',
  defaultLocale: 'id' as const,
  defaultCurrency: 'USD' as const,
  supportedLocales: ['en', 'id'] as const,
  supportedCurrencies: ['USD', 'IDR'] as const,
  exchangeRate: 16000,
  taxRate: 0.11,
  serviceFeeRate: 0.05,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  pagination: {
    default: 20,
    max: 100,
  },
}

export const ROUTES = {
  public: {
    home: '/',
    stay: '/stay',
    stayDetail: (slug: string) => `/stay/${slug}`,
    dine: '/dine',
    dineDetail: (slug: string) => `/dine/${slug}`,
    wellness: '/wellness',
    wellnessDetail: (slug: string) => `/wellness/${slug}`,
    experiences: '/experiences',
    experiencesDetail: (slug: string) => `/experiences/${slug}`,
    property: '/property',
    destination: '/destination',
    offers: '/offers',
    offersDetail: (slug: string) => `/offers/${slug}`,
    gallery: '/gallery',
    journal: '/journal',
    journalDetail: (slug: string) => `/journal/${slug}`,
    reserve: '/reserve',
    availability: '/reserve/availability',
    guest: '/reserve/guest',
    review: '/reserve/review',
    confirmation: '/reserve/confirmation',
    login: '/login',
    register: '/register',
  },
  account: {
    profile: '/account/profile',
    reservations: '/account/reservations',
    reservationDetail: (id: string) => `/account/reservations/${id}`,
  },
  admin: {
    dashboard: '/admin',
    reservations: '/admin/reservations',
    arrivals: '/admin/arrivals',
    departures: '/admin/departures',
    guests: '/admin/guests',
    guestRequests: '/admin/guest-requests',
    rooms: '/admin/rooms',
    roomTypes: '/admin/room-types',
    availability: '/admin/availability',
    amenities: '/admin/amenities',
    housekeeping: '/admin/housekeeping',
    maintenance: '/admin/maintenance',
    rates: '/admin/rates',
    offers: '/admin/offers',
    transactions: '/admin/transactions',
    reports: '/admin/reports',
    dining: '/admin/dining',
    wellness: '/admin/wellness',
    experiences: '/admin/experiences',
    homepage: '/admin/website/homepage',
    pages: '/admin/website/pages',
    gallery: '/admin/website/gallery',
    journal: '/admin/website/journal',
    navigation: '/admin/website/navigation',
    localization: '/admin/website/localization',
    users: '/admin/administration/users',
    roles: '/admin/administration/roles',
    permissions: '/admin/administration/permissions',
    settings: '/admin/administration/settings',
  },
}

export const NAVIGATION = {
  public: [
    { key: 'stay', label: { en: 'STAY', id: 'MENGINAP' }, href: '/stay' },
    { key: 'dine', label: { en: 'DINE', id: 'MAKAN' }, href: '/dine' },
    { key: 'wellness', label: { en: 'WELLNESS', id: 'KESEHATAN' }, href: '/wellness' },
    { key: 'experiences', label: { en: 'EXPERIENCES', id: 'PENGALAMAN' }, href: '/experiences' },
    { key: 'property', label: { en: 'PROPERTY', id: 'PROPERTI' }, href: '/property' },
    { key: 'offers', label: { en: 'OFFERS', id: 'PAKET' }, href: '/offers' },
    { key: 'journal', label: { en: 'JOURNAL', id: 'JURNAL' }, href: '/journal' },
  ],
  admin: {
    commandCenter: [
      { key: 'overview', label: { en: 'Overview', id: 'Ringkasan' }, href: '/admin' },
    ],
    frontOffice: [
      { key: 'reservations', label: { en: 'Reservations', id: 'Reservasi' }, href: '/admin/reservations' },
      { key: 'arrivals', label: { en: 'Arrivals', id: 'Kedatangan' }, href: '/admin/arrivals' },
      { key: 'departures', label: { en: 'Departures', id: 'Keberangkatan' }, href: '/admin/departures' },
      { key: 'guests', label: { en: 'Guests', id: 'Tamu' }, href: '/admin/guests' },
      { key: 'guestRequests', label: { en: 'Guest Requests', id: 'Permintaan Tamu' }, href: '/admin/guest-requests' },
    ],
    property: [
      { key: 'rooms', label: { en: 'Rooms', id: 'Kamar' }, href: '/admin/rooms' },
      { key: 'roomTypes', label: { en: 'Room Types', id: 'Tipe Kamar' }, href: '/admin/room-types' },
      { key: 'availability', label: { en: 'Availability', id: 'Ketersediaan' }, href: '/admin/availability' },
      { key: 'amenities', label: { en: 'Amenities', id: 'Fasilitas' }, href: '/admin/amenities' },
    ],
    operations: [
      { key: 'housekeeping', label: { en: 'Housekeeping', id: 'Housekeeping' }, href: '/admin/housekeeping' },
      { key: 'maintenance', label: { en: 'Maintenance', id: 'Maintenance' }, href: '/admin/maintenance' },
    ],
    revenue: [
      { key: 'rates', label: { en: 'Rates', id: 'Tarif' }, href: '/admin/rates' },
      { key: 'offers', label: { en: 'Offers', id: 'Penawaran' }, href: '/admin/offers' },
      { key: 'transactions', label: { en: 'Transactions', id: 'Transaksi' }, href: '/admin/transactions' },
      { key: 'reports', label: { en: 'Reports', id: 'Laporan' }, href: '/admin/reports' },
    ],
    experience: [
      { key: 'dining', label: { en: 'Dining', id: 'Dining' }, href: '/admin/dining' },
      { key: 'wellness', label: { en: 'Wellness', id: 'Wellness' }, href: '/admin/wellness' },
      { key: 'experiences', label: { en: 'Experiences', id: 'Experiences' }, href: '/admin/experiences' },
    ],
    website: [
      { key: 'homepage', label: { en: 'Homepage', id: 'Beranda' }, href: '/admin/website/homepage' },
      { key: 'pages', label: { en: 'Pages', id: 'Halaman' }, href: '/admin/website/pages' },
      { key: 'gallery', label: { en: 'Gallery', id: 'Galeri' }, href: '/admin/website/gallery' },
      { key: 'journal', label: { en: 'Journal', id: 'Jurnal' }, href: '/admin/website/journal' },
      { key: 'navigation', label: { en: 'Navigation', id: 'Navigasi' }, href: '/admin/website/navigation' },
      { key: 'localization', label: { en: 'Localization', id: 'Lokalisasi' }, href: '/admin/website/localization' },
    ],
    administration: [
      { key: 'users', label: { en: 'Users', id: 'Pengguna' }, href: '/admin/administration/users' },
      { key: 'roles', label: { en: 'Roles', id: 'Peran' }, href: '/admin/administration/roles' },
      { key: 'permissions', label: { en: 'Permissions', id: 'Izin' }, href: '/admin/administration/permissions' },
      { key: 'settings', label: { en: 'Settings', id: 'Pengaturan' }, href: '/admin/administration/settings' },
    ],
  },
}

export const ROOM_STATUS_LABELS: Record<string, { en: string; id: string }> = {
  AVAILABLE: { en: 'Available', id: 'Tersedia' },
  OCCUPIED: { en: 'Occupied', id: 'Terisi' },
  RESERVED: { en: 'Reserved', id: 'Dipesan' },
  CLEANING: { en: 'Cleaning', id: 'Dibersihkan' },
  DIRTY: { en: 'Dirty', id: 'Kotor' },
  MAINTENANCE: { en: 'Maintenance', id: 'Maintenance' },
  OUT_OF_SERVICE: { en: 'Out of Service', id: 'Tidak Aktif' },
}

export const RESERVATION_STATUS_LABELS: Record<string, { en: string; id: string }> = {
  PENDING: { en: 'Pending', id: 'Menunggu' },
  CONFIRMED: { en: 'Confirmed', id: 'Dikonfirmasi' },
  CHECKED_IN: { en: 'Checked In', id: 'Check-in' },
  CHECKED_OUT: { en: 'Checked Out', id: 'Check-out' },
  CANCELLED: { en: 'Cancelled', id: 'Dibatalkan' },
  NO_SHOW: { en: 'No Show', id: 'Tidak Datang' },
}

export const HOUSEKEEPING_STATUS_LABELS: Record<string, { en: string; id: string }> = {
  PENDING: { en: 'Pending', id: 'Menunggu' },
  IN_PROGRESS: { en: 'In Progress', id: 'Sedang Dikerjakan' },
  INSPECTION: { en: 'Inspection', id: 'Inspeksi' },
  COMPLETED: { en: 'Completed', id: 'Selesai' },
}

export const MAINTENANCE_STATUS_LABELS: Record<string, { en: string; id: string }> = {
  OPEN: { en: 'Open', id: 'Terbuka' },
  IN_PROGRESS: { en: 'In Progress', id: 'Sedang Dikerjakan' },
  RESOLVED: { en: 'Resolved', id: 'Terselesaikan' },
  CLOSED: { en: 'Closed', id: 'Ditutup' },
}

export const CONTENT_STATUS_LABELS: Record<string, { en: string; id: string }> = {
  DRAFT: { en: 'Draft', id: 'Draf' },
  PUBLISHED: { en: 'Published', id: 'Dipublikasikan' },
  ARCHIVED: { en: 'Archived', id: 'Diarsipkan' },
}