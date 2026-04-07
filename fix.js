const fs = require("fs");
const path = require("path");

// 1. Daftar file yang mau diambil (tambah di sini kalau mau lebih banyak)
const inputFiles = ["pages/index.vue", "components/TechStack.vue"];
const outputPath = "prompt_siap.txt";

let finalContent = "";

inputFiles.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  
  if (fs.existsSync(fullPath)) {
    console.log("Membaca file:", file);
    const content = fs.readFileSync(fullPath, "utf-8");
    
    // 2. Membersihkan komentar (// dan /* */) agar hemat token Claude
    // Tapi tetap menjaga <script> dan <template> utuh
    const cleaned = content
      .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "") // Hapus komentar
      .replace(/^\s*[\r\n]/gm, "") // Hapus baris kosong berlebih
      .trim();
      
    finalContent += `\n--- START FILE: ${file} ---\n${cleaned}\n--- END FILE: ${file} ---\n`;
  } else {
    console.warn("⚠️ File tidak ditemukan:", file);
  }
});

// 3. Tulis hasil gabungan ke satu file txt
if (finalContent) {
  fs.writeFileSync(outputPath, finalContent);
  console.log("\n✅ Berhasil! Silakan buka:", outputPath);
} else {
  console.error("\n❌ Tidak ada file yang berhasil dibaca.");
}