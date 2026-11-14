import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Database,
  UserCheck,
  ArrowLeft,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import AuthButton from "@/components/auth/AuthButton";
import { BRAND_NAME, FOUNDER_NAME, APP_VERSION } from "@/lib/appConfig";

export const metadata = {
  title: "គោលការណ៍ឯកជនភាព | KHMERTEX — គណិតវិទ្យាសាកលវិទ្យាល័យ",
  description:
    "គោលការណ៍ឯកជនភាពសម្រាប់ការប្រើប្រាស់គណនី Google និងការបញ្ចេញមតិលើប្រព័ន្ធសិក្សា KHMERTEX។",
};

export default function PrivacyPage() {
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
        <section className="rounded-2xl border border-[#ffd3d2] bg-white p-6 sm:p-8 shadow-xs">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#b3e6d1] bg-[#e7f7f0] px-3 py-1 text-xs font-bold text-[#006e42]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#009b5e]" />
            <span>គោលការណ៍ឯកជនភាព (Privacy Policy)</span>
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-[#160002] khmer-prose">
            ការការពារទិន្នន័យ និងឯកជនភាពអ្នកប្រើប្រាស់
          </h1>
          <p className="mt-2 text-xs text-[#620116]">
            ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖ វិច្ឆិកា ២០២៦ • គ្រប់គ្រងដោយ {BRAND_NAME} ({FOUNDER_NAME})
          </p>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#ffd3d2] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-[#160002]">
              <UserCheck className="h-5 w-5 text-[#db073d]" />
              <h2 className="text-base sm:text-lg font-bold">
                ១. ព័ត៌មានដែលយើងប្រមូល (Google Sign-In)
              </h2>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm text-[#47010d] leading-relaxed khmer-prose">
              នៅពេលអ្នកជ្រើសរើសចូលប្រើប្រាស់ដោយគណនី Google តាមរយៈ Firebase Authentication
              ប្រព័ន្ធនឹងទទួលតែព័ត៌មានមូលដ្ឋានដូចជា <strong>ឈ្មោះបង្ហាញ (Display Name)</strong>,{" "}
              <strong>អាសយដ្ឋានអ៊ីមែល (Email)</strong> និង <strong>រូបភាពគណនី (Profile Photo)</strong> ប៉ុណ្ណោះ។
              យើងមិនអាចមើលឃើញពាក្យសម្ងាត់ (Password) ឬទិន្នន័យឯកជនផ្សេងទៀតក្នុងគណនី Google របស់អ្នកឡើយ។
            </p>
          </section>

          <section className="rounded-2xl border border-[#ffd3d2] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-[#160002]">
              <Database className="h-5 w-5 text-[#0097a8]" />
              <h2 className="text-base sm:text-lg font-bold">
                ២. ការប្រើប្រាស់ និងរក្សាទុកទិន្នន័យមតិយោបល់
              </h2>
            </div>
            <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-[#47010d] leading-relaxed khmer-prose">
              <li>
                • មតិយោបល់ និងសំណួរដែលអ្នកបង្ហោះត្រូវបានរក្សាទុកលើ <strong>Google Cloud Firestore</strong>{" "}
                ដើម្បីបង្ហាញជូនសិស្ស និងគ្រូផ្សេងទៀតសិក្សាពិភាក្សារួមគ្នា។
              </li>
              <li>
                • ព័ត៌មានគណនីរបស់អ្នកមិនត្រូវបានលក់ ឬចែករំលែកទៅភាគីទីបីសម្រាប់គោលបំណងផ្សព្វផ្សាយពាណិជ្ជកម្មឡើយ។
              </li>
              <li>
                • អ្នកអាចចាកចេញពីគណនី (Sign Out) ឬលុបមតិផ្ទាល់ខ្លួនរបស់អ្នកបានគ្រប់ពេលវេលា។
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[#ffd3d2] bg-white p-6 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-[#160002]">
              ៣. ទំនាក់ទំនងអំពីឯកជនភាព
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#47010d] leading-relaxed khmer-prose">
              ប្រសិនបើអ្នកមានសំណួរ ឬសំណើសុំលុបទិន្នន័យណាមួយ សូមទាក់ទងមកកាន់{" "}
              <a
                href="mailto:loeur.sovannra1@gmail.com"
                className="font-bold text-[#db073d] hover:underline"
              >
                loeur.sovannra1@gmail.com
              </a>
              ។
            </p>
          </section>
        </div>
      </main>

      <Footer maxWidthClass="max-w-5xl" />
    </div>
  );
}
