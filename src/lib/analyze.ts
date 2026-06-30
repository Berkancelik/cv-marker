import { CVData, Lang } from "./types";

export interface ScorePart {
  key: string;
  label: string;
  score: number; // achieved
  max: number;
  ok: boolean; // whether it cleared a "good enough" bar
}

export interface Analysis {
  score: number; // 0-100
  grade: "excellent" | "good" | "fair" | "weak";
  parts: ScorePart[];
  suggestions: string[];
}

/** Strong, achievement-oriented opener verbs that recruiters/ATS reward. */
const ACTION_VERBS: Record<Lang, string[]> = {
  tr: [
    "geliştirdim", "geliştir", "yönettim", "yönet", "kurdum", "kur", "tasarladım", "tasarla",
    "artırdım", "artır", "azalttım", "azalt", "iyileştirdim", "iyileştir", "liderlik",
    "yürüttüm", "yürüt", "oluşturdum", "oluştur", "uyguladım", "uygula", "optimize",
    "otomatikleştirdim", "kazandırdım", "sağladım", "sağla", "hızlandırdım", "büyüttüm",
    "yönettı", "başlattım", "başlat", "entegre", "dönüştürdüm", "koordine",
  ],
  en: [
    "led", "built", "developed", "designed", "managed", "created", "launched", "improved",
    "increased", "reduced", "delivered", "implemented", "optimized", "automated", "drove",
    "owned", "scaled", "shipped", "spearheaded", "established", "streamlined", "grew",
    "achieved", "boosted", "coordinated", "transformed", "architected", "mentored",
  ],
};

const T = (lang: Lang) =>
  lang === "tr"
    ? {
        contact: "İletişim bilgileri",
        summary: "Özet (Hakkında)",
        experience: "İş deneyimi derinliği",
        metrics: "Ölçülebilir başarılar",
        verbs: "Etkili aksiyon fiilleri",
        skills: "Yetenekler",
        education: "Eğitim",
        breadth: "Profil zenginliği",
      }
    : {
        contact: "Contact details",
        summary: "Summary (About)",
        experience: "Experience depth",
        metrics: "Quantified achievements",
        verbs: "Strong action verbs",
        skills: "Skills",
        education: "Education",
        breadth: "Profile breadth",
      };

function bullets(text: string): string[] {
  return (text || "")
    .split(/\n+/)
    .map((l) => l.replace(/^[-•*\s]+/, "").trim())
    .filter(Boolean);
}

const hasMetric = (s: string) => /(\d|%|\$|₺|€|x\b)/i.test(s);

// Turkish is verb-final: the action predicate sits at the END of the clause and
// carries a past-tense suffix (yaz→yazdım, et→ettim, iyileştir→iyileştirdim).
const TR_PAST = /(d[ıiuü]m|t[ıiuü]m|d[ıiuü]k|t[ıiuü]k|d[ıiuü]|t[ıiuü])$/i;

function hasStrongVerb(s: string, lang: Lang): boolean {
  const words = s.toLowerCase().split(/\s+/).map((w) => w.replace(/[^\p{L}]/gu, ""));
  if (!words.length) return false;
  if (lang === "tr") {
    const last = words[words.length - 1] || "";
    // a finished, owned action verb as predicate — or a known strong stem anywhere
    return TR_PAST.test(last) || words.some((w) => ACTION_VERBS.tr.some((v) => w.startsWith(v)));
  }
  // English: strong opener verb
  return ACTION_VERBS.en.some((v) => words[0].startsWith(v));
}

