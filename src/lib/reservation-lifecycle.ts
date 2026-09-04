export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW'

const ALLOWED_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
  CHECKED_IN: ['CHECKED_OUT'],
  CHECKED_OUT: [],
  CANCELLED: [],
  NO_SHOW: [],
}

export function canTransition(from: ReservationStatus, to: ReservationStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) || false
}

export function validateTransition(from: ReservationStatus, to: ReservationStatus, actorRole: string, isCustomer: boolean): { ok: boolean, reason?: string } {
  if (!canTransition(from, to)) {
    return { ok: false, reason: `Transisi ${from} → ${to} tidak diizinkan` }
  }
  // Customer cannot directly set CHECKED_IN/CHECKED_OUT/NO_SHOW, only CANCEL from PENDING/CONFIRMED
  if (isCustomer) {
    if (to === 'CANCELLED' && ['PENDING','CONFIRMED'].includes(from)) return { ok: true }
    return { ok: false, reason: 'Customer hanya bisa cancel dari PENDING/CONFIRMED' }
  }
  // Staff roles: check role permissions
  // FRONT_DESK can do CONFIRMED->CHECKED_IN, CHECKED_IN->CHECKED_OUT, and CANCEL
  // HOUSEKEEPING cannot change reservation status
  if (actorRole === 'HOUSEKEEPING' || actorRole === 'CONTENT_MANAGER') {
    return { ok: false, reason: `Role ${actorRole} tidak boleh ubah status reservasi` }
  }
  return { ok: true }
}
