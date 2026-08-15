import React, { useState } from 'react';
import { Teacher, SKDocument } from '../types';
import { X, FileText, Upload, CheckCircle2, Download, Trash2, Search, Filter, Eye, FileCheck, Calendar, User, FilePlus } from 'lucide-react';

interface SKUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  selectedTeacherId?: string;
  onSaveSK: (skDoc: SKDocument, teacherId: string) => void;
  onDeleteSK: (skId: string, teacherId: string) => void;
}

export const SKUploadModal: React.FC<SKUploadModalProps> = ({
  isOpen,
  onClose,
  teachers,
  selectedTeacherId,
  onSaveSK,
  onDeleteSK,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'vault'>('upload');
  
  // Form State
  const [targetTeacherId, setTargetTeacherId] = useState<string>(
    selectedTeacherId || (teachers[0]?.id || '')
  );
  const [nomorSK, setNomorSK] = useState<string>('');
  const [jenisSK, setJenisSK] = useState<SKDocument['jenisSK']>('SK Pembagian Tugas Mengajar');
  const [tahunAjaran, setTahunAjaran] = useState<string>('2024/2025');
  const [tanggalTerbit, setTanggalTerbit] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [catatan, setCatatan] = useState<string>('');
  
  // File Upload State
  const [fileObject, setFileObject] = useState<{
    name: string;
    size: string;
    dataUrl?: string;
  } | null>(null);
  
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Vault Filter
  const [vaultSearch, setVaultSearch] = useState<string>('');
  const [vaultJenisFilter, setVaultJenisFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file) return;

    // Format size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const formattedSize = `${sizeInMB} MB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileObject({
        name: file.name,
        size: formattedSize,
        dataUrl: e.target?.result as string,
      });
      setErrorMsg('');
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file. Silakan coba lagi.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!targetTeacherId) {
      setErrorMsg('Silakan pilih guru penerima SK.');
      return;
    }
    if (!nomorSK.trim()) {
      setErrorMsg('Nomor SK tidak boleh kosong.');
      return;
    }
    if (!fileObject) {
      setErrorMsg('Silakan pilih atau unggah berkas SK (PDF / Gambar).');
      return;
    }

    const newSK: SKDocument = {
      id: `SK-${Date.now().toString().slice(-6)}`,
      teacherId: targetTeacherId,
      nomorSK: nomorSK.trim(),
      jenisSK: jenisSK,
      tanggalTerbit: tanggalTerbit,
      tahunAjaran: tahunAjaran,
      fileName: fileObject.name,
      fileSize: fileObject.size,
      fileDataUrl: fileObject.dataUrl,
      catatan: catatan.trim(),
      uploadedAt: new Date().toISOString(),
    };

    onSaveSK(newSK, targetTeacherId);

    setSuccessMsg(`Berhasil mengunggah ${jenisSK} No. ${nomorSK}`);
    
    // Reset Form
    setNomorSK('');
    setCatatan('');
    setFileObject(null);

    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('vault');
    }, 1500);
  };

  // Collect all SKs across all teachers
  const allSKDocs: { doc: SKDocument; teacher: Teacher }[] = teachers.flatMap((t) =>
    (t.skList || []).map((doc) => ({ doc, teacher: t }))
  );

  const filteredVaultDocs = allSKDocs.filter(({ doc, teacher }) => {
    if (vaultJenisFilter !== 'ALL' && doc.jenisSK !== vaultJenisFilter) return false;
    if (vaultSearch.trim() !== '') {
      const q = vaultSearch.toLowerCase();
      return (
        doc.nomorSK.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        teacher.nama.toLowerCase().includes(q) ||
        doc.tahunAjaran.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 rounded-xl border border-emerald-700 text-emerald-300">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Layanan Upload & Vault SK Guru</h2>
              <p className="text-xs text-emerald-200">
                Arsip Dokumen Resmi SK Pengangkatan, Tugas Mengajar, & Sertifikasi Yayasan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher Bar */}
        <div className="bg-slate-50 px-6 pt-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Form Upload SK Baru</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'vault'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Arsip SK Tersimpan ({allSKDocs.length})</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          
          {activeTab === 'upload' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <strong>{successMsg}</strong>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                  <strong>Peringatan:</strong> {errorMsg}
                </div>
              )}

              {/* Grid Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Pilih Guru */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pilih Guru / Pendidik Penerima SK *
                  </label>
                  <select
                    value={targetTeacherId}
                    onChange={(e) => setTargetTeacherId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.unit}] {t.gelarDepan ? t.gelarDepan + ' ' : ''}{t.nama}{t.gelarBelakang ? ', ' + t.gelarBelakang : ''} — {t.mapelUtama} ({t.statusPegawai})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jenis SK */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jenis Dokumen SK *
                  </label>
                  <select
                    value={jenisSK}
                    onChange={(e) => setJenisSK(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="SK Pembagian Tugas Mengajar">SK Pembagian Tugas Mengajar</option>
                    <option value="SK Pengangkatan Yayasan">SK Pengangkatan Yayasan (GTY/GTT)</option>
                    <option value="SK Kepala Madrasah">SK Pengangkatan Kepala Madrasah</option>
                    <option value="SK Sertifikasi">SK Sertifikasi Pendidik / PPG</option>
                    <option value="Lainnya">Dokumen / SK Lainnya</option>
                  </select>
                </div>

                {/* Nomor SK */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nomor SK Resmi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SK/YPI-AH/2024/012"
                    value={nomorSK}
                    onChange={(e) => setNomorSK(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Tahun Ajaran */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tahun Ajaran / Berlaku *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 2024/2025"
                    value={tahunAjaran}
                    onChange={(e) => setTahunAjaran(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Tanggal Terbit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Terbit SK *
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalTerbit}
                    onChange={(e) => setTanggalTerbit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Catatan */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Catatan / Keterangan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: SK Tugas Mengajar Semester Ganjil TA 2024/2025"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* File Upload Box */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Unggah Berkas SK (PDF / Gambar) *
                  </label>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      isDragOver
                        ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
                        : fileObject
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                    }`}
                  >
                    {fileObject ? (
                      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-emerald-200 max-w-md mx-auto shadow-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="text-left min-w-0">
                            <p className="font-bold text-slate-800 truncate text-xs sm:text-sm">
                              {fileObject.name}
                            </p>
                            <span className="text-[11px] text-slate-500">Ukuran: {fileObject.size}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFileObject(null)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Hapus File"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Tarik & Lepaskan File SK di sini, atau <span className="text-emerald-700 underline cursor-pointer">Pilih File</span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Format yang didukung: PDF, PNG, JPG (Maks. 10MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileChange(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                          id="input-sk-file"
                        />
                        <label
                          htmlFor="input-sk-file"
                          className="inline-block mt-2 px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          Cari Berkas Komputer
                        </label>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  id="btn-submit-sk"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Simpan & Arsipkan Dokumen SK</span>
                </button>
              </div>

            </form>
          ) : (
            /* Archive Vault View */
            <div className="space-y-4">
              
              {/* Vault Search & Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari No SK, nama guru, berkas..."
                    value={vaultSearch}
                    onChange={(e) => setVaultSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-500">Filter Jenis:</span>
                  <select
                    value={vaultJenisFilter}
                    onChange={(e) => setVaultJenisFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="ALL">Semua Jenis SK</option>
                    <option value="SK Pembagian Tugas Mengajar">SK Tugas Mengajar</option>
                    <option value="SK Pengangkatan Yayasan">SK Pengangkatan</option>
                    <option value="SK Kepala Madrasah">SK Kepala Madrasah</option>
                    <option value="SK Sertifikasi">SK Sertifikasi</option>
                  </select>
                </div>
              </div>

              {/* Table Archive */}
              {filteredVaultDocs.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-xs sm:text-sm">Belum Ada Dokumen SK Tersimpan</p>
                  <p className="text-xs text-slate-500">Gunakan tab "Form Upload SK Baru" untuk mengunggah dokumen SK guru.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">Guru & Unit</th>
                        <th className="p-3">Nomor SK</th>
                        <th className="p-3">Jenis Dokumen</th>
                        <th className="p-3">Tahun Ajaran</th>
                        <th className="p-3">Tanggal Terbit</th>
                        <th className="p-3">Nama Berkas</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filteredVaultDocs.map(({ doc, teacher }) => (
                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{teacher.nama}</div>
                            <span className="text-[10px] px-1.5 py-0.2 font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {teacher.unit}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-800">
                            {doc.nomorSK}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200 text-[11px]">
                              {doc.jenisSK}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {doc.tahunAjaran}
                          </td>
                          <td className="p-3 text-slate-600">
                            {doc.tanggalTerbit}
                          </td>
                          <td className="p-3 text-slate-600 max-w-[150px] truncate" title={doc.fileName}>
                            <div className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{doc.fileName}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {doc.fileDataUrl && (
                                <a
                                  href={doc.fileDataUrl}
                                  download={doc.fileName}
                                  title="Unduh Berkas SK"
                                  className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus dokumen SK ${doc.nomorSK}?`)) {
                                    onDeleteSK(doc.id, teacher.id);
                                  }
                                }}
                                title="Hapus SK"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Total Arsip SK Terdaftar: <strong className="text-slate-800">{allSKDocs.length} Dokumen</strong>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
