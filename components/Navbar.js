import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">
          <Link href="/">🌿 Bonsai Game</Link>
        </h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-green-300">
              🏠 Home
            </Link>
          </li>
          <li>
            <Link href="/shop" className="hover:text-green-300">
              🛒 Shop
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-green-300">
              🌱 Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
