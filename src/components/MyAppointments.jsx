import React, { useState } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { ROOM_LOGOS } from '../utils/rooms';

const STATUS = {
  approved: { label: 'Approved', classes: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  pending: { label: 'Pending', classes: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  declined: { label: 'Declined', classes: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  cancelled: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'declined', label: 'Declined' },
  { key: 'cancelled', label: 'Cancelled' },
];

function MyAppointments({ appointments, onClose, onAppointmentClick }) {
  const [filter, setFilter] = useState('all');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Newest requests first
  const sorted = [...appointments].sort((a, b) => {
    if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
    return a.date === b.date ? 0 : a.date < b.date ? 1 : -1;
  });

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === 'all' ? sorted.length : sorted.filter(a => a.status === f.key).length;
    return acc;
  }, {});

  const visible = filter === 'all' ? sorted : sorted.filter(a => a.status === filter);
  const pendingCount = counts.pending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">My Requests</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {appointments.length} total{pendingCount > 0 ? ` · ${pendingCount} pending` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 pt-4 flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              {f.label}
              <span className={filter === f.key ? 'text-gray-300' : 'text-gray-400'}> {counts[f.key]}</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">
          {visible.length === 0 ? (
            <div className="text-center py-10">
              <CalendarDays size={32} className="text-gray-200 mx-auto mb-2.5" />
              <p className="text-gray-400 text-sm">
                {filter === 'all' ? 'No requests yet' : `No ${filter} requests`}
              </p>
              <p className="text-gray-300 text-xs mt-1">
                {filter === 'all' ? 'Pick a date on the calendar to get started' : 'Try a different filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {visible.map((appt) => {
                const status = STATUS[appt.status] || STATUS.pending;
                return (
                  <div
                    key={appt._id}
                    onClick={() => {
                      onClose();
                      onAppointmentClick(appt);
                    }}
                    className="bg-white rounded-xl px-3.5 py-3 border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${status.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(appt.date)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-900 tabular-nums">
                        {appt.timeStart} – {appt.timeEnd}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                        {ROOM_LOGOS[appt.room] && (
                          <img src={ROOM_LOGOS[appt.room]} alt="" className="w-4 h-4 rounded object-contain bg-white flex-shrink-0" />
                        )}
                        <span className="truncate">{appt.room}</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1.5">{appt.reason}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAppointments;
