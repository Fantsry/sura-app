const fs = require('fs');
const path = require('path');

const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const mappings = [
    { regex: />(Home Feed|Beranda|Home)</gi, path: '/' },
    { regex: />(My Reports|Laporanku|Laporan)</gi, path: '/laporanku' },
    { regex: />(News Portal|Berita|Portal Berita)</gi, path: '/berita' },
    { regex: />(Admin Dashboard|Admin)</gi, path: '/admin' },
    { regex: />(Statistik Publik|Statistik)</gi, path: '/statistik' },
    { regex: />(Profil|Profile|Profil Pengguna)</gi, path: '/profil' },
    { regex: />(Report Emergency|Buat Laporan Baru|Lapor)</gi, path: '/lapor' }
];

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');
    let changed = false;

    // 1. Remove google fonts link tags as they should be in index.html
    const oldContent = content;
    content = content.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '');
    
    // 2. Change <a href="...">...</a> to <Link to="...">...</Link>
    content = content.replace(/<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*)>(.*?)<\/a>/gis, (match, p1, p2, p3, p4, p5) => {
        return `<Link ${p1}to=${p2}${p3}${p2}${p4}>${p5}</Link>`;
    });

    // 3. For all Link tags, update 'to' based on text content
    content = content.replace(/<Link\s+([^>]*?)to=(["'])(.*?)\2([^>]*)>(.*?)<\/Link>/gis, (match, p1, p2, p3, p4, p5) => {
        let newTo = p3;
        for (const map of mappings) {
            if (map.regex.test(`>${p5}<`)) {
                newTo = map.path;
                break;
            }
        }
        return `<Link ${p1}to=${p2}${newTo}${p2}${p4}>${p5}</Link>`;
    });

    // 4. Ensure Link is imported if it's used
    if (content.includes('<Link') && !content.includes('import { Link }')) {
        content = content.replace(/import React[^;]*;/, "$&\nimport { Link } from 'react-router-dom';");
    }

    if (content !== oldContent) {
        fs.writeFileSync(path.join(dir, file), content);
        console.log(`Updated ${file}`);
    }
});
