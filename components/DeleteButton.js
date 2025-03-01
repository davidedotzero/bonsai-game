import { useState } from "react";
import { deleteBonsai } from "@/lib/bonsai";

export default function DeleteButton({ bonsaiId, refreshBonsai }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือว่าต้องการทำลายต้นไม้นี้?");
    if (!confirmDelete) return;

    setLoading(true);
    const success = await deleteBonsai(bonsaiId);
    if (success) {
      console.log("✅ ทำลายต้นไม้สำเร็จ!");
      refreshBonsai();  // ✅ รีเฟรชข้อมูลต้นไม้หลังลบ
    } else {
      console.error("❌ ทำลายต้นไม้ไม่สำเร็จ");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      className="mt-2 px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700"
      disabled={loading}
    >
      {loading ? "🗑️ กำลังลบ..." : "🗑️ ทำลายต้นไม้"}
    </button>
  );
}
