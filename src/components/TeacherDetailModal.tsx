import React from 'react';
import { Teacher, FoundationInfo } from '../types';
import { 
  X, 
  Printer, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Phone, 
  Building2,
  FileCheck,
  Upload,
  Download,
  UserX,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface TeacherDetailModalProps {
  teacher: Teacher | null;
  foundation: FoundationInfo;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (teacher: Teacher) => void;
  onOpenSKModal?: (teacherId?: string) => void;
  onToggleDeactivate?: (teacher: Teacher) => void;
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
  teacher,
  foundation,
  isOpen,
  onClose,
  onEdit,
  onOpenSKModal,
  onToggleDeactivate,
}) => {
  if (!isOpen || !teacher) return null;

  const fullName = `${teacher.gelarDepan ? teacher.gelarDepan + ' ' : ''}${teacher.nama}${teacher.gelarBelakang ? ', ' + teacher.gelarBelakang : ''}`;
  const isNonaktif = Boolean(teacher.isNonaktif);

  const handlePrintCard = () => {
    window.print();
  };

  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return '-';
    const birth = new Date(birthDateString);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  };

  const calculateYearsOfService = (tmtString?: string) => {
    if (!tmtString) return '-';
    const tmt = new Date(tmtString);
    const now = new Date();
    const years = now.getFullYear() - tmt.getFullYear();
    const months = now.getMonth() - tmt.getMonth();
    return `${years} Tahun ${months > 0 ? months + ' Bulan' : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Header - Screen only */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold">Kartu Profil & Informasi Guru Yayasan</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintCard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Kartu Data
            </button>
            <button
              onClick={onClose}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 print:p-8">
          
          {/* Official Printable Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-600 uppercase">
              {foundation.namaYayasan}
            </h3>
            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight mt-0.5">
              KARTU DATA PENDIDIK & TENAGA KEPENDIDIKAN
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Unit Tugas: <span className="font-bold underline text-slate-900">{teacher.unit === 'RA' ? 'Raudhatul Athfal (RA)' : teacher.unit === 'MI' ? 'Madrasah Ibtidaiyah (MI)' : 'Madrasah Tsanawiyah (MTs)'}</span> | Akta Yayasan: {foundation.noAkta}
            </p>
          </div>

          {/* Profile Badge Hero */}
          <div className={`rounded-2xl p-5 border flex flex-col md:flex-row items-center md:items-start gap-5 ${
            isNonaktif ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <img
              src={teacher.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.nama)}&background=${isNonaktif ? '64748B' : '0D9488'}&color=fff`}
              alt={teacher.nama}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.nama)}&background=${isNonaktif ? '64748B' : '0D9488'}&color=fff`;
              }}
            />

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-md bg-emerald-800 text-white">
                  UNIT {teacher.unit}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-slate-200 text-slate-800">
                  {teacher.statusPegawai}
                </span>
                {isNonaktif ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-md bg-red-600 text-white">
                    <UserX className="w-3.5 h-3.5" /> STATUS: NONAKTIF
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <UserCheck className="w-3.5 h-3.5" /> STATUS: AKTIF
                  </span>
                )}
                {teacher.statusSertifikasi === 'Sertifikasi' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <Award className="w-3.5 h-3.5" /> Sertifikasi Pendidik
                  </span>
                )}
              </div>

              <h1 className={`text-2xl font-black tracking-tight ${isNonaktif ? 'text-slate-600 line-through' : 'text-slate-900'}`}>
                {fullName}
              </h1>

              {isNonaktif && (
                <div className="p-2.5 bg-red-100/80 border border-red-300 rounded-lg text-xs text-red-900 font-medium">
                  <strong>Nonaktif sejak:</strong> {teacher.tanggalNonaktif || '-'} • <strong>Alasan:</strong> {teacher.alasanNonaktif || 'Nonaktif'}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-600 pt-1">
                <div>NUPTK: <span className="font-bold text-slate-900">{teacher.nuptk || '-'}</span></div>
                <div>NIK: <span className="font-bold text-slate-900">{teacher.nik || '-'}</span></div>
              </div>
            </div>
          </div>

          {/* Detailed Data Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            
            {/* Column 1: Kepegawaian & Penugasan */}
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                <h4 className="font-bold text-emerald-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Briefcase className="w-4 h-4" /> Data Kepegawaian & Tugas
                </h4>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Mata Pelajaran Utama:</span>
                  <span className="font-semibold text-slate-900">{teacher.mapelUtama}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Tugas Tambahan / Jabatan:</span>
                  <span className="font-semibold text-emerald-800">{teacher.tugasTambahan || '-'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Jumlah Jam Mengajar (JJM):</span>
                  <span className={`font-bold ${teacher.jamMengajar >= 24 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {teacher.jamMengajar} Jam / Minggu
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Tanggal Mulai Tugas (TMT):</span>
                  <span className="font-medium text-slate-800">{teacher.tmt || '-'}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Masa Kerja di Yayasan:</span>
                  <span className="font-bold text-slate-900">{calculateYearsOfService(teacher.tmt)}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                <h4 className="font-bold text-emerald-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Award className="w-4 h-4" /> Status Sertifikasi & PPG
                </h4>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Status Sertifikasi:</span>
                  <span className="font-bold text-slate-900">{teacher.statusSertifikasi}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Nomor Sertifikat:</span>
                  <span className="font-mono font-medium text-slate-800">{teacher.noSertifikat || '-'}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Akademik & Kontak Pribadi */}
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                <h4 className="font-bold text-emerald-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <GraduationCap className="w-4 h-4" /> Riwayat Pendidikan
                </h4>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Pendidikan Terakhir:</span>
                  <span className="font-bold text-slate-900">{teacher.pendidikanTerakhir}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Program Studi / Jurusan:</span>
                  <span className="font-medium text-slate-800">{teacher.jurusan}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Universitas / Perguruan Tinggi:</span>
                  <span className="font-medium text-slate-800">{teacher.universitas || '-'}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Tahun Lulus:</span>
                  <span className="font-medium text-slate-800">{teacher.tahunLulus || '-'}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                <h4 className="font-bold text-emerald-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Phone className="w-4 h-4" /> Kontak & Tempat Tanggal Lahir
                </h4>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">TTL / Usia:</span>
                  <span className="font-medium text-slate-800">
                    {teacher.tempatLahir}, {teacher.tanggalLahir} ({calculateAge(teacher.tanggalLahir)} Thn)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">No. Telepon / WA:</span>
                  <span className="font-medium text-slate-900">{teacher.phone || '-'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-medium text-slate-900">{teacher.email || '-'}</span>
                </div>

                <div className="py-1">
                  <span className="text-slate-500 block mb-0.5">Alamat Tempat Tinggal:</span>
                  <span className="font-medium text-slate-800">{teacher.alamat || '-'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* SK Documents Vault Card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-emerald-50/40 space-y-3 print:hidden">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <FileCheck className="w-4 h-4 text-emerald-700" /> Dokumen SK Guru Tersimpan ({teacher.skList?.length || 0})
              </h4>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenSKModal) onOpenSKModal(teacher.id);
                }}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Upload SK Baru
              </button>
            </div>

            {(!teacher.skList || teacher.skList.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-2">
                Belum ada berkas SK yang diunggah untuk guru ini. Klik "Upload SK Baru" di atas untuk menambahkan SK Mengajar / SK Pengangkatan.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teacher.skList.map((doc) => (
                  <div key={doc.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                    <div className="min-w-0 pr-2">
                      <div className="font-mono font-bold text-slate-900 truncate">{doc.nomorSK}</div>
                      <div className="text-[11px] text-emerald-800 font-medium truncate">{doc.jenisSK} ({doc.tahunAjaran})</div>
                      <div className="text-[10px] text-slate-500">Terbit: {doc.tanggalTerbit} • {doc.fileName}</div>
                    </div>
                    {doc.fileDataUrl && (
                      <a
                        href={doc.fileDataUrl}
                        download={doc.fileName}
                        className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded shrink-0 font-bold transition-colors"
                        title="Unduh SK"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {teacher.catatan && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
              <span className="font-bold block mb-1">Catatan Yayasan:</span>
              <p>{teacher.catatan}</p>
            </div>
          )}

          {/* Official Signature Section for Print */}
          <div className="pt-8 mt-8 border-t border-slate-300 hidden print:grid grid-cols-2 text-center text-xs">
            <div>
              <p className="text-slate-600 mb-16">Pengurus Yayasan / Admin SIMPATIKA,</p>
              <p className="font-bold text-slate-900 underline">________________________</p>
            </div>
            <div>
              <p className="text-slate-600 mb-16">
                Bogor, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
                Ketua Yayasan,
              </p>
              <p className="font-bold text-slate-900 underline">{foundation.ketuaYayasan}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls - Screen only */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            {onToggleDeactivate && (
              <button
                onClick={() => {
                  onClose();
                  onToggleDeactivate(teacher);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg border shadow-xs transition-all ${
                  isNonaktif
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                    : 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300'
                }`}
              >
                {isNonaktif ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                <span>{isNonaktif ? 'Aktifkan Kembali Guru' : 'Nonaktifkan Guru'}</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onEdit(teacher);
              }}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
            >
              Edit Profile Guru
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
