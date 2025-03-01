import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBK7AuHIfQtvXQnGdAk8f68qhRxVD8QtWg",
  authDomain: "bonsai-game-db.firebaseapp.com",
  projectId: "bonsai-game-db",
  storageBucket: "bonsai-game-db.firebasestorage.app",
  messagingSenderId: "649047988365",
  appId: "1:649047988365:web:1c243c2ef44dbefe7eaac4",
  measurementId: "G-TCNHBVJDKG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

async function getTreeSpecies(db) {
  try {
    const Trees = collection(db, 'bonsai');
    const treesSnapshot = await getDocs(Trees);
    const treesList = treesSnapshot.docs.map(doc => doc.data());
    console.log("✅ สายพันธุ์ต้นไม้:", treesList);  // ✅ แสดงผลใน Console
  } catch (error) {
    console.error("❌ Error fetching tree species:", error);  // ❌ แสดง Error ถ้ามีปัญหา
  }
}

// ✅ ต้องใส่ในฟังก์ชัน async เพื่อใช้ await
(async () => {
  await getTreeSpecies(db);
})();
