import React from 'react';
import { X, Calendar, Clock, MapPin, FileText } from 'lucide-react';

function MyAppointments({ appointments, onClose, onAppointmentClick }) {
  const statusConfig = {
    approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', label: 'Approved' },
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500', label: 'Pending' },
    declined: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'Declined' }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">My Appointment Requests</h2>
              <p className="text-white/70 text-sm mt-0.5">{appointments.length} request(s)</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-1.5 transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5">
          {appointments.length === 0 ? (
            <div className="text-center py-10">
              <Calendar size={44} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">No requests yet</p>
              <p className="text-gray-300 text-xs mt-1">Book a room to get started</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
              {appointments.map((appt) => {
                const status = statusConfig[appt.status] || statusConfig.pending;
                return (
                  <div
                    key={appt._id}
                    onClick={() => {
                      onClose();
                      onAppointmentClick(appt);
                    }}
                    className="border border-gray-200/80 rounded-xl p-4 hover:border-blue-200 hover:shadow-md cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-blue-500" />
                        <span className="text-sm font-semibold text-gray-900">{appt.room}</span>
                      </div>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {status.label}
                      </span>
                    </div>

                    {/* Time Duration - Prominent */}
                    <div className="flex items-center gap-2 mb-2 bg-gray-50 rounded-lg px-3 py-2">
                      <Clock size={14} className="text-blue-500" />
                      <span className="text-sm font-bold text-gray-800">{appt.timeStart} - {appt.timeEnd}</span>
                      <span className="text-gray-300 mx-1">|</span>
                      <Calendar size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{formatDate(appt.date)}</span>
                    </div>

                    {/* Reason Preview */}
                    <div className="flex items-start gap-2">
                      <FileText size={12} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{appt.reason}</p>
                    </div>
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
