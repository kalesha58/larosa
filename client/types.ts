export type RoomCategory = 'villa' | 'room';
export type RoomStatus = 'active' | 'hidden';
export type UserRole = 'admin' | 'user';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type BookingSource = 'website' | 'airbnb' | 'manual';
export type SyncStatus = 'idle' | 'syncing' | 'ok' | 'error';

export interface Room {
  roomId: number;
  title: string;
  category: RoomCategory;
  type: string;
  description: string;
  price: number;
  capacity: number;
  totalRooms: number;
  sizeSqFt?: number;
  amenities: string[];
  featured: boolean;
  status: RoomStatus;
  images: string[];
  airbnbIcalUrl?: string;
  airbnbCalendarUrl?: string;
  syncEnabled?: boolean;
  syncStatus?: SyncStatus;
  lastSyncedAt?: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface SyncLog {
  id: string;
  roomId: number;
  success: boolean;
  startedAt: string;
  finishedAt: string;
  eventsImported?: number;
  eventsRemoved?: number;
  errorMessage?: string;
}

export interface AppSettings {
  property: {
    propertyName: string;
    address: string;
    timezone: string;
    checkInTime: string;
    checkOutTime: string;
    supportEmail: string;
    supportPhone: string;
  };
  billing: {
    currency: string;
    razorpayKeyId: string;
    webhookUrl: string;
    webhookSecretSet: boolean;
  };
  security: {
    requireAdmin2fa: boolean;
    sessionTimeoutMinutes: number;
  };
  notifications: {
    msg91AuthKeySet: boolean;
    msg91FlowId: string;
    adminAlertPhones: string[];
    emailAlertsEnabled: boolean;
    smsAlertsEnabled: boolean;
  };
  channel: {
    statusMessage: string;
    syncEnabled: boolean;
  };
}

export interface CalendarEvent {
  id: string;
  roomId: number;
  start: string;
  end: string;
  title: string;
  source: 'website' | 'airbnb' | 'manual';
  blocked: boolean;
  bookingId?: string;
}

export interface Booking {
  id: string;
  roomId: number;
  roomTitle: string;
  roomType: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: number;
  totalPrice: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpayRefundId?: string;
  source: BookingSource;
  status: BookingStatus;
  createdAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export type CampaignType = 'strip' | 'showcase';
export type CampaignStatus = 'draft' | 'active' | 'archived';
export type CampaignAccent = 'gold' | 'navy' | 'neutral';

export interface Campaign {
  campaignId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  headline: string;
  message?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  accent: CampaignAccent;
  priority: number;
  dismissible: boolean;
  imageUrl?: string;
}

