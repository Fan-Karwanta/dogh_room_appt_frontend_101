import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, Loader2, AlertCircle, Mail } from 'lucide-react';
import { getAvailableSlots, createAppointment, checkWeeklyLimit } from '../api';

// Generate time options in 30-minute intervals from 8:00 AM to 5:00 PM
const generateTimeOptions = () => {
  const options = [];
  for (let h = 8; h <= 17; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 17 && m > 0) break;
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const period = h >= 12 ? 'PM' : 'AM';
      const label = `${hour12}:${String(m).padStart(2, '0')} ${period}`;
      options.push({ label, minutes: h * 60 + m });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

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

function BookingModal({ room, date, deviceId, onClose, onSuccess }) {
  const [reason, setReason] = useState('');
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [weeklyLimit, setWeeklyLimit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [slotsRes, limitRes] = await Promise.all([
          getAvailableSlots(room, date),
          checkWeeklyLimit(deviceId)
        ]);
        setBookedRanges(slotsRes.data.bookedRanges || []);
        setWeeklyLimit(limitRes.data);
      } catch (err) {
        setError('Failed to load booking data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [room, date, deviceId]);

  // Filter end time options to only show times after the selected start time
  const getEndTimeOptions = () => {
    if (!timeStart) return [];
    const startMinutes = timeToMinutes(timeStart);
    return TIME_OPTIONS.filter(opt => opt.minutes > startMinutes);
  };

  // Check if selected time overlaps with any booked range
  const checkOverlap = () => {
    if (!timeStart || !timeEnd) return null;
    const newStart = timeToMinutes(timeStart);
    const newEnd = timeToMinutes(timeEnd);
    return bookedRanges.find(range => {
      const existStart = timeToMinutes(range.start);
      const existEnd = timeToMinutes(range.end);
      return newStart < existEnd && newEnd > existStart;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!reason.trim() || !bookerName.trim() || !bookerEmail.trim() || !timeStart || !timeEnd) {
      setError('Please fill in all fields and select a time range.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookerEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    const overlap = checkOverlap();
    if (overlap) {
      setError(`Selected time overlaps with an approved booking (${overlap.start} - ${overlap.end}).`);
      return;
    }

    if (weeklyLimit && weeklyLimit.remaining <= 0) {
      setError('You have reached the maximum of 3 appointment requests per week.');
      return;
    }

    try {
      setSubmitting(true);
      await createAppointment({
        room,
        reason: reason.trim(),
        bookerName: bookerName.trim(),
        bookerEmail: bookerEmail.trim(),
        date,
        timeStart,
        timeEnd,
        deviceId
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">Book Appointment</h2>
              <p className="text-blue-100 text-sm">{room}</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted!</h3>
              <p className="text-gray-500 text-sm">Your appointment request has been submitted and is pending approval.</p>
            </div>
          ) : (
            <>
              {/* Date Display */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 mb-4">
                <Calendar size={18} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{formatDate(date)}</span>
              </div>

              {/* Weekly Limit Warning */}
              {weeklyLimit && weeklyLimit.remaining <= 1 && weeklyLimit.remaining > 0 && (
                <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4">
                  <AlertCircle size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800 text-sm">
                    You have <strong>{weeklyLimit.remaining}</strong> request(s) remaining this week.
                  </p>
                </div>
              )}

              {weeklyLimit && weeklyLimit.remaining <= 0 && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                  <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">
                    You have reached the maximum of <strong>3 requests per week</strong>. Please try again next week.
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                  <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Booker Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <User size={14} />
                      Name of Booker
                    </label>
                    <input
                      type="text"
                      value={bookerName}
                      onChange={e => setBookerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <Mail size={14} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={bookerEmail}
                      onChange={e => setBookerEmail(e.target.value)}
                      placeholder="Enter your email (for status notifications)"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      required
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <FileText size={14} />
                      Appointment Reason
                    </label>
                    <textarea
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="Briefly describe the purpose of your booking"
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                      required
                    />
                  </div>

                  {/* Custom Time Range */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock size={14} />
                      Select Time Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">From</label>
                        <select
                          value={timeStart}
                          onChange={e => {
                            setTimeStart(e.target.value);
                            setTimeEnd('');
                          }}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                          required
                        >
                          <option value="">Start time</option>
                          {TIME_OPTIONS.map(opt => (
                            <option key={opt.label} value={opt.label}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">To</label>
                        <select
                          value={timeEnd}
                          onChange={e => setTimeEnd(e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                          disabled={!timeStart}
                          required
                        >
                          <option value="">End time</option>
                          {getEndTimeOptions().map(opt => (
                            <option key={opt.label} value={opt.label}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Overlap warning */}
                    {timeStart && timeEnd && checkOverlap() && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
                        <AlertCircle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-red-700 text-xs">
                          This time overlaps with: <strong>{checkOverlap().start} - {checkOverlap().end}</strong> ({checkOverlap().bookerName})
                        </p>
                      </div>
                    )}

                    {/* Booked ranges display */}
                    {bookedRanges.length > 0 && (
                      <div className="mt-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Already booked times:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {bookedRanges.map((range, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-medium">
                              <Clock size={10} />
                              {range.start} - {range.end}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting || (weeklyLimit && weeklyLimit.remaining <= 0)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Appointment Request'
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
