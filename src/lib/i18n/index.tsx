'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, Currency } from '@/types'
import { APP_CONFIG } from '@/config'

interface I18nContextType {
  locale: Locale
  currency: Currency
  setLocale: (locale: Locale) => void
  setCurrency: (currency: Currency) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Locale, Record<string, string>> = {
  en: {
    'nav.stay': 'STAY',
    'nav.dine': 'DINE',
    'nav.wellness': 'WELLNESS',
    'nav.experiences': 'EXPERIENCES',
    'nav.property': 'PROPERTY',
    'nav.offers': 'OFFERS',
    'nav.journal': 'JOURNAL',
    'nav.reserve': 'RESERVE',
    'nav.account': 'ACCOUNT',
    'nav.login': 'LOGIN',
    'nav.register': 'REGISTER',
    'hero.headline': 'A QUIETER WAY TO ARRIVE',
    'hero.subheadline': 'A private sanctuary shaped by architecture, nature and time.',
    'hero.reserve': 'RESERVE YOUR STAY',
    'hero.explore': 'EXPLORE THE PROPERTY',
    'reservation.arrival': 'ARRIVAL',
    'reservation.departure': 'DEPARTURE',
    'reservation.guests': 'GUESTS',
    'reservation.rooms': 'ROOMS',
    'reservation.promo': 'PROMO CODE',
    'reservation.check': 'CHECK AVAILABILITY',
    'rooms.from': 'From',
    'rooms.per_night': '/ night',
    'rooms.view': 'View Details',
    'rooms.book': 'Book Now',
    'rooms.size': 'Size',
    'rooms.capacity': 'Guests',
    'rooms.bed': 'Bed',
    'rooms.amenities': 'Amenities',
    'dining.hours': 'Hours',
    'dining.cuisine': 'Cuisine',
    'dining.reserve': 'Reserve a Table',
    'wellness.spa': 'Spa',
    'wellness.treatments': 'Treatments',
    'wellness.yoga': 'Yoga',
    'wellness.programs': 'Wellness Programs',
    'experiences.duration': 'Duration',
    'experiences.price': 'Price',
    'experiences.book': 'Book Experience',
    'offers.valid': 'Valid',
    'offers.terms': 'Terms & Conditions',
    'offers.book': 'Book Offer',
    'journal.read': 'Read More',
    'journal.categories': 'Categories',
    'gallery.filter': 'Filter',
    'footer.contact': 'Contact',
    'footer.address': 'Address',
    'footer.policies': 'Policies',
    'footer.social': 'Follow Us',
    'footer.rights': 'All rights reserved.',
    'admin.dashboard': 'Dashboard',
    'admin.overview': 'Overview',
    'admin.occupancy': 'Occupancy',
    'admin.adr': 'ADR',
    'admin.revpar': 'RevPAR',
    'admin.revenue': 'Revenue',
    'admin.arrivals': 'Arrivals',
    'admin.departures': 'Departures',
    'admin.available': 'Available Rooms',
    'admin.occupied': 'Occupied Rooms',
    'admin.reservations': 'Reservations',
    'admin.guests': 'Guests',
    'admin.rooms': 'Rooms',
    'admin.room_types': 'Room Types',
    'admin.availability': 'Availability',
    'admin.amenities': 'Amenities',
    'admin.housekeeping': 'Housekeeping',
    'admin.maintenance': 'Maintenance',
    'admin.rates': 'Rates',
    'admin.offers': 'Offers',
    'admin.transactions': 'Transactions',
    'admin.reports': 'Reports',
    'admin.dining': 'Dining',
    'admin.wellness': 'Wellness',
    'admin.experiences': 'Experiences',
    'admin.website': 'Website',
    'admin.homepage': 'Homepage',
    'admin.pages': 'Pages',
    'admin.gallery': 'Gallery',
    'admin.journal': 'Journal',
    'admin.navigation': 'Navigation',
    'admin.localization': 'Localization',
    'admin.administration': 'Administration',
    'admin.users': 'Users',
    'admin.roles': 'Roles',
    'admin.permissions': 'Permissions',
    'admin.settings': 'Settings',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.status': 'Status',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.upload': 'Upload',
    'common.download': 'Download',
    'common.preview': 'Preview',
    'common.publish': 'Publish',
    'common.archive': 'Archive',
    'common.draft': 'Draft',
    'common.name': 'Name',
    'common.description': 'Description',
    'common.price': 'Price',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.actions': 'Actions',
    'common.select': 'Select',
    'common.all': 'All',
    'common.none': 'None',
    'form.required': 'This field is required',
    'form.invalid_email': 'Invalid email address',
    'form.invalid_phone': 'Invalid phone number',
    'form.password_mismatch': 'Passwords do not match',
    'form.min_length': 'Minimum {{count}} characters required',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.forgot_password': 'Forgot Password?',
    'auth.no_account': "Don't have an account?",
    'auth.has_account': 'Already have an account?',
    'auth.sign_up': 'Sign Up',
    'auth.sign_in': 'Sign In',
    'auth.remember_me': 'Remember me',
    'booking.guest_details': 'Guest Details',
    'booking.first_name': 'First Name',
    'booking.last_name': 'Last Name',
    'booking.email': 'Email',
    'booking.phone': 'Phone',
    'booking.address': 'Address',
    'booking.city': 'City',
    'booking.country': 'Country',
    'booking.special_requests': 'Special Requests',
    'booking.review': 'Review Booking',
    'booking.confirm': 'Confirm Booking',
    'booking.confirmation': 'Booking Confirmed',
    'booking.confirmation_code': 'Confirmation Code',
    'booking.total': 'Total',
    'booking.subtotal': 'Subtotal',
    'booking.taxes': 'Taxes',
    'booking.fees': 'Fees',
    'booking.discount': 'Discount',
    'booking.nights': 'Nights',
    'booking.room_rate': 'Room Rate',
    'status.available': 'Available',
    'status.occupied': 'Occupied',
    'status.reserved': 'Reserved',
    'status.cleaning': 'Cleaning',
    'status.dirty': 'Dirty',
    'status.maintenance': 'Maintenance',
    'status.out_of_service': 'Out of Service',
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.checked_in': 'Checked In',
    'status.checked_out': 'Checked Out',
    'status.cancelled': 'Cancelled',
    'status.no_show': 'No Show',
    'status.hk_pending': 'Pending',
    'status.hk_in_progress': 'In Progress',
    'status.hk_inspection': 'Inspection',
    'status.hk_completed': 'Completed',
    'status.mt_open': 'Open',
    'status.mt_in_progress': 'In Progress',
    'status.mt_resolved': 'Resolved',
    'status.mt_closed': 'Closed',
    'status.published': 'Published',
    'status.draft': 'Draft',
    'status.archived': 'Archived',
  },
  id: {
    'nav.stay': 'MENGINAP',
    'nav.dine': 'MAKAN',
    'nav.wellness': 'KESEHATAN',
    'nav.experiences': 'PENGALAMAN',
    'nav.property': 'PROPERTI',
    'nav.offers': 'PAKET',
    'nav.journal': 'JURNAL',
    'nav.reserve': 'PESAN',
    'nav.account': 'AKUN',
    'nav.login': 'MASUK',
    'nav.register': 'DAFTAR',
    'hero.headline': 'CARA LEBIH TENANG UNTUK TIBA',
    'hero.subheadline': 'Suasana santai pribadi yang dibentuk oleh arsitektur, alam, dan waktu.',
    'hero.reserve': 'PESAN PENGINAPAN ANDA',
    'hero.explore': 'JELAJAHI PROPERTI',
    'reservation.arrival': 'KEDATANGAN',
    'reservation.departure': 'KEBERANGKATAN',
    'reservation.guests': 'TAMU',
    'reservation.rooms': 'KAMAR',
    'reservation.promo': 'KODE PROMO',
    'reservation.check': 'CEK KETERSEDIAAN',
    'rooms.from': 'Mulai dari',
    'rooms.per_night': '/ malam',
    'rooms.view': 'Lihat Detail',
    'rooms.book': 'Pesan Sekarang',
    'rooms.size': 'Ukuran',
    'rooms.capacity': 'Tamu',
    'rooms.bed': 'Tempat Tidur',
    'rooms.amenities': 'Fasilitas',
    'dining.hours': 'Jam Buka',
    'dining.cuisine': 'Masakan',
    'dining.reserve': 'Pesan Meja',
    'wellness.spa': 'Spa',
    'wellness.treatments': 'Perawatan',
    'wellness.yoga': 'Yoga',
    'wellness.programs': 'Program Kesehatan',
    'experiences.duration': 'Durasi',
    'experiences.price': 'Harga',
    'experiences.book': 'Pesan Pengalaman',
    'offers.valid': 'Berlaku',
    'offers.terms': 'Syarat & Ketentuan',
    'offers.book': 'Pesan Paket',
    'journal.read': 'Baca Selengkapnya',
    'journal.categories': 'Kategori',
    'gallery.filter': 'Filter',
    'footer.contact': 'Kontak',
    'footer.address': 'Alamat',
    'footer.policies': 'Kebijakan',
    'footer.social': 'Ikuti Kami',
    'footer.rights': 'Hak cipta dilindungi.',
    'admin.dashboard': 'Dasbor',
    'admin.overview': 'Ringkasan',
    'admin.occupancy': 'Hunian',
    'admin.adr': 'ADR',
    'admin.revpar': 'RevPAR',
    'admin.revenue': 'Pendapatan',
    'admin.arrivals': 'Kedatangan',
    'admin.departures': 'Keberangkatan',
    'admin.available': 'Kamar Tersedia',
    'admin.occupied': 'Kamar Terisi',
    'admin.reservations': 'Reservasi',
    'admin.guests': 'Tamu',
    'admin.rooms': 'Kamar',
    'admin.room_types': 'Tipe Kamar',
    'admin.availability': 'Ketersediaan',
    'admin.amenities': 'Fasilitas',
    'admin.housekeeping': 'Housekeeping',
    'admin.maintenance': 'Maintenance',
    'admin.rates': 'Tarif',
    'admin.offers': 'Penawaran',
    'admin.transactions': 'Transaksi',
    'admin.reports': 'Laporan',
    'admin.dining': 'Dining',
    'admin.wellness': 'Wellness',
    'admin.experiences': 'Experiences',
    'admin.website': 'Website',
    'admin.homepage': 'Beranda',
    'admin.pages': 'Halaman',
    'admin.gallery': 'Galeri',
    'admin.journal': 'Jurnal',
    'admin.navigation': 'Navigasi',
    'admin.localization': 'Lokalisasi',
    'admin.administration': 'Administrasi',
    'admin.users': 'Pengguna',
    'admin.roles': 'Peran',
    'admin.permissions': 'Izin',
    'admin.settings': 'Pengaturan',
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.create': 'Buat',
    'common.search': 'Cari',
    'common.filter': 'Filter',
    'common.status': 'Status',
    'common.loading': 'Memuat...',
    'common.error': 'Kesalahan',
    'common.success': 'Berhasil',
    'common.confirm': 'Konfirmasi',
    'common.yes': 'Ya',
    'common.no': 'Tidak',
    'common.close': 'Tutup',
    'common.add': 'Tambah',
    'common.remove': 'Hapus',
    'common.upload': 'Unggah',
    'common.download': 'Unduh',
    'common.preview': 'Pratinjau',
    'common.publish': 'Publikasikan',
    'common.archive': 'Arsipkan',
    'common.draft': 'Draf',
    'common.name': 'Nama',
    'common.description': 'Deskripsi',
    'common.price': 'Harga',
    'common.date': 'Tanggal',
    'common.time': 'Waktu',
    'common.actions': 'Aksi',
    'common.select': 'Pilih',
    'common.all': 'Semua',
    'common.none': 'Tidak Ada',
    'form.required': 'Kolom ini wajib diisi',
    'form.invalid_email': 'Alamat email tidak valid',
    'form.invalid_phone': 'Nomor telepon tidak valid',
    'form.password_mismatch': 'Kata sandi tidak cocok',
    'form.min_length': 'Minimal {{count}} karakter diperlukan',
    'auth.login': 'Masuk',
    'auth.register': 'Daftar',
    'auth.logout': 'Keluar',
    'auth.email': 'Email',
    'auth.password': 'Kata Sandi',
    'auth.confirm_password': 'Konfirmasi Kata Sandi',
    'auth.forgot_password': 'Lupa Kata Sandi?',
    'auth.no_account': 'Belum punya akun?',
    'auth.has_account': 'Sudah punya akun?',
    'auth.sign_up': 'Daftar',
    'auth.sign_in': 'Masuk',
    'auth.remember_me': 'Ingat saya',
    'booking.guest_details': 'Detail Tamu',
    'booking.first_name': 'Nama Depan',
    'booking.last_name': 'Nama Belakang',
    'booking.email': 'Email',
    'booking.phone': 'Telepon',
    'booking.address': 'Alamat',
    'booking.city': 'Kota',
    'booking.country': 'Negara',
    'booking.special_requests': 'Permintaan Khusus',
    'booking.review': 'Tinjau Pemesanan',
    'booking.confirm': 'Konfirmasi Pemesanan',
    'booking.confirmation': 'Pemesanan Dikonfirmasi',
    'booking.confirmation_code': 'Kode Konfirmasi',
    'booking.total': 'Total',
    'booking.subtotal': 'Subtotal',
    'booking.taxes': 'Pajak',
    'booking.fees': 'Biaya',
    'booking.discount': 'Diskon',
    'booking.nights': 'Malam',
    'booking.room_rate': 'Tarif Kamar',
    'status.available': 'Tersedia',
    'status.occupied': 'Terisi',
    'status.reserved': 'Dipesan',
    'status.cleaning': 'Dibersihkan',
    'status.dirty': 'Kotor',
    'status.maintenance': 'Maintenance',
    'status.out_of_service': 'Tidak Aktif',
    'status.pending': 'Menunggu',
    'status.confirmed': 'Dikonfirmasi',
    'status.checked_in': 'Check-in',
    'status.checked_out': 'Check-out',
    'status.cancelled': 'Dibatalkan',
    'status.no_show': 'Tidak Datang',
    'status.hk_pending': 'Menunggu',
    'status.hk_in_progress': 'Sedang Dikerjakan',
    'status.hk_inspection': 'Inspeksi',
    'status.hk_completed': 'Selesai',
    'status.mt_open': 'Terbuka',
    'status.mt_in_progress': 'Sedang Dikerjakan',
    'status.mt_resolved': 'Terselesaikan',
    'status.mt_closed': 'Ditutup',
    'status.published': 'Dipublikasikan',
    'status.draft': 'Draf',
    'status.archived': 'Diarsipkan',
  },
}

export function I18nProvider({
  children,
  initialLocale = APP_CONFIG.defaultLocale,
  initialCurrency = APP_CONFIG.defaultCurrency,
}: {
  children: ReactNode
  initialLocale?: Locale
  initialCurrency?: Currency
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale
      const savedCurrency = localStorage.getItem('currency') as Currency
      if (savedLocale && APP_CONFIG.supportedLocales.includes(savedLocale)) {
        setLocaleState(savedLocale)
      }
      if (savedCurrency && APP_CONFIG.supportedCurrencies.includes(savedCurrency)) {
        setCurrencyState(savedCurrency)
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
    }
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', newCurrency)
    }
  }

  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = translations[locale][key] || translations[APP_CONFIG.defaultLocale][key] || key
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
      })
    }
    return translation
  }

  return (
    <I18nContext.Provider value={{ locale, currency, setLocale, setCurrency, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function getTranslation(locale: Locale, key: string, params?: Record<string, string | number>) {
  let translation = translations[locale][key] || translations[APP_CONFIG.defaultLocale][key] || key
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      translation = translation.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    })
  }
  return translation
}