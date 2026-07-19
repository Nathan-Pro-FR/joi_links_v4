import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import { connectMongo } from "../lib/mongo";
import { Media } from "../lib/models/Media";

/**
 * Raw source list (number / link / title). Everything else the Media model
 * needs (category, tags, creator, duration, rating, …) is derived
 * deterministically below so re-seeding is stable.
 */
const RAW: { number: string; link: string; title: string }[] = [
  { number: "001", link: "https://fr.pornhub.com/view_video.php?viewkey=ph632e6435b1e4b", title: "FR Toga, Tsuyu, Uraraka, Ashido JOI (My Hero Academia) - Pornhub.com" },
  { number: "002", link: "https://fr.pornhub.com/view_video.php?viewkey=65e6f44532968", title: "Initiation CEI Avec Mira | 1/5 | Hentai JOI | French - Pornhub.com" },
  { number: "003", link: "https://pornkai.com/view?key=xv85559073", title: "Joi fr nico robin - PornKai.com" },
  { number: "004", link: "https://pornkai.com/view?key=xv72135186", title: "Joi fr hentai: deviens une pute - PornKai.com" },
  { number: "005", link: "https://pornkai.com/view?key=xv75514445", title: "Sakura JOI fr 1 L'arrivée au village - PornKai.com" },
  { number: "006", link: "https://pornkai.com/view?key=xv67276543", title: "French hentai JOI, Sakura Hard Femdom - PornKai.com" },
  { number: "007", link: "https://pornkai.com/view?key=xv75952267", title: "Ino JOI fr 4 Les Sources Thermales - PornKai.com" },
  { number: "008", link: "https://pornkai.com/view?key=xv61391361", title: "Joi hentai french Hinata 2 - PornKai.com" },
  { number: "009", link: "https://pornkai.com/view?key=xv75685827", title: "Tsunade jOI CEI fr 2 Konoha - PornKai.com" },
  { number: "010", link: "https://pornkai.com/view?key=xv61532561", title: "Joi hentai french Hinata 3 - PornKai.com" },
  { number: "011", link: "https://pornkai.com/view?key=xv74347857", title: "BOWSETTE FAIT DE TOI SA PUTE [JOI-CEI-SISSY-ANAL] EN FRANCAIS - PornKai.com" },
  { number: "012", link: "https://pornkai.com/view?key=xv62071081", title: "Joi 2 futa fr humiliation cei feet assplay - PornKai.com" },
  { number: "013", link: "https://pornkai.com/view?key=xv75874383", title: "JOI FR Toga, Tsuyu, Uraraka, Ashido (My Hero Academia) - PornKai.com" },
  { number: "014", link: "https://pornkai.com/view?key=xv66366589", title: "Hentai (joi French) Lucy heartfilia - PornKai.com" },
  { number: "015", link: "https://pornkai.com/view?key=xv67584819", title: "Joi cei meiko french - PornKai.com" },
  { number: "016", link: "https://pornkai.com/view?key=xv75672993", title: "Hentai JOI French D.VA - PornKai.com" },
  { number: "017", link: "https://pornkai.com/view?key=xv61317219", title: "Joi hentai french Hinata - PornKai.com" },
  { number: "018", link: "https://pornkai.com/view?key=xv61989347", title: "Commission JOI Extrême Femdom Nami et Lucy (Français) - PornKai.com" },
  { number: "019", link: "https://pornkai.com/view?key=xv61439231", title: "Joi futa fr esclave bowsette : anal humiliation cei - PornKai.com" },
  { number: "020", link: "https://pornkai.com/view?key=xv75873799", title: "Yoruichi JOI (Ass Play) - PornKai.com" },
  { number: "021", link: "https://pornkai.com/view?key=xv72073244", title: "Vidéo intro: joi french hentai deviens une pute - PornKai.com" },
  { number: "022", link: "https://pornkai.com/view?key=xv79947139", title: "Fairy Tail JOI CEI fr 15 Le voyage - PornKai.com" },
  { number: "023", link: "https://pornkai.com/view?key=xv67258449", title: "Hentai (joi french) one punch man - PornKai.com" },
  { number: "024", link: "https://pornkai.com/view?key=xv69569781", title: "Hentai Waifu French Joi Hard Domination - PornKai.com" },
  { number: "025", link: "https://pornkai.com/view?key=xv67405973", title: "Jerk off instruction HENTAI - Fairy tail : Lucy - Anal, Bodywriting, Sissy - Difficulty : easy - Esclave pour la soirée - PornKai.com" },
  { number: "026", link: "https://xhamster.com/videos/french-hentai-joi-yuuki-asuna-sao-9861317", title: "French Hentai JOI - Yuuki Asuna Sao | xHamster" },
  { number: "027", link: "https://pornkai.com/view?key=xv64875071", title: "hentai joi erza french ceo fairy tail - PornKai.com" },
  { number: "028", link: "https://pornkai.com/view?key=xv64870675", title: "hentai joi diva french ceo overwatch - PornKai.com" },
  { number: "029", link: "https://pornkai.com/view?key=xv66365615", title: "Joi nami pour femme spanking et humiliation des seins soft - PornKai.com" },
  { number: "030", link: "https://pornkai.com/view?key=xv63670563", title: "Joi cei Matsumoto et Tsunade french - PornKai.com" },
  { number: "031", link: "https://pornkai.com/view?key=xv70447743", title: "french Joi pour femme Himiko toga pissplay humiliation pour petite chienne - PornKai.com" },
  { number: "032", link: "https://pornkai.com/view?key=xv64875005", title: "Cynthia Futa CEI French - PornKai.com" },
  { number: "033", link: "https://pornkai.com/view?key=xv63326131", title: "Hentai joi fr temari - PornKai.com" },
  { number: "034", link: "https://pornkai.com/view?key=xv62700067", title: "Joi Ino - Naruto partie 1 - FR - PornKai.com" },
  { number: "035", link: "https://pornkai.com/view?key=xv75756587", title: "Hentai JOI French D.VA - PornKai.com" },
  { number: "036", link: "https://pornkai.com/view?key=xv64880789", title: "Nami JOI POV ( sous titres Français) - PornKai.com" },
  { number: "037", link: "https://pornkai.com/view?key=xv73787389", title: "Joi cei hentai french Sonia Pokemon - PornKai.com" },
  { number: "038", link: "https://pornkai.com/view?key=xv79795169", title: "Lucy et Erza JOI CEI fr 14 Le plan - PornKai.com" },
  { number: "039", link: "https://pornkai.com/view?key=xv79237559", title: "Lucy Heartfilia JOI CEI fr 12 La cliente - PornKai.com" },
  { number: "040", link: "https://pornkai.com/view?key=xv79562809", title: "Brandish JOI CEI fr 13 L'invitée - PornKai.com" },
  { number: "041", link: "https://pornkai.com/view?key=xv78841369", title: "Erza JOI CEI fr 10 La Reine des fées - PornKai.com" },
  { number: "042", link: "https://pornkai.com/videos?q=Joi+french+hentai", title: "Free Joi French Hentai Porn | PornKai.com" },
  { number: "043", link: "https://fr.pornhub.com/video/search?search=hentai+joi+french", title: "Hentai Joi French – Vidéos Porno | Pornhub.com" },
  { number: "044", link: "https://fr.xvideos.com/video.uotpdfcc592/hentai_joi_fr_pitou_cei_iceplay_pissplay_femdom", title: "Hentai joi fr Pitou CEI, ICEPLAY, PISSPLAY, FEMDOM - XVIDEOS.COM" },
  { number: "045", link: "https://fr.xvideos.com/video.keboick7d48/hentai_joi_fr_lucy_te_met_a_son_service", title: "Hentai joi fr / Lucy te met à son service - XVIDEOS.COM" },
  { number: "046", link: "https://fr.xvideos.com/video.upcvvhk4e07/joi_hentai_fr", title: "Joi hentai fr - XVIDEOS.COM" },
  { number: "047", link: "https://fr.xvideos.com/video.udbtvekb68f/hentai_joi_nami_fr_one_piece_futanari_assplay_cei_ass_to_mouth", title: "Hentai joi Nami FR One piece Futanari Assplay, CEI, Ass to mouth - XVIDEOS.COM" },
  { number: "048", link: "https://fr.xvideos.com/video.ohddfbo69da/transforme_en_animal_docile_par_une_succube_hentai_femdom_joi_petplay_humiliation..._", title: "Transformé en animal docile par une succube (Hentai Femdom JOI, PetPlay, Humiliation...) - XVIDEOS.COM" },
  { number: "049", link: "https://fr.xvideos.com/video.uukdhvdb5ad/hentai_joi_fr_makio_demon_slayer", title: "Hentai Joi Fr Makio Démon Slayer - XVIDEOS.COM" },
  { number: "050", link: "https://fr.xvideos.com/video.uddkbamf40f/hentai_joi_asuna_fr_assplay_and_pissplay", title: "Hentai JOI Asuna fr Assplay & Pissplay - XVIDEOS.COM" },
  { number: "051", link: "https://fr.xvideos.com/video.kehhbhb5a1a/hentai_joi_fr_ddlc_iceplay_petplay_cbt", title: "hentai joi fr ddlc iceplay petplay cbt - XVIDEOS.COM" },
  { number: "052", link: "https://fr.xvideos.com/video.kcdvkmf29cc/joi_hentai_fr_sakura_s_occupe_de_ta_convalescence", title: "Joi Hentai fr Sakura s'occupe de ta convalescence - XVIDEOS.COM" },
  { number: "053", link: "https://fr.xvideos.com/video.ulcmbbh1001/hentai_joi_fr_chitoge_assplay_iceplay_cei", title: "Hentai JOi fr chitoge assplay, iceplay, CEI - XVIDEOS.COM" },
  { number: "054", link: "https://fr.xvideos.com/video.kcdvptva2e4/joi_hentai_fr_nami_et_robin_font_de_toi_leur_esclave", title: "Joi Hentai fr Nami et Robin font de toi leur esclave - XVIDEOS.COM" },
  { number: "055", link: "https://fr.xvideos.com/video.uccepmh0e83/hentai_joi_fr_power_chainsawman_assplay_pissplay_feet", title: "Hentai JOI FR Power chainsawman Assplay / Pissplay / Feet - XVIDEOS.COM" },
  { number: "056", link: "https://fr.xvideos.com/video.uevpdlv2919/hentai_joi_fr_nico_robin_one_piece_futanari_a2m_pissplay_cum_eating_instruction", title: "Hentai joi fr Nico Robin One Piece Futanari, A2M, Pissplay, Cum eating instruction - XVIDEOS.COM" },
  { number: "057", link: "https://fr.xvideos.com/video.ukpbfuvdfef/joi_hentai_fr_machi_komacine_hunter_x_hunter_hentai", title: "Joi Hentai Fr MACHI KOMACINE HUNTER X HUNTER HENTAI - XVIDEOS.COM" },
  { number: "058", link: "https://fr.xvideos.com/video.ukiammb46a8/hentai_joi_fr_sarada_petplay_cei_analplay", title: "hentai joi fr Sarada petplay Cei analplay - XVIDEOS.COM" },
  { number: "059", link: "https://fr.xvideos.com/video.keopfoo6c6a/joi_hentai_fr_mastumoto_vous_fait_du_bien", title: "Joi hentai fr mastumoto vous fait du bien - XVIDEOS.COM" },
  { number: "060", link: "https://fr.xvideos.com/video.ufkkdhm1630/hentai_joi_aqua_fr_anal_oral_cul_a_bouche_sissyfication_femdom_instruction_pour_manger_du_sperme", title: "Hentai joi Aqua fr Anal, Oral, Cul à bouche, Sissyfication, femdom, Instruction pour manger du sperme - XVIDEOS.COM" },
  { number: "061", link: "https://fr.xvideos.com/video.uucbihi8dd4/joi_fr_hentai_deviens_une_pute", title: "Joi fr hentai: deviens une pute - XVIDEOS.COM" },
  { number: "062", link: "https://fr.xvideos.com/video.uuildak29a7/hentai_joi_fr_lucy_heartfilia_assplay_pissplay_femdom_cei", title: "Hentai joi fr Lucy Heartfilia assplay, pissplay, femdom, CEI - XVIDEOS.COM" },
  { number: "063", link: "https://fr.xvideos.com/video.ukpbuhv5fde/joi_hentai_fr_hana_uzaki_assplay_femdom_humiliation", title: "Joi hentai fr Hana Uzaki assplay, femdom, humiliation - XVIDEOS.COM" },
  { number: "064", link: "https://fr.xvideos.com/video.ubepbhbfffd/hentai_joi_sarada_fr_and_sakura_futanari_pissplay_assplay_cei", title: "Hentai Joi Sarada FR & Sakura Futanari PissPlay Assplay CEI - XVIDEOS.COM" },
  { number: "065", link: "https://fr.xvideos.com/video.uvehddvb19b/joi_hentai_sinobu_kocho_anal_piss_play_a2m_de_fr", title: "Joi Hentai Sinobu Kocho Anal / Piss play, A2M, dé FR - XVIDEOS.COM" },
  { number: "066", link: "https://fr.xvideos.com/video.uptchpdd588/hentai_joi_fr_-_kurisu_makise_futa", title: "Hentai JOI FR - Kurisu Makise | Futa - XVIDEOS.COM" },
  { number: "067", link: "https://fr.xvideos.com/video.uuutllo562f/hentai_joi_fr_noelle_assplay_femdom_iceplay", title: "Hentai joi fr Noelle Assplay, femdom iceplay - XVIDEOS.COM" },
  { number: "068", link: "https://fr.xvideos.com/video.utupoooadad/joi_fr_hentai_orihime_s_amuse_avec_vous", title: "Joi fr hentai :orihime s'amuse avec vous - XVIDEOS.COM" },
  { number: "069", link: "https://fr.xvideos.com/video.kcpumbk2e21/hentai_joi_fr_temari", title: "Hentai joi fr temari - XVIDEOS.COM" },
  { number: "070", link: "https://fr.xvideos.com/video.ulacbod68a5/hentai_joi_ochako_femdom_cul_jouer_pisse_jouer_fr", title: "Hentai JOI ochako femdom cul jouer pisse jouer fr - XVIDEOS.COM" },
  { number: "071", link: "https://fr.xvideos.com/video.kdktiuo071b/hentai_joi_cei_play_lavement_-_danmachi_francais", title: "Hentai joi cei play lavement - DanMachi Français - XVIDEOS.COM" },
  { number: "072", link: "https://fr.xvideos.com/video.uuaavkp3b94/hentai_joi_de_lucy_heartfilia_vanille_", title: "Hentai joi de Lucy Heartfilia (Vanille) - XVIDEOS.COM" },
  { number: "073", link: "https://fr.xvideos.com/video.umemumk14ff/drole_hentai_yelan_fr_cei_pet_play_anal_", title: "Drôle Hentai Yelan FR (CEI, PET PLAY, ANAL) - XVIDEOS.COM" },
  { number: "074", link: "https://fr.xvideos.com/video.uophhom8ec0/jeudi_hentai_fr_erina_anal_pissplay_cei", title: "Jeudi hentai fr erina anal, pissplay, CEI - XVIDEOS.COM" },
  { number: "075", link: "https://fr.xvideos.com/video.ueoktdm95a8/jabami_yumeko_vous_tient_en_laisse_pendant_qu_elle_vous_cocufie_hentai_femdom_cei_ntr_jeu_de_des_humiliation..._", title: "Jabami Yumeko vous tient en laisse pendant qu'elle vous cocufie (Hentai Femdom CEI, NTR, Jeu de dés, Humiliation...) - XVIDEOS.COM" },
  { number: "076", link: "https://fr.xvideos.com/video.umhvkvoa8fc/hentai_joi_fr_reby_fairy_tail_assplay_iceplay_pissplay_cei", title: "Hentai joi fr Reby fairy tail assplay, iceplay,pissplay, CEI - XVIDEOS.COM" },
];

