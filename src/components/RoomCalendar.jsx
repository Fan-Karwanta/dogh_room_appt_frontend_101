import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, CalendarDays, FileText, User, Plus } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ROOM_THEMES = {
  'AB Conference Room': {
    gradient: 'from-blue-600 to-indigo-700',
    todayBg: 'bg-blue-600',
    todayBgHalf: 'bg-blue-50/50',
    todayBorder: 'border-blue-200/60',
    selectedBg: 'bg-blue-50',
    selectedBorder: 'border-blue-300',
    selectedText: 'text-blue-700',
    btnBg: 'bg-blue-50',
    btnText: 'text-blue-600',
    btnHover: 'hover:bg-blue-100',
    btnBorder: 'border-blue-200/50',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
    accentBg: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    bookBtnBg: 'bg-blue-50',
    bookBtnText: 'text-blue-700',
    bookBtnHover: 'hover:bg-blue-100',
    bookBtnBorder: 'border-blue-200/50',
    hoverText: 'text-blue-600',
    legendBg: 'bg-blue-600',
  },
  'Malasakit Lobby': {
    gradient: 'from-teal-600 to-cyan-700',
    todayBg: 'bg-teal-600',
    todayBgHalf: 'bg-teal-50/50',
    todayBorder: 'border-teal-200/60',
    selectedBg: 'bg-teal-50',
    selectedBorder: 'border-teal-300',
    selectedText: 'text-teal-700',
    btnBg: 'bg-teal-50',
    btnText: 'text-teal-600',
    btnHover: 'hover:bg-teal-100',
    btnBorder: 'border-teal-200/50',
    iconBg: 'bg-teal-50',
    iconText: 'text-teal-600',
    accentBg: 'bg-teal-600',
    accentHover: 'hover:bg-teal-700',
    bookBtnBg: 'bg-teal-50',
    bookBtnText: 'text-teal-700',
    bookBtnHover: 'hover:bg-teal-100',
    bookBtnBorder: 'border-teal-200/50',
    hoverText: 'text-teal-600',
    legendBg: 'bg-teal-600',
  }
};

