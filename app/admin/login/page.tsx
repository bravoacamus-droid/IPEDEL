import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Acceso administrativo" };

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 p-6">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center">
          <Image
            src="/logo-vertical.png"
            alt="IPE del Perú"
            width={120}
            height={120}
            className="h-20 w-auto"
            priority
          />
          <h1 className="mt-6 text-xl font-semibold text-ink-900">Acceso administrativo</h1>
          <p className="mt-1 text-sm text-ink-500">Solo personal autorizado.</p>
        </div>
        <div className="mt-8">
          <LoginForm searchParamsPromise={searchParams} />
        </div>
      </div>
    </div>
  );
}
