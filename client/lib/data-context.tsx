import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Room, Property, Booking, CustomerBooking, AdminUser, Review, SupportTicket, ReportedItem } from '../types';
import {
  rooms as seedRooms,
  properties as seedProperties,
  bookings as seedBookings,
  customerBookings as seedCustomerBookings,
  users as seedUsers,
  reviews as seedReviews,
  supportTickets as seedSupportTickets,
  reportedItems as seedReportedItems,
} from './mockData';

interface DataContextType {
  rooms: Room[];
  properties: Property[];
  bookings: Booking[];
  customerBookings: CustomerBooking[];
  users: AdminUser[];
  reviews: Review[];
  supportTickets: SupportTicket[];
  reportedItems: ReportedItem[];
  addRoom: (room: Omit<Room, 'roomId'> & { roomId?: number }) => Room;
  updateRoom: (roomId: number, updates: Partial<Room>) => void;
  deleteRoom: (roomId: number) => void;
  approveRoom: (roomId: number) => void;
  rejectRoom: (roomId: number, reason: string) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  respondToBooking: (bookingId: string, status: 'confirmed' | 'cancelled') => void;
  submitHostVerification: (userId: string, govtId: any, bankDetails: any, propertyProof: any) => void;
  approveHost: (userId: string) => void;
  rejectHost: (userId: string, reason?: string) => void;
  addUser: (user: AdminUser) => void;
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, role: 'admin' | 'customer' | 'host') => void;
  suspendUser: (userId: string, suspend: boolean) => void;
  suspendRoom: (roomId: number, suspend: boolean) => void;
  deleteReview: (reviewId: string) => void;
  replyToReview: (reviewId: string, replyText: string) => void;
  resolveSupportTicket: (ticketId: string) => void;
  replyToSupportTicket: (ticketId: string, message: string) => void;
  moderateReportedItem: (reportId: string, action: 'suspend' | 'dismiss') => void;
  updateBookingDispute: (bookingId: string, disputeStatus: 'none' | 'open' | 'resolved', disputeNotes?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(seedRooms.map(r => ({ ...r, approvedByAdmin: r.approvedByAdmin ?? true })));
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [customerBookings, setCustomerBookings] = useState<CustomerBooking[]>(seedCustomerBookings);
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(seedSupportTickets);
  const [reportedItems, setReportedItems] = useState<ReportedItem[]>(seedReportedItems);
  
  // Extend mock users with verification flags
  const [users, setUsers] = useState<AdminUser[]>(
    seedUsers.map((u) => ({
      ...u,
      isEmailVerified: u.role === 'admin' ? true : false,
      isPhoneVerified: u.role === 'admin' ? true : false,
      hostVerificationStatus: u.hostVerificationStatus ?? (u.role === 'admin' ? 'verified' : 'none'),
      isSuspended: u.isSuspended ?? false,
    }))
  );

  const addRoom = (newRoomData: Omit<Room, 'roomId'> & { roomId?: number }): Room => {
    const nextRoomId = newRoomData.roomId ?? Math.max(0, ...rooms.map((r) => r.roomId)) + 1;
    const room: Room = {
      ...newRoomData,
      roomId: nextRoomId,
      status: newRoomData.status ?? 'hidden',
      approvedByAdmin: newRoomData.approvedByAdmin ?? false,
    };
    setRooms((prev) => [...prev, room]);
    return room;
  };

  const updateRoom = (roomId: number, updates: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId === roomId) {
          const updated = { ...r, ...updates };
          // If already live and approved, sync to guest-facing Property
          if (updated.status === 'active' && updated.approvedByAdmin) {
            syncRoomToProperty(updated);
          } else if (updated.status === 'hidden') {
            // Remove from properties if hidden
            setProperties((prevProps) => prevProps.filter((p) => p.id !== 'prop_' + roomId));
          }
          return updated;
        }
        return r;
      })
    );
  };

  const deleteRoom = (roomId: number) => {
    setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
    setProperties((prev) => prev.filter((p) => p.id !== 'prop_' + roomId));
  };

  const syncRoomToProperty = (room: Room) => {
    const propId = 'prop_' + room.roomId;
    setProperties((prevProps) => {
      const exists = prevProps.some((p) => p.id === propId);
      const mapped: Property = {
        id: propId,
        title: room.title,
        location: 'Kumarakom, Kerala',
        city: 'Kumarakom',
        state: 'Kerala',
        description: room.description,
        shortDescription: room.description.substring(0, 60) + '...',
        pricePerNight: room.price,
        weekendPricePerNight: room.price + 5000,
        deposit: room.deposit ?? room.price * 2,
        platformFeePercent: 10,
        rating: 4.8,
        reviewCount: 0,
        capacity: room.capacity,
        bedrooms: room.category === 'villa' ? 3 : 1,
        bathrooms: room.category === 'villa' ? 3 : 1,
        sizeSqFt: room.sizeSqFt ?? 3000,
        images: room.images.length > 0 ? room.images : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'],
        amenities: room.amenities,
        houseRules: ['No smoking indoors', 'No pets allowed without approval', 'Quiet hours: 10 PM – 8 AM'],
        bookingType: room.bookingType === 'instant' ? 'instant' : 'request',
        featured: room.featured,
        category: room.category === 'villa' ? 'villa' : 'farmhouse',
        caretakerName: 'Rajan Nair',
        caretakerPhone: '+91 94456 78901',
        securityDeposit: room.deposit ?? room.price,
        checkInTime: '14:00',
        checkOutTime: '11:00',
        minNights: 2,
        purposes: ['Family Vacation', 'Weekend Getaway'],
      };

      if (exists) {
        return prevProps.map((p) => (p.id === propId ? mapped : p));
      } else {
        return [...prevProps, mapped];
      }
    });
  };

  const approveRoom = (roomId: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId === roomId) {
          const approved = { ...r, approvedByAdmin: true, status: 'active' as const };
          syncRoomToProperty(approved);
          return approved;
        }
        return r;
      })
    );
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const nextId = 'bk_' + Date.now();
    const newBooking: Booking = {
      ...bookingData,
      id: nextId,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);

    // Also sync to customerBookings
    const customerBooking: CustomerBooking = {
      id: 'cbk_' + Date.now(),
      propertyId: 'prop_' + bookingData.roomId,
      propertyTitle: bookingData.roomTitle,
      propertyImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      propertyLocation: 'Kumarakom, Kerala',
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      nights: bookingData.nights,
      guests: bookingData.guests,
      bedrooms: bookingData.roomType === 'Villa' ? 3 : 1,
      purpose: bookingData.specialRequests ? 'Special Event' : 'Vacation',
      pricePerNight: bookingData.pricePerNight,
      subtotal: bookingData.totalPrice,
      deposit: (bookingData.deposit ?? bookingData.pricePerNight * 2),
      platformFee: Math.round(bookingData.totalPrice * 0.1),
      taxes: Math.round(bookingData.totalPrice * 0.05),
      totalPrice: bookingData.totalPrice + Math.round(bookingData.totalPrice * 0.15) + (bookingData.deposit ?? bookingData.pricePerNight * 2),
      paidAmount: bookingData.status === 'confirmed' ? bookingData.totalPrice : (bookingData.deposit ?? bookingData.pricePerNight * 2),
      remainingAmount: bookingData.status === 'confirmed' ? 0 : bookingData.totalPrice,
      paymentMethod: 'UPI',
      status: bookingData.status === 'confirmed' ? 'upcoming' : 'upcoming',
      paymentStatus: bookingData.status === 'confirmed' ? 'paid' : 'partial',
      createdAt: new Date().toISOString(),
      specialRequests: bookingData.specialRequests,
      bookingTimeline: [
        {
          id: 'tl_init_' + Date.now(),
          title: 'Booking Placed',
          description: bookingData.bookingType === 'instant' ? 'Booking confirmed instantly' : 'Pending host confirmation',
          timestamp: new Date().toISOString(),
          type: 'created',
        },
      ],
    };
    setCustomerBookings((prev) => [customerBooking, ...prev]);
    return newBooking;
  };

  const respondToBooking = (bookingId: string, status: 'confirmed' | 'cancelled') => {
    // Update admin booking view
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );

    // Update customer booking view
    setCustomerBookings((prev) =>
      prev.map((cb) => {
        if (cb.propertyId.includes(bookingId) || cb.id.includes(bookingId) || cb.specialRequests?.includes(bookingId) || true) {
          if (cb.status === 'upcoming') {
            const nextTimeline = [...cb.bookingTimeline, {
              id: 'tl_resp_' + Date.now(),
              title: status === 'confirmed' ? 'Booking Confirmed' : 'Booking Rejected',
              description: status === 'confirmed' ? 'The property host confirmed your stay.' : 'The host rejected your booking request.',
              timestamp: new Date().toISOString(),
              type: status === 'confirmed' ? 'confirmed' as const : 'cancelled' as const,
            }];
            return {
              ...cb,
              status: status === 'confirmed' ? 'upcoming' as const : 'cancelled' as const,
              paymentStatus: status === 'confirmed' ? 'partial' as const : 'refunded' as const,
              bookingTimeline: nextTimeline,
            };
          }
        }
        return cb;
      })
    );
  };

  const submitHostVerification = (userId: string, govtId: any, bankDetails: any, propertyProof: any) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            govtId,
            bankDetails,
            propertyProof,
            hostVerificationStatus: 'pending',
          };
        }
        return u;
      })
    );
  };

  const approveHost = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            isEmailVerified: true,
            isPhoneVerified: true,
            hostVerificationStatus: 'verified',
          };
        }
        return u;
      })
    );
  };

  const rejectRoom = (roomId: number, reason: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId === roomId) {
          return { ...r, approvedByAdmin: false, rejectionReason: reason, status: 'hidden' as const };
        }
        return r;
      })
    );
  };

  const rejectHost = (userId: string, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            hostVerificationStatus: 'rejected',
            rejectionReason: reason,
          };
        }
        return u;
      })
    );
  };

  const suspendUser = (userId: string, suspend: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isSuspended: suspend } : u))
    );
  };

  const suspendRoom = (roomId: number, suspend: boolean) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId === roomId) {
          const updated = { ...r, status: (suspend ? 'hidden' : 'active') as 'active' | 'hidden' };
          if (updated.status === 'active' && updated.approvedByAdmin) {
            syncRoomToProperty(updated);
          } else if (updated.status === 'hidden') {
            setProperties((prevProps) => prevProps.filter((p) => p.id !== 'prop_' + roomId));
          }
          return updated;
        }
        return r;
      })
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return { ...r, comment: r.comment + `\n\nResponse from Larosa Admin: ${replyText}` };
        }
        return r;
      })
    );
  };

  const resolveSupportTicket = (ticketId: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' as const } : t))
    );
  };

  const replyToSupportTicket = (ticketId: string, message: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            messages: [
              ...t.messages,
              { sender: 'Larosa Admin', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ],
          };
        }
        return t;
      })
    );
  };

  const moderateReportedItem = (reportId: string, action: 'suspend' | 'dismiss') => {
    setReportedItems((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          if (action === 'suspend') {
            if (rep.type === 'property') {
              suspendRoom(Number(rep.targetId.replace('prop_', '')), true);
            } else if (rep.type === 'user') {
              suspendUser(rep.targetId, true);
            }
          }
          return { ...rep, status: 'resolved' as const };
        }
        return rep;
      })
    );
  };

  const updateBookingDispute = (bookingId: string, disputeStatus: 'none' | 'open' | 'resolved', disputeNotes?: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, disputeStatus, disputeNotes } : b))
    );
  };

  const addUser = (newUser: AdminUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const updateUserRole = (userId: string, role: 'admin' | 'customer' | 'host') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  };

  return (
    <DataContext.Provider
      value={{
        rooms,
        properties,
        bookings,
        customerBookings,
        users,
        reviews,
        supportTickets,
        reportedItems,
        addRoom,
        updateRoom,
        deleteRoom,
        approveRoom,
        rejectRoom,
        createBooking,
        respondToBooking,
        submitHostVerification,
        approveHost,
        rejectHost,
        addUser,
        deleteUser,
        updateUserRole,
        suspendUser,
        suspendRoom,
        deleteReview,
        replyToReview,
        resolveSupportTicket,
        replyToSupportTicket,
        moderateReportedItem,
        updateBookingDispute,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
