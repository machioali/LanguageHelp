export interface Language {
  code: string;
  name: string;
  nativeName?: string;
  region?: string;
}

export const LANGUAGES: Language[] = [
  // Major World Languages (20)
  { code: "ar", name: "Arabic", nativeName: "العربية", region: "Middle East & North Africa" },
  { code: "zh", name: "Chinese (Mandarin)", nativeName: "中文", region: "East Asia" },
  { code: "en", name: "English", nativeName: "English", region: "Global" },
  { code: "es", name: "Spanish", nativeName: "Español", region: "Europe & Americas" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "South Asia" },
  { code: "fr", name: "French", nativeName: "Français", region: "Europe & Africa" },
  { code: "ru", name: "Russian", nativeName: "Русский", region: "Eastern Europe & Central Asia" },
  { code: "pt", name: "Portuguese", nativeName: "Português", region: "Europe & South America" },
  { code: "de", name: "German", nativeName: "Deutsch", region: "Central Europe" },
  { code: "ja", name: "Japanese", nativeName: "日本語", region: "East Asia" },
  { code: "ko", name: "Korean", nativeName: "한국어", region: "East Asia" },
  { code: "it", name: "Italian", nativeName: "Italiano", region: "Southern Europe" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", region: "Western Europe" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", region: "Western Asia" },
  { code: "fa", name: "Persian", nativeName: "فارسی", region: "Central Asia" },
  { code: "pl", name: "Polish", nativeName: "Polski", region: "Central Europe" },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "South Asia" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", region: "Southeast Asia" },
  { code: "uk", name: "Ukrainian", nativeName: "українська мова", region: "Eastern Europe" },
  { code: "th", name: "Thai", nativeName: "ไทย", region: "Southeast Asia" },

  // European Languages (35)
  { code: "sv", name: "Swedish", nativeName: "Svenska", region: "Northern Europe" },
  { code: "da", name: "Danish", nativeName: "Dansk", region: "Northern Europe" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", region: "Northern Europe" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", region: "Northern Europe" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", region: "Northern Europe" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", region: "Southern Europe" },
  { code: "cs", name: "Czech", nativeName: "Čeština", region: "Central Europe" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", region: "Central Europe" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", region: "Central Europe" },
  { code: "ro", name: "Romanian", nativeName: "Română", region: "Eastern Europe" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", region: "Eastern Europe" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", region: "Southeastern Europe" },
  { code: "sr", name: "Serbian", nativeName: "Српски", region: "Southeastern Europe" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski", region: "Southeastern Europe" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", region: "Southeastern Europe" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", region: "Central Europe" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", region: "Northern Europe" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", region: "Northern Europe" },
  { code: "et", name: "Estonian", nativeName: "Eesti", region: "Northern Europe" },
  { code: "mt", name: "Maltese", nativeName: "Malti", region: "Southern Europe" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge", region: "Western Europe" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg", region: "Western Europe" },
  { code: "gd", name: "Scottish Gaelic", nativeName: "Gàidhlig", region: "Western Europe" },
  { code: "eu", name: "Basque", nativeName: "Euskera", region: "Western Europe" },
  { code: "ca", name: "Catalan", nativeName: "Català", region: "Western Europe" },
  { code: "gl", name: "Galician", nativeName: "Galego", region: "Western Europe" },
  { code: "lb", name: "Luxembourgish", nativeName: "Lëtzebuergesch", region: "Western Europe" },
  { code: "fo", name: "Faroese", nativeName: "Føroyskt", region: "Northern Europe" },
  { code: "se", name: "Northern Sami", nativeName: "Davvisámegiella", region: "Northern Europe" },
  { code: "br", name: "Breton", nativeName: "Brezhoneg", region: "Western Europe" },
  { code: "kw", name: "Cornish", nativeName: "Kernewek", region: "Western Europe" },
  { code: "gv", name: "Manx", nativeName: "Gaelg", region: "Western Europe" },
  { code: "an", name: "Aragonese", nativeName: "Aragonés", region: "Western Europe" },
  { code: "ast", name: "Asturian", nativeName: "Asturianu", region: "Western Europe" },
  { code: "fy", name: "Western Frisian", nativeName: "Frysk", region: "Western Europe" },

  // Asian Languages (40)
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", region: "Southeast Asia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", region: "Southeast Asia" },
  { code: "tl", name: "Tagalog", nativeName: "Tagalog", region: "Southeast Asia" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာ", region: "Southeast Asia" },
  { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ", region: "Southeast Asia" },
  { code: "lo", name: "Lao", nativeName: "ພາສາລາວ", region: "Southeast Asia" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", region: "South Asia" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", region: "South Asia" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", region: "South Asia" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", region: "South Asia" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", region: "South Asia" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", region: "South Asia" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", region: "South Asia" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", region: "South Asia" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", region: "South Asia" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "South Asia" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", region: "South Asia" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", region: "South Asia" },
  { code: "ps", name: "Pashto", nativeName: "پښتو", region: "Central Asia" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", region: "Central Asia" },
  { code: "uz", name: "Uzbek", nativeName: "O'zbek", region: "Central Asia" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша", region: "Central Asia" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", region: "Central Asia" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmen", region: "Central Asia" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", region: "East Asia" },
  { code: "bo", name: "Tibetan", nativeName: "བོད་སྐད", region: "Central Asia" },
  { code: "dz", name: "Dzongkha", nativeName: "རྫོང་ཁ", region: "South Asia" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", region: "Western Asia" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն", region: "Western Asia" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", region: "Western Asia" },
  { code: "jv", name: "Javanese", nativeName: "Basa Jawa", region: "Southeast Asia" },
  { code: "su", name: "Sundanese", nativeName: "Basa Sunda", region: "Southeast Asia" },
  { code: "ceb", name: "Cebuano", nativeName: "Binisaya", region: "Southeast Asia" },
  { code: "ilo", name: "Ilocano", nativeName: "Ilokano", region: "Southeast Asia" },
  { code: "hil", name: "Hiligaynon", nativeName: "Ilonggo", region: "Southeast Asia" },
  { code: "war", name: "Waray", nativeName: "Winaray", region: "Southeast Asia" },
  { code: "ban", name: "Balinese", nativeName: "Basa Bali", region: "Southeast Asia" },
  { code: "ace", name: "Acehnese", nativeName: "Bahsa Acèh", region: "Southeast Asia" },
  { code: "tet", name: "Tetum", nativeName: "Tetun", region: "Southeast Asia" },
  { code: "ug", name: "Uyghur", nativeName: "ئۇيغۇرچە", region: "Central Asia" },

  // African Languages (35)
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", region: "East Africa" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", region: "East Africa" },
  { code: "om", name: "Oromo", nativeName: "Oromoo", region: "East Africa" },
  { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ", region: "East Africa" },
  { code: "so", name: "Somali", nativeName: "Soomaali", region: "East Africa" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", region: "West Africa" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", region: "West Africa" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", region: "West Africa" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", region: "Southern Africa" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", region: "Southern Africa" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", region: "Southern Africa" },
  { code: "st", name: "Sotho", nativeName: "Sesotho", region: "Southern Africa" },
  { code: "tn", name: "Tswana", nativeName: "Setswana", region: "Southern Africa" },
  { code: "ss", name: "Swati", nativeName: "siSwati", region: "Southern Africa" },
  { code: "ve", name: "Venda", nativeName: "Tshivenḓa", region: "Southern Africa" },
  { code: "ts", name: "Tsonga", nativeName: "Xitsonga", region: "Southern Africa" },
  { code: "nr", name: "Ndebele", nativeName: "isiNdebele", region: "Southern Africa" },
  { code: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda", region: "East Africa" },
  { code: "rn", name: "Kirundi", nativeName: "Ikirundi", region: "East Africa" },
  { code: "lg", name: "Luganda", nativeName: "Luganda", region: "East Africa" },
  { code: "ny", name: "Chichewa", nativeName: "Chicheŵa", region: "East Africa" },
  { code: "sn", name: "Shona", nativeName: "chiShona", region: "Southern Africa" },
  { code: "wo", name: "Wolof", nativeName: "Wolof", region: "West Africa" },
  { code: "ff", name: "Fulah", nativeName: "Fulfulde", region: "West Africa" },
  { code: "bm", name: "Bambara", nativeName: "Bamanankan", region: "West Africa" },
  { code: "tw", name: "Twi", nativeName: "Twi", region: "West Africa" },
  { code: "ee", name: "Ewe", nativeName: "Eʋegbe", region: "West Africa" },
  { code: "ak", name: "Akan", nativeName: "Akan", region: "West Africa" },
  { code: "kg", name: "Kongo", nativeName: "Kikongo", region: "Central Africa" },
  { code: "ln", name: "Lingala", nativeName: "Lingála", region: "Central Africa" },
  { code: "sg", name: "Sango", nativeName: "yângâ tî sängö", region: "Central Africa" },
  { code: "mg", name: "Malagasy", nativeName: "fiteny malagasy", region: "East Africa" },
  { code: "kr", name: "Kanuri", nativeName: "Kanuri", region: "West Africa" },
  { code: "din", name: "Dinka", nativeName: "Thuɔŋjäŋ", region: "East Africa" },
  { code: "nuer", name: "Nuer", nativeName: "Thok Naath", region: "East Africa" },

  // Middle Eastern Languages (15)
  { code: "he", name: "Hebrew", nativeName: "עברית", region: "Middle East" },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî", region: "Middle East" },
  { code: "ckb", name: "Central Kurdish", nativeName: "کوردیی ناوەندی", region: "Middle East" },
  { code: "kmr", name: "Northern Kurdish", nativeName: "Kurmancî", region: "Middle East" },
  { code: "sdh", name: "Southern Kurdish", nativeName: "کوردیی خوارین", region: "Middle East" },
  { code: "syr", name: "Syriac", nativeName: "ܣܘܪܝܝܐ", region: "Middle East" },
  { code: "arc", name: "Aramaic", nativeName: "ܐܪܡܝܐ", region: "Middle East" },
  { code: "bal", name: "Balochi", nativeName: "بلۏچی", region: "South/Central Asia" },
  { code: "dv", name: "Divehi", nativeName: "ދިވެހި", region: "South Asia" },
  { code: "sd", name: "Sindhi", nativeName: "सिन्धी", region: "South Asia" },
  { code: "ks", name: "Kashmiri", nativeName: "कश्मीरी", region: "South Asia" },
  { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी", region: "South Asia" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", region: "South Asia" },
  { code: "mni", name: "Manipuri", nativeName: "ꯃꯩꯇꯩꯂꯣꯟ", region: "South Asia" },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", region: "South Asia" },

  // Indigenous & Regional Languages (20)
  { code: "qu", name: "Quechua", nativeName: "Runa Simi", region: "South America" },
  { code: "gn", name: "Guaraní", nativeName: "Avañe'ẽ", region: "South America" },
  { code: "ay", name: "Aymara", nativeName: "Aymar aru", region: "South America" },
  { code: "ht", name: "Haitian Creole", nativeName: "Kreyòl ayisyen", region: "Caribbean" },
  { code: "chr", name: "Cherokee", nativeName: "ᏣᎳᎩ", region: "North America" },
  { code: "nv", name: "Navajo", nativeName: "Diné bizaad", region: "North America" },
  { code: "iu", name: "Inuktitut", nativeName: "ᐃᓄᒃᑎᑐᑦ", region: "North America" },
  { code: "kl", name: "Greenlandic", nativeName: "Kalaallisut", region: "North America" },
  { code: "ik", name: "Inupiaq", nativeName: "Iñupiaq", region: "North America" },
  { code: "cr", name: "Cree", nativeName: "ᓀᐦᐃᔭᐍᐏᐣ", region: "North America" },
  { code: "oj", name: "Ojibwe", nativeName: "ᐊᓂᔑᓈᐯᒧᐎᓐ", region: "North America" },
  { code: "mi", name: "Māori", nativeName: "Te reo Māori", region: "Oceania" },
  { code: "sm", name: "Samoan", nativeName: "Gagana fa'a Samoa", region: "Oceania" },
  { code: "to", name: "Tongan", nativeName: "Faka-Tonga", region: "Oceania" },
  { code: "fj", name: "Fijian", nativeName: "Vosa Vakaviti", region: "Oceania" },
  { code: "haw", name: "Hawaiian", nativeName: "ʻŌlelo Hawaiʻi", region: "Oceania" },
  { code: "ty", name: "Tahitian", nativeName: "Reo Tahiti", region: "Oceania" },
  { code: "mh", name: "Marshallese", nativeName: "Kajin M̧ajeļ", region: "Oceania" },
  { code: "na", name: "Nauru", nativeName: "Dorerin Naoero", region: "Oceania" },
  { code: "gil", name: "Gilbertese", nativeName: "Te taetae ni Kiribati", region: "Oceania" },

  // Sign Languages (10)
  { code: "asl", name: "American Sign Language", nativeName: "ASL", region: "North America" },
  { code: "bsl", name: "British Sign Language", nativeName: "BSL", region: "Europe" },
  { code: "auslan", name: "Australian Sign Language", nativeName: "Auslan", region: "Oceania" },
  { code: "fsl", name: "French Sign Language", nativeName: "LSF", region: "Europe" },
  { code: "gsl", name: "German Sign Language", nativeName: "DGS", region: "Europe" },
  { code: "jsl", name: "Japanese Sign Language", nativeName: "JSL", region: "East Asia" },
  { code: "csl", name: "Chinese Sign Language", nativeName: "CSL", region: "East Asia" },
  { code: "rsl", name: "Russian Sign Language", nativeName: "РЖЯ", region: "Eastern Europe" },
  { code: "isl", name: "Italian Sign Language", nativeName: "LIS", region: "Europe" },
  { code: "ssl", name: "Spanish Sign Language", nativeName: "LSE", region: "Europe" },

  // Additional Languages (15)
  { code: "eo", name: "Esperanto", nativeName: "Esperanto", region: "Global" },
  { code: "la", name: "Latin", nativeName: "latine", region: "Europe" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", region: "South Asia" },
  { code: "pi", name: "Pāli", nativeName: "पाऴि", region: "South Asia" },
  { code: "vo", name: "Volapük", nativeName: "Volapük", region: "Global" },
  { code: "ia", name: "Interlingua", nativeName: "Interlingua", region: "Global" },
  { code: "ie", name: "Interlingue", nativeName: "Interlingue", region: "Global" },
  { code: "io", name: "Ido", nativeName: "Ido", region: "Global" },
  { code: "tt", name: "Tatar", nativeName: "татарча", region: "Eastern Europe" },
  { code: "cv", name: "Chuvash", nativeName: "чӑваш чӗлхи", region: "Eastern Europe" },
  { code: "kv", name: "Komi", nativeName: "коми кыв", region: "Eastern Europe" },
  { code: "ce", name: "Chechen", nativeName: "нохчийн мотт", region: "Western Asia" },
  { code: "ab", name: "Abkhazian", nativeName: "аҧсуа бызшәа", region: "Western Asia" },
  { code: "os", name: "Ossetian", nativeName: "ирон æвзаг", region: "Western Asia" },
  { code: "yi", name: "Yiddish", nativeName: "ייִדיש", region: "Europe" }
];

// Helper functions
export const getLanguageByCode = (code: string): Language | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};

export const getLanguagesByRegion = (region: string): Language[] => {
  return LANGUAGES.filter(lang => lang.region === region);
};

export const getAllRegions = (): string[] => {
  const regions = new Set(LANGUAGES.map(lang => lang.region).filter(Boolean));
  return Array.from(regions).filter((region): region is string => region !== undefined).sort();
};

export const searchLanguages = (query: string): Language[] => {
  const searchTerm = query.toLowerCase();
  return LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm) ||
    (lang.nativeName && lang.nativeName.toLowerCase().includes(searchTerm)) ||
    lang.code.toLowerCase().includes(searchTerm)
  );
};

// Popular languages for quick selection
export const POPULAR_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko',
  'ar', 'hi', 'tr', 'nl', 'pl', 'sv', 'da', 'no', 'fi', 'th',
  'vi', 'id', 'ms', 'tl', 'sw', 'am', 'so', 'ha', 'yo', 'zu'
];

export const getPopularLanguages = (): Language[] => {
  return POPULAR_LANGUAGES.map(code => getLanguageByCode(code)).filter(Boolean) as Language[];
};
