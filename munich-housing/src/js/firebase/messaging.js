import { db } from './config.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

export const sendMessage = async (senderId, senderEmail, receiverId, listingId, listingTitle, messageBody) => {
  try {
    await addDoc(collection(db, "messages"), {
      senderId,
      senderEmail,
      receiverId,
      listingId,
      listingTitle,
      body: messageBody,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const getUserMessages = async (userId) => {
  try {
    // We get messages where the receiver is the current user
    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory since Firestore requires composite index for where + orderBy
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return messages;
  } catch (error) {
    console.error("Error getting messages:", error);
    return [];
  }
};
