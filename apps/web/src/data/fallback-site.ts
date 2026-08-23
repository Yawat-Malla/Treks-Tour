import type { Faq, PublicPayload, SiteSettings, Testimonial, Trip } from "@/lib/api";

const IMAGES = {
  abc: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80",
  circuit: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  poon: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
  mardi: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80",
  khopra: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2000&q=80",
  seti: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=2000&q=80",
  canyon: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80",
  kali: "https://images.unsplash.com/photo-1432405972618-c60b0225b8c9?auto=format&fit=crop&w=2000&q=80",
};

const GALLERY = [
  "https://images.unsplash.com/photo-1585011664462-e74e51d7c0e6?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1400&q=80",
];

type Copy = { name: string; summary: string; description: string; seasonLabel: string; difficultyLabel: string };

const SETTINGS: Record<string, Pick<SiteSettings, "tagline" | "heroHeadline" | "heroSubhead" | "introTitle" | "introBody" | "aboutTitle" | "aboutBody">> = {
  en: {
    tagline: "Guided treks from Pokhara into the Annapurna Himalaya",
    heroHeadline: "Walk the Annapurna.\nSleep under a Himalayan sky.",
    heroSubhead: "A Nepali company based in Pokhara. Small groups, honest pacing, and a booking that does not ask you to create an account.",
    introTitle: "The range, from the lake.",
    introBody: "We plan, permit, and guide Annapurna treks from Lakeside, Pokhara. You choose the trail. We handle the rest — tea houses, porters, TIMS, ACAP, and the quiet logistics that make a high path feel simple.",
    aboutTitle: "Pokhara is home. The Annapurna is the work.",
    aboutBody: "Annapurna Trails is a locally owned trekking company in Pokhara-6, Lakeside. Our guides grew up on these paths. We run small departures, speak plainly about weather and fitness, and stay reachable on WhatsApp, Viber, WeChat, and email — before you walk and after you come down.",
  },
  zh: {
    tagline: "从博卡拉出发，由向导带领走进安纳普尔纳雪山",
    heroHeadline: "走进安纳普尔纳。\n枕着喜马拉雅的夜空入眠。",
    heroSubhead: "尼泊尔本土公司，位于博卡拉。小团队、诚实的配速；预订无需注册账号。",
    introTitle: "从湖畔出发，走向整座山脉。",
    introBody: "我们在博卡拉湖畔安排安纳普尔纳徒步：路线、许可、茶馆、背夫、TIMS 与 ACAP。你选路，其余交给我们，让高海拔的路走起来更从容。",
    aboutTitle: "博卡拉是家，安纳普尔纳是工作。",
    aboutBody: "Annapurna Trails 是博卡拉湖畔的本地徒步公司。向导在这些山路上长大。我们坚持小团队出发，如实说明天气与体能要求，并在 WhatsApp、Viber、微信和邮件上随时可及——出发前与下山后都一样。",
  },
  ko: {
    tagline: "포카라에서 출발하는 안나푸르나 가이드 트레킹",
    heroHeadline: "안나푸르나를 걷고,\n히말라야 하늘 아래 잠드세요.",
    heroSubhead: "포카라에 있는 네팔 현지 회사입니다. 소규모 그룹, 정직한 페이스. 예약에 계정 만들기는 필요 없습니다.",
    introTitle: "호숫가에서 산맥으로.",
    introBody: "포카라 레이크사이드에서 안나푸르나 트레킹을 기획하고 허가와 가이드를 맡습니다. 찻집, 포터, TIMS, ACAP까지 — 고지대 길이 단순해지도록 나머지를 우리가 챙깁니다.",
    aboutTitle: "포카라는 집, 안나푸르나는 일.",
    aboutBody: "Annapurna Trails는 포카라 레이크사이드의 현지 트레킹 회사입니다. 가이드는 이 길에서 자랐습니다. 소규모로 출발하고, 날씨와 체력을 솔직히 말하며, WhatsApp·Viber·WeChat·이메일로 언제든 닿을 수 있습니다.",
  },
  he: {
    tagline: "טרקים מודרכים מפוקרה אל הימלאיה של אנאפורנה",
    heroHeadline: "ללכת באנאפורנה.\nלישון תחת שמי הימלאיה.",
    heroSubhead: "חברה נפאלית מפוקרה. קבוצות קטנות, קצב כנה, והזמנה בלי לפתוח חשבון.",
    introTitle: "מהאגם אל הרכס.",
    introBody: "אנחנו מתכננים, מארגנים היתרים ומדריכים טרקי אנאפורנה מלייקסייד, פוקרה. אתם בוחרים שביל. אנחנו מטפלים בשאר.",
    aboutTitle: "פוקרה היא בית. אנאפורנה היא העבודה.",
    aboutBody: "Annapurna Trails היא חברת טרקים בבעלות מקומית בלייקסייד. המדריכים גדלו על השבילים האלה.",
  },
};

