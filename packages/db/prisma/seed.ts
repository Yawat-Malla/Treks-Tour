import { config } from "dotenv";
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

const IMAGES = {
  abc: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80",
  circuit: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  poon: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
  mardi: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80",
  khopra: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2000&q=80",
  seti: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=2000&q=80",
  canyon: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80",
  kali: "https://images.unsplash.com/photo-1432405972618-c60b0225b8c9?auto=format&fit=crop&w=2000&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1585011664462-e74e51d7c0e6?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1400&q=80",
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
      "Annapurna Trails is a locally owned trekking company in Pokhara-6, Lakeside. Our guides grew up on these paths. We run small departures, speak plainly about weather and fitness, and stay reachable on WhatsApp, Viber, WeChat, and email — before you walk and after you come down.",
  },
  zh: {
    tagline: "从博卡拉出发，由向导带领走进安纳普尔纳雪山",
    heroHeadline: "走进安纳普尔纳。\n枕着喜马拉雅的夜空入眠。",
    heroSubhead:
      "尼泊尔本土公司，位于博卡拉。小团队、诚实的配速；预订无需注册账号。",
    introTitle: "从湖畔出发，走向整座山脉。",
    introBody:
      "我们在博卡拉湖畔安排安纳普尔纳徒步：路线、许可、茶馆、背夫、TIMS 与 ACAP。你选路，其余交给我们，让高海拔的路走起来更从容。",
    aboutTitle: "博卡拉是家，安纳普尔纳是工作。",
    aboutBody:
      "Annapurna Trails 是博卡拉湖畔的本地徒步公司。向导在这些山路上长大。我们坚持小团队出发，如实说明天气与体能要求，并在 WhatsApp、Viber、微信和邮件上随时可及——出发前与下山后都一样。",
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
      "Annapurna Trails는 포카라 레이크사이드의 현지 트레킹 회사입니다. 가이드는 이 길에서 자랐습니다. 소규모로 출발하고, 날씨와 체력을 솔직히 말하며, WhatsApp, Viber, WeChat, 이메일로 언제나 연락할 수 있습니다.",
  },
  he: {
    tagline: "טיולי טרקים מודרכים מפוקרה אל הרי האנאפורנה",
    heroHeadline: "ללכת באנאפורנה.\nלישון תחת שמי ההימלאיה.",
    heroSubhead:
      "חברה נפאלית שבסיסה בפוקרה. קבוצות קטנות, קצב ישר, והזמנה בלי לפתוח חשבון.",
    introTitle: "הרכס, מהאגם.",
    introBody:
      "מתכננים, מארגנים היתרים ומדריכים טרקים באנאפורנה מאזור לייקסייד בפוקרה. אתם בוחרים את השביל. אנחנו דואגים לשאר — בתי תה, סבלים, TIMS, ACAP, והלוגיסטיקה השקטה שהופכת שביל גבוה לפשוט.",
    aboutTitle: "פוקרה היא הבית. האנאפורנה היא העבודה.",
    aboutBody:
      "Annapurna Trails היא חברת טרקים בבעלות מקומית בלייקסייד, פוקרה. המדריכים שלנו גדלו על השבילים האלה. יוצאים בקבוצות קטנות, מדברים בכנות על מזג האוויר ועל הכושר, ונשארים זמינים ב-WhatsApp, Viber, WeChat ובמייל — לפני היציאה ואחרי הירידה.",
  },
};

function days(
  rows: [string, string][],
): ItineraryDay[] {
  return rows.map(([title, body], i) => ({ day: i + 1, title, body }));
}

const TREK_INCLUSIONS = [
  "Licensed guide",
  "ACAP & TIMS permits",
  "Tea-house lodging",
  "Breakfast, lunch, dinner on trek",
  "Pokhara airport or hotel pickup",
];
const TREK_EXCLUSIONS = ["International flights", "Nepal visa", "Travel insurance", "Personal snacks & drinks", "Tips"];

const RAFT_INCLUSIONS = [
  "IFRT licensed river guide",
  "Raft, PFD, helmet",
  "Transport from Lakeside",
  "Lunch on the river",
  "Safety kayaker on Grade III+",
];
const RAFT_EXCLUSIONS = ["Photos from the chase raft (optional)", "Personal dry bags", "Tips", "Travel insurance"];

