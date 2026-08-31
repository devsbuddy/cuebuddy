import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const scriptsRef = collection(db, 'scripts')

// Live-subscribes to the current user's scripts, most recently updated first.
export function subscribeToScripts(userId, callback) {
  const q = query(
    scriptsRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
  )
  return onSnapshot(q, (snapshot) => {
    const scripts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(scripts)
  })
}

export async function getScript(id) {
  const snap = await getDoc(doc(db, 'scripts', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createScript(userId, { title, content }) {
  const docRef = await addDoc(scriptsRef, {
    userId,
    title,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateScript(id, { title, content }) {
  await updateDoc(doc(db, 'scripts', id), {
    title,
    content,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteScript(id) {
  await deleteDoc(doc(db, 'scripts', id))
}