const REAL_CATS = ["Countdown", "Edging", "Teasing", "ASMR", "Roleplay"];

// Kink keywords → tag label. First matches win, capped to keep cards tidy.
const TAG_RULES: [RegExp, string][] = [
  [/\bcei\b|cum eating/i, "CEI"],
  [/femdom|domination|hard/i, "Femdom"],
  [/futa(nari)?/i, "Futa"],
  [/assplay|ass play|\banal\b|a2m|ass to mouth|cul/i, "Anal"],
  [/pissplay|piss play|pisse/i, "Pissplay"],
  [/iceplay|ice play/i, "Iceplay"],
  [/petplay|pet play|animal|laisse/i, "Petplay"],
  [/sissy|sissyfication/i, "Sissy"],
  [/humiliation|chienne|pute|esclave/i, "Humiliation"],
  [/feet/i, "Feet"],
  [/ntr|cocufie/i, "NTR"],
  [/\bpov\b/i, "POV"],
];

function hashNum(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function cleanTitle(t: string): string {
  return t
    .trim()
    .replace(/\s*\|\s*xHamster\s*$/i, "")
    .replace(/\s*[-–|]\s*Pornhub\.com\s*$/i, "")
    .replace(/\s*[-–|]\s*PornKai\.com\s*$/i, "")
    .replace(/\s*[-–|]\s*XVIDEOS\.COM\s*$/i, "")
    .replace(/\s*–\s*Vidéos Porno\s*$/i, "")
    .trim();
}

function creatorFromUrl(u: string): string {
  try {
    const host = new URL(u).hostname.replace(/^www\./, "").replace(/^fr\./, "");
    return "@" + host.split(".")[0];
  } catch {
    return "@unknown";
  }
}

function extractTags(title: string): string[] {
  const found: string[] = [];
  for (const [re, label] of TAG_RULES) {
    if (re.test(title) && !found.includes(label)) found.push(label);
    if (found.length >= 3) break;
  }
  if (found.length === 0) found.push("JOI");
  return found;
}

function secToDur(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function main() {
  await connectMongo();
  await Media.deleteMany({});

  const now = Date.now();
  const docs = RAW.map((r, i) => {
    const h = hashNum(r.number + r.link);
    const title = cleanTitle(r.title);
    const durSec = 360 + (h % 1140); // 6:00 – 25:00
    return {
      title,
      url: r.link,
      cat: REAL_CATS[i % REAL_CATS.length],
      tags: extractTags(r.title),
      creator: creatorFromUrl(r.link),
      dur: secToDur(durSec),
      durSec,
      rating: 3 + (h % 3), // 3 – 5
      fav: i % 4 === 0, // ~25% favorites
      bookmark: i % 6 === 3, // a handful in "Watch later"
      hot: h % 5 === 0,
      seed: parseInt(r.number, 10),
      addedAt: new Date(now - i * 1000 * 60 * 60 * 4),
    };
  });

  await Media.insertMany(docs);
  // eslint-disable-next-line no-console
  console.log(`Seeded ${docs.length} media entries.`);
  process.exit(0);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
