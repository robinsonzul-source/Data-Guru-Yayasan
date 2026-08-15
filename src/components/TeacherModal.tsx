import React, { useState, useEffect } from 'react';
import { Teacher, StatusPegawai, StatusSertifikasi } from '../types';
import { X, Save, User, Briefcase, GraduationCap, FileText, CheckCircle2 } from 'lucide-react';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacherData: Partial<Teacher>) => void;
  initialTeacher?: Teacher | null;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTeacher,
}) => {
  const [formData, setFormData] = useState<Partial<Teacher>>({
    nama: '',
    gelarDepan: '',
    gelarBelakang: '',
    jenisKelamin: 'L',
    unit: 'MI',
    statusPegawai: 'GTY',
    statusSertifikasi: 'Belum Sertifikasi',
    nuptk: '',
    nik: '',
    mapelUtama: '',
    tugasTambahan: '',
    jamMengajar: 24,
    pendidikanTerakhir: 'S1',
    jurusan: '',
    universitas: '',
    tahunLulus: new Date().getFullYear() - 5,
    tmt: '2020-07-15',
    email: '',
    phone: '',
    alamat: '',
    tempatLahir: '',
    tanggalLahir: '1990-01-01',
    avatarUrl: '',
    catatan: '',
  });

  const [activeTab, setActiveTab] = useState<'pribadi' | 'kepegawaian' | 'akademik'>('pribadi');

  useEffect(() => {
    if (initialTeacher) {
      setFormData({ ...initialTeacher });
    } else {
      setFormData({
        nama: '',
        gelarDepan: '',
        gelarBelakang: '',
        jenisKelamin: 'L',
        unit: 'MI',
        statusPegawai: 'GTY',
        statusSertifikasi: 'Belum Sertifikasi',
        nuptk: '',
        nik: '',
        mapelUtama: '',
        tugasTambahan: '',
        jamMengajar: 24,
        pendidikanTerakhir: 'S1',
        jurusan: '',
        universitas: '',
        tahunLulus: 2018,
        tmt: '2020-07-15',
        email: '',
        phone: '',
        alamat: '',
        tempatLahir: 'Bogor',
        tanggalLahir: '1992-05-10',
        avatarUrl: '',
        catatan: '',
      });
    }
  }, [initialTeacher, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.unit || !formData.mapelUtama) {
      alert('Mohon isi Nama Lengkap, Unit Yayasan, dan Mata Pelajaran Utama.');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof Teacher, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {initialTeacher ? 'Edit Data Guru Yayasan' : 'Tambah Guru Baru Yayasan'}
            </h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              Unit Raudhatul Athfal (RA), Madrasah Ibtidaiyah (MI), dan Madrasah Tsanawiyah (MTs)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('pribadi')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'pribadi'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Data Pribadi & Kontak
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kepegawaian')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'kepegawaian'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Unit & Kepegawaian
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('akademik')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'akademik'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Tugas & Pendidikan
          </button>
        </div>

        {/* Form Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 text-xs sm:text-sm space-y-4">
          
          {/* TAB 1: DATA PRIBADI */}
          {activeTab === 'pribadi' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Gelar Depan</label>
                  <input
                    type="text"
                    placeholder="Drs. / Hj. / KH."
                    value={formData.gelarDepan || ''}
                    onChange={(e) => handleChange('gelarDepan', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama tanpa gelar"
                    value={formData.nama || ''}
                    onChange={(e) => handleChange('nama', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Gelar Belakang</label>
                  <input
                    type="text"
                    placeholder="S.Pd. / M.Ag."
                    value={formData.gelarBelakang || ''}
                    onChange={(e) => handleChange('gelarBelakang', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin || 'L'}
                    onChange={(e) => handleChange('jenisKelamin', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    placeholder="Kota Lahir"
                    value={formData.tempatLahir || ''}
                    onChange={(e) => handleChange('tempatLahir', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir || ''}
                    onChange={(e) => handleChange('tanggalLahir', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">NUPTK (16 Digit)</label>
                  <input
                    type="text"
                    placeholder="Kosongkan atau isikan NUPTK"
                    value={formData.nuptk || ''}
                    onChange={(e) => handleChange('nuptk', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
                  <input
                    type="text"
                    placeholder="3201xxxxxxx"
                    value={formData.nik || ''}
                    onChange={(e) => handleChange('nik', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Aktif</label>
                  <input
                    type="email"
                    placeholder="guru@alfalah.sch.id"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  placeholder="Jl. Raya / Kp., RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten/Kota"
                  value={formData.alamat || ''}
                  onChange={(e) => handleChange('alamat', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">URL Foto Profil / Pasfoto (Opsional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.avatarUrl || ''}
                  onChange={(e) => handleChange('avatarUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: DATA KEPEGAWAIAN */}
          {activeTab === 'kepegawaian' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Unit Tugas *</label>
                  <select
                    required
                    value={formData.unit || 'MI'}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-800"
                  >
                    <option value="RA">RA (Raudhatul Athfal)</option>
                    <option value="MI">MI (Madrasah Ibtidaiyah)</option>
                    <option value="MTS">MTs (Madrasah Tsanawiyah)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Status Kepegawaian</label>
                  <select
                    value={formData.statusPegawai || 'GTY'}
                    onChange={(e) => handleChange('statusPegawai', e.target.value as StatusPegawai)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    <option value="GTY">GTY (Guru Tetap Yayasan)</option>
                    <option value="GTT">GTT (Guru Tidak Tetap)</option>
                    <option value="PTY">PTY (Pegawai Tetap Yayasan)</option>
                    <option value="PTTY">PTTY (Pegawai Tidak Tetap Yayasan)</option>
                    <option value="PNS">PNS Diperbantukan</option>
                    <option value="PPPK">PPPK Kementerian Agama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal Mulai Tugas (TMT)</label>
                  <input
                    type="date"
                    value={formData.tmt || ''}
                    onChange={(e) => handleChange('tmt', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Keaktifan Section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Status Keaktifan Personil</label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isNonaktif)}
                      onChange={(e) => handleChange('isNonaktif', e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                    />
                    <span className={`text-xs font-bold ${formData.isNonaktif ? 'text-red-700' : 'text-emerald-700'}`}>
                      {formData.isNonaktif ? 'NONAKTIF' : 'AKTIF'}
                    </span>
                  </label>
                </div>

                {formData.isNonaktif && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Tanggal Nonaktif</label>
                      <input
                        type="date"
                        value={formData.tanggalNonaktif || ''}
                        onChange={(e) => handleChange('tanggalNonaktif', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Alasan Nonaktif</label>
                      <input
                        type="text"
                        placeholder="Pensiun / Resign / Pindah Tugas..."
                        value={formData.alasanNonaktif || ''}
                        onChange={(e) => handleChange('alasanNonaktif', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Status Sertifikasi Pendidik</label>
                  <select
                    value={formData.statusSertifikasi || 'Belum Sertifikasi'}
                    onChange={(e) => handleChange('statusSertifikasi', e.target.value as StatusSertifikasi)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    <option value="Sertifikasi">Sudah Sertifikasi (Lulus Serdik)</option>
                    <option value="Proses PPG">Proses PPG / Dalam Jabatan</option>
                    <option value="Belum Sertifikasi">Belum Sertifikasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nomor Sertifikat Pendidik (Jika ada)</label>
                  <input
                    type="text"
                    placeholder="Nomor Serdik 12 Digit"
                    value={formData.noSertifikat || ''}
                    onChange={(e) => handleChange('noSertifikat', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Catatan Khusus Kepegawaian / Yayasan</label>
                <textarea
                  rows={3}
                  placeholder="Informasi pengurusan SIMPATIKA, SK Yayasan, Keaktifan Organisasi..."
                  value={formData.catatan || ''}
                  onChange={(e) => handleChange('catatan', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: TUGAS & AKADEMIK */}
          {activeTab === 'akademik' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Mata Pelajaran Utama / Guru Kelas *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Guru Kelas / Tematik, Bahasa Arab, Akidah Akhlak, IPA"
                    value={formData.mapelUtama || ''}
                    onChange={(e) => handleChange('mapelUtama', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Jumlah Jam Mengajar (JJM) / Mgg</label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={formData.jamMengajar || 24}
                    onChange={(e) => handleChange('jamMengajar', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-800"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Standard Sertifikasi: 24 Jam</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tugas Tambahan / Jabatan</label>
                <input
                  type="text"
                  placeholder="misal: Wali Kelas VI-A, Kepala RA, Waka Kurikulum, Pembina Pramuka"
                  value={formData.tugasTambahan || ''}
                  onChange={(e) => handleChange('tugasTambahan', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Riwayat Pendidikan Terakhir</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Jenjang Pendidikan</label>
                    <select
                      value={formData.pendidikanTerakhir || 'S1'}
                      onChange={(e) => handleChange('pendidikanTerakhir', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                    >
                      <option value="D3">D3 (Diploma 3)</option>
                      <option value="S1">S1 (Sarjana)</option>
                      <option value="S2">S2 (Magister)</option>
                      <option value="S3">S3 (Doktor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Jurusan / Program Studi</label>
                    <input
                      type="text"
                      placeholder="PGMI, PIAUD, PAI, M.Pd, dll"
                      value={formData.jurusan || ''}
                      onChange={(e) => handleChange('jurusan', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Tahun Lulus</label>
                    <input
                      type="number"
                      placeholder="2018"
                      value={formData.tahunLulus || 2018}
                      onChange={(e) => handleChange('tahunLulus', parseInt(e.target.value) || 2018)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nama Perguruan Tinggi / Universitas</label>
                  <input
                    type="text"
                    placeholder="UIN Syarif Hidayatullah Jakarta, UNJ, dll"
                    value={formData.universitas || ''}
                    onChange={(e) => handleChange('universitas', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'akademik' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'pribadi' ? 'kepegawaian' : 'akademik')}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  Lanjut →
                </button>
              )}

              <button
                type="submit"
                id="btn-save-teacher-submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Data Guru</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
