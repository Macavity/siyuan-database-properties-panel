import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseLang = 'en_US';
const langDir = path.join(__dirname, '../public/i18n');
const baseLangFile = path.join(langDir, `${baseLang}.json`);

function getJsonContent(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function checkTranslations(baseContent, targetContent, targetLang) {
    const missingKeys = [];
    for (const key in baseContent) {
        if (!targetContent.hasOwnProperty(key)) {
            missingKeys.push(key);
        }
    }
    if (missingKeys.length > 0) {
        console.error(`Missing translations in ${targetLang}:`, missingKeys);
        process.exit(1);
    }
}

function main() {
    const baseContent = getJsonContent(baseLangFile);
    const files = fs.readdirSync(langDir).filter(file => file.endsWith('.json') && file !== `${baseLang}.json`);

    files.forEach(file => {
        const targetLang = path.basename(file, '.json');
        const targetContent = getJsonContent(path.join(langDir, file));
        checkTranslations(baseContent, targetContent, targetLang);
    });

    console.log('All translations are complete.');
}

main();