const treks: {
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
}[] = [
  {
    slug: "annapurna-base-camp",
    durationDays: 11,
    difficulty: "moderate",
    maxAltitudeM: 4130,
    priceFromUsd: 890,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.abc,
    featured: true,
    sortOrder: 1,
    copy: {
      en: {
        name: "Annapurna Base Camp",
        summary: "The sanctuary walk: rhododendron forest to a 4,130 m amphitheatre of ice.",
        description:
          "Annapurna Base Camp is the classic close-up of the range. From Pokhara you rise through Gurung villages and oak-rhododendron forest into a high glacial bowl walled by Annapurna I, Machhapuchhre, and Hiunchuli. Nights are in tea houses. Days are honest but not technical. We pace the last 1,000 metres so you arrive with enough air to actually look.",
        seasonLabel: "March–May & September–November",
        difficultyLabel: "Moderate",
        itinerary: days([
          ["Pokhara to Ghandruk", "Jeep to Nayapul or Kimche, then a warm climb into the stone lanes of Ghandruk."],
          ["Ghandruk to Chhomrong", "Ridge walking and a steep descent to the Modi Khola, then up to Chhomrong."],
          ["Chhomrong to Bamboo", "Steps, forest, and the river close beside you as the valley narrows."],
          ["Bamboo to Deurali", "Bamboo groves give way to alpine scrub. The air thins; we keep the day short."],
          ["Deurali to Annapurna Base Camp", "Past Machhapuchhre Base Camp into the sanctuary. Sunset on the south face."],
          ["Sanctuary morning, descend to Bamboo", "Dawn at 4,130 m, then a long, kind descent back into trees."],
          ["Bamboo to Jhinu Danda", "Optional hot springs by the river after a day of stairs."],
          ["Jhinu to Nayapul, drive Pokhara", "Final forest trail and a late lunch by the lake."],
          ["Buffer / weather day", "Held in the itinerary so snow or a slow acclimatisation day does not rush you."],
          ["Pokhara rest", "Lakeside morning. Gear check and a quiet briefing for anyone extending to Poon Hill."],
          ["Depart", "Airport transfer or the next trail, as you wish."],
        ]),
      },
      zh: {
        name: "安纳普尔纳基地营",
        summary: "圣域之行：从杜鹃花林走到海拔 4,130 米的冰雪剧场。",
        description:
          "安纳普尔纳基地营是近距离看见这片雪山的经典线路。从博卡拉出发，途经古隆族村落与杜鹃、橡树林，进入由安纳普尔纳一峰、鱼尾峰与 Hiunchuli 围合的冰斗。夜宿茶馆，行程扎实但不涉及技术攀登。最后一千米我们放慢节奏，让你到达时还有余力真正看山。",
        seasonLabel: "三月至五月、九月至十一月",
        difficultyLabel: "中等",
        itinerary: days([
          ["博卡拉至甘德鲁克", "吉普车至纳亚普尔或金切，再缓爬进入甘德鲁克的石巷。"],
          ["甘德鲁克至琼荣", "山脊路，再陡降至莫迪河，随后上到琼荣。"],
          ["琼荣至班布", "台阶、森林，河谷收窄，河水就在身旁。"],
          ["班布至德乌拉利", "竹林转为高山灌丛，空气变薄，当天行程较短。"],
          ["德乌拉利至基地营", "经鱼尾峰基地营进入圣域。南壁日落。"],
          ["圣域清晨，下至班布", "海拔 4,130 米看日出，再长距离下到林线。"],
          ["班布至吉努丹达", "走完台阶后，可选河边温泉。"],
          ["吉努至纳亚普尔，返回博卡拉", "最后一段林间路，湖边晚午餐。"],
          ["机动 / 天气日", "预留一天，避免大雪或需要缓慢适应时被行程追着走。"],
          ["博卡拉休息", "湖畔早晨。整理装备，若续走普恩山再做简报。"],
          ["离开", "送机，或接下一条路线。"],
        ]),
      },
      ko: {
        name: "안나푸르나 베이스캠프",
        summary: "성소로 가는 길: 진달래 숲에서 해발 4,130 m 얼음 원형극장까지.",
        description:
          "안나푸르나 베이스캠프는 이 산맥을 가까이 보는 고전 코스입니다. 포카라에서 구룽 마을과 참나무·진달래 숲을 지나 안나푸르나 1봉, 마차푸차레, 힌출리가 둘러싼 빙하 분지로 들어갑니다. 밤은 찻집, 낮 일정은 솔직하지만 기술적 등반은 아닙니다. 마지막 1,000 m는 천천히 올려, 도착해서도 산을 볼 숨이 남게 합니다.",
        seasonLabel: "3–5월, 9–11월",
        difficultyLabel: "중급",
        itinerary: days([
          ["포카라에서 간드룩", "지프로 나야풀 또는 킴체까지, 이어서 간드룩 돌길로 오릅니다."],
          ["간드룩에서 촘롱", "능선 보행 후 모디 콜라로 가파르게 내려가 촘롱으로 오릅니다."],
          ["촘롱에서 밤부", "계단과 숲, 협곡이 좁아지며 강이 곁에 붙습니다."],
          ["밤부에서 데우랄리", "대나무 숲이 고산 관목으로 바뀝니다. 공기가 얇아져 짧게 걷습니다."],
          ["데우랄리에서 베이스캠프", "마차푸차레 베이스캠프를 지나 성소로. 남벽 일몰."],
          ["성소 아침, 밤부로 하산", "4,130 m 새벽 후 나무 지대까지 긴 하산."],
          ["밤부에서 지누 단다", "계단을 마친 뒤 강변 온천은 선택."],
          ["지누에서 나야풀, 포카라 이동", "마지막 숲길과 호숫가 늦은 점심."],
          ["예비 / 기상일", "눈이나 적응이 느릴 때를 위해 일정에 남겨 둡니다."],
          ["포카라 휴식", "레이크사이드 아침. 푼힐을 이어 걷는 분을 위한 브리핑."],
          ["출발", "공항 이동 또는 다음 트레일."],
        ]),
      },
      he: {
        name: "מחנה הבסיס של אנאפורנה",
        summary: "הליכה אל המקדש: מיער רודודנדרון לאמפיתיאטרון קרח בגובה 4,130 מ'.",
        description:
          "מחנה הבסיס של אנאפורנה הוא המפגש הקלאסי והקרוב עם הרכס. מפוקרה עולים דרך כפרי גורונג ויער אלון-רודודנדרון אל קערה קרחונית שמוקפת באנאפורנה I, במאצ'אפוצ'רה ובהיונצ'ולי. לנים בבתי תה. הימים ישרים אך לא טכניים. את אלף המטרים האחרונים אנחנו מאיטים, כדי שתגיעו עם מספיק אוויר באמת לראות.",
        seasonLabel: "מרץ–מאי וספטמבר–נובמבר",
        difficultyLabel: "בינוני",
        itinerary: days([
          ["פוקרה לגאנדרוק", "ג'יפ לנאיהפול או קימצ'ה, ואז עלייה חמה לסמטאות האבן של גאנדרוק."],
          ["גאנדרוק לצ'ומרונג", "הליכת רכס וירידה תלולה למودي קולה, ואז עלייה לצ'ומרונג."],
          ["צ'ומרונג לבמבו", "מדרגות, יער, והנהר צמוד אליכם ככל שהעמק מצטמצם."],
          ["במבו לדאוראלי", "חורשות במבוק הופכות לשיח אלפיני. האוויר דק; היום קצר."],
          ["דאוראלי למחנה הבסיס", "דרך מחנה הבסיס של מאצ'אפוצ'רה אל המקדש. שקיעה על הפאה הדרומית."],
          ["בוקר במקדש, ירידה לבמבו", "שחר ב-4,130 מ', ואז ירידה ארוכה בחזרה לעצים."],
          ["במבו לג'ינו דאנדה", "מעיינות חמים ליד הנהר אחרי יום של מדרגות — לפי בחירה."],
          ["ג'ינו לנאיהפול, נסיעה לפוקרה", "שביל יער אחרון וארוחת צהריים מאוחרת ליד האגם."],
          ["יום גיבוי / מזג אוויר", "שמור במסלול כדי ששלג או יום הסתגלות לא ידחקו בכם."],
          ["מנוחה בפוקרה", "בוקר בלייקסייד. בדיקת ציוד ותדריך למי שממשיך לפון היל."],
          ["יציאה", "הסעה לשדה התעופה או לשביל הבא."],
        ]),
      },
    },
  },
  {
    slug: "annapurna-circuit",
    durationDays: 16,
    difficulty: "challenging",
    maxAltitudeM: 5416,
    priceFromUsd: 1490,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.circuit,
    featured: true,
    sortOrder: 2,
    copy: {
      en: {
        name: "Annapurna Circuit",
        summary: "A full circling of the massif, crossing Thorong La at 5,416 m.",
        description:
          "The Circuit remains the great horseshoe of Nepal trekking: Marsyangdi heat, Manang’s high desert, a pass that asks for pre-dawn discipline, then the wide Kali Gandaki home. We run it with real acclimatisation days in Manang — not as a race to the pass. Jeep stages are used only where the new road has honestly killed the walking.",
        seasonLabel: "March–May & September–November",
        difficultyLabel: "Challenging",
        itinerary: days([
          ["Pokhara to Dharapani", "Drive the Marsyangdi corridor and start walking where the trail still earns its name."],
          ["Dharapani to Chame", "Pine, apple country, and the first close walls of rock."],
          ["Chame to Upper Pisang", "The valley opens. Optional high route for the views of Annapurna II."],
          ["Pisang to Manang", "Into the rain shadow. Buddhist villages, dry light, a slower clock."],
          ["Acclimatisation in Manang", "A side hike toward Ice Lake or Gangapurna viewpoint, sleep back in town."],
          ["Manang to Yak Kharka", "Short day, high ground. We drink tea and watch the horses."],
          ["Yak Kharka to Thorong Phedi", "Another short, high day. Early night."],
          ["Thorong La to Muktinath", "Pass day. 5,416 m at sunrise, then a long descent to the pilgrimage town."],
          ["Muktinath to Jomsom or Marpha", "Wind of the Kali Gandaki. Apple brandy country."],
          ["Descent toward Tatopani", "Optional hot springs. The air thickens again."],
          ["Tatopani to Ghorepani", "A climb back into rhododendron if you want Poon Hill at the end."],
          ["Poon Hill dawn, to Pokhara", "Sunrise over Dhaulagiri and Annapurna, then down to the lake."],
          ["Buffer days (×4)", "Built into the sixteen days for weather, sickness, or a slower Manang."],
        ]),
      },
      zh: {
        name: "安纳普尔纳环线",
        summary: "环绕整座雪山，翻越海拔 5,416 米的托隆山口。",
        description:
          "环线仍是尼泊尔徒步里那条壮阔的马蹄形：玛尔相迪的热、马南的高海拔荒原、需要黎明纪律的山口，再沿卡利甘达基回家。我们在马南安排真正的适应日，而不是赶着去山口。只有新公路已经让步行失去意义的路段，才用吉普车衔接。",
        seasonLabel: "三月至五月、九月至十一月",
        difficultyLabel: "挑战",
        itinerary: days([
          ["博卡拉至达拉帕尼", "沿玛尔相迪走廊驱车，从仍值得走的路段开始徒步。"],
          ["达拉帕尼至查梅", "松林、苹果产区，岩壁第一次贴近。"],
          ["查梅至上皮桑", "河谷打开。可选高线看安纳普尔纳二峰。"],
          ["皮桑至马南", "进入雨影区。佛寺村落、干燥的光、更慢的时间。"],
          ["马南适应日", "侧登冰湖或甘加普尔纳观景点，当晚仍住镇上。"],
          ["马南至亚克卡尔卡", "短途、高地。喝茶看马。"],
          ["亚克卡尔卡至托隆佩迪", "又一个短而高的日子。早睡。"],
          ["托隆山口至穆克提纳特", "山口日。日出时 5,416 米，再长下到朝圣小镇。"],
          ["穆克提纳特至乔姆松或马尔法", "卡利甘达基的风。苹果白兰地之地。"],
          ["下至塔托帕尼", "可选温泉。空气重新变厚。"],
          ["塔托帕尼至戈勒帕尼", "若想以普恩山收尾，再爬回杜鹃林。"],
          ["普恩山黎明，返回博卡拉", "看道拉吉里与安纳普尔纳日出，下到湖边。"],
          ["机动日（共四天）", "含在十六天内，留给天气、身体或更慢的马南。"],
        ]),
      },
      ko: {
        name: "안나푸르나 서킷",
        summary: "산괴를 한 바퀴 돌며 해발 5,416 m 토롱 라를 넘습니다.",
        description:
          "서킷은 여전히 네팔 트레킹의 큰 말굽입니다. 마르샹디의 더위, 마낭의 고지 사막, 동틀 무렵의 규율이 필요한 고개, 그리고 넓은 칼리 간다키로 돌아오는 길. 마낭에서 진짜 적응일을 넣습니다. 고개를 향한 경주가 아닙니다. 새 도로가 걷기를 무의미하게 만든 구간에만 지프를 씁니다.",
        seasonLabel: "3–5월, 9–11월",
        difficultyLabel: "도전",
        itinerary: days([
          ["포카라에서 다라파니", "마르샹디 회랑을 차로 이동하고, 아직 이름값을 하는 길에서 걷기 시작."],
          ["다라파니에서 차메", "소나무, 사과 지대, 가까워지는 암벽."],
          ["차메에서 어퍼 피상", "계곡이 열립니다. 안나푸르나 2봉을 위한 고지 루트는 선택."],
          ["피상에서 마낭", "비그늘로. 불교 마을, 마른 빛, 느린 시계."],
          ["마낭 적응", "아이스 레이크 또는 강가푸르나 전망 쪽 짧은 산행 후 마을에서 취침."],
          ["마낭에서 약 카르카", "짧은 고지 하루. 차를 마시고 말을 봅니다."],
          ["약 카르카에서 토롱 페디", "또 한 번의 짧고 높은 날. 일찍 잡니다."],
          ["토롱 라에서 묵티나트", "고개 날. 일출의 5,416 m, 긴 하산으로 순례 마을."],
          ["묵티나트에서 좀솜 또는 마르파", "칼리 간다키의 바람. 사과 브랜디의 땅."],
          ["타토파니로 하산", "온천은 선택. 공기가 다시 두꺼워집니다."],
          ["타토파니에서 고레파니", "푼힐로 마치려면 진달래 숲으로 다시 오릅니다."],
          ["푼힐 새벽, 포카라", "다울라기리와 안나푸르나 일출 후 호수로."],
          ["예비일(4일)", "16일 안에 날씨, 몸, 느린 마낭을 위해 넣었습니다."],
        ]),
      },
      he: {
        name: "מעגל אנאפורנה",
        summary: "הקפה מלאה של המסיב, כולל מעבר ת'ורונג לה בגובה 5,416 מ'.",
        description:
          "המעגל נשאר פרסת הענק של הטרקים בנפאל: החום של מארסיאנגי, המדבר הגבוה של מאננג, מעבר שדורש משמעת לפני עלות השחר, ואז עמק קאלי גנדקי הרחב הביתה. מריצים אותו עם ימי הסתגלות אמיתיים במאננג — לא כמירוץ אל המעבר. שלבי ג'יפ רק במקום שבו הכביש החדש באמת הרג את ההליכה.",
        seasonLabel: "מרץ–מאי וספטמבר–נובמבר",
        difficultyLabel: "מאתגר",
        itinerary: days([
          ["פוקרה לדאראפני", "נסיעה במסדרון מארסיאנגי והתחלת הליכה במקום שהשביל עדיין ראוי לשמו."],
          ["דאראפני לצ'אמה", "אורנים, ארץ תפוחים, וקירות הסלע הראשונים מקרוב."],
          ["צ'אמה לפיסאנג העליונה", "העמק נפתח. מסלול גבוה אופציונלי לנוף אל אנאפורנה II."],
          ["פיסאנג למאננג", "אל צל הגשם. כפרים בודהיסטיים, אור יבש, שעון איטי יותר."],
          ["הסתגלות במאננג", "צדדי לכיוון אגם הקרח או תצפית גנגאפורנה, שינה חזרה בעיירה."],
          ["מאננג ליאק חארקה", "יום קצר, קרקע גבוהה. שותים תה ומשקיפים על הסוסים."],
          ["יאק חארקה לת'ורונג פדי", "עוד יום קצר וגבוה. לילה מוקדם."],
          ["ת'ורונג לה למוקטינאת'", "יום המעבר. 5,416 מ' בזריחה, ואז ירידה ארוכה לעיירת העלייה לרגל."],
          ["מוקטינאת' לג'ומסום או מארפה", "הרוח של קאלי גנדקי. ארץ ברנדי התפוחים."],
          ["ירידה לטאטופני", "מעיינות חמים לפי בחירה. האוויר מתעבה שוב."],
          ["טאטופני לגורפאני", "עלייה חזרה לרודודנדרון אם רוצים לסיים בפון היל."],
          ["שחר בפון היל, לפוקרה", "זריחה על דאולגירי ואנאפורנה, ואז מטה לאגם."],
          ["ימי גיבוי (×4)", "שזורים בשישה-עשר הימים למזג אוויר, מחלה, או מאננג איטי יותר."],
        ]),
      },
    },
  },
  {
    slug: "ghorepani-poon-hill",
    durationDays: 4,
    difficulty: "easy",
    maxAltitudeM: 3210,
    priceFromUsd: 390,
    season: "Oct–May",
    heroImageUrl: IMAGES.poon,
    featured: true,
    sortOrder: 3,
    copy: {
      en: {
        name: "Ghorepani Poon Hill",
        summary: "Four days, one famous sunrise, and a first taste of Annapurna from Pokhara.",
        description:
          "Poon Hill is the short, generous introduction: stone stairs, Gurung hospitality, and a 3,210 m ridge that lights Dhaulagiri and the Annapurnas at once. Ideal if you have a tight Pokhara window, are travelling with mixed fitness, or want to see whether a longer sanctuary trek is for you.",
        seasonLabel: "October–May",
        difficultyLabel: "Easy–moderate",
        itinerary: days([
          ["Pokhara to Ulleri or Tikhedhunga", "Drive and a first set of stairs into the hills."],
          ["To Ghorepani", "Rhododendron forest and a high village night."],
          ["Poon Hill dawn, to Tadapani or Ghandruk", "Lantern walk to the viewpoint, then a long scenic descent."],
          ["Return to Pokhara", "Down to the road and back at the lake by afternoon."],
        ]),
      },
      zh: {
        name: "戈勒帕尼 · 普恩山",
        summary: "四天、一次著名的日出，从博卡拉初识安纳普尔纳。",
        description:
          "普恩山是一段短而慷慨的入门：石阶、古隆族的接待，以及 3,210 米山脊上同时点亮道拉吉里与安纳普尔纳的黎明。适合博卡拉停留时间紧、同行体能不一，或想先试探自己是否适合更长的圣域线路。",
        seasonLabel: "十月至五月",
        difficultyLabel: "轻松至中等",
        itinerary: days([
          ["博卡拉至乌勒里或蒂克栋加", "驱车后踏上进入山地的第一段石阶。"],
          ["前往戈勒帕尼", "杜鹃林，夜宿高山村落。"],
          ["普恩山黎明，至塔达帕尼或甘德鲁克", "提灯走上观景点，再风景优美地长下。"],
          ["返回博卡拉", "下到公路，下午回到湖边。"],
        ]),
      },
      ko: {
        name: "고레파니 푼힐",
        summary: "나흘, 유명한 일출 한 번, 포카라에서 맛보는 안나푸르나의 첫인상.",
        description:
          "푼힐은 짧고 후한 입문입니다. 돌계단, 구룽의 환대, 다울라기리와 안나푸르나를 한번에 밝히는 3,210 m 능선. 포카라 일정이 빠듯하거나, 체력이 다른 일행과 함께이거나, 더 긴 성소 트레킹이 맞는지 보고 싶을 때 좋습니다.",
        seasonLabel: "10–5월",
        difficultyLabel: "초급–중급",
        itinerary: days([
          ["포카라에서 울레리 또는 티케둥가", "이동 후 언덕으로 들어가는 첫 계단."],
          ["고레파니로", "진달래 숲과 높은 마을에서의 밤."],
          ["푼힐 새벽, 타다파니 또는 간드룩", "랜턴을 들고 전망대, 이어서 긴 하산."],
          ["포카라 귀환", "도로까지 내려와 오후에 호숫가."],
        ]),
      },
      he: {
        name: "גורפאני פון היל",
        summary: "ארבעה ימים, זריחה אחת מפורסמת, וטעימה ראשונה של אנאפורנה מפוקרה.",
        description:
          "פון היל הוא ההיכרות הקצרה והנדיבה: מדרגות אבן, הכנסת אורחים של הגורונג, ורכס בגובה 3,210 מ' שמדליק בבת אחת את דאולגירי ואת האנאפורנות. מושלם אם חלון הזמן בפוקרה צר, אם הכושר בקבוצה מעורב, או אם רוצים לבדוק האם טרק ארוך יותר אל המקדש מתאים לכם.",
        seasonLabel: "אוקטובר–מאי",
        difficultyLabel: "קל–בינוני",
        itinerary: days([
          ["פוקרה לאולרי או טיקהדונגה", "נסיעה ומדרגות ראשונות אל הגבעות."],
          ["אל גורפאני", "יער רודודנדרון ולילה בכפר גבוה."],
          ["שחר בפון היל, לטאדאפני או גאנדרוק", "הליכת עששיות לתצפית, ואז ירידה ארוכה בנוף."],
          ["חזרה לפוקרה", "ירידה לכביש וחזרה לאגם אחר הצהריים."],
        ]),
      },
    },
  },
  {
    slug: "mardi-himal",
    durationDays: 6,
    difficulty: "moderate",
    maxAltitudeM: 4500,
    priceFromUsd: 620,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.mardi,
    featured: false,
    sortOrder: 4,
    copy: {
      en: {
        name: "Mardi Himal",
        summary: "A quieter ridge toward Machhapuchhre, with a 4,500 m high camp.",
        description:
          "Mardi Himal is the ridge that still feels like a secret from Pokhara: fewer lodges, a forest that holds the mist, and a high camp staring straight at the Fish Tail. It is shorter than Base Camp, steeper in places, and best for walkers who want the sanctuary views without the sanctuary crowds.",
        seasonLabel: "March–May & September–November",
        difficultyLabel: "Moderate",
        itinerary: days([
          ["Pokhara to Forest Camp", "Drive to Kande or Forest Camp trailhead, then into oak and rhododendron."],
          ["Forest Camp to Low Camp", "Ridge walking above the cloud when the weather is kind."],
          ["Low Camp to High Camp", "The trees end. Machhapuchhre fills the sky."],
          ["Viewpoint morning, back to Low Camp", "Pre-dawn to Mardi Himal Base viewpoint (~4,500 m), then descend."],
          ["To Landruk or Siding", "A long descent into Gurung country."],
          ["Return Pokhara", "Road and lake by lunch if legs allow."],
        ]),
      },
      zh: {
        name: "马尔迪喜马拉",
        summary: "一条更安静的山脊，走向鱼尾峰，高营海拔约 4,500 米。",
        description:
          "马尔迪喜马拉仍是博卡拉附近带着秘密感的山脊： lodges 更少，森林留得住雾，高营正对鱼尾峰。比基地营更短，有些路段更陡，适合想看圣域视角、却不想挤进圣域人潮的人。",
        seasonLabel: "三月至五月、九月至十一月",
        difficultyLabel: "中等",
        itinerary: days([
          ["博卡拉至森林营", "驱车至坎德或森林营路口，进入橡树与杜鹃林。"],
          ["森林营至低营", "天气好时走在云上的山脊。"],
          ["低营至高营", "树线结束。鱼尾峰占满天空。"],
          ["观景清晨，返回低营", "黎明前上到马尔迪喜马拉基地营观景点（约 4,500 米），再下撤。"],
          ["至兰德鲁克或西丁", "长下进入古隆村落。"],
          ["返回博卡拉", "腿力允许的话，午饭前回到湖边。"],
        ]),
      },
      ko: {
        name: "마르디 히말",
        summary: "마차푸차레를 향한 더 한적한 능선, 고캠프 약 4,500 m.",
        description:
          "마르디 히말은 포카라에서 아직도 비밀처럼 느껴지는 능선입니다.  lodges가 적고, 숲이 안개를 붙잡고, 하이 캠프는 피시테일을 정면으로 봅니다. 베이스캠프보다 짧고 일부 구간은 더 가파르며, 성소의 풍경은 원하지만 인파는 원하지 않는 걷기에 맞습니다.",
        seasonLabel: "3–5월, 9–11월",
        difficultyLabel: "중급",
        itinerary: days([
          ["포카라에서 포레스트 캠프", "칸데 또는 포레스트 캠프 들머리까지 이동 후 참나무·진달래 숲으로."],
          ["포레스트 캠프에서 로우 캠프", "날씨가 좋으면 구름 위 능선."],
          ["로우 캠프에서 하이 캠프", "나무가 끝납니다. 마차푸차레가 하늘을 채웁니다."],
          ["전망 아침, 로우 캠프로", "동틀 무렵 마르디 히말 베이스 전망(~4,500 m) 후 하산."],
          ["란드룩 또는 시딩", "구룽 마을로의 긴 하산."],
          ["포카라 귀환", "다리가 허락하면 점심 전에 호수."],
        ]),
      },
      he: {
        name: "מארדי הימאל",
        summary: "רכס שקט יותר לכיוון מאצ'אפוצ'רה, עם מחנה גבוה בגובה 4,500 מ'.",
        description:
          "מארדי הימאל הוא הרכס שעדיין מרגיש כמו סוד מפוקרה: פחות לודג'ים, יער שאוחז בערפל, ומחנה גבוה שמביט ישר אל זנב הדג. קצר יותר ממחנה הבסיס, תלול יותר במקומות, ומתאים למי שרוצה את נופי המקדש בלי ההמונים של המקדש.",
        seasonLabel: "מרץ–מאי וספטמבר–נובמבר",
        difficultyLabel: "בינוני",
        itinerary: days([
          ["פוקרה למחנה היער", "נסיעה לקאנדה או לשביל מחנה היער, ואז אל אלון ורודודנדרון."],
          ["מחנה היער למחנה הנמוך", "הליכת רכס מעל הענן כשמזג האוויר טוב."],
          ["מחנה נמוך למחנה גבוה", "העצים נגמרים. מאצ'אפוצ'רה ממלא את השמים."],
          ["בוקר בתצפית, חזרה למחנה הנמוך", "לפני שחר לתצפית מחנה הבסיס של מארדי הימאל (~4,500 מ'), ואז ירידה."],
          ["ללנדרוק או סידינג", "ירידה ארוכה אל ארץ הגורונג."],
          ["חזרה לפוקרה", "כביש ואגם עד הצהריים אם הרגליים מאפשרות."],
        ]),
      },
    },
  },
  {
    slug: "khopra-ridge",
    durationDays: 8,
    difficulty: "moderate",
    maxAltitudeM: 3660,
    priceFromUsd: 780,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: IMAGES.khopra,
    featured: false,
    sortOrder: 5,
    copy: {
      en: {
        name: "Khopra Ridge",
        summary: "Community lodges, a high pasture ridge, and Khayer Lake if the snow allows.",
        description:
          "Khopra Ridge sits west of the sanctuary crowds: community-run lodges, Dhaulagiri filling the window, and an optional pilgrimage walk to Khayer Lake at 4,660 m. It is a ridge trek, not a valley trek — more sky, more wind, fewer footsteps. We like it for walkers who have already done Poon Hill and want the next honest step.",
        seasonLabel: "March–May & September–November",
        difficultyLabel: "Moderate",
        itinerary: days([
          ["Pokhara to Ghandruk or Tadapani", "Enter the ridge country through familiar Gurung villages."],
          ["To Dobato or Bayeli", "Forest and the first night with Dhaulagiri in view."],
          ["Bayeli to Khopra", "The ridge proper. Community lodge, wide light."],
          ["Khopra rest or Khayer Lake", "Optional long day to the lake if conditions are stable."],
          ["Along the ridge to Swanta", "Pasture, goats, a slower village evening."],
          ["To Ulleri or Ghorepani", "Rejoin the classic stairs if you want a Poon Hill dawn."],
          ["Descent toward Nayapul", "Down to the river road."],
          ["Pokhara", "Lake, shower, a meal that is not dal bhat unless you insist."],
        ]),
      },
      zh: {
        name: "霍普拉山脊",
        summary: "社区旅舍、高海拔牧场山脊，雪况允许时可去 Khayer 湖。",
        description:
          "霍普拉山脊在圣域人潮的西侧：社区经营的 lodges、窗外的道拉吉里，以及可选的朝圣走到海拔 4,660 米的 Khayer 湖。这是山脊线而非谷地线——更多天空、更多风、更少脚印。适合已经走过普恩山、想迈出下一步的人。",
        seasonLabel: "三月至五月、九月至十一月",
        difficultyLabel: "中等",
        itinerary: days([
          ["博卡拉至甘德鲁克或塔达帕尼", "经熟悉的古隆村落进入山脊地带。"],
          ["至多巴托或巴耶利", "森林，第一晚能看见道拉吉里。"],
          ["巴耶利至霍普拉", "真正的山脊。社区旅舍，开阔的光。"],
          ["霍普拉休息或 Khayer 湖", "条件稳定时可选择长途走到湖边。"],
          ["沿脊至斯万塔", "牧场、山羊，更慢的村落夜晚。"],
          ["至乌勒里或戈勒帕尼", "若想看普恩山日出，接回经典石阶。"],
          ["下至纳亚普尔", "下到沿河公路。"],
          ["博卡拉", "湖、热水澡，以及一顿你可以不必再吃达尔巴特的晚饭。"],
        ]),
      },
      ko: {
        name: "코프라 릿지",
        summary: "커뮤니티 롯지, 고지 목초 능선, 눈만 허락하면 카예르 호수.",
        description:
          "코프라 릿지는 성소 인파의 서쪽에 있습니다. 마을이 운영하는  lodges, 창을 채우는 다울라기리, 선택적으로 4,660 m 카예르 호수 순례. 계곡이 아니라 능선 — 하늘이 많고 바람이 많고 발자국은 적습니다. 푼힐을 이미 걷고 다음 솔직한 한 걸음을 원하는 분께 맞습니다.",
        seasonLabel: "3–5월, 9–11월",
        difficultyLabel: "중급",
        itinerary: days([
          ["포카라에서 간드룩 또는 타다파니", "익숙한 구룽 마을을 지나 능선 지대로."],
          ["도바토 또는 바옐리", "숲, 다울라기리가 보이는 첫밤."],
          ["바옐리에서 코프라", "본격 능선. 커뮤니티 롯지, 넓은 빛."],
          ["코프라 휴식 또는 카예르 호수", "조건이 안정되면 호수까지 긴 하루는 선택."],
          ["능선을 따라 스완타", "목초, 염소, 느린 마을 저녁."],
          ["울레리 또는 고레파니", "푼힐 새벽을 원하면 고전 계단과 합류."],
          ["나야풀 방면 하산", "강변 도로까지."],
          ["포카라", "호수, 샤워, 달바트가 아닌 식사도 가능합니다."],
        ]),
      },
      he: {
        name: "רכס חופרה",
        summary: "לודג'ים קהילתיים, רכס מרעה גבוה, ואגם חאיר אם השלג מאפשר.",
        description:
          "רכס חופרה יושב מערב להמוני המקדש: לודג'ים בניהול הקהילה, דאולגירי ממלא את החלון, והליכת עלייה לרגל אופציונלית לאגם חאיר בגובה 4,660 מ'. זה טרק רכס, לא טרק עמק — יותר שמים, יותר רוח, פחות עקבות. אנחנו אוהבים אותו להולכים שכבר עשו את פון היל ורוצים את הצעד הכנה הבא.",
        seasonLabel: "מרץ–מאי וספטמבר–נובמבר",
        difficultyLabel: "בינוני",
        itinerary: days([
          ["פוקרה לגאנדרוק או טאדאפני", "כניסה לארץ הרכס דרך כפרי גורונג מוכרים."],
          ["לדובאטו או באיילי", "יער והלילה הראשון עם דאולגירי בנוף."],
          ["באיילי לחופרה", "הרכס עצמו. לודג' קהילתי, אור רחב."],
          ["מנוחה בחופרה או אגם חאיר", "יום ארוך אופציונלי לאגם אם התנאים יציבים."],
          ["לאורך הרכס לסואנטה", "מרעה, עזים, ערב כפרי איטי יותר."],
          ["לאולרי או גורפאני", "חוזרים למדרגות הקלאסיות אם רוצים שחר בפון היל."],
          ["ירידה לכיוון נאיהפול", "מטה לכביש הנהר."],
          ["פוקרה", "אגם, מקלחת, וארוחה שאינה דאל בּהאט — אלא אם תתעקשו."],
        ]),
      },
    },
  },
];

