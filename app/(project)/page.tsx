import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Micro SaaS
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your one-stop solution for all your micro SaaS needs.
        </p>
        <Link href="/login">
          <button className="mt-6 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
