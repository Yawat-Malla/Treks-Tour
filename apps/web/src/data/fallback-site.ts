import type { Faq, PublicPayload, SiteSettings, Testimonial, Trip } from "@/lib/api";

const IMAGES = {
  abc: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80",
  circuit: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  poon: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
  mardi: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80",
  khopra: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2000&q=80",
  dhampus: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=2000&q=80",
  sarangkot: "https://images.unsplash.com/photo-1706187975952-33765f844667?auto=format&fit=crop&w=2000&q=80",
  panchase: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80",
  ghandruk: "https://images.unsplash.com/photo-1585011664462-e74e51d7c0e6?auto=format&fit=crop&w=2000&q=80",
  sikles: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=2000&q=80",
  kuri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  mohare: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
  mustang: "https://images.unsplash.com/photo-1589182373726-eaa9cdae5a3a?auto=format&fit=crop&w=2000&q=80",
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
    aboutBody: "Upper Path Treks And Tours is a locally owned trekking company in Pokhara-6, Lakeside. Our guides grew up on these paths. We run small departures, speak plainly about weather and fitness, and stay reachable on WhatsApp, Viber, WeChat, and email — before you walk and after you come down.",
  },
  zh: {
    tagline: "从博卡拉出发，由向导带领走进安纳普尔纳雪山",
    heroHeadline: "走进安纳普尔纳。\n枕着喜马拉雅的夜空入眠。",
    heroSubhead: "尼泊尔本土公司，位于博卡拉。小团队、诚实的配速；预订无需注册账号。",
    introTitle: "从湖畔出发，走向整座山脉。",
    introBody: "我们在博卡拉湖畔安排安纳普尔纳徒步：路线、许可、茶馆、背夫、TIMS 与 ACAP。你选路，其余交给我们，让高海拔的路走起来更从容。",
    aboutTitle: "博卡拉是家，安纳普尔纳是工作。",
    aboutBody: "Upper Path Treks And Tours 是博卡拉湖畔的本地徒步公司。向导在这些山路上长大。我们坚持小团队出发，如实说明天气与体能要求，并在 WhatsApp、Viber、微信和邮件上随时可及——出发前与下山后都一样。",
  },
  ko: {
    tagline: "포카라에서 출발하는 안나푸르나 가이드 트레킹",
    heroHeadline: "안나푸르나를 걷고,\n히말라야 하늘 아래 잠드세요.",
    heroSubhead: "포카라에 있는 네팔 현지 회사입니다. 소규모 그룹, 정직한 페이스. 예약에 계정 만들기는 필요 없습니다.",
    introTitle: "호숫가에서 산맥으로.",
    introBody: "포카라 레이크사이드에서 안나푸르나 트레킹을 기획하고 허가와 가이드를 맡습니다. 찻집, 포터, TIMS, ACAP까지 — 고지대 길이 단순해지도록 나머지를 우리가 챙깁니다.",
    aboutTitle: "포카라는 집, 안나푸르나는 일.",
    aboutBody: "Upper Path Treks And Tours는 포카라 레이크사이드의 현지 트레킹 회사입니다. 가이드는 이 길에서 자랐습니다. 소규모로 출발하고, 날씨와 체력을 솔직히 말하며, WhatsApp·Viber·WeChat·이메일로 언제든 닿을 수 있습니다.",
  },
  he: {
    tagline: "טרקים מודרכים מפוקרה אל הימלאיה של אנאפורנה",
    heroHeadline: "ללכת באנאפורנה.\nלישון תחת שמי הימלאיה.",
    heroSubhead: "חברה נפאלית מפוקרה. קבוצות קטנות, קצב כנה, והזמנה בלי לפתוח חשבון.",
    introTitle: "מהאגם אל הרכס.",
    introBody: "אנחנו מתכננים, מארגנים היתרים ומדריכים טרקי אנאפורנה מלייקסייד, פוקרה. אתם בוחרים שביל. אנחנו מטפלים בשאר.",
    aboutTitle: "פוקרה היא בית. אנאפורנה היא העבודה.",
    aboutBody: "Upper Path Treks And Tours היא חברת טרקים בבעלות מקומית בלייקסייד. המדריכים גדלו על השבילים האלה.",
  },
};