const CATALOG: {
  slug: string;
  kind: "trek" | "rafting";
  durationDays: number;
  difficulty: string;
  maxAltitudeM: number;
  priceFromUsd: number;
  season: string;
  heroImageUrl: string;
  featured: boolean;
  river: string | null;
  grade: string | null;
  minAge: number | null;
  copy: Record<string, Copy>;
}[] = [
  {
    slug: "annapurna-base-camp",
    kind: "trek",
    durationDays: 11,
    difficulty: "moderate",
    maxAltitudeM: 4130,
    priceFromUsd: 890,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.abc,
    featured: true,
    river: null,
    grade: null,
    minAge: null,
    copy: {
      en: { name: "Annapurna Base Camp", summary: "The sanctuary walk: rhododendron forest to a 4,130 m amphitheatre of ice.", description: "Annapurna Base Camp is the classic close-up of the range. From Pokhara you rise through Gurung villages into a high glacial bowl. Nights are in tea houses. Days are honest but not technical.", seasonLabel: "March–May & September–November", difficultyLabel: "Moderate" },
      zh: { name: "安纳普尔纳基地营", summary: "圣域之行：从杜鹃花林走到海拔 4,130 米的冰雪剧场。", description: "安纳普尔纳基地营是近距离看见这片雪山的经典线路。夜宿茶馆，行程扎实但不涉及技术攀登。", seasonLabel: "三月至五月、九月至十一月", difficultyLabel: "中等" },
      ko: { name: "안나푸르나 베이스캠프", summary: "성역으로 걷는 길: 진달래 숲에서 4,130m 얼음 원형극장까지.", description: "안나푸르나 베이스캠프는 산맥을 가까이 보는 고전 코스입니다. 찻집에서 자고, 기술적 등반은 없습니다.", seasonLabel: "3–5월, 9–11월", difficultyLabel: "보통" },
      he: { name: "מחנה הבסיס של אנאפורנה", summary: "הליכה למקדש: יער רודודנדרון עד אמפיתיאטרון קרח ב-4,130 מ'.", description: "מחנה הבסיס הוא המבט הקלאסי על הרכס. לילות בבתי תה. ימים כנים אבל לא טכניים.", seasonLabel: "מרץ–מאי וספטמבר–נובמבר", difficultyLabel: "בינוני" },
    },
  },
  {
    slug: "annapurna-circuit",
    kind: "trek",
    durationDays: 16,
    difficulty: "challenging",
    maxAltitudeM: 5416,
    priceFromUsd: 1490,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.circuit,
    featured: true,
    river: null,
    grade: null,
    minAge: null,
    copy: {
      en: { name: "Annapurna Circuit", summary: "A full circling of the massif, crossing Thorong La at 5,416 m.", description: "The Circuit remains the great horseshoe of Nepal trekking, run with real acclimatisation days in Manang — not as a race to the pass.", seasonLabel: "March–May & September–November", difficultyLabel: "Challenging" },
      zh: { name: "安纳普尔纳环线", summary: "环绕整座雪山，翻越海拔 5,416 米的托隆山口。", description: "环线仍是尼泊尔徒步里那条壮阔的马蹄形。我们在马南安排真正的适应日。", seasonLabel: "三月至五月、九月至十一月", difficultyLabel: "挑战" },
      ko: { name: "안나푸르나 서킷", summary: "토롱 라 5,416m를 넘는 산맥 한 바퀴.", description: "서킷은 네팔 트레킹의 큰 말굽입니다. 마낭에서 진짜 적응일을 둡니다.", seasonLabel: "3–5월, 9–11월", difficultyLabel: "도전" },
      he: { name: "מעגל אנאפורנה", summary: "הקפה מלאה של הרכס, מעבר תורונג לה ב-5,416 מ'.", description: "המעגל נשאר פרסת הטרקים של נפאל, עם ימי אקלום אמיתיים במנאנג.", seasonLabel: "מרץ–מאי וספטמבר–נובמבר", difficultyLabel: "מאתגר" },
    },
  },
  {
    slug: "ghorepani-poon-hill",
    kind: "trek",
    durationDays: 4,
    difficulty: "moderate",
    maxAltitudeM: 3210,
    priceFromUsd: 390,
    season: "Oct–May",
    heroImageUrl: IMAGES.poon,
    featured: true,
    river: null,
    grade: null,
    minAge: null,
    copy: {
      en: { name: "Ghorepani Poon Hill", summary: "A short, steep holiday: rhododendron and a dawn over Dhaulagiri.", description: "Poon Hill is the rest-day trek from Pokhara — steep, short, and honest about stairs.", seasonLabel: "October–May", difficultyLabel: "Moderate" },
      zh: { name: "戈勒帕尼 · 普恩山", summary: "短而陡的假期：杜鹃花，以及道拉吉里的黎明。", description: "普恩山是从博卡拉出发的休息日徒步——陡、短、台阶如实。", seasonLabel: "十月至五月", difficultyLabel: "中等" },
      ko: { name: "고레파니 푼힐", summary: "짧고 가파른 휴가: 진달래와 다울라기리 새벽.", description: "푼힐은 포카라에서 떠나는 휴식 트레킹입니다.", seasonLabel: "10–5월", difficultyLabel: "보통" },
      he: { name: "גורפאני פון היל", summary: "חופשה קצרה ותלולה: רודודנדרון וזריחה מעל דהאולגירי.", description: "פון היל הוא טרק יום המנוחה מפוקרה.", seasonLabel: "אוקטובר–מאי", difficultyLabel: "בינוני" },
    },
  },
  {
    slug: "mardi-himal",
    kind: "trek",
    durationDays: 6,
    difficulty: "moderate",
    maxAltitudeM: 4500,
    priceFromUsd: 620,
    season: "Mar–May, Oct–Nov",
    heroImageUrl: IMAGES.mardi,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: {
      en: { name: "Mardi Himal", summary: "A quieter ridge toward Machhapuchhre, high camp above the cloud.", description: "Mardi is the close, quieter alternative to Base Camp — a ridge walk with Machhapuchhre filling the sky.", seasonLabel: "March–May & October–November", difficultyLabel: "Moderate" },
      zh: { name: "马尔迪喜马拉", summary: "通往鱼尾峰的安静山脊，云上的高营地。", description: "马尔迪是基地营更安静的近距离替代：山脊上，鱼尾峰占满天空。", seasonLabel: "三月至五月、十月至十一月", difficultyLabel: "中等" },
      ko: { name: "마르디 히말", summary: "마차푸치레를 향한 한적한 능선, 구름 위 하이캠프.", description: "마르디는 베이스캠프의 더 조용한 대안입니다.", seasonLabel: "3–5월, 10–11월", difficultyLabel: "보통" },
      he: { name: "מארדי הימאל", summary: "רכס שקט לכיוון מצ'פוצ'רה, מחנה גבוה מעל הענן.", description: "מארדי הוא החלופה השקטה למחנה הבסיס.", seasonLabel: "מרץ–מאי ואוקטובר–נובמבר", difficultyLabel: "בינוני" },
    },
  },
  {
    slug: "khopra-ridge",
    kind: "trek",
    durationDays: 8,
    difficulty: "moderate",
    maxAltitudeM: 3660,
    priceFromUsd: 780,
    season: "Mar–May, Oct–Nov",
    heroImageUrl: IMAGES.khopra,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: {
      en: { name: "Khopra Ridge", summary: "Community lodges, Dhaulagiri close, fewer people than ABC.", description: "Khopra is a community-lodge ridge with Dhaulagiri filling the west window.", seasonLabel: "March–May & October–November", difficultyLabel: "Moderate" },
      zh: { name: "霍普拉山脊", summary: "社区旅舍，道拉吉里近在眼前，人比基地营少。", description: "霍普拉是社区旅舍山脊，西窗里是道拉吉里。", seasonLabel: "三月至五月、十月至十一月", difficultyLabel: "中等" },
      ko: { name: "코프라 릿지", summary: "커뮤니티 롯지, 가까운 다울라기리, ABC보다 한산합니다.", description: "코프라는 커뮤니티 롯지 능선입니다.", seasonLabel: "3–5월, 10–11월", difficultyLabel: "보통" },
      he: { name: "רכס חופרה", summary: "לודג'ים קהילתיים, דהאולגירי קרוב, פחות אנשים מ-ABC.", description: "חופרה הוא רכס לודג'ים קהילתיים.", seasonLabel: "מרץ–מאי ואוקטובר–נובמבר", difficultyLabel: "בינוני" },
    },
  },
  {
    slug: "seti-river-day",
    kind: "rafting",
    durationDays: 1,
    difficulty: "easy",
    maxAltitudeM: 800,
    priceFromUsd: 89,
    season: "Sep–Jun",
    heroImageUrl: IMAGES.seti,
    featured: true,
    river: "Seti",
    grade: "II–III",
    minAge: 12,
    copy: {
      en: { name: "Seti River day", summary: "The Pokhara river day: limestone canyon, warm water, back at the lake by late afternoon.", description: "Seti is Grade II–III from Lakeside. Breakfast out, dinner back in Pokhara.", seasonLabel: "September–June", difficultyLabel: "Gentle–spirited" },
      zh: { name: "塞蒂河一日", summary: "博卡拉的漂流日：石灰岩峡谷，温水，傍晚回到湖畔。", description: "塞蒂河为 II–III 级，从湖畔出发，晚饭回家。", seasonLabel: "九月至六月", difficultyLabel: "轻松有活力" },
      ko: { name: "세티 강 하루", summary: "포카라 강 하루: 석회암 협곡, 따뜻한 물, 오후 늦게 호수로.", description: "세티는 레이크사이드에서 Grade II–III.", seasonLabel: "9–6월", difficultyLabel: "완만하고 활기참" },
      he: { name: "יום נהר סטי", summary: "יום הנהר של פוקרה: קניון גיר, מים חמים, חזרה לאגם אחר הצהריים.", description: "סטי הוא דרגה II–III מלייקסייד.", seasonLabel: "ספטמבר–יוני", difficultyLabel: "עדין–ערני" },
    },
  },
  {
    slug: "upper-seti-canyon",
    kind: "rafting",
    durationDays: 1,
    difficulty: "moderate",
    maxAltitudeM: 850,
    priceFromUsd: 129,
    season: "Sep–Jun",
    heroImageUrl: IMAGES.canyon,
    featured: false,
    river: "Seti",
    grade: "III",
    minAge: 14,
    copy: {
      en: { name: "Upper Seti canyon", summary: "A punchier Seti line in a tighter limestone gorge.", description: "Same river, steeper walls, a fuller day on the water.", seasonLabel: "September–June", difficultyLabel: "Spirited" },
      zh: { name: "上塞蒂峡谷", summary: "更窄石灰岩峡谷里更猛的塞蒂河线路。", description: "同一条河，峡谷更窄，水上的一天更满。", seasonLabel: "九月至六月", difficultyLabel: "有劲" },
      ko: { name: "어퍼 세티 캐니언", summary: "더 좁은 석회암 협곡의 세티 라인.", description: "같은 강, 더 가파른 벽.", seasonLabel: "9–6월", difficultyLabel: "활기참" },
      he: { name: "קניון סטי עליון", summary: "קו סטי חד יותר בקניון גיר צר.", description: "אותו נהר, קירות תלולים יותר.", seasonLabel: "ספטמבר–יוני", difficultyLabel: "ערני" },
    },
  },
  {
    slug: "kaligandaki-gorge",
    kind: "rafting",
    durationDays: 3,
    difficulty: "challenging",
    maxAltitudeM: 1200,
    priceFromUsd: 390,
    season: "Sep–Nov, Mar–May",
    heroImageUrl: IMAGES.kali,
    featured: true,
    river: "Kaligandaki",
    grade: "III–IV",
    minAge: 16,
    copy: {
      en: { name: "Kali Gandaki gorge", summary: "The deeper gorge: multi-day whitewater for guests who came for river first.", description: "Kaligandaki is punchier than the Seti. Helmet and PFD on everyone. We refuse a flood run.", seasonLabel: "September–November & March–May", difficultyLabel: "Challenging" },
      zh: { name: "卡利甘达基峡谷", summary: "更深的峡谷：为先来玩水的客人准备的多日漂流。", description: "卡利甘达基比塞蒂河更猛。全员头盔与救生衣。洪水时停漂。", seasonLabel: "九月至十一月、三月至五月", difficultyLabel: "挑战" },
      ko: { name: "칼리 간다키 협곡", summary: "더 깊은 협곡: 강을 먼저 온 손님을 위한 며칠 래프팅.", description: "칼리간다키는 세티보다 셉니다.", seasonLabel: "9–11월, 3–5월", difficultyLabel: "도전" },
      he: { name: "קניון קאלי גנדקי", summary: "הקניון העמוק: רפטינג של כמה ימים למי שבא בשביל הנהר.", description: "קאליגנדקי חד יותר מהסטי.", seasonLabel: "ספטמבר–נובמבר ומרץ–מאי", difficultyLabel: "מאתגר" },
    },
  },
];

