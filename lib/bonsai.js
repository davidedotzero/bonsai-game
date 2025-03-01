import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export const updateBonsaiStatus = async (bonsaiId, action) => {
  try {
    const bonsaiRef = doc(db, "bonsai", bonsaiId);
    const bonsaiSnap = await getDoc(bonsaiRef);

    if (bonsaiSnap.exists()) {
      const bonsaiData = bonsaiSnap.data();
      let { waterLevel, fertilizerLevel, sunlight, healthStatus, growthStage, isSick } = bonsaiData;

      isSick = isSick || false;  // ✅ กำหนดค่าเริ่มต้นให้ isSick เป็น false ถ้าไม่มีค่า

      // 🔄 ระบบรดน้ำ, ใส่ปุ๋ย, แสงแดด (ตามที่ทำไว้)
      if (action === "water") {
        waterLevel = Math.min(waterLevel + 10, 100);
        fertilizerLevel = Math.max(fertilizerLevel - 2, 0);
        sunlight = Math.max(sunlight - 1, 0);
      } else if (action === "fertilize") {
        fertilizerLevel = Math.min(fertilizerLevel + 10, 100);
        waterLevel = Math.max(waterLevel - 5, 0);
      } else if (action === "addSunlight") {
        sunlight = Math.min(sunlight + 5, 100);
        waterLevel = Math.max(waterLevel - 3, 0);
      } else if (action === "upgrade") {
        if (growthStage >= 3 && healthStatus === "ดีมาก") {
          growthStage += 1;
        }
      } else if (action === "heal") {
        if (isSick) {
          isSick = false;
          healthStatus = "ดี";
        }
      }

      // 🔄 ระบบโรค: น้ำ, ปุ๋ย, แสง ต่ำกว่า 20% → มีโอกาสป่วย
      if (waterLevel < 20 || fertilizerLevel < 20 || sunlight < 20) {
        healthStatus = "แย่";
        if (Math.random() < 0.3 && !isSick) {
          isSick = true;
          healthStatus = "ป่วย";
        }
      } else if (waterLevel > 80 && fertilizerLevel > 80 && sunlight > 80) {
        healthStatus = "ดีมาก";
      } else {
        healthStatus = isSick ? "ป่วย" : "ดี";
      }

      // 🔄 การเติบโต
      if (healthStatus === "ดีมาก" && growthStage < 5 && !isSick) {
        growthStage += 1;
      }

      // ✅ บันทึกการอัปเดตใน Firestore
      await updateDoc(bonsaiRef, {
        waterLevel,
        fertilizerLevel,
        sunlight,
        healthStatus,
        growthStage,
        isSick,
        lastUpdated: new Date(),
      });

      console.log(`✅ อัปเดตต้นไม้สำเร็จ! [${action}]`);
      return true;
    } else {
      console.error("❌ ไม่พบต้นไม้ในฐานข้อมูล");
      return false;
    }
  } catch (error) {
    console.error("❌ Error ในการอัปเดตต้นไม้:", error);
    return false;
  }
};

export const deleteBonsai = async (bonsaiId) => {
  try {
    const bonsaiRef = doc(db, "bonsai", bonsaiId);
    await deleteDoc(bonsaiRef);
    console.log(`✅ ลบต้นไม้สำเร็จ! [ID: ${bonsaiId}]`);
    return true;
  } catch (error) {
    console.error("❌ Error ในการลบต้นไม้:", error);
    return false;
  }
};
