import React, { useState, useEffect } from 'react';
import { Teacher, UnitType, SKDocument } from './types';
import { INITIAL_TEACHERS, INITIAL_FOUNDATION } from './data/initialData';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { TeacherCard } from './components/TeacherCard';
import { TeacherTable } from './components/TeacherTable';
import { TeacherModal } from './components/TeacherModal';
import { TeacherDetailModal } from './components/TeacherDetailModal';
import { SKUploadModal } from './components/SKUploadModal';
import { PrintReportModal } from './components/PrintReportModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { DeactivateModal } from './components/DeactivateModal';
import { LoginPage } from './components/LoginPage';
import { LayoutGrid, Table, Filter, RotateCcw, Download, Database, Upload, UserX, UserCheck } from 'lucide-react';

const STORAGE_KEY = 'yayasan_data_guru_alhasanah_official_v2';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username: string, password: string) => {
    if (
      (username === 'Ketua Yayasan' && password === '1111Robinson_') ||
      (username === 'SIPANDU2026' && password === 'SIPANDU2026')
    ) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Load initial data from localStorage or fallback to default dataset
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved teacher data', e);
    }
    return INITIAL_TEACHERS;
  });

  const [foundation] = useState(INITIAL_FOUNDATION);

  // Filters & Sorting State
  const [activeUnit, setActiveUnit] = useState<UnitType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusPegawaiFilter, setStatusPegawaiFilter] = useState<string>('ALL');
  const [statusSertifikasiFilter, setStatusSertifikasiFilter] = useState<string>('ALL');
  const [pendidikanFilter, setPendidikanFilter] = useState<string>('ALL');
  const [statusKeaktifanFilter, setStatusKeaktifanFilter] = useState<'ALL' | 'AKTIF' | 'NONAKTIF'>('ALL');
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'nama' | 'unit' | 'jamMengajar' | 'tmt'>('nama');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  const [isSKModalOpen, setIsSKModalOpen] = useState<boolean>(false);
  const [selectedTeacherIdForSK, setSelectedTeacherIdForSK] = useState<string | undefined>(undefined);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState<boolean>(false);
  const [deactivatingTeacher, setDeactivatingTeacher] = useState<Teacher | null>(null);

  // Persist teacher changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
    } catch (e) {
      console.error('Failed to save teacher data to localStorage', e);
    }
  }, [teachers]);

  // Handlers for CRUD
  const handleSaveTeacher = (teacherData: Partial<Teacher>) => {
    if (editingTeacher) {
      // Update existing
      setTeachers((prev) =>
        prev.map((t) => (t.id === editingTeacher.id ? ({ ...t, ...teacherData } as Teacher) : t))
      );
    } else {
      // Add new
      const newTeacher: Teacher = {
        id: `TCH-${teacherData.unit || 'MI'}-${Date.now().toString().slice(-4)}`,
        nuptk: teacherData.nuptk || '-',
        nik: teacherData.nik || '-',
        nama: teacherData.nama || 'Guru Baru',
        gelarDepan: teacherData.gelarDepan || '',
        gelarBelakang: teacherData.gelarBelakang || '',
        jenisKelamin: teacherData.jenisKelamin || 'L',
        unit: (teacherData.unit as any) || 'MI',
        statusPegawai: teacherData.statusPegawai || 'GTY',
        statusSertifikasi: teacherData.statusSertifikasi || 'Belum Sertifikasi',
        noSertifikat: teacherData.noSertifikat || '',
        tmt: teacherData.tmt || new Date().toISOString().split('T')[0],
        mapelUtama: teacherData.mapelUtama || 'Umum',
        tugasTambahan: teacherData.tugasTambahan || '',
        jamMengajar: teacherData.jamMengajar || 24,
        pendidikanTerakhir: teacherData.pendidikanTerakhir || 'S1',
        jurusan: teacherData.jurusan || 'Pendidikan',
        universitas: teacherData.universitas || '-',
        tahunLulus: teacherData.tahunLulus || new Date().getFullYear(),
        email: teacherData.email || '',
        phone: teacherData.phone || '',
        alamat: teacherData.alamat || '',
        tempatLahir: teacherData.tempatLahir || 'Bogor',
        tanggalLahir: teacherData.tanggalLahir || '1995-01-01',
        avatarUrl: teacherData.avatarUrl || '',
        catatan: teacherData.catatan || '',
      };
      setTeachers((prev) => [newTeacher, ...prev]);
    }
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  // Deactivation Handlers
  const handleToggleDeactivate = (teacher: Teacher) => {
    setDeactivatingTeacher(teacher);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmDeactivate = (teacherId: string, tanggal: string, alasan: string, catatan?: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          return {
            ...t,
            isNonaktif: true,
            tanggalNonaktif: tanggal,
            alasanNonaktif: alasan,
            catatan: catatan ? (t.catatan ? `${t.catatan}\n[Nonaktif ${tanggal}]: ${catatan}` : `[Nonaktif ${tanggal}]: ${catatan}`) : t.catatan,
          };
        }
        return t;
      })
    );

    // Update viewing teacher if currently open in detail modal
    if (viewingTeacher && viewingTeacher.id === teacherId) {
      setViewingTeacher((prev) =>
        prev
          ? {
              ...prev,
              isNonaktif: true,
              tanggalNonaktif: tanggal,
              alasanNonaktif: alasan,
            }
          : null
      );
    }
  };

  const handleConfirmReactivate = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          return {
            ...t,
            isNonaktif: false,
            tanggalNonaktif: undefined,
            alasanNonaktif: undefined,
          };
        }
        return t;
      })
    );

    if (viewingTeacher && viewingTeacher.id === teacherId) {
      setViewingTeacher((prev) =>
        prev
          ? {
              ...prev,
              isNonaktif: false,
              tanggalNonaktif: undefined,
              alasanNonaktif: undefined,
            }
          : null
      );
    }
  };

  // SK Management Handlers
  const handleOpenSKModal = (teacherId?: string) => {
    setSelectedTeacherIdForSK(teacherId);
    setIsSKModalOpen(true);
  };

  const handleSaveSK = (skDoc: SKDocument, targetTeacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === targetTeacherId) {
          const currentList = t.skList || [];
          return {
            ...t,
            skList: [skDoc, ...currentList],
          };
        }
        return t;
      })
    );

    // Update viewingTeacher if currently open in detail modal
    if (viewingTeacher && viewingTeacher.id === targetTeacherId) {
      setViewingTeacher((prev) =>
        prev
          ? {
              ...prev,
              skList: [skDoc, ...(prev.skList || [])],
            }
          : null
      );
    }
  };

  const handleDeleteSK = (skId: string, targetTeacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === targetTeacherId) {
          return {
            ...t,
            skList: (t.skList || []).filter((sk) => sk.id !== skId),
          };
        }
        return t;
      })
    );

    if (viewingTeacher && viewingTeacher.id === targetTeacherId) {
      setViewingTeacher((prev) =>
        prev
          ? {
              ...prev,
              skList: (prev.skList || []).filter((sk) => sk.id !== skId),
            }
          : null
      );
    }
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan data ke sampel awal yayasan?')) {
      setTeachers(INITIAL_TEACHERS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleBackupData = () => {
    const backupData = {
      version: '1.0',
      appName: 'SIMPATIKA Al-Hasanah',
      exportedAt: new Date().toISOString(),
      foundation: foundation.namaYayasan,
      totalTeachers: teachers.length,
      teachers: teachers,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Backup_Data_Guru_Al_Hasanah_${today}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleRestoreData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        let importedTeachers: Teacher[] = [];
        if (Array.isArray(parsed)) {
          importedTeachers = parsed;
        } else if (parsed && Array.isArray(parsed.teachers)) {
          importedTeachers = parsed.teachers;
        } else if (parsed && Array.isArray(parsed.data)) {
          importedTeachers = parsed.data;
        }

        if (importedTeachers.length > 0) {
          if (confirm(`Ditemukan ${importedTeachers.length} data guru dalam file backup. Lanjutkan pemulihan data?`)) {
            setTeachers(importedTeachers);
            alert(`Berhasil memulihkan ${importedTeachers.length} data guru!`);
          }
        } else {
          alert('Format file JSON tidak sesuai atau data guru kosong.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON backup. Pastikan format file valid.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'NUPTK',
      'NIK',
      'Nama Lengkap',
      'Unit',
      'Status Pegawai',
      'Status Sertifikasi',
      'No Sertifikat',
      'Mapel Utama',
      'Tugas Tambahan',
      'Jam Mengajar',
      'Pendidikan Terakhir',
      'Jurusan',
      'TMT',
      'No Telepon',
      'Email',
    ];

    const rows = filteredTeachers.map((t) => [
      t.id,
      t.nuptk,
      t.nik,
      `"${t.gelarDepan ? t.gelarDepan + ' ' : ''}${t.nama}${t.gelarBelakang ? ', ' + t.gelarBelakang : ''}"`,
      t.unit,
      t.statusPegawai,
      t.statusSertifikasi,
      t.noSertifikat || '',
      `"${t.mapelUtama}"`,
      `"${t.tugasTambahan || ''}"`,
      t.jamMengajar,
      t.pendidikanTerakhir,
      `"${t.jurusan}"`,
      t.tmt,
      t.phone,
      t.email,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Guru_Yayasan_${activeUnit}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSortChange = (column: 'nama' | 'unit' | 'jamMengajar' | 'tmt') => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Filter & Sort Logic
  const filteredTeachers = teachers
    .filter((t) => {
      // Filter by Unit
      if (activeUnit !== 'ALL' && t.unit !== activeUnit) return false;

      // Filter by Keaktifan
      if (statusKeaktifanFilter === 'AKTIF' && t.isNonaktif) return false;
      if (statusKeaktifanFilter === 'NONAKTIF' && !t.isNonaktif) return false;

      // Filter by Status Pegawai
      if (statusPegawaiFilter !== 'ALL' && t.statusPegawai !== statusPegawaiFilter) return false;

      // Filter by Sertifikasi
      if (statusSertifikasiFilter !== 'ALL' && t.statusSertifikasi !== statusSertifikasiFilter) return false;

      // Filter by Pendidikan
      if (pendidikanFilter !== 'ALL' && t.pendidikanTerakhir !== pendidikanFilter) return false;

      // Filter by Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const fullName = `${t.gelarDepan || ''} ${t.nama} ${t.gelarBelakang || ''}`.toLowerCase();
        return (
          fullName.includes(q) ||
          t.nuptk.toLowerCase().includes(q) ||
          t.nik.toLowerCase().includes(q) ||
          t.mapelUtama.toLowerCase().includes(q) ||
          (t.tugasTambahan && t.tugasTambahan.toLowerCase().includes(q)) ||
          t.jurusan.toLowerCase().includes(q) ||
          (t.alasanNonaktif && t.alasanNonaktif.toLowerCase().includes(q))
        );
      }

      return true;
    })
    .sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (sortBy === 'nama') {
        valA = a.nama.toLowerCase();
        valB = b.nama.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      
      {/* Top Header */}
      <Header
        foundation={foundation}
        activeUnit={activeUnit}
        onUnitChange={setActiveUnit}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={() => {
          setEditingTeacher(null);
          setIsAddEditModalOpen(true);
        }}
        onOpenSKModal={() => handleOpenSKModal()}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        totalTeachers={teachers.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Statistics Metric Cards */}
        <StatsOverview teachers={teachers} activeUnit={activeUnit} />

        {/* Filter Controls & View Toggle Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>Filter:</span>
            </div>

            {/* Filter Status Keaktifan */}
            <select
              value={statusKeaktifanFilter}
              onChange={(e) => setStatusKeaktifanFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Semua Keaktifan</option>
              <option value="AKTIF">Guru Aktif</option>
              <option value="NONAKTIF">Guru Nonaktif</option>
            </select>

            {/* Filter Status Pegawai */}
            <select
              value={statusPegawaiFilter}
              onChange={(e) => setStatusPegawaiFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Semua Status Pegawai</option>
              <option value="GTY">GTY (Guru Tetap Yayasan)</option>
              <option value="GTT">GTT (Guru Tidak Tetap)</option>
              <option value="PTY">PTY (Pegawai Tetap Yayasan)</option>
              <option value="PTTY">PTTY (Pegawai Tidak Tetap Yayasan)</option>
              <option value="PNS">PNS Diperbantukan</option>
              <option value="PPPK">PPPK Kementerian Agama</option>
            </select>

            {/* Filter Sertifikasi */}
            <select
              value={statusSertifikasiFilter}
              onChange={(e) => setStatusSertifikasiFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Semua Sertifikasi</option>
              <option value="Sertifikasi">Sudah Sertifikasi</option>
              <option value="Proses PPG">Proses PPG</option>
              <option value="Belum Sertifikasi">Belum Sertifikasi</option>
            </select>

            {/* Filter Pendidikan */}
            <select
              value={pendidikanFilter}
              onChange={(e) => setPendidikanFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Semua Jenjang</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
            </select>

            {(statusKeaktifanFilter !== 'ALL' || statusPegawaiFilter !== 'ALL' || statusSertifikasiFilter !== 'ALL' || pendidikanFilter !== 'ALL' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setStatusKeaktifanFilter('ALL');
                  setStatusPegawaiFilter('ALL');
                  setStatusSertifikasiFilter('ALL');
                  setPendidikanFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-red-600 hover:text-red-700 font-semibold underline text-xs ml-1"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* View Toggle & Count Badge */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className="text-xs text-slate-500">
              Menampilkan <strong className="text-slate-900">{filteredTeachers.length}</strong> dari {teachers.length} Guru
            </span>

            <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                title="Tampilan Kartu"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('table')}
                title="Tampilan Tabel"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Main Data Listing */}
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Tidak ada data guru yang cocok</h3>
            <p className="text-xs text-slate-500">
              Coba sesuaikan pencarian atau atur ulang filter unit, status kepegawaian, dan sertifikasi.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveUnit('ALL');
                setStatusPegawaiFilter('ALL');
                setStatusSertifikasiFilter('ALL');
                setPendidikanFilter('ALL');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Semua Filter
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeachers.map((t) => (
              <TeacherCard
                key={t.id}
                teacher={t}
                onViewDetail={(teacher) => {
                  setViewingTeacher(teacher);
                  setIsDetailModalOpen(true);
                }}
                onEdit={(teacher) => {
                  setEditingTeacher(teacher);
                  setIsAddEditModalOpen(true);
                }}
                onDelete={handleDeleteTeacher}
                onOpenSKModal={handleOpenSKModal}
                onToggleDeactivate={handleToggleDeactivate}
              />
            ))}
          </div>
        ) : (
          <TeacherTable
            teachers={filteredTeachers}
            onViewDetail={(teacher) => {
              setViewingTeacher(teacher);
              setIsDetailModalOpen(true);
            }}
            onEdit={(teacher) => {
              setEditingTeacher(teacher);
              setIsAddEditModalOpen(true);
            }}
            onDelete={handleDeleteTeacher}
            onOpenSKModal={handleOpenSKModal}
            onToggleDeactivate={handleToggleDeactivate}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} {foundation.namaYayasan}. Sistem Informasi Pendataan Guru RA, MI, MTs.</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden lg:inline">SIMPATIKA & EMIS Ready</span>
            <span className="hidden lg:inline">•</span>

            <button
              onClick={handleBackupData}
              title="Unduh berkas JSON cadangan seluruh data guru & SK untuk pencegahan kehilangan data"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-2xs transition-colors cursor-pointer text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup Data (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Pulihkan data guru dari file JSON backup sebelumnya"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer text-xs border border-slate-300"
            >
              <Upload className="w-3 h-3 text-slate-500" />
              <span>Restore</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleRestoreData}
              accept=".json"
              className="hidden"
            />

            <span>•</span>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-red-600 transition-colors underline text-xs cursor-pointer"
            >
              Reset Data Default
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TeacherModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingTeacher(null);
        }}
        onSave={handleSaveTeacher}
        initialTeacher={editingTeacher}
      />

      <TeacherDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingTeacher(null);
        }}
        teacher={viewingTeacher}
        foundation={foundation}
        onEdit={(teacher) => {
          setEditingTeacher(teacher);
          setIsAddEditModalOpen(true);
        }}
        onOpenSKModal={handleOpenSKModal}
        onToggleDeactivate={handleToggleDeactivate}
      />

      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        teacher={deactivatingTeacher}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setDeactivatingTeacher(null);
        }}
        onConfirmDeactivate={handleConfirmDeactivate}
        onConfirmReactivate={handleConfirmReactivate}
      />

      <SKUploadModal
        isOpen={isSKModalOpen}
        onClose={() => {
          setIsSKModalOpen(false);
          setSelectedTeacherIdForSK(undefined);
        }}
        teachers={teachers}
        selectedTeacherId={selectedTeacherIdForSK}
        onSaveSK={handleSaveSK}
        onDeleteSK={handleDeleteSK}
      />

      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        teachers={filteredTeachers}
        foundation={foundation}
        activeUnit={activeUnit}
      />

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        teachers={teachers}
      />

    </div>
  );
}
