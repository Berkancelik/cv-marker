"use client";

import React, { useRef } from "react";
import {
  User,
  AlignLeft,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Sparkles,
  Globe2,
  Award,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCV } from "@/lib/store";
import { t } from "@/lib/i18n";
import { getTemplate } from "@/lib/templates";
import { Field, TextArea } from "@/components/ui";

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
          {icon}
        </span>
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ItemCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <button
        onClick={onRemove}
        className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        aria-label="remove"
      >
        <Trash2 size={15} />
      </button>
      <div className="space-y-3 pr-8">{children}</div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-500 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
    >
      <Plus size={15} /> {label}
    </button>
  );
}

export default function EditorForm() {
  const s = useCV();
  const tr = t(s.uiLang);
  const c = s.data.contact;
  const fileRef = useRef<HTMLInputElement>(null);
  const photoUnsupported = !!c.photo && !getTemplate(s.templateId).showPhoto;

  const onPhoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => s.updateContact({ photo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      {/* Contact */}
      <SectionCard icon={<User size={16} />} title={tr.sectionContact}>
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            {c.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.photo}
                alt=""
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-300">
                <User size={26} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <Upload size={13} /> {tr.uploadPhoto}
            </button>
            {c.photo && (
              <button
                onClick={() => s.updateContact({ photo: "" })}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500"
              >
                <X size={12} /> {tr.removePhoto}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onPhoto(e.target.files?.[0])}
            />
          </div>
        </div>

        {photoUnsupported && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11.5px] leading-relaxed text-amber-700 ring-1 ring-amber-100">
            {tr.photoTemplateHint}{" "}
            <Link href="/templates" className="font-semibold underline underline-offset-2">
              {tr.photoOnly}
            </Link>
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={tr.fullName} value={c.fullName} onChange={(v) => s.updateContact({ fullName: v })} />
          <Field label={tr.jobTitle} value={c.title} onChange={(v) => s.updateContact({ title: v })} />
          <Field label={tr.email} value={c.email} onChange={(v) => s.updateContact({ email: v })} />
          <Field label={tr.phone} value={c.phone} onChange={(v) => s.updateContact({ phone: v })} />
          <Field label={tr.location} value={c.location} onChange={(v) => s.updateContact({ location: v })} />
          <Field label={tr.website} value={c.website} onChange={(v) => s.updateContact({ website: v })} />
          <Field label={tr.linkedin} value={c.linkedin} onChange={(v) => s.updateContact({ linkedin: v })} />
          <Field label={tr.github} value={c.github} onChange={(v) => s.updateContact({ github: v })} />
        </div>
      </SectionCard>

      {/* Summary */}
      <SectionCard icon={<AlignLeft size={16} />} title={tr.sectionSummary}>
        <TextArea
          label={tr.sectionSummary}
          value={s.data.summary}
          onChange={s.setSummary}
          placeholder={tr.summaryPlaceholder}
          rows={4}
        />
      </SectionCard>

      {/* Experience */}
      <SectionCard icon={<Briefcase size={16} />} title={tr.sectionExperience}>
        {s.data.experience.map((e) => (
          <ItemCard key={e.id} onRemove={() => s.removeExperience(e.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label={tr.role} value={e.role} onChange={(v) => s.updateExperience(e.id, { role: v })} />
              <Field label={tr.company} value={e.company} onChange={(v) => s.updateExperience(e.id, { company: v })} />
              <Field label={tr.location} value={e.location} onChange={(v) => s.updateExperience(e.id, { location: v })} />
              <div className="grid grid-cols-2 gap-2">
                <Field label={tr.startDate} value={e.start} onChange={(v) => s.updateExperience(e.id, { start: v })} />
                <Field
                  label={tr.endDate}
                  value={e.current ? "" : e.end}
                  onChange={(v) => s.updateExperience(e.id, { end: v })}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={e.current}
                onChange={(ev) => s.updateExperience(e.id, { current: ev.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
              />
              {tr.current}
            </label>
            <TextArea
              label={tr.description}
              value={e.description}
              onChange={(v) => s.updateExperience(e.id, { description: v })}
              hint={tr.descHint}
              rows={4}
            />
          </ItemCard>
        ))}
        <AddButton label={tr.addExperience} onClick={s.addExperience} />
      </SectionCard>

      {/* Education */}
      <SectionCard icon={<GraduationCap size={16} />} title={tr.sectionEducation}>
        {s.data.education.map((e) => (
          <ItemCard key={e.id} onRemove={() => s.removeEducation(e.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label={tr.degree} value={e.degree} onChange={(v) => s.updateEducation(e.id, { degree: v })} />
              <Field label={tr.school} value={e.school} onChange={(v) => s.updateEducation(e.id, { school: v })} />
              <Field label={tr.location} value={e.location} onChange={(v) => s.updateEducation(e.id, { location: v })} />
              <div className="grid grid-cols-2 gap-2">
                <Field label={tr.startDate} value={e.start} onChange={(v) => s.updateEducation(e.id, { start: v })} />
                <Field label={tr.endDate} value={e.end} onChange={(v) => s.updateEducation(e.id, { end: v })} />
              </div>
            </div>
            <Field label={tr.description} value={e.description} onChange={(v) => s.updateEducation(e.id, { description: v })} />
          </ItemCard>
        ))}
        <AddButton label={tr.addEducation} onClick={s.addEducation} />
      </SectionCard>

      {/* Projects */}
      <SectionCard icon={<FolderGit2 size={16} />} title={tr.sectionProjects}>
        {s.data.projects.map((p) => (
          <ItemCard key={p.id} onRemove={() => s.removeProject(p.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label={tr.projectName} value={p.name} onChange={(v) => s.updateProject(p.id, { name: v })} />
              <Field label={tr.link} value={p.link} onChange={(v) => s.updateProject(p.id, { link: v })} />
            </div>
            <TextArea label={tr.description} value={p.description} onChange={(v) => s.updateProject(p.id, { description: v })} rows={2} />
          </ItemCard>
        ))}
        <AddButton label={tr.addProject} onClick={s.addProject} />
      </SectionCard>

      {/* Skills */}
      <SectionCard icon={<Sparkles size={16} />} title={tr.sectionSkills}>
        {s.data.skills.map((sk) => (
          <div key={sk.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <input
              value={sk.name}
              placeholder={tr.skillName}
              onChange={(e) => s.updateSkill(sk.id, { name: e.target.value })}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <button onClick={() => s.removeSkill(sk.id)} className="text-slate-400 hover:text-red-500">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <AddButton label={tr.addSkill} onClick={s.addSkill} />
      </SectionCard>

      {/* Languages */}
      <SectionCard icon={<Globe2 size={16} />} title={tr.sectionLanguages}>
        {s.data.languages.map((l) => (
          <div key={l.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <input
              value={l.name}
              placeholder={tr.languageName}
              onChange={(e) => s.updateLanguage(l.id, { name: e.target.value })}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <input
              value={l.level}
              placeholder={tr.languageLevel}
              onChange={(e) => s.updateLanguage(l.id, { level: e.target.value })}
              className="w-28 shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:w-40"
            />
            <button onClick={() => s.removeLanguage(l.id)} className="text-slate-400 hover:text-red-500">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <AddButton label={tr.addLanguage} onClick={s.addLanguage} />
      </SectionCard>

      {/* Certificates */}
      <SectionCard icon={<Award size={16} />} title={tr.sectionCertificates}>
        {s.data.certificates.map((cert) => (
          <ItemCard key={cert.id} onRemove={() => s.removeCertificate(cert.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label={tr.certName} value={cert.name} onChange={(v) => s.updateCertificate(cert.id, { name: v })} />
              <Field label={tr.issuer} value={cert.issuer} onChange={(v) => s.updateCertificate(cert.id, { issuer: v })} />
              <Field label={tr.date} value={cert.date} onChange={(v) => s.updateCertificate(cert.id, { date: v })} />
            </div>
          </ItemCard>
        ))}
        <AddButton label={tr.addCertificate} onClick={s.addCertificate} />
      </SectionCard>
    </div>
  );
}
