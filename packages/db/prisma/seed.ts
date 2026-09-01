import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient, Locale, TripKind, type Prisma } from "@prisma/client";

config({ path: resolve(__dirname, "../../../.env") });

const prisma = new PrismaClient();

type ItineraryDay = { day: number; title: string; body: string };

type LocaleCopy = {
  name: string;
  summary: string;
  description: string;
  itinerary: ItineraryDay[];
  seasonLabel: string;
  difficultyLabel: string;
};

/** en, zh, ko, he */
type Q = [string, string, string, string];

const LOCALES: Locale[] = ["en", "zh", "ko", "he"];

const COPY_NAMESPACES = new Set([
  "hero",
  "heroTabs",
  "featured",
  "partners",
  "purpose",
  "value",
  "how",
  "voices",
  "faq",
  "ctaBanner",
  "blogs",
  "rated",
  "memories",
  "associated",
  "about",
  "plan",
  "prepare",
  "legal",
]);
const CONTACT_KEYS = new Set(["kicker", "title", "lede", "hours", "wechatHint"]);

function flattenMessages(obj: unknown, prefix = ""): Record<string, string> {
  if (!obj || typeof obj !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(out, flattenMessages(v, key));
  }
  return out;
}

function pagesFromLocale(locale: Locale): Record<string, string> {
  const path = resolve(__dirname, `../../../apps/web/messages/${locale}.json`);
  const msgs = JSON.parse(readFileSync(path, "utf8"));
  const flat = flattenMessages(msgs);
  const pages: Record<string, string> = {};
  for (const [k, v] of Object.entries(flat)) {
    const ns = k.split(".")[0];
    if (COPY_NAMESPACES.has(ns)) pages[k] = v;
    if (k === "meta.homeDescription" || k === "footer.blurb") pages[k] = v;
    if (ns === "contact" && CONTACT_KEYS.has(k.slice("contact.".length))) pages[k] = v;
  }
  const col = settingsCopy[locale];
  pages.tagline = col.tagline;
  pages["intro.title"] = col.introTitle;
  pages["intro.body"] = col.introBody;
  pages["about.title"] = col.aboutTitle;
  pages["about.body"] = col.aboutBody;
  return pages;
}

const DEFAULT_ASSOCIATIONS = [
  { url: "/associations/1.svg", alt: "Emblem of Nepal" },
  { url: "/associations/2.svg", alt: "Nepal Tourism Board" },
  { url: "/associations/3.svg", alt: "Nepal Mountaineering Association" },
  { url: "/associations/4.svg", alt: "Trekking Agencies' Association of Nepal" },
];

