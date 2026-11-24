import React, { useState } from 'react';
import { X, Ban, Loader2 } from 'lucide-react';
import { cancelMyAppointment } from '../api';
import { ROOM_LOGOS } from '../utils/rooms';

const STATUS = {
  approved: { label: 'Approved', classes: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  pending: { label: 'Pending', classes: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  declined: { label: 'Declined', classes: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  cancelled: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
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

const formatDuration = (start, end) => {
  const mins = timeToMinutes(end) - timeToMinutes(start);
  if (mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return h === 1 ? '1 hour' : `${h} hours`;
  return `${m} min`;
};

function AppointmentDetailModal({ appointment, onClose, deviceId, onRefresh }) {
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  };

  const status = STATUS[appointment.status] || STATUS.pending;
  const isOwner = deviceId && appointment.deviceId === deviceId;
  const duration = formatDuration(appointment.timeStart, appointment.timeEnd);
  const logo = ROOM_LOGOS[appointment.room];

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
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {logo && (
              <img
                src={logo}
                alt=""
                className="w-10 h-10 rounded-lg object-contain bg-white ring-1 ring-gray-200 flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">{appointment.room}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(appointment.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${status.classes}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
              {status.label}
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* Time */}
          <div className="mb-5">
            <p className="text-2xl font-semibold tracking-tight text-gray-900 tabular-nums">
              {appointment.timeStart} – {appointment.timeEnd}
            </p>
            {duration && (
              <p className="text-sm text-gray-400 mt-1">{duration}</p>
            )}
          </div>

          {/* Detail rows */}
          <dl className="border-y border-gray-100 divide-y divide-gray-100 text-sm">
            <div className="flex items-baseline py-2.5">
              <dt className="w-28 flex-shrink-0 text-gray-400">Booked by</dt>
              <dd className="text-gray-800 font-medium truncate">{appointment.bookerName}</dd>
            </div>
            {appointment.createdAt && (
              <div className="flex items-baseline py-2.5">
                <dt className="w-28 flex-shrink-0 text-gray-400">Requested</dt>
                <dd className="text-gray-600">{formatDateTime(appointment.createdAt)}</dd>
              </div>
            )}
          </dl>

          {/* Purpose */}
          <div className="mt-5">
            <p className="text-xs text-gray-400 mb-1.5">Purpose</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{appointment.reason}</p>
          </div>

          {/* Admin notes */}
          {appointment.adminNotes && (
            <div className="mt-4 border-l-2 border-amber-400 pl-3">
              <p className="text-xs text-gray-400 mb-1">Note from admin</p>
              <p className="text-sm text-gray-700 leading-relaxed">{appointment.adminNotes}</p>
            </div>
          )}

          {/* Cancellation details */}
          {appointment.status === 'cancelled' && (appointment.cancelledAt || appointment.cancellationReason) && (
            <div className="mt-4 border-l-2 border-gray-300 pl-3">
              <p className="text-xs text-gray-400 mb-1">
                Cancelled{appointment.cancelledAt ? ` on ${formatDateTime(appointment.cancelledAt)}` : ''}
              </p>
              {appointment.cancellationReason && (
                <p className="text-sm text-gray-600">{appointment.cancellationReason}</p>
              )}
            </div>
          )}

          {/* Cancel flow for own pending requests */}
          {isOwner && appointment.status === 'pending' && !showCancelConfirm && (
            <div className="mt-6">
              <p className="text-xs text-amber-600 mb-3">
                Awaiting admin approval — you can still withdraw this request.
              </p>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm"
              >
                <Ban size={15} />
                Cancel this request
              </button>
            </div>
          )}

          {showCancelConfirm && (
            <div className="mt-6 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-900">Cancel this appointment?</p>
              <p className="text-xs text-gray-500 mt-1">This can't be undone — the request will be withdrawn.</p>
              {cancelError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mt-3">{cancelError}</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {cancelling ? <Loader2 size={15} className="animate-spin" /> : null}
                  Yes, cancel it
                </button>
                <button
                  onClick={() => { setShowCancelConfirm(false); setCancelError(''); }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Keep it
                </button>
              </div>
            </div>
          )}

          {/* Note for owners of decided appointments */}
          {isOwner && (appointment.status === 'approved' || appointment.status === 'declined') && (
            <p className="mt-6 text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
              Need to change or cancel this appointment? Please contact the administrator.
            </p>
          )}

          <button
            onClick={onClose}
            className="w-full mt-6 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailModal;
