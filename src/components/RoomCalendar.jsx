import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CalendarDays, User, Plus, X } from 'lucide-react';
import { ROOM_LOGOS } from '../utils/rooms';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ROOM_THEMES = {
  'AB Conference Room': {
    accentBg: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    accentText: 'text-blue-600',
    selectedBg: 'bg-blue-50/60',
    selectedRing: 'ring-blue-500',
    softBg: 'bg-blue-50',
    softBorder: 'border-blue-200',
    softHover: 'hover:bg-blue-100',
    softText: 'text-blue-700',
  },
  'Malasakit Lobby': {
    accentBg: 'bg-red-600',
    accentHover: 'hover:bg-red-700',
    accentText: 'text-red-600',
    selectedBg: 'bg-red-50/60',
    selectedRing: 'ring-red-500',
    softBg: 'bg-red-50',
    softBorder: 'border-red-200',
    softHover: 'hover:bg-red-100',
    softText: 'text-red-700',
  }
};

const timeToMinutes = (timeStr) => {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

function RoomCalendar({ room, appointments, pendingAppointments = [], onBookRoom, onAppointmentClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const getDateStr = (day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const isPastDate = (day) => getDateStr(day) < todayStr;

  const getItemsForDate = (dateStr) => {
    const approved = appointments
      .filter(a => a.date === dateStr)
      .map(a => ({ ...a, isPending: false }));
    const pending = pendingAppointments
      .filter(a => a.date === dateStr)
      .map(a => ({ ...a, isPending: true }));
    return [...approved, ...pending].sort(
      (a, b) => timeToMinutes(a.timeStart) - timeToMinutes(b.timeStart)
    );
  };

  const upcoming = [
    ...appointments.map(a => ({ ...a, isPending: false })),
    ...pendingAppointments.map(a => ({ ...a, isPending: true }))
  ]
    .filter(a => a.date >= todayStr)
    .sort((a, b) =>
      a.date === b.date
        ? timeToMinutes(a.timeStart) - timeToMinutes(b.timeStart)
        : a.date < b.date ? -1 : 1
    )
    .slice(0, 8);

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

  const theme = ROOM_THEMES[room] || ROOM_THEMES['AB Conference Room'];

  const calendarDays = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, isCurrentMonth: true });
  }
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const remaining = totalCells - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    calendarDays.push({ day: d, isCurrentMonth: false });
  }

  const selectedDateStr = selectedDay ? getDateStr(selectedDay) : null;
  const selectedItems = selectedDateStr ? getItemsForDate(selectedDateStr) : [];

  const chipClasses = (isPending) =>
    isPending
      ? 'bg-amber-50 border-amber-400 text-amber-800 hover:bg-amber-100'
      : 'bg-green-50 border-green-500 text-green-800 hover:bg-green-100';

  const dotClasses = (isPending) => (isPending ? 'bg-amber-400' : 'bg-green-500');

  const statusChip = (isPending) =>
    isPending
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-green-50 text-green-700 border-green-200';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Calendar Section */}
        <div className="flex-1 min-w-0 relative">
          {/* Room watermark */}
          <img
            src={ROOM_LOGOS[room]}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 sm:w-80 opacity-[0.07] mix-blend-multiply"
          />
          <div className="relative">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 tracking-tight">
              {MONTHS[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={goToToday}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg ${theme.accentText} ${theme.softHover} transition-colors mr-1`}
              >
                Today
              </button>
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next month"
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 px-2 sm:px-4 pt-3">
            {DAYS.map((day, i) => (
              <div
                key={day}
                className={`text-center text-[11px] font-medium uppercase tracking-wide pb-1.5 ${i === 0 || i === 6 ? 'text-gray-300' : 'text-gray-400'}`}
              >
                <span className="sm:hidden">{day[0]}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 px-2 sm:px-4 pb-4">
            {calendarDays.map((item, idx) => {
              const dateStr = item.isCurrentMonth ? getDateStr(item.day) : null;
              const items = dateStr ? getItemsForDate(dateStr) : [];
              const isToday = dateStr === todayStr;
              const isPast = item.isCurrentMonth && isPastDate(item.day);
              const isWeekend = idx % 7 === 0 || idx % 7 === 6;
              const isSelected = item.isCurrentMonth && selectedDay === item.day;
              const hasItems = items.length > 0;

              return (
                <div
                  key={idx}
                  role={item.isCurrentMonth ? 'button' : undefined}
                  tabIndex={item.isCurrentMonth ? 0 : -1}
                  onClick={() => {
                    if (item.isCurrentMonth) {
                      setSelectedDay(isSelected ? null : item.day);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (item.isCurrentMonth && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      setSelectedDay(isSelected ? null : item.day);
                    }
                  }}
                  className={`
                    group relative min-h-[52px] sm:min-h-[92px] p-1 sm:p-1.5 rounded-lg border text-left transition-colors
                    ${!item.isCurrentMonth
                      ? 'border-transparent opacity-30 cursor-default'
                      : isSelected
                        ? `cursor-pointer ${theme.selectedBg} ring-1 ring-inset ${theme.selectedRing} border-transparent`
                        : `cursor-pointer border-gray-100 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 ${theme.selectedRing}`
                    }
                    ${isPast && item.isCurrentMonth ? 'opacity-60' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`
                      text-[11px] sm:text-xs font-medium inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md
                      ${isToday
                        ? `${theme.accentBg} text-white font-semibold`
                        : isSelected
                          ? `${theme.accentText} font-semibold`
                          : !item.isCurrentMonth
                            ? 'text-gray-300'
                            : isPast || isWeekend
                              ? 'text-gray-400'
                              : 'text-gray-700'
                      }
                    `}>
                      {item.day}
                    </span>
                    {hasItems && !isSelected && (
                      <span className="text-[10px] font-medium text-gray-400 tabular-nums">
                        {items.length}
                      </span>
                    )}
                  </div>

                  {/* Mobile: dots only — details live in the side panel */}
                  <div className="mt-0.5 flex flex-wrap items-center gap-0.5 px-0.5 sm:hidden">
                    {items.slice(0, 3).map((appt) => (
                      <span key={appt._id} className={`w-1.5 h-1.5 rounded-full ${dotClasses(appt.isPending)}`} />
                    ))}
                    {items.length > 3 && (
                      <span className="text-[9px] leading-none text-gray-400 font-medium">
                        +{items.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Desktop: time chips */}
                  <div className="space-y-0.5 hidden sm:block">
                    {items.slice(0, 2).map((appt) => (
                      <div
                        key={appt._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentClick(appt);
                        }}
                        title={`${appt.timeStart} - ${appt.timeEnd} | ${appt.reason}`}
                        className={`text-[10px] leading-tight px-1.5 py-0.5 rounded border-l-2 truncate cursor-pointer transition-colors font-medium ${chipClasses(appt.isPending)}`}
                      >
                        {appt.timeStart}
                      </div>
                    ))}
                    {items.length > 2 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDay(item.day);
                        }}
                        className="text-[10px] text-gray-400 hover:text-gray-600 font-medium pl-1 cursor-pointer"
                      >
                        +{items.length - 2} more
                      </div>
                    )}
                  </div>

                  {/* Book affordance */}
                  {item.isCurrentMonth && !isPast && !hasItems && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookRoom(dateStr);
                      }}
                      className="absolute inset-0 hidden sm:flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-white/70 cursor-pointer"
                    >
                      <span className={`text-[11px] font-semibold ${theme.accentText} flex items-center gap-0.5`}>
                        <Plus size={11} /> Book
                      </span>
                    </div>
                  )}
                  {item.isCurrentMonth && !isPast && hasItems && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookRoom(dateStr);
                      }}
                      title="Book this date"
                      className={`absolute bottom-1 right-1 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block ${theme.accentText} ${theme.softHover}`}
                    >
                      <Plus size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-green-500"></span>
              Approved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
              Your pending request
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${theme.accentBg}`}></span>
              Today
            </span>
          </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:w-80 xl:w-[340px] border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {selectedDay
                  ? new Date(year, month, selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Upcoming'
                }
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedDay
                  ? `${selectedItems.length} booking${selectedItems.length !== 1 ? 's' : ''}`
                  : upcoming.length > 0
                    ? `Next scheduled for ${room}`
                    : `No bookings yet for ${room}`
                }
              </p>
            </div>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                aria-label="Back to upcoming"
                title="Back to upcoming"
                className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="p-3 space-y-1.5 overflow-y-auto max-h-[420px] flex-1">
            {/* Upcoming bookings when no date is selected */}
            {!selectedDay && (
              upcoming.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <CalendarDays size={32} className="text-gray-200 mx-auto mb-2.5" />
                  <p className="text-gray-400 text-sm">Nothing scheduled</p>
                  <p className="text-gray-300 text-xs mt-1">Pick a future date to make a request</p>
                </div>
              ) : (
                upcoming.map((appt) => {
                  const d = new Date(appt.date + 'T00:00:00');
                  return (
                    <div
                      key={appt._id}
                      onClick={() => onAppointmentClick(appt)}
                      className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-9 text-center flex-shrink-0">
                        <div className="text-[10px] font-semibold uppercase text-gray-400 leading-none">
                          {MONTHS_SHORT[d.getMonth()]}
                        </div>
                        <div className="text-lg font-semibold text-gray-800 leading-tight">
                          {d.getDate()}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClasses(appt.isPending)}`}></span>
                          <span className="text-xs font-semibold text-gray-800 truncate">
                            {appt.timeStart} – {appt.timeEnd}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{appt.reason}</p>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {/* Selected day details */}
            {selectedDay && (
              <>
                {selectedItems.length === 0 && (
                  <div className="text-center py-8 px-4">
                    <CalendarDays size={32} className="text-gray-200 mx-auto mb-2.5" />
                    <p className="text-gray-500 text-sm font-medium">Nothing booked</p>
                    <p className="text-gray-300 text-xs mt-1">
                      {isPastDate(selectedDay) ? 'This date has passed' : 'This day is wide open'}
                    </p>
                  </div>
                )}

                {selectedItems.map((appt) => (
                  <div
                    key={appt._id}
                    onClick={() => onAppointmentClick(appt)}
                    className="bg-white rounded-xl p-3.5 border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${statusChip(appt.isPending)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotClasses(appt.isPending)}`}></span>
                        {appt.isPending ? 'Pending' : 'Approved'}
                      </span>
                      <span className="text-xs font-semibold text-gray-800 tabular-nums flex items-center gap-1">
                        <Clock size={11} className="text-gray-400" />
                        {appt.timeStart} – {appt.timeEnd}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <User size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-600 font-medium truncate">{appt.bookerName}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed pl-[18px]">{appt.reason}</p>
                  </div>
                ))}

                {!isPastDate(selectedDay) && (
                  <button
                    onClick={() => onBookRoom(getDateStr(selectedDay))}
                    className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors border ${
                      selectedItems.length === 0
                        ? `${theme.accentBg} text-white ${theme.accentHover} border-transparent`
                        : `${theme.softBg} ${theme.softText} ${theme.softHover} ${theme.softBorder}`
                    }`}
                  >
                    <Plus size={14} />
                    Book this date
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCalendar;
