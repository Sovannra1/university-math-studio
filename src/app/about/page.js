import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Target,
  Sparkles,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Mail,
  Compass,
  Layers,
  Cpu,
  Quote,
  Award,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import AuthButton from "@/components/auth/AuthButton";
import { BRAND_NAME, FOUNDER_NAME, APP_VERSION } from "@/lib/appConfig";

export const metadata = {
  title: "អំពីយើង | KHMERTEX — គណិតវិទ្យាសាកលវិទ្យាល័យ",
  description:
    "ព័ត៌មានអំពីក្រុមអភិវឌ្ឍន៍ KHMERTEX ស្ថាបនិក លឿ សុវណ្ណរ៉ា និងបេសកកម្មលើកកម្ពស់ការសិក្សាគណិតវិទ្យាជាភាសាខ្មែរ។",
};

const STUDIO_STATS = [
  { value: "១៥", label: "មុខវិជ្ជាគោល", sub: "ឆ្នាំទី ១ ដល់ ៤", accent: "text-[#db073d]" },
  { value: "២០+", label: "ស្លាយ & ក្រាប", sub: "ក្នុងមួយចំណុចរង", accent: "text-[#0085dd]" },
  { value: "១០០%", label: "ភាសាខ្មែរ + LaTeX", sub: "ស្តង់ដារអន្តរជាតិ", accent: "text-[#009b5e]" },
  { value: "៣D", label: "ក្រាបអន្តរកម្ម", sub: "ពិសោធន៍ផ្ទាល់ដៃ", accent: "text-[#b95a00]" },
];

const MISSION_PILLARS = [
  {
    icon: BookOpen,
    iconBg: "bg-[#ffe9e8] text-[#db073d]",
    borderHover: "hover:border-[#f68f91]",
    title: "គរុកោសល្យម៉ត់ចត់ជាភាសាខ្មែរ",
    subtitle: "Rigorous University Pedagogy",
    body: "រៀបរៀងមេរៀនគណិតវិទ្យាថ្នាក់សាកលវិទ្យាល័យជាភាសាខ្មែរឱ្យត្រឹមត្រូវតាមក្បួនខ្នាត មាននិយមន័យផ្លូវការ សម្រាយបញ្ជាក់ និងឧទាហរណ៍បដិសេធច្បាស់លាស់។",
  },
  {
    icon: Compass,
    iconBg: "bg-[#e8f4fd] text-[#0085dd]",
    borderHover: "hover:border-[#7cc4f5]",
    title: "មើលឃើញ និងពិសោធន៍ផ្ទាល់",
    subtitle: "Interactive Visual Math",
    body: "ប្រែក្លាយរូបមន្តអរូបីដូចលីមីត ដេរីវេ អាំងតេក្រាល និងមាឌ 3D ឱ្យក្លាយជាក្រាបអន្តរកម្មដែលនិស្សិតអាចរំកិលសង្កេតបម្រែបម្រួលបានភ្លាមៗ។",
  },
  {
    icon: Layers,
    iconBg: "bg-[#e7f7f0] text-[#009b5e]",
    borderHover: "hover:border-[#6fd6ab]",
    title: "បទពិសោធន៍សិក្សាទំនើបពេញលេញ",
    subtitle: "All-in-One Learning Studio",
    body: "បំពាក់ដោយរបៀបអានសៀវភៅពេញអេក្រង់ រោងកុនវីដេអូអណ្តែត របៀបប្រឡងកំណត់ម៉ោង លំហាត់ជុំថ្មីស្វ័យប្រវត្តិ និងវេទិកាពិភាក្សាតាម LaTeX។",
  },
];

