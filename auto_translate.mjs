import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keys = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_keys.json'), 'utf8'));
const LANGUAGES = ['en', 'hi', 'ta', 'te', 'ml', 'mr', 'bn', 'gu', 'kn', 'fr', 'es'];

async function translateText(text, targetLang) {
    if (targetLang === 'en' || !text) return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json();
        return data[0].map(item => item[0]).join('');
    } catch (e) {
        console.error(`Error translating "${text}" to ${targetLang}:`, e);
        return text; // fallback
    }
}

async function generateTranslations() {
    const translations = {};
    for (const lang of LANGUAGES) {
        translations[lang] = {};
        console.log(`Translating to ${lang}...`);

        let i = 0;
        const total = Object.keys(keys).length;

        for (const [k, v] of Object.entries(keys)) {
            // Strip HTML temporarily for simple translation, or let API handle it
            let translated = await translateText(v, lang);
            translations[lang][k] = translated;
            i++;
            if (i % 20 === 0) console.log(`   ${i}/${total} done`);
            await new Promise(r => setTimeout(r, 100)); // Sleep to prevent rate limit
        }
    }

    // Save as translations.js
    const outContent = `export const translations = ${JSON.stringify(translations, null, 4)};\n`;
    fs.writeFileSync(path.join(__dirname, 'src', 'translations.js'), outContent);
    console.log('Finished translating and saved to src/translations.js');
}

generateTranslations();
