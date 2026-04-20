import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">AksChim</h1>
          <div className="space-x-4">
            <Link href="/" className="hover:text-blue-600 font-bold">Home</Link>
            <Link href="/products" className="hover:text-blue-600">Produk</Link>
            <Link href="/cart" className="hover:text-blue-600">Cart</Link>
            <Link href="/about" className="hover:text-blue-600">Tentang</Link>
            <Link href="/auth/signin" className="hover:text-blue-600">Login</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Selamat Datang di AksChim</h2>
          <p className="text-xl text-gray-600 mb-8">Koleksi aksesoris terlengkap dan termurah se-Indonesia</p>
          <Link href="/products" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">
            Mulai Belanja Sekarang
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg">
            <h3 className="text-3xl mb-2">🪙</h3>
            <p className="font-bold">Kalung & Liontin</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg">
            <h3 className="text-3xl mb-2">✨</h3>
            <p className="font-bold">Gelang & Perhiasan</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg">
            <h3 className="text-3xl mb-2">💎</h3>
            <p className="font-bold">Cincin & Batu Mulia</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg">
            <h3 className="text-3xl mb-2">👂</h3>
            <p className="font-bold">Anting & Earring</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg">
            <h3 className="text-3xl mb-2">⌚</h3>
            <p className="font-bold">Jam Tangan & Aksesoris</p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">🚚 Pengiriman Cepat</h3>
              <p className="text-gray-600">Gratis ongkir untuk pembelian di atas Rp 500.000</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">✅ Kualitas Terjamin</h3>
              <p className="text-gray-600">100% Original & Bergaransi</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">💰 Harga Terbaik</h3>
              <p className="text-gray-600">Harga paling kompetitif di pasaran</p>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Dapatkan Penawaran Spesial</h3>
          <p className="mb-6">Daftar sekarang dan dapatkan diskon 20% untuk pembelian pertama Anda</p>
          <Link href="/auth/register" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
            Daftar Sekarang
          </Link>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 AksChim. Semua hak cipta dilindungi. | <Link href="/about" className="hover:text-blue-400">Tentang Kami</Link></p>
        </div>
      </footer>
    </div>
  )
}