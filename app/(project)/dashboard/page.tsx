import { handleAuth } from '@/app/actions/handle-auth';
import { auth } from '@/app/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 gap-5">
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        Protected Dashboard
      </h1>
      <p className="mt-4 text-center text-gray-600">
        Welcome to your dashboard!
      </p>
      <p className="mt-4 text-center text-gray-600">
        {session?.user?.email
          ? session?.user?.email
          : 'Usuario Nao esta logado'}
      </p>
      {session?.user?.email && (
        <form action={handleAuth}>
          <button
            type="submit"
            className="border rounded-md px-2 cursor-pointer"
          >
            Loggout
          </button>
        </form>
      )}
      <Link href="/pagamentos">Pagamentos</Link>
    </div>
  );
}
