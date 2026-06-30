export type Lang = "tr" | "en";

export interface ContactInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photo: string; // data URL or empty
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string; // newline-separated bullet points
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string; // e.g. "Native", "B2"
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CVData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  certificates: CertificateItem[];
}

export type LayoutKind =
  | "classic"
  | "sidebar-left"
  | "sidebar-right"
  | "header-banner"
  | "timeline"
  | "minimal"
  | "compact-two-col"
  | "elegant-serif"
  // new engines
  | "sidebar-header" // name + photo live inside the colored sidebar
  | "top-band" // thin full-width accent band with centered name
  | "left-rail" // thin accent rail on the far-left edge, single column
  | "boxed-header"; // name in a boxed/filled header block, two-column body

export type HeadingStyle =
  | "underline" // text with a bottom rule (default)
  | "bar" // left vertical accent bar
  | "pill" // tinted rounded pill behind the text
  | "block" // full-width tinted bar
  | "plain"; // no rule, just colored text

export interface TemplateDef {
  id: string;
  name: string;
  layout: LayoutKind;
  accent: string; // hex
  font: "sans" | "serif" | "mono";
  category: string; // grouping label for the gallery / select
  // visual tweaks
  headingStyle?: HeadingStyle;
  uppercaseHeadings?: boolean;
  showPhoto?: boolean;
  accentBg?: boolean; // use accent as a filled background for the sidebar/banner
}
