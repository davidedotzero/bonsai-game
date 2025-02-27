"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [bonsaiList, setBonsaiList] = useState([]); // ✅ ตั้งค่าเริ่มต้นเป็น Array เปล่า

  useEffect(() => {
    const fetchBonsai = async () => {
      const querySnapshot = await getDocs(collection(db, "bonsai"));
      setBonsaiList(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchBonsai();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-700">🌿 Bonsai Garden</h1>
      <p className="text-lg text-gray-600">ปลูกและดูแลต้นบอนไซของคุณ!</p>
      <Link href="/dashboard">
        <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-700">
          เริ่มเล่น
        </button>
      </Link>

      {/* ✅ แสดงต้นไม้เฉพาะเมื่อ bonsaiList มีข้อมูล */}
      {bonsaiList.length > 0 ? (
        bonsaiList.map((bonsai) => (
          <div key={bonsai.id} className="p-4 bg-white shadow-md rounded-lg mt-4">
            <h3 className="text-lg font-semibold">{bonsai.name}</h3>
            <p>สายพันธุ์: {bonsai.species}</p>
            <p>ระดับการเติบโต: {bonsai.growthStage}</p>
          </div>
        ))
      ) : (
        <p className="mt-4 text-gray-600">ยังไม่มีต้นไม้ในสวน</p>
      )}
    </div>
  );
}
