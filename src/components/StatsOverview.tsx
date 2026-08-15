import React from 'react';
import { Teacher, UnitType } from '../types';
import { Users, Award, Briefcase, Clock, GraduationCap, BookOpen, School, CheckCircle2 } from 'lucide-react';

interface StatsOverviewProps {
  teachers: Teacher[];
  activeUnit: UnitType;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ teachers, activeUnit }) => {
  const total = teachers.length;
  
  const totalRA = teachers.filter((t) => t.unit === 'RA').length;
  const totalMI = teachers.filter((t) => t.unit === 'MI').length;
  const totalMTS = teachers.filter((t) => t.unit === 'MTS').length;

  const activeTeachers = teachers.filter((t) => !t.isNonaktif);
  const nonaktifTeachers = teachers.filter((t) => t.isNonaktif);

  const certifiedCount = teachers.filter((t) => t.statusSertifikasi === 'Sertifikasi').length;
  const certifiedPercent = total > 0 ? Math.round((certifiedCount / total) * 100) : 0;

  const gtyCount = teachers.filter((t) => t.statusPegawai === 'GTY').length;
  const gttCount = teachers.filter((t) => t.statusPegawai === 'GTT').length;
  const ptyCount = teachers.filter((t) => t.statusPegawai === 'PTY').length;
  const pttyCount = teachers.filter((t) => t.statusPegawai === 'PTTY').length;
  const pnsCount = teachers.filter((t) => t.statusPegawai === 'PNS' || t.statusPegawai === 'PPPK').length;

  const totalJJM = teachers.reduce((acc, t) => acc + (t.jamMengajar || 0), 0);
  const avgJJM = total > 0 ? (totalJJM / total).toFixed(1) : '0';

  const s1OrHigher = teachers.filter((t) => ['S1', 'S2', 'S3'].includes(t.pendidikanTerakhir)).length;
  const qualificationPercent = total > 0 ? Math.round((s1OrHigher / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Teachers & Keaktifan Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {activeUnit === 'ALL' ? 'Total Personil Yayasan' : `Personil Unit ${activeUnit}`}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{total} <span className="text-sm font-normal text-slate-500">Orang</span></h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif: {activeTeachers.length}
          </span>
          <span className="inline-flex items-center gap-1 text-red-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Nonaktif: {nonaktifTeachers.length}
          </span>
        </div>
      </div>

      {/* Certification Status */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sertifikasi Pendidik
            </p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1">
              {certifiedCount} <span className="text-sm font-normal text-slate-500">({certifiedPercent}%)</span>
            </h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${certifiedPercent}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {total - certifiedCount} guru belum / dalam proses sertifikasi
          </p>
        </div>
      </div>

      {/* Employment Status Distribution */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status Kepegawaian
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {gtyCount + ptyCount} <span className="text-sm font-normal text-slate-500">GTY/PTY</span>
            </h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-x-2">
          <span>GTY: <strong className="text-slate-900">{gtyCount}</strong></span>
          <span>PTY: <strong className="text-slate-900">{ptyCount}</strong></span>
          <span>GTT/PTTY: <strong className="text-slate-900">{gttCount + pttyCount}</strong></span>
          <span>PNS/PPPK: <strong className="text-slate-900">{pnsCount}</strong></span>
        </div>
      </div>

      {/* Average JJM & Qualification */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rata-rata JJM / Kualifikasi
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {avgJJM} <span className="text-sm font-normal text-slate-500">Jam/Mgg</span>
            </h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> S1/S2: {qualificationPercent}%
          </span>
          <span className="text-slate-500">Target 24 Jam</span>
        </div>
      </div>

    </div>
  );
};
