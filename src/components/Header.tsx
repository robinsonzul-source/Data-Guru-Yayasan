import React from 'react';
import { UnitType, FoundationInfo } from '../types';
import { 
  Building2, 
  GraduationCap, 
  Plus, 
  Printer, 
  Download, 
  BookOpen,
  School,
  Search,
  Sparkles,
  FileCheck
} from 'lucide-react';

interface HeaderProps {
  foundation: FoundationInfo;
  activeUnit: UnitType;
  onUnitChange: (unit: UnitType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddModal: () => void;
  onOpenSKModal: () => void;
  onOpenPrintModal: () => void;
  onOpenAIModal: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  totalTeachers: number;
}

export const Header: React.FC<HeaderProps> = ({
  foundation,
  activeUnit,
  onUnitChange,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenSKModal,
  onOpenPrintModal,
  onOpenAIModal,
  onExportCSV,
  totalTeachers,
}) => {
  return (
    <header className="bg-emerald-900 text-white shadow-lg border-b border-emerald-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Foundation Title */}
          <div className="flex items-center gap-3.5">
            {foundation.logoUrl ? (
              <img
                src={foundation.logoUrl}
                alt="Logo Yayasan Al-Hasanah"
                className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-emerald-700/80 shadow-md shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-12 h-12 rounded-xl bg-emerald-800 border border-emerald-700/80 flex items-center justify-center text-emerald-300 font-bold text-lg shrink-0 shadow-inner';
                    fallback.innerHTML = 'AH';
                    parent.prepend(fallback);
                  }
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-800 border border-emerald-700/80 flex items-center justify-center shadow-inner text-emerald-300">
                <Building2 className="w-7 h-7 text-emerald-300" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-800/90 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
                  Yayasan Perguruan Islam
                </span>
                <span className="text-xs text-emerald-300 font-mono hidden sm:inline bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Akta: {foundation.noAkta}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                {foundation.namaYayasan}
              </h1>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Pusat Pendataan & Sistem Informasi SIMPATIKA Guru Unit RA, MI, & MTs
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenSKModal}
              id="btn-header-upload-sk"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:shadow-lg transition-all border border-amber-400/50 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-slate-950" />
              <span>Upload SK Guru</span>
            </button>

            <button
              onClick={onOpenAIModal}
              id="btn-ai-assistant"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors border border-emerald-700 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Asisten AI Guru</span>
            </button>

            <button
              onClick={onOpenPrintModal}
              id="btn-print-report"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors border border-emerald-700 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Cetak Rekap</span>
            </button>

            <button
              onClick={onExportCSV}
              id="btn-export-csv"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors border border-emerald-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenAddModal}
              id="btn-add-teacher"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah Guru</span>
            </button>
          </div>
        </div>

        {/* Institution Filter Tabs & Search Bar Row */}
        <div className="mt-6 pt-4 border-t border-emerald-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Unit Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => onUnitChange('ALL')}
              id="tab-unit-all"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeUnit === 'ALL'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Semua Unit Yayasan</span>
              <span className={`px-1.5 py-0.5 text-[11px] rounded-full ${activeUnit === 'ALL' ? 'bg-emerald-950 text-white' : 'bg-emerald-900 text-emerald-300'}`}>
                {totalTeachers}
              </span>
            </button>

            <button
              onClick={() => onUnitChange('RA')}
              id="tab-unit-ra"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeUnit === 'RA'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>RA (Raudhatul Athfal)</span>
            </button>

            <button
              onClick={() => onUnitChange('MI')}
              id="tab-unit-mi"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeUnit === 'MI'
                  ? 'bg-blue-400 text-slate-950 font-bold shadow-md'
                  : 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>MI (Madrasah Ibtidaiyah)</span>
            </button>

            <button
              onClick={() => onUnitChange('MTS')}
              id="tab-unit-mts"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeUnit === 'MTS'
                  ? 'bg-purple-400 text-slate-950 font-bold shadow-md'
                  : 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <School className="w-4 h-4" />
              <span>MTs (Madrasah Tsanawiyah)</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px] sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300" />
            <input
              type="text"
              id="input-quick-search"
              placeholder="Cari NUPTK, nama guru, mapel..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-emerald-950/80 text-white placeholder-emerald-400/70 rounded-lg border border-emerald-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
