import { useState } from "react";
import { updateBonsaiStatus } from "@/lib/bonsai";

export default function SunlightButton({ bonsaiId, refreshBonsai }) {
  const [loading, setLoading] = useState(false);

  const handleSunlight = async () => {
    setLoading(true);
    const success = await updateBonsaiStatus(bonsaiId, "addSunlight");
    if (success) {
      console.log("✅ เพิ่มแสงแดดสำเร็จ!");
      refreshBonsai();
    } else {
      console.error("❌ เพิ่มแสงแดดไม่สำเร็จ");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleSunlight}
      className="mt-2 px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700"
      disabled={loading}
    >
      {loading ? "🌞 กำลังเพิ่มแสงแดด..." : "🌞 เพิ่มแสงแดด +5%"}
    </button>
  );
}
