"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CVData,
  Lang,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillItem,
  LanguageItem,
  CertificateItem,
  ContactInfo,
} from "./types";
import { sampleData, newId } from "./sampleData";

interface CVState {
  uiLang: Lang;
  cvLang: Lang;
  templateId: string;
  accentOverride: string | null;
  data: CVData;

  setUiLang: (l: Lang) => void;
  setCvLang: (l: Lang) => void;
  setTemplate: (id: string) => void;
  setAccent: (hex: string | null) => void;

  updateContact: (patch: Partial<ContactInfo>) => void;
  setSummary: (v: string) => void;

  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;

  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;

  addProject: () => void;
  updateProject: (id: string, patch: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;

  addSkill: () => void;
  updateSkill: (id: string, patch: Partial<SkillItem>) => void;
  removeSkill: (id: string) => void;

  addLanguage: () => void;
  updateLanguage: (id: string, patch: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;

  addCertificate: () => void;
  updateCertificate: (id: string, patch: Partial<CertificateItem>) => void;
  removeCertificate: (id: string) => void;

  loadSample: () => void;
}

export const useCV = create<CVState>()(
  persist(
    (set, get) => ({
      uiLang: "tr",
      cvLang: "tr",
      templateId: "aurora",
      accentOverride: null,
      data: sampleData("tr"),

      setUiLang: (l) => set({ uiLang: l }),
      setCvLang: (l) => set({ cvLang: l }),
      setTemplate: (id) => set({ templateId: id }),
      setAccent: (hex) => set({ accentOverride: hex }),

      updateContact: (patch) =>
        set((s) => ({ data: { ...s.data, contact: { ...s.data.contact, ...patch } } })),
      setSummary: (v) => set((s) => ({ data: { ...s.data, summary: v } })),

      addExperience: () =>
        set((s) => ({
          data: {
            ...s.data,
            experience: [
              ...s.data.experience,
              {
                id: newId(),
                role: "",
                company: "",
                location: "",
                start: "",
                end: "",
                current: false,
                description: "",
              },
            ],
          },
        })),
      updateExperience: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: s.data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({
          data: { ...s.data, experience: s.data.experience.filter((e) => e.id !== id) },
        })),

      addEducation: () =>
        set((s) => ({
          data: {
            ...s.data,
            education: [
              ...s.data.education,
              { id: newId(), degree: "", school: "", location: "", start: "", end: "", description: "" },
            ],
          },
        })),
      updateEducation: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            education: s.data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({
          data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) },
        })),

      addProject: () =>
        set((s) => ({
          data: {
            ...s.data,
            projects: [...s.data.projects, { id: newId(), name: "", link: "", description: "" }],
          },
        })),
      updateProject: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
      removeProject: (id) =>
        set((s) => ({
          data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) },
        })),

      addSkill: () =>
        set((s) => ({
          data: { ...s.data, skills: [...s.data.skills, { id: newId(), name: "" }] },
        })),
      updateSkill: (id, patch) =>
        set((s) => ({
          data: { ...s.data, skills: s.data.skills.map((p) => (p.id === id ? { ...p, ...patch } : p)) },
        })),
      removeSkill: (id) =>
        set((s) => ({ data: { ...s.data, skills: s.data.skills.filter((p) => p.id !== id) } })),

      addLanguage: () =>
        set((s) => ({
          data: { ...s.data, languages: [...s.data.languages, { id: newId(), name: "", level: "" }] },
        })),
      updateLanguage: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            languages: s.data.languages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
      removeLanguage: (id) =>
        set((s) => ({ data: { ...s.data, languages: s.data.languages.filter((p) => p.id !== id) } })),

      addCertificate: () =>
        set((s) => ({
          data: {
            ...s.data,
            certificates: [...s.data.certificates, { id: newId(), name: "", issuer: "", date: "" }],
          },
        })),
      updateCertificate: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            certificates: s.data.certificates.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
      removeCertificate: (id) =>
        set((s) => ({
          data: { ...s.data, certificates: s.data.certificates.filter((p) => p.id !== id) },
        })),

      loadSample: () => set((s) => ({ data: sampleData(s.cvLang) })),
    }),
    {
      name: "cv-marker-store",
      partialize: (s) => ({
        uiLang: s.uiLang,
        cvLang: s.cvLang,
        templateId: s.templateId,
        accentOverride: s.accentOverride,
        data: s.data,
      }),
    }
  )
);
