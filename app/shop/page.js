"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { buyItem } from "@/lib/shop";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [trees, setTrees] = useState([]);
  const [fertilizer, setFertilizer] = useState([]);  // ✅ เพิ่ม state สำหรับปุ๋ย
  const [coins, setCoins] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ฟังก์ชันดึงข้อมูลสินค้า (ทั่วไป)
  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "shop"));
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // ✅ ฟังก์ชันดึงข้อมูลต้นไม้
  const fetchTrees = async () => {
    const querySnapshot = await getDocs(collection(db, "shop/tree/trees"));
    setTrees(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // ✅ ฟังก์ชันดึงข้อมูลปุ๋ย
  const fetchFertilizer = async () => {
    const querySnapshot = await getDocs(collection(db, "shop/item/fertilizer"));
    setFertilizer(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));  // ✅ ใส่ใน `setFertilizer`
  };

  // ✅ ฟังก์ชันดึงเหรียญ
  const fetchCoins = async () => {
    const userRef = doc(db, "users", "Kita");
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setCoins(userSnap.data().coins ?? 0);
    }
  };

  // ✅ ฟังก์ชันซื้อสินค้า
  const handleBuy = async (itemId, type = "item") => {
    const success = await buyItem(itemId, type);
    if (success) {
      fetchCoins();
      alert("✅ ซื้อสำเร็จ!");
    } else {
      alert("❌ ซื้อไม่สำเร็จ!");
    }
  };

  // ✅ ดึงข้อมูลเมื่อโหลดหน้า
  useEffect(() => {
    fetchItems();
    fetchFertilizer();  // ✅ ดึงข้อมูลปุ๋ยด้วย
    fetchTrees();
    fetchCoins();
    setLoading(false);
  }, []);

  if (loading) return <p>กำลังโหลดร้านค้า...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">🛒 ร้านค้า</h2>
      <p>💰 เหรียญ: {coins !== null ? coins : "กำลังโหลด..."}</p>

      <h3 className="text-xl font-bold mt-4">🌳 ต้นไม้</h3>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {trees.map((tree) => (
          <div key={tree.id} className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">{tree.name}</h3>
            <p>สายพันธุ์: {tree.species}</p>
            <p>{tree.description}</p>
            <p>ราคา: {tree.price} เหรียญ</p>
            <button
              onClick={() => handleBuy(tree.id, "tree")}
              className="mt-2 px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-700"
              disabled={coins < tree.price}
            >
              ซื้อ
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold mt-4">🥕 ปุ๋ย</h3>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {fertilizer.map((item) => (
          <div key={item.id} className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p>{item.description}</p>
            <p>ราคา: {item.price} เหรียญ</p>
            <button
              onClick={() => handleBuy(item.id, "fertilizer")}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              disabled={coins < item.price}
            >
              ซื้อ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
