export type UnitType = 'ALL' | 'RA' | 'MI' | 'MTS';

export type StatusPegawai = 'GTY' | 'GTT' | 'PNS' | 'PPPK' | 'PTY' | 'PTTY';

export type StatusSertifikasi = 'Sertifikasi' | 'Belum Sertifikasi' | 'Proses PPG';

export interface SKDocument {
  id: string;
  teacherId: string;
  nomorSK: string;
  jenisSK: 'SK Pengangkatan Yayasan' | 'SK Pembagian Tugas Mengajar' | 'SK Kepala Madrasah' | 'SK Sertifikasi' | 'Lainnya';
  tanggalTerbit: string;
  tahunAjaran: string;
  fileName: string;
  fileSize?: string;
  fileDataUrl?: string;
  catatan?: string;
  uploadedAt: string;
}

export interface Teacher {
  id: string;
  nuptk: string;
  nik: string;
  nama: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  jenisKelamin: 'L' | 'P';
  unit: 'RA' | 'MI' | 'MTS';
  statusPegawai: StatusPegawai;
  statusSertifikasi: StatusSertifikasi;
  noSertifikat?: string;
  tmt: string; // Tanggal Mulai Tugas (YYYY-MM-DD)
  mapelUtama: string;
  tugasTambahan?: string; // misal: Wali Kelas VI, Kepala RA, Waka Kurikulum, Pembina Pramuka
  jamMengajar: number; // Jumlah Jam Mengajar (JJM) per minggu
  pendidikanTerakhir: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'D3' | 'D4' | 'S1' | 'S2' | 'S3';
  jurusan: string;
  universitas: string;
  tahunLulus: number;
  email: string;
  phone: string;
  alamat: string;
  tempatLahir: string;
  tanggalLahir: string;
  avatarUrl?: string;
  catatan?: string;
  skList?: SKDocument[];
  isNonaktif?: boolean;
  tanggalNonaktif?: string;
  alasanNonaktif?: string;
}

export interface FilterState {
  search: string;
  unit: UnitType;
  statusPegawai: string;
  statusSertifikasi: string;
  pendidikan: string;
  statusKeaktifan: 'ALL' | 'AKTIF' | 'NONAKTIF';
  sortBy: 'nama' | 'unit' | 'jamMengajar' | 'tmt';
  sortOrder: 'asc' | 'desc';
}

export interface FoundationInfo {
  namaYayasan: string;
  noAkta: string;
  alamat: string;
  ketuaYayasan: string;
  email: string;
  telepon: string;
  logoUrl?: string;
}