export function analyzeCV(data: CVData, lang: Lang): Analysis {
  const L = T(lang);
  const c = data.contact;
  const parts: ScorePart[] = [];

  // 1. Contact (15)
  const contactFields = [c.fullName, c.title, c.email, c.phone, c.location];
  const filled = contactFields.filter((v) => v && v.trim()).length;
  const hasLink = [c.website, c.linkedin, c.github].some((v) => v && v.trim());
  let contactScore = Math.round((filled / contactFields.length) * 12) + (hasLink ? 3 : 0);
  parts.push({ key: "contact", label: L.contact, score: contactScore, max: 15, ok: contactScore >= 13 });

  // 2. Summary (15)
  const sumLen = (data.summary || "").trim().length;
  let summaryScore = 0;
  if (sumLen >= 240 && sumLen <= 700) summaryScore = 15;
  else if (sumLen >= 140) summaryScore = 11;
  else if (sumLen >= 60) summaryScore = 6;
  else if (sumLen > 0) summaryScore = 3;
  parts.push({ key: "summary", label: L.summary, score: summaryScore, max: 15, ok: summaryScore >= 11 });

  // 3. Experience depth (20)
  const exp = data.experience.filter((e) => e.role || e.company);
  const allBullets = exp.flatMap((e) => bullets(e.description));
  let expScore = 0;
  expScore += Math.min(exp.length, 3) * 4; // up to 12 for 3+ roles
  expScore += Math.min(allBullets.length, 8); // up to 8 for 8+ bullets
  expScore = Math.min(expScore, 20);
  parts.push({ key: "experience", label: L.experience, score: expScore, max: 20, ok: expScore >= 14 });

  // 4. Quantified achievements (15)
  const metricBullets = allBullets.filter(hasMetric).length;
  let metricScore = Math.min(metricBullets, 5) * 3; // 5 quantified bullets = full
  parts.push({ key: "metrics", label: L.metrics, score: metricScore, max: 15, ok: metricScore >= 9 });

  // 5. Action verbs (10)
  const verbBullets = allBullets.filter((b) => hasStrongVerb(b, lang)).length;
  const verbRatio = allBullets.length ? verbBullets / allBullets.length : 0;
  let verbScore = Math.round(verbRatio * 10);
  parts.push({ key: "verbs", label: L.verbs, score: verbScore, max: 10, ok: verbScore >= 6 });

  // 6. Skills (10)
  const skills = data.skills.filter((s) => s.name && s.name.trim()).length;
  let skillScore = skills >= 6 ? 10 : skills >= 3 ? 6 : skills >= 1 ? 3 : 0;
  parts.push({ key: "skills", label: L.skills, score: skillScore, max: 10, ok: skillScore >= 6 });

  // 7. Education (5)
  const edu = data.education.filter((e) => e.degree || e.school).length;
  const eduScore = edu >= 1 ? 5 : 0;
  parts.push({ key: "education", label: L.education, score: eduScore, max: 5, ok: eduScore >= 5 });

  // 8. Breadth (10): languages + certificates + projects
  const langs = data.languages.filter((l) => l.name).length;
  const certs = data.certificates.filter((x) => x.name).length;
  const projs = data.projects.filter((p) => p.name).length;
  let breadthScore = 0;
  if (langs >= 1) breadthScore += 3;
  if (langs >= 2) breadthScore += 1;
  if (certs >= 1) breadthScore += 3;
  if (projs >= 1) breadthScore += 3;
  breadthScore = Math.min(breadthScore, 10);
  parts.push({ key: "breadth", label: L.breadth, score: breadthScore, max: 10, ok: breadthScore >= 6 });

  const score = Math.max(0, Math.min(100, parts.reduce((a, p) => a + p.score, 0)));
  const grade =
    score >= 85 ? "excellent" : score >= 68 ? "good" : score >= 45 ? "fair" : "weak";

  const suggestions = buildSuggestions(parts, lang, { metricBullets, verbBullets, skills, exp: exp.length });

  return { score, grade, parts, suggestions };
}

