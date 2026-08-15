import React from 'react';
import { UnitType, FoundationInfo } from '../types';
import { 
  Building2, 
  X,
  FileCheck,
  Plus
} from 'lucide-react';

interface SidebarProps {
  foundation: FoundationInfo;
  activeUnit: UnitType;
  onUnitChange: (unit: UnitType) => void;
  totalTeachers: number;
  totalRA: number;
  totalMI: number;
  totalMTS: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenSKModal: () => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  foundation,
  activeUnit,
  onUnitChange,
  totalTeachers,
  totalRA,
  totalMI,
  totalMTS,
  isOpenMobile,
  onCloseMobile,
  onOpenSKModal,
  onOpenAddModal,
}) => {
  const navContent = (
    <div className="flex flex-col h-full bg-emerald-900 text-emerald-50 border-r border-emerald-800">
      
      {/* Sidebar Header with Logo */}
      <div className="p-5 border-b border-emerald-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {foundation.logoUrl ? (
            <img
              src={foundation.logoUrl}
              alt="Logo Yayasan"
              className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-emerald-700 shadow-sm shrink-0"
              onError={(e) => {
                // Fallback to Icon
                (e.target as HTMLElement).style.display = 'none';
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 font-bold border border-emerald-700 shrink-0';
                  fallback.innerHTML = 'AH';
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-300 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-sm font-black tracking-tight text-white uppercase leading-tight truncate" title={foundation.namaYayasan}>
              {foundation.namaYayasan}
            </h1>
            <p className="text-[10px] text-emerald-300 font-mono mt-0.5 truncate" title={foundation.noAkta}>
              Akta: {foundation.noAkta}
            </p>
          </div>
        </div>

        <button
          onClick={onCloseMobile}
          className="lg:hidden text-emerald-300 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        
        {/* Quick Actions */}
        <div className="mb-4 space-y-2">
          <button
            onClick={() => {
              onOpenSKModal();
              onCloseMobile();
            }}
            id="btn-sidebar-upload-sk"
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-slate-950" />
            <span>Menu Upload SK Guru</span>
          </button>

          <button
            onClick={() => {
              onOpenAddModal();
              onCloseMobile();
            }}
            id="btn-sidebar-add-teacher"
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer border border-emerald-600"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Guru</span>
          </button>
        </div>

        <div className="text-[10px] font-bold text-emerald-400 uppercase px-3 py-2 tracking-widest border-t border-emerald-800/80 pt-3">
          Unit Pendidikan
        </div>

        {/* ALL UNITS */}
        <button
          onClick={() => {
            onUnitChange('ALL');
            onCloseMobile();
          }}
          className={`w-full flex items-center justify-between p-3 rounded-lg border-l-4 transition-all text-left cursor-pointer ${
            activeUnit === 'ALL'
              ? 'bg-emerald-800 border-emerald-400 text-white font-semibold'
              : 'border-transparent text-emerald-100 hover:bg-emerald-800/60 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${activeUnit === 'ALL' ? 'bg-emerald-400' : 'border border-emerald-400'}`} />
            <span className="text-sm">Semua Unit</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-bold">
            {totalTeachers}
          </span>
        </button>

        {/* RA */}
        <button
          onClick={() => {
            onUnitChange('RA');
            onCloseMobile();
          }}
          className={`w-full flex items-center justify-between p-3 rounded-lg border-l-4 transition-all text-left cursor-pointer ${
            activeUnit === 'RA'
              ? 'bg-emerald-800 border-orange-400 text-white font-semibold'
              : 'border-transparent text-emerald-100 hover:bg-emerald-800/60 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${activeUnit === 'RA' ? 'bg-orange-400' : 'border border-orange-400'}`} />
            <span className="text-sm">RA (Raudhatul Athfal)</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-950/80 text-orange-300 font-bold">
            {totalRA}
          </span>
        </button>

        {/* MI */}
        <button
          onClick={() => {
            onUnitChange('MI');
            onCloseMobile();
          }}
          className={`w-full flex items-center justify-between p-3 rounded-lg border-l-4 transition-all text-left cursor-pointer ${
            activeUnit === 'MI'
              ? 'bg-emerald-800 border-emerald-400 text-white font-semibold'
              : 'border-transparent text-emerald-100 hover:bg-emerald-800/60 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${activeUnit === 'MI' ? 'bg-emerald-400' : 'border border-emerald-400'}`} />
            <span className="text-sm">MI (Madrasah Ibtidaiyah)</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-bold">
            {totalMI}
          </span>
        </button>

        {/* MTS */}
        <button
          onClick={() => {
            onUnitChange('MTS');
            onCloseMobile();
          }}
          className={`w-full flex items-center justify-between p-3 rounded-lg border-l-4 transition-all text-left cursor-pointer ${
            activeUnit === 'MTS'
              ? 'bg-emerald-800 border-blue-400 text-white font-semibold'
              : 'border-transparent text-emerald-100 hover:bg-emerald-800/60 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${activeUnit === 'MTS' ? 'bg-blue-400' : 'border border-blue-400'}`} />
            <span className="text-sm">MTs (Madrasah Tsanawiyah)</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 font-bold">
            {totalMTS}
          </span>
        </button>
      </nav>

      {/* Session Identity Footer */}
      <div className="p-5 bg-emerald-950 mt-auto border-t border-emerald-800">
        <div className="text-[10px] opacity-50 mb-1 font-bold uppercase tracking-widest text-emerald-200">
          Identitas Sesi SIMPATIKA
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-bold text-slate-950 shadow-sm text-xs">
            AH
          </div>
          <div className="text-xs font-bold text-white">Admin SIMPATIKA Al-Hasanah</div>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 h-screen sticky top-0 flex-col">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
            onClick={onCloseMobile} 
          />
          <div className="relative w-64 max-w-xs h-full z-10 shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