function c(
  en: Copy,
  zh: Copy,
  ko: Copy,
  he: Copy,
): Record<string, Copy> {
  return { en, zh, ko, he };
}

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
    slug: "australian-camp-dhampus",
    kind: "trek",
    durationDays: 2,
    difficulty: "easy",
    maxAltitudeM: 2060,
    priceFromUsd: 149,
    season: "Oct–May",
    heroImageUrl: IMAGES.dhampus,
    featured: true,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Australian Camp & Dhampus", summary: "Drive to Kande, then a short ridge walk to Machhapuchhre and Annapurna South. Sleep in Dhampus.", description: "The closest honest overnight from Pokhara. Stairs, not altitude. Good after a long flight or before a bigger trek.", seasonLabel: "October–May", difficultyLabel: "Easy" },
      { name: "澳大利亚营地与丹普斯", summary: "车至坎德，再沿山脊短走，看鱼尾峰与安纳普尔纳南峰。夜宿丹普斯。", description: "从博卡拉出发最近的诚实过夜。是台阶，不是高海拔。", seasonLabel: "十月至五月", difficultyLabel: "轻松" },
      { name: "오스트레일리안 캠프 · 담푸스", summary: "칸데까지 이동 후 짧은 능선 트레킹. 마차푸치레와 안나푸르나 사우스. 담푸스에서 잡니다.", description: "포카라에서 가장 가까운 정직한 1박. 고도가 아니라 계단입니다.", seasonLabel: "10–5월", difficultyLabel: "쉬움" },
      { name: "אוסטרליאן קמפ ודהמפוס", summary: "נסיעה לקאנדה והליכת רכס קצרה אל מצ'פוצ'רה ואנאפורנה דרום. לנים בדהמפוס.", description: "לילה כנה וקרוב מפוקרה. מדרגות, לא גובה.", seasonLabel: "אוקטובר–מאי", difficultyLabel: "קל" },
    ),
  },
  {
    slug: "sarangkot-naudanda",
    kind: "trek",
    durationDays: 1,
    difficulty: "easy",
    maxAltitudeM: 1600,
    priceFromUsd: 79,
    season: "Oct–May",
    heroImageUrl: IMAGES.sarangkot,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Sarangkot & Naudanda", summary: "Valley, Phewa, and the range in one day. Often paired with a paraglide off Sarangkot.", description: "A short, steep day above Pokhara. Paragliding is optional and quoted separately.", seasonLabel: "October–May", difficultyLabel: "Easy" },
      { name: "萨朗科特与瑙丹达", summary: "一日看河谷、费瓦湖与雪山。常与萨朗科特滑翔伞组合。", description: "博卡拉上方短而陡的一天。滑翔伞可选、另报价。", seasonLabel: "十月至五月", difficultyLabel: "轻松" },
      { name: "사랑콧 · 나우단다", summary: "하루에 계곡, 페와 호수, 산맥. 사랑콧 패러글라이딩과 자주 짝을 이룹니다.", description: "포카라 위의 짧고 가파른 하루. 패러글라이딩은 선택이며 따로 견적합니다.", seasonLabel: "10–5월", difficultyLabel: "쉬움" },
      { name: "סארנקוט ונאודנדה", summary: "עמק, פאווה והרכס ביום אחד. לעיתים עם מצנח רחיפה מסארנקוט.", description: "יום קצר ותלול מעל פוקרה. מצנח רחיפה אופציונלי ומתומחר בנפרד.", seasonLabel: "אוקטובר–מאי", difficultyLabel: "קל" },
    ),
  },
  {
    slug: "panchase",
    kind: "trek",
    durationDays: 3,
    difficulty: "easy",
    maxAltitudeM: 2500,
    priceFromUsd: 190,
    season: "Oct–May",
    heroImageUrl: IMAGES.panchase,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Panchase", summary: "Oak and rhododendron, Gurung villages, Dhaulagiri and Annapurna from a 2,500 m ridge.", description: "The quiet three-day loop west of Pokhara. Forest, ridge, and village lodges rather than high tea-house traffic.", seasonLabel: "October–May", difficultyLabel: "Easy" },
      { name: "潘查塞", summary: "橡树与杜鹃、古隆村落，从 2,500 米山脊看道拉吉里与安纳普尔纳。", description: "博卡拉以西安静的三日环线。森林、山脊、村落旅舍。", seasonLabel: "十月至五月", difficultyLabel: "轻松" },
      { name: "판차세", summary: "참나무와 진달래, 구룽 마을, 2,500 m 능선에서 다울라기리와 안나푸르나.", description: "포카라 서쪽의 한적한 3일 루프. 숲, 능선, 마을 롯지.", seasonLabel: "10–5월", difficultyLabel: "쉬움" },
      { name: "פאנצ'אסה", summary: "אלון ורודודנדרון, כפרי גורונג, דהאולגירי ואנאפורנה מרכס 2,500 מ'.", description: "לולאה שקטה ממערב לפוקרה. יער, רכס ולודג'ים בכפר.", seasonLabel: "אוקטובר–מאי", difficultyLabel: "קל" },
    ),
  },
  {
    slug: "ghandruk-village",
    kind: "trek",
    durationDays: 3,
    difficulty: "easy",
    maxAltitudeM: 1940,
    priceFromUsd: 220,
    season: "Oct–May",
    heroImageUrl: IMAGES.ghandruk,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Ghandruk village", summary: "Stone houses, a Gurung museum, and close mountain views without a high pass.", description: "Two nights in the stone Gurung village so you can walk the lanes and look at Annapurna South without a 4,000 m morning.", seasonLabel: "October–May", difficultyLabel: "Easy" },
      { name: "甘德鲁克村落", summary: "石屋、古隆博物馆，近距离看山，无需翻山口。", description: "两晚石村，走石巷、看博物馆，近看南峰与鱼尾峰。", seasonLabel: "十月至五月", difficultyLabel: "轻松" },
      { name: "간드룩 마을", summary: "돌집, 구룽 박물관, 높은 고개 없이 가까운 산 전망.", description: "이틀 밤을 주어 골목과 박물관, 안나푸르나 사우스를 봅니다.", seasonLabel: "10–5월", difficultyLabel: "쉬움" },
      { name: "כפר גנאדרוק", summary: "בתי אבן, מוזיאון גורונג, ונוף הרים קרוב בלי מעבר גבוה.", description: "שני לילות בסמטאות ובמוזיאון, בלי בוקר של 4,000 מ'.", seasonLabel: "אוקטובר–מאי", difficultyLabel: "קל" },
    ),
  },
  {
    slug: "sikles",
    kind: "trek",
    durationDays: 4,
    difficulty: "easy",
    maxAltitudeM: 2000,
    priceFromUsd: 280,
    season: "Oct–May",
    heroImageUrl: IMAGES.sikles,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Sikles", summary: "A Gurung village north of Pokhara, quieter than Ghandruk, with ridge views of the range.", description: "Days are village-to-ridge rather than high camp. Community lodges, terraces, Annapurna II and Lamjung.", seasonLabel: "October–May", difficultyLabel: "Easy" },
      { name: "锡克勒斯", summary: "博卡拉以北的古隆村落，比甘德鲁克更安静，山脊上看整座山脉。", description: "村落到山脊，不是高营地。社区旅舍、梯田、安纳普尔纳二峰。", seasonLabel: "十月至五月", difficultyLabel: "轻松" },
      { name: "시클레스", summary: "포카라 북쪽 구룽 마을. 간드룩보다 한산하고 능선에서 산맥이 보입니다.", description: "마을과 능선이지 하이캠프가 아닙니다. 커뮤니티 롯지와 계단식 밭.", seasonLabel: "10–5월", difficultyLabel: "쉬움" },
      { name: "סיקלס", summary: "כפר גורונג מצפון לפוקרה, שקט מגנאדרוק, עם נוף רכס על ההרים.", description: "ימים של כפר ורכס, לא מחנה גבוה. לודג'ים קהילתיים וטרסות.", seasonLabel: "אוקטובר–מאי", difficultyLabel: "קל" },
    ),
  },
  {
    slug: "kuri-danda",
    kind: "trek",
    durationDays: 3,
    difficulty: "moderate",
    maxAltitudeM: 3200,
    priceFromUsd: 240,
    season: "Oct–May",
    heroImageUrl: IMAGES.kuri,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Kuri Danda", summary: "A three-day ridge and viewpoint trek: high pasture, wide sky, about 3,200 m.", description: "Ridge-and-viewpoint rather than a sanctuary trek. Stairs and cold nights — not a technical path.", seasonLabel: "October–May", difficultyLabel: "Moderate" },
      { name: "库里丹达", summary: "三日山脊与观景徒步：高山牧场、开阔天空，约 3,200 米。", description: "山脊观景，不是圣域徒步。是台阶和寒夜，不是技术路线。", seasonLabel: "十月至五月", difficultyLabel: "中等" },
      { name: "쿠리 단다", summary: "3일 능선·전망 트레킹. 고지 목초, 넓은 하늘, 약 3,200 m.", description: "성소 트레킹이 아니라 능선·전망 걷기. 계단과 추운 밤.", seasonLabel: "10–5월", difficultyLabel: "중급" },
      { name: "קורי דנדה", summary: "טרק רכס ותצפית של שלושה ימים: מרעה גבוה, שמיים רחבים, כ־3,200 מ'.", description: "רכס ותצפית, לא טרק מקדש. מדרגות ולילות קרים.", seasonLabel: "אוקטובר–מאי", difficultyLabel: "בינוני" },
    ),
  },
  {
    slug: "ghorepani-poon-hill",
    kind: "trek",
    durationDays: 5,
    difficulty: "moderate",
    maxAltitudeM: 3210,
    priceFromUsd: 390,
    season: "Oct–May",
    heroImageUrl: IMAGES.poon,
    featured: true,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Ghorepani Poon Hill", summary: "Sunrise over Dhaulagiri, rhododendron forest, and a steep holiday of stairs. Typically four to five days.", description: "The rest-week trek from Pokhara: steep, short, and honest about stairs. We hold five days so sunrise is not stacked on a long jeep day.", seasonLabel: "October–May", difficultyLabel: "Moderate" },
      { name: "戈勒帕尼 · 普恩山", summary: "道拉吉里日出、杜鹃林，以及陡峭的台阶假期。通常四到五天。", description: "从博卡拉出发的休息周徒步。按五天走，避免日出叠在长车程上。", seasonLabel: "十月至五月", difficultyLabel: "中等" },
      { name: "고레파니 푼힐", summary: "다울라기리 일출, 진달래 숲, 가파른 계단 휴가. 보통 4–5일.", description: "포카라에서 떠나는 휴식 주 트레킹. 5일로 잡아 일출을 서두르지 않습니다.", seasonLabel: "10–5월", difficultyLabel: "중급" },
      { name: "גורפאני פון היל", summary: "זריחה מעל דהאולגירי, יער רודודנדרון, וחופשת מדרגות תלולה. בדרך כלל ארבעה–חמישה ימים.", description: "טרק שבוע המנוחה מפוקרה. שומרים חמישה ימים כדי שהזריחה לא תרוץ.", seasonLabel: "אוקטובר–מאי", difficultyLabel: "בינוני" },
    ),
  },
  {
    slug: "mardi-himal",
    kind: "trek",
    durationDays: 5,
    difficulty: "moderate",
    maxAltitudeM: 4500,
    priceFromUsd: 620,
    season: "Mar–May, Oct–Nov",
    heroImageUrl: IMAGES.mardi,
    featured: true,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Mardi Himal", summary: "A quieter ridge toward Machhapuchhre. High camp above the cloud. Typically four to five days.", description: "The close, quieter alternative to Base Camp — a ridge walk with Machhapuchhre filling the sky.", seasonLabel: "March–May & October–November", difficultyLabel: "Moderate" },
      { name: "马尔迪喜马拉", summary: "通往鱼尾峰的安静山脊。云上的高营地。通常四到五天。", description: "基地营更安静的近距离替代：山脊上，鱼尾峰占满天空。", seasonLabel: "三月至五月、十月至十一月", difficultyLabel: "中等" },
      { name: "마르디 히말", summary: "마차푸치레를 향한 한적한 능선. 구름 위 하이캠프. 보통 4–5일.", description: "베이스캠프의 더 조용한 대안. 능선에 마차푸치레가 하늘을 채웁니다.", seasonLabel: "3–5월, 10–11월", difficultyLabel: "중급" },
      { name: "מארדי הימאל", summary: "רכס שקט לכיוון מצ'פוצ'רה. מחנה גבוה מעל הענן. בדרך כלל ארבעה–חמישה ימים.", description: "החלופה השקטה למחנה הבסיס. רכס עם מצ'פוצ'רה בשמיים.", seasonLabel: "מרץ–מאי ואוקטובר–נובמבר", difficultyLabel: "בינוני" },
    ),
  },
  {
    slug: "mohare-danda",
    kind: "trek",
    durationDays: 5,
    difficulty: "moderate",
    maxAltitudeM: 3637,
    priceFromUsd: 420,
    season: "Mar–May, Oct–Nov",
    heroImageUrl: IMAGES.mohare,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Mohare Danda", summary: "A quieter Poon Hill alternative: community lodge, 3,637 m ridge, fewer people on the stairs.", description: "Similar dawn over Dhaulagiri without the Poon Hill crowd. Nights are colder than Ghorepani.", seasonLabel: "March–May & October–November", difficultyLabel: "Moderate" },
      { name: "莫哈雷丹达", summary: "更安静的普恩山替代：社区旅舍、3,637 米山脊，台阶上人更少。", description: "类似的道拉吉里黎明，却没有普恩山的人群。", seasonLabel: "三月至五月、十月至十一月", difficultyLabel: "中等" },
      { name: "모하레 단다", summary: "푼힐의 한적한 대안. 커뮤니티 롯지, 3,637 m 능선, 계단에 사람이 적습니다.", description: "다울라기리 새벽은 비슷하고 푼힐 인파는 없습니다.", seasonLabel: "3–5월, 10–11월", difficultyLabel: "중급" },
      { name: "מוהארה דנדה", summary: "חלופה שקטה לפון היל: לודג' קהילתי, רכס 3,637 מ', פחות אנשים על המדרגות.", description: "זריחה דומה מעל דהאולגירי בלי הקהל של פון היל.", seasonLabel: "מרץ–מאי ואוקטובר–נובמבר", difficultyLabel: "בינוני" },
    ),
  },
  {
    slug: "annapurna-base-camp",
    kind: "trek",
    durationDays: 9,
    difficulty: "moderate",
    maxAltitudeM: 4130,
    priceFromUsd: 890,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.abc,
    featured: true,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Annapurna Base Camp", summary: "The sanctuary walk: rhododendron forest to a 4,130 m amphitheatre of ice. Typically seven to ten days.", description: "The classic close-up of the range. Tea houses, honest days, Jhinu springs on the way down. We hold nine days so the last 1,000 metres are not rushed.", seasonLabel: "March–May & September–November", difficultyLabel: "Moderate" },
      { name: "安纳普尔纳基地营", summary: "圣域之行：从杜鹃花林走到海拔 4,130 米的冰雪剧场。通常七到十天。", description: "近距离看见这片雪山的经典线路。夜宿茶馆，吉努温泉。按九天走，最后一千米不赶。", seasonLabel: "三月至五月、九月至十一月", difficultyLabel: "中等" },
      { name: "안나푸르나 베이스캠프", summary: "성소로 가는 길: 진달래 숲에서 4,130 m 얼음 원형극장까지. 보통 7–10일.", description: "산맥을 가까이 보는 고전. 찻집, 지누 온천. 9일로 잡아 마지막 1,000 m를 서두르지 않습니다.", seasonLabel: "3–5월, 9–11월", difficultyLabel: "중급" },
      { name: "מחנה הבסיס של אנאפורנה", summary: "הליכה אל המקדש: מיער רודודנדרון לאמפיתיאטרון קרח ב־4,130 מ'. בדרך כלל שבעה–עשרה ימים.", description: "המבט הקלאסי על הרכס. בתי תה, מעיינות ג'ינו. שומרים תשעה ימים.", seasonLabel: "מרץ–מאי וספטמבר–נובמבר", difficultyLabel: "בינוני" },
    ),
  },
  {
    slug: "khopra-danda",
    kind: "trek",
    durationDays: 7,
    difficulty: "moderate",
    maxAltitudeM: 4600,
    priceFromUsd: 780,
    season: "Mar–May, Oct–Nov",
    heroImageUrl: IMAGES.khopra,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Khopra Danda", summary: "Community lodges, Dhaulagiri close, and a side day to Khayer Lake near 4,600 m.", description: "A community-lodge ridge with fewer people than ABC. The lake day runs only if weather and legs allow.", seasonLabel: "March–May & October–November", difficultyLabel: "Moderate" },
      { name: "霍普拉丹达", summary: "社区旅舍，道拉吉里近在眼前，另有一天到约 4,600 米的卡耶尔湖。", description: "人比基地营少的社区旅舍山脊。湖日只在天气与体能允许时走。", seasonLabel: "三月至五月、十月至十一月", difficultyLabel: "中等" },
      { name: "코프라 단다", summary: "커뮤니티 롯지, 가까운 다울라기리, 약 4,600 m 카예르 호수 사이드 데이.", description: "ABC보다 한산한 커뮤니티 롯지 능선. 호수 날은 날씨와 다리가 될 때만.", seasonLabel: "3–5월, 10–11월", difficultyLabel: "중급" },
      { name: "חופרה דנדה", summary: "לודג'ים קהילתיים, דהאולגירי קרוב, ויום צד לאגם קיייר ליד 4,600 מ'.", description: "רכס לודג'ים קהילתיים עם פחות אנשים מ-ABC. יום האגם רק אם מזג האוויר מאפשר.", seasonLabel: "מרץ–מאי ואוקטובר–נובמבר", difficultyLabel: "בינוני" },
    ),
  },
  {
    slug: "annapurna-circuit",
    kind: "trek",
    durationDays: 12,
    difficulty: "challenging",
    maxAltitudeM: 5416,
    priceFromUsd: 1490,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.circuit,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Annapurna Circuit", summary: "A full circling of the massif, crossing Thorong La at 5,416 m. Typically ten to fourteen days from Pokhara or Besisahar.", description: "The great horseshoe, run with real acclimatisation days in Manang — not as a race to the pass.", seasonLabel: "March–May & September–November", difficultyLabel: "Challenging" },
      { name: "安纳普尔纳环线", summary: "环绕整座雪山，翻越海拔 5,416 米的托隆山口。从博卡拉或贝西萨哈尔通常十到十四天。", description: "壮阔的马蹄形。在马南安排真正的适应日，而不是赶山口。", seasonLabel: "三月至五月、九月至十一月", difficultyLabel: "挑战" },
      { name: "안나푸르나 서킷", summary: "산맥 한 바퀴, 토롱 라 5,416 m. 포카라 또는 베시사하르에서 보통 10–14일.", description: "큰 말굽. 마낭에서 진짜 적응일을 둡니다. 서두른 통과는 팔지 않습니다.", seasonLabel: "3–5월, 9–11월", difficultyLabel: "도전" },
      { name: "מעגל אנאפורנה", summary: "הקפה מלאה של הרכס, מעבר תורונג לה ב־5,416 מ'. בדרך כלל עשרה–ארבעה עשר ימים מפוקרה או בסיסהאר.", description: "פרסת הטרקים, עם ימי אקלום אמיתיים במנאנג. לא מוכרים מעבר מרוץ.", seasonLabel: "מרץ–מאי וספטמבר–נובמבר", difficultyLabel: "מאתגר" },
    ),
  },
  {
    slug: "upper-mustang",
    kind: "trek",
    durationDays: 11,
    difficulty: "challenging",
    maxAltitudeM: 3800,
    priceFromUsd: 1890,
    season: "Mar–Nov",
    heroImageUrl: IMAGES.mustang,
    featured: false,
    river: null,
    grade: null,
    minAge: null,
    copy: c(
      { name: "Upper Mustang", summary: "Restricted-permit country via Jomsom: Lo Manthang, walled towns, a dry trans-Himalayan plateau.", description: "Not a sanctuary walk. We process the restricted permit in Pokhara. The from-price is higher because the permit is real.", seasonLabel: "March–November", difficultyLabel: "Challenging" },
      { name: "上木斯塘", summary: "经乔姆松的限制许可地区：洛曼塘、围墙城镇、干燥的喜马拉雅横断高原。", description: "不是圣域徒步。限制许可在博卡拉办理。起步价更高，因为许可是真成本。", seasonLabel: "三月至十一月", difficultyLabel: "挑战" },
      { name: "어퍼 무스탕", summary: "좀솜을 경유하는 제한 허가 지역. 로 만탕, 성벽 마을, 건조한 트랜스히말라야 고원.", description: "성소 걷기가 아닙니다. 제한 허가는 포카라에서 처리합니다. 시작가가 높은 이유는 허가가 진짜 비용이기 때문입니다.", seasonLabel: "3–11월", difficultyLabel: "도전" },
      { name: "אפר מוסטנג", summary: "אזור היתר מוגבל דרך ג'ומסום: לו מנתאנג, עיירות מוקפות חומה, רמה יבשה מעבר להימלאיה.", description: "לא הליכת מקדש. מטפלים בהיתר בפוקרה. מחיר ה־from גבוה כי ההיתר אמיתי.", seasonLabel: "מרץ–נובמבר", difficultyLabel: "מאתגר" },
    ),
  },
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
    river: "Kaligandaki",
    grade: "III–IV",
    minAge: 14,
    copy: c(
      { name: "Kaligandaki 1 day", summary: "A full Grade III–IV day on the Kali Gandaki from Pokhara. Home to Lakeside the same evening.", description: "The honest river day from Pokhara. Helmet and PFD on everyone. We refuse a flood run.", seasonLabel: "September–November & March–May", difficultyLabel: "Spirited" },
      { name: "卡利甘达基一日", summary: "从博卡拉出发的卡利甘达基 III–IV 级全日。当晚回到湖畔。", description: "从博卡拉出发诚实的河日。全员头盔与救生衣。洪水时停漂。", seasonLabel: "九月至十一月、三月至五月", difficultyLabel: "有劲" },
      { name: "칼리간다키 1일", summary: "포카라에서 출발하는 칼리간다키 Grade III–IV 하루. 저녁에 레이크사이드로.", description: "포카라에서 떠나는 정직한 강 하루. 전원 헬멧·PFD. 홍수면 거절합니다.", seasonLabel: "9–11월, 3–5월", difficultyLabel: "활기참" },
      { name: "קאליגנדקי יום אחד", summary: "יום מלא דרגה III–IV על הקאלי גנדקי מפוקרה. חזרה ללייקסייד באותו ערב.", description: "יום הנהר הכנה מפוקרה. קסדה ואפוד לכולם. נסרב לשיטפון.", seasonLabel: "ספטמבר–נובמבר ומרץ–מאי", difficultyLabel: "ערני" },
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
    river: "Kaligandaki",
    grade: "III–IV",
    minAge: 14,
    copy: c(
      { name: "Kaligandaki 2 day", summary: "Two days of Grade III–IV in the Kali Gandaki gorge. A beach or lodge night on the river.", description: "A full first day, a night on the bank, and a second morning before the drive to Pokhara.", seasonLabel: "September–November & March–May", difficultyLabel: "Spirited" },
      { name: "卡利甘达基两日", summary: "卡利甘达基峡谷两日 III–IV 级。河岸营地或旅舍一夜。", description: "第一天全日，岸边过夜，第二天早晨再漂，然后回博卡拉。", seasonLabel: "九月至十一月、三月至五月", difficultyLabel: "有劲" },
      { name: "칼리간다키 2일", summary: "칼리간다키 협곡 Grade III–IV 이틀. 강변 비치 또는 롯지 하룻밤.", description: "첫날 종일, 강변 밤, 이튿날 아침 후 포카라.", seasonLabel: "9–11월, 3–5월", difficultyLabel: "활기참" },
      { name: "קאליגנדקי יומיים", summary: "יומיים דרגה III–IV בקניון הקאלי גנדקי. ליל חוף או לודג' על הנהר.", description: "יום מלא, לילה על הגדה, בוקר שני ואז פוקרה.", seasonLabel: "ספטמבר–נובמבר ומרץ–מאי", difficultyLabel: "ערני" },
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
    river: "Kaligandaki",
    grade: "III–IV",
    minAge: 16,
    copy: c(
      { name: "Kaligandaki 3 day", summary: "The deeper gorge: three days of Grade III–IV for guests who came for river first.", description: "More river than mountain, two nights on the bank. Minimum age is higher. We refuse a flood week.", seasonLabel: "September–November & March–May", difficultyLabel: "Challenging" },
      { name: "卡利甘达基三日", summary: "更深的峡谷：三日 III–IV 级，给先为白水而来的客人。", description: "水多于山，岸边两夜。最低年龄更高。洪水周停漂。", seasonLabel: "九月至十一月、三月至五月", difficultyLabel: "挑战" },
      { name: "칼리간다키 3일", summary: "더 깊은 협곡. Grade III–IV 사흘, 강을 먼저 온 손님을 위한 일정.", description: "산보다 강, 강변 이틀 밤. 최소 연령이 더 높습니다. 홍수 주면 거절합니다.", seasonLabel: "9–11월, 3–5월", difficultyLabel: "도전" },
      { name: "קאליגנדקי שלושה ימים", summary: "הקניון העמוק: שלושה ימים דרגה III–IV לאורחים שבאו קודם כל בשביל הנהר.", description: "יותר נהר מהר, שני לילות על הגדה. גיל מינימום גבוה יותר.", seasonLabel: "ספטמבר–נובמבר ומרץ–מאי", difficultyLabel: "מאתגר" },
    ),
  },
];

