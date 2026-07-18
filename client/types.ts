// ─── Admin Types ──────────────────────────────────────────
export type RoomCategory = 'villa' | 'room';
export type RoomStatus = 'active' | 'hidden';
export type UserRole = 'admin' | 'customer' | 'host';
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
  hostId?: string;
  deposit?: number;
  bookingType?: 'instant' | 'request' | 'both';
  approvedByAdmin?: boolean;
  bedrooms?: number;
  hasSwimmingPool?: boolean;
  hasLawn?: boolean;
  hasOnPropertyStaff?: boolean;
  cleanlinessScore?: number;
  rejectionReason?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  phone?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  hostVerificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  govtId?: {
    type: string;
    number: string;
    documentUrl?: string;
  };
  bankDetails?: {
    accountHolderName: string;
    bankAccountNumber: string;
    ifscCode: string;
    upiId?: string;
  };
  propertyProof?: {
    ownershipProofUrl?: string;
    addressProofUrl?: string;
  };
  isSuspended?: boolean;
  rejectionReason?: string;
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
  deposit?: number;
  bookingType?: 'instant' | 'request';
  disputeStatus?: 'none' | 'open' | 'resolved';
  disputeNotes?: string;
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

// ─── Customer Types ───────────────────────────────────────

export type PropertyCategory = 'farmhouse' | 'villa' | 'cottage' | 'resort';
export type BookingType = 'instant' | 'request';
export type CustomerBookingStatus = 'upcoming' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'refunded';
export type TimelineEventType = 'created' | 'confirmed' | 'paid' | 'checkin' | 'checkout' | 'cancelled' | 'refunded';
export type NotificationType = 'booking' | 'payment' | 'reminder' | 'offer' | 'system';

export interface PropertyAmenity {
  icon: string;
  label: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  state: string;
  description: string;
  shortDescription: string;
  pricePerNight: number;
  weekendPricePerNight?: number;
  deposit: number;
  platformFeePercent: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  images: string[];
  amenities: string[];
  houseRules: string[];
  bookingType: BookingType;
  featured: boolean;
  category: PropertyCategory;
  caretakerName: string;
  caretakerPhone: string;
  securityDeposit: number;
  checkInTime: string;
  checkOutTime: string;
  minNights: number;
  maxNights?: number;
  purposes: string[];
  lat?: number;
  lng?: number;
}

export interface BookingTimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: TimelineEventType;
}

export interface CustomerBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  bedrooms: number;
  purpose: string;
  pricePerNight: number;
  subtotal: number;
  deposit: number;
  platformFee: number;
  taxes: number;
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: string;
  couponCode?: string;
  couponDiscount?: number;
  status: CustomerBookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  cancelledAt?: string;
  bookingTimeline: BookingTimelineEvent[];
  specialRequests?: string;
}

export interface ReviewAspects {
  cleanliness: number;
  location: number;
  value: number;
  service: number;
}

export interface Review {
  id: string;
  propertyId: string;
  reviewerName: string;
  reviewerInitials: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
  aspects: ReviewAspects;
  stayDuration?: string;
  purpose?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  totalBookings: number;
  favoriteIds: string[];
}

export interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  bookingId?: string;
}

export interface SupportTicket {
  id: string;
  user: string;
  role: 'host' | 'customer';
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
  messages: { sender: string; text: string; time: string }[];
}

export interface ReportedItem {
  id: string;
  type: 'property' | 'user';
  targetId: string;
  targetName: string;
  reason: string;
  reporterName: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}