const FAQS: Record<string, Faq[]> = {
  en: [
    { id: "faq-1", question: "Do I need an account to book?", answer: "No. You send dates and a phone number. A manager in Pokhara replies." },
    { id: "faq-2", question: "What permits are included?", answer: "We organise ACAP and TIMS in Pokhara with your passport details. Costs sit in the quote." },
    { id: "faq-3", question: "Can I raft after my trek?", answer: "Yes. A Seti day is the classic Lakeside add-on after Base Camp or Poon Hill." },
  ],
  zh: [
    { id: "faq-1", question: "预订需要注册账号吗？", answer: "不需要。你提交日期和电话，博卡拉的经理回复。" },
    { id: "faq-2", question: "包含哪些许可？", answer: "我们在博卡拉凭护照信息代办 ACAP 与 TIMS。费用写在报价里。" },
    { id: "faq-3", question: "徒步后可以漂流吗？", answer: "可以。塞蒂河一日是基地营或普恩山之后的经典湖畔加项。" },
  ],
  ko: [
    { id: "faq-1", question: "예약에 계정이 필요하나요?", answer: "없습니다. 날짜와 전화만 보내면 포카라 매니저가 답합니다." },
    { id: "faq-2", question: "허가는 포함되나요?", answer: "여권 정보로 포카라에서 ACAP와 TIMS를 처리합니다. 비용은 견적에 있습니다." },
    { id: "faq-3", question: "트레킹 후 래프팅할 수 있나요?", answer: "네. 세티 하루는 베이스캠프나 푼힐 뒤의 전형적인 레이크사이드 추가입니다." },
  ],
  he: [
    { id: "faq-1", question: "צריך חשבון כדי להזמין?", answer: "לא. שולחים תאריכים ומספר טלפון. מנהל בפוקרה עונה." },
    { id: "faq-2", question: "אילו היתרים כלולים?", answer: "אנחנו מארגנים ACAP ו-TIMS בפוקרה עם פרטי הדרכון." },
    { id: "faq-3", question: "אפשר לרפט אחרי הטרק?", answer: "כן. יום סטי הוא התוספת הקלאסית אחרי מחנה בסיס או פון היל." },
  ],
};

