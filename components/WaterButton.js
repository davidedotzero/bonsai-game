import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function WaterButton({ bonsaiId }) {
    const waterBonsai = async () => {
        const bonsaiRef = doc(db, "bonsai", bonsaiId);
        await updateDoc(bonsaiRef, {
            waterLevel: 100,
            lastWatered: new Date(),
        });
    };

    return (
        <button onClick={waterBonsai} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            💧 รดน้ำ
        </button>
    );
}
