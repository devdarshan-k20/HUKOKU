import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keys = {};

function readDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            readDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const regex = /t\(['"]([a-zA-Z0-9_\-\.]+)['"]\s*,\s*['"]([^'"]+)['"]\)/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                keys[match[1]] = match[2];
            }

            // Handle double quotes for text
            const regexDouble = /t\(['"]([a-zA-Z0-9_\-\.]+)['"]\s*,\s*"([^"\\]*(?:\\.[^"\\]*)*)"\)/g;
            while ((match = regexDouble.exec(content)) !== null) {
                keys[match[1]] = match[2];
            }
        }
    }
}

readDir(path.join(__dirname, 'src'));

const outPath = path.join(__dirname, 'extracted_keys.json');
fs.writeFileSync(outPath, JSON.stringify(keys, null, 2));
console.log('done extracting to extracted_keys.json');
