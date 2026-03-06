const fs = require('fs');
const path = require('path');
const files = ['App.jsx', 'pages/Login.jsx', 'pages/Dashboard.jsx', 'pages/Guardian.jsx', 'pages/Settings.jsx', 'pages/Reports.jsx'].map(f => path.join('src', f));

let keys = {};
files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const regex = /t\(['"]([a-zA-Z0-9_.-]+)['"]\s*,\s*['"]((?:[^'"\\]|\\.)*)['"]\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        keys[match[1]] = match[2];
    }
});
fs.writeFileSync('extracted_keys.json', JSON.stringify(keys, null, 2));
