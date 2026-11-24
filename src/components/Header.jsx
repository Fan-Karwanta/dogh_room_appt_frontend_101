import React from 'react';
import { ClipboardList } from 'lucide-react';

function Header({ onMyAppointments, pendingCount = 0 }) {
  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/dogh_logo.png"
              alt="DOGH Logo"
              className="h-10 w-10 object-contain flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-[15px] font-semibold text-gray-900 leading-tight truncate">
                DOGH Room Appointment
              </h1>
              <p className="text-xs text-gray-400 leading-tight mt-0.5 truncate">
                Davao Occidental General Hospital
              </p>
            </div>
          </div>

          <button
            onClick={onMyAppointments}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors flex-shrink-0"
          >
            <ClipboardList size={15} className="text-gray-400" />
            <span className="hidden sm:inline">My Requests</span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
