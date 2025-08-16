import AppNavbar from "@/components/app/AppNavbar";
import SignOutButton from "@/components/app/SignOutButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <div className="flex-1 bg-gradient-to-br from-background via-slate-50 to-slate-100 dark:from-background dark:via-slate-900 dark:to-slate-800">
        <div className="h-full">
          <div className="flex flex-col justify-center min-h-full px-6 py-8">
            <div className="mx-auto max-w-6xl text-center">
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl lg:text-7xl">
                PTW
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                Professional training management platform designed for coaches,
                trainers, and athletes
              </p>

              {session ? (
                <div className="mt-16">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-medium mb-12">
                    ✓ Signed in as {session.user.name}
                  </div>

                  <div className="flex gap-6 justify-center flex-wrap">
                    {session.user.appRole === "trainer" && (
                      <AppLinkCard
                        href="/trainer"
                        icon="🏃‍♂️"
                        title="Trainer Portal"
                        description="Manage training plans and track athlete progress"
                      />
                    )}

                    {session.user.role === "admin" && (
                      <AppLinkCard
                        href="/admin"
                        icon="⚡"
                        title="Admin Dashboard"
                        description="System administration and user management"
                      />
                    )}

                    {session.user.appRole !== "trainer" && session.user.role !== "admin" && (
                      <div className="relative p-8 bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 w-64 h-48 opacity-75">
                        <div className="text-2xl mb-4">🏆</div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          Player Portal
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          Track your training progress and view personalized workouts. Coming Soon
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-16">
                  <div className="flex gap-6 justify-center flex-wrap">
                    <AppLinkCard
                      href="/signup"
                      icon="🚀"
                      title="Get Started"
                      description="Create your account and join the platform"
                    />

                    <AppLinkCard
                      href="/login"
                      icon="🔐"
                      title="Sign In"
                      description="Access your existing account"
                    />
                  </div>
                </div>
              )}

              <div className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-center gap-8 text-xs">
                  <span className="text-slate-500 dark:text-slate-500">
                    v0.2.0
                  </span>
                  <Link
                    href="/releases"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Release Notes
                  </Link>
                  {session && <SignOutButton />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AppLinkCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

function AppLinkCard({ href, icon, title, description }: AppLinkCardProps) {
  return (
    <Link href={href} className="group">
      <div className="relative p-8 bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 w-64 h-48">
        <div className="text-2xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}

