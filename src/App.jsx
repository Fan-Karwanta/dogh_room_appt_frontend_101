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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/dogh_background.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/85"></div>
      </div>
      <div className="relative z-10">
      <Header
        onMyAppointments={() => setShowMyAppointments(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>How to book:</strong> Click on any date in the calendar below to book a room. 
            You can make up to <strong>3 appointment requests per week</strong>. 
            Approved appointments are shown in green on the calendar.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      <footer className="bg-white/90 border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Davao Occidental General Hospital. All rights reserved.</p>
          <p className="mt-1">DOGH Room Appointment System</p>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;
