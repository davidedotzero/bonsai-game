import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const plantBonsai = async (userId, species) => {
  await addDoc(collection(db, "bonsai"), {
    userId,
    species,
    name: "บอนไซของฉัน",
    growthStage: 1,
    lastWatered: Timestamp.now(),
    sunlight: 50,
    waterLevel: 50,
    fertilizerLevel: 50,
    healthStatus: "ดี",
  });
};
