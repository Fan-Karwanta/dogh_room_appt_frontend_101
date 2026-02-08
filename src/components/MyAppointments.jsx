import React from 'react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';

function MyAppointments({ appointments, onClose, onAppointmentClick }) {
  const statusColors = {
    approved: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    declined: 'bg-red-100 text-red-800 border-red-200'
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">My Appointment Requests</h2>
              <p className="text-blue-100 text-sm">{appointments.length} request(s)</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">You haven't made any appointment requests yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  onClick={() => {
                    onClose();
                    onAppointmentClick(appt);
                  }}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{appt.room}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${statusColors[appt.status]}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(appt.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {appt.timeStart} - {appt.timeEnd}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-1">{appt.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAppointments;
