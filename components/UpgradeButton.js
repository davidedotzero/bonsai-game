import { useState } from "react";
import { updateBonsaiStatus } from "@/lib/bonsai";

export default function UpgradeButton({ bonsaiId, refreshBonsai }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const success = await updateBonsaiStatus(bonsaiId, "upgrade");
    if (success) {
      console.log("✅ อัปเกรดสำเร็จ!");
      refreshBonsai();
    } else {
      console.error("❌ อัปเกรดไม่สำเร็จ");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleUpgrade}
      className="mt-2 px-4 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
      disabled={loading}
    >
      {loading ? "🌱 กำลังอัปเกรด..." : "🌱 อัปเกรดต้นไม้"}
    </button>
  );
}
