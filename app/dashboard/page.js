"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import WaterButton from "@/components/WaterButton";
import FertilizeButton from "@/components/FertilizeButton";
import SunlightButton from "@/components/SunlightButton";
import UpgradeButton from "@/components/UpgradeButton";
import DeleteButton from "@/components/DeleteButton";

export default function Dashboard() {
  const [bonsaiList, setBonsaiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBonsai = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "bonsai"));
      const bonsaiData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBonsaiList(bonsaiData);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching bonsai:", error);
    }
  };

  useEffect(() => {
    fetchBonsai();
  }, []);

  if (loading) {
    return <p className="text-center mt-6">กำลังโหลดข้อมูลต้นไม้... 🌱</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🌱 สวนของฉัน</h2>
      <div className="grid grid-cols-2 gap-4">
        {bonsaiList.map((bonsai) => (
          <div key={bonsai.id} className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">{bonsai.name}</h3>
            <p>สายพันธุ์: {bonsai.species}</p>
            <p>ระดับการเติบโต: {bonsai.growthStage}</p>
            <p>ความชื้น: {bonsai.waterLevel}%</p>
            <p>ปุ๋ย: {bonsai.fertilizerLevel}%</p>
            <p>แสงแดด: {bonsai.sunlight}%</p>
            <p>สถานะ: {bonsai.healthStatus}</p>
            <WaterButton bonsaiId={bonsai.id} refreshBonsai={fetchBonsai} />
            <FertilizeButton bonsaiId={bonsai.id} refreshBonsai={fetchBonsai} />
            <SunlightButton bonsaiId={bonsai.id} refreshBonsai={fetchBonsai} />
            <UpgradeButton bonsaiId={bonsai.id} refreshBonsai={fetchBonsai} />
            <DeleteButton bonsaiId={bonsai.id} refreshBonsai={fetchBonsai} /> 
          </div>
        ))}
      </div>
    </div>
  );
}
