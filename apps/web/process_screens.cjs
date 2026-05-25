const fs = require('fs');
const https = require('https');
const path = require('path');

const screens = [
  {
    name: 'BuatPostingan',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2FkNzg3NDBkMDEzMTRiMTU5NDVjZDhjZjRkMzFlNmMwEgsSBxCf353dhhgYAZIBIwoKcHJvamVjdF9pZBIVQhMyNTQxNjU4NTI3MzE1MTk1MTA4&filename=&opi=89354086'
  },
  {
    name: 'KomunitasForum',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzMzNTVkYTY1N2E0NjQzZGRhODFmZTFjZmRiMTg2ZGU4EgsSBxCf353dhhgYAZIBIwoKcHJvamVjdF9pZBIVQhMyNTQxNjU4NTI3MzE1MTk1MTA4&filename=&opi=89354086'
  }
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

const mappings = [
    { regex: />(Home Feed|Beranda|Home)</gi, path: '/' },
    { regex: />(My Reports|Laporanku|Laporan)</gi, path: '/laporanku' },
    { regex: />(News Portal|Berita|Portal Berita)</gi, path: '/berita' },
    { regex: />(Admin Dashboard|Admin)</gi, path: '/admin' },
    { regex: />(Statistik Publik|Statistik)</gi, path: '/statistik' },
    { regex: />(Profil|Profile|Profil Pengguna)</gi, path: '/profil' },
    { regex: />(Report Emergency|Buat Laporan Baru|Lapor)</gi, path: '/lapor' },
    { regex: />(Komunitas|Forum Bebas|Komunitas & Forum Bebas)</gi, path: '/komunitas' },
    { regex: />(Buat Postingan|Postingan|Buat Postingan Komunitas)</gi, path: '/buat-postingan' }
];

async function processScreens() {
  for (const screen of screens) {
    let content = await download(screen.url);
    
    // Extract everything between <body...> and </body>
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      let jsx = bodyMatch[1];
      
      // Remove <script> tags
      jsx = jsx.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      
      // Reactify HTML
      jsx = jsx.replace(/class=/g, 'className=');
      jsx = jsx.replace(/for=/g, 'htmlFor=');
      jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');
      
      // Self-closing tags
      const selfClosing = ['input', 'img', 'br', 'hr', 'meta', 'link'];
      selfClosing.forEach(tag => {
          const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
          jsx = jsx.replace(regex, `<${tag}$1 />`);
      });

      // Inline styles
      jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
          const styleObj = {};
          p1.split(';').forEach(rule => {
              const parts = rule.split(':');
              if (parts.length === 2) {
                  let key = parts[0].trim();
                  key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                  styleObj[key] = parts[1].trim();
              }
          });
          return `style={${JSON.stringify(styleObj)}}`;
      });

      // Navigation links
      jsx = jsx.replace(/<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*)>(.*?)<\/a>/gis, (match, p1, p2, p3, p4, p5) => {
          return `<Link ${p1}to=${p2}${p3}${p2}${p4}>${p5}</Link>`;
      });

      jsx = jsx.replace(/<Link\s+([^>]*?)to=(["'])(.*?)\2([^>]*)>(.*?)<\/Link>/gis, (match, p1, p2, p3, p4, p5) => {
          let newTo = p3;
          for (const map of mappings) {
              if (map.regex.test(`>${p5}<`)) {
                  newTo = map.path;
                  break;
              }
          }
          return `<Link ${p1}to=${p2}${newTo}${p2}${p4}>${p5}</Link>`;
      });

      const tsxCode = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nconst ${screen.name} = () => {\n    return (\n        <React.Fragment>\n${jsx}\n        </React.Fragment>\n    );\n};\n\nexport default ${screen.name};\n`;
      
      fs.writeFileSync(path.join('src/pages', `${screen.name}.tsx`), tsxCode);
      console.log(`Generated ${screen.name}.tsx`);
    } else {
      console.log(`Could not find body tag in downloaded content for ${screen.name}`);
    }
  }
}

processScreens().catch(console.error);
