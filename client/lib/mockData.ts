import type { Room, AdminUser, SyncLog, AppSettings, CalendarEvent, Booking, Campaign } from '../types';

export const rooms: Room[] = [
  {
    roomId: 1,
    title: 'Aqua Retreat',
    category: 'villa',
    type: 'Villa',
    description: 'Set across nearly 2 acres of serene landscape, this exclusive 3-bedroom luxury villa offers a private swimming pool, expansive landscaped gardens, and breathtaking lake views.',
    price: 25000,
    capacity: 6,
    totalRooms: 1,
    sizeSqFt: 3500,
    amenities: ['Wifi', 'Air Conditioning', 'Private swimming pool', 'Expansive landscaped gardens', 'Lake views'],
    featured: true,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'],
    airbnbIcalUrl: 'https://www.airbnb.com/calendar/ical/1',
    airbnbCalendarUrl: 'https://www.airbnb.com/rooms/1',
    syncEnabled: true,
    syncStatus: 'ok',
    lastSyncedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    roomId: 2,
    title: 'Villanova',
    category: 'villa',
    type: 'Villa',
    description: 'Experience refined luxury in this stunning 5-bedroom villa featuring elegant architecture, private pool, and lush greenery.',
    price: 35000,
    capacity: 10,
    totalRooms: 1,
    sizeSqFt: 5000,
    amenities: ['Wifi', 'Air Conditioning', 'Private swimming pool', 'Gym', 'Lounge Area'],
    featured: true,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'],
    airbnbIcalUrl: '',
    airbnbCalendarUrl: '',
    syncEnabled: false,
  },
];

export const users: AdminUser[] = [
  {
    id: 'usr_1',
    name: 'Kalesha Baig',
    email: 'kalesha@larosa.com',
    role: 'admin',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'usr_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  },
];

export const syncLogs: SyncLog[] = [
  {
    id: 'log_1',
    roomId: 1,
    success: true,
    startedAt: new Date(Date.now() - 3650000).toISOString(),
    finishedAt: new Date(Date.now() - 3600000).toISOString(),
    eventsImported: 4,
    eventsRemoved: 1,
  },
  {
    id: 'log_2',
    roomId: 2,
    success: false,
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    finishedAt: new Date(Date.now() - 7180000).toISOString(),
    errorMessage: 'Failed to fetch Airbnb ICS feed. Network timeout.',
  },
];

export const settings: AppSettings = {
  property: {
    propertyName: 'Larosa Luxury Villas',
    address: 'Lakefront Estate, Kerala, India',
    timezone: 'Asia/Kolkata',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    supportEmail: 'support@larosavillas.com',
    supportPhone: '+91 98765 43210',
  },
  billing: {
    currency: 'INR',
    razorpayKeyId: 'rzp_live_kalesha123',
    webhookUrl: 'https://api.larosavillas.com/webhooks/razorpay',
    webhookSecretSet: true,
  },
  security: {
    requireAdmin2fa: true,
    sessionTimeoutMinutes: 60,
  },
  notifications: {
    msg91AuthKeySet: true,
    msg91FlowId: 'flow_larosa_booking',
    adminAlertPhones: ['+919876543210'],
    emailAlertsEnabled: true,
    smsAlertsEnabled: true,
  },
  channel: {
    statusMessage: 'Villas are synced with Airbnb calendar feeds.',
    syncEnabled: true,
  },
};

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'evt_1',
    roomId: 1,
    start: '2026-08-05',
    end: '2026-08-10',
    title: 'John Doe Booking',
    source: 'website',
    blocked: false,
    bookingId: 'bk_1',
  },
  {
    id: 'evt_2',
    roomId: 1,
    start: '2026-08-15',
    end: '2026-08-18',
    title: 'Airbnb Sync Reservation',
    source: 'airbnb',
    blocked: false,
    bookingId: 'bk_2',
  },
  {
    id: 'evt_3',
    roomId: 1,
    start: '2026-08-22',
    end: '2026-08-25',
    title: 'Owner Blockout',
    source: 'manual',
    blocked: true,
  },
];

export const bookings: Booking[] = [
  {
    id: 'bk_1',
    roomId: 1,
    roomTitle: 'Aqua Retreat',
    roomType: 'Villa',
    guestName: 'John Doe',
    guestEmail: 'john@doe.com',
    guestPhone: '+91 99999 88888',
    specialRequests: 'Need high chair and pool toys.',
    checkIn: '2026-08-05',
    checkOut: '2026-08-10',
    nights: 5,
    guests: 4,
    pricePerNight: 25000,
    totalPrice: 125000,
    razorpayOrderId: 'order_john123',
    razorpayPaymentId: 'pay_john123',
    source: 'website',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'bk_2',
    roomId: 1,
    roomTitle: 'Aqua Retreat',
    roomType: 'Villa',
    guestName: 'Airbnb Guest',
    guestEmail: 'guest-airbnb@airbnb.com',
    guestPhone: '+1 555 123 4567',
    checkIn: '2026-08-15',
    checkOut: '2026-08-18',
    nights: 3,
    guests: 2,
    pricePerNight: 25000,
    totalPrice: 75000,
    source: 'airbnb',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
];

export const dashboardStats = {
  totalRevenue: 200000,
  occupancyRate: 72,
  confirmed: 4,
  pending: 2,
  cancelled: 1,
};

export const revenueByMonth = [
  { month: '2026-02', total: 120000, label: 'Feb' },
  { month: '2026-03', total: 150000, label: 'Mar' },
  { month: '2026-04', total: 180000, label: 'Apr' },
  { month: '2026-05', total: 220000, label: 'May' },
  { month: '2026-06', total: 210000, label: 'Jun' },
  { month: '2026-07', total: 250000, label: 'Jul' },
];

export const currentAdmin = {
  name: 'Kalesha Baig',
  email: 'kalesha@larosa.in',
};

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notifications: AppNotification[] = [
  {
    id: 'not_1',
    title: 'New Booking Request',
    message: 'John Doe requested a booking for Aqua Retreat.',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'not_2',
    title: 'Sync Status Warning',
    message: 'Airbnb calendar sync failed for Villanova.',
    read: true,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
];

export const campaigns: Campaign[] = [
  {
    campaignId: 'c1',
    name: 'Monsoon Offer',
    type: 'showcase',
    status: 'active',
    headline: 'Flat 20% off on Monsoons',
    message: 'Book any villa for 3 nights or more and get a complimentary wine bottle and dinner package.',
    ctaLabel: 'Book now',
    ctaUrl: '/villas',
    accent: 'gold',
    priority: 2,
    dismissible: true,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  },
  {
    campaignId: 'c2',
    name: 'Independence Day',
    type: 'strip',
    status: 'draft',
    headline: 'Celebrate Independence Day Weekend',
    message: 'Special rates starting from ₹15,000/night.',
    ctaLabel: 'View Rates',
    ctaUrl: '/villas',
    accent: 'navy',
    priority: 1,
    dismissible: false,
  }
];