function RoomCalendar({ room, appointments, onBookRoom, onAppointmentClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
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

  const theme = ROOM_THEMES[room] || ROOM_THEMES['AB Conference Room'];

  // Build calendar grid
  const calendarDays = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, isCurrentMonth: true });
  }
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    calendarDays.push({ day: d, isCurrentMonth: false });
  }

  const selectedDateStr = selectedDay ? getDateStr(selectedDay) : null;
  const selectedAppointments = selectedDateStr ? getAppointmentsForDate(selectedDateStr) : [];
  const totalApproved = appointments.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/80 overflow-hidden">
      {/* Room Header */}
      <div className={`bg-gradient-to-r ${theme.gradient} px-6 py-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <MapPin size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">{room}</h2>
              <p className="text-white/70 text-sm">DOGH Building</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20">
              <CalendarDays size={13} />
              {totalApproved} booking{totalApproved !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Calendar Section */}
        <div className="flex-1">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-gray-50/50">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm border border-transparent hover:border-gray-200"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                {MONTHS[month]} {year}
              </h3>
              <button
                onClick={goToToday}
                className={`text-xs px-3 py-1.5 ${theme.btnBg} ${theme.btnText} rounded-lg ${theme.btnHover} transition-colors font-semibold border ${theme.btnBorder}`}
              >
                Today
              </button>
            </div>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm border border-transparent hover:border-gray-200"
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-3 sm:p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((day, i) => (
                <div key={day} className={`text-center text-[11px] font-bold uppercase tracking-wider py-2 ${i === 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.map((item, idx) => {
                const dateStr = item.isCurrentMonth ? getDateStr(item.day) : null;
                const dayAppointments = dateStr ? getAppointmentsForDate(dateStr) : [];
                const isToday = dateStr === todayStr;
                const isPast = item.isCurrentMonth && isPastDate(item.day);
                const isSunday = idx % 7 === 0;
                const isSelected = item.isCurrentMonth && selectedDay === item.day;
                const hasAppointments = dayAppointments.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (item.isCurrentMonth) {
                        setSelectedDay(item.day);
                      }
                    }}
                    className={`
                      relative min-h-[85px] sm:min-h-[95px] p-1.5 rounded-lg cursor-pointer transition-all duration-200 border
                      ${!item.isCurrentMonth
                        ? 'bg-gray-50/50 border-transparent opacity-40 cursor-default'
                        : isPast
                          ? 'bg-white border-gray-100 opacity-50 cursor-not-allowed'
                          : isSelected
                            ? `${theme.selectedBg} ${theme.selectedBorder} shadow-sm`
                            : isToday
                              ? `${theme.todayBgHalf} ${theme.todayBorder}`
                              : hasAppointments
                                ? 'bg-green-50/40 border-green-200/50 hover:border-green-300'
                                : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`
                        text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-lg
                        ${isToday
                          ? `${theme.todayBg} text-white shadow-md`
                          : isSelected
                            ? `${theme.selectedText} font-bold`
                            : item.isCurrentMonth
                              ? isSunday ? 'text-red-400' : 'text-gray-700'
                              : 'text-gray-300'
                        }
                      `}>
                        {item.day}
                      </span>
                      {hasAppointments && (
                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-md">
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {dayAppointments.slice(0, 2).map((appt, i) => (
                        <div
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick(appt);
                          }}
                          className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md bg-green-100/80 text-green-800 font-medium cursor-pointer hover:bg-green-200/80 transition-colors truncate border-l-2 border-green-500 leading-tight"
                          title={`${appt.timeStart} - ${appt.timeEnd} | ${appt.reason}`}
                        >
                          <span className="font-semibold">{appt.timeStart}-{appt.timeEnd}</span>
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-[10px] text-green-600 font-semibold pl-1">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                    {/* Book button on hover for future dates */}
                    {item.isCurrentMonth && !isPast && dayAppointments.length === 0 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookRoom(dateStr);
                        }}
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-white/60 rounded-lg"
                      >
                        <span className={`text-[10px] font-semibold ${theme.hoverText} flex items-center gap-0.5`}>
                          <Plus size={10} /> Book
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-5 text-xs text-gray-400 bg-gray-50/50">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-green-100 border border-green-300 rounded-md"></span>
              <span>Approved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 ${theme.legendBg} rounded-md shadow-sm`}></span>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-300">Click a date to see details</span>
            </div>
          </div>
        </div>

        {/* Side Panel - Selected Date Details */}
        <div className="lg:w-[320px] border-t lg:border-t-0 lg:border-l border-gray-100 bg-gray-50/30">
          <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} lg:bg-none lg:bg-gray-50 border-b border-gray-100`}>
            <h3 className="font-bold text-white lg:text-gray-800 text-sm">
              {selectedDay
                ? new Date(year, month, selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                : 'Select a Date'
              }
            </h3>
            <p className="text-white/70 lg:text-gray-400 text-xs mt-0.5">
              {selectedDay
                ? `${selectedAppointments.length} booking${selectedAppointments.length !== 1 ? 's' : ''}`
                : 'Click on a date to view details'
              }
            </p>
          </div>

          <div className="p-4 space-y-2.5 max-h-[400px] overflow-y-auto">
            {!selectedDay && (
              <div className="text-center py-8">
                <CalendarDays size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No date selected</p>
                <p className="text-gray-300 text-xs mt-1">Click a date on the calendar</p>
              </div>
            )}

            {selectedDay && selectedAppointments.length === 0 && (
              <div className="text-center py-8">
                <CalendarDays size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-medium">No appointments</p>
                <p className="text-gray-300 text-xs mt-1">This day is available</p>
                {!isPastDate(selectedDay) && (
                  <button
                    onClick={() => onBookRoom(getDateStr(selectedDay))}
                    className={`mt-4 inline-flex items-center gap-1.5 px-4 py-2 ${theme.accentBg} text-white text-sm font-medium rounded-lg ${theme.accentHover} transition-colors shadow-sm`}
                  >
                    <Plus size={14} />
                    Book This Date
                  </button>
                )}
              </div>
            )}

            {selectedAppointments.map((appt) => (
              <div
                key={appt._id}
                onClick={() => onAppointmentClick(appt)}
                className="bg-white rounded-xl p-3.5 border border-gray-200/80 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Approved</span>
                </div>

                {/* Time Duration */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 ${theme.iconBg} rounded-lg`}>
                    <Clock size={14} className={theme.iconText} />
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {appt.timeStart} - {appt.timeEnd}
                  </span>
                </div>

                {/* Booker */}
                <div className="flex items-center gap-2 mb-1.5">
                  <User size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600 font-medium truncate">{appt.bookerName}</span>
                </div>

                {/* Reason Preview */}
                <div className="flex items-start gap-2">
                  <FileText size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{appt.reason}</p>
                </div>
              </div>
            ))}

            {selectedDay && selectedAppointments.length > 0 && !isPastDate(selectedDay) && (
              <button
                onClick={() => onBookRoom(getDateStr(selectedDay))}
                className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 ${theme.bookBtnBg} ${theme.bookBtnText} text-sm font-semibold rounded-xl ${theme.bookBtnHover} transition-colors border ${theme.bookBtnBorder}`}
              >
                <Plus size={14} />
                Book This Date
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCalendar;
