import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import { X, UserX, UserCheck, AlertTriangle, Calendar, FileText } from 'lucide-react';

interface DeactivateModalProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onConfirmDeactivate: (teacherId: string, tanggal: string, alasan: string, catatan?: string) => void;
  onConfirmReactivate: (teacherId: string) => void;
}

export const DeactivateModal: React.FC<DeactivateModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onConfirmDeactivate,
  onConfirmReactivate,
}) => {
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [alasanCategory, setAlasanCategory] = useState<string>('Pensiun / Purna Tugas');
  const [alasanDetail, setAlasanDetail] = useState<string>('');

  useEffect(() => {
    if (teacher) {
      setTanggal(teacher.tanggalNonaktif || new Date().toISOString().split('T')[0]);
      if (teacher.alasanNonaktif) {
        setAlasanDetail(teacher.alasanNonaktif);
      } else {
        setAlasanDetail('');
      }
    }
  }, [teacher, isOpen]);

  if (!isOpen || !teacher) return null;

  const fullName = `${teacher.gelarDepan ? teacher.gelarDepan + ' ' : ''}${teacher.nama}${teacher.gelarBelakang ? ', ' + teacher.gelarBelakang : ''}`;
  const isCurrentlyNonaktif = Boolean(teacher.isNonaktif);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCurrentlyNonaktif) {
      onConfirmReactivate(teacher.id);
      onClose();
    } else {
      const fullAlasan = alasanDetail.trim() 
        ? `${alasanCategory} - ${alasanDetail.trim()}`
        : alasanCategory;
      onConfirmDeactivate(teacher.id, tanggal, fullAlasan, alasanDetail);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className={`px-6 py-4 text-white flex items-center justify-between ${isCurrentlyNonaktif ? 'bg-emerald-800' : 'bg-red-800'}`}>
          <div className="flex items-center gap-2">
            {isCurrentlyNonaktif ? (
              <UserCheck className="w-5 h-5 text-emerald-300" />
            ) : (
              <UserX className="w-5 h-5 text-red-300" />
            )}
            <h2 className="text-base font-bold">
              {isCurrentlyNonaktif ? 'Aktifkan Kembali Guru' : 'Nonaktifkan Data Guru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          
          {/* Target Teacher Profile Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
            <img
              src={teacher.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.nama)}&background=0D9488&color=fff`}
              alt={teacher.nama}
              className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.nama)}&background=0D9488&color=fff`;
              }}
            />
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 truncate">{fullName}</h3>
              <p className="text-xs text-slate-500 font-mono">
                Unit {teacher.unit} • Status: <strong className="text-slate-800">{teacher.statusPegawai}</strong>
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Mapel: {teacher.mapelUtama}
              </p>
            </div>
          </div>

          {isCurrentlyNonaktif ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Status Saat Ini: NONAKTIF</span>
              </div>
              <p className="text-xs text-slate-600">
                Alasan sebelumnya: <strong>{teacher.alasanNonaktif || 'Tidak tercatat'}</strong> ({teacher.tanggalNonaktif || '-'})
              </p>
              <p className="text-xs text-emerald-800 font-medium">
                Apakah Anda yakin ingin mengembalikan status guru ini menjadi <strong>AKTIF</strong> kembali di sistem SIMPATIKA?
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Guru yang dinonaktifkan tidak akan terhapus dari basis data, melainkan ditandai sebagai <strong>Nonaktif</strong> dan dapat difilter atau diaktifkan kembali sewaktu-waktu.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Tanggal Efektif Nonaktif *
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Kategori Alasan Nonaktif *
                </label>
                <select
                  value={alasanCategory}
                  onChange={(e) => setAlasanCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-xs sm:text-sm font-medium"
                >
                  <option value="Pensiun / Purna Tugas">Pensiun / Purna Tugas</option>
                  <option value="Mengundurkan Diri (Resign)">Mengundurkan Diri (Resign)</option>
                  <option value="Pindah Tugas / Mutasi Sekolah">Pindah Tugas / Mutasi Sekolah</option>
                  <option value="Cuti Diluar Tanggungan Yayasan">Cuti Diluar Tanggungan Yayasan</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" /> Keterangan / Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Nomor SK Pemberhentian / Pindah ke MIN 1 Toboali..."
                  value={alasanDetail}
                  onChange={(e) => setAlasanDetail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-xs"
                />
              </div>
            </>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>

            {isCurrentlyNonaktif ? (
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Aktifkan Kembali Guru</span>
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-md transition-all cursor-pointer"
              >
                <UserX className="w-4 h-4" />
                <span>Konfirmasi Nonaktifkan Guru</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
