import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, MapPin, Ban, Loader2, AlertTriangle, MessageCircle } from 'lucide-react';
import { cancelMyAppointment } from '../api';

function AppointmentDetailModal({ appointment, onClose, deviceId, onRefresh }) {
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  };

  const statusConfig = {
    approved: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', dot: 'bg-green-500', label: 'Approved' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-500', label: 'Pending' },
    declined: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', dot: 'bg-red-500', label: 'Declined' },
    cancelled: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', dot: 'bg-orange-500', label: 'Cancelled' }
  };

  const status = statusConfig[appointment.status] || statusConfig.pending;

  const isOwner = deviceId && appointment.deviceId === deviceId;

  const handleCancel = async () => {
    try {
      setCancelling(true);
      setCancelError('');
      await cancelMyAppointment(appointment._id, deviceId);
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      setCancelError(err.response?.data?.error || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

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
              {status.label}
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

          {/* Cancellation Details (for cancelled appointments) */}
          {appointment.status === 'cancelled' && (
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Ban size={14} className="text-orange-600" />
                <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Cancellation Details</p>
              </div>
              {appointment.cancelledAt && (
                <p className="text-xs text-gray-600 mb-1">
                  <span className="text-gray-400">Cancelled: </span>{formatDateTime(appointment.cancelledAt)}
                </p>
              )}
              {appointment.cancellationReason && (
                <p className="text-xs text-gray-600">
                  <span className="text-gray-400">Reason: </span>{appointment.cancellationReason}
                </p>
              )}
            </div>
          )}

          {/* Admin notes (if any) */}
          {appointment.adminNotes && (
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={14} className="text-amber-600" />
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Admin Notes</p>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{appointment.adminNotes}</p>
            </div>
          )}

          {/* Cancel button for pending appointments owned by this user */}
          {isOwner && appointment.status === 'pending' && !showCancelConfirm && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-orange-50 text-orange-700 py-3 rounded-xl font-semibold hover:bg-orange-100 transition-colors text-sm border border-orange-200"
            >
              <Ban size={16} />
              Cancel This Request
            </button>
          )}

          {/* Cancel confirmation */}
          {showCancelConfirm && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle size={18} />
                <p className="text-sm font-semibold">Cancel this appointment?</p>
              </div>
              <p className="text-xs text-orange-600">This action cannot be undone. The request will be withdrawn.</p>
              {cancelError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{cancelError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {cancelling ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
                  Yes, Cancel
                </button>
                <button
                  onClick={() => { setShowCancelConfirm(false); setCancelError(''); }}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Keep It
                </button>
              </div>
            </div>
          )}

          {/* Info note for approved/declined — contact admin */}
          {isOwner && (appointment.status === 'approved' || appointment.status === 'declined') && (
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <MessageCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Need to cancel or modify this appointment? Please <strong>contact the administrator</strong> for assistance.
              </p>
            </div>
          )}

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