const rafts: typeof treks = [
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
    sortOrder: 20,
    river: "Seti",
    grade: "II–III",
    minAge: 12,
    inclusions: RAFT_INCLUSIONS,
    exclusions: RAFT_EXCLUSIONS,
    bestMonths: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12],
    altitudeProfile: [
      { d: 1, m: 800 },
      { d: 2, m: 720 },
      { d: 3, m: 690 },
    ],
    copy: {
      en: {
        name: "Seti River day",
        summary: "The Pokhara river day: limestone canyon, warm water, back at the lake by late afternoon.",
        description:
          "Seti is the rafting that belongs to a Lakeside stay. We leave after breakfast, run a friendly Grade II–III stretch through a pale canyon, eat lunch on a gravel beach, and return you to Pokhara the same day. It is the honest add-on after Base Camp or Poon Hill — not a distant river that eats two travel days.",
        seasonLabel: "September–June (monsoon is a different river)",
        difficultyLabel: "Gentle–spirited",
        itinerary: days([
          ["Lakeside to put-in", "Jeep west of Pokhara. Briefing, kit, a short practice eddy."],
          ["Canyon run", "II–III rapids, swimming spots if the flow is kind, lunch on the beach."],
          ["Take-out and lake", "Change, drive, a shower that is not a tea-house bucket."],
        ]),
      },
      zh: {
        name: "塞蒂河一日",
        summary: "博卡拉的河日：石灰岩峡谷、温水，傍晚回到湖边。",
        description:
          "塞蒂河属于湖畔停留。早饭后出发，在浅色峡谷里走一段友好的 II–III 级，砾石滩午餐，当天返回博卡拉。这是基地营或普恩山之后诚实的加项——不是再花两天车程去的远河。",
        seasonLabel: "九月至六月（雨季是另一条河）",
        difficultyLabel: "轻松而有精神",
        itinerary: days([
          ["湖畔至下水点", "吉普车出博卡拉西侧。简报、装备、短练习。"],
          ["峡谷漂流", "II–III 级，水情好时可游泳，滩上午餐。"],
          ["上岸回湖", "换装、驱车、一次真正的淋浴。"],
        ]),
      },
      ko: {
        name: "세티 강 하루",
        summary: "포카라의 강 하루: 석회암 협곡, 따뜻한 물, 오후 늦게 호수로.",
        description:
          "세티는 레이크사이드 체류에 속하는 래프팅입니다. 아침 식사 후 출발해 II–III급의 흰 협곡을 타고, 자갈 해변에서 점심을 먹고 당일 포카라로 돌아옵니다. 베이스캠프나 푼힐 다음의 솔직한 추가 일정이지, 이동만 이틀인 먼 강이 아닙니다.",
        seasonLabel: "9–6월 (몬순은 다른 강)",
        difficultyLabel: "부드럽고 활기 있음",
        itinerary: days([
          ["레이크사이드에서 입수", "포카라 서쪽 지프. 브리핑, 장비, 짧은 연습."],
          ["협곡 런", "II–III급, 유량이 좋으면 수영, 해변 점심."],
          ["하선과 호수", "환복, 이동, 찻집이 아닌 샤워."],
        ]),
      },
      he: {
        name: "יום נהר סטי",
        summary: "יום הנהר של פוקרה: קניון גיר, מים חמים, בחזרה לאגם אחר הצהריים.",
        description:
          "הסטי הוא הרפטינג ששייך ללילה בלייקסייד. יוצאים אחרי ארוחת בוקר, רצים קטע ידידותי בדרגה II–III בקניון בהיר, אוכלים צהריים על חוף חצץ, וחוזרים לפוקרה באותו יום. זה התוספת הכנה אחרי מחנה הבסיס או פון היל — לא נהר רחוק שבולע שני ימי נסיעה.",
        seasonLabel: "ספטמבר–יוני (מונסון זה נהר אחר)",
        difficultyLabel: "עדין–ערני",
        itinerary: days([
          ["מלייקסייד לכניסה", "ג'יפ מערבית לפוקרה. תדריך, ציוד, תרגול קצר."],
          ["ריצת קניון", "אשדים II–III, שחייה אם הזרימה טובה, צהריים על החוף."],
          ["יציאה ואגם", "החלפת בגדים, נסיעה, מקלחת שאינה דלי בבית תה."],
        ]),
      },
    },
  },
  {
    slug: "upper-seti-canyon",
    kind: "rafting",
    durationDays: 1,
    difficulty: "moderate",
    maxAltitudeM: 900,
    priceFromUsd: 129,
    season: "Oct–May",
    heroImageUrl: IMAGES.canyon,
    featured: false,
    sortOrder: 21,
    river: "Upper Seti",
    grade: "III",
    minAge: 14,
    inclusions: RAFT_INCLUSIONS,
    exclusions: RAFT_EXCLUSIONS,
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    altitudeProfile: [
      { d: 1, m: 900 },
      { d: 2, m: 820 },
      { d: 3, m: 760 },
    ],
    copy: {
      en: {
        name: "Upper Seti canyon",
        summary: "A punchier day on the same river: tighter walls, more III, still home for dinner.",
        description:
          "Upper Seti is for guests who already like moving water. The canyon narrows, the hits come closer together, and we still finish in Pokhara. Not a multi-day expedition. A louder afternoon.",
        seasonLabel: "October–May",
        difficultyLabel: "Spirited",
        itinerary: days([
          ["Early Lakeside departure", "Kit check and a longer safety brief."],
          ["Upper canyon", "Continuous III, eddies to breathe, a stop if someone needs the bank."],
          ["Return", "Tea and a dry shirt before the lake road."],
        ]),
      },
      zh: {
        name: "上塞蒂峡谷",
        summary: "同一条河上更有力的一天：岩壁更窄、更多 III 级，晚饭仍在家。",
        description: "上塞蒂给已经喜欢流水的客人。峡谷收窄，浪更密，当天仍回博卡拉。不是多日探险，只是更响的一个下午。",
        seasonLabel: "十月至五月",
        difficultyLabel: "有劲",
        itinerary: days([
          ["清晨出发", "装备检查，更长的安全简报。"],
          ["上峡谷", "连续 III 级，回流处换气，需要时可靠岸。"],
          ["返回", "茶和一件干衣，再上湖边公路。"],
        ]),
      },
      ko: {
        name: "어퍼 세티 캐니언",
        summary: "같은 강의 더 힘 있는 하루: 벽이 좁고 III급이 많고, 저녁은 여전히 포카라.",
        description: "어퍼 세티는 이미 물을 좋아하는 분을 위한 하루입니다. 협곡이 좁아지고 웨이브가 촘촘하지만 당일 포카라로 끝납니다. 다일 원정이 아니라 더 큰 오후입니다.",
        seasonLabel: "10–5월",
        difficultyLabel: "활기참",
        itinerary: days([
          ["이른 출발", "장비 점검과 긴 안전 브리핑."],
          ["상부 협곡", "연속 III급, 에디에서 숨, 필요하면 강변 정지."],
          ["귀환", "차와 마른 옷, 호숫가 도로."],
        ]),
      },
      he: {
        name: "קניון סטי עליון",
        summary: "יום חד יותר על אותו נהר: קירות צרים, יותר III, ועדיין בבית לארוחת ערב.",
        description: "הסטי העליון לאורחים שכבר אוהבים מים בתנועה. הקניון מצטמצם, המכות קרובות יותר, ועדיין מסיימים בפוקרה. לא משלחת של כמה ימים. אחר צהריים רועש יותר.",
        seasonLabel: "אוקטובר–מאי",
        difficultyLabel: "ערני",
        itinerary: days([
          ["יציאה מוקדמת", "בדיקת ציוד ותדריך בטיחות ארוך יותר."],
          ["קניון עליון", "III רציף, אדיים לנשימה, עצירה אם מישהו צריך את הגדה."],
          ["חזרה", "תה וחולצה יבשה לפני כביש האגם."],
        ]),
      },
    },
  },
  {
    slug: "kaligandaki-gorge",
    kind: "rafting",
    durationDays: 3,
    difficulty: "challenging",
    maxAltitudeM: 1100,
    priceFromUsd: 390,
    season: "Oct–May",
    heroImageUrl: IMAGES.kali,
    featured: true,
    sortOrder: 22,
    river: "Kali Gandaki",
    grade: "III–IV",
    minAge: 16,
    inclusions: [...RAFT_INCLUSIONS, "Two nights river camping", "All meals on the river"],
    exclusions: RAFT_EXCLUSIONS,
    bestMonths: [10, 11, 3, 4, 5],
    altitudeProfile: [
      { d: 1, m: 1100 },
      { d: 2, m: 900 },
      { d: 3, m: 750 },
    ],
    copy: {
      en: {
        name: "Kali Gandaki gorge",
        summary: "Three days in the world’s deepest gorge: bigger water, beach camps, a river that has already seen the Circuit.",
        description:
          "The Kali Gandaki is the river that drains the Annapurna–Dhaulagiri gap. We run it as a three-day, Grade III–IV camp trip from near Beni — for walkers who want more river than mountain, or for a private group after the Circuit. Nights on beaches. Days that ask you to paddle.",
        seasonLabel: "October–May",
        difficultyLabel: "Challenging",
        itinerary: days([
          ["Pokhara to put-in", "Drive to the Kali. Kit, first rapids, beach camp."],
          ["Gorge day", "III–IV, high walls, lunch in an eddy."],
          ["Last water, drive Pokhara", "Morning paddle, take-out, back to the lake."],
        ]),
      },
      zh: {
        name: "卡利甘达基峡谷",
        summary: "世界最深峡谷里的三天：更大的水、沙滩营地，这条河已经见过环线。",
        description:
          "卡利甘达基排走安纳普尔纳与道拉吉里之间的水。我们做成三天、III–IV 级的营地行程，从贝尼附近出发——给想多玩河、少爬山的人，或环线之后的私团。夜在沙滩，白天要你真的划。",
        seasonLabel: "十月至五月",
        difficultyLabel: "挑战",
        itinerary: days([
          ["博卡拉至下水点", "驱车到卡利。装备、第一段浪、沙滩营。"],
          ["峡谷日", "III–IV 级，高壁，回流处午餐。"],
          ["最后一段水，回博卡拉", "上午划完，上岸，回到湖。"],
        ]),
      },
      ko: {
        name: "칼리 간다키 협곡",
        summary: "세계에서 가장 깊은 협곡의 사흘: 더 큰 물, 해변 캠프, 서킷을 이미 본 강.",
        description:
          "칼리 간다키는 안나푸르나와 다울라기리 사이를 빠져나가는 강입니다. 베니 근처에서 출발하는 3일, III–IV급 캠프 트립. 산보다 강을 원하는 분, 또는 서킷 이후 프라이빗 그룹을 위한 일정입니다.",
        seasonLabel: "10–5월",
        difficultyLabel: "도전",
        itinerary: days([
          ["포카라에서 입수", "칼리까지 이동. 장비, 첫 급류, 해변 캠프."],
          ["협곡 하루", "III–IV급, 높은 벽, 에디 점심."],
          ["마지막 물, 포카라", "아침 패들, 하선, 호수로."],
        ]),
      },
      he: {
        name: "קניון קאלי גנדקי",
        summary: "שלושה ימים בקניון העמוק בעולם: מים גדולים יותר, מחנות חוף, נהר שכבר ראה את המעגל.",
        description:
          "הקאלי גנדקי הוא הנהר שמנקז את הפער בין אנאפורנה לדאולגירי. מריצים אותו כטיול מחנה של שלושה ימים, דרגה III–IV, ליד בני — להולכים שרוצים יותר נהר מהר, או לקבוצה פרטית אחרי המעגל. לילות על חופים. ימים שדורשים חתירה.",
        seasonLabel: "אוקטובר–מאי",
        difficultyLabel: "מאתגר",
        itinerary: days([
          ["מפוקרה לכניסה", "נסיעה לקאלי. ציוד, אשדים ראשונים, מחנה חוף."],
          ["יום קניון", "III–IV, קירות גבוהים, צהריים באדי."],
          ["מים אחרונים, נסיעה לפוקרה", "חתירה בוקר, יציאה, חזרה לאגם."],
        ]),
      },
    },
  },
];

