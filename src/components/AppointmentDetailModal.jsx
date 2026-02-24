import React from 'react';
import { X, Calendar, Clock, User, FileText, MapPin } from 'lucide-react';

function AppointmentDetailModal({ appointment, onClose }) {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const statusConfig = {
    approved: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', dot: 'bg-green-500' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-500' },
    declined: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', dot: 'bg-red-500' }
  };

  const status = statusConfig[appointment.status] || statusConfig.pending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-lg">Appointment Details</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-1.5 transition-all">
              <X size={18} />
            </button>
          </div>
          {/* Prominent Time Duration Display */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium">Duration</p>
                <p className="text-white font-bold text-lg tracking-tight">
                  {appointment.timeStart} — {appointment.timeEnd}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold capitalize border ${status.bg} ${status.text} ${status.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
              {appointment.status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <MapPin size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Room</p>
                <p className="text-sm text-gray-900 font-medium">{appointment.room}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <User size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Booked By</p>
                <p className="text-sm text-gray-900 font-medium">{appointment.bookerName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Date</p>
                <p className="text-sm text-gray-900 font-medium">{formatDate(appointment.date)}</p>
              </div>
            </div>

            {/* Reason - Prominent Display */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-blue-600" />
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Reason / Purpose</p>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{appointment.reason}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailModal;
