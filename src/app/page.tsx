import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        <h1 className="mb-4 text-4xl font-bold">Subscription Manager Pro</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Manage all your subscriptions in one place with comprehensive analytics
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary px-8 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-lg border border-input bg-background px-8 py-3 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
