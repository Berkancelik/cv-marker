import { CVData, Lang } from "./types";

const uid = () => Math.random().toString(36).slice(2, 9);

export function sampleData(lang: Lang): CVData {
  if (lang === "tr") {
    return {
      contact: {
        fullName: "Elif Yılmaz",
        title: "Kıdemli Frontend Geliştirici",
        email: "elif.yilmaz@email.com",
        phone: "+90 532 123 45 67",
        location: "İstanbul, Türkiye",
        website: "elifyilmaz.dev",
        linkedin: "linkedin.com/in/elifyilmaz",
        github: "github.com/elifyilmaz",
        photo: "",
      },
      summary:
        "6+ yıl deneyimli, kullanıcı odaklı arayüzler geliştiren frontend mühendisi. React ve TypeScript ekosisteminde uzman; performans, erişilebilirlik ve temiz mimariye önem veririm.",
      experience: [
        {
          id: uid(),
          role: "Kıdemli Frontend Geliştirici",
          company: "TechNova",
          location: "İstanbul",
          start: "2022",
          end: "",
          current: true,
          description:
            "Şirketin ana SaaS ürününün arayüzünü React + TypeScript ile yeniden yazdım\n5 kişilik frontend ekibine teknik liderlik ettim\nSayfa yüklenme süresini %40 iyileştirdim",
        },
        {
          id: uid(),
          role: "Frontend Geliştirici",
          company: "Webinox",
          location: "Ankara",
          start: "2019",
          end: "2022",
          current: false,
          description:
            "E-ticaret platformu için yeniden kullanılabilir bileşen kütüphanesi geliştirdim\nTest kapsamını %30'dan %85'e çıkardım",
        },
      ],
      education: [
        {
          id: uid(),
          degree: "Bilgisayar Mühendisliği (Lisans)",
          school: "Boğaziçi Üniversitesi",
          location: "İstanbul",
          start: "2014",
          end: "2018",
          description: "GPA: 3.6 / 4.0",
        },
      ],
      projects: [
        {
          id: uid(),
          name: "OpenChart",
          link: "github.com/elifyilmaz/openchart",
          description: "Hafif, bağımlılıksız bir React grafik kütüphanesi. 1.2k+ yıldız.",
        },
      ],
      skills: [
        { id: uid(), name: "React" },
        { id: uid(), name: "TypeScript" },
        { id: uid(), name: "Next.js" },
        { id: uid(), name: "CSS / Tailwind" },
        { id: uid(), name: "Node.js" },
      ],
      languages: [
        { id: uid(), name: "Türkçe", level: "Anadil" },
        { id: uid(), name: "İngilizce", level: "C1" },
        { id: uid(), name: "Almanca", level: "A2" },
      ],
      certificates: [
        { id: uid(), name: "AWS Certified Developer", issuer: "Amazon", date: "2023" },
      ],
    };
  }
  return {
    contact: {
      fullName: "Elif Yılmaz",
      title: "Senior Frontend Developer",
      email: "elif.yilmaz@email.com",
      phone: "+90 532 123 45 67",
      location: "Istanbul, Türkiye",
      website: "elifyilmaz.dev",
      linkedin: "linkedin.com/in/elifyilmaz",
      github: "github.com/elifyilmaz",
      photo: "",
    },
    summary:
      "Frontend engineer with 6+ years building user-focused interfaces. Expert in the React and TypeScript ecosystem; I care about performance, accessibility and clean architecture.",
    experience: [
      {
        id: uid(),
        role: "Senior Frontend Developer",
        company: "TechNova",
        location: "Istanbul",
        start: "2022",
        end: "",
        current: true,
        description:
          "Rewrote the company's flagship SaaS UI in React + TypeScript\nTechnically led a frontend team of 5\nImproved page load time by 40%",
      },
      {
        id: uid(),
        role: "Frontend Developer",
        company: "Webinox",
        location: "Ankara",
        start: "2019",
        end: "2022",
        current: false,
        description:
          "Built a reusable component library for an e-commerce platform\nRaised test coverage from 30% to 85%",
      },
    ],
    education: [
      {
        id: uid(),
        degree: "BSc Computer Engineering",
        school: "Boğaziçi University",
        location: "Istanbul",
        start: "2014",
        end: "2018",
        description: "GPA: 3.6 / 4.0",
      },
    ],
    projects: [
      {
        id: uid(),
        name: "OpenChart",
        link: "github.com/elifyilmaz/openchart",
        description: "A lightweight, dependency-free React charting library. 1.2k+ stars.",
      },
    ],
    skills: [
      { id: uid(), name: "React" },
      { id: uid(), name: "TypeScript" },
      { id: uid(), name: "Next.js" },
      { id: uid(), name: "CSS / Tailwind" },
      { id: uid(), name: "Node.js" },
    ],
    languages: [
      { id: uid(), name: "Turkish", level: "Native" },
      { id: uid(), name: "English", level: "C1" },
      { id: uid(), name: "German", level: "A2" },
    ],
    certificates: [
      { id: uid(), name: "AWS Certified Developer", issuer: "Amazon", date: "2023" },
    ],
  };
}

export function emptyData(): CVData {
  return {
    contact: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      photo: "",
    },
    summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    certificates: [],
  };
}

export const newId = uid;