function buildSuggestions(
  parts: ScorePart[],
  lang: Lang,
  ctx: { metricBullets: number; verbBullets: number; skills: number; exp: number }
): string[] {
  const tr = lang === "tr";
  const out: string[] = [];
  const get = (k: string) => parts.find((p) => p.key === k)!;

  if (!get("contact").ok)
    out.push(tr
      ? "İletişim bölümünü tamamla: ad, ünvan, e-posta, telefon, konum ve en az bir bağlantı (LinkedIn/portföy) ekle."
      : "Complete your contact section: name, title, email, phone, location and at least one link (LinkedIn/portfolio).");

  const sum = get("summary");
  if (sum.score === 0)
    out.push(tr
      ? "Bir 'Hakkında' özeti ekle — IK uzmanları ilk 6 saniyede burayı okur. Aşağıdaki öneriyi tek tıkla kullanabilirsin."
      : "Add an 'About' summary — recruiters read it in the first 6 seconds. Use the one-click suggestion below.");
  else if (!sum.ok)
    out.push(tr
      ? "Özetini 2-4 cümleye çıkar: kaç yıl deneyim, uzmanlık alanın ve en güçlü 1-2 başarın."
      : "Expand your summary to 2-4 sentences: years of experience, your specialty, and your strongest 1-2 wins.");

  if (!get("experience").ok)
    out.push(tr
      ? "Her iş deneyimine 3-5 madde ekle; ne yaptığını değil, ne sonuç doğurduğunu yaz."
      : "Add 3-5 bullets per role; describe outcomes, not just duties.");

  if (!get("metrics").ok)
    out.push(tr
      ? `Başarılarını sayılarla kanıtla (örn. "%30 hızlandırdım", "12 kişilik ekip"). Şu an ${ctx.metricBullets} ölçülebilir madden var; en az 4-5 hedefle.`
      : `Quantify your impact (e.g. "cut load time 30%", "led a team of 12"). You have ${ctx.metricBullets} measurable bullets; aim for 4-5+.`);

  if (!get("verbs").ok)
    out.push(tr
      ? "Maddelerine güçlü fiille başla: 'Geliştirdim', 'Yönettim', 'Artırdım' gibi. Pasif/durağan ifadelerden kaçın."
      : "Start bullets with strong verbs: 'Led', 'Built', 'Increased'. Avoid passive phrasing.");

  if (!get("skills").ok)
    out.push(tr
      ? `Yetenek sayını artır (şu an ${ctx.skills}). Pozisyona uygun 6-12 teknik/araç ekle — ATS anahtar kelime eşleşmesi için önemli.`
      : `Add more skills (currently ${ctx.skills}). List 6-12 role-relevant tools — key for ATS keyword matching.`);

  if (!get("education").ok)
    out.push(tr ? "Eğitim bilgini ekle." : "Add your education.");

  if (!get("breadth").ok)
    out.push(tr
      ? "Profilini zenginleştir: diller, sertifikalar veya öne çıkan bir proje ekleyerek rakiplerinden ayrış."
      : "Enrich your profile: add languages, certificates or a standout project to differentiate yourself.");

  return out;
}

/** Earliest 4-digit year found across experience start dates → years of experience. */
function yearsOfExperience(data: CVData): number {
  const years = data.experience
    .map((e) => parseInt((e.start.match(/\d{4}/) || [])[0] || "", 10))
    .filter((n) => !isNaN(n));
  if (!years.length) return 0;
  const earliest = Math.min(...years);
  const now = new Date().getFullYear();
  return Math.max(0, now - earliest);
}

/** Build a recruiter-friendly "About" paragraph from the existing data. */
export function suggestSummary(data: CVData, lang: Lang): string {
  const c = data.contact;
  const title = (c.title || "").trim();
  if (!title) return "";

  const yrs = yearsOfExperience(data);
  const topSkills = data.skills
    .map((s) => s.name.trim())
    .filter(Boolean)
    .slice(0, 4);
  const company = data.experience.find((e) => e.company)?.company?.trim();

  if (lang === "tr") {
    const expClause = yrs >= 1 ? `${yrs}+ yıl deneyimli ` : "";
    let s = `${expClause}${title}.`;
    if (topSkills.length)
      s += ` ${topSkills.join(", ")} alanlarında uzman;`;
    s += ` ölçülebilir sonuçlar üretmeye, temiz çözümlere ve ekip içinde güçlü iş birliğine önem veririm.`;
    if (company) s += ` ${company} başta olmak üzere farklı projelerde sorumluluk aldım.`;
    return s.replace(/\s+/g, " ").trim();
  }

  const expClause = yrs >= 1 ? `${title} with ${yrs}+ years of experience` : `${title}`;
  let s = `${expClause}.`;
  if (topSkills.length) s += ` Specialized in ${topSkills.join(", ")};`;
  s += ` focused on delivering measurable results, clean solutions and strong collaboration.`;
  if (company) s += ` Took ownership across projects including ${company}.`;
  return s.replace(/\s+/g, " ").trim();
}
