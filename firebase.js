
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// Replace these values with your Firebase project details.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Save customer food review

async function saveReview(restaurantId, foodId, stars, text) {
  if (!restaurantId || !foodId || !Number.isInteger(stars) ||
      stars < 1 || stars > 5 || !text.trim()) {
    throw new Error("Invalid review details");
  }

  return await addDoc(collection(db, "reviews"), {
    restaurantId,
    foodId,
    stars,
    text: text.trim(),
    createdAt: serverTimestamp()
  });
}

// Get restaurant reviews

async function getRestaurantReviews(restaurantId) {
  const q = query(
    collection(db, "reviews"),
    where("restaurantId", "==", restaurantId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Restaurant owner registration

async function registerOwner(email, password) {
  return await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
}

// Restaurant owner login

async function loginOwner(email, password) {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

// Owner logout

async function logoutOwner() {
  return await signOut(auth);
}

// Upload food image

async function uploadFoodImage(file) {
  const imageRef = ref(
    storage,
    "food-images/" + Date.now() + "-" + file.name
  );

  await uploadBytes(imageRef, file);

  return await getDownloadURL(imageRef);
}

// Export functions

export {
  app,
  db,
  auth,
  storage,
  saveReview,
  getRestaurantReviews,
  registerOwner,
  loginOwner,
  logoutOwner,
  uploadFoodImage
};