const VOICES: Record<string, Testimonial[]> = {
  en: [{ id: "v1", quote: "They paced ABC so I could actually look at the sanctuary.", attribution: "A walker who finished Base Camp" }],
  zh: [{ id: "v1", quote: "他们把基地营的节奏放慢，我才能真正看见圣域。", attribution: "走完基地营的人" }],
  ko: [{ id: "v1", quote: "베이스캠프 페이스를 맞춰 줘서 성역을 실제로 볼 수 있었습니다.", attribution: "베이스캠프를 마친 사람" }],
  he: [{ id: "v1", quote: "הם התאימו את הקצב ב-ABC כדי שבאמת אוכל להסתכל על המקדש.", attribution: "הולך שסיים את מחנה הבסיס" }],
};

function tripFromCatalog(row: (typeof CATALOG)[number], locale: string): Trip {
  const copy = row.copy[locale] || row.copy.en;
  return {
    id: row.slug,
    slug: row.slug,
    kind: row.kind,
    durationDays: row.durationDays,
    difficulty: row.difficulty,
    maxAltitudeM: row.maxAltitudeM,
    priceFromUsd: row.priceFromUsd,
    season: row.season,
    heroImageUrl: row.heroImageUrl,
    gallery: GALLERY,
    featured: row.featured,
    inclusions: [],
    exclusions: [],
    bestMonths: [],
    river: row.river,
    grade: row.grade,
    minAge: row.minAge,
    altitudeProfile: [],
    itinerary: [],
    name: copy.name,
    summary: copy.summary,
    description: copy.description,
    seasonLabel: copy.seasonLabel,
    difficultyLabel: copy.difficultyLabel,
  };
}

