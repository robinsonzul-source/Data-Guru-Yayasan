import React from 'react';
import { Teacher } from '../types';
import { Award, Eye, Edit3, Trash2, ArrowUpDown, FileCheck, UserX, UserCheck } from 'lucide-react';

interface TeacherTableProps {
  teachers: Teacher[];
  onViewDetail: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: string) => void;
  onOpenSKModal?: (teacherId: string) => void;
  onToggleDeactivate?: (teacher: Teacher) => void;
  sortBy: 'nama' | 'unit' | 'jamMengajar' | 'tmt';
  sortOrder: 'asc' | 'desc';
  onSortChange: (column: 'nama' | 'unit' | 'jamMengajar' | 'tmt') => void;
}

export const TeacherTable: React.FC<TeacherTableProps> = ({
  teachers,
  onViewDetail,
  onEdit,
  onDelete,
  onOpenSKModal,
  onToggleDeactivate,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  // Calculate working duration in years from TMT
  const calculateWorkDuration = (tmtString: string) => {
    if (!tmtString) return '-';
    const tmt = new Date(tmtString);
    const now = new Date();
    const diffYears = now.getFullYear() - tmt.getFullYear();
    return `${diffYears} Thn`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Guru / Pendidik</th>
              <th className="py-3.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => onSortChange('unit')}>
                <div className="flex items-center gap-1">
                  Unit <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-3">Status Pegawai</th>
              <th className="py-3.5 px-3">Sertifikasi</th>
              <th className="py-3.5 px-3">NUPTK / NIK</th>
              <th className="py-3.5 px-3">Mapel & Tugas</th>
              <th className="py-3.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => onSortChange('jamMengajar')}>
                <div className="flex items-center gap-1">
                  JJM <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-3">Pendidikan</th>
              <th className="py-3.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => onSortChange('tmt')}>
                <div className="flex items-center gap-1">
                  Masa Kerja <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {teachers.map((t) => {
              const fullName = `${t.gelarDepan ? t.gelarDepan + ' ' : ''}${t.nama}${t.gelarBelakang ? ', ' + t.gelarBelakang : ''}`;
              
              const unitClass = {
                RA: 'bg-amber-100 text-amber-800 font-bold',
                MI: 'bg-blue-100 text-blue-800 font-bold',
                MTS: 'bg-purple-100 text-purple-800 font-bold',
              }[t.unit];

              const isNonaktif = Boolean(t.isNonaktif);

              return (
                <tr key={t.id} className={`transition-colors group ${isNonaktif ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-slate-50/80'}`}>
                  
                  {/* Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.nama)}&background=${isNonaktif ? '64748B' : '0D9488'}&color=fff`}
                        alt={t.nama}
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.nama)}&background=${isNonaktif ? '64748B' : '0D9488'}&color=fff`;
                        }}
                      />
                      <div>
                        <p className={`font-semibold transition-colors ${isNonaktif ? 'text-slate-500 line-through' : 'text-slate-900 group-hover:text-emerald-700'}`}>
                          {fullName}
                        </p>
                        {isNonaktif ? (
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                            Nonaktif ({t.alasanNonaktif || 'Nonaktif'})
                          </span>
                        ) : (
                          <p className="text-[11px] text-slate-500">
                            {t.email || t.phone || '-'}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Unit */}
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 text-xs rounded-md ${unitClass}`}>
                      {t.unit}
                    </span>
                  </td>

                  {/* Status Pegawai */}
                  <td className="py-3 px-3 font-medium text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {t.statusPegawai}
                    </span>
                  </td>

                  {/* Sertifikasi */}
                  <td className="py-3 px-3">
                    {t.statusSertifikasi === 'Sertifikasi' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
                        <Award className="w-3.5 h-3.5 text-emerald-600" /> Sertifikasi
                      </span>
                    ) : t.statusSertifikasi === 'Proses PPG' ? (
                      <span className="px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-md border border-amber-200">
                        PPG
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Belum</span>
                    )}
                  </td>

                  {/* NUPTK / NIK */}
                  <td className="py-3 px-3 font-mono text-xs text-slate-600">
                    <div>{t.nuptk && t.nuptk !== '-' ? t.nuptk : <span className="text-slate-400 italic">No NUPTK</span>}</div>
                    <div className="text-[10px] text-slate-400">NIK: {t.nik || '-'}</div>
                  </td>

                  {/* Mapel & Tugas */}
                  <td className="py-3 px-3 text-xs max-w-[200px]">
                    <div className="font-medium text-slate-900 truncate" title={t.mapelUtama}>{t.mapelUtama}</div>
                    {t.tugasTambahan && (
                      <div className="text-[11px] text-emerald-700 truncate" title={t.tugasTambahan}>
                        {t.tugasTambahan}
                      </div>
                    )}
                  </td>

                  {/* JJM */}
                  <td className="py-3 px-3">
                    <span className={`font-bold ${t.jamMengajar >= 24 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {t.jamMengajar} Jam
                    </span>
                  </td>

                  {/* Pendidikan */}
                  <td className="py-3 px-3 text-xs">
                    <span className="font-bold text-slate-800">{t.pendidikanTerakhir}</span>
                    <span className="text-slate-500 block text-[11px] truncate max-w-[120px]">{t.jurusan}</span>
                  </td>

                  {/* Masa Kerja */}
                  <td className="py-3 px-3 text-xs text-slate-600">
                    <div>{calculateWorkDuration(t.tmt)}</div>
                    <div className="text-[10px] text-slate-400">TMT: {t.tmt || '-'}</div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetail(t)}
                        title="Lihat Detail Guru"
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {onOpenSKModal && (
                        <button
                          onClick={() => onOpenSKModal(t.id)}
                          title="Upload / Kelola SK Guru"
                          className="p-1.5 text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded transition-colors cursor-pointer border border-amber-200 relative"
                        >
                          <FileCheck className="w-4 h-4 text-amber-700" />
                          {t.skList && t.skList.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                              {t.skList.length}
                            </span>
                          )}
                        </button>
                      )}

                      {onToggleDeactivate && (
                        <button
                          onClick={() => onToggleDeactivate(t)}
                          title={isNonaktif ? "Aktifkan Kembali Guru" : "Nonaktifkan Guru"}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            isNonaktif 
                              ? 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 bg-emerald-50' 
                              : 'text-slate-400 hover:text-red-700 hover:bg-red-50'
                          }`}
                        >
                          {isNonaktif ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                      )}

                      <button
                        onClick={() => onEdit(t)}
                        title="Edit Data Guru"
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus data guru ${t.nama}?`)) {
                            onDelete(t.id);
                          }
                        }}
                        title="Hapus Data Guru"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