const PROFILE: Record<string, { d: number; m: number }[]> = {
  "annapurna-base-camp": [
    { d: 1, m: 1100 },
    { d: 2, m: 2170 },
    { d: 3, m: 2310 },
    { d: 4, m: 3230 },
    { d: 5, m: 4130 },
    { d: 6, m: 2310 },
    { d: 7, m: 1780 },
    { d: 8, m: 1070 },
  ],
  "annapurna-circuit": [
    { d: 1, m: 1860 },
    { d: 2, m: 2670 },
    { d: 3, m: 3300 },
    { d: 4, m: 3540 },
    { d: 5, m: 3540 },
    { d: 6, m: 4050 },
    { d: 7, m: 4450 },
    { d: 8, m: 5416 },
    { d: 9, m: 2800 },
  ],
  "ghorepani-poon-hill": [
    { d: 1, m: 1540 },
    { d: 2, m: 2870 },
    { d: 3, m: 3210 },
    { d: 4, m: 1070 },
  ],
  "mardi-himal": [
    { d: 1, m: 1890 },
    { d: 2, m: 2970 },
    { d: 3, m: 3580 },
    { d: 4, m: 4500 },
    { d: 5, m: 1565 },
  ],
  "khopra-ridge": [
    { d: 1, m: 2000 },
    { d: 2, m: 2800 },
    { d: 3, m: 3660 },
    { d: 4, m: 3660 },
    { d: 5, m: 2200 },
  ],
};

