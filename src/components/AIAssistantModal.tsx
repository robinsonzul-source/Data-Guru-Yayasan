import React, { useState } from 'react';
import { Teacher } from '../types';
import { X, Sparkles, Send, Bot, FileText, CheckCircle2, RefreshCw, Copy, Check } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  teachers,
}) => {
  const [selectedAction, setSelectedAction] = useState<'analyze_workload' | 'draft_sk' | 'training_recommendation' | 'custom'>('analyze_workload');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [responseResult, setResponseResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleGenerateAI = async () => {
    setLoading(true);
    setErrorMsg('');
    setResponseResult('');

    try {
      let targetTeachers = teachers;
      if (selectedAction === 'draft_sk') {
        const found = teachers.find((t) => t.id === selectedTeacherId);
        if (found) targetTeachers = [found];
      }

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: selectedAction,
          teachers: targetTeachers,
          promptCustom: customPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal terhubung dengan layanan AI.');
      }

      setResponseResult(data.result);
    } catch (err: any) {
      console.error('AI Error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses rekomendasi AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseResult) return;
    navigator.clipboard.writeText(responseResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-300/30">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Asisten AI Administrasi Guru Yayasan</h2>
              <p className="text-xs text-amber-100">Powered by Gemini AI - Solusi Cerdas Tata Kelola Guru (RA, MI, MTs)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-100 hover:text-white p-1 rounded-lg hover:bg-amber-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          
          {/* Quick Action Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Fitur / Konsultasi AI
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedAction('analyze_workload')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedAction === 'analyze_workload'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-semibold shadow-sm ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                  📊 Analisis Beban Kerja (JJM)
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Evaluasi target 24 jam mengajar & keseimbangan guru per unit.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('draft_sk')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedAction === 'draft_sk'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-semibold shadow-sm ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                  📜 Draf SK / Surat Tugas
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Buat draf resmi surat keterangan mengajar / pengasuhan guru.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('training_recommendation')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedAction === 'training_recommendation'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-semibold shadow-sm ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                  💡 Rekomendasi Pelatihan
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Program PKB & pengembangan kompetensi guru yang dibutuhkan.</p>
              </button>
            </div>
          </div>

          {/* Conditional Options */}
          {selectedAction === 'draft_sk' && (
            <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 space-y-1">
              <label className="block text-xs font-semibold text-amber-900">Pilih Guru untuk Pembuatan Draf Surat:</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.unit}] {t.nama} - {t.mapelUtama} ({t.statusPegawai})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Generate Button */}
          <div>
            <button
              onClick={handleGenerateAI}
              disabled={loading}
              id="btn-run-ai-generate"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                  <span>Gemini AI Sedang Mengolah Data Guru...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Jalankan Analisis / Hasilkan Rekomendasi AI</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              <strong>Error AI:</strong> {errorMsg}
            </div>
          )}

          {/* AI Output Result Box */}
          {responseResult && (
            <div className="mt-4 border border-slate-200 rounded-2xl bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Bot className="w-4 h-4 text-amber-600" /> Hasil Rekomendasi Gemini AI:
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans max-h-72 overflow-y-auto">
                {responseResult}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
