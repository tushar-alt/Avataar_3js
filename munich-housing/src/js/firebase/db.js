import { db, storage } from './config.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file, userId) => {
  try {
    // Basic filename with timestamp
    const filename = `${userId}_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `listings/${filename}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

export const createListing = async (listingData) => {
  try {
    const docRef = await addDoc(collection(db, "listings"), {
      ...listingData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getListings = async () => {
  try {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const listings = [];
    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() });
    });
    return listings;
  } catch (error) {
    console.error("Error getting listings:", error);
    return [];
  }
};
