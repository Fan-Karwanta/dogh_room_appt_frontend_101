import React from 'react';
import { CalendarDays, ClipboardList } from 'lucide-react';

function Header({ onMyAppointments }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="/dogh_logo.png"
              alt="DOGH Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                DOGH Room Appointment
              </h1>
              <p className="text-xs text-gray-500 leading-tight">
                Davao Occidental General Hospital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onMyAppointments}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ClipboardList size={16} />
              <span className="hidden sm:inline">My Requests</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
