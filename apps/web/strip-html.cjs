const fs = require('fs');
const path = require('path');

const dir = 'src/pages';
const files = ['StatistikPublik.tsx', 'ProfilPengguna.tsx'];

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');
    
    // Extract everything between <body...> and </body>
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    
    if (bodyMatch) {
        let inner = bodyMatch[1];
        
        // Remove <script> tags if any remain inside body
        inner = inner.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        // We need to keep the imports and export
        const pre = `import React from 'react';\nimport { Link } from 'react-router-dom';\nimport { useNavigate } from 'react-router-dom';\n\nconst ${file.replace('.tsx', '')} = () => {\n    const navigate = useNavigate();\n    return (\n        <React.Fragment>\n`;
        const post = `\n        </React.Fragment>\n    );\n};\n\nexport default ${file.replace('.tsx', '')};\n`;
        
        fs.writeFileSync(path.join(dir, file), pre + inner + post);
        console.log(`Cleaned ${file}`);
    } else {
        console.log(`Could not find body tag in ${file}`);
    }
});
