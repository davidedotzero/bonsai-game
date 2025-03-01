import { useState } from "react";
import { updateBonsaiStatus } from "@/lib/bonsai";

export default function WaterButton({ bonsaiId, refreshBonsai }) {
  const [loading, setLoading] = useState(false);

  const handleWater = async () => {
    setLoading(true);
    const success = await updateBonsaiStatus(bonsaiId, "water");
    if (success) {
      console.log("✅ รดน้ำสำเร็จ!");
      refreshBonsai();  // ✅ รีเฟรชข้อมูลต้นไม้
    } else {
      console.error("❌ รดน้ำไม่สำเร็จ");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleWater}
      className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      disabled={loading}
    >
      {loading ? "💧 กำลังรดน้ำ..." : "💧 รดน้ำ +10%"}
    </button>
  );
}
