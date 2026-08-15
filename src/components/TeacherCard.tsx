import React from 'react';
import { Teacher } from '../types';
import { 
  Award, 
  Briefcase, 
  BookOpen, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2, 
  FileCheck,
  UserX,
  UserCheck
} from 'lucide-react';

interface TeacherCardProps {
  teacher: Teacher;
  onViewDetail: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: string) => void;
  onOpenSKModal?: (teacherId: string) => void;
  onToggleDeactivate?: (teacher: Teacher) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onViewDetail,
  onEdit,
  onDelete,
  onOpenSKModal,
  onToggleDeactivate,
}) => {
  const fullName = `${teacher.gelarDepan ? teacher.gelarDepan + ' ' : ''}${teacher.nama}${teacher.gelarBelakang ? ', ' + teacher.gelarBelakang : ''}`;

  const unitBadgeColor = {
    RA: 'bg-amber-100 text-amber-800 border-amber-200',
    MI: 'bg-blue-100 text-blue-800 border-blue-200',
    MTS: 'bg-purple-100 text-purple-800 border-purple-200',
  }[teacher.unit];

  const statusPegawaiColor = {
    GTY: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    GTT: 'bg-slate-100 text-slate-700 border-slate-200',
    PTY: 'bg-teal-100 text-teal-800 border-teal-200',
    PTTY: 'bg-amber-100 text-amber-800 border-amber-200',
    PNS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    PPPK: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  }[teacher.statusPegawai] || 'bg-slate-100 text-slate-700 border-slate-200';

  const isNonaktif = Boolean(teacher.isNonaktif);

  return (
    <div className={`rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
      isNonaktif ? 'bg-slate-50/90 border-red-200' : 'bg-white border-slate-200'
    }`}>
      
      {/* Top Header & Avatar */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={teacher.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.nama)}&background=${isNonaktif ? '64748B' : '0D9488'}&color=fff`}
              alt={teacher.nama}
              className={`w-14 h-14 rounded-xl object-cover border-2 shadow-sm ${isNonaktif ? 'border-red-300 grayscale-[0.3]' : 'border-emerald-500/20'}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.nama)}&background=${isNonaktif ? '64748B' : '0D9488'}&color=fff`;
              }}
            />
            <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-md border ${unitBadgeColor}`}>
              {teacher.unit}
            </span>
          </div>

          {/* Teacher Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className={`text-base font-bold truncate ${isNonaktif ? 'text-slate-600 line-through' : 'text-slate-900 group-hover:text-emerald-700'} transition-colors`} title={fullName}>
                {fullName}
              </h3>
            </div>

            {isNonaktif && (
              <span className="inline-block my-0.5 px-2 py-0.2 text-[10px] font-bold rounded bg-red-100 text-red-800 border border-red-300">
                Nonaktif ({teacher.alasanNonaktif || 'Nonaktif'})
              </span>
            )}
            
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              NUPTK: {teacher.nuptk && teacher.nuptk !== '-' ? teacher.nuptk : <span className="italic text-slate-400">Belum Ada</span>}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${statusPegawaiColor}`}>
                {teacher.statusPegawai}
              </span>

              {teacher.statusSertifikasi === 'Sertifikasi' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Award className="w-3 h-3 text-emerald-600" /> Sertifikasi
                </span>
              ) : teacher.statusSertifikasi === 'Proses PPG' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  Proses PPG
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  Non-Sertifikasi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Teaching Specs & Additional Duty */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          
          <div className="flex items-start gap-2 text-slate-700">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-semibold text-slate-900">{teacher.mapelUtama}</span>
              {teacher.tugasTambahan && (
                <p className="text-slate-500 text-[11px] truncate">
                  Tugas: <span className="font-medium text-emerald-800">{teacher.tugasTambahan}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-600 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> JJM: 
              <strong className={teacher.jamMengajar >= 24 ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                {teacher.jamMengajar} Jam
              </strong>
            </span>

            <span className="text-[11px] text-slate-500">
              Pendidikan: <strong className="text-slate-800">{teacher.pendidikanTerakhir} ({teacher.jurusan})</strong>
            </span>
          </div>

        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onViewDetail(teacher)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-100/60 hover:bg-emerald-100 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detail</span>
          </button>

          {onOpenSKModal && (
            <button
              onClick={() => onOpenSKModal(teacher.id)}
              title="Upload / Kelola SK Guru"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-1.5 rounded-md transition-colors cursor-pointer border border-amber-300"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>SK</span>
              {teacher.skList && teacher.skList.length > 0 && (
                <span className="bg-amber-600 text-white text-[10px] px-1 rounded-full font-mono">
                  {teacher.skList.length}
                </span>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onToggleDeactivate && (
            <button
              onClick={() => onToggleDeactivate(teacher)}
              title={isNonaktif ? "Aktifkan Kembali Guru Ini" : "Nonaktifkan Guru Ini"}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isNonaktif 
                  ? 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 bg-emerald-50' 
                  : 'text-slate-400 hover:text-red-700 hover:bg-red-50'
              }`}
            >
              {isNonaktif ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => onEdit(teacher)}
            title="Edit Data Guru"
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              if (confirm(`Hapus data guru ${teacher.nama}?`)) {
                onDelete(teacher.id);
              }
            }}
            title="Hapus Data Guru"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
