import { Suspense } from "react";
import LessonWorkspace from "@/components/layout/LessonWorkspace";
import SubjectHub from "@/components/layout/SubjectHub";
import { getLessonById, getSubjectsData } from "@/lib/lessons";

async function LessonLoader({ searchParams }) {
  const resolvedParams = await searchParams;
  const lessonId =
    typeof resolvedParams?.lesson === "string" ? resolvedParams.lesson : undefined;
  const subjectId =
    typeof resolvedParams?.subject === "string" ? resolvedParams.subject : undefined;
  const subTopicId =
    typeof resolvedParams?.subtopic === "string"
      ? resolvedParams.subtopic
      : undefined;

  if (!lessonId && !subjectId) {
    const subjects = await getSubjectsData();
    return <SubjectHub subjects={subjects} />;
  }

  const { subjects, lesson, activeSubjectId } = await getLessonById(
    lessonId,
    subjectId
  );

  return (
    <LessonWorkspace
      subjects={subjects}
      lesson={lesson}
      activeSubjectId={activeSubjectId}
      initialSubTopicId={subTopicId}
    />
  );
}

export default function HomePage({ searchParams }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fffafa] text-sm font-bold text-[#7e021f]">
          កំពុងផ្ទុកមេរៀន...
        </div>
      }
    >
      <LessonLoader searchParams={searchParams} />
    </Suspense>
  );
}
