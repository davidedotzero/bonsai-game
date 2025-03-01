import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, addDoc, setDoc } from "firebase/firestore";

// ✅ ฟังก์ชันซื้อสินค้า (ต้นไม้และอื่น ๆ)
export const buyItem = async (itemId, type = "item") => {
    try {
        console.log("🔥 กำลังซื้อสินค้า:", itemId, "ประเภท:", type);  // 🔥 DEBUG

        const itemRef = doc(
            db,
            type === "tree"
                ? "shop/tree/trees"
                : type === "fertilizer"
                    ? "shop/item/fertilizer"
                    : "shop",
            itemId
        );
        const itemSnap = await getDoc(itemRef);
        const userRef = doc(db, "users", "Kita");
        const userSnap = await getDoc(userRef);

        console.log("🔥 itemSnap.exists():", itemSnap.exists());  // 🔥 DEBUG
        console.log("🔥 userSnap.exists():", userSnap.exists());  // 🔥 DEBUG

        if (itemSnap.exists() && userSnap.exists()) {
            const itemData = itemSnap.data();
            const userData = userSnap.data();

            console.log("🔥 itemData:", itemData);  // 🔥 DEBUG
            console.log("🔥 userData:", userData);  // 🔥 DEBUG

            if (userData.coins >= itemData.price) {
                await updateDoc(userRef, {
                    coins: userData.coins - itemData.price,
                });
                console.log("✅ หักเหรียญสำเร็จ!");

                // ✅ ถ้าเป็นต้นไม้ → เพิ่มใน `bonsai` Collection
                if (type === "tree") {
                    const bonsaiRef = collection(db, "bonsai");
                    await addDoc(bonsaiRef, {
                        name: itemData.name ?? "Unknown",
                        species: itemData.species ?? "Unknown",
                        waterLevel: 50,
                        fertilizerLevel: 50,
                        sunlight: 50,
                        healthStatus: "ดี",
                        growthStage: 1,
                        isSick: false,
                        lastUpdated: new Date(),
                    });
                }

                if (type === "organic") {
                    const inventoryRef = doc(db, "users/Kita");
                    const itemsCollectionRef = collection(inventoryRef, "inventory/items");
                    const itemDocRef = doc(itemsCollectionRef, itemId);
                    const inventorySnap = await getDoc(itemDocRef);

                    console.log("🔥 inventorySnap.exists():", inventorySnap.exists());  // 🔥 DEBUG

                    if (inventorySnap.exists()) {
                        await updateDoc(itemDocRef, {
                            quantity: inventorySnap.data().quantity + 1,
                        });
                        console.log("✅ เพิ่มจำนวนปุ๋ยสำเร็จ!");
                    } else {
                        await setDoc(itemDocRef, {
                            name: itemData.name,
                            type: "fertilizer",
                            quantity: 1,
                            effect: itemData.effect,
                            price: itemData.price,
                        });
                        console.log("✅ สร้างข้อมูลปุ๋ยใหม่สำเร็จ!");
                    }
                }

                console.log(`✅ ซื้อ ${itemData.name} สำเร็จ!`);
                return true;
            } else {
                console.log("❌ เหรียญไม่พอ!");
                return false;
            }
        } else {
            console.log("❌ ไม่พบสินค้าหรือผู้ใช้!");
            return false;
        }
    } catch (error) {
        console.error("❌ Error ซื้อสินค้า:", error);
        return false;
    }
};
