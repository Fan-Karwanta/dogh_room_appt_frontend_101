import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import Header from './components/Header';
import RoomCalendar from './components/RoomCalendar';
import BookingModal from './components/BookingModal';
import AppointmentDetailModal from './components/AppointmentDetailModal';
import MyAppointments from './components/MyAppointments';
import { getApprovedAppointments, getMyAppointments } from './api';
import { getDeviceId } from './utils/deviceId';
import { ROOMS, ROOM_LOGOS, ROOM_TAB_ACTIVE } from './utils/rooms';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showMyAppointments, setShowMyAppointments] = useState(false);
  const [activeRoom, setActiveRoom] = useState(ROOMS[0]);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(() => {
    try {
      return localStorage.getItem('dogh-hide-booking-banner') !== '1';
    } catch {
      return true;
    }
  });
  const deviceId = getDeviceId();

  const dismissBanner = () => {
    setShowBanner(false);
    try {
      localStorage.setItem('dogh-hide-booking-banner', '1');
    } catch {}
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const [approvedRes, myRes] = await Promise.all([
        getApprovedAppointments(),
        getMyAppointments(deviceId)
      ]);
      setAppointments(approvedRes.data);
      setMyAppointments(myRes.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBookRoom = (room, date) => {
    setSelectedRoom(room);
    setSelectedDate(date);
    setShowBooking(true);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
    fetchAppointments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/dogh_background.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]"></div>
      </div>
      <div className="relative z-10">
      <Header
        onMyAppointments={() => setShowMyAppointments(true)}
        pendingCount={myAppointments.filter(a => a.status === 'pending').length}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        {showBanner && (
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
            <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900/80 leading-relaxed flex-1">
              Pick a date on the calendar to request a booking.{' '}
              <span className="font-medium text-green-700">Green</span> slots are approved —{' '}
              <span className="font-medium text-amber-700">amber</span> ones are your requests waiting for approval.
            </p>
            <button
              onClick={dismissBanner}
              aria-label="Dismiss"
              className="text-blue-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-100 transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Room Switcher */}
        <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 gap-1 mb-4">
          {ROOMS.map(room => (
            <button
              key={room}
              onClick={() => setActiveRoom(room)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeRoom === room
                  ? ROOM_TAB_ACTIVE[room]
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <img
                src={ROOM_LOGOS[room]}
                alt=""
                className={`w-5 h-5 rounded-md object-contain bg-white ${activeRoom === room ? 'ring-1 ring-white/40' : 'ring-1 ring-gray-200'}`}
              />
              {room}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="h-5 w-36 bg-gray-100 rounded-md animate-pulse" />
              <div className="flex items-center gap-1">
                <div className="h-7 w-14 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-7 w-7 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-7 w-7 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="p-4 grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-12 sm:h-20 bg-gray-50 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <RoomCalendar
            room={activeRoom}
            appointments={appointments.filter(a => a.room === activeRoom)}
            pendingAppointments={myAppointments.filter(a => a.room === activeRoom && a.status === 'pending')}
            onBookRoom={(date) => handleBookRoom(activeRoom, date)}
            onAppointmentClick={handleAppointmentClick}
          />
        )}
      </main>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal
          room={selectedRoom}
          date={selectedDate}
          deviceId={deviceId}
          onClose={() => setShowBooking(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          deviceId={deviceId}
          onRefresh={fetchAppointments}
        />
      )}

      {/* My Appointments Modal */}
      {showMyAppointments && (
        <MyAppointments
          appointments={myAppointments}
          onClose={() => setShowMyAppointments(false)}
          onAppointmentClick={handleAppointmentClick}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} Davao Occidental General Hospital. All rights reserved.
          </p>
          <p className="text-gray-300/70 text-xs mt-1">DOGH Room Appointment System</p>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;
