import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

function getLocalKey(uid, progressKey) {
  return `ums-progress:${uid || "guest"}:${progressKey}`;
}

export async function loadUserProgress(uid, progressKey) {
  if (!progressKey) return null;

  let localData = null;
  try {
    const raw = localStorage.getItem(getLocalKey(uid, progressKey));
    if (raw) localData = JSON.parse(raw);
  } catch {
    // ignore storage errors
  }

  if (!uid) return localData;

  try {
    const snap = await getDoc(doc(db, "users", uid, "progress", progressKey));
    if (snap.exists()) {
      const remote = snap.data();
      const remoteTs = Number(remote.clientUpdatedAt || 0);
      const localTs = Number(localData?.clientUpdatedAt || 0);
      if (!localData || remoteTs >= localTs) {
        try {
          localStorage.setItem(getLocalKey(uid, progressKey), JSON.stringify(remote));
        } catch {
          // ignore
        }
        return remote;
      }
    }
  } catch {
    // Fall back to localData if offline or Firestore rules restrict
  }

  return localData;
}

export async function saveUserProgress(uid, progressKey, payload) {
  if (!progressKey) return;
  const record = {
    ...payload,
    clientUpdatedAt: Date.now(),
  };

  try {
    localStorage.setItem(getLocalKey(uid, progressKey), JSON.stringify(record));
  } catch {
    // ignore storage errors
  }

  if (!uid) return;

  try {
    await setDoc(
      doc(db, "users", uid, "progress", progressKey),
      {
        ...record,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // ignore Firestore errors gracefully
  }
}
