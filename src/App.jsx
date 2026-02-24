import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RoomCalendar from './components/RoomCalendar';
import BookingModal from './components/BookingModal';
import AppointmentDetailModal from './components/AppointmentDetailModal';
import MyAppointments from './components/MyAppointments';
import { getApprovedAppointments, getMyAppointments } from './api';
import { getDeviceId } from './utils/deviceId';

const ROOMS = ['AB Conference Room', 'Malasakit Lobby'];

function App() {
  const [appointments, setAppointments] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showMyAppointments, setShowMyAppointments] = useState(false);
  const [loading, setLoading] = useState(true);
  const deviceId = getDeviceId();

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
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/40 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-blue-900 text-sm font-semibold mb-1">How to book a room</p>
              <p className="text-blue-700/80 text-sm leading-relaxed">
                Select a date on any room calendar below to book an appointment. 
                Approved bookings are shown in green with their full time duration. Click any booking to see details.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm mt-4">Loading appointments...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {ROOMS.map(room => (
              <RoomCalendar
                key={room}
                room={room}
                appointments={appointments.filter(a => a.room === room)}
                onBookRoom={(date) => handleBookRoom(room, date)}
                onAppointmentClick={handleAppointmentClick}
              />
            ))}
          </div>
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
