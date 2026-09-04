import { UserRole, Permission } from '@/types'

export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  SUPER_ADMIN: ['HOTEL_ADMIN', 'FRONT_DESK', 'HOUSEKEEPING', 'REVENUE_MANAGER', 'CONTENT_MANAGER'],
  HOTEL_ADMIN: ['FRONT_DESK', 'HOUSEKEEPING', 'REVENUE_MANAGER', 'CONTENT_MANAGER'],
  FRONT_DESK: [],
  HOUSEKEEPING: [],
  REVENUE_MANAGER: [],
  CONTENT_MANAGER: [],
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'rooms.read','rooms.create','rooms.update','rooms.delete',
    'reservations.read','reservations.create','reservations.update','reservations.cancel',
    'guests.read','guests.create','guests.update','guests.delete',
    'content.read','content.create','content.update','content.delete','content.publish',
    'users.read','users.create','users.update','users.delete',
    'revenue.read','revenue.manage',
    'housekeeping.read','housekeeping.manage',
    'maintenance.read','maintenance.manage',
    'settings.read','settings.manage',
  ],
  HOTEL_ADMIN: [
    'rooms.read','rooms.create','rooms.update','rooms.delete',
    'reservations.read','reservations.create','reservations.update','reservations.cancel',
    'guests.read','guests.create','guests.update',
    'content.read','content.create','content.update','content.delete','content.publish',
    'users.read','users.create','users.update','users.delete',
    'revenue.read','revenue.manage',
    'housekeeping.read','housekeeping.manage',
    'maintenance.read','maintenance.manage',
    'settings.read',
  ],
  FRONT_DESK: ['rooms.read','reservations.read','reservations.create','reservations.update','reservations.cancel','guests.read','guests.create','guests.update'],
  HOUSEKEEPING: ['rooms.read','rooms.update','housekeeping.read','housekeeping.manage'],
  REVENUE_MANAGER: ['rooms.read','revenue.read','revenue.manage','reservations.read'],
  CONTENT_MANAGER: ['rooms.read','content.read','content.create','content.update','content.delete','content.publish','settings.read','settings.manage'],
}

export function getEffectivePermissions(role: UserRole): Permission[] {
  const direct = ROLE_PERMISSIONS[role] || []
  const inherited = (ROLE_HIERARCHY[role] || []).flatMap(r => ROLE_PERMISSIONS[r] || [])
  return [...new Set([...direct, ...inherited])] as Permission[]
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === 'SUPER_ADMIN') return true
  return getEffectivePermissions(role).includes(permission)
}

export function canManageRole(actorRole: UserRole, targetRole: UserRole): boolean {
  if (actorRole === 'SUPER_ADMIN') return true
  if (targetRole === 'SUPER_ADMIN') return false
  if (actorRole === 'HOTEL_ADMIN') {
    // HOTEL_ADMIN can manage all except SUPER_ADMIN
    return ['HOTEL_ADMIN','FRONT_DESK','HOUSEKEEPING','REVENUE_MANAGER','CONTENT_MANAGER'].includes(targetRole)
  }
  return false
}

export function canAccessAdminRoute(role: UserRole, path: string): boolean {
  if (role === 'SUPER_ADMIN') return true
  if (role === 'HOTEL_ADMIN') return true // sees all except Administration write (guarded separately)
  // content manager can only access website + experience
  if (role === 'CONTENT_MANAGER') {
    return path.startsWith('/admin/website') || path.startsWith('/admin/dining') || path.startsWith('/admin/wellness') || path.startsWith('/admin/experiences') || path === '/admin'
  }
  if (role === 'FRONT_DESK') {
    return ['/admin','/admin/reservations','/admin/arrivals','/admin/departures','/admin/guests','/admin/guest-requests','/admin/rooms','/admin/availability'].some(p=> path===p || path.startsWith(p+'/'))
  }
  if (role === 'HOUSEKEEPING') {
    return ['/admin','/admin/rooms','/admin/availability','/admin/housekeeping','/admin/maintenance'].some(p=> path===p || path.startsWith(p+'/'))
  }
  if (role === 'REVENUE_MANAGER') {
    return ['/admin','/admin/rates','/admin/offers','/admin/transactions','/admin/reports','/admin/rooms','/admin/room-types'].some(p=> path===p || path.startsWith(p+'/'))
  }
  return false
}

export function isAdministrationRoute(path: string): boolean {
  return path.startsWith('/admin/administration')
}

export function canEditFloatingWAPhone(role: UserRole): boolean {
  return ['SUPER_ADMIN','HOTEL_ADMIN','CONTENT_MANAGER'].includes(role)
}
