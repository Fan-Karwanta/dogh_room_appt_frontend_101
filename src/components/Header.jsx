import React from 'react';
import { CalendarDays, ClipboardList } from 'lucide-react';

function Header({ onMyAppointments }) {
  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-lg shadow-blue-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src="/dogh_logo.png"
                alt="DOGH Logo"
                className="h-11 w-11 object-contain rounded-xl bg-white/95 p-1 shadow-lg ring-2 ring-white/20"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-blue-700"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
                DOGH Room Appointment
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CalendarDays size={11} className="text-blue-200" />
                <p className="text-blue-200/80 text-[11px] font-medium tracking-wide">
                  Davao Occidental General Hospital
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onMyAppointments}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 rounded-xl transition-all backdrop-blur-sm border border-white/20 hover:border-white/30"
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
