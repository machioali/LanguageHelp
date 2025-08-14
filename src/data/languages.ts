export interface Language {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  category: 'popular' | 'common' | 'specialized' | 'rare';
  speakers: number; // in millions
  difficulty?: 'easy' | 'medium' | 'hard' | 'very-hard'; // for English speakers
  rtl?: boolean; // right-to-left script
}

export const languages: Language[] = [
  // Popular/Major Languages (Top 20 most requested)
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global', category: 'popular', speakers: 1500 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Global', category: 'popular', speakers: 500, difficulty: 'easy' },
  { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', region: 'Asia', category: 'popular', speakers: 918, difficulty: 'very-hard' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'Asia', category: 'popular', speakers: 600, difficulty: 'hard' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East/North Africa', category: 'popular', speakers: 422, difficulty: 'very-hard', rtl: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Global', category: 'popular', speakers: 260, difficulty: 'easy' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'Asia', category: 'popular', speakers: 265, difficulty: 'hard' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Eastern Europe/Asia', category: 'popular', speakers: 258, difficulty: 'hard' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Asia', category: 'popular', speakers: 125, difficulty: 'very-hard' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Asia', category: 'popular', speakers: 113, difficulty: 'hard' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Europe', category: 'popular', speakers: 100, difficulty: 'medium' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', region: 'Asia', category: 'popular', speakers: 84, difficulty: 'hard' },
  { code: 'wu', name: 'Wu Chinese', nativeName: '吴语', region: 'Asia', category: 'popular', speakers: 81, difficulty: 'very-hard' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'Asia', category: 'popular', speakers: 77, difficulty: 'very-hard' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'Global', category: 'popular', speakers: 280, difficulty: 'easy' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Europe/Asia', category: 'popular', speakers: 80, difficulty: 'medium' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Asia', category: 'popular', speakers: 76, difficulty: 'hard' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Asia', category: 'popular', speakers: 74, difficulty: 'hard' },
  { code: 'yue', name: 'Cantonese', nativeName: '廣東話', region: 'Asia', category: 'popular', speakers: 73, difficulty: 'very-hard' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Asia', category: 'popular', speakers: 72, difficulty: 'hard' },

  // Common Languages (Frequently requested)
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Europe', category: 'common', speakers: 65, difficulty: 'easy' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Asia', category: 'common', speakers: 60, difficulty: 'very-hard' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Asia', category: 'common', speakers: 56, difficulty: 'hard' },
  { code: 'jin', name: 'Jin Chinese', nativeName: '晋语', region: 'Asia', category: 'common', speakers: 45, difficulty: 'very-hard' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Asia', category: 'common', speakers: 44, difficulty: 'hard' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', region: 'Middle East', category: 'common', speakers: 70, difficulty: 'hard', rtl: true },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Europe', category: 'common', speakers: 45, difficulty: 'medium' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Africa', category: 'common', speakers: 40, difficulty: 'medium' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', region: 'Africa', category: 'common', speakers: 8, difficulty: 'hard' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', region: 'Africa', category: 'common', speakers: 12, difficulty: 'hard' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', region: 'Europe', category: 'common', speakers: 40, difficulty: 'hard' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Europe', category: 'common', speakers: 23, difficulty: 'easy' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Asia', category: 'common', speakers: 34, difficulty: 'hard' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Asia', category: 'common', speakers: 33, difficulty: 'hard' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာစာ', region: 'Asia', category: 'common', speakers: 33, difficulty: 'very-hard' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', region: 'Asia', category: 'common', speakers: 32, difficulty: 'medium' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', region: 'Asia', category: 'common', speakers: 30, difficulty: 'hard' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Africa', category: 'common', speakers: 32, difficulty: 'hard' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'Asia', category: 'common', speakers: 29, difficulty: 'hard' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', region: 'Asia', category: 'common', speakers: 17, difficulty: 'hard' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', region: 'Asia', category: 'common', speakers: 16, difficulty: 'very-hard' },
  { code: 'tg', name: 'Tajik', nativeName: 'тоҷикӣ', region: 'Asia', category: 'common', speakers: 8, difficulty: 'hard' },
  { code: 'kk', name: 'Kazakh', nativeName: 'қазақ тілі', region: 'Asia', category: 'common', speakers: 13, difficulty: 'hard' },
  { code: 'be', name: 'Belarusian', nativeName: 'беларуская', region: 'Europe', category: 'common', speakers: 5, difficulty: 'hard' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'български', region: 'Europe', category: 'common', speakers: 8, difficulty: 'medium' },

  // European Languages
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', region: 'Europe', category: 'common', speakers: 10, difficulty: 'easy' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', region: 'Europe', category: 'common', speakers: 5, difficulty: 'easy' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', region: 'Europe', category: 'common', speakers: 6, difficulty: 'easy' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', region: 'Europe', category: 'common', speakers: 5, difficulty: 'very-hard' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', region: 'Europe', category: 'specialized', speakers: 0.3, difficulty: 'hard' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', region: 'Europe', category: 'specialized', speakers: 1, difficulty: 'hard' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', region: 'Europe', category: 'specialized', speakers: 2, difficulty: 'hard' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', region: 'Europe', category: 'specialized', speakers: 3, difficulty: 'hard' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', region: 'Europe', category: 'common', speakers: 10, difficulty: 'medium' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', region: 'Europe', category: 'specialized', speakers: 5, difficulty: 'medium' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', region: 'Europe', category: 'specialized', speakers: 2, difficulty: 'medium' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', region: 'Europe', category: 'common', speakers: 5, difficulty: 'medium' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', region: 'Europe', category: 'common', speakers: 9, difficulty: 'medium' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', region: 'Europe', category: 'specialized', speakers: 3, difficulty: 'medium' },
  { code: 'mk', name: 'Macedonian', nativeName: 'македонски', region: 'Europe', category: 'specialized', speakers: 2, difficulty: 'medium' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', region: 'Europe', category: 'specialized', speakers: 6, difficulty: 'medium' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', region: 'Europe', category: 'common', speakers: 13, difficulty: 'hard' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', region: 'Europe', category: 'common', speakers: 20, difficulty: 'easy' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', region: 'Europe', category: 'common', speakers: 13, difficulty: 'very-hard' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', region: 'Europe', category: 'rare', speakers: 0.5, difficulty: 'hard' },

  // African Languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa', category: 'common', speakers: 100, difficulty: 'easy' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', region: 'Africa', category: 'common', speakers: 70, difficulty: 'medium' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', region: 'Africa', category: 'common', speakers: 27, difficulty: 'hard' },
  { code: 'ff', name: 'Fulah', nativeName: 'Fulfulde', region: 'Africa', category: 'specialized', speakers: 25, difficulty: 'medium' },
  { code: 'om', name: 'Oromo', nativeName: 'Oromoo', region: 'Africa', category: 'specialized', speakers: 37, difficulty: 'medium' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', region: 'Africa', category: 'common', speakers: 16, difficulty: 'medium' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', region: 'Africa', category: 'specialized', speakers: 7, difficulty: 'hard' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', region: 'Africa', category: 'specialized', speakers: 12, difficulty: 'medium' },
  { code: 'rn', name: 'Kirundi', nativeName: 'Ikirundi', region: 'Africa', category: 'rare', speakers: 9, difficulty: 'medium' },
  { code: 'lg', name: 'Luganda', nativeName: 'Luganda', region: 'Africa', category: 'specialized', speakers: 10, difficulty: 'medium' },
  { code: 'ak', name: 'Akan', nativeName: 'Akan', region: 'Africa', category: 'specialized', speakers: 11, difficulty: 'medium' },
  { code: 'tw', name: 'Twi', nativeName: 'Twi', region: 'Africa', category: 'specialized', speakers: 9, difficulty: 'medium' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', region: 'Africa', category: 'specialized', speakers: 18, difficulty: 'medium' },
  { code: 'sn', name: 'Shona', nativeName: 'ChiShona', region: 'Africa', category: 'specialized', speakers: 11, difficulty: 'medium' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', region: 'Africa', category: 'specialized', speakers: 6, difficulty: 'medium' },
  { code: 'tn', name: 'Setswana', nativeName: 'Setswana', region: 'Africa', category: 'specialized', speakers: 4, difficulty: 'medium' },
  { code: 've', name: 'Tshivenda', nativeName: 'Tshivenḓa', region: 'Africa', category: 'rare', speakers: 1, difficulty: 'hard' },
  { code: 'ts', name: 'Xitsonga', nativeName: 'Xitsonga', region: 'Africa', category: 'rare', speakers: 2, difficulty: 'hard' },
  { code: 'ss', name: 'Siswati', nativeName: 'SiSwati', region: 'Africa', category: 'rare', speakers: 2, difficulty: 'hard' },
  { code: 'nr', name: 'isiNdebele', nativeName: 'isiNdebele', region: 'Africa', category: 'rare', speakers: 2, difficulty: 'hard' },

  // Middle Eastern Languages
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', region: 'Middle East', category: 'common', speakers: 9, difficulty: 'hard', rtl: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Asia', category: 'common', speakers: 230, difficulty: 'hard', rtl: true },
  { code: 'ku', name: 'Kurdish', nativeName: 'کوردی', region: 'Middle East', category: 'common', speakers: 30, difficulty: 'medium' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', region: 'Asia', category: 'common', speakers: 23, difficulty: 'medium' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', region: 'Asia', category: 'specialized', speakers: 7, difficulty: 'hard' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', region: 'Asia', category: 'specialized', speakers: 4, difficulty: 'very-hard' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', region: 'Asia', category: 'common', speakers: 60, difficulty: 'hard', rtl: true },
  { code: 'bal', name: 'Balochi', nativeName: 'بلۏچی', region: 'Asia', category: 'specialized', speakers: 8, difficulty: 'medium' },

  // Central Asian Languages
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', region: 'Asia', category: 'specialized', speakers: 4, difficulty: 'medium' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen', region: 'Asia', category: 'specialized', speakers: 7, difficulty: 'medium' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', region: 'Asia', category: 'specialized', speakers: 5, difficulty: 'hard' },

  // Southeast Asian Languages
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Asia', category: 'common', speakers: 199, difficulty: 'easy' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Asia', category: 'common', speakers: 60, difficulty: 'easy' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', region: 'Asia', category: 'common', speakers: 25, difficulty: 'easy' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Binisaya', region: 'Asia', category: 'specialized', speakers: 21, difficulty: 'medium' },
  { code: 'hil', name: 'Hiligaynon', nativeName: 'Ilonggo', region: 'Asia', category: 'rare', speakers: 9, difficulty: 'medium' },
  { code: 'war', name: 'Waray', nativeName: 'Waray', region: 'Asia', category: 'rare', speakers: 3, difficulty: 'medium' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', region: 'Asia', category: 'specialized', speakers: 7, difficulty: 'hard' },
  { code: 'dz', name: 'Dzongkha', nativeName: 'རྫོང་ཁ', region: 'Asia', category: 'rare', speakers: 0.2, difficulty: 'very-hard' },

  // East Asian Languages
  { code: 'nan', name: 'Min Nan', nativeName: '閩南語', region: 'Asia', category: 'specialized', speakers: 49, difficulty: 'very-hard' },
  { code: 'hak', name: 'Hakka', nativeName: '客家話', region: 'Asia', category: 'specialized', speakers: 30, difficulty: 'very-hard' },
  { code: 'gan', name: 'Gan Chinese', nativeName: '贛語', region: 'Asia', category: 'rare', speakers: 22, difficulty: 'very-hard' },
  { code: 'hsn', name: 'Xiang Chinese', nativeName: '湘語', region: 'Asia', category: 'rare', speakers: 36, difficulty: 'very-hard' },

  // Indian Subcontinent Languages
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Asia', category: 'specialized', speakers: 15, difficulty: 'hard' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', region: 'Asia', category: 'specialized', speakers: 51, difficulty: 'hard' },
  { code: 'mag', name: 'Magahi', nativeName: 'मगही', region: 'Asia', category: 'rare', speakers: 13, difficulty: 'hard' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', region: 'Asia', category: 'specialized', speakers: 34, difficulty: 'hard' },
  { code: 'awa', name: 'Awadhi', nativeName: 'अवधी', region: 'Asia', category: 'specialized', speakers: 38, difficulty: 'hard' },
  { code: 'chhg', name: 'Chhattisgarhi', nativeName: 'छत्तीसगढ़ी', region: 'Asia', category: 'specialized', speakers: 18, difficulty: 'hard' },
  { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी', region: 'Asia', category: 'specialized', speakers: 25, difficulty: 'hard' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', region: 'Asia', category: 'specialized', speakers: 2, difficulty: 'hard' },
  { code: 'dv', name: 'Dhivehi', nativeName: 'ދިވެހި', region: 'Asia', category: 'rare', speakers: 0.3, difficulty: 'hard', rtl: true },

  // Pacific Languages
  { code: 'fj', name: 'Fijian', nativeName: 'Vosa Vakaviti', region: 'Pacific', category: 'rare', speakers: 0.3, difficulty: 'medium' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Sāmoa', region: 'Pacific', category: 'rare', speakers: 0.5, difficulty: 'medium' },
  { code: 'to', name: 'Tongan', nativeName: 'Lea Fakatonga', region: 'Pacific', category: 'rare', speakers: 0.2, difficulty: 'medium' },
  { code: 'ty', name: 'Tahitian', nativeName: 'Reo Tahiti', region: 'Pacific', category: 'rare', speakers: 0.1, difficulty: 'medium' },
  { code: 'mi', name: 'Māori', nativeName: 'Te Reo Māori', region: 'Pacific', category: 'specialized', speakers: 0.2, difficulty: 'medium' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', region: 'Pacific', category: 'rare', speakers: 0.02, difficulty: 'medium' },

  // American Indigenous Languages
  { code: 'qu', name: 'Quechua', nativeName: 'Runasimi', region: 'Americas', category: 'specialized', speakers: 8, difficulty: 'hard' },
  { code: 'gn', name: 'Guaraní', nativeName: 'Avañeʼẽ', region: 'Americas', category: 'specialized', speakers: 6, difficulty: 'medium' },
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', region: 'Americas', category: 'rare', speakers: 2, difficulty: 'hard' },
  { code: 'nah', name: 'Nahuatl', nativeName: 'Nāhuatl', region: 'Americas', category: 'rare', speakers: 2, difficulty: 'hard' },
  { code: 'chr', name: 'Cherokee', nativeName: 'ᏣᎳᎩ', region: 'Americas', category: 'rare', speakers: 0.02, difficulty: 'very-hard' },
  { code: 'iu', name: 'Inuktitut', nativeName: 'ᐃᓄᒃᑎᑐᑦ', region: 'Americas', category: 'rare', speakers: 0.04, difficulty: 'very-hard' },
  { code: 'kl', name: 'Greenlandic', nativeName: 'Kalaallisut', region: 'Americas', category: 'rare', speakers: 0.06, difficulty: 'very-hard' },

  // Additional European Languages
  { code: 'eu', name: 'Basque', nativeName: 'Euskera', region: 'Europe', category: 'specialized', speakers: 1, difficulty: 'very-hard' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', region: 'Europe', category: 'common', speakers: 10, difficulty: 'easy' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', region: 'Europe', category: 'specialized', speakers: 3, difficulty: 'easy' },
  { code: 'ast', name: 'Asturian', nativeName: 'Asturianu', region: 'Europe', category: 'rare', speakers: 0.5, difficulty: 'medium' },
  { code: 'ext', name: 'Extremaduran', nativeName: 'Estremeñu', region: 'Europe', category: 'rare', speakers: 0.2, difficulty: 'medium' },
  { code: 'mwl', name: 'Mirandese', nativeName: 'Mirandés', region: 'Europe', category: 'rare', speakers: 0.02, difficulty: 'medium' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu', region: 'Europe', category: 'rare', speakers: 0.15, difficulty: 'medium' },
  { code: 'sc', name: 'Sardinian', nativeName: 'Sardu', region: 'Europe', category: 'rare', speakers: 1, difficulty: 'medium' },
  { code: 'vec', name: 'Venetian', nativeName: 'Vèneto', region: 'Europe', category: 'rare', speakers: 4, difficulty: 'medium' },
  { code: 'lmo', name: 'Lombard', nativeName: 'Lumbaart', region: 'Europe', category: 'rare', speakers: 2, difficulty: 'medium' },
  { code: 'pms', name: 'Piedmontese', nativeName: 'Piemontèis', region: 'Europe', category: 'rare', speakers: 2, difficulty: 'medium' },
  { code: 'lij', name: 'Ligurian', nativeName: 'Ligure', region: 'Europe', category: 'rare', speakers: 0.5, difficulty: 'medium' },
  { code: 'nap', name: 'Neapolitan', nativeName: 'Napulitano', region: 'Europe', category: 'rare', speakers: 5, difficulty: 'medium' },
  { code: 'scn', name: 'Sicilian', nativeName: 'Sicilianu', region: 'Europe', category: 'rare', speakers: 5, difficulty: 'medium' },

  // Celtic Languages
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', region: 'Europe', category: 'specialized', speakers: 1, difficulty: 'hard' },
  { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig', region: 'Europe', category: 'rare', speakers: 0.06, difficulty: 'hard' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', region: 'Europe', category: 'specialized', speakers: 0.7, difficulty: 'medium' },
  { code: 'kw', name: 'Cornish', nativeName: 'Kernewek', region: 'Europe', category: 'rare', speakers: 0.003, difficulty: 'hard' },
  { code: 'br', name: 'Breton', nativeName: 'Brezhoneg', region: 'Europe', category: 'rare', speakers: 0.2, difficulty: 'medium' },
  { code: 'gv', name: 'Manx', nativeName: 'Gaelg', region: 'Europe', category: 'rare', speakers: 0.002, difficulty: 'hard' },

  // Additional African Languages
  { code: 'wo', name: 'Wolof', nativeName: 'Wollof', region: 'Africa', category: 'specialized', speakers: 5, difficulty: 'medium' },
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan', region: 'Africa', category: 'specialized', speakers: 6, difficulty: 'medium' },
  { code: 'dyu', name: 'Dyula', nativeName: 'Jula', region: 'Africa', category: 'rare', speakers: 3, difficulty: 'medium' },
  { code: 'mos', name: 'Mossi', nativeName: 'Mòoré', region: 'Africa', category: 'specialized', speakers: 5, difficulty: 'medium' },
  { code: 'ee', name: 'Ewe', nativeName: 'Èʋegbe', region: 'Africa', category: 'specialized', speakers: 3, difficulty: 'medium' },
  { code: 'gaa', name: 'Ga', nativeName: 'Gã', region: 'Africa', category: 'rare', speakers: 1, difficulty: 'medium' },

  // Sign Languages
  { code: 'asl', name: 'American Sign Language', nativeName: 'ASL', region: 'Americas', category: 'specialized', speakers: 0.5, difficulty: 'hard' },
  { code: 'bsl', name: 'British Sign Language', nativeName: 'BSL', region: 'Europe', category: 'specialized', speakers: 0.15, difficulty: 'hard' },
  { code: 'fsl', name: 'French Sign Language', nativeName: 'LSF', region: 'Europe', category: 'rare', speakers: 0.1, difficulty: 'hard' },
  { code: 'dgs', name: 'German Sign Language', nativeName: 'DGS', region: 'Europe', category: 'rare', speakers: 0.08, difficulty: 'hard' },
  { code: 'jsl', name: 'Japanese Sign Language', nativeName: 'JSL', region: 'Asia', category: 'rare', speakers: 0.06, difficulty: 'very-hard' },

  // Constructed Languages (for completeness)
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', region: 'Global', category: 'rare', speakers: 2, difficulty: 'easy' },
  { code: 'ia', name: 'Interlingua', nativeName: 'Interlingua', region: 'Global', category: 'rare', speakers: 0.001, difficulty: 'easy' },
  { code: 'ie', name: 'Interlingue', nativeName: 'Interlingue', region: 'Global', category: 'rare', speakers: 0.001, difficulty: 'easy' },
];

export const getLanguagesByCategory = () => {
  const popular = languages.filter(lang => lang.category === 'popular');
  const common = languages.filter(lang => lang.category === 'common');
  const specialized = languages.filter(lang => lang.category === 'specialized');
  const rare = languages.filter(lang => lang.category === 'rare');
  
  return { popular, common, specialized, rare };
};

export const getLanguagesByRegion = () => {
  const regions = Array.from(new Set(languages.map(lang => lang.region)));
  return regions.reduce((acc, region) => {
    acc[region] = languages.filter(lang => lang.region === region);
    return acc;
  }, {} as Record<string, Language[]>);
};

export const searchLanguages = (query: string, limit = 20): Language[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  // Prioritize matches: exact match > starts with > contains
  const exactMatches = languages.filter(lang => 
    lang.name.toLowerCase() === lowerQuery || 
    lang.nativeName.toLowerCase() === lowerQuery
  );
  
  const startsWithMatches = languages.filter(lang => 
    !exactMatches.includes(lang) && (
      lang.name.toLowerCase().startsWith(lowerQuery) ||
      lang.nativeName.toLowerCase().startsWith(lowerQuery)
    )
  );
  
  const containsMatches = languages.filter(lang => 
    !exactMatches.includes(lang) && 
    !startsWithMatches.includes(lang) && (
      lang.name.toLowerCase().includes(lowerQuery) ||
      lang.nativeName.toLowerCase().includes(lowerQuery)
    )
  );
  
  return [...exactMatches, ...startsWithMatches, ...containsMatches].slice(0, limit);
};

export const getTopLanguages = (count = 20): Language[] => {
  return languages
    .sort((a, b) => {
      // Sort by category priority first, then by speaker count
      const categoryOrder = { 'popular': 0, 'common': 1, 'specialized': 2, 'rare': 3 };
      const aPriority = categoryOrder[a.category];
      const bPriority = categoryOrder[b.category];
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return b.speakers - a.speakers;
    })
    .slice(0, count);
};
