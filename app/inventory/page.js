"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ฟังก์ชันดึงข้อมูลปุ๋ยจาก `users/Kita/inventory/items`
  const fetchInventory = async () => {
    const userRef = doc(db, "users", "Kita");  // ✅ ใช้ doc() ก่อน
    const itemsCollectionRef = collection(userRef, "inventory/items");  // ✅ แล้วใช้ collection()
    const querySnapshot = await getDocs(itemsCollectionRef);
    setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  // ✅ ฟังก์ชันใช้ปุ๋ย
  const useFertilizer = async (itemId) => {
    const itemRef = doc(db, "users", "Kita", "inventory/items", itemId);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      const itemData = itemSnap.data();
      if (itemData.quantity > 0) {
        await updateDoc(itemRef, {
          quantity: itemData.quantity - 1,
        });
        alert(`✅ ใช้ ${itemData.name} สำเร็จ!`);
        fetchInventory();  // ✅ อัปเดตข้อมูลหลังใช้
      } else {
        alert("❌ ปุ๋ยหมด!");
      }
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (loading) return <p>กำลังโหลดคลังกระเป๋า...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">🎒 คลังกระเป๋า</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p>จำนวน: {item.quantity}</p>
            <p>ประเภท: {item.type}</p>
            <button
              onClick={() => useFertilizer(item.id)}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              disabled={item.quantity <= 0}
            >
              ใช้
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
