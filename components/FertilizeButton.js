import { useState } from "react";
import { updateBonsaiStatus } from "@/lib/bonsai";

export default function FertilizeButton({ bonsaiId, refreshBonsai }) {
  const [loading, setLoading] = useState(false);

  const handleFertilize = async () => {
    setLoading(true);
    const success = await updateBonsaiStatus(bonsaiId, "fertilize");
    if (success) {
      console.log("✅ ใส่ปุ๋ยสำเร็จ!");
      refreshBonsai();  // ✅ รีเฟรชข้อมูลต้นไม้
    } else {
      console.error("❌ ใส่ปุ๋ยไม่สำเร็จ");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleFertilize}
      className="mt-2 px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-700"
      disabled={loading}
    >
      {loading ? "🥕 กำลังใส่ปุ๋ย..." : "🥕 ใส่ปุ๋ย +10%"}
    </button>
  );
}
