import React from 'react';
import { Teacher, FoundationInfo, UnitType } from '../types';
import { X, Printer, Download, Building2 } from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  foundation: FoundationInfo;
  activeUnit: UnitType;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  teachers,
  foundation,
  activeUnit,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalRA = teachers.filter((t) => t.unit === 'RA').length;
  const totalMI = teachers.filter((t) => t.unit === 'MI').length;
  const totalMTS = teachers.filter((t) => t.unit === 'MTS').length;

  const totalCertified = teachers.filter((t) => t.statusSertifikasi === 'Sertifikasi').length;
  const totalGTY = teachers.filter((t) => t.statusPegawai === 'GTY').length;
  const totalGTT = teachers.filter((t) => t.statusPegawai === 'GTT').length;
  const totalPNS = teachers.filter((t) => t.statusPegawai === 'PNS' || t.statusPegawai === 'PPPK').length;

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Screen Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Printer className="w-5 h-5 text-emerald-300" /> Pratinjau Cetak Laporan Rekapitulasi Data Guru
            </h2>
            <p className="text-xs text-emerald-200">
              Format Dokumen Cetak Resmikan {foundation.namaYayasan}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="btn-trigger-print"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Printable Document */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 text-slate-900 print:p-10 font-sans">
          
          {/* KOP YAYASAN */}
          <div className="text-center border-b-4 border-slate-900 pb-4">
            <h3 className="text-sm font-extrabold tracking-widest text-emerald-900 uppercase">
              YAYASAN PENDIDIKAN ISLAM
            </h3>
            <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight my-0.5">
              {foundation.namaYayasan}
            </h1>
            <p className="text-xs text-slate-700 font-medium">
              Akta Notaris: {foundation.noAkta} | Telp: {foundation.telepon} | Email: {foundation.email}
            </p>
            <p className="text-xs text-slate-600 italic">
              {foundation.alamat}
            </p>
          </div>

          {/* DOCUMENT TITLE */}
          <div className="text-center my-4">
            <h2 className="text-lg font-bold uppercase underline tracking-wider text-slate-900">
              REKAPITULASI DATA PENDIDIK & TENAGA KEPENDIDIKAN YAYASAN
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Unit Layanan Pendidikan: Raudhatul Athfal (RA), Madrasah Ibtidaiyah (MI), & Madrasah Tsanawiyah (MTs)
            </p>
          </div>

          {/* STATS REKAP BOX */}
          <div className="grid grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-300">
            <div>
              <span className="text-slate-500 block">Total Pendidik:</span>
              <strong className="text-base text-slate-900">{teachers.length} Orang</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Distribusi Unit:</span>
              <span className="font-semibold text-slate-800">RA: {totalRA} | MI: {totalMI} | MTs: {totalMTS}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Sertifikasi Pendidik:</span>
              <strong className="text-emerald-800">{totalCertified} Orang</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Status Pegawai:</span>
              <span className="font-semibold text-slate-800">GTY: {totalGTY} | GTT: {totalGTT} | PNS/PPPK: {totalPNS}</span>
            </div>
          </div>

          {/* MAIN TABLE */}
          <table className="w-full text-left text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold uppercase text-[11px] border-b border-slate-400">
                <th className="p-2 border border-slate-400 text-center w-8">No</th>
                <th className="p-2 border border-slate-400">Nama Guru & Gelar</th>
                <th className="p-2 border border-slate-400 text-center">Unit</th>
                <th className="p-2 border border-slate-400">NUPTK / NIK</th>
                <th className="p-2 border border-slate-400">Status Pegawai</th>
                <th className="p-2 border border-slate-400">Sertifikasi</th>
                <th className="p-2 border border-slate-400">Mapel / Tugas Utama</th>
                <th className="p-2 border border-slate-400 text-center">JJM</th>
                <th className="p-2 border border-slate-400">Pendidikan</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, idx) => {
                const fullName = `${t.gelarDepan ? t.gelarDepan + ' ' : ''}${t.nama}${t.gelarBelakang ? ', ' + t.gelarBelakang : ''}`;
                return (
                  <tr key={t.id} className="border-b border-slate-300 hover:bg-slate-50">
                    <td className="p-2 border border-slate-300 text-center font-bold">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-semibold">{fullName}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold">{t.unit}</td>
                    <td className="p-2 border border-slate-300 font-mono text-[11px]">
                      {t.nuptk || '-'}
                    </td>
                    <td className="p-2 border border-slate-300">{t.statusPegawai}</td>
                    <td className="p-2 border border-slate-300">{t.statusSertifikasi}</td>
                    <td className="p-2 border border-slate-300">{t.mapelUtama}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold">{t.jamMengajar}</td>
                    <td className="p-2 border border-slate-300">{t.pendidikanTerakhir} - {t.jurusan}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* SIGNATURE SECTION */}
          <div className="pt-10 grid grid-cols-3 text-center text-xs gap-4 font-sans">
            <div>
              <p className="text-slate-600 mb-16">Mengetahui,<br/>Kepala RA / MI / MTs,</p>
              <p className="font-bold text-slate-900 underline">Drs. H. Abdullah Mansur, M.Ag.</p>
              <p className="text-[11px] text-slate-500">NIP / NUPTK. 3128765490100045</p>
            </div>

            <div>
              <p className="text-slate-600 mb-16">Pengurus / Admin SIMPATIKA,</p>
              <p className="font-bold text-slate-900 underline">Fikri Haikal, S.Kom.</p>
              <p className="text-[11px] text-slate-500">Operator Yayasan</p>
            </div>

            <div>
              <p className="text-slate-600 mb-16">
                Bogor, {currentDateFormatted}<br/>
                Ketua Yayasan Al-Falah,
              </p>
              <p className="font-bold text-slate-900 underline">{foundation.ketuaYayasan}</p>
              <p className="text-[11px] text-slate-500">Ketua Umum Pengurus</p>
            </div>
          </div>

        </div>

        {/* Footer Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg transition-colors"
          >
            Tutup Pratinjau
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Resmikan</span>
          </button>
        </div>

      </div>
    </div>
  );
};
