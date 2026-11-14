import Link from "next/link";
import {
  GraduationCap,
  Target,
  Sparkles,
  UserCheck,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import AuthButton from "@/components/auth/AuthButton";
import { BRAND_NAME, FOUNDER_NAME, APP_VERSION } from "@/lib/appConfig";

export const metadata = {
  title: "អំពីយើង | KHMERTEX — គណិតវិទ្យាសាកលវិទ្យាល័យ",
  description:
    "ព័ត៌មានអំពីក្រុមអភិវឌ្ឍន៍ KHMERTEX ស្ថាបនិក លឿ សុវណ្ណរ៉ា និងបេសកកម្មលើកកម្ពស់ការសិក្សាគណិតវិទ្យាជាភាសាខ្មែរ។",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffafa]">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#ffd3d2] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs transition-transform duration-150 group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-[#160002]">
                គណិតវិទ្យាសាកលវិទ្យាល័យ
              </div>
              <div className="text-[11px] font-semibold text-[#7e021f]">
                {BRAND_NAME} • {APP_VERSION}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <AuthButton />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-3 py-1.5 text-xs font-bold text-[#7e021f] transition-all duration-150 hover:bg-[#ffe9e8] active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>ទំព័រដើម</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-6 animate-panel-enter">
        {/* Hero Card */}
        <section className="rounded-2xl border border-[#ffd3d2] bg-white p-6 sm:p-8 shadow-xs">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-3 py-1 text-xs font-bold text-[#9c0329]">
            <Sparkles className="h-3.5 w-3.5 text-[#db073d]" />
            <span>អំពីយើង (About Us)</span>
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-[#160002] khmer-prose">
            {BRAND_NAME} — University Math Studio
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#47010d] leading-relaxed khmer-prose">
            <strong>{BRAND_NAME}</strong> គឺជាគម្រោងអភិវឌ្ឍន៍ប្រព័ន្ធសិក្សា និងបង្រៀនគណិតវិទ្យាកម្រិតសាកលវិទ្យាល័យអន្តរកម្មជាភាសាខ្មែរ
            ដែលរួមបញ្ចូលស្លាយបង្រៀន ក្រាបវិទ្យាសាស្ត្រអន្តរកម្ម ឯកសារអានលម្អិត លំហាត់គំរូ និងកម្រងលំហាត់អនុវត្តន៍
            ដើម្បីជួយទាំងសាស្ត្រាចារ្យ និងនិស្សិតសិក្សាប្រកបដោយប្រសិទ្ធភាព។
          </p>
        </section>

        {/* Founder & Mission Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-[#ffd3d2] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe9e8] text-[#db073d]">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#160002]">
                  ស្ថាបនិក និងអ្នកអភិវឌ្ឍន៍
                </h2>
                <p className="text-xs text-[#620116]">Founder & Lead Developer</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[#ffe9e8] bg-[#fffafa] p-4">
              <div className="text-base font-bold text-[#9c0329]">
                {FOUNDER_NAME} (Loeur Sovannra)
              </div>
              <p className="mt-1.5 text-xs sm:text-sm text-[#47010d] leading-relaxed khmer-prose">
                អ្នកផ្តួចផ្តើម និងអភិវឌ្ឍន៍ប្រព័ន្ធ <strong>{BRAND_NAME}</strong> ក្នុងគោលបំណងកសាងឃ្លាំងឯកសារ
                និងឧបករណ៍បង្រៀនគណិតវិទ្យាកម្រិតឧត្តមសិក្សាជាភាសាខ្មែរឱ្យមានស្តង់ដារទំនើប និងងាយយល់។
              </p>
              <div className="mt-3 text-xs font-semibold text-[#620116]">
                ទំនាក់ទំនង៖{" "}
                <a
                  href="mailto:loeur.sovannra1@gmail.com"
                  className="text-[#db073d] hover:underline"
                >
                  loeur.sovannra1@gmail.com
                </a>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#ffd3d2] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f7f9] text-[#0097a8]">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#160002]">
                  បេសកកម្មរបស់យើង
                </h2>
                <p className="text-xs text-[#620116]">Our Mission</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-[#47010d] leading-relaxed khmer-prose">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#db073d]" />
                <span>
                  បកប្រែ និងរៀបរៀងមេរៀនគណិតវិទ្យាកម្រិតសាកលវិទ្យាល័យជាភាសាខ្មែរត្រឹមត្រូវតាមគោលការណ៍គរុកោសល្យ។
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0097a8]" />
                <span>
                  ប្រែក្លាយរូបមន្តអរូបីឱ្យក្លាយជាក្រាបអន្តរកម្មដែលនិស្សិតអាចមើលឃើញ និងពិសោធន៍ផ្ទាល់។
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#009b5e]" />
                <span>
                  បង្កើតសហគមន៍សិក្សាដែលនិស្សិត និងគ្រូអាចពិភាក្សាសំណួរគណិតវិទ្យាតាម LaTeX បានភ្លាមៗ។
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Curriculum Scope */}
        <section className="rounded-2xl border border-[#ffd3d2] bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f7f0] text-[#009b5e]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#160002]">
                ចក្ខុវិស័យកម្មវិធីសិក្សា
              </h2>
              <p className="text-xs text-[#620116]">
                ពីកម្រិតឆ្នាំទី ១ ដល់ ឆ្នាំទី ៤ (១៥ មុខវិជ្ជាគោល)
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-[#47010d] leading-relaxed khmer-prose">
            សៀវភៅទាំង ១៥ មុខវិជ្ជាត្រូវបានរៀបចំតាមលំដាប់លំដោយនៃចំណេះដឹង ចាប់ពីតក្កវិទ្យា និងវិធីសាស្ត្របញ្ជាក់
            កាល់គុល ពិជគណិតលីនេអ៊ែរ រហូតដល់ វិភាគចំនួនពិត ពីជគណិតអរូបី និងតូប៉ូវិទ្យា
            ដើម្បីឱ្យនិស្សិតមានមូលដ្ឋានរឹងមាំគ្រប់ជំហាន។
          </p>
        </section>
      </main>

      <Footer maxWidthClass="max-w-5xl" />
    </div>
  );
}