const FAQS: Record<string, Faq[]> = {
  en: [
    { id: "faq-1", question: "Do I need an account to book?", answer: "No. You send dates and a phone number. A manager in Pokhara replies." },
    { id: "faq-2", question: "What permits are included?", answer: "We organise ACAP and TIMS in Pokhara with your passport details. Costs sit in the quote. Upper Mustang adds a restricted-area permit." },
    { id: "faq-3", question: "Can I raft after my trek?", answer: "Yes. A Kaligandaki 1-day is the classic Lakeside add-on after Base Camp or Poon Hill." },
  ],
  zh: [
    { id: "faq-1", question: "预订需要注册账号吗？", answer: "不需要。你提交日期和电话，博卡拉的经理回复。" },
    { id: "faq-2", question: "包含哪些许可？", answer: "我们在博卡拉凭护照信息代办 ACAP 与 TIMS。费用写在报价里。上木斯塘另有限制区许可。" },
    { id: "faq-3", question: "徒步后可以漂流吗？", answer: "可以。卡利甘达基一日是基地营或普恩山之后的经典湖畔加项。" },
  ],
  ko: [
    { id: "faq-1", question: "예약에 계정이 필요하나요?", answer: "없습니다. 날짜와 전화만 보내면 포카라 매니저가 답합니다." },
    { id: "faq-2", question: "허가는 포함되나요?", answer: "여권 정보로 포카라에서 ACAP와 TIMS를 처리합니다. 비용은 견적에 있습니다. 어퍼 무스탕은 제한 구역 허가가 추가됩니다." },
    { id: "faq-3", question: "트레킹 후 래프팅할 수 있나요?", answer: "네. 칼리간다키 1일은 베이스캠프나 푼힐 뒤의 전형적인 레이크사이드 추가입니다." },
  ],
  he: [
    { id: "faq-1", question: "צריך חשבון כדי להזמין?", answer: "לא. שולחים תאריכים ומספר טלפון. מנהל בפוקרה עונה." },
    { id: "faq-2", question: "אילו היתרים כלולים?", answer: "אנחנו מארגנים ACAP ו-TIMS בפוקרה עם פרטי הדרכון. לאפר מוסטנג יש היתר אזור מוגבל." },
    { id: "faq-3", question: "אפשר לרפט אחרי הטרק?", answer: "כן. יום אחד בקאליגנדקי הוא התוספת הקלאסית אחרי מחנה בסיס או פון היל." },
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
    siteTitle: "Upper Path Treks And Tours",
    logoUrl: null,
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
