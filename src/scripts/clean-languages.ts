// Script to clean up language duplicates and count unique languages
import { LANGUAGES } from '../lib/languages';

// Find duplicates by code
const languageCodes = new Set<string>();
const duplicates: string[] = [];
const uniqueLanguages = [];

for (const lang of LANGUAGES) {
  if (languageCodes.has(lang.code)) {
    duplicates.push(lang.code);
  } else {
    languageCodes.add(lang.code);
    uniqueLanguages.push(lang);
  }
}

console.log('=== Language Database Analysis ===');
console.log(`Total languages in array: ${LANGUAGES.length}`);
console.log(`Unique languages: ${uniqueLanguages.length}`);
console.log(`Duplicates found: ${duplicates.length}`);
console.log(`Duplicate codes: ${duplicates.join(', ')}`);

// Group by region
const regionCounts = {};
for (const lang of uniqueLanguages) {
  if (lang.region) {
    regionCounts[lang.region] = (regionCounts[lang.region] || 0) + 1;
  }
}

console.log('\n=== Regional Breakdown ===');
Object.entries(regionCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([region, count]) => {
    console.log(`${region}: ${count} languages`);
  });

console.log('\n=== Export for Clean File ===');
console.log(`Unique languages ready for export: ${uniqueLanguages.length}`);
