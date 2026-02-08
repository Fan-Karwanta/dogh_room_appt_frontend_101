import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function RoomCalendar({ room, appointments, onBookRoom, onAppointmentClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const getDateStr = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getAppointmentsForDate = (dateStr) => {
    return appointments.filter(a => a.date === dateStr);
  };

  const isPastDate = (day) => {
    const dateStr = getDateStr(day);
    return dateStr < todayStr;
  };

  const roomIcon = room === 'AB Conference Room' ? '🏢' : '🏥';

  // Build calendar grid
  const calendarDays = [];
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, isCurrentMonth: true });
  }
  // Next month days
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    calendarDays.push({ day: d, isCurrentMonth: false });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Room Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{roomIcon}</span>
            <div>
              <h2 className="text-white font-bold text-lg">{room}</h2>
              <div className="flex items-center gap-1 text-blue-100 text-sm">
                <MapPin size={14} />
                <span>DOGH Building</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Available
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <button
          onClick={prevMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={goToToday}
            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium"
          >
            Today
          </button>
        </div>
        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((item, idx) => {
            const dateStr = item.isCurrentMonth ? getDateStr(item.day) : null;
            const dayAppointments = dateStr ? getAppointmentsForDate(dateStr) : [];
            const isToday = dateStr === todayStr;
            const isPast = item.isCurrentMonth && isPastDate(item.day);

            return (
              <div
                key={idx}
                onClick={() => {
                  if (item.isCurrentMonth && !isPast) {
                    onBookRoom(dateStr);
                  }
                }}
                className={`
                  calendar-day relative
                  ${!item.isCurrentMonth ? 'other-month' : ''}
                  ${isToday ? 'today' : ''}
                  ${isPast ? 'opacity-50 cursor-not-allowed' : ''}
                  ${!item.isCurrentMonth ? 'cursor-default' : ''}
                `}
              >
                <span className={`text-xs font-medium ${isToday ? 'bg-blue-600 text-white px-1.5 py-0.5 rounded-full' : ''}`}>
                  {item.day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayAppointments.slice(0, 2).map((appt, i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick(appt);
                      }}
                      className="appointment-dot approved cursor-pointer hover:opacity-80"
                      title={`${appt.timeStart} - ${appt.bookerName}`}
                    >
                      <Clock size={10} className="inline mr-0.5" />
                      {appt.timeStart}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayAppointments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-100 border border-green-300 rounded"></span>
          Approved Booking
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></span>
          Today
        </div>
      </div>
    </div>
  );
}

export default RoomCalendar;