const DEFAULT_CHIPS = [
  { id: "everest", tab: "destinations", href: "/treks", count: 3, titleKey: "everest", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80" },
  { id: "annapurna", tab: "destinations", href: "/treks", count: 7, titleKey: "annapurna", image: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80" },
  { id: "langtang", tab: "destinations", href: "/treks", count: 2, titleKey: "langtang", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80" },
  { id: "restricted", tab: "destinations", href: "/treks", count: 3, titleKey: "restricted", image: "https://images.unsplash.com/photo-1758701320941-89f86492c1ef?auto=format&fit=crop&w=2000&q=80" },
  { id: "hiddenGems", tab: "destinations", href: "/treks", count: 7, titleKey: "hiddenGems", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80" },
  { id: "allOther", tab: "destinations", href: "/treks", count: 9, titleKey: "allOther", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80" },
  { id: "treks", tab: "activities", href: "/treks", count: 18, titleKey: "treks", image: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80" },
  { id: "rafting", tab: "activities", href: "/rafting", count: 3, titleKey: "rafting", image: "https://images.pexels.com/photos/1732278/pexels-photo-1732278.jpeg?auto=compress&cs=tinysrgb&w=2000" },
  { id: "air", tab: "activities", href: "/activities", count: 2, titleKey: "air", image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=2000&q=80" },
  { id: "extreme", tab: "activities", href: "/activities", count: 4, titleKey: "extreme", image: "https://images.unsplash.com/photo-1559677624-3c956f10d431?auto=format&fit=crop&w=2000&q=80" },
  { id: "safaris", tab: "activities", href: "/safaris", count: 3, titleKey: "safaris", image: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=2000" },
  { id: "zip", tab: "activities", href: "/activities", count: 3, titleKey: "zip", image: "https://images.unsplash.com/photo-1696940389431-b6a2f2e1b784?auto=format&fit=crop&w=2000&q=80" },
  { id: "easy", tab: "difficulty", href: "/treks", count: 8, titleKey: "easy", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80" },
  { id: "moderate", tab: "difficulty", href: "/treks", count: 9, titleKey: "moderate", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80" },
  { id: "challenging", tab: "difficulty", href: "/treks", count: 7, titleKey: "challenging", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80" },
];

const IMAGES = {
  // Annapurna / Pokhara — Machhapuchhre + prayer flags (ABC, Dhampus, Poon Hill, Ghandruk)
  annapurna: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80",
  // Phewa Lake boats — Lakeside / about
  phewa: "https://images.unsplash.com/photo-1706187975952-33765f844667?auto=format&fit=crop&w=2000&q=80",
  // Forest trail — Panchase / Sikles / Tsum approach
  forest: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80",
  // High alpine ridge — Mardi / Kuri / Nar Phu
  ridge: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80",
  // Snow peaks / high pass — Khopra, Manaslu, Dhaulagiri
  peaks: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  // Trekker on high ridge — Circuit / Langtang
  trekker: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80",
  // Everest region (Khumbu) — EBC
  everest: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80",
  // High Khumbu snow faces — Kanchenjunga
  khumbu: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2000&q=80",
  // High mountain lake — Tilicho / Frozen Lake
  alpineLake: "https://images.unsplash.com/photo-1609224584184-893bc7157d54?auto=format&fit=crop&w=2000&q=80",
  // Upper Mustang arid highland valley (not sand dunes)
  arid: "https://images.unsplash.com/photo-1758701320941-89f86492c1ef?auto=format&fit=crop&w=2000&q=80",
  // Sunrise above cloud sea — Sarangkot viewpoint
  sunriseRidge: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
  // Whitewater rafting
  rafting: "https://images.pexels.com/photos/1732278/pexels-photo-1732278.jpeg?auto=compress&cs=tinysrgb&w=2000",
  // Hot air balloons
  balloon: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=2000&q=80",
  // Literal zip line
  zipline: "https://images.unsplash.com/photo-1696940389431-b6a2f2e1b784?auto=format&fit=crop&w=2000&q=80",
  // Literal bungee jump over a river gorge
  bungeeJump: "https://images.unsplash.com/photo-1559677624-3c956f10d431?auto=format&fit=crop&w=2000&q=80",
  // Bengal tiger — Bardia
  tiger: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=2000&q=80",
  // Elephant herd — Chitwan
  elephants: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=2000",
  // Misty highland forest — Dhorpatan
  mistForest: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=2000",
  // Aliases matching product keys
  abc: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80",
  circuit: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80",
  poon: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80",
  mardi: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80",
  khopra: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  dhampus: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80",
  sarangkot: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
  panchase: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80",
  ghandruk: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80",
  sikles: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80",
  kuri: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80",
  mohare: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80",
  mustang: "https://images.unsplash.com/photo-1758701320941-89f86492c1ef?auto=format&fit=crop&w=2000&q=80",
  kali: "https://images.pexels.com/photos/1732278/pexels-photo-1732278.jpeg?auto=compress&cs=tinysrgb&w=2000",
  zip: "https://images.unsplash.com/photo-1696940389431-b6a2f2e1b784?auto=format&fit=crop&w=2000&q=80",
  bungee: "https://images.unsplash.com/photo-1559677624-3c956f10d431?auto=format&fit=crop&w=2000&q=80",
  swing: "https://images.unsplash.com/photo-1559677624-3c956f10d431?auto=format&fit=crop&w=2000&q=80",
  trolley: "https://images.unsplash.com/photo-1696940389431-b6a2f2e1b784?auto=format&fit=crop&w=2000&q=80",
  chitwan: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=2000",
  bardia: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=2000&q=80",
  dhorpatan: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=2000",
  manaslu: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  tsum: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80",
  narphu: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80",
  dhaulagiri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  langtang: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80",
  tilicho: "https://images.unsplash.com/photo-1609224584184-893bc7157d54?auto=format&fit=crop&w=2000&q=80",
  ebc: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80",
  kanchenjunga: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2000&q=80",
  manang: "https://images.unsplash.com/photo-1758701320941-89f86492c1ef?auto=format&fit=crop&w=2000&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1706187975952-33765f844667?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1400&q=80",
  ],
};

const settingsCopy: Record<
  Locale,
  {
    tagline: string;
    heroHeadline: string;
    heroSubhead: string;
    introTitle: string;
    introBody: string;
    aboutTitle: string;
    aboutBody: string;
  }
> = {
  en: {
    tagline: "Guided treks from Pokhara into the Annapurna Himalaya",
    heroHeadline: "Walk the Annapurna.\nSleep under a Himalayan sky.",
    heroSubhead:
      "A Nepali company based in Pokhara. Small groups, honest pacing, and a booking that does not ask you to create an account.",
    introTitle: "The range, from the lake.",
    introBody:
      "We plan, permit, and guide Annapurna treks from Lakeside, Pokhara. You choose the trail. We handle the rest — tea houses, porters, TIMS, ACAP, and the quiet logistics that make a high path feel simple.",
    aboutTitle: "Pokhara is home. The Annapurna is the work.",
    aboutBody:
      "Upper Path Treks And Tours is a locally owned trekking company in Pokhara-6, Lakeside. Our guides grew up on these paths. We run small departures, speak plainly about weather and fitness, and stay reachable on WhatsApp, Viber, WeChat, and email — before you walk and after you come down.",
  },
  zh: {
    tagline: "从博卡拉出发，由向导带领走进安纳普尔纳雪山",
    heroHeadline: "走进安纳普尔纳。\n枕着喜马拉雅的夜空入眠。",
    heroSubhead: "尼泊尔本土公司，位于博卡拉。小团队、诚实的配速；预订无需注册账号。",
    introTitle: "从湖畔出发，走向整座山脉。",
    introBody:
      "我们在博卡拉湖畔安排安纳普尔纳徒步：路线、许可、茶馆、背夫、TIMS 与 ACAP。你选路，其余交给我们，让高海拔的路走起来更从容。",
    aboutTitle: "博卡拉是家，安纳普尔纳是工作。",
    aboutBody:
      "Upper Path Treks And Tours 是博卡拉湖畔的本地徒步公司。向导在这些山路上长大。我们坚持小团队出发，如实说明天气与体能要求，并在 WhatsApp、Viber、微信和邮件上随时可及——出发前与下山后都一样。",
  },
  ko: {
    tagline: "포카라에서 출발하는 안나푸르나 가이드 트레킹",
    heroHeadline: "안나푸르나를 걷고,\n히말라야 하늘 아래 잠드세요.",
    heroSubhead:
      "포카라에 있는 네팔 현지 회사입니다. 소규모 그룹, 정직한 페이스. 예약에 계정 만들기는 필요 없습니다.",
    introTitle: "호숫가에서 산맥으로.",
    introBody:
      "포카라 레이크사이드에서 안나푸르나 트레킹을 기획하고 허가와 가이드를 맡습니다. 찻집, 포터, TIMS, ACAP까지 — 고지대 길이 단순해지도록 나머지를 우리가 챙깁니다.",
    aboutTitle: "포카라는 집, 안나푸르나는 일.",
    aboutBody:
      "Upper Path Treks And Tours는 포카라 레이크사이드의 현지 트레킹 회사입니다. 가이드는 이 길에서 자랐습니다. 소규모로 출발하고, 날씨와 체력을 솔직히 말하며, WhatsApp, Viber, WeChat, 이메일로 언제나 연락할 수 있습니다.",
  },
  he: {
    tagline: "טיולי טרקים מודרכים מפוקרה אל הרי האנאפורנה",
    heroHeadline: "ללכת באנאפורנה.\nלישון תחת שמי ההימלאיה.",
    heroSubhead: "חברה נפאלית שבסיסה בפוקרה. קבוצות קטנות, קצב ישר, והזמנה בלי לפתוח חשבון.",
    introTitle: "הרכס, מהאגם.",
    introBody:
      "מתכננים, מארגנים היתרים ומדריכים טרקים באנאפורנה מאזור לייקסייד בפוקרה. אתם בוחרים את השביל. אנחנו דואגים לשאר — בתי תה, סבלים, TIMS, ACAP, והלוגיסטיקה השקטה שהופכת שביל גבוה לפשוט.",
    aboutTitle: "פוקרה היא הבית. האנאפורנה היא העבודה.",
    aboutBody:
      "Upper Path Treks And Tours היא חברת טרקים בבעלות מקומית בלייקסייד, פוקרה. המדריכים שלנו גדלו על השבילים האלה. יוצאים בקבוצות קטנות, מדברים בכנות על מזג האוויר ועל הכושר, ונשארים זמינים ב-WhatsApp, Viber, WeChat ובמייל — לפני היציאה ואחרי הירידה.",
  },
};

function loc(name: Q, summary: Q, description: Q, season: Q, difficulty: Q, itinerary: [Q, Q][]): Record<Locale, LocaleCopy> {
  const out = {} as Record<Locale, LocaleCopy>;
  LOCALES.forEach((locale, i) => {
    out[locale] = {
      name: name[i],
      summary: summary[i],
      description: description[i],
      seasonLabel: season[i],
      difficultyLabel: difficulty[i],
      itinerary: itinerary.map(([title, body], d) => ({ day: d + 1, title: title[i], body: body[i] })),
    };
  });
  return out;
}

const TREK_INCLUSIONS = [
  "Licensed guide",
  "ACAP & TIMS permits",
  "Tea-house lodging",
  "Breakfast, lunch, dinner on trek",
  "Pokhara airport or hotel pickup",
];
const TREK_EXCLUSIONS = ["International flights", "Nepal visa", "Travel insurance", "Personal snacks & drinks", "Tips"];

const MUSTANG_INCLUSIONS = [
  "Licensed guide",
  "Upper Mustang restricted permit",
  "ACAP & TIMS permits",
  "Tea-house lodging",
  "Breakfast, lunch, dinner on trek",
  "Pokhara–Jomsom transport",
];

const RAFT_INCLUSIONS = [
  "IFRT licensed river guide",
  "Raft, PFD, helmet",
  "Transport from Lakeside",
  "Meals on the river",
  "Safety kayaker on Grade III+",
];
const RAFT_EXCLUSIONS = ["Photos from the chase raft (optional)", "Personal dry bags", "Tips", "Travel insurance"];

const ACTIVITY_INCLUSIONS = [
  "Hotel pickup and drop from Lakeside (shared)",
  "Activity ticket / entry",
  "Certified operator briefing",
  "Basic safety gear",
];
const ACTIVITY_EXCLUSIONS = ["Photo / video package", "Meals", "Tips", "Travel insurance", "Private transport"];

const SAFARI_INCLUSIONS = [
  "Park entry as quoted",
  "Lodge or hotel nights on package",
  "Guided jeep / walking / canoe as itinerary",
  "Meals as listed on the package",
  "Pokhara or Kathmandu transfer as quoted",
];
const SAFARI_EXCLUSIONS = ["International flights", "Nepal visa", "Travel insurance", "Alcohol & soft drinks", "Tips"];

const MONTHS_TREK = [3, 4, 5, 9, 10, 11];
const MONTHS_SHORT = [1, 2, 3, 4, 5, 10, 11, 12];
const MONTHS_RIVER = [3, 4, 5, 9, 10, 11];
const MONTHS_ACTIVITY = [1, 2, 3, 4, 5, 9, 10, 11, 12];
const MONTHS_SAFARI = [10, 11, 12, 1, 2, 3, 4, 5];
const D_THRILL: Q = ["Thrill", "刺激", "스릴", "ריגוש"];
const S_YEAR: Q = ["Year-round (weather permitting)", "全年（视天气）", "연중(날씨 허용 시)", "כל השנה (בהתאם למזג האוויר)"];
const S_SAFARI: Q = ["October–May", "十月至五月", "10–5월", "אוקטובר–מאי"];

type SeedTrip = {
  slug: string;
  kind?: TripKind;
  durationDays: number;
  difficulty: string;
  maxAltitudeM: number;
  priceFromUsd: number;
  season: string;
  heroImageUrl: string;
  featured: boolean;
  sortOrder: number;
  inclusions?: string[];
  exclusions?: string[];
  bestMonths?: number[];
  river?: string;
  grade?: string;
  minAge?: number;
  altitudeProfile?: { d: number; m: number }[];
  copy: Record<Locale, LocaleCopy>;
};

const S_CLASSIC: Q = ["March–May & September–November", "三月至五月、九月至十一月", "3–5월, 9–11월", "מרץ–מאי וספטמבר–נובמבר"];
const S_OCT_MAY: Q = ["October–May", "十月至五月", "10–5월", "אוקטובר–מאי"];
const S_MARDI: Q = ["March–May & October–November", "三月至五月、十月至十一月", "3–5월, 10–11월", "מרץ–מאי ואוקטובר–נובמבר"];
const S_RIVER: Q = ["September–November & March–May", "九月至十一月、三月至五月", "9–11월, 3–5월", "ספטמבר–נובמבר ומרץ–מאי"];
const D_EASY: Q = ["Easy", "轻松", "쉬움", "קל"];
const D_MOD: Q = ["Moderate", "中等", "중급", "בינוני"];
const D_CHAL: Q = ["Challenging", "挑战", "도전", "מאתגר"];
const D_RIVER: Q = ["Spirited", "有劲", "활기참", "ערני"];

const treks: SeedTrip[] = [
  {
    slug: "australian-camp-dhampus",
    durationDays: 2,
    difficulty: "easy",
    maxAltitudeM: 2060,
    priceFromUsd: 149,
    season: "Oct–May",
    heroImageUrl: IMAGES.dhampus,
    featured: true,
    sortOrder: 1,
    bestMonths: MONTHS_SHORT,
    altitudeProfile: [
      { d: 1, m: 1770 },
      { d: 2, m: 2060 },
    ],
    copy: loc(
      ["Australian Camp & Dhampus", "澳大利亚营地与丹普斯", "오스트레일리안 캠프 · 담푸스", "אוסטרליאן קמפ ודהמפוס"],
      [
        "Drive to Kande, then a short ridge walk to Machhapuchhre and Annapurna South. Sleep in Dhampus.",
        "车至坎德，再沿山脊短走，看鱼尾峰与安纳普尔纳南峰。夜宿丹普斯。",
        "칸데까지 이동 후 짧은 능선 트레킹. 마차푸치레와 안나푸르나 사우스. 담푸스에서 잡니다.",
        "נסיעה לקאנדה והליכת רכס קצרה אל מצ'פוצ'רה ואנאפורנה דרום. לנים בדהמפוס.",
      ],
      [
        "The closest honest overnight from Pokhara. A jeep to Kande, then forest and ridge to Australian Camp (about 2,060 m) with Machhapuchhre filling the north window. Next morning you walk into Dhampus village and drive back to the lake. Stairs, not altitude. Good after a long flight or before a bigger trek.",
        "从博卡拉出发最近的诚实过夜。吉普到坎德，再经森林与山脊到澳大利亚营地（约 2,060 米），北窗里是鱼尾峰。次日走进丹普斯村，驱车回湖。是台阶，不是高海拔。适合刚下飞机，或作为更长徒步前的热身。",
        "포카라에서 가장 가까운 정직한 1박. 지프로 칸데까지, 숲과 능선을 지나 오스트레일리안 캠프(약 2,060 m). 북쪽 창에 마차푸치레. 다음날 담푸스 마을을 걷고 호수로 돌아옵니다. 고도가 아니라 계단입니다.",
        "לילה כנה וקרוב מפוקרה. ג'יפ לקאנדה, יער ורכס עד אוסטרליאן קמפ (כ־2,060 מ'). מצ'פוצ'רה בחלון הצפוני. בבוקר הולכים לדהמפוס וחוזרים לאגם. מדרגות, לא גובה.",
      ],
      S_OCT_MAY,
      D_EASY,
      [
        [
          ["Pokhara to Australian Camp", "博卡拉至澳大利亚营地", "포카라에서 오스트레일리안 캠프", "מפוקרה לאוסטרליאן קמפ"],
          ["Jeep to Kande, then a warm climb through forest onto the ridge. Sunset on Machhapuchhre.", "吉普至坎德，再缓爬穿过森林上到山脊。鱼尾峰日落。", "지프로 칸데, 숲을 지나 능선으로. 마차푸치레 일몰.", "ג'יפ לקאנדה וטיפוס חם ביער אל הרכס. שקיעה על מצ'פוצ'רה."],
        ],
        [
          ["Dhampus village, return Pokhara", "丹普斯村，返回博卡拉", "담푸스 마을, 포카라 복귀", "כפר דהמפוס, חזרה לפוקרה"],
          ["Morning walk into Gurung lanes of Dhampus, then a jeep back to Lakeside.", "清晨走进丹普斯古隆族石巷，吉普回湖畔。", "아침 담푸스 구룽 골목 산책 후 지프로 레이크사이드.", "בוקר בסמטאות גורונג של דהמפוס, ואז ג'יפ חזרה ללייקסייד."],
        ],
      ],
    ),
  },
  {
    slug: "sarangkot-naudanda",
    durationDays: 1,
    difficulty: "easy",
    maxAltitudeM: 1600,
    priceFromUsd: 79,
    season: "Oct–May",
    heroImageUrl: IMAGES.sarangkot,
    featured: true,
    sortOrder: 2,
    bestMonths: MONTHS_SHORT,
    altitudeProfile: [{ d: 1, m: 1600 }],
    copy: loc(
      ["Day Treks: Sarangkot / Stupa / Pumdikot", "一日徒步：萨朗科特 / 佛塔 / 普姆迪科特", "당일 트레킹: 사랑콧 / 스투파 / 품디콧", "טיולי יום: סארנקוט / סטופה / פומדיקוט"],
      [
        "One day above Pokhara: Sarangkot sunrise, Peace Stupa, or Pumdikot viewpoints. Pick one or combine.",
        "博卡拉一日：萨朗科特日出、和平佛塔或普姆迪科特观景。可单选或组合。",
        "포카라 하루: 사랑콧 일출, 피스 스투파, 품디콧 전망. 하나 또는 조합.",
        "יום מעל פוקרה: זריחה בסארנקוט, סטופת השלום או תצפיות פומדיקוט. אחד או שילוב.",
      ],
      [
        "Our classic day options from Lakeside. Sarangkot (about 1,600 m) for dawn over Phewa and the Annapurna line; the World Peace Stupa for a quieter lake overlook; Pumdikot for the tall Shiva statue and west-ridge views. We jeep and walk as the day allows. Paragliding off Sarangkot is optional and quoted separately.",
        "湖畔出发的经典一日。萨朗科特（约 1,600 米）看费瓦与安纳普尔纳黎明；世界和平佛塔更安静的湖景；普姆迪科特高大湿婆像与西脊视野。视日程吉普与步行。萨朗科特滑翔伞可选、另报价。",
        "레이크사이드에서 떠나는 당일 코스. 사랑콧(약 1,600 m) 페와·안나푸르나 새벽, 피스 스투파의 호수 전망, 품디콧의 시바상과 서쪽 능선. 패러글라이딩은 선택·별도 견적.",
        "אפשרויות יום קלאסיות מלייקסייד. סארנקוט לזריחה, סטופת השלום למבט שקט על האגם, פומדיקוט לפסל שיבה ולנוף מערבי. מצנח רחיפה אופציונלי ומתומחר בנפרד.",
      ],
      S_OCT_MAY,
      D_EASY,
      [
        [
          ["Pokhara day viewpoints", "博卡拉一日观景点", "포카라 당일 전망", "תצפיות יום בפוקרה"],
          ["Pickup from Lakeside. Sarangkot, Peace Stupa, and/or Pumdikot as agreed. Return by afternoon.", "湖畔接人。按约定前往萨朗科特、和平佛塔和/或普姆迪科特。下午返回。", "레이크사이드 픽업. 사랑콧, 피스 스투파, 품디콧 중 합의한 코스. 오후 복귀.", "איסוף מלייקסייד. סארנקוט, סטופה ו/או פומדיקוט לפי סיכום. חזרה אחר הצהריים."],
        ],
      ],
    ),
  },
  {
    slug: "panchase",
    durationDays: 3,
    difficulty: "easy",
    maxAltitudeM: 2500,
    priceFromUsd: 190,
    season: "Oct–May",
    heroImageUrl: IMAGES.panchase,
    featured: true,
    sortOrder: 3,
    bestMonths: MONTHS_SHORT,
    altitudeProfile: [
      { d: 1, m: 1450 },
      { d: 2, m: 2500 },
      { d: 3, m: 820 },
    ],
    copy: loc(
      ["Panchase", "潘查塞", "판차세", "פאנצ'אסה"],
      [
        "Oak and rhododendron, Gurung villages, Dhaulagiri and Annapurna from a 2,500 m ridge.",
        "橡树与杜鹃、古隆村落，从 2,500 米山脊看道拉吉里与安纳普尔纳。",
        "참나무와 진달래, 구룽 마을, 2,500 m 능선에서 다울라기리와 안나푸르나.",
        "אלון ורודודנדרון, כפרי גורונג, דהאולגירי ואנאפורנה מרכס 2,500 מ'.",
      ],
      [
        "Panchase is the quiet three-day loop west of Pokhara. Forest, ridge, and village lodges rather than high tea-house traffic. From the ridge you can see Dhaulagiri and the Annapurna line on a clear morning. Typical length is two to three days; we hold three so the middle night sits near 2,500 m without rushing the descent.",
        "潘查塞是博卡拉以西安静的三日环线。森林、山脊、村落旅舍，而不是拥挤的高海拔茶馆。晴朗早晨从山脊可见道拉吉里与安纳普尔纳一线。通常两到三天；我们按三天走，让中间一夜靠近 2,500 米，下山不赶。",
        "판차세는 포카라 서쪽의 한적한 3일 루프입니다. 숲, 능선, 마을 롯지. 맑은 아침 능선에서 다울라기리와 안나푸르나가 보입니다. 보통 2–3일; 사흘로 잡아 중간 밤을 2,500 m 근처에 둡니다.",
        "פאנצ'אסה הוא לולאה שקטה ממערב לפוקרה. יער, רכס ולודג'ים בכפר. בבוקר בהיר רואים דהאולגירי ואנאפורנה. בדרך כלל יומיים–שלושה; שומרים שלושה כדי שהלילה האמצעי יהיה ליד 2,500 מ'.",
      ],
      S_OCT_MAY,
      D_EASY,
      [
        [
          ["Pokhara into Panchase forest", "博卡拉进入潘查塞森林", "포카라에서 판차세 숲", "מפוקרה ליער פאנצ'אסה"],
          ["Drive and a forest climb to a village lodge.", "车程后林间上坡，夜宿村落旅舍。", "이동 후 숲길 오름, 마을 롯지.", "נסיעה וטיפוס יער ללודג' בכפר."],
        ],
        [
          ["Ridge to Panchase peak", "山脊至潘查塞峰", "능선에서 판차세 봉", "רכס לפסגת פאנצ'אסה"],
          ["Dawn on the 2,500 m viewpoint, then ridge walking among oak and rhododendron.", "2,500 米观景台看黎明，再在橡树与杜鹃间走山脊。", "2,500 m 전망 새벽, 참나무·진달래 능선.", "זריחה בתצפית 2,500 מ', הליכת רכס בין אלון ורודודנדרון."],
        ],
        [
          ["Descend to the lake", "下到湖畔", "호수로 하산", "ירידה לאגם"],
          ["Forest descent and a late return to Lakeside.", "林间下山，傍晚回到湖畔。", "숲 하산 후 레이크사이드.", "ירידת יער וחזרה מאוחרת ללייקסייד."],
        ],
      ],
    ),
  },
  {
    slug: "ghandruk-village",
    durationDays: 3,
    difficulty: "easy",
    maxAltitudeM: 1940,
    priceFromUsd: 220,
    season: "Oct–May",
    heroImageUrl: IMAGES.ghandruk,
    featured: false,
    sortOrder: 4,
    bestMonths: MONTHS_SHORT,
    altitudeProfile: [
      { d: 1, m: 1940 },
      { d: 2, m: 1940 },
      { d: 3, m: 1070 },
    ],
    copy: loc(
      ["Ghandruk village", "甘德鲁克村落", "간드룩 마을", "כפר גנאדרוק"],
      [
        "Stone houses, a Gurung museum, and close mountain views without a high pass.",
        "石屋、古隆博物馆，近距离看山，无需翻山口。",
        "돌집, 구룽 박물관, 높은 고개 없이 가까운 산 전망.",
        "בתי אבן, מוזיאון גורונג, ונוף הרים קרוב בלי מעבר גבוה.",
      ],
      [
        "Ghandruk is the stone Gurung village that many longer treks only pass through. We give it two nights so you can walk the lanes, visit the museum, and look at Annapurna South and Machhapuchhre without a 4,000 m morning. Typical length is two to three days from Pokhara.",
        "甘德鲁克是许多长线只路过的古隆石村。我们安排两晚，让你走石巷、看博物馆，近看安纳普尔纳南峰与鱼尾峰，不必赶 4,000 米的早晨。从博卡拉通常两到三天。",
        "간드룩은 긴 트레킹이 스쳐 지나는 구룽 돌마을입니다. 이틀 밤을 주어 골목과 박물관, 안나푸르나 사우스와 마차푸치레를 4,000 m 아침 없이 봅니다.",
        "גנאדרוק הוא כפר האבן שטרקים ארוכים רק עוברים בו. שני לילות לסמטאות, למוזיאון ולנוף אנאפורנה דרום ומצ'פוצ'רה בלי בוקר של 4,000 מ'.",
      ],
      S_OCT_MAY,
      D_EASY,
      [
        [
          ["Pokhara to Ghandruk", "博卡拉至甘德鲁克", "포카라에서 간드룩", "מפוקרה לגנאדרוק"],
          ["Jeep toward Nayapul or Kimche, then a climb into stone lanes.", "吉普往纳亚普尔或金切，再爬入石巷。", "지프로 나야풀/킴체 후 돌골목으로 오름.", "ג'יפ לנאיהפול או קימצ'ה, ואז טיפוס לסמטאות אבן."],
        ],
        [
          ["Village day", "村落日", "마을 하루", "יום כפר"],
          ["Museum, terraces, and close views of Annapurna South. Optional short ridge walk.", "博物馆、梯田，近看南峰。可选短山脊。", "박물관, 계단식 밭, 안나푸르나 사우스. 짧은 능선은 선택.", "מוזיאון, טרסות, נוף קרוב. הליכת רכס קצרה אופציונלית."],
        ],
        [
          ["Return to Pokhara", "返回博卡拉", "포카라 복귀", "חזרה לפוקרה"],
          ["Descend to the road and drive back to the lake.", "下到公路，驱车回湖。", "도로까지 하산 후 호수로.", "ירידה לכביש ונסיעה חזרה לאגם."],
        ],
      ],
    ),
  },
  {
    slug: "sikles",
    durationDays: 4,
    difficulty: "easy",
    maxAltitudeM: 2000,
    priceFromUsd: 280,
    season: "Oct–May",
    heroImageUrl: IMAGES.sikles,
    featured: false,
    sortOrder: 5,
    bestMonths: MONTHS_SHORT,
    altitudeProfile: [
      { d: 1, m: 1400 },
      { d: 2, m: 1980 },
      { d: 3, m: 2000 },
      { d: 4, m: 820 },
    ],
    copy: loc(
      ["Sikles", "锡克勒斯", "시클레스", "סיקלס"],
      [
        "A Gurung village north of Pokhara, quieter than Ghandruk, with ridge views of the range.",
        "博卡拉以北的古隆村落，比甘德鲁克更安静，山脊上看整座山脉。",
        "포카라 북쪽 구룽 마을. 간드룩보다 한산하고 능선에서 산맥이 보입니다.",
        "כפר גורונג מצפון לפוקרה, שקט מגנאדרוק, עם נוף רכס על ההרים.",
      ],
      [
        "Sikles sits on a hillside north of the lake, away from the ABC trail traffic. Days are village-to-ridge rather than high camp. You sleep in community lodges, walk among terraces, and look north to Annapurna II and Lamjung. Typical length is three to four days; we hold four so the middle is not a rush.",
        "锡克勒斯在湖北侧山坡上，避开基地营步道人流。日程是村落到山脊，不是高营地。夜宿社区旅舍，走梯田，北望安纳普尔纳二峰与拉姆琼。通常三到四天；我们按四天走。",
        "시클레스는 호수 북쪽 산비탈, ABC 트래픽에서 벗어나 있습니다. 마을과 능선이지 하이캠프가 아닙니다. 커뮤니티 롯지, 계단식 밭, 안나푸르나 2봉과 람중.",
        "סיקלס על מדרון מצפון לאגם, רחוק מתנועת ABC. ימים של כפר ורכס, לא מחנה גבוה. לודג'ים קהילתיים, טרסות, אנאפורנה II ולמג'ונג.",
      ],
      S_OCT_MAY,
      D_EASY,
      [
        [
          ["Pokhara toward Sikles", "博卡拉前往锡克勒斯", "포카라에서 시클레스로", "מפוקרה לסיקלס"],
          ["Drive up the Madi valley and a climb into the first lodge.", "沿马迪河谷上山，爬入第一家旅舍。", "마디 계곡 이동 후 첫 롯지로 오름.", "נסיעה בעמק מאדי וטיפוס ללודג' הראשון."],
        ],
        [
          ["Into Sikles village", "进入锡克勒斯村", "시클레스 마을로", "אל כפר סיקלס"],
          ["Terrace paths into the Gurung village. Afternoon on the ridge if weather holds.", "梯田路进入古隆村。天气好则下午上山脊。", "계단식 밭길을 지나 구룽 마을. 날씨 되면 오후 능선.", "שבילי טרסות לכפר. אחר הצהריים על הרכס אם מזג האוויר מחזיק."],
        ],
        [
          ["Ridge and village day", "山脊与村落日", "능선과 마을 하루", "יום רכס וכפר"],
          ["A slower day: museum, kitchens, and a viewpoint walk.", "慢一天：博物馆、灶台、观景点。", "여유로운 하루: 박물관, 부엌, 전망 산책.", "יום איטי: מוזיאון, מטבחים, הליכת תצפית."],
        ],
        [
          ["Return to Pokhara", "返回博卡拉", "포카라 복귀", "חזרה לפוקרה"],
          ["Descend to the road and the lake.", "下到公路，回到湖畔。", "도로와 호수로 하산.", "ירידה לכביש ולאגם."],
        ],
      ],
    ),
  },
  {
    slug: "kuri-danda",
    durationDays: 3,
    difficulty: "moderate",
    maxAltitudeM: 3200,
    priceFromUsd: 240,
    season: "Oct–May",
    heroImageUrl: IMAGES.kuri,
    featured: false,
    sortOrder: 6,
    bestMonths: MONTHS_SHORT,
    altitudeProfile: [
      { d: 1, m: 2400 },
      { d: 2, m: 3200 },
      { d: 3, m: 820 },
    ],
    copy: loc(
      ["Kuri Danda", "库里丹达", "쿠리 단다", "קורי דנדה"],
      [
        "A three-day ridge and viewpoint trek: high pasture, wide sky, about 3,200 m.",
        "三日山脊与观景徒步：高山牧场、开阔天空，约 3,200 米。",
        "3일 능선·전망 트레킹. 고지 목초, 넓은 하늘, 약 3,200 m.",
        "טרק רכס ותצפית של שלושה ימים: מרעה גבוה, שמיים רחבים, כ־3,200 מ'.",
      ],
      [
        "Kuri Danda is a ridge-and-viewpoint walk rather than a sanctuary trek. You climb through forest into open pasture, sleep near 3,200 m, and look across the range on a clear morning. Typical length is two to three days; we hold three so the high night is not stacked on a long jeep day. Stairs and cold nights — not a technical path.",
        "库里丹达是山脊观景，不是圣域徒步。穿过森林进入开阔牧场，在约 3,200 米过夜，晴朗早晨望向整座山脉。通常两到三天；我们按三天走，避免高夜叠在长车程上。是台阶和寒夜，不是技术路线。",
        "쿠리 단다는 성소 트레킹이 아니라 능선·전망 걷기입니다. 숲을 지나 목초지로, 약 3,200 m에서 자고, 맑은 아침 산맥을 봅니다. 보통 2–3일.",
        "קורי דנדה הוא רכס ותצפית, לא טרק מקדש. יער, מרעה, לילה ליד 3,200 מ'. בדרך כלל יומיים–שלושה. מדרגות ולילות קרים — לא שביל טכני.",
      ],
      S_OCT_MAY,
      D_MOD,
      [
        [
          ["Pokhara to the ridge lodge", "博卡拉至山脊旅舍", "포카라에서 능선 롯지", "מפוקרה ללודג' הרכס"],
          ["Drive and a forest climb to the first high lodge.", "车程后林间上坡，到第一家高处旅舍。", "이동 후 숲 오름, 첫 고지 롯지.", "נסיעה וטיפוס יער ללודג' הגבוה הראשון."],
        ],
        [
          ["Kuri Danda viewpoint", "库里丹达观景点", "쿠리 단다 전망", "תצפית קורי דנדה"],
          ["Dawn or late morning on the ridge near 3,200 m, then a short afternoon walk.", "黎明或午前在约 3,200 米山脊，下午短走。", "새벽 또는 오전 3,200 m 능선, 오후 짧은 걷기.", "זריחה או בוקר מאוחר על הרכס ליד 3,200 מ'."],
        ],
        [
          ["Descend to Pokhara", "下到博卡拉", "포카라로 하산", "ירידה לפוקרה"],
          ["Long descent and a lake evening.", "长距离下山，湖畔夜晚。", "긴 하산과 호숫가 저녁.", "ירידה ארוכה וערב באגם."],
        ],
      ],
    ),
  },
  {
    slug: "ghorepani-poon-hill",
    durationDays: 4,
    difficulty: "moderate",
    maxAltitudeM: 3210,
    priceFromUsd: 390,
    season: "Oct–May",
    heroImageUrl: IMAGES.poon,
    featured: true,
    sortOrder: 4,
    bestMonths: MONTHS_SHORT,
    altitudeProfile: [
      { d: 1, m: 1540 },
      { d: 2, m: 2870 },
      { d: 3, m: 3210 },
      { d: 4, m: 1940 },
      { d: 5, m: 1070 },
    ],
    copy: loc(
      ["Ghorepani Poon Hill", "戈勒帕尼 · 普恩山", "고레파니 푼힐", "גורפאני פון היל"],
      [
        "Sunrise over Dhaulagiri, rhododendron forest, and a steep holiday of stairs. Typically four to five days.",
        "道拉吉里日出、杜鹃林，以及陡峭的台阶假期。通常四到五天。",
        "다울라기리 일출, 진달래 숲, 가파른 계단 휴가. 보통 4–5일.",
        "זריחה מעל דהאולגירי, יער רודודנדרון, וחופשת מדרגות תלולה. בדרך כלל ארבעה–חמישה ימים.",
      ],
      [
        "Poon Hill is the rest-week trek from Pokhara: steep, short, and honest about stairs. You walk through rhododendron to Ghorepani, climb Poon Hill (3,210 m) before dawn, and come down through Ghandruk. Typical length is four to five days; we hold five so the sunrise morning is not stacked on a long jeep day.",
        "普恩山是从博卡拉出发的休息周徒步：陡、短、台阶如实。穿过杜鹃到戈勒帕尼，黎明前登普恩山（3,210 米），经甘德鲁克下山。通常四到五天；我们按五天走，避免日出叠在长车程上。",
        "푼힐은 포카라에서 떠나는 휴식 주 트레킹입니다. 진달래를 지나 고레파니, 새벽 푼힐(3,210 m), 간드룩으로 하산. 보통 4–5일.",
        "פון היל הוא טרק שבוע המנוחה מפוקרה. רודודנדרון לגורפאני, פון היל (3,210 מ') לפני הזריחה, ירידה דרך גנאדרוק. בדרך כלל ארבעה–חמישה ימים.",
      ],
      S_OCT_MAY,
      D_MOD,
      [
        [
          ["Pokhara to Ulleri or Tikhedhunga", "博卡拉至乌勒里或提克栋加", "포카라에서 울레리/티케둥가", "מפוקרה לאולרי או טיקהדונגה"],
          ["Jeep to Nayapul, then the first stone stairs.", "吉普至纳亚普尔，开始石阶。", "지프로 나야풀, 첫 돌계단.", "ג'יפ לנאיהפול והמדרגות הראשונות."],
        ],
        [
          ["To Ghorepani", "至戈勒帕尼", "고레파니로", "לגורפאני"],
          ["Rhododendron and a long stair day into the lodge village.", "杜鹃与长台阶日，进入旅舍村。", "진달래와 긴 계단, 롯지 마을.", "רודודנדרון ויום מדרגות ארוך לכפר הלודג'ים."],
        ],
        [
          ["Poon Hill sunrise, to Tadapani", "普恩山日出，至塔达帕尼", "푼힐 일출, 타다파니로", "זריחה בפון היל, לטאדאפני"],
          ["Pre-dawn climb to 3,210 m, then forest to Tadapani.", "黎明前登 3,210 米，再经森林到塔达帕니。", "새벽 3,210 m 후 숲길 타다파니.", "טיפוס לפני הזריחה ל־3,210 מ', ואז יער לטאדאפני."],
        ],
        [
          ["Tadapani to Ghandruk", "塔达帕尼至甘德鲁克", "타다파니에서 간드룩", "מטאדאפני לגנאדרוק"],
          ["Ridge and a descent into stone Gurung lanes.", "山脊后下入古隆石巷。", "능선 후 구룽 돌골목으로 하산.", "רכס וירידה לסמטאות אבן."],
        ],
        [
          ["Ghandruk to Pokhara", "甘德鲁克至博卡拉", "간드룩에서 포카라", "מגנאדרוק לפוקרה"],
          ["Final trail to the road and a late lunch by the lake.", "最后一段到公路，湖边晚午餐。", "마지막 트레일 후 호숫가 점심.", "שביל אחרון לכביש וארוחת צהריים מאוחרת באגם."],
        ],
      ],
    ),
  },
  {
    slug: "mardi-himal",
    durationDays: 5,
    difficulty: "moderate",
    maxAltitudeM: 4500,
    priceFromUsd: 620,
    season: "Mar–May, Oct–Nov",
    heroImageUrl: IMAGES.mardi,
    featured: true,
    sortOrder: 5,
    altitudeProfile: [
      { d: 1, m: 1890 },
      { d: 2, m: 2970 },
      { d: 3, m: 3580 },
      { d: 4, m: 4500 },
      { d: 5, m: 1565 },
    ],
    copy: loc(
      ["Mardi Himal", "马尔迪喜马拉", "마르디 히말", "מארדי הימאל"],
      [
        "A quieter ridge toward Machhapuchhre. High camp above the cloud. Typically four to five days.",
        "通往鱼尾峰的安静山脊。云上的高营地。通常四到五天。",
        "마차푸치레를 향한 한적한 능선. 구름 위 하이캠프. 보통 4–5일.",
        "רכס שקט לכיוון מצ'פוצ'רה. מחנה גבוה מעל הענן. בדרך כלל ארבעה–חמישה ימים.",
      ],
      [
        "Mardi is the close, quieter alternative to Base Camp — a ridge walk with Machhapuchhre filling the sky. You sleep at High Camp and walk toward 4,500 m in the morning, then come down the same day. Typical length is four to six days; we hold five with honest pacing, not a race to the viewpoint.",
        "马尔迪是基地营更安静的近距离替代：山脊上，鱼尾峰占满天空。夜宿高营地，早晨走向 4,500 米，当天再下来。通常四到六天；我们按五天诚实配速，不为观景台赶路。",
        "마르디는 베이스캠프의 더 조용한 대안입니다. 능선에 마차푸치레가 하늘을 채웁니다. 하이캠프에서 자고 아침 4,500 m로 갔다가 같은 날 내려옵니다. 보통 4–6일.",
        "מארדי הוא החלופה השקטה למחנה הבסיס. רכס עם מצ'פוצ'רה בשמיים. לנים בהיי קמפ, הולכים לכיוון 4,500 מ' בבוקר ויורדים באותו יום. בדרך כלל ארבעה–שישה ימים.",
      ],
      S_MARDI,
      D_MOD,
      [
        [
          ["Pokhara to Forest / Low Camp", "博卡拉至森林 / 低营地", "포카라에서 포레스트/로우캠프", "מפוקרה ליער / לואו קמפ"],
          ["Drive toward Kande or Forest Camp, then the first climb into trees.", "车往坎德或森林营地，开始爬入林中。", "칸데 또는 포레스트 캠프 이동 후 숲으로 오름.", "נסיעה לקאנדה או פורסט קמפ, ואז טיפוס ראשון לעצים."],
        ],
        [
          ["To Low Camp or Middle", "至低营地或中营地", "로우/미들 캠프", "ללואו או מידל קמפ"],
          ["Ridge walking as the trees thin and Machhapuchhre grows.", "山脊行走，林木变稀，鱼尾峰变大。", "능선, 나무가 줄고 마차푸치레가 커집니다.", "הליכת רכס כשהעצים נדירים ומצ'פוצ'רה גדל."],
        ],
        [
          ["High Camp", "高营地", "하이캠프", "היי קמפ"],
          ["Short, high day. Sleep above the cloud if weather holds.", "短而高的一天。天气好则睡在云上。", "짧고 높은 하루. 날씨 되면 구름 위에서 잡니다.", "יום קצר וגבוה. לנים מעל הענן אם מזג האוויר מחזיק."],
        ],
        [
          ["Viewpoint and descend", "观景后下山", "전망 후 하산", "תצפית וירידה"],
          ["Pre-dawn walk toward 4,500 m, then a long descent.", "黎明前走向 4,500 米，再长距离下山。", "새벽 4,500 m 후 긴 하산.", "הליכה לפני הזריחה לכיוון 4,500 מ', ואז ירידה ארוכה."],
        ],
        [
          ["Out to Pokhara", "返回博卡拉", "포카라로", "חזרה לפוקרה"],
          ["Final forest and a jeep to the lake.", "最后一段森林，吉普回湖。", "마지막 숲과 지프로 호수.", "יער אחרון וג'יפ לאגם."],
        ],
      ],
    ),
  },
  {
    slug: "mohare-danda",
    durationDays: 5,
    difficulty: "moderate",
    maxAltitudeM: 3637,
    priceFromUsd: 420,
    season: "Mar–May, Oct–Nov",
    heroImageUrl: IMAGES.mohare,
    featured: false,
    sortOrder: 9,
    altitudeProfile: [
      { d: 1, m: 1540 },
      { d: 2, m: 2870 },
      { d: 3, m: 3637 },
      { d: 4, m: 2500 },
      { d: 5, m: 1070 },
    ],
    copy: loc(
      ["Mohare Danda", "莫哈雷丹达", "모하레 단다", "מוהארה דנדה"],
      [
        "A quieter Poon Hill alternative: community lodge, 3,637 m ridge, fewer people on the stairs.",
        "更安静的普恩山替代：社区旅舍、3,637 米山脊，台阶上人更少。",
        "푼힐의 한적한 대안. 커뮤니티 롯지, 3,637 m 능선, 계단에 사람이 적습니다.",
        "חלופה שקטה לפון היל: לודג' קהילתי, רכס 3,637 מ', פחות אנשים על המדרגות.",
      ],
      [
        "Mohare Danda sits above the Ghorepani trail with a community lodge on a 3,637 m ridge. You get a similar dawn over Dhaulagiri without the Poon Hill crowd. Typical length is four to five days. Nights are colder than Ghorepani; we pace the high lodge as a short day, not a stack of stairs.",
        "莫哈雷丹达在戈勒帕尼步道上方，社区旅舍在 3,637 米山脊上。能看到类似的道拉吉里黎明，却没有普恩山的人群。通常四到五天。夜晚比戈勒帕尼更冷；高处旅舍安排为短日，不把台阶堆在一天。",
        "모하레 단다는 고레파니 트레일 위 커뮤니티 롯지, 3,637 m 능선입니다. 다울라기리 새벽은 비슷하고 푼힐 인파는 없습니다. 보통 4–5일.",
        "מוהארה דנדה מעל שביל גורפאני, לודג' קהילתי על רכס 3,637 מ'. זריחה דומה מעל דהאולגירי בלי הקהל של פון היל. בדרך כלל ארבעה–חמישה ימים.",
      ],
      S_MARDI,
      D_MOD,
      [
        [
          ["Pokhara toward Ulleri", "博卡拉前往乌勒里", "포카라에서 울레리로", "מפוקרה לאולרי"],
          ["Jeep and the first stone stairs, same as the Poon Hill start.", "吉普与第一段石阶，与普恩山起点相同。", "지프와 첫 돌계단, 푼힐 시작과 같습니다.", "ג'יפ ומדרגות האבן הראשונות, כמו תחילת פון היל."],
        ],
        [
          ["Toward Nangi or Hampal", "前往南吉或汉帕尔", "낭기/함팔로", "לננגי או האמפאל"],
          ["Quieter paths into community lodges.", "更安静的路，进入社区旅舍。", "한적한 길로 커뮤니티 롯지.", "שבילים שקטים יותר ללודג'ים קהילתיים."],
        ],
        [
          ["Mohare Danda ridge", "莫哈雷丹达山脊", "모하레 단다 능선", "רכס מוהארה דנדה"],
          ["Short climb to 3,637 m. Dawn over Dhaulagiri if the sky holds.", "短爬至 3,637 米。天气好则道拉吉里日出。", "짧게 3,637 m. 하늘이 열리면 다울라기리 새벽.", "טיפוס קצר ל־3,637 מ'. זריחה מעל דהאולגירי אם השמיים מחזיקים."],
        ],
        [
          ["Descend via Ghorepani side", "经戈勒帕尼一侧下山", "고레파니 쪽으로 하산", "ירידה מצד גורפאני"],
          ["Down through forest toward a lower lodge.", "穿过森林下到较低旅舍。", "숲을 지나 낮은 롯지로.", "ירידה ביער ללודג' נמוך יותר."],
        ],
        [
          ["Out to Pokhara", "返回博卡拉", "포카라로", "חזרה לפוקרה"],
          ["Trail to the road and the lake.", "步道到公路，回到湖畔。", "트레일에서 도로, 호수로.", "שביל לכביש ולאגם."],
        ],
      ],
    ),
  },
  {
    slug: "annapurna-base-camp",
    durationDays: 8,
    difficulty: "moderate",
    maxAltitudeM: 4130,
    priceFromUsd: 890,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.abc,
    featured: true,
    sortOrder: 6,
    altitudeProfile: [
      { d: 1, m: 1940 },
      { d: 2, m: 2170 },
      { d: 3, m: 2310 },
      { d: 4, m: 3230 },
      { d: 5, m: 4130 },
      { d: 6, m: 2310 },
      { d: 7, m: 1780 },
      { d: 8, m: 1070 },
      { d: 9, m: 820 },
    ],
    copy: loc(
      ["Annapurna Base Camp", "安纳普尔纳基地营", "안나푸르나 베이스캠프", "מחנה הבסיס של אנאפורנה"],
      [
        "The sanctuary walk: rhododendron forest to a 4,130 m amphitheatre of ice. Typically seven to ten days.",
        "圣域之行：从杜鹃花林走到海拔 4,130 米的冰雪剧场。通常七到十天。",
        "성소로 가는 길: 진달래 숲에서 4,130 m 얼음 원형극장까지. 보통 7–10일.",
        "הליכה אל המקדש: מיער רודודנדרון לאמפיתיאטרון קרח ב־4,130 מ'. בדרך כלל שבעה–עשרה ימים.",
      ],
      [
        "Annapurna Base Camp is the classic close-up of the range. From Pokhara you rise through Gurung villages and oak-rhododendron forest into a high glacial bowl walled by Annapurna I, Machhapuchhre, and Hiunchuli. Nights are in tea houses. Days are honest but not technical. Typical length is seven to ten days; we hold nine so the last 1,000 metres and Jhinu hot springs are not rushed.",
        "安纳普尔纳基地营是近距离看见这片雪山的经典线路。从博卡拉出发，途经古隆村落与杜鹃、橡树林，进入由安纳普尔纳一峰、鱼尾峰与 Hiunchuli 围合的冰斗。夜宿茶馆。通常七到十天；我们按九天走，让最后一千米与吉努温泉不被追着走。",
        "안나푸르나 베이스캠프는 산맥을 가까이 보는 고전입니다. 구룽 마을과 진달래 숲을 지나 안나푸르나 1봉, 마차푸치레, 힌출리가 둘러싼 빙하 분지로. 보통 7–10일. 9일로 잡아 마지막 1,000 m와 지누 온천을 서두르지 않습니다.",
        "מחנה הבסיס הוא המבט הקלאסי על הרכס. כפרי גורונג ויער רודודנדרון אל קערה קרחונית. בדרך כלל שבעה–עשרה ימים; שומרים תשעה כדי ש־1,000 המטרים האחרונים ומעיינות ג'ינו לא ירוצו.",
      ],
      S_CLASSIC,
      D_MOD,
      [
        [
          ["Pokhara to Ghandruk", "博卡拉至甘德鲁克", "포카라에서 간드룩", "מפוקרה לגנאדרוק"],
          ["Jeep to Nayapul or Kimche, then a warm climb into stone lanes.", "吉普至纳亚普尔或金切，再缓爬进入石巷。", "지프로 나야풀/킴체, 돌골목으로 오름.", "ג'יפ לנאיהפול או קימצ'ה, טיפוס חם לסמטאות אבן."],
        ],
        [
          ["Ghandruk to Chhomrong", "甘德鲁克至琼荣", "간드룩에서 촘롱", "מגנאדרוק לצ'ומרונג"],
          ["Ridge walking and a steep descent to the Modi Khola, then up to Chhomrong.", "山脊路，陡降至莫迪河，再上到琼荣。", "능선 후 모디 콜라로 가파른 하산, 촘롱으로 오름.", "רכס וירידה תלולה למודי קולה, ואז לצ'ומרונג."],
        ],
        [
          ["Chhomrong to Bamboo", "琼荣至班布", "촘롱에서 밤부", "מצ'ומרונג לבמבו"],
          ["Steps, forest, and the river close as the valley narrows.", "台阶、森林，河谷收窄，河水就在身旁。", "계단과 숲, 계곡이 좁아지며 강이 곁에.", "מדרגות, יער, והנהר קרוב כשהעמק מצטמצם."],
        ],
        [
          ["Bamboo to Deurali", "班布至德乌拉利", "밤부에서 데우랄리", "מבמבו לדאוראלי"],
          ["Bamboo groves give way to alpine scrub. We keep the day short.", "竹林转为高山灌丛。当天行程较短。", "대나무가 고산 관목으로. 짧게 걷습니다.", "חורשות במבוך הופכות לשיח אלפיני. היום נשאר קצר."],
        ],
        [
          ["Deurali to Annapurna Base Camp", "德乌拉利至基地营", "데우랄리에서 베이스캠프", "מדאוראלי למחנה הבסיס"],
          ["Past Machhapuchhre Base Camp into the sanctuary. Sunset on the south face.", "经鱼尾峰基地营进入圣域。南壁日落。", "마차푸치레 베이스캠프를 지나 성소로. 남벽 일몰.", "דרך מחנה הבסיס של מצ'פוצ'רה אל המקדש. שקיעה על הפאה הדרומית."],
        ],
        [
          ["Sanctuary morning, descend to Bamboo", "圣域清晨，下至班布", "성소 아침, 밤부로 하산", "בוקר במקדש, ירידה לבמבו"],
          ["Dawn at 4,130 m, then a long, kind descent back into trees.", "海拔 4,130 米看日出，再长距离下到林线。", "4,130 m 새벽 후 나무까지 긴 하산.", "זריחה ב־4,130 מ', ואז ירידה ארוכה חזרה לעצים."],
        ],
        [
          ["Bamboo to Jhinu Danda", "班布至吉努丹达", "밤부에서 지누 단다", "מבמבו לג'ינו דנדה"],
          ["Optional hot springs by the river after a day of stairs.", "走完台阶后，可选河边温泉。", "계단을 마친 뒤 강변 온천은 선택.", "מעיינות חמים ליד הנהר אחרי יום מדרגות — אופציונלי."],
        ],
        [
          ["Jhinu to Nayapul, drive Pokhara", "吉努至纳亚普尔，返回博卡拉", "지누에서 나야풀, 포카라", "מג'ינו לנאיהפול, נסיעה לפוקרה"],
          ["Final forest trail and a late lunch by the lake.", "最后一段林间路，湖边晚午餐。", "마지막 숲길과 호숫가 늦은 점심.", "שביל יער אחרון וארוחת צהריים מאוחרת באגם."],
        ],
        [
          ["Buffer / weather day", "机动 / 天气日", "예비 / 기상일", "יום רזרבה / מזג אוויר"],
          ["Held so snow or a slow lung day does not rush the sanctuary.", "预留一天，避免大雪或需要慢走时被行程追着走。", "눈이나 느린 적응을 위해 남겨 둡니다.", "נשמר כדי ששלג או יום ריאות איטי לא יריצו את המקדש."],
        ],
      ],
    ),
  },
  {
    slug: "khopra-danda",
    durationDays: 7,
    difficulty: "moderate",
    maxAltitudeM: 4600,
    priceFromUsd: 780,
    season: "Mar–May, Oct–Nov",
    heroImageUrl: IMAGES.khopra,
    featured: true,
    sortOrder: 7,
    altitudeProfile: [
      { d: 1, m: 2000 },
      { d: 2, m: 2800 },
      { d: 3, m: 3660 },
      { d: 4, m: 4600 },
      { d: 5, m: 3660 },
      { d: 6, m: 2200 },
      { d: 7, m: 1070 },
    ],
    copy: loc(
      ["Khopra Danda / Muldai Hill", "霍普拉丹达 / 穆尔代山", "코프라 단다 / 물다이 힐", "חופרה דנדה / מולדאי"],
      [
        "Community lodges, Dhaulagiri close, Muldai sunrise, and a side day to Khayer Lake near 4,600 m.",
        "社区旅舍，道拉吉里近在眼前，穆尔代日出，另有一天到约 4,600 米的卡耶尔湖。",
        "커뮤니티 롯지, 가까운 다울라기리, 물다이 일출, 약 4,600 m 카예르 호수 사이드 데이.",
        "לודג'ים קהילתיים, דהאולגירי קרוב, זריחה במולדאי, ויום צד לאגם קיייר ליד 4,600 מ'.",
      ],
      [
        "Khopra Danda is a community-lodge ridge with Dhaulagiri filling the west window; Muldai Hill is the classic sunrise side option on the same circuit. Fewer people than ABC. The typical week includes a long side day to Khayer Lake (about 4,600 m) if weather and legs allow — we will not push it in cloud. Typical length is six to eight days; we hold seven.",
        "霍普拉丹达是社区旅舍山脊，西窗里是道拉吉里；穆尔代山是同环线上的经典日出侧行。人比基地营少。天气与体能允许时，典型一周含长距离侧行到卡耶尔湖（约 4,600 米）——云中不强推。通常六到八天；我们按七天走。",
        "코프라 단다는 커뮤니티 롯지 능선, 서쪽 창에 다울라기리. 물다이 힐은 같은 루프의 일출 사이드. ABC보다 한산합니다. 날씨와 다리가 되면 카예르 호수(약 4,600 m) 사이드 데이. 보통 6–8일.",
        "חופרה דנדה הוא רכס לודג'ים קהילתיים עם דהאולגירי בחלון המערבי; מולדאי הוא אופציית הזריחה באותו מעגל. פחות אנשים מ-ABC. בדרך כלל שישה–שמונה ימים; שומרים שבעה.",
      ],
      S_MARDI,
      D_MOD,
      [
        [
          ["Pokhara into the lower villages", "博卡拉进入低处村落", "포카라에서 낮은 마을로", "מפוקרה לכפרים הנמוכים"],
          ["Drive and a climb toward Tadapani or Swanta.", "车程后上坡，前往塔达帕尼或斯旺塔。", "이동 후 타다파니 또는 스완타로 오름.", "נסיעה וטיפוס לטאדאפני או סוואנטה."],
        ],
        [
          ["Toward Khopra ridge", "前往霍普拉山脊", "코프라 능선으로", "אל רכס חופרה"],
          ["Forest giving way to open ridge lodges.", "森林转为开阔山脊旅舍。", "숲이 열린 능선 롯지로.", "יער שמתחלף בלודג'י רכס פתוחים."],
        ],
        [
          ["Khopra Danda", "霍普拉丹达", "코프라 단다", "חופרה דנדה"],
          ["Ridge day. Dhaulagiri in the west if the sky is clear.", "山脊日。天气晴则西边是道拉吉里。", "능선 하루. 맑으면 서쪽에 다울라기리.", "יום רכס. דהאולגירי במערב אם השמיים בהירים."],
        ],
        [
          ["Khayer Lake side day", "卡耶尔湖侧行日", "카예르 호수 사이드 데이", "יום צד לאגם קיייר"],
          ["Long, high day near 4,600 m if weather holds. Back to Khopra for the night.", "天气好则长距离走到约 4,600 米，当晚回霍普拉。", "날씨 되면 약 4,600 m 긴 하루, 밤은 코프라.", "יום ארוך וגבוה ליד 4,600 מ' אם מזג האוויר מחזיק. לילה חזרה בחופרה."],
        ],
        [
          ["Rest or weather on the ridge", "山脊休息或天气日", "능선 휴식/기상", "מנוחה או מזג אוויר על הרכס"],
          ["A slower lodge day if the lake day ran long.", "若湖日很长，则在旅舍放慢一天。", "호수 날이 길었으면 롯지에서 느리게.", "יום לודג' איטי אם יום האגם היה ארוך."],
        ],
        [
          ["Descend toward Ghorepani side", "向戈勒帕尼一侧下山", "고레파니 쪽으로 하산", "ירידה לצד גורפאני"],
          ["Down through forest to a lower village.", "穿过森林下到较低村落。", "숲을 지나 낮은 마을로.", "ירידה ביער לכפר נמוך יותר."],
        ],
        [
          ["Out to Pokhara", "返回博卡拉", "포카라로", "חזרה לפוקרה"],
          ["Trail to the road and the lake.", "步道到公路，回到湖畔。", "트레일에서 도로, 호수로.", "שביל לכביש ולאגם."],
        ],
      ],
    ),
  },
  {
    slug: "annapurna-circuit",
    durationDays: 12,
    difficulty: "challenging",
    maxAltitudeM: 5416,
    priceFromUsd: 1490,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.circuit,
    featured: true,
    sortOrder: 8,
    altitudeProfile: [
      { d: 1, m: 1860 },
      { d: 2, m: 2670 },
      { d: 3, m: 3300 },
      { d: 4, m: 3540 },
      { d: 5, m: 3540 },
      { d: 6, m: 4050 },
      { d: 7, m: 4450 },
      { d: 8, m: 5416 },
      { d: 9, m: 3760 },
      { d: 10, m: 2720 },
      { d: 11, m: 1190 },
      { d: 12, m: 820 },
    ],
    copy: loc(
      ["Annapurna Circuit", "安纳普尔纳环线", "안나푸르나 서킷", "מעגל אנאפורנה"],
      [
        "A full circling of the massif, crossing Thorong La at 5,416 m. Typically ten to fourteen days from Pokhara or Besisahar.",
        "环绕整座雪山，翻越海拔 5,416 米的托隆山口。从博卡拉或贝西萨哈尔通常十到十四天。",
        "산맥 한 바퀴, 토롱 라 5,416 m. 포카라 또는 베시사하르에서 보통 10–14일.",
        "הקפה מלאה של הרכס, מעבר תורונג לה ב־5,416 מ'. בדרך כלל עשרה–ארבעה עשר ימים מפוקרה או בסיסהאר.",
      ],
      [
        "The Circuit remains the great horseshoe of Nepal trekking, run with real acclimatisation days in Manang — not as a race to the pass. Typical length from Pokhara or Besisahar is ten to fourteen days; we hold twelve. Thorong La (5,416 m) is a long, cold morning. We will not sell a rushed crossing.",
        "环线仍是尼泊尔徒步里那条壮阔的马蹄形。我们在马南安排真正的适应日，而不是赶山口。从博卡拉或贝西萨哈尔通常十到十四天；我们按十二天走。托隆山口（5,416 米）是漫长寒冷的早晨。我们不卖赶路翻越。",
        "서킷은 네팔 트레킹의 큰 말굽입니다. 마낭에서 진짜 적응일을 둡니다. 포카라/베시사하르에서 보통 10–14일. 토롱 라(5,416 m)는 길고 추운 아침입니다. 서두른 통과는 팔지 않습니다.",
        "המעגל נשאר פרסת הטרקים של נפאל, עם ימי אקלום אמיתיים במנאנג. בדרך כלל עשרה–ארבעה עשר ימים; שומרים שניים עשר. תורונג לה הוא בוקר ארוך וקר. לא מוכרים מעבר מרוץ.",
      ],
      S_CLASSIC,
      D_CHAL,
      [
        [
          ["Pokhara or Besisahar into the Marsyangdi", "博卡拉或贝西萨哈尔进入马相迪", "포카라/베시사하르에서 마르샹디로", "מפוקרה או בסיסהאר למרסיאנגי"],
          ["Road day into the valley, first tea house.", "沿河谷走公路，第一家茶馆。", "계곡 도로일, 첫 찻집.", "יום כביש לעמק, בית התה הראשון."],
        ],
        [
          ["Up the Marsyangdi", "沿马相迪上行", "마르샹디를 따라 오름", "מעלה המרסיאנגי"],
          ["Village-to-village toward Chame.", "村落相连，走向查梅。", "마을에서 마을로 차메를 향해.", "כפר לכפר לכיוון צ'אמה."],
        ],
        [
          ["Into pine and apple country", "进入松树与苹果地带", "소나무와 사과 지대로", "אל ארץ האורנים והתפוחים"],
          ["Higher, drier air. Overnight before Manang.", "空气更高更干。马南前一夜。", "더 높고 건조한 공기. 마낭 전날 밤.", "אוויר גבוה ויבש יותר. לילה לפני מנאנג."],
        ],
        [
          ["Manang", "马南", "마낭", "מנאנג"],
          ["Arrival in Manang at about 3,540 m.", "到达马南，约 3,540 米。", "마낭 도착, 약 3,540 m.", "הגעה למנאנג בגובה כ־3,540 מ'."],
        ],
        [
          ["Acclimatisation in Manang", "马南适应日", "마낭 적응일", "אקלום במנאנג"],
          ["A real rest or a short high walk. Not a skip day.", "真正休息或短距离高走。不是跳过的一天。", "진짜 휴식 또는 짧은 고지 걷기. 건너뛰는 날이 아닙니다.", "מנוחה אמיתית או הליכה גבוהה קצרה. לא יום דילוג."],
        ],
        [
          ["Toward Yak Kharka", "前往雅克卡卡", "야크 카르카로", "ליאק קארקה"],
          ["Higher pastures, shorter days.", "更高牧场，行程更短。", "더 높은 목초, 짧은 하루.", "מרעה גבוה יותר, ימים קצרים יותר."],
        ],
        [
          ["Thorong Phedi or High Camp", "托隆营地或高营地", "토롱 페디/하이캠프", "תורונג פדי או היי קמפ"],
          ["Sleep high, eat early, pack for a cold start.", "高处过夜，早吃，为寒冷出发打包。", "높은 곳에서 자고 일찍 먹고 추운 출발을 준비.", "לינה גבוהה, ארוחה מוקדמת, ציוד לבוקר קר."],
        ],
        [
          ["Thorong La to Muktinath", "托隆山口至穆克提纳特", "토롱 라에서 묵티나트", "מתורונג לה למוקטינאת"],
          ["5,416 m pass at dawn, long descent to Muktinath.", "黎明翻越 5,416 米，长距离下到穆克提纳特。", "새벽 5,416 m 고개, 묵티나트로 긴 하산.", "מעבר 5,416 מ' בזריחה, ירידה ארוכה למוקטינאת."],
        ],
        [
          ["Muktinath to Jomsom", "穆克提纳特至乔姆松", "묵티나트에서 좀솜", "ממוקטינאת לג'ומסום"],
          ["Wind on the Kali Gandaki, jeep or walk to Jomsom.", "卡利甘达基的风，吉普或走到乔姆松。", "칼리간다키 바람, 지프 또는 도보로 좀솜.", "רוח על הקאלי גנדקי, ג'יפ או הליכה לג'ומסום."],
        ],
        [
          ["Jomsom to Tatopani or Marpha", "乔姆松至塔托帕尼或马尔法", "좀솜에서 타토파니/마르파", "מג'ומסום לטאטופאני או מארפה"],
          ["Down-valley, optional springs.", "沿谷下行，可选温泉。", "계곡 하행, 온천은 선택.", "ירידה בעמק, מעיינות אופציונליים."],
        ],
        [
          ["Toward Pokhara", "返回博卡拉方向", "포카라 쪽으로", "לכיוון פוקרה"],
          ["Road or remaining trail toward the lake.", "公路或余下步道回湖。", "도로 또는 남은 트레일로 호수.", "כביש או שביל נותר לאגם."],
        ],
        [
          ["Pokhara", "博卡拉", "포카라", "פוקרה"],
          ["Lake evening. Gear down.", "湖畔夜晚。卸下装备。", "호숫가 저녁. 장비 정리.", "ערב באגם. מורידים ציוד."],
        ],
      ],
    ),
  },
  {
    slug: "upper-mustang",
    durationDays: 11,
    difficulty: "challenging",
    maxAltitudeM: 3800,
    priceFromUsd: 1890,
    season: "Mar–Nov",
    heroImageUrl: IMAGES.mustang,
    featured: false,
    sortOrder: 13,
    inclusions: MUSTANG_INCLUSIONS,
    bestMonths: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    altitudeProfile: [
      { d: 1, m: 2720 },
      { d: 2, m: 2950 },
      { d: 3, m: 3500 },
      { d: 4, m: 3800 },
      { d: 5, m: 3700 },
      { d: 6, m: 3800 },
      { d: 7, m: 3700 },
      { d: 8, m: 3500 },
      { d: 9, m: 2950 },
      { d: 10, m: 2720 },
      { d: 11, m: 820 },
    ],
    copy: loc(
      ["Upper Mustang", "上木斯塘", "어퍼 무스탕", "אפר מוסטנג"],
      [
        "Restricted-permit country via Jomsom: Lo Manthang, walled towns, a dry trans-Himalayan plateau.",
        "经乔姆松的限制许可地区：洛曼塘、围墙城镇、干燥的喜马拉雅横断高原。",
        "좀솜을 경유하는 제한 허가 지역. 로 만탕, 성벽 마을, 건조한 트랜스히말라야 고원.",
        "אזור היתר מוגבל דרך ג'ומסום: לו מנתאנג, עיירות מוקפות חומה, רמה יבשה מעבר להימלאיה.",
      ],
      [
        "Upper Mustang is not an Annapurna sanctuary walk. It is a restricted area: we process the permit in Pokhara, fly or drive to Jomsom, and walk a dry, windy plateau to Lo Manthang. Nights are in lodges. Typical length is ten to twelve days; we hold eleven. The price from-figure is higher because the restricted permit is real, not a marketing add-on. We will say so in the quote.",
        "上木斯塘不是安纳普尔纳圣域徒步。这是限制区：我们在博卡拉办许可，飞或车至乔姆松，再走干燥多风的高原到洛曼塘。夜宿旅舍。通常十到十二天；我们按十一天走。起步价更高，因为限制许可是真成本，不是营销加项。报价里会写明。",
        "어퍼 무스탕은 안나푸르나 성소 걷기가 아닙니다. 제한 구역입니다. 포카라에서 허가를 처리하고 좀솜으로 가 건조하고 바람 부는 고원을 로 만탕까지 걷습니다. 보통 10–12일. 시작가가 높은 이유는 제한 허가가 진짜 비용이기 때문입니다.",
        "אפר מוסטנג אינו הליכת מקדש אנאפורנה. זה אזור מוגבל: מטפלים בהיתר בפוקרה, טסים או נוסעים לג'ומסום, והולכים ברמה יבשה ללו מנתאנג. בדרך כלל עשרה–שניים עשר ימים. מחיר ה־from גבוה כי ההיתר אמיתי, לא תוספת שיווק.",
      ],
      ["March–November", "三月至十一月", "3–11월", "מרץ–נובמבר"],
      D_CHAL,
      [
        [
          ["Pokhara to Jomsom", "博卡拉至乔姆松", "포카라에서 좀솜", "מפוקרה לג'ומסום"],
          ["Flight or jeep up the Kali Gandaki. Wind briefing.", "飞或车沿卡利甘达基上行。风况简报。", "칼리간다키로 항공/지프. 바람 브리핑.", "טיסה או ג'יפ במעלה הקאלי גנדקי. תדריך רוח."],
        ],
        [
          ["Jomsom to Kagbeni", "乔姆松至卡格贝尼", "좀솜에서 카그베니", "מג'ומסום לקאגבני"],
          ["Into the restricted gate. Dry riverbed walking.", "进入限制区关口。干河床行走。", "제한 구역 게이트. 마른 강바닥.", "אל שער האזור המוגבל. הליכה באפיק יבש."],
        ],
        [
          ["Toward Chele and Samar", "前往切勒与萨马尔", "첼레와 사마르로", "לצ'לה ולסאמר"],
          ["Cliffs, caves, and a climb out of the river.", "悬崖、洞穴，爬出河谷。", "절벽, 동굴, 강에서 오름.", "צוקים, מערות, וטיפוס מהנהר."],
        ],
        [
          ["High villages toward Ghami", "高处村落前往加米", "가미 쪽 고지 마을", "כפרים גבוהים לכיוון גאמי"],
          ["Windy passes, painted chortens.", "多风垭口，彩绘佛塔。", "바람 고개, 색칠된 초르텐.", "מעברים רוחניים, צ'ורטנים צבועים."],
        ],
        [
          ["Toward Lo Manthang", "前往洛曼塘", "로 만탕으로", "ללו מנתאנג"],
          ["The walled city comes into view.", "围墙之城进入视野。", "성벽 도시가 보입니다.", "העיר המוקפת חומה נכנסת לטווח הראייה."],
        ],
        [
          ["Lo Manthang", "洛曼塘", "로 만탕", "לו מנתאנג"],
          ["A full day in the capital of the old kingdom.", "在故国王都停留一整天。", "옛 왕국 수도에서 하루.", "יום מלא בבירת הממלכה הישנה."],
        ],
        [
          ["Caves and side valleys", "洞穴与侧谷", "동굴과 곁계곡", "מערות ועמקי צד"],
          ["Optional cave or monastery day if permits and weather allow.", "许可与天气允许时，可选洞穴或寺院日。", "허가와 날씨가 되면 동굴/사원 선택일.", "יום מערות או מנזר אם ההיתר ומזג האוויר מאפשרים."],
        ],
        [
          ["Begin the return", "开始返回", "복귀 시작", "תחילת החזרה"],
          ["South toward the Kali Gandaki again.", "向南再回卡利甘达基。", "다시 칼리간다키 남쪽으로.", "דרומה שוב אל הקאלי גנדקי."],
        ],
        [
          ["High trail toward Kagbeni", "高处步道前往卡格贝니", "카그베니 쪽 고지 트레일", "שביל גבוה לקאגבני"],
          ["Long, dry miles. Dust and wind.", "漫长干燥的路。尘与风。", "길고 건조한 거리. 먼지와 바람.", "קילומטרים יבשים. אבק ורוח."],
        ],
        [
          ["Kagbeni to Jomsom", "卡格贝尼至乔姆松", "카그베니에서 좀솜", "מקאגבני לג'ומסום"],
          ["Out of the restricted zone.", "离开限制区。", "제한 구역 밖으로.", "יציאה מהאזור המוגבל."],
        ],
        [
          ["Jomsom to Pokhara", "乔姆松至博卡拉", "좀솜에서 포카라", "מג'ומסום לפוקרה"],
          ["Flight or road back to the lake.", "飞或走公路回湖。", "항공 또는 도로로 호수.", "טיסה או כביש חזרה לאגם."],
        ],
      ],
    ),
  },
  {
    slug: "manang-village",
    durationDays: 8,
    difficulty: "moderate",
    maxAltitudeM: 3540,
    priceFromUsd: 890,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.manang,
    featured: true,
    sortOrder: 9,
    altitudeProfile: [
      { d: 1, m: 1860 },
      { d: 2, m: 2670 },
      { d: 3, m: 3300 },
      { d: 4, m: 3540 },
      { d: 5, m: 3540 },
      { d: 6, m: 3540 },
      { d: 7, m: 2670 },
      { d: 8, m: 820 },
    ],
    copy: loc(
      ["Manang Village Trek", "马南村落徒步", "마낭 빌리지 트레킹", "טרק כפר מנאנג"],
      [
        "Marsyangdi valley to Manang without Thorong La. Acclimatise, look, turn back or jeep out. Seven to ten days.",
        "沿马相迪到马南，不翻托隆山口。适应、观景、原路或吉普下山。七到十天。",
        "토롱 라 없이 마르샹디에서 마낭까지. 적응하고 보고 하산. 7–10일.",
        "עמק מרסיאנגי למנאנג בלי תורונג לה. אקלום, מבט, חזרה. שבעה–עשרה ימים.",
      ],
      [
        "Manang Village is the Annapurna Circuit without the pass: jeep and walk up the Marsyangdi to the Tibetan-influenced town at about 3,540 m, take real rest days, then return the same valley or by road. Typical length is seven to ten days; we hold eight. Honest for guests who want high culture and views without a 5,400 m morning.",
        "马南村落是不翻山口的安纳普尔纳环线：吉普与步行沿马相迪到约 3,540 米的藏风小镇，真正休息日，再原谷或公路返回。通常七到十天；我们按八天走。适合要高海拔文化与视野、不要 5,400 米清晨的客人。",
        "마낭 빌리지는 고개 없는 서킷입니다. 마르샹디를 따라 약 3,540 m 마을까지, 진짜 휴식일, 같은 계곡 또는 도로로 복귀. 보통 7–10일.",
        "כפר מנאנג הוא המעגל בלי המעבר: עלייה במרסיאנגי לעיירה בגובה כ־3,540 מ', ימי אקלום, וחזרה. בדרך כלל שבעה–עשרה ימים; שומרים שמונה.",
      ],
      S_CLASSIC,
      D_MOD,
      [
        [
          ["Into the Marsyangdi", "进入马相迪", "마르샹디로", "אל המרסיאנגי"],
          ["Drive from Pokhara toward Chame or the first trail night.", "从博卡拉驶向查梅或第一夜步道。", "포카라에서 차메 또는 첫 트레일 밤으로.", "נסיעה מפוקרה לצ'אמה או ליל שביל ראשון."],
        ],
        [
          ["Village to village", "村落相连", "마을에서 마을로", "כפר לכפר"],
          ["Pine, apple country, rising nights.", "松树与苹果地带，夜宿渐高。", "소나무·사과 지대, 밤이 높아짐.", "אורנים, תפוחים, לילות גבוהים יותר."],
        ],
        [
          ["Toward Manang", "前往马南", "마낭으로", "למנאנג"],
          ["High trail options if legs allow.", "体能允许则走高线。", "다리가 되면 하이 트레일.", "שביל גבוה אם הרגליים מאפשרות."],
        ],
        [
          ["Manang arrival", "抵达马南", "마낭 도착", "הגעה למנאנג"],
          ["About 3,540 m. Tea houses and mountain light.", "约 3,540 米。茶馆与山光。", "약 3,540 m. 찻집과 산빛.", "כ־3,540 מ'. בתי תה ואור הרים."],
        ],
        [
          ["Acclimatisation day", "适应日", "적응일", "יום אקלום"],
          ["Short high walk or rest. Not a skip.", "短距离高走或休息。不是跳过。", "짧은 고지 걷기 또는 휴식.", "הליכה גבוהה קצרה או מנוחה."],
        ],
        [
          ["Side valley or culture day", "侧谷或文化日", "곁계곡 또는 문화일", "יום עמק צד או תרבות"],
          ["Gangapurna lake, monasteries, or a quiet lodge day.", "甘加普尔纳湖、寺院，或安静旅舍日。", "강가푸르나 호수, 사원, 또는 조용한 롯지일.", "אגם גנגאפורנה, מנזרים, או יום לודג' שקט."],
        ],
        [
          ["Begin the return", "开始返回", "복귀 시작", "תחילת החזרה"],
          ["Down-valley toward the road head.", "沿谷下到公路起点。", "계곡을 따라 도로 머리로.", "ירידה בעמק לראש הכביש."],
        ],
        [
          ["Out to Pokhara", "返回博卡拉", "포카라로", "חזרה לפוקרה"],
          ["Jeep day back to the lake.", "吉普日回湖。", "지프로 호수.", "יום ג'יפ חזרה לאגם."],
        ],
      ],
    ),
  },
  {
    slug: "manaslu-circuit",
    durationDays: 14,
    difficulty: "challenging",
    maxAltitudeM: 5160,
    priceFromUsd: 1690,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.manaslu,
    featured: false,
    sortOrder: 20,
    copy: loc(
      ["Manaslu Circuit", "马纳斯鲁环线", "마나슬루 서킷", "מעגל מנאסלו"],
      [
        "Restricted-area horseshoe around Manaslu, crossing Larkya La. Typically twelve to fifteen days.",
        "环绕马纳斯鲁的限制区马蹄线，翻越拉尔基亚山口。通常十二到十五天。",
        "마나슬루를 도는 제한 구역 루프, 라르키야 라 통과. 보통 12–15일.",
        "פרסה באזור מוגבל סביב מנאסלו, מעבר לארקיה לה. בדרך כלל שניים עשר–חמישה עשר ימים.",
      ],
      [
        "Manaslu Circuit is a permit-heavy loop north of Gorkha: Tibetan-influenced villages, a real pass at Larkya La (about 5,160 m), and fewer people than the Annapurna Circuit. Typical length is twelve to fifteen days; we hold fourteen with acclimatisation. Restricted permits are processed before you walk — quoted plainly.",
        "马纳斯鲁环线是廓尔喀以北许可较多的环线：藏风村落、约 5,160 米的拉尔基亚山口，人比安纳普尔纳环线少。通常十二到十五天；我们按十四天含适应。限制许可出发前办理，报价写明。",
        "마나슬루 서킷은 고르카 북쪽 허가 루프입니다. 라르키야 라(약 5,160 m), 안나푸르나보다 한산. 보통 12–15일.",
        "מעגל מנאסלו הוא לולאה עם היתרים מצפון לגורקה. מעבר לארקיה לה (כ־5,160 מ'). בדרך כלל שניים עשר–חמישה עשר ימים; שומרים ארבעה עשר.",
      ],
      S_CLASSIC,
      D_CHAL,
      [
        [["Into the Budhi Gandaki", "进入布迪甘达基", "부디 간다키로", "אל בודי גנדקי"], ["Road and first trail nights into the valley.", "公路与谷中第一夜。", "도로와 계곡 첫 트레일 밤.", "כביש ולילות שביל ראשונים."]],
        [["Middle villages", "中段村落", "중간 마을", "כפרים אמצעיים"], ["Rising altitude, monastery country.", "海拔渐高，寺院地带。", "고도 상승, 사원 지대.", "גובה עולה, ארץ מנזרים."]],
        [["Toward Samagaon", "前往萨马岗", "사마가온으로", "לסאמאגאון"], ["Acclimatise below the pass.", "山口下适应。", "고개 아래 적응.", "אקלום מתחת למעבר."]],
        [["Larkya La", "拉尔基亚山口", "라르키야 라", "לארקיה לה"], ["Long cold pass morning, long descent.", "漫长寒冷的山口早晨，长下山。", "길고 추운 고개 아침, 긴 하산.", "בוקר מעבר קר וארוך, ירידה ארוכה."]],
        [["Out toward Besisahar side", "向贝西萨哈尔一侧出谷", "베시사하르 쪽으로 출구", "יציאה לצד בסיסהאר"], ["Valley exit and road toward Pokhara.", "出谷后公路回博卡拉方向。", "계곡 출구 후 포카라 쪽 도로.", "יציאת עמק וכביש לפוקרה."]],
      ],
    ),
  },
  {
    slug: "tsum-valley",
    durationDays: 9,
    difficulty: "moderate",
    maxAltitudeM: 3700,
    priceFromUsd: 1190,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.tsum,
    featured: false,
    sortOrder: 21,
    copy: loc(
      ["Tsum Valley Trek", "茨姆谷徒步", "춤 밸리 트레킹", "טרק עמק צאום"],
      [
        "Sacred side valley off the Manaslu trail. Restricted permit, monasteries, eight to ten days.",
        "马纳斯鲁支线的圣谷。限制许可、寺院，八到十天。",
        "마나슬루 곁의 성스러운 계곡. 제한 허가, 사원, 8–10일.",
        "עמק קדוש ליד מנאסלו. היתר מוגבל, מנזרים, שמונה–עשרה ימים.",
      ],
      [
        "Tsum Valley is a restricted cultural valley branching from the Manaslu approach: quieter lodges, Buddhist heritage, and no Larkya La unless you combine circuits. Typical length is eight to ten days; we hold nine. Permits are real costs — we say so in the quote.",
        "茨姆谷是马纳斯鲁进山路上的限制文化谷：更安静的旅舍、佛教遗产，除非组合环线否则不翻拉尔基亚。通常八到十天；我们按九天走。许可是真实成本，报价写明。",
        "춤 밸리는 마나슬루 접근로의 제한 문화 계곡입니다. 조용한 롯지, 불교 유산. 보통 8–10일.",
        "עמק צאום הוא עמק תרבותי מוגבל ליד מנאסלו. לודג'ים שקטים, מורשת בודהיסטית. בדרך כלל שמונה–עשרה ימים; שומרים תשעה.",
      ],
      S_CLASSIC,
      D_MOD,
      [
        [["Pokhara or Kathmandu into the valley", "博卡拉或加德满都进入山谷", "포카라/카트만두에서 계곡으로", "מפוקרה או קטמנדו לעמק"], ["Road day and first trail night.", "公路日与第一夜。", "도로일과 첫 트레일 밤.", "יום כביש וליל שביל ראשון."]],
        [["Up Tsum", "上行茨姆", "춤으로 오름", "מעלה צאום"], ["Villages, chortens, rising nights.", "村落、佛塔，夜宿渐高。", "마을, 초르텐, 밤이 높아짐.", "כפרים, צ'ורטנים, לילות גבוהים."]],
        [["Upper Tsum", "上茨姆", "어퍼 춤", "צאום עליון"], ["Monastery visits if open.", "寺院开放则参观。", "사원 개방 시 방문.", "ביקורי מנזר אם פתוח."]],
        [["Return down-valley", "沿谷返回", "계곡 하행 복귀", "חזרה במורד העמק"], ["Same trail out toward the road.", "原路出谷到公路。", "같은 트레일로 도로까지.", "אותו שביל החוצה לכביש."]],
      ],
    ),
  },
  {
    slug: "nar-phu-valley",
    durationDays: 8,
    difficulty: "challenging",
    maxAltitudeM: 5320,
    priceFromUsd: 1290,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.narphu,
    featured: false,
    sortOrder: 22,
    copy: loc(
      ["Nar Phu Valley Trek", "纳尔普谷徒步", "나르 푸 밸리 트레킹", "טרק עמק נאר פהו"],
      [
        "Restricted valleys north of Manang, Kang La option. Typically seven to eight days as a Circuit side trip or standalone.",
        "马南以北的限制谷地，可选康山口。通常七到八天，可作环线侧行或独立行程。",
        "마낭 북쪽 제한 계곡, 캉 라 옵션. 보통 7–8일.",
        "עמקים מוגבלים מצפון למנאנג, אופציית קאנג לה. בדרך כלל שבעה–שמונה ימים.",
      ],
      [
        "Nar and Phu are restricted villages north of the Annapurna Circuit road-head culture. We process the permit, walk remote lodges, and often exit over Kang La (about 5,320 m) toward Ngawal / Manang. Typical length is seven to eight days; we hold eight. Not a casual day hike.",
        "纳尔与普是安纳普尔纳环线文化带以北的限制村落。我们办许可、走偏远旅舍，常经康山口（约 5,320 米）出到恩加瓦尔 / 马南。通常七到八天；我们按八天走。不是轻松一日。",
        "나르와 푸는 제한 마을입니다. 허가 처리, 외딴 롯지, 종종 캉 라(약 5,320 m)로 출구. 보통 7–8일.",
        "נאר ופהו הם כפרים מוגבלים. מטפלים בהיתר, לודג'ים מרוחקים, ולעיתים יציאה בקאנג לה. בדרך כלל שבעה–שמונה ימים.",
      ],
      S_CLASSIC,
      D_CHAL,
      [
        [["Into Nar Phu", "进入纳尔普", "나르 푸로", "אל נאר פהו"], ["Branch from the Marsyangdi toward the restricted gate.", "从马相迪岔入限制关口。", "마르샹디에서 제한 게이트로.", "פיצול מהמרסיאנגי לשער המוגבל."]],
        [["Phu or Nar villages", "普或纳尔村", "푸 또는 나르 마을", "כפרי פהו או נאר"], ["High, dry nights in lodge country.", "干燥高处旅舍夜。", "건조한 고지 롯지 밤.", "לילות יבשים וגבוהים."]],
        [["Kang La or valley exit", "康山口或谷口", "캉 라 또는 계곡 출구", "קאנג לה או יציאת עמק"], ["Pass morning if weather holds, or return the same way.", "天气好则翻山口，否则原路返回。", "날씨 되면 고개, 아니면 같은 길 복귀.", "בוקר מעבר אם מזג האוויר מחזיק, או חזרה באותה דרך."]],
        [["Toward Manang / Pokhara", "前往马南 / 博卡拉", "마낭/포카라로", "למנאנג / פוקרה"], ["Reconnect to the Circuit road and home.", "接回环线公路回家。", "서킷 도로로 이어 귀가.", "חיבור לכביש המעגל וחזרה."]],
      ],
    ),
  },
  {
    slug: "round-dhaulagiri",
    durationDays: 14,
    difficulty: "challenging",
    maxAltitudeM: 5360,
    priceFromUsd: 1890,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.dhaulagiri,
    featured: false,
    sortOrder: 23,
    copy: loc(
      ["Round Dhaulagiri Trek", "环道拉吉里徒步", "라운드 다울라기리 트레킹", "טרק סביב דהאולגירי"],
      [
        "Wild circuit of Dhaulagiri: French Pass, high camps, twelve to fifteen days. Expedition-leaning.",
        "环绕道拉吉里：法国山口、高营地，十二到十五天。偏远征气质。",
        "다울라기리 일주: 프렌치 패스, 하이캠프, 12–15일. 원정에 가깝습니다.",
        "מעגל פראי סביב דהאולגירי: מעבר צרפתי, מחנות גבוהים, שניים עשר–חמישה עשר ימים.",
      ],
      [
        "Round Dhaulagiri is not a tea-house stroll. Expect high passes (French Pass near 5,360 m), camping or sparse lodges, and serious logistics from Pokhara. Typical length is twelve to fifteen days; we hold fourteen. We quote porters, camping kit, and weather buffers plainly.",
        "环道拉吉里不是茶馆闲走。高山口（法国山口约 5,360 米）、露营或稀疏旅舍，从博卡拉出发的严肃后勤。通常十二到十五天；我们按十四天走。背夫、露营装备与天气机动会如实报价。",
        "라운드 다울라기리는 찻집 산책이 아닙니다. 프렌치 패스(약 5,360 m), 캠핑/드문 롯지. 보통 12–15일.",
        "סביב דהאולגירי אינו טיול בתי תה. מעברים גבוהים, קמפינג או לודג'ים דלילים. בדרך כלל שניים עשר–חמישה עשר ימים.",
      ],
      S_CLASSIC,
      D_CHAL,
      [
        [["Pokhara into Myagdi country", "博卡拉进入米亚格迪", "포카라에서 미야그디로", "מפוקרה לארץ מיאגדי"], ["Road and first approach nights.", "公路与进山第一夜。", "도로와 접근 첫 밤.", "כביש ולילות גישה."]],
        [["Toward Italian / French Pass", "前往意大利 / 法国山口", "이탈리안/프렌치 패스로", "למעבר האיטלקי / הצרפתי"], ["High camps, glacier views, weather calls.", "高营地、冰川视野，看天气决定。", "하이캠프, 빙하 전망, 날씨 판단.", "מחנות גבוהים, קרחונים, החלטות מזג אוויר."]],
        [["Cross and descend", "穿越并下山", "통과 후 하산", "מעבר וירידה"], ["Long pass day if the window opens.", "窗口打开则长山口日。", "창이 열리면 긴 고개일.", "יום מעבר ארוך אם החלון נפתח."]],
        [["Out to the Kali Gandaki / Pokhara", "出到卡利甘达基 / 博卡拉", "칼리간다키/포카라로", "לקאלי גנדקי / פוקרה"], ["Valley exit and lake return.", "出谷回湖。", "계곡 출구 후 호수.", "יציאת עמק וחזרה לאגם."]],
      ],
    ),
  },
  {
    slug: "langtang-valley",
    durationDays: 8,
    difficulty: "moderate",
    maxAltitudeM: 4984,
    priceFromUsd: 790,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.langtang,
    featured: false,
    sortOrder: 24,
    copy: loc(
      ["Langtang Trek", "朗塘徒步", "랑탕 트레킹", "טרק לנגטאנג"],
      [
        "North of Kathmandu: Langtang Valley to Kyanjin, optional Tserko Ri. Typically seven to eight days.",
        "加德满都以北：朗塘谷至江金，可选策尔科日峰。通常七到八天。",
        "카트만두 북쪽: 랑탕 계곡에서 캰진, 체르코 리 선택. 보통 7–8일.",
        "מצפון לקטמנדו: עמק לנגטאנג לקיאנג'ין, צרקו רי אופציונלי. בדרך כלל שבעה–שמונה ימים.",
      ],
      [
        "Langtang is the classic valley trek north of Kathmandu — we arrange it from Pokhara with overland or flight links. Tea houses to Kyanjin Gompa, optional Tserko Ri (about 4,984 m). Typical length is seven to eight days; we hold eight. Park permits and pacing are in the quote.",
        "朗塘是加德满都以北的经典谷地徒步——我们从博卡拉安排陆路或航班衔接。茶馆到江金寺，可选策尔科日（约 4,984 米）。通常七到八天；我们按八天走。公园许可与配速写在报价里。",
        "랑탕은 카트만두 북쪽 클래식 계곡 트레킹입니다. 포카라에서 연계 주선. 보통 7–8일.",
        "לנגטאנג הוא טרק העמק הקלאסי מצפון לקטמנדו. מארגנים מפוקרה. בדרך כלל שבעה–שמונה ימים; שומרים שמונה.",
      ],
      S_CLASSIC,
      D_MOD,
      [
        [["To Syabrubesi", "至夏布鲁贝西", "시아브루베시로", "לסיאברובסי"], ["Overland from Kathmandu or Pokhara link.", "从加德满都或经博卡拉衔接。", "카트만두 또는 포카라 연계 육로.", "יבשה מקטמנדו או קישור מפוקרה."]],
        [["Up Langtang Valley", "上行朗塘谷", "랑탕 계곡으로", "מעלה עמק לנגטאנג"], ["Forest to high lodges.", "森林到高处旅舍。", "숲에서 고지 롯지로.", "מיער ללודג'ים גבוהים."]],
        [["Kyanjin and viewpoints", "江金与观景点", "캰진과 전망", "קיאנג'ין ותצפיות"], ["Optional Tserko Ri if weather and lungs allow.", "天气与体能允许则登策尔科日。", "날씨·폐가 되면 체르코 리.", "צרקו רי אם מזג האוויר והריאות מאפשרים."]],
        [["Descend and exit", "下山出谷", "하산 출구", "ירידה ויציאה"], ["Back to the road and city link.", "回到公路与城市衔接。", "도로와 도시 연계로.", "חזרה לכביש ולקישור העיר."]],
      ],
    ),
  },
  {
    slug: "tilicho-frozen-lake",
    durationDays: 8,
    difficulty: "challenging",
    maxAltitudeM: 4919,
    priceFromUsd: 990,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.tilicho,
    featured: false,
    sortOrder: 25,
    copy: loc(
      ["Frozen Lake Trek (Tilicho)", "冰湖徒步（提里乔）", "프로즌 레이크 트레킹 (틸리초)", "טרק האגם הקפוא (טיליצ'ו)"],
      [
        "Manang to Tilicho Lake at about 4,919 m — the high glacial lake many call the frozen lake. Seven to eight days focused.",
        "马南至约 4,919 米的提里乔湖——常称冰湖的高海拔冰川湖。集中七到八天。",
        "마낭에서 약 4,919 m 틸리초 호수. 흔히 말하는 얼음 호수. 집중 7–8일.",
        "ממנאנג לאגם טיליצ'ו בגובה כ־4,919 מ' — האגם הקרחוני שרבים קוראים לו הקפוא. שבעה–שמונה ימים ממוקדים.",
      ],
      [
        "Our Frozen Lake trek is the Tilicho Lake side of the Annapurna / Manang country: proper acclimatisation in Manang, the landslide traverse to Tilicho Base Camp, and a dawn push to the lake near 4,919 m. Typical focused length is seven to eight days; we hold eight. We will not rush the lake morning in bad weather.",
        "我们的冰湖徒步是安纳普尔纳 / 马南一侧的提里乔湖：在马南真正适应、滑坡段到提里乔大本营、黎明推向约 4,919 米的湖。集中行程通常七到八天；我们按八天走。坏天气不强推湖日清晨。",
        "프로즌 레이크는 틸리초 호수 사이드입니다. 마낭 적응, 베이스캠프, 새벽 호수(약 4,919 m). 보통 7–8일.",
        "טרק האגם הקפוא שלנו הוא צד טיליצ'ו: אקלום במנאנג, מחנה בסיס, ודחיפה לזריחה לאגם. בדרך כלל שבעה–שמונה ימים; שומרים שמונה.",
      ],
      S_CLASSIC,
      D_CHAL,
      [
        [["Toward Manang", "前往马南", "마낭으로", "למנאנג"], ["Marsyangdi approach with rising nights.", "马相迪进山，夜宿渐高。", "마르샹디 접근, 밤이 높아짐.", "גישת מרסיאנגי עם לילות עולים."]],
        [["Acclimatise in Manang", "马南适应", "마낭 적응", "אקלום במנאנג"], ["Real rest or short high walk.", "真正休息或短高走。", "진짜 휴식 또는 짧은 고지 걷기.", "מנוחה אמיתית או הליכה גבוהה קצרה."]],
        [["Tilicho Base Camp", "提里乔大本营", "틸리초 베이스캠프", "מחנה בסיס טיליצ'ו"], ["Landslide traverse day — paced, not raced.", "滑坡段——配速走，不赛跑。", "산사태 구간 — 페이스, 질주 아님.", "יום מפולת — בקצב, לא במרוץ."]],
        [["Lake and return", "到湖并返回", "호수와 복귀", "אגם וחזרה"], ["Dawn to Tilicho Lake if weather holds, then out toward Pokhara.", "天气好则黎明到湖，再向博卡拉方向出谷。", "날씨 되면 새벽 호수, 포카라 쪽으로 출구.", "זריחה לאגם אם מזג האוויר מחזיק, ואז החוצה לפוקרה."]],
      ],
    ),
  },
  {
    slug: "everest-base-camp",
    durationDays: 16,
    difficulty: "challenging",
    maxAltitudeM: 5545,
    priceFromUsd: 1890,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.ebc,
    featured: false,
    sortOrder: 26,
    copy: loc(
      ["Everest Base Camp Trek", "珠峰大本营徒步", "에베레스트 베이스캠프 트레킹", "טרק מחנה הבסיס של אוורסט"],
      [
        "Lukla to EBC and Kala Patthar. Typically fifteen to eighteen days including flights and buffers.",
        "卢卡拉至大本营与卡拉帕特。通常十五到十八天，含航班与机动。",
        "루클라에서 EBC와 칼라 파타르. 항공·버퍼 포함 보통 15–18일.",
        "מלוקלה למחנה הבסיס ולקאלה פאתאר. בדרך כלל חמישה עשר–שמונה עשר ימים כולל טיסות ורזרבות.",
      ],
      [
        "We run Everest Base Camp as a tea-house trek from Lukla with real acclimatisation in Namche and Dingboche — not a race to 5,364 m. Kala Patthar (about 5,545 m) is the viewpoint morning. Typical length is fifteen to eighteen days; we hold sixteen with flight buffers. Flights and Khumbu logistics are quoted from Pokhara or Kathmandu clearly.",
        "珠峰大本营按茶馆徒步从卢卡拉出发，在南崎与丁波切真正适应——不是赶往 5,364 米。卡拉帕特（约 5,545 米）是观景清晨。通常十五到十八天；我们按十六天含航班机动。航班与昆布后勤从博卡拉或加德满都如实报价。",
        "EBC는 루클라 찻집 트레킹, 남체·딩보체 적응. 칼라 파타르(약 5,545 m) 전망. 보통 15–18일.",
        "מחנה הבסיס של אוורסט כטרק בתי תה מלוקלה עם אקלום אמיתי. קאלה פאתאר לתצפית. בדרך כלל חמישה עשר–שמונה עשר ימים; שומרים שישה עשר.",
      ],
      S_CLASSIC,
      D_CHAL,
      [
        [["To Lukla and Phakding", "至卢卡拉与帕克丁", "루클라·팍딩", "ללוקלה ופהאקדינג"], ["Flight buffer and first trail night.", "航班机动与第一夜。", "항공 버퍼와 첫 트레일 밤.", "רזרבת טיסה וליל שביל ראשון."]],
        [["Namche acclimatisation", "南崎适应", "남체 적응", "אקלום בנמצ'ה"], ["Two nights, short high walk.", "两夜，短高走。", "이틀 밤, 짧은 고지 걷기.", "שני לילות, הליכה גבוהה קצרה."]],
        [["Toward Dingboche / Lobuche", "前往丁波切 / 洛布切", "딩보체/로부체", "לדינגבוצ'ה / לובוצ'ה"], ["Rising villages, honest rest days.", "村落渐高，诚实休息日。", "마을이 높아짐, 진짜 휴식일.", "כפרים עולים, ימי מנוחה כנים."]],
        [["EBC and Kala Patthar", "大本营与卡拉帕特", "EBC와 칼라 파타르", "מחנה הבסיס וקאלה פאתאר"], ["Base Camp day, viewpoint morning, begin descent.", "大本营日、观景清晨，开始下山。", "베이스캠프일, 전망 아침, 하산 시작.", "יום מחנה הבסיס, בוקר תצפית, תחילת ירידה."]],
        [["Out via Lukla", "经卢卡拉出山", "루클라로 출구", "יציאה דרך לוקלה"], ["Descend and fly when weather allows.", "下山，天气允许则飞出。", "하산 후 날씨 되면 항공.", "ירידה וטיסה כשמזג האוויר מאפשר."]],
      ],
    ),
  },
  {
    slug: "kanchenjunga",
    durationDays: 18,
    difficulty: "challenging",
    maxAltitudeM: 5143,
    priceFromUsd: 2290,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.kanchenjunga,
    featured: false,
    sortOrder: 27,
    copy: loc(
      ["Kanchenjunga Trek", "干城章嘉徒步", "칸첸중가 트레킹", "טרק קאנצ'נג'ונגה"],
      [
        "Far-east Nepal: north and/or south base approaches. Typically fifteen to twenty days.",
        "尼泊尔极东：北和/或南大本营方向。通常十五到二十天。",
        "네팔 극동: 북·남 베이스 접근. 보통 15–20일.",
        "מזרח נפאל הרחוק: גישות מחנה בסיס צפון ו/או דרום. בדרך כלל חמישה עשר–עשרים ימים.",
      ],
      [
        "Kanchenjunga is a long, remote tea-house and camping mix in Nepal’s far east. We arrange permits, flights or overland from the east, and a paced approach to the north and/or south viewpoints. Typical length is fifteen to twenty days; we hold eighteen. This is not a Pokhara day trip — logistics are part of the quote.",
        "干城章嘉是尼泊尔极东漫长偏远的茶馆与露营混合行程。我们安排许可、东部航班或陆路，以及向北和/或南观景点的配速进山。通常十五到二十天；我们按十八天走。不是博卡拉一日游——后勤写在报价里。",
        "칸첸중가는 극동 장거리 원격 트레킹입니다. 허가·항공/육로, 북·남 전망. 보통 15–20일.",
        "קאנצ'נג'ונגה הוא טרק ארוך ומרוחק במזרח נפאל. היתרים, טיסות או יבשה, גישה בקצב. בדרך כלל חמישה עשר–עשרים ימים; שומרים שמונה עשר.",
      ],
      S_CLASSIC,
      D_CHAL,
      [
        [["East Nepal arrival", "抵达东尼泊尔", "동부 네팔 도착", "הגעה למזרח נפאל"], ["Flight or overland into the trailhead region.", "飞或陆路进入步道区域。", "항공 또는 육로로 트레일헤드.", "טיסה או יבשה לאזור ראש השביל."]],
        [["Toward the base approaches", "前往大本营方向", "베이스 접근으로", "לגישות מחנה הבסיס"], ["Village nights, rising altitude.", "村落夜，海拔渐高。", "마을 밤, 고도 상승.", "לילות כפר, גובה עולה."]],
        [["Viewpoint days", "观景日", "전망일", "ימי תצפית"], ["North and/or south viewpoints as the itinerary holds.", "按行程北和/或南观景点。", "일정에 따라 북·남 전망.", "תצפיות צפון ו/או דרום לפי המסלול."]],
        [["Long exit", "漫长出山", "긴 출구", "יציאה ארוכה"], ["Descend and reconnect to flights or road.", "下山接回航班或公路。", "하산 후 항공/도로 연결.", "ירידה וחיבור לטיסות או כביש."]],
      ],
    ),
  },
];

const activities: SeedTrip[] = [
  {
    slug: "hot-air-balloon-pokhara",
    kind: "activity",
    durationDays: 1,
    difficulty: "easy",
    maxAltitudeM: 1200,
    priceFromUsd: 220,
    season: "Oct–May",
    heroImageUrl: IMAGES.balloon,
    featured: true,
    sortOrder: 40,
    inclusions: ACTIVITY_INCLUSIONS,
    exclusions: ACTIVITY_EXCLUSIONS,
    bestMonths: MONTHS_ACTIVITY,
    minAge: 6,
    altitudeProfile: [{ d: 1, m: 1200 }],
    copy: loc(
      ["Hot Air Balloon Pokhara", "博卡拉热气球", "포카라 열기구", "כדור פורח בפוקרה"],
      [
        "Dawn balloon over Phewa and the Annapurna line. Hotel pickup, flight, return to Lakeside.",
        "黎明热气球飞越费瓦与安纳普尔纳一线。酒店接送、飞行、回湖畔。",
        "페와와 안나푸르나 라인 위 새벽 열기구. 호텔 픽업, 비행, 레이크사이드 복귀.",
        "כדור פורח בזריחה מעל פאווה וקו האנאפורנה. איסוף, טיסה, חזרה ללייקסייד.",
      ],
      [
        "A calm morning above Pokhara when wind and visibility allow. We book a licensed balloon operator, share pickup from Lakeside, and land before the day crowds the lake. Photo packages and private charters are optional extras — we quote them separately. Weather cancellations are rescheduled or refunded per operator rules.",
        "风与能见度允许时，博卡拉上方平静的早晨。我们预订持牌热气球运营商，湖畔拼车接送，在湖边拥挤前着陆。摄影套餐与包场另报价。因天气取消按运营商规则改期或退款。",
        "바람과 시정이 허용될 때 포카라 위 고요한 아침. 면허 운영사 예약, 레이크사이드 픽업. 사진·전세는 별도 견적. 기상 취소는 운영 규정에 따릅니다.",
        "בוקר רגוע מעל פוקרה כשהרוח והראות מאפשרים. מזמינים מפעיל מורשה, איסוף מלייקסייד. חבילות צילום בנפרד. ביטולי מזג אוויר לפי כללי המפעיל.",
      ],
      S_OCT_MAY,
      D_EASY,
      [[["Dawn balloon flight", "黎明热气球飞行", "새벽 열기구", "טיסת כדור בזריחה"], ["Early pickup, briefing, flight over the lake valley, return to hotel.", "清晨接人、简报、飞越湖谷、回酒店。", "이른 픽업, 브리핑, 호수 계곡 상공 비행, 호텔 복귀.", "איסוף מוקדם, תדריך, טיסה מעל עמק האגם, חזרה למלון."]]],
    ),
  },
  {
    slug: "zip-line-pokhara",
    kind: "activity",
    durationDays: 1,
    difficulty: "easy",
    maxAltitudeM: 0,
    priceFromUsd: 69,
    season: "Year-round",
    heroImageUrl: IMAGES.zip,
    featured: true,
    sortOrder: 41,
    inclusions: ACTIVITY_INCLUSIONS,
    exclusions: ACTIVITY_EXCLUSIONS,
    bestMonths: MONTHS_ACTIVITY,
    minAge: 8,
    grade: "Zip",
    altitudeProfile: [{ d: 1, m: 0 }],
    copy: loc(
      ["Zip Line Pokhara", "博卡拉溜索", "포카라 집라인", "זיפ ליין בפוקרה"],
      [
        "Long zip over the Pokhara hills — HighGround-style flyer from Lakeside pickup.",
        "博卡拉山丘长溜索——湖畔接送的 HighGround 式飞线。",
        "포카라 언덕 위 긴 집라인. 레이크사이드 픽업.",
        "זיפ ארוך מעל גבעות פוקרה — איסוף מלייקסייד.",
      ],
      [
        "We book the long zip / zip-flyer experience near Pokhara (HighGround and similar sites). Shared hotel pickup, harness briefing, one or more runs as the ticket states. Photo and video are usually extra. Weight and age limits apply — we confirm before you go.",
        "我们预订博卡拉附近的长溜索 / 飞线（HighGround 及同类场地）。拼车酒店接送、安全带简报，按票面一次或多次。摄影录像通常另计。有体重与年龄限制——出发前确认。",
        "포카라 인근 긴 집라인/집플라이어를 예약합니다. 픽업, 하네스 브리핑, 티켓 기준 주행. 사진·영상은 보통 별도. 체중·연령 제한 확인.",
        "מזמינים חוויית זיפ ארוכה ליד פוקרה. איסוף, תדריך רתמה, מסלולים לפי הכרטיס. צילום בדרך כלל בתוספת. מגבלות משקל וגיל.",
      ],
      S_YEAR,
      D_THRILL,
      [[["Zip day from Lakeside", "湖畔出发溜索日", "레이크사이드 집라인 데이", "יום זיפ מלייקסייד"], ["Pickup, briefing, zip runs, return.", "接人、简报、溜索、返回。", "픽업, 브리핑, 집 주행, 복귀.", "איסוף, תדריך, מסלולי זיפ, חזרה."]]],
    ),
  },
  {
    slug: "highground-bungee-pokhara",
    kind: "activity",
    durationDays: 1,
    difficulty: "moderate",
    maxAltitudeM: 0,
    priceFromUsd: 89,
    season: "Year-round",
    heroImageUrl: IMAGES.bungee,
    featured: true,
    sortOrder: 42,
    inclusions: ACTIVITY_INCLUSIONS,
    exclusions: ACTIVITY_EXCLUSIONS,
    bestMonths: MONTHS_ACTIVITY,
    minAge: 14,
    grade: "Bungee ~80m",
    altitudeProfile: [{ d: 1, m: 0 }],
    copy: loc(
      ["HighGround Bungee (Hemja)", "HighGround 蹦极（赫姆贾）", "하이그라운드 번지 (헴자)", "באנג'י HighGround (המיה)"],
      [
        "Tower bungee about 20 minutes from Lakeside in Hemja valley. Solo or tandem options.",
        "距湖畔约 20 分钟的赫姆贾谷地塔式蹦极。单人或双人可选。",
        "레이크사이드에서 약 20분, 헴자 계곡 타워 번지. 솔로/탠덤.",
        "באנג'י מגדל כ־20 דקות מלייקסייד בעמק המיה. יחיד או טנדם.",
      ],
      [
        "One of three Pokhara-area bungee jumps we book: HighGround’s cantilever tower over the Yamdi / Hemja valley (about 70–80 m). Hotel pickup, safety brief, one jump as ticketed. Tandem and photo packages are extras. Medical and weight limits apply.",
        "我们预订的博卡拉三处蹦极之一：HighGround 在亚姆迪 / 赫姆贾谷地的悬臂塔（约 70–80 米）。酒店接送、安全简报、按票一跳。双人与摄影另计。有健康与体重限制。",
        "포카라 권 번지 셋 중 하나. HighGround 헴자 타워(약 70–80 m). 픽업, 브리핑, 1회 점프. 탠덤·사진은 별도.",
        "אחד משלושת באנג'י באזור פוקרה: מגדל HighGround מעל המיה (כ־70–80 מ'). איסוף, תדריך, קפיצה אחת. טנדם וצילום בתוספת.",
      ],
      S_YEAR,
      D_THRILL,
      [[["Hemja bungee day", "赫姆贾蹦极日", "헴자 번지 데이", "יום באנג'י בהמיה"], ["Pickup, tower brief, jump, return to Lakeside.", "接人、塔上简报、跳跃、回湖畔。", "픽업, 타워 브리핑, 점프, 레이크사이드 복귀.", "איסוף, תדריך במגדל, קפיצה, חזרה ללייקסייד."]]],
    ),
  },
  {
    slug: "kushma-cliff-bungee",
    kind: "activity",
    durationDays: 1,
    difficulty: "challenging",
    maxAltitudeM: 0,
    priceFromUsd: 99,
    season: "Year-round",
    heroImageUrl: IMAGES.bungee,
    featured: false,
    sortOrder: 43,
    inclusions: ACTIVITY_INCLUSIONS,
    exclusions: ACTIVITY_EXCLUSIONS,
    bestMonths: MONTHS_ACTIVITY,
    minAge: 16,
    grade: "Bungee ~228m",
    altitudeProfile: [{ d: 1, m: 0 }],
    copy: loc(
      ["Kushma Cliff Bungee", "库什马悬崖蹦极", "쿠시마 클리프 번지", "באנג'י צוק קושמה"],
      [
        "Nepal’s high cliff bungee near Kushma — day trip from Pokhara (about 2–3 hours each way).",
        "库什马附近尼泊尔高悬崖蹦极——从博卡拉一日往返（单程约 2–3 小时）。",
        "쿠시마 인근 네팔 고절벽 번지. 포카라 당일(편도 약 2–3시간).",
        "באנג'י הצוק הגבוה ליד קושמה — יום מפוקרה (כ־2–3 שעות לכל כיוון).",
      ],
      [
        "Second of our three Pokhara-bookable bungees: The Cliff at Kushma over the Kali Gandaki gorge (often cited around 228 m). Shared transport from Lakeside, full safety brief, one jump. Swing combos available as a separate product. This is a long day — start early.",
        "我们预订的三处蹦极之二：库什马 The Cliff，卡利甘达基峡谷上方（常称约 228 米）。湖畔拼车、完整安全简报、一跳。秋千组合见独立产品。这是漫长的一天——请早出发。",
        "포카라에서 예약하는 번지 셋 중 둘째. 쿠시마 클리프(약 228 m). 이동·브리핑·1회 점프. 스윙 콤보는 별도 상품. 긴 하루입니다.",
        "השני משלושת הבאנג'י: הצוק בקושמה מעל הקאלי גנדקי (כ־228 מ'). הסעה, תדריך, קפיצה אחת. קומבו נדנדה במוצר נפרד. יום ארוך.",
      ],
      S_YEAR,
      D_THRILL,
      [[["Kushma bungee day trip", "库什马蹦极一日", "쿠시마 번지 당일", "יום באנג'י בקושמה"], ["Early drive to Kushma, jump, return to Pokhara.", "清晨驶往库什马、跳跃、回博卡拉。", "이른 쿠시마 이동, 점프, 포카라 복귀.", "נסיעה מוקדמת לקושמה, קפיצה, חזרה לפוקרה."]]],
    ),
  },
  {
    slug: "pokhara-adventure-bungee",
    kind: "activity",
    durationDays: 1,
    difficulty: "moderate",
    maxAltitudeM: 0,
    priceFromUsd: 85,
    season: "Year-round",
    heroImageUrl: IMAGES.bungee,
    featured: false,
    sortOrder: 44,
    inclusions: ACTIVITY_INCLUSIONS,
    exclusions: ACTIVITY_EXCLUSIONS,
    bestMonths: MONTHS_ACTIVITY,
    minAge: 14,
    grade: "Bungee",
    altitudeProfile: [{ d: 1, m: 0 }],
    copy: loc(
      ["Pokhara Adventure Bungee", "博卡拉探险蹦极", "포카라 어드벤처 번지", "באנג'י הרפתקאות בפוקרה"],
      [
        "Third Pokhara-area bungee we book — tower or gorge site confirmed at booking time.",
        "我们预订的第三处博卡拉蹦极——订位时确认塔式或峡谷场地。",
        "포카라 권 세 번째 번지. 예약 시 타워/협곡 사이트 확정.",
        "הבאנג'י השלישי באזור פוקרה — אתר מגדל או קניון מאושר בעת ההזמנה.",
      ],
      [
        "We hold a third Pokhara-region bungee slot for seasonal operators and alternate tower / gorge sites when HighGround or Kushma are full. Same rules: licensed brief, weight limits, shared pickup from Lakeside, photo extras separate. Exact height and site are confirmed on WhatsApp before you pay the activity ticket.",
        "当 HighGround 或库什马满员时，我们保留第三处博卡拉地区蹦极名额（季节性运营商或替补塔 / 峡谷场地）。同样规则：持牌简报、体重限制、湖畔拼车、摄影另计。确切高度与场地付款前在 WhatsApp 确认。",
        "HighGround·쿠시마가 찰 때 쓰는 세 번째 포카라 권 번지 슬롯. 면허 브리핑, 체중 제한, 픽업. 높이·사이트는 결제 전 WhatsApp 확정.",
        "שומרים מקום באנג'י שלישי באזור פוקרה כש-HighGround או קושמה מלאים. תדריך מורשה, מגבלות משקל, איסוף. גובה ואתר מאושרים ב-WhatsApp לפני התשלום.",
      ],
      S_YEAR,
      D_THRILL,
      [[["Adventure bungee day", "探险蹦极日", "어드벤처 번지 데이", "יום באנג'י הרפתקאות"], ["Pickup, site brief, jump, return.", "接人、场地简报、跳跃、返回。", "픽업, 사이트 브리핑, 점프, 복귀.", "איסוף, תדריך באתר, קפיצה, חזרה."]]],
    ),
  },
  {
    slug: "pokhara-swing",
    kind: "activity",
    durationDays: 1,
    difficulty: "moderate",
    maxAltitudeM: 0,
    priceFromUsd: 89,
    season: "Year-round",
    heroImageUrl: IMAGES.swing,
    featured: false,
    sortOrder: 45,
    inclusions: ACTIVITY_INCLUSIONS,
    exclusions: ACTIVITY_EXCLUSIONS,
    bestMonths: MONTHS_ACTIVITY,
    minAge: 14,
    grade: "Swing",
    altitudeProfile: [{ d: 1, m: 0 }],
    copy: loc(
      ["Canyon Swing Pokhara", "博卡拉峡谷秋千", "포카라 캐년 스윙", "נדנדת קניון בפוקרה"],
      [
        "Giant / canyon swing day from Pokhara — often paired with Kushma or HighGround sites.",
        "从博卡拉出发的巨型 / 峡谷秋千日——常与库什马或 HighGround 场地组合。",
        "포카라 출발 자이언트/캐년 스윙. 쿠시마·HighGround와 자주 조합.",
        "יום נדנדת ענק / קניון מפוקרה — לעיתים עם קושמה או HighGround.",
      ],
      [
        "A harness swing out over a gorge or valley, booked through the same adventure parks as our bungee products. Pickup from Lakeside, brief, one or more swings as ticketed. Combos with bungee or zip are available on request.",
        "通过与蹦极相同的探险园预订，背带秋千飞出峡谷或山谷。湖畔接送、简报、按票一次或多次。可应要求与蹦极或溜索组合。",
        "번지와 같은 어드벤처 파크의 하네스 스윙. 픽업, 브리핑, 티켓 기준 스윙. 번지·집 콤보 가능.",
        "נדנדה ברתמה מעל קניון, באותם פארקים כמו הבאנג'י. איסוף, תדריך, נדנודים לפי כרטיס. קומבו עם באנג'י או זיפ לפי בקשה.",
      ],
      S_YEAR,
      D_THRILL,
      [[["Swing day", "秋千日", "스윙 데이", "יום נדנדה"], ["Pickup, brief, swing, return to Pokhara.", "接人、简报、秋千、回博卡拉。", "픽업, 브리핑, 스윙, 포카라 복귀.", "איסוף, תדריך, נדנדה, חזרה לפוקרה."]]],
    ),
  },
  {
    slug: "mega-trolley-pokhara",
    kind: "activity",
    durationDays: 1,
    difficulty: "easy",
    maxAltitudeM: 0,
    priceFromUsd: 59,
    season: "Year-round",
    heroImageUrl: IMAGES.trolley,
    featured: false,
    sortOrder: 46,
    inclusions: ACTIVITY_INCLUSIONS,
    exclusions: ACTIVITY_EXCLUSIONS,
    bestMonths: MONTHS_ACTIVITY,
    minAge: 8,
    grade: "Trolley",
    altitudeProfile: [{ d: 1, m: 0 }],
    copy: loc(
      ["Mega Trolley Pokhara", "博卡拉巨型滑车", "포카라 메가 트롤리", "מגה טרולי בפוקרה"],
      [
        "Mega trolley / mega zip cart across the valley — seated thrill near Pokhara adventure parks.",
        "巨型滑车 / 山谷滑车——博卡拉探险园附近的坐式刺激项目。",
        "메가 트롤리/메가 집 카트. 포카라 어드벤처 파크 인근 좌식 스릴.",
        "מגה טרולי / עגלת זיפ מעל העמק — ריגוש בישיבה ליד פארקי ההרפתקאות.",
      ],
      [
        "The mega trolley is the seated cable run at Pokhara’s adventure sites — less freefall than bungee, still high over the valley. We include shared pickup and the operator ticket. Good for guests who want height without a jump. Age and weight limits apply.",
        "巨型滑车是博卡拉探险场地的坐式索道——比蹦极自由落体少，仍高悬山谷之上。含拼车接送与运营商门票。适合想要高度但不跳跃的客人。有年龄与体重限制。",
        "메가 트롤리는 좌식 케이블 주행입니다. 번지보다 자유 낙하가 적고 계곡 위는 높습니다. 픽업·티켓 포함.",
        "המגה טרולי הוא מסלול כבל בישיבה — פחות נפילה חופשית מבאנג'י, עדיין גבוה מעל העמק. כולל איסוף וכרטיס.",
      ],
      S_YEAR,
      D_THRILL,
      [[["Mega trolley day", "巨型滑车日", "메가 트롤리 데이", "יום מגה טרולי"], ["Pickup, brief, trolley run, return.", "接人、简报、滑车、返回。", "픽업, 브리핑, 트롤리 주행, 복귀.", "איסוף, תדריך, מסלול טרולי, חזרה."]]],
    ),
  },
];

const safaris: SeedTrip[] = [
  {
    slug: "chitwan-jungle-safari",
    kind: "safari",
    durationDays: 3,
    difficulty: "easy",
    maxAltitudeM: 200,
    priceFromUsd: 249,
    season: "Oct–May",
    heroImageUrl: IMAGES.chitwan,
    featured: true,
    sortOrder: 50,
    inclusions: SAFARI_INCLUSIONS,
    exclusions: SAFARI_EXCLUSIONS,
    bestMonths: MONTHS_SAFARI,
    altitudeProfile: [
      { d: 1, m: 200 },
      { d: 2, m: 200 },
      { d: 3, m: 200 },
    ],
    copy: loc(
      ["Chitwan Jungle Safari", "奇旺丛林safari", "치트완 정글 사파리", "ספארי ג'ונגל בצ'יטוואן"],
      [
        "Classic Terai park package: jeep safari, canoe, lodge nights. Typically two to three days from Pokhara.",
        "经典德赖公园套餐：吉普safari、独木舟、旅舍夜。从博卡拉通常两到三天。",
        "테라이 공원 패키지: 지프 사파리, 카누, 롯지. 포카라에서 보통 2–3일.",
        "חבילת פארק טראי קלאסית: ג'יפ, קאנו, לילות לודג'. בדרך כלל יומיים–שלושה מפוקרה.",
      ],
      [
        "Chitwan National Park is the classic jungle add-on after a trek: shared or private transfer from Pokhara, lodge nights, jeep safari, and often a dugout canoe on the river. Rhinos and birds are the honest draw — tiger sightings are never guaranteed. Typical package is two to three days; we hold three.",
        "奇旺国家公园是徒步后的经典丛林加项：从博卡拉拼车或包车、旅舍夜、吉普safari，常有河上独木舟。犀牛与鸟类是诚实卖点——老虎从不保证。通常两到三天；我们按三天走。",
        "치트완은 트레킹 후 클래식 정글 추가입니다. 이동, 롯지, 지프 사파리, 카누. 코뿔소·새는 정직한 매력, 호랑이는 보장 없음. 보통 2–3일.",
        "צ'יטוואן הוא תוספת הג'ונגל הקלאסית אחרי טרק. העברה, לודג', ג'יפ, קאנו. קרנפים וציפורים — נמרים לא מובטחים. בדרך כלל יומיים–שלושה; שומרים שלושה.",
      ],
      S_SAFARI,
      D_EASY,
      [
        [["Pokhara to Chitwan lodge", "博卡拉至奇旺旅舍", "포카라에서 치트완 롯지", "מפוקרה ללודג' בצ'יטוואן"], ["Transfer and evening park briefing.", "接送与傍晚公园简报。", "이동과 저녁 공원 브리핑.", "העברה ותדריך ערב בפארק."]],
        [["Safari day", "Safari 日", "사파리 데이", "יום ספארי"], ["Jeep and/or canoe as the lodge package states.", "按旅舍套餐吉普和/或独木舟。", "롯지 패키지 기준 지프/카누.", "ג'יפ ו/או קאנו לפי חבילת הלודג'."]],
        [["Return toward Pokhara or Kathmandu", "返回博卡拉或加德满都", "포카라/카트만두 복귀", "חזרה לפוקרה או קטמנדו"], ["Morning activity if included, then transfer out.", "若含早晨活动则先完成，再转出。", "포함 시 아침 활동 후 이동.", "פעילות בוקר אם כלולה, ואז העברה החוצה."]],
      ],
    ),
  },
  {
    slug: "bardia-jungle-safari",
    kind: "safari",
    durationDays: 4,
    difficulty: "easy",
    maxAltitudeM: 300,
    priceFromUsd: 390,
    season: "Oct–May",
    heroImageUrl: IMAGES.bardia,
    featured: false,
    sortOrder: 51,
    inclusions: SAFARI_INCLUSIONS,
    exclusions: SAFARI_EXCLUSIONS,
    bestMonths: MONTHS_SAFARI,
    altitudeProfile: [
      { d: 1, m: 300 },
      { d: 2, m: 300 },
      { d: 3, m: 300 },
      { d: 4, m: 300 },
    ],
    copy: loc(
      ["Bardia Jungle Safari", "巴迪亚丛林safari", "바르디아 정글 사파리", "ספארי ג'ונגל בברדיה"],
      [
        "Quieter west Terai park — tiger country odds better than Chitwan, longer transfer. Typically three to four days.",
        "更安静的西部德赖公园——老虎概率高于奇旺，车程更长。通常三到四天。",
        "한산한 서부 테라이. 호랑이 확률은 치트완보다 나을 수 있고 이동은 깁니다. 보통 3–4일.",
        "פארק טראי מערבי שקט יותר — סיכויי נמר טובים מצ'יטוואן, העברה ארוכה יותר. בדרך כלל שלושה–ארבעה ימים.",
      ],
      [
        "Bardia National Park is the quieter alternative to Chitwan: longer road from Pokhara or Kathmandu, fewer jeeps, stronger tiger habitat reputation. Still no guarantees. Typical package is three to four days; we hold four with lodge nights and guided jeep / walking safaris as quoted.",
        "巴迪亚国家公园是奇旺更安静的替代：从博卡拉或加德满都车程更长、吉普更少、老虎栖息名声更强。仍无保证。通常三到四天；我们按四天走，旅舍夜与向导吉普 / 步行按报价。",
        "바르디아는 치트완보다 한산한 대안입니다. 이동이 길고 지프가 적습니다. 호랑이 보장 없음. 보통 3–4일.",
        "ברדיה היא החלופה השקטה לצ'יטוואן. העברה ארוכה יותר, פחות ג'יפים. עדיין בלי הבטחות. בדרך כלל שלושה–ארבעה ימים; שומרים ארבעה.",
      ],
      S_SAFARI,
      D_EASY,
      [
        [["Transfer to Bardia", "转至巴迪亚", "바르디아로 이동", "העברה לברדיה"], ["Long road day into the west Terai lodge.", "漫长公路日到西部德赖旅舍。", "서부 테라이 롯지로 긴 도로일.", "יום כביש ארוך ללודג' בטראי המערבי."]],
        [["Safari days", "Safari 日", "사파리 데이", "ימי ספארי"], ["Jeep and walking as the package lists.", "按套餐吉普与步行。", "패키지 기준 지프·걷기.", "ג'יפ והליכה לפי החבילה."]],
        [["Buffer / second park day", "机动 / 第二公园日", "버퍼/둘째 공원일", "רזרבה / יום פארק שני"], ["Another morning in the park if included.", "若包含则再一个公园早晨。", "포함 시 공원 아침 하나 더.", "בוקר נוסף בפארק אם כלול."]],
        [["Return journey", "回程", "복귀", "מסע חזרה"], ["Out to Pokhara or Kathmandu.", "回博卡拉或加德满都。", "포카라 또는 카트만두로.", "חזרה לפוקרה או קטמנדו."]],
      ],
    ),
  },
  {
    slug: "dhorpatan-jungle-safari",
    kind: "safari",
    durationDays: 5,
    difficulty: "moderate",
    maxAltitudeM: 3000,
    priceFromUsd: 490,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.dhorpatan,
    featured: false,
    sortOrder: 52,
    inclusions: SAFARI_INCLUSIONS,
    exclusions: SAFARI_EXCLUSIONS,
    bestMonths: MONTHS_TREK,
    altitudeProfile: [
      { d: 1, m: 1500 },
      { d: 2, m: 2500 },
      { d: 3, m: 3000 },
      { d: 4, m: 2500 },
      { d: 5, m: 820 },
    ],
    copy: loc(
      ["Dhorpatan Hunting Reserve Safari", "多尔帕坦狩猎保护区 safari", "도르파탄 사파리", "ספארי שמורת דורפאטאן"],
      [
        "High hills west of Pokhara: Dhorpatan reserve for blue sheep country and open meadows. Multi-day package.",
        "博卡拉以西高地：多尔帕坦保护区，岩羊与开阔草甸。多日套餐。",
        "포카라 서쪽 고지. 도르파탄 보호구, 푸른양·초원. 다일 패키지.",
        "גבעות גבוהות ממערב לפוקרה: שמורת דורפאטאן, כבשים כחולות ואחו פתוח. חבילה רב-יומית.",
      ],
      [
        "Dhorpatan is Nepal’s hunting reserve turned wildlife / meadow safari west of Pokhara — higher and cooler than Chitwan, with jeep and lodge or camping nights. Blue sheep and high pastures are the draw; this is not a tiger park. Typical package is four to six days; we hold five. Transfers and park fees are itemised in the quote.",
        "多尔帕坦是博卡拉以西的狩猎保护区转型野生动植物 / 草甸 safari——比奇旺更高更凉，吉普与旅舍或露营夜。岩羊与高牧场是卖点；不是老虎公园。通常四到六天；我们按五天走。接送与公园费在报价分列。",
        "도르파탄은 포카라 서쪽 고지 사파리입니다. 치트완보다 높고 시원. 푸른양·목초가 매력, 호랑이 공원 아님. 보통 4–6일.",
        "דורפאטאן היא שמורה ממערב לפוקרה — גבוהה וקרירה מצ'יטוואן. כבשים כחולות ומרעה; לא פארק נמרים. בדרך כלל ארבעה–שישה ימים; שומרים חמישה.",
      ],
      S_CLASSIC,
      D_MOD,
      [
        [["Pokhara toward Dhorpatan", "博卡拉前往多尔帕坦", "포카라에서 도르파탄으로", "מפוקרה לדורפאטאן"], ["Jeep into the western hills.", "吉普进入西部山地。", "서쪽 언덕으로 지프.", "ג'יפ לגבעות המערביות."]],
        [["Reserve days", "保护区日", "보호구 데이", "ימי שמורה"], ["Guided wildlife / meadow time as packaged.", "按套餐向导野生动植物 / 草甸时间。", "패키지 기준 가이드 야생/초원.", "זמן חיות בר / אחו מודרך לפי החבילה."]],
        [["High camps or lodges", "高营地或旅舍", "하이캠프/롯지", "מחנות גבוהים או לודג'ים"], ["Nights in the reserve belt.", "保护区带过夜。", "보호구 벨트에서 밤.", "לילות בחגורת השמורה."]],
        [["Return to Pokhara", "返回博卡拉", "포카라 복귀", "חזרה לפוקרה"], ["Long jeep day home to the lake.", "漫长吉普日回湖。", "긴 지프일로 호수 귀가.", "יום ג'יפ ארוך חזרה לאגם."]],
      ],
    ),
  },
];

const rafts: SeedTrip[] = [
  {
    slug: "kaligandaki-1-day",
    kind: "rafting",
    durationDays: 1,
    difficulty: "moderate",
    maxAltitudeM: 1100,
    priceFromUsd: 129,
    season: "Sep–Nov, Mar–May",
    heroImageUrl: IMAGES.kali,
    featured: true,
    sortOrder: 14,
    inclusions: RAFT_INCLUSIONS,
    exclusions: RAFT_EXCLUSIONS,
    bestMonths: MONTHS_RIVER,
    river: "Kaligandaki",
    grade: "III–IV",
    minAge: 14,
    altitudeProfile: [{ d: 1, m: 1100 }],
    copy: loc(
      ["Kaligandaki 1 day", "卡利甘达基一日", "칼리간다키 1일", "קאליגנדקי יום אחד"],
      [
        "A full Grade III–IV day on the Kali Gandaki from Pokhara. Home to Lakeside the same evening.",
        "从博卡拉出发的卡利甘达基 III–IV 级全日。当晚回到湖畔。",
        "포카라에서 출발하는 칼리간다키 Grade III–IV 하루. 저녁에 레이크사이드로.",
        "יום מלא דרגה III–IV על הקאלי גנדקי מפוקרה. חזרה ללייקסייד באותו ערב.",
      ],
      [
        "The one-day Kali Gandaki is the honest river day from Pokhara: bigger water than a gentle valley float, helmet and PFD on everyone, licensed river guides. Typical put-in is west of the lake with a long drive. We refuse a flood run. Minimum age is on this page; if you cannot swim, say so on the bank.",
        "卡利甘达基一日是从博卡拉出发诚实的河日：比温和谷漂更大的水，全员头盔与救生衣，持证河道向导。通常在湖西较远下船点，车程不短。洪水时停漂。最低年龄写在本页；若不会游泳，请在岸上直说。",
        "칼리간다키 1일은 포카라에서 떠나는 정직한 강 하루입니다. 전원 헬멧·PFD, 면허 가이드. 호수 서쪽 먼 풋인, 이동이 깁니다. 홍수면 거절합니다.",
        "יום אחד על הקאלי גנדקי הוא יום הנהר הכנה מפוקרה. מים גדולים יותר, קסדה ואפוד לכולם. נסיעה ארוכה למערב האגם. נסרב לשיטפון.",
      ],
      S_RIVER,
      D_RIVER,
      [
        [
          ["Kaligandaki day run", "卡利甘达基一日漂", "칼리간다키 하루", "יום על הקאלי גנדקי"],
          ["Early pickup, safety brief, Grade III–IV water, drive back to Lakeside.", "清晨接人、安全简报、III–IV 级水，驱车回湖畔。", "이른 픽업, 안전 브리핑, Grade III–IV, 레이크사이드 복귀.", "איסוף מוקדם, תדריך בטיחות, מים III–IV, חזרה ללייקסייד."],
        ],
      ],
    ),
  },
  {
    slug: "kaligandaki-2-day",
    kind: "rafting",
    durationDays: 2,
    difficulty: "moderate",
    maxAltitudeM: 1150,
    priceFromUsd: 249,
    season: "Sep–Nov, Mar–May",
    heroImageUrl: IMAGES.kali,
    featured: false,
    sortOrder: 15,
    inclusions: RAFT_INCLUSIONS,
    exclusions: RAFT_EXCLUSIONS,
    bestMonths: MONTHS_RIVER,
    river: "Kaligandaki",
    grade: "III–IV",
    minAge: 14,
    altitudeProfile: [
      { d: 1, m: 1150 },
      { d: 2, m: 1000 },
    ],
    copy: loc(
      ["Kaligandaki 2 day", "卡利甘达基两日", "칼리간다키 2일", "קאליגנדקי יומיים"],
      [
        "Two days of Grade III–IV in the Kali Gandaki gorge. A beach or lodge night on the river.",
        "卡利甘达基峡谷两日 III–IV 级。河岸营地或旅舍一夜。",
        "칼리간다키 협곡 Grade III–IV 이틀. 강변 비치 또는 롯지 하룻밤.",
        "יומיים דרגה III–IV בקניון הקאלי גנדקי. ליל חוף או לודג' על הנהר.",
      ],
      [
        "Two days lets the gorge breathe: a full first day on Grade III–IV water, a night on the bank, and a second morning before the drive to Pokhara. Same safety rules as the one-day. We will not run in flood. Typical length is two days; there is no fake “express” version that skips the night.",
        "两日让峡谷有呼吸空间：第一天全日 III–IV 级，岸边过夜，第二天早晨再漂，然后回博卡拉。安全规则与一日相同。洪水不停。就是两天；没有跳过夜的假“特快”。",
        "이틀이면 협곡이 숨을 쉽니다. 첫날 Grade III–IV, 강변 밤, 이튿날 아침 후 포카라. 홍수면 안 갑니다.",
        "יומיים נותנים לקניון לנשום: יום מלא III–IV, לילה על הגדה, בוקר שני ואז פוקרה. לא רצים בשיטפון.",
      ],
      S_RIVER,
      D_RIVER,
      [
        [
          ["Into the gorge", "进入峡谷", "협곡으로", "אל הקניון"],
          ["Drive from Pokhara, safety brief, first day of III–IV, camp or lodge on the bank.", "从博卡拉出发、安全简报、第一日 III–IV，岸边营地或旅舍。", "포카라에서 이동, 안전 브리핑, 첫날 III–IV, 강변 캠프/롯지.", "נסיעה מפוקרה, תדריך, יום ראשון III–IV, מחנה או לודג' על הגדה."],
        ],
        [
          ["Second water, return Pokhara", "第二日水路，返回博卡拉", "둘째 날 물, 포카라 복귀", "מים ביום השני, חזרה לפוקרה"],
          ["Morning rapids, take-out, long drive to Lakeside.", "早晨急流、上岸、长途回湖畔。", "아침 급류, 테이크아웃, 레이크사이드로 긴 이동.", "אשדות בוקר, יציאה, נסיעה ארוכה ללייקסייד."],
        ],
      ],
    ),
  },
  {
    slug: "kaligandaki-3-day",
    kind: "rafting",
    durationDays: 3,
    difficulty: "challenging",
    maxAltitudeM: 1200,
    priceFromUsd: 390,
    season: "Sep–Nov, Mar–May",
    heroImageUrl: IMAGES.kali,
    featured: false,
    sortOrder: 16,
    inclusions: RAFT_INCLUSIONS,
    exclusions: RAFT_EXCLUSIONS,
    bestMonths: MONTHS_RIVER,
    river: "Kaligandaki",
    grade: "III–IV",
    minAge: 16,
    altitudeProfile: [
      { d: 1, m: 1200 },
      { d: 2, m: 1100 },
      { d: 3, m: 950 },
    ],
    copy: loc(
      ["Kaligandaki 3 day", "卡利甘达基三日", "칼리간다키 3일", "קאליגנדקי שלושה ימים"],
      [
        "The deeper gorge: three days of Grade III–IV for guests who came for river first.",
        "更深的峡谷：三日 III–IV 级，给先为白水而来的客人。",
        "더 깊은 협곡. Grade III–IV 사흘, 강을 먼저 온 손님을 위한 일정.",
        "הקניון העמוק: שלושה ימים דרגה III–IV לאורחים שבאו קודם כל בשביל הנהר.",
      ],
      [
        "Three days on the Kali Gandaki is the full gorge trip from Pokhara: more river than mountain, two nights on the bank, Grade III–IV. Minimum age is higher. Helmet and PFD on everyone. We refuse a flood week. Typical length is three days — not a padded brochure number.",
        "卡利甘达基三日是从博卡拉出发的完整峡谷行程：水多于山，岸边两夜，III–IV 级。最低年龄更高。全员头盔与救生衣。洪水周停漂。就是三天——不是宣传册里凑的数字。",
        "칼리간다키 3일은 포카라에서 떠나는 완전한 협곡 일정입니다. 산보다 강, 강변 이틀 밤, Grade III–IV. 최소 연령이 더 높습니다. 홍수 주면 거절합니다.",
        "שלושה ימים על הקאלי גנדקי הם טיול הקניון המלא מפוקרה. יותר נהר מהר, שני לילות על הגדה, III–IV. גיל מינימום גבוה יותר. נסרב לשבוע שיטפון.",
      ],
      S_RIVER,
      D_CHAL,
      [
        [
          ["Drive in, first gorge day", "驶入，峡谷第一日", "이동 후 협곡 첫날", "נסיעה פנימה, יום קניון ראשון"],
          ["Pokhara to put-in, safety, first III–IV miles, camp.", "博卡拉到下船点、安全、第一段 III–IV，露营。", "포카라에서 풋인, 안전, 첫 III–IV, 캠프.", "מפוקרה לנקודת הכניסה, בטיחות, הקילומטרים הראשונים, מחנה."],
        ],
        [
          ["Heart of the gorge", "峡谷深处", "협곡의 심장", "לב הקניון"],
          ["Full day III–IV, high walls, lunch on an eddy.", "全日 III–IV，高墙，回流处午餐。", "종일 III–IV, 높은 벽, 와류에서 점심.", "יום מלא III–IV, קירות גבוהים, צהריים באדי."],
        ],
        [
          ["Last water, return Pokhara", "最后一段水，返回博卡拉", "마지막 물, 포카라 복귀", "מים אחרונים, חזרה לפוקרה"],
          ["Morning paddle, take-out, drive to the lake.", "早晨划行、上岸、回湖。", "아침 패들, 테이크아웃, 호수로.", "חתירה בוקר, יציאה, נסיעה לאגם."],
        ],
      ],
    ),
  },
];

const faqs: { sortOrder: number; copy: Record<Locale, { question: string; answer: string }> }[] = [
  {
    sortOrder: 1,
    copy: {
      en: {
        question: "Do I need an account to book?",
        answer: "No. You send dates and a phone number. A manager in Pokhara replies. Nothing is stored as a login.",
      },
      zh: {
        question: "预订需要注册账号吗？",
        answer: "不需要。你提交日期和电话，博卡拉的经理回复。不会建成登录账号。",
      },
      ko: {
        question: "예약에 계정이 필요하나요?",
        answer: "없습니다. 날짜와 전화만 보내면 포카라 매니저가 답합니다. 로그인 계정은 만들지 않습니다.",
      },
      he: {
        question: "צריך חשבון כדי להזמין?",
        answer: "לא. שולחים תאריכים ומספר טלפון. מנהל בפוקרה עונה. לא נשמר שום לוגין.",
      },
    },
  },
  {
    sortOrder: 2,
    copy: {
      en: {
        question: "What permits are included on Annapurna treks?",
        answer:
          "ACAP and TIMS are in the trip price. We process them in Pokhara before you walk. You still need a Nepal visa and insurance that covers trekking (and rafting, if you add a river day). Upper Mustang adds a restricted-area permit — we quote it plainly.",
      },
      zh: {
        question: "安纳普尔纳徒步包含哪些许可？",
        answer:
          "ACAP 与 TIMS 含在报价里，出发前在博卡拉办理。你仍需尼泊尔签证，以及覆盖徒步（若加河日，也覆盖漂流）的保险。上木斯塘另有限制区许可——我们会如实报价。",
      },
      ko: {
        question: "안나푸르나 트레킹에 허가가 포함되나요?",
        answer:
          "ACAP와 TIMS는 가격에 포함되며 포카라에서 처리합니다. 네팔 비자와 트레킹(래프팅 추가 시 래프팅)을 커버하는 보험은 따로 필요합니다. 어퍼 무스탕은 제한 구역 허가가 추가되며 솔직히 견적합니다.",
      },
      he: {
        question: "אילו היתרים כלולים בטרקי אנאפורנה?",
        answer:
          "ACAP ו-TIMS כלולים במחיר. מטפלים בהם בפוקרה לפני ההליכה. עדיין צריך ויזה לנפאל וביטוח שמכסה טרקים (ורפטינג, אם מוסיפים יום נהר). לאפר מוסטנג יש היתר אזור מוגבל — נצטט אותו בבהירות.",
      },
    },
  },
  {
    sortOrder: 3,
    copy: {
      en: {
        question: "Can I raft after my trek?",
        answer:
          "Yes. A Kaligandaki 1-day is built for a rest day in Pokhara. Add it when you request the trek, or message us after you come down. Two- and three-day gorge trips need extra nights.",
      },
      zh: {
        question: "徒步之后可以漂流吗？",
        answer: "可以。卡利甘达基一日就是为博卡拉休息日准备的。提交徒步请求时勾选，或下山后再联系。两日、三日峡谷需要再住几晚。",
      },
      ko: {
        question: "트레킹 후에 래프팅할 수 있나요?",
        answer:
          "있습니다. 칼리간다키 1일은 포카라 휴식일에 맞춰 있습니다. 트레킹 요청 때 추가하거나 하산 후 연락하세요. 2일·3일 협곡은 밤이 더 필요합니다.",
      },
      he: {
        question: "אפשר לרפט אחרי הטרק?",
        answer:
          "כן. יום אחד בקאליגנדקי בנוי ליום מנוחה בפוקרה. מוסיפים בבקשת הטרק, או כותבים אחרי הירידה. טיולי קניון של יומיים ושלושה דורשים לילות נוספים.",
      },
    },
  },
  {
    sortOrder: 4,
    copy: {
      en: {
        question: "What if I am travelling solo?",
        answer:
          "Solo is normal. We match you to a small departure when we can, or quote a private guide. Rafting has a minimum age and a minimum boat — we will say so plainly.",
      },
      zh: {
        question: "独自旅行可以吗？",
        answer: "很常见。能拼小团就拼，否则报私导价。漂流有最低年龄和最低成船人数，我们会说清楚。",
      },
      ko: {
        question: "혼자 여행해도 되나요?",
        answer: "흔합니다. 가능한 소규모 출발에 맞추거나 프라이빗 가이드를 견적합니다. 래프팅은 최소 연령과 최소 보트가 있으며 솔직히 안내합니다.",
      },
      he: {
        question: "מה אם מטיילים לבד?",
        answer: "סולו זה רגיל. משבצים ליציאה קטנה כשאפשר, או מצטטים מדריך פרטי. לרפטינג יש גיל מינימום וסירה מינימלית — נגיד את זה בבהירות.",
      },
    },
  },
  {
    sortOrder: 5,
    copy: {
      en: {
        question: "When is monsoon, and do you still run?",
        answer:
          "June to early September the high trails are leeches, cloud, and landslide risk. We do not push Circuit or Base Camp then. Some river days still run; we decide week by week.",
      },
      zh: {
        question: "雨季是什么时候？还开团吗？",
        answer: "六月到九月初，高海拔路线有水蛭、云和滑坡风险。那时我们不强推环线或基地营。部分河日仍可能开，按周决定。",
      },
      ko: {
        question: "몬순은 언제이고, 그때도 가나요?",
        answer:
          "6월부터 9월 초까지 고지 트레일은 거머리, 구름, 산사태 위험이 있습니다. 서킷과 베이스캠프는 강권하지 않습니다. 일부 강 일정은 주 단위로 판단합니다.",
      },
      he: {
        question: "מתי המונסון, והאם עדיין יוצאים?",
        answer:
          "יוני עד תחילת ספטמבר השבילים הגבוהים הם עלוקות, ענן וסיכון מפולת. לא דוחפים אז את המעגל או מחנה הבסיס. חלק מימי הנהר עדיין רצים; מחליטים משבוע לשבוע.",
      },
    },
  },
];

const voices: { sortOrder: number; copy: Record<Locale, { quote: string; attribution: string }> }[] = [
  {
    sortOrder: 1,
    copy: {
      en: {
        quote: "They told us the last 400 metres would be slow. They were. We arrived with enough air to look.",
        attribution: "A walker, after Base Camp",
      },
      zh: { quote: "他们说最后四百米会很慢。确实慢。我们到的时候还有气看山。", attribution: "一位走完基地营的人" },
      ko: {
        quote: "마지막 400 m는 느릴 거라고 했습니다. 그랬습니다. 도착해서도 산을 볼 숨이 남았습니다.",
        attribution: "베이스캠프를 마친 걷는 이",
      },
      he: {
        quote: "אמרו שה-400 מטר האחרונים יהיו איטיים. היו. הגענו עם מספיק אוויר להסתכל.",
        attribution: "הולכת, אחרי מחנה הבסיס",
      },
    },
  },
  {
    sortOrder: 2,
    copy: {
      en: {
        quote: "The Kali day after Poon Hill was the right tired. Big water, same company, no extra hotel night wasted.",
        attribution: "A family who stayed on Lakeside",
      },
      zh: {
        quote: "普恩山之后的卡利甘达基一日，累得刚好。大水、同一批人，没有浪费额外酒店晚。",
        attribution: "住在湖畔的一家人",
      },
      ko: {
        quote: "푼힐 다음 칼리 하루가 알맞게 피곤했습니다. 큰 물, 같은 일행, 호텔 하룻밤을 버리지 않았습니다.",
        attribution: "레이크사이드에 머문 가족",
      },
      he: {
        quote: "יום הקאלי אחרי פון היל היה העייפות הנכונה. מים גדולים, אותה חברה, בלי לבזבז ליל מלון נוסף.",
        attribution: "משפחה שנשארה בלייקסייד",
      },
    },
  },
];

const blogPosts = [
  {
    slug: "when-to-walk-annapurna",
    heroImageUrl: IMAGES.annapurna,
    featured: true,
    sortOrder: 1,
    publishedAt: new Date("2026-03-12"),
    copy: {
      en: {
        title: "When to walk the Annapurna",
        excerpt: "October light, April rhododendron, and the months we will not sell you a view.",
        body: "October and November are the classic window: stable skies, cold nights, busy tea houses. March and April bring blossom and a little more haze. We will not pretend monsoon weeks are clear weeks.\n\nWrite us with your dates. A manager in Pokhara will say which trail matches the weather, not a brochure.",
      },
      zh: {
        title: "何时走安纳普尔纳",
        excerpt: "十月的光线、四月的杜鹃，以及我们不会向你推销风景的月份。",
        body: "十月与十一月是经典窗口。三四月有花，也有薄雾。我们不会把雨季说成晴天。\n\n把日期发给博卡拉的经理，我们按天气配路，不按宣传册。",
      },
      ko: {
        title: "안나푸르나를 언제 걸을까",
        excerpt: "10월의 빛, 4월의 철쭉, 그리고 전망을 팔지 않는 달.",
        body: "10–11월이 고전적인 창입니다. 몬순을 맑은 주로 포장하지 않습니다.\n\n날짜를 보내 주세요. 포카라의 매니저가 날씨에 맞는 길을 말합니다.",
      },
      he: {
        title: "מתי ללכת באנאפורנה",
        excerpt: "אור אוקטובר, רודודנדרון באפריל, והחודשים שבהם לא נמכור לכם נוף.",
        body: "אוקטובר ונובמבר הם החלון הקלאסי. לא נעמיד פנים ששבוע מונסון הוא שבוע בהיר.\n\nכתבו תאריכים. מנהל בפוקרה יגיד איזה שביל מתאים למזג האוויר.",
      },
    },
  },
  {
    slug: "tea-houses-after-abc",
    heroImageUrl: IMAGES.poon,
    featured: false,
    sortOrder: 2,
    publishedAt: new Date("2026-02-04"),
    copy: {
      en: {
        title: "What tea houses are actually like",
        excerpt: "Dhal bhat, a wood stove, and a room that is warmer when you keep the door shut.",
        body: "A tea house is a family lodge on the trail. Dinner is almost always dhal bhat. Rooms are simple. Wi-Fi comes and goes. We book lodges we know. If a village is full in October, we say so before you fly.",
      },
      zh: {
        title: "茶馆实际是什么样",
        excerpt: "达尔巴特、柴火炉，以及关上门才更暖的房间。",
        body: "茶馆是路上的家庭旅馆。晚餐几乎总是达尔巴特。我们订熟悉的lodge。十月若某村已满，起飞前就会告诉你。",
      },
      ko: {
        title: "찻집은 실제로 어떤가",
        excerpt: "달바트, 나무 난로, 문을 닫아야 따뜻한 방.",
        body: "찻집은 길 위의 가족 숙소입니다. 아는 롯지를 잡습니다. 10월에 마을이 꽉 차면 출발 전에 말합니다.",
      },
      he: {
        title: "איך בתי תה באמת נראים",
        excerpt: "דאל באט, תנור עצים, וחדר שמתחמם כשסוגרים את הדלת.",
        body: "בית תה הוא לודג' משפחתי על השביל. אנחנו מזמינים לודג'ים שאנחנו מכירים. אם כפר מלא באוקטובר, נגיד לפני הטיסה.",
      },
    },
  },
  {
    slug: "kali-after-the-trek",
    heroImageUrl: IMAGES.kali,
    featured: false,
    sortOrder: 3,
    publishedAt: new Date("2026-01-18"),
    copy: {
      en: {
        title: "A Kaligandaki day after the trek",
        excerpt: "Grade III–IV from Pokhara. The honest rest-day river, not a fake extra night.",
        body: "Most groups have a lake day left. The one-day Kali is the finish we actually recommend. We will refuse a run in flood. If you cannot swim, say so on the bank.",
      },
      zh: {
        title: "徒步之后的卡利甘达基一日",
        excerpt: "从博卡拉出发的 III–IV 级。诚实的休息日河流。",
        body: "多数团队还剩一天湖畔。一日卡利是我们真正推荐的收尾。洪水时我们停漂。",
      },
      ko: {
        title: "트레킹 다음 칼리간다키 하루",
        excerpt: "포카라에서 Grade III–IV. 정직한 휴식일 강.",
        body: "대부분 호숫가 하루가 남습니다. 하루짜리 칼리가 우리가 실제로 권하는 마무리입니다.",
      },
      he: {
        title: "יום קאליגנדקי אחרי הטרק",
        excerpt: "דרגה III–IV מפוקרה. נהר יום המנוחה הכנה.",
        body: "לרוב הקבוצות נשאר יום באגם. יום הקאלי הוא הסיום שאנחנו באמת ממליצים.",
      },
    },
  },
  {
    slug: "permits-from-pokhara",
    heroImageUrl: IMAGES.sarangkot,
    featured: false,
    sortOrder: 4,
    publishedAt: new Date("2025-11-02"),
    copy: {
      en: {
        title: "ACAP and TIMS from Lakeside",
        excerpt: "We organise permits in Pokhara with your passport details. Costs sit in the quote.",
        body: "Annapurna treks need ACAP and usually TIMS. We handle them in town so you are not queuing in Kathmandu the morning you hoped to walk.",
      },
      zh: {
        title: "从湖畔办理 ACAP 与 TIMS",
        excerpt: "我们在博卡拉用护照信息办理许可。费用写在报价里。",
        body: "安纳普尔纳徒步需要 ACAP，通常还有 TIMS。我们在城里办，免得你本该上路的早晨还在加德满都排队。",
      },
      ko: {
        title: "레이크사이드에서 ACAP와 TIMS",
        excerpt: "포카라에서 여권 정보로 허가를 처리합니다. 비용은 견적에 있습니다.",
        body: "안나푸르나 트레킹은 ACAP와 보통 TIMS가 필요합니다. 카트만두에서 줄을 서지 않도록 시내에서 처리합니다.",
      },
      he: {
        title: "ACAP ו־TIMS מלייקסייד",
        excerpt: "אנחנו מארגנים היתרים בפוקרה עם פרטי הדרכון. העלויות בציטוט.",
        body: "טרקי אנאפורנה צריכים ACAP ובדרך כלל TIMS. מטפלים בזה בעיר כדי שלא תעמדו בתור בקטמנדו.",
      },
    },
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.blogPostTranslation.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.trekTranslation.deleteMany();
  await prisma.trek.deleteMany();
  await prisma.faqTranslation.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.testimonialTranslation.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.siteSettingsTranslation.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.mediaAsset.deleteMany();

  await prisma.siteSettings.create({
    data: {
      id: "singleton",
      siteTitle: "Upper Path Treks And Tours",
      logoUrl: "/logo.png",
      faviconUrl: null,
      whatsapp: "9779867687188",
      viber: "9779856030972",
      email: "hello@annapurnatrails.com",
      wechatId: "AnnapurnaTrailsPKR",
      wechatQrUrl: null,
      address: "Lakeside, Pokhara-6, Kaski, Nepal",
      phone: "+977 9856030972",
      trekkerCount: 2400,
      yearsGuiding: 12,
      heroPosterUrl: "/heroes/hero-poster.jpg",
      heroVideoUrl: "/heroes/hero.mp4",
      aboutHeroUrl: "https://images.unsplash.com/photo-1706187975952-33765f844667?auto=format&fit=crop&w=2000&q=80",
      associations: DEFAULT_ASSOCIATIONS as unknown as Prisma.InputJsonValue,
      chips: DEFAULT_CHIPS as unknown as Prisma.InputJsonValue,
      translations: {
        create: (Object.keys(settingsCopy) as Locale[]).map((locale) => {
          const pages = pagesFromLocale(locale);
          return {
            locale,
            tagline: pages.tagline,
            heroHeadline: pages["hero.headline"] || settingsCopy[locale].heroHeadline,
            heroSubhead: pages["hero.lede"] || settingsCopy[locale].heroSubhead,
            introTitle: pages["intro.title"],
            introBody: pages["intro.body"],
            aboutTitle: pages["about.title"],
            aboutBody: pages["about.body"],
            pages: pages as unknown as Prisma.InputJsonValue,
          };
        }),
      },
    },
  });

  for (const trek of [...treks, ...rafts, ...activities, ...safaris]) {
    const kind = trek.kind ?? "trek";
    await prisma.trek.create({
      data: {
        slug: trek.slug,
        kind,
        durationDays: trek.durationDays,
        difficulty: trek.difficulty,
        maxAltitudeM: trek.maxAltitudeM,
        priceFromUsd: trek.priceFromUsd,
        season: trek.season,
        heroImageUrl: trek.heroImageUrl,
        gallery: IMAGES.gallery,
        featured: trek.featured,
        published: true,
        sortOrder: trek.sortOrder,
        inclusions: trek.inclusions ?? TREK_INCLUSIONS,
        exclusions: trek.exclusions ?? TREK_EXCLUSIONS,
        bestMonths: trek.bestMonths ?? MONTHS_TREK,
        river: trek.river,
        grade: trek.grade,
        minAge: trek.minAge,
        altitudeProfile: (trek.altitudeProfile ?? []) as unknown as Prisma.InputJsonValue,
        translations: {
          create: (Object.keys(trek.copy) as Locale[]).map((locale) => ({
            locale,
            name: trek.copy[locale].name,
            summary: trek.copy[locale].summary,
            description: trek.copy[locale].description,
            itinerary: trek.copy[locale].itinerary as unknown as Prisma.InputJsonValue,
            seasonLabel: trek.copy[locale].seasonLabel,
            difficultyLabel: trek.copy[locale].difficultyLabel,
          })),
        },
      },
    });
  }

  for (const faq of faqs) {
    await prisma.faq.create({
      data: {
        sortOrder: faq.sortOrder,
        translations: {
          create: (Object.keys(faq.copy) as Locale[]).map((locale) => ({
            locale,
            question: faq.copy[locale].question,
            answer: faq.copy[locale].answer,
          })),
        },
      },
    });
  }

  for (const v of voices) {
    await prisma.testimonial.create({
      data: {
        sortOrder: v.sortOrder,
        translations: {
          create: (Object.keys(v.copy) as Locale[]).map((locale) => ({
            locale,
            quote: v.copy[locale].quote,
            attribution: v.copy[locale].attribution,
          })),
        },
      },
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        heroImageUrl: post.heroImageUrl,
        featured: post.featured,
        published: true,
        publishedAt: post.publishedAt,
        sortOrder: post.sortOrder,
        translations: {
          create: (Object.keys(post.copy) as Locale[]).map((locale) => ({
            locale,
            title: post.copy[locale].title,
            excerpt: post.copy[locale].excerpt,
            body: post.copy[locale].body,
          })),
        },
      },
    });
  }

  console.log(
    `Seeded Upper Path Treks And Tours: ${treks.length} treks + ${rafts.length} rafting + ${activities.length} activities + ${safaris.length} safaris + ${blogPosts.length} posts + FAQs`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
