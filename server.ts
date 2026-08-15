import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK if API key exists
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!apiKey });
});

// AI Admin Assistant Endpoint for Yayasan Teacher Data
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { action, teachers, promptCustom } = req.body;

    if (!ai) {
      return res.status(500).json({
        error: "API Key Gemini belum terkonfigurasi di lingkungan server.",
      });
    }

    let prompt = "";

    if (action === "analyze_workload") {
      prompt = `
Kamu adalah Konsultan Manajemen Pendidikan Islam di Indonesia.
Analisis data guru yayasan berikut (terdiri dari unit RA, MI, MTs).
Data Guru: ${JSON.stringify(teachers.map((t: any) => ({
        nama: t.nama,
        unit: t.unit,
        statusPegawai: t.statusPegawai,
        statusSertifikasi: t.statusSertifikasi,
        jamMengajar: t.jamMengajar,
        mapelUtama: t.mapelUtama,
      })))}

Berikan analisis dalam bahasa Indonesia yang terstruktur:
1. **Ringkasan Beban Kerja (JJM)**: Apakah pemenuhan target 24 jam mengajar sertifikasi sudah optimal?
2. **Keseimbangan Guru per Unit (RA, MI, MTs)**: Apakah ada ketimpangan beban kerja?
3. **Saran & Rekomendasi**: Tiga tindakan konkret untuk pengurus yayasan dalam penataan jadwal & beban kerja.
`;
    } else if (action === "draft_sk") {
      const teacher = teachers[0] || {};
      prompt = `
Buatkan draf resmi "Surat Keterangan Pengalaman Mengajar / Surat Tugas" dari Yayasan Pendidikan Islam Al-Falah untuk guru berikut:
- Nama: ${teacher.nama || 'Nama Guru'}
- NUPTK/NIK: ${teacher.nuptk || teacher.nik || '-'}
- Unit Tugas: ${teacher.unit || 'MI'}
- Status Pegawai: ${teacher.statusPegawai || 'GTY'}
- Mata Pelajaran: ${teacher.mapelUtama || 'Tematik'}
- TMT (Tanggal Mulai Tugas): ${teacher.tmt || '2020-07-15'}

Format draf harus sangat resmi, rapi, santun, sesuai standar tata naskah dinas instansi/yayasan pendidikan di Indonesia, menggunakan Bahasa Indonesia formal.
`;
    } else if (action === "training_recommendation") {
      prompt = `
Berdasarkan data kualifikasi dan status sertifikasi guru yayasan (RA, MI, MTs) berikut:
${JSON.stringify(teachers.map((t: any) => ({
        nama: t.nama,
        unit: t.unit,
        pendidikanTerakhir: t.pendidikanTerakhir,
        jurusan: t.jurusan,
        statusSertifikasi: t.statusSertifikasi,
        mapelUtama: t.mapelUtama
      })))}

Berikan rekomendasi program pengembangan keprofesian berkelanjutan (PKB / Pelatihan Guru) yang paling dibutuhkan oleh guru RA, MI, dan MTs di yayasan ini.
Sajikan dalam poin-poin yang jelas dan praktis.
`;
    } else {
      prompt = promptCustom || "Berikan ringkasan laporan evaluasi data guru yayasan.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({ result: response.text });
  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    return res.status(500).json({ error: error.message || "Gagal memproses permintaan AI." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Data Guru Yayasan running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
