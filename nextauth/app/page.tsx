
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0c10] text-[#e5e7eb] flex items-center justify-center px-6">

      <div className="w-full max-w-2xl">

        
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          Simple authentication
          <br />
          <span className="text-white">that actually works</span>
        </h1>

        
        <p className="text-sm text-white/50 max-w-md leading-relaxed mb-8">
          A full-stack auth system with email verification, JWT cookies,
          and protected routes. Built with Next.js, MongoDB, and Nodemailer.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mb-12">
          <Link
            href="/signup"
            className="bg-white text-black px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            Create account
          </Link>

          <Link
            href="/login"
            className="border border-white/20 px-5 py-2.5 rounded-md text-sm hover:border-white/40 transition"
          >
            Login
          </Link>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-medium text-white mb-1">JWT auth</p>
            <p className="text-white/40">
              Secure cookies, no localStorage hacks.
            </p>
          </div>

          <div>
            <p className="font-medium text-white mb-1">Email verification</p>
            <p className="text-white/40">
              Nodemailer with Mailtrap for testing flows.
            </p>
          </div>

          <div>
            <p className="font-medium text-white mb-1">Route protection</p>
            <p className="text-white/40">
              Middleware-based access control.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-white/30">
          Built with Next.js · MongoDB · Nodemailer
        </p>

      </div>
    </main>
  );
}

