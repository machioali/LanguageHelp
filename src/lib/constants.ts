// User roles
export const UserRole = {
  CLIENT: 'CLIENT',
  INTERPRETER: 'INTERPRETER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

// Interpreter statuses
export const InterpreterStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  REJECTED: 'REJECTED',
} as const;

// Application statuses
export const ApplicationStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
} as const;

// Proficiency levels
export const ProficiencyLevel = {
  NATIVE: 'NATIVE',
  FLUENT: 'FLUENT',
  ADVANCED: 'ADVANCED',
  INTERMEDIATE: 'INTERMEDIATE',
  BASIC: 'BASIC',
} as const;

// Specialization types
export const SpecializationType = {
  HEALTHCARE: 'HEALTHCARE',
  LEGAL: 'LEGAL',
  BUSINESS: 'BUSINESS',
  EDUCATION: 'EDUCATION',
  GOVERNMENT: 'GOVERNMENT',
  TECHNICAL: 'TECHNICAL',
  CONFERENCE: 'CONFERENCE',
  EMERGENCY: 'EMERGENCY',
  GENERAL: 'GENERAL',
} as const;

// Language codes with names
export const Languages = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese (Mandarin)',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  hi: 'Hindi',
  bn: 'Bengali',
  ur: 'Urdu',
  fa: 'Persian',
  tr: 'Turkish',
  pl: 'Polish',
  nl: 'Dutch',
  sv: 'Swedish',
  da: 'Danish',
  no: 'Norwegian',
  fi: 'Finnish',
  el: 'Greek',
  he: 'Hebrew',
  th: 'Thai',
  vi: 'Vietnamese',
  id: 'Indonesian',
  ms: 'Malay',
  tl: 'Filipino',
  sw: 'Swahili',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];
export type InterpreterStatusType = typeof InterpreterStatus[keyof typeof InterpreterStatus];
export type ApplicationStatusType = typeof ApplicationStatus[keyof typeof ApplicationStatus];
export type ProficiencyLevelType = typeof ProficiencyLevel[keyof typeof ProficiencyLevel];
export type SpecializationTypeType = typeof SpecializationType[keyof typeof SpecializationType];
export type LanguageCode = keyof typeof Languages;
