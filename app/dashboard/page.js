"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import WaterButton from "@/components/WaterButton";

export default function Dashboard() {
  const [bonsaiList, setBonsaiList] = useState([]);

  useEffect(() => {
    const fetchBonsai = async () => {
      const querySnapshot = await getDocs(collection(db, "bonsai"));
      setBonsaiList(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchBonsai();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">🌱 สวนของฉัน</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {bonsaiList.map((bonsai) => (
          <div key={bonsai.id} className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">{bonsai.name}</h3>
            <p>สายพันธุ์: {bonsai.species}</p>
            <p>ระดับการเติบโต: {bonsai.growthStage}</p>
            <WaterButton bonsaiId={bonsai.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
