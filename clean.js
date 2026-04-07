const fs = require('fs');

const filePath = process.argv[2]; 

if (!filePath) {
    console.error("Error: Tolong sebutkan nama file yang mau dibersihkan.");
    process.exit(1);
}

try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Mesin peramping: Menghapus komentar dan merapatkan spasi kosong
    const cleaned = content
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') 
        .replace(/\n\s*\n/g, '\n')              
        .replace(/[ \t]+/g, ' ')                
        .trim();

    console.log(cleaned);
} catch (err) {
    console.error("Gagal membaca file: " + err.message);
}