const CURRICULUM_YEARS = [
  {
    year: "ឆ្នាំទី ១",
    title: "មូលដ្ឋានគ្រឹះ និងការគណនា",
    topics: "តក្កវិទ្យា • កាល់គុល I–III • ពិជគណិតលីនេអ៊ែរ • គណិតវិទ្យាដាច់",
    color: "bg-[#db073d]",
  },
  {
    year: "ឆ្នាំទី ២",
    title: "ការពង្រីកវិសាលភាព និងអនុវត្តន៍",
    topics: "សមីការឌីផេរ៉ង់ស្យែល • ប្រូបាប៊ីលីតេ និងស្ថិតិ • ទ្រឹស្តីចំនួន",
    color: "bg-[#0085dd]",
  },
  {
    year: "ឆ្នាំទី ៣",
    title: "គណិតវិទ្យាសុទ្ធ និងភាពតឹងរ៉ឹង",
    topics: "វិភាគចំនួនពិត • ពិជគណិតអរូបី • វិភាគចំនួនកុំផ្លិច • វិភាគលេខ",
    color: "bg-[#009b5e]",
  },
  {
    year: "ឆ្នាំទី ៤",
    title: "ជំនាញស៊ីជម្រៅ និងស្រាវជ្រាវ",
    topics: "តូប៉ូវិទ្យា • សមីការឌីផេរ៉ង់ស្យែលដោយផ្នែក • ធរណីមាត្រឌីផេរ៉ង់ស្យែល",
    color: "bg-[#b95a00]",
  },
];

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#fffafa]">
      {/* Lively Ambient Radial Studio Backdrop + Floating Math Glyphs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-28 -left-24 h-96 w-96 rounded-full opacity-45 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(219,7,61,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-24 h-[26rem] w-[26rem] rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(0,133,221,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full opacity-35 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(0,155,94,0.16) 0%, transparent 70%)",
          }}
        />

        {/* Subtle Floating Mathematical Glyphs */}
        <span className="animate-float-glyph absolute top-28 left-[7%] hidden lg:block font-serif text-5xl font-bold text-[#db073d]/10 select-none">
          ∫
        </span>
        <span
          className="animate-float-glyph absolute top-44 right-[8%] hidden lg:block font-serif text-4xl font-bold text-[#0085dd]/12 select-none"
          style={{ animationDelay: "1.4s" }}
        >
          ∑
        </span>
        <span
          className="animate-float-glyph absolute top-[54%] left-[5%] hidden xl:block font-serif text-4xl font-bold text-[#009b5e]/12 select-none"
          style={{ animationDelay: "2.6s" }}
        >
          ∇
        </span>
        <span
          className="animate-float-glyph absolute bottom-32 right-[6%] hidden xl:block font-serif text-5xl font-bold text-[#db073d]/10 select-none"
          style={{ animationDelay: "3.2s" }}
        >
          π
        </span>
      </div>

      {/* Floating Frosted-Glass Navigation Pill */}
      <div className="sticky top-3 z-30 px-3 sm:px-6">
        <header className="ios-glass mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#db073d] to-[#9c0329] text-white shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-3">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-extrabold text-[#160002]">
                គណិតវិទ្យាសាកលវិទ្យាល័យ
              </div>
              <div className="text-[11px] font-bold text-[#7e021f]">
                {BRAND_NAME} • {APP_VERSION}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <AuthButton />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd3d2] bg-white/90 px-3.5 py-2 text-xs font-extrabold text-[#7e021f] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffe9e8] active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>ទំព័រដើម</span>
            </Link>
          </div>
        </header>
      </div>

      {/* Main Floating Content Stack */}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-8 animate-panel-enter">
        {/* 1. Floating Hero Showcase Card */}
        <section className="floating-studio-card relative overflow-hidden rounded-3xl border border-[#ffd3d2] bg-white/90 p-6 sm:p-9 transition-all duration-300 hover:-translate-y-1">
          <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-gradient-to-br from-[#db073d]/12 to-[#ff8ca8]/5 blur-2xl" />

          <div className="relative space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-3.5 py-1 text-xs font-extrabold text-[#9c0329]">
                <Sparkles className="h-3.5 w-3.5 text-[#db073d]" />
                <span>អំពីយើង • About {BRAND_NAME}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b6dcf8] bg-[#e8f4fd] px-3 py-1 text-[11px] font-bold text-[#005c9e]">
                <Cpu className="h-3.5 w-3.5" />
                <span>University Math Studio {APP_VERSION}</span>
              </span>
            </div>

            <div className="space-y-3 max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#160002] khmer-prose leading-snug">
                លើកកម្ពស់ការសិក្សា{" "}
                <span className="bg-gradient-to-r from-[#db073d] via-[#b80533] to-[#0085dd] bg-clip-text text-transparent">
                  គណិតវិទ្យាសាកលវិទ្យាល័យ
                </span>{" "}
                ជាភាសាខ្មែរតាមបែបទំនើប
              </h1>
              <p className="text-sm sm:text-base text-[#47010d] leading-relaxed khmer-prose">
                <strong>{BRAND_NAME}</strong> គឺជាស្ទូឌីយោសិក្សា និងបង្រៀនគណិតវិទ្យាអន្តរកម្មជាភាសាខ្មែរ
                ដែលបង្រួមស្លាយបង្រៀន ក្រាបវិទ្យាសាស្ត្រ 2D/3D អន្តរកម្ម សៀវភៅអានលម្អិត រោងកុនវីដេអូ
                និងប្រព័ន្ធហ្វឹកហាត់ប្រឡងចូលក្នុងផ្ទៃតែមួយ ដើម្បីជួយនិស្សិត និងសាស្ត្រាចារ្យឈ្វេងយល់គណិតវិទ្យាឱ្យកាន់តែស៊ីជម្រៅ។
              </p>
            </div>

            {/* Floating Mini Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {STUDIO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#ffd3d2]/90 bg-[#fffafa] px-4 py-3.5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-[#f68f91]"
                >
                  <div className={`text-xl sm:text-2xl font-extrabold ${stat.accent}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#160002] mt-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[11px] font-medium text-[#620116]">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Floating Editorial Founder Spotlight Card (with Loeur_sovannra.png) */}
        <section className="floating-studio-card overflow-hidden rounded-3xl border border-[#ffd3d2] bg-white/95 p-5 sm:p-8 transition-all duration-300 hover:-translate-y-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left: Floating Portrait Frame */}
            <div className="md:col-span-5">
              <div className="group relative mx-auto max-w-[320px] md:max-w-none">
                {/* Ambient floating glow behind portrait */}
                <div className="pointer-events-none absolute -inset-2 rounded-[28px] bg-gradient-to-tr from-[#db073d]/25 via-[#ff8ca8]/15 to-[#0085dd]/20 blur-xl opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-2 border-white shadow-[0_24px_50px_-16px_rgba(22,0,2,0.35)] bg-[#140a0d]">
                  <Image
                    src="/images/loeur-sovannra.png"
                    alt={`${FOUNDER_NAME} (Loeur Sovannra) — ស្ថាបនិក ${BRAND_NAME}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 320px, 380px"
                    className="object-cover object-[50%_20%] transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Subtle bottom vignette for floating nameplate */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#120609]/90 via-[#120609]/40 to-transparent" />

                  {/* Floating Top-Left Founder Badge */}
                  <div className="animate-float-gentle absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#160002]/70 px-3 py-1 text-[11px] font-extrabold text-white backdrop-blur-md shadow-md">
                    <Award className="h-3.5 w-3.5 text-[#ff6b8b]" />
                    <span>ស្ថាបនិក • Founder</span>
                  </div>

                  {/* Floating Bottom Glass Nameplate */}
                  <div className="absolute inset-x-3.5 bottom-3.5 rounded-2xl border border-white/20 bg-white/15 px-4 py-2.5 backdrop-blur-md text-white">
                    <div className="text-base font-extrabold leading-tight">
                      {FOUNDER_NAME}
                    </div>
                    <div className="text-[11px] font-semibold text-[#ffd3d2]">
                      Loeur Sovannra • Lead Developer
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Founder Story, Vision Quote & Contact */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#db073d]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>ស្ថាបនិក និងអ្នកអភិវឌ្ឍន៍ប្រព័ន្ធ</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#160002] khmer-prose">
                  {FOUNDER_NAME}{" "}
                  <span className="text-base sm:text-lg font-bold text-[#7e021f]">
                    (Loeur Sovannra)
                  </span>
                </h2>
              </div>

              {/* Role Chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  "អ្នកផ្តួចផ្តើម KHMERTEX",
                  "រៀបចំកម្មវិធីសិក្សាគណិតវិទ្យា",
                  "Full-Stack Web Developer",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-3 py-1 text-xs font-bold text-[#620116]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#db073d]" />
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm sm:text-base text-[#47010d] leading-relaxed khmer-prose">
                ជាអ្នកផ្តួចផ្តើម និងអភិវឌ្ឍន៍ប្រព័ន្ធ <strong>{BRAND_NAME}</strong> ដោយមានបំណងកសាងឃ្លាំងឯកសារ
                និងឧបករណ៍បង្រៀនគណិតវិទ្យាកម្រិតឧត្តមសិក្សាជាភាសាខ្មែរឱ្យមានភាពម៉ត់ចត់ ស្តង់ដារទំនើប និងងាយស្រួលយល់សម្រាប់និស្សិតខ្មែរគ្រប់រូប។
              </p>

              {/* Editorial Vision Quote */}
              <blockquote className="relative rounded-2xl border-l-4 border-[#db073d] bg-[#fff5f6] px-5 py-4 text-xs sm:text-sm font-bold text-[#620116] khmer-prose leading-relaxed">
                <Quote className="mb-1.5 h-4 w-4 text-[#db073d]/70" />
                «គណិតវិទ្យាកម្រិតសាកលវិទ្យាល័យមិនគួរជារបាំងភាសា ឬរូបមន្តស្ងួតឡើយ — នៅពេលនិស្សិតអាចមើលឃើញ
                រំកិលក្រាប និងយល់ពីហេតុផលនៅពីក្រោយទ្រឹស្តីបទ ការសិក្សានឹងក្លាយជាការស្វែងយល់ដ៏រីករាយ។»
              </blockquote>

              {/* Interactive Contact Pill */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="mailto:loeur.sovannra1@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#db073d] to-[#b80533] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                >
                  <Mail className="h-4 w-4" />
                  <span>loeur.sovannra1@gmail.com</span>
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#7e021f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffe9e8] active:scale-95"
                >
                  <span>ស្វែងយល់មេរៀន</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Floating Mission Pillars (3-Column Hover-Lift Bento) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f7f9] text-[#0097a8]">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#160002]">
                បេសកកម្ម និងគុណតម្លៃស្នូល
              </h2>
              <p className="text-xs font-semibold text-[#620116]">
                Our Mission & Interactive Philosophy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MISSION_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`floating-studio-card rounded-3xl border border-[#ffd3d2] bg-white/95 p-6 space-y-3.5 transition-all duration-300 hover:-translate-y-1.5 ${pillar.borderHover}`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${pillar.iconBg} shadow-2xs`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#160002] khmer-prose">
                      {pillar.title}
                    </h3>
                    <div className="text-[11px] font-bold text-[#7e021f]">
                      {pillar.subtitle}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#47010d] leading-relaxed khmer-prose">
                    {pillar.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Floating 4-Year University Math Roadmap Card */}
        <section className="floating-studio-card rounded-3xl border border-[#ffd3d2] bg-white/95 p-6 sm:p-8 space-y-6 transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f7f0] text-[#009b5e]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#160002]">
                  ផែនទីកម្មវិធីសិក្សា ៤ ឆ្នាំ (១៥ មុខវិជ្ជាគោល)
                </h2>
                <p className="text-xs font-semibold text-[#620116]">
                  រៀបចំតាមលំដាប់ពីមូលដ្ឋានគ្រឹះ រហូតដល់កម្រិតស្រាវជ្រាវ
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#db073d] px-4 py-2 text-xs font-extrabold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#bb0533] active:scale-95"
            >
              <span>ចាប់ផ្តើមសិក្សាឥឡូវនេះ</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURRICULUM_YEARS.map((item) => (
              <div
                key={item.year}
                className="rounded-2xl border border-[#ffd3d2] bg-[#fffafa] p-4 space-y-2 transition-all duration-200 hover:-translate-y-1 hover:border-[#f68f91]"
              >
                <span
                  className={`inline-flex rounded-lg px-2.5 py-0.5 text-[11px] font-extrabold text-white ${item.color}`}
                >
                  {item.year}
                </span>
                <div className="text-sm font-extrabold text-[#160002] khmer-prose">
                  {item.title}
                </div>
                <p className="text-xs text-[#47010d] leading-relaxed khmer-prose">
                  {item.topics}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer maxWidthClass="max-w-5xl" />
    </div>
  );
}