export function fallbackPublic(locale: string): PublicPayload {
  const loc = SETTINGS[locale] ? locale : "en";
  const settings: SiteSettings = {
    siteTitle: "Annapurna Trails",
    logoUrl: null,
    faviconUrl: null,
    whatsapp: "9779801234567",
    viber: "9779801234567",
    email: "hello@annapurnatrails.com",
    wechatId: "AnnapurnaTrailsPKR",
    wechatQrUrl: null,
    address: "Lakeside, Pokhara-6, Kaski, Nepal",
    phone: "+977 61-466100",
    trekkerCount: 2400,
    yearsGuiding: 12,
    ...SETTINGS[loc],
  };
  const trips = CATALOG.map((row) => tripFromCatalog(row, loc));
  return {
    settings,
    treks: trips.filter((t) => t.kind === "trek"),
    rafting: trips.filter((t) => t.kind === "rafting"),
    trips,
    faqs: FAQS[loc] || FAQS.en,
    testimonials: VOICES[loc] || VOICES.en,
  };
}

export function fallbackTrek(slug: string, locale: string) {
  const row = CATALOG.find((t) => t.slug === slug);
  if (!row) return null;
  const loc = SETTINGS[locale] ? locale : "en";
  const data = fallbackPublic(loc);
  return { settings: data.settings, trek: tripFromCatalog(row, loc), trips: data.trips };
}