const MONTHS_TREK = [3, 4, 5, 9, 10, 11];

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
        answer: "ACAP and TIMS are in the trip price. We process them in Pokhara before you walk. You still need a Nepal visa and insurance that covers trekking (and rafting, if you add a river day).",
      },
      zh: {
        question: "安纳普尔纳徒步包含哪些许可？",
        answer: "ACAP 与 TIMS 含在报价里，出发前在博卡拉办理。你仍需尼泊尔签证，以及覆盖徒步（若加河日，也覆盖漂流）的保险。",
      },
      ko: {
        question: "안나푸르나 트레킹에 허가가 포함되나요?",
        answer: "ACAP와 TIMS는 가격에 포함되며 포카라에서 처리합니다. 네팔 비자와 트레킹(래프팅 추가 시 래프팅)을 커버하는 보험은 따로 필요합니다.",
      },
      he: {
        question: "אילו היתרים כלולים בטרקי אנאפורנה?",
        answer: "ACAP ו-TIMS כלולים במחיר. מטפלים בהם בפוקרה לפני ההליכה. עדיין צריך ויזה לנפאל וביטוח שמכסה טרקים (ורפטינג, אם מוסיפים יום נהר).",
      },
    },
  },
  {
    sortOrder: 3,
    copy: {
      en: {
        question: "Can I raft after my trek?",
        answer: "Yes. The Seti day is built for a rest day in Pokhara. Add it when you request the trek, or message us after you come down. Kali Gandaki needs an extra two nights.",
      },
      zh: {
        question: "徒步之后可以漂流吗？",
        answer: "可以。塞蒂河一日就是为博卡拉休息日准备的。提交徒步请求时勾选，或下山后再联系。卡利甘达基需要再住两晚。",
      },
      ko: {
        question: "트레킹 후에 래프팅할 수 있나요?",
        answer: "있습니다. 세티 하루는 포카라 휴식일에 맞춰 있습니다. 트레킹 요청 때 추가하거나 하산 후 연락하세요. 칼리 간다키는 이틀이 더 필요합니다.",
      },
      he: {
        question: "אפשר לרפט אחרי הטרק?",
        answer: "כן. יום הסטי בנוי ליום מנוחה בפוקרה. מוסיפים בבקשת הטרק, או כותבים אחרי הירידה. קאלי גנדקי דורש עוד שני לילות.",
      },
    },
  },
  {
    sortOrder: 4,
    copy: {
      en: {
        question: "What if I am travelling solo?",
        answer: "Solo is normal. We match you to a small departure when we can, or quote a private guide. Rafting has a minimum age and a minimum boat — we will say so plainly.",
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
        answer: "June to early September the high trails are leeches, cloud, and landslide risk. We do not push Circuit or Base Camp then. Some river days still run; we decide week by week.",
      },
      zh: {
        question: "雨季是什么时候？还开团吗？",
        answer: "六月到九月初，高海拔路线有水蛭、云和滑坡风险。那时我们不强推环线或基地营。部分河日仍可能开，按周决定。",
      },
      ko: {
        question: "몬순은 언제이고, 그때도 가나요?",
        answer: "6월부터 9월 초까지 고지 트레일은 거머리, 구름, 산사태 위험이 있습니다. 서킷과 베이스캠프는 강권하지 않습니다. 일부 강 일정은 주 단위로 판단합니다.",
      },
      he: {
        question: "מתי המונסון, והאם עדיין יוצאים?",
        answer: "יוני עד תחילת ספטמבר השבילים הגבוהים הם עלוקות, ענן וסיכון מפולת. לא דוחפים אז את המעגל או מחנה הבסיס. חלק מימי הנהר עדיין רצים; מחליטים משבוע לשבוע.",
      },
    },
  },
];

