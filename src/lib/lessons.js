import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads the master subjects.json index and checks lesson file availability.
 */
export async function getSubjectsData() {
  const filePath = path.join(DATA_DIR, "subjects.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  const subjects = parsed.subjects || [];

  return Promise.all(
    subjects.map(async (subject) => ({
      ...subject,
      lessons: await Promise.all(
        (subject.lessons || []).map(async (lesson) => ({
          ...lesson,
          isAvailable: lesson.file
            ? await fileExists(path.join(DATA_DIR, lesson.file))
            : false,
        }))
      ),
    }))
  );
}

function buildPlaceholderLesson(targetMeta, subjectId = "") {
  const subTopics = (targetMeta.subTopics || []).map((st) => ({
    id: st.id,
    titleKh: st.titleKh,
    titleEn: st.titleEn || "",
    slides: [
      {
        id: `${st.id}-placeholder`,
        type: "objective",
        titleKh: st.titleKh,
        content: [
          st.descriptionKh
            ? `ខ្លឹមសារមេរៀន៖ ${st.descriptionKh}`
            : "ខ្លឹមសារលម្អិតសម្រាប់ចំណុចរងនេះកំពុងស្ថិតក្នុងដំណាក់កាលរៀបចំ។",
          "ស្លាយបង្រៀន ក្រាបអន្តរកម្ម លំហាត់គំរូ និងលំហាត់អនុវត្ត នឹងត្រូវបានបន្ថែមក្នុងពេលឆាប់ៗនេះ។",
        ],
        teacherNotes:
          "មេរៀននេះត្រូវបានបញ្ចូលក្នុងមាតិកាមុខវិជ្ជា Calculus រួចរាល់ហើយ និងកំពុងរៀបចំខ្លឹមសារលម្អិត។",
      },
    ],
    detailedReading: {
      introduction:
        st.descriptionKh ||
        "ឯកសារអានលម្អិតសម្រាប់ចំណុចរងនេះកំពុងរៀបចំ។",
      sections: [
        {
          headingKh: st.titleKh,
          body:
            st.descriptionKh ||
            "ខ្លឹមសារពន្យល់លម្អិតនឹងត្រូវបានបន្ថែមក្នុងពេលឆាប់ៗនេះ។",
        },
      ],
      summary:
        "សូមជ្រើសរើសមេរៀនទី ២ (លីមីត និងភាពជាប់នៃអនុគមន៍) នៅក្នុងរបារចំហៀង ដើម្បីសិក្សាខ្លឹមសារពេញលេញ។",
    },
    workedExamples: [],
    practiceExercises: [],
  }));

  return {
    id: targetMeta.id,
    subject: subjectId,
    titleKh: targetMeta.titleKh,
    titleEn: targetMeta.titleEn || "",
    partKh: targetMeta.partKh || "",
    isPlaceholder: true,
    subTopics,
  };
}

/**
 * Finds a lesson entry by ID in subjects.json and loads its JSON content.
 * Supports opening a book/subject via subjectId (loads its first available lesson,
 * or returns null lesson if the subject has no lessons yet).
 */
export async function getLessonById(lessonId, subjectId) {
  const subjects = await getSubjectsData();

  if (subjectId && !lessonId) {
    const targetSubject = subjects.find((s) => s.id === subjectId);
    const subjectLessons = targetSubject?.lessons || [];
    if (subjectLessons.length === 0) {
      return {
        subjects,
        lesson: null,
        activeSubjectId: targetSubject?.id || subjectId,
      };
    }
    const targetMeta =
      subjectLessons.find((l) => l.isAvailable) || subjectLessons[0];
    if (!targetMeta.isAvailable) {
      return {
        subjects,
        lesson: buildPlaceholderLesson(targetMeta, targetSubject.id),
        activeSubjectId: targetSubject.id,
      };
    }
    const lessonPath = path.join(DATA_DIR, targetMeta.file);
    const rawLesson = await fs.readFile(lessonPath, "utf-8");
    const lesson = JSON.parse(rawLesson);
    return { subjects, lesson, activeSubjectId: targetSubject.id };
  }

  const allLessonsWithSubject = subjects.flatMap((s) =>
    (s.lessons || []).map((l) => ({ ...l, _subjectId: s.id }))
  );

  if (allLessonsWithSubject.length === 0) {
    return { subjects, lesson: null, activeSubjectId: subjectId || null };
  }

  const matched = lessonId
    ? allLessonsWithSubject.find((l) => l.id === lessonId)
    : null;
  const targetMeta =
    matched ||
    allLessonsWithSubject.find((l) => l.isAvailable) ||
    allLessonsWithSubject[0];

  if (!targetMeta.isAvailable) {
    return {
      subjects,
      lesson: buildPlaceholderLesson(targetMeta, targetMeta._subjectId),
      activeSubjectId: targetMeta._subjectId,
    };
  }

  const lessonPath = path.join(DATA_DIR, targetMeta.file);
  const rawLesson = await fs.readFile(lessonPath, "utf-8");
  const lesson = JSON.parse(rawLesson);

  return {
    subjects,
    lesson,
    activeSubjectId: lesson.subject || targetMeta._subjectId,
  };
}