const voices: { sortOrder: number; copy: Record<Locale, { quote: string; attribution: string }> }[] = [
  {
    sortOrder: 1,
    copy: {
      en: { quote: "They told us the last 400 metres would be slow. They were. We arrived with enough air to look.", attribution: "A walker, after Base Camp" },
      zh: { quote: "他们说最后四百米会很慢。确实慢。我们到的时候还有气看山。", attribution: "一位走完基地营的人" },
      ko: { quote: "마지막 400 m는 느릴 거라고 했습니다. 그랬습니다. 도착해서도 산을 볼 숨이 남았습니다.", attribution: "베이스캠프를 마친 걷는 이" },
      he: { quote: "אמרו שה-400 מטר האחרונים יהיו איטיים. היו. הגענו עם מספיק אוויר להסתכל.", attribution: "הולכת, אחרי מחנה הבסיס" },
    },
  },
  {
    sortOrder: 2,
    copy: {
      en: { quote: "The Seti day after Poon Hill was the right tired. Warm water, same company, no extra hotel night wasted.", attribution: "A family who stayed on Lakeside" },
      zh: { quote: "普恩山之后的塞蒂河一日，累得刚好。温水、同一批人，没有浪费额外酒店晚。", attribution: "住在湖畔的一家人" },
      ko: { quote: "푼힐 다음 세티 하루가 알맞게 피곤했습니다. 따뜻한 물, 같은 일행, 호텔 하룻밤을 버리지 않았습니다.", attribution: "레이크사이드에 머문 가족" },
      he: { quote: "יום הסטי אחרי פון היל היה העייפות הנכונה. מים חמים, אותה חברה, בלי לבזבז ליל מלון נוסף.", attribution: "משפחה שנשארה בלייקסייד" },
    },
  },
];

async function main() {
  await prisma.booking.deleteMany();
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
      translations: {
        create: (Object.keys(settingsCopy) as Locale[]).map((locale) => ({
          locale,
          ...settingsCopy[locale],
        })),
      },
    },
  });

  for (const trek of [...treks, ...rafts]) {
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
        altitudeProfile: (trek.altitudeProfile ?? PROFILE[trek.slug] ?? []) as unknown as Prisma.InputJsonValue,
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

  console.log("Seeded Annapurna Trails: 5 treks + 3 rafting + FAQs");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
