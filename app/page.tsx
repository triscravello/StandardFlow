import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-zinc-50 dark:bg-black">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-32 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Build Better Systems.
          <br />
          Learn with StandardFlow.
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
          A structured learning platform designed to help you stay consistent,
          track progress, and master your workflow without distractions.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/planner/week"
            className="rounded-full bg-black px-6 py-3 text-white font-medium hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Go to Weekly Plans
          </Link>

          <Link
            href="/lessons"
            className="rounded-full border border-zinc-300 px-6 py-3 font-medium hover:bg-zinc-100 transition dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Browse Lessons
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            title="Structured Lessons"
            description="Clear, focused content broken into actionable modules that eliminate overwhelm."
          />
          <FeatureCard
            title="Progress Tracking"
            description="Monitor completion, stay accountable, and build momentum with visible progress."
          />
          <FeatureCard
            title="Distraction-Free Design"
            description="Minimal interface built for deep work and intentional learning."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white">
          How It Works
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3 text-left">
          <Step number="01" title="Choose a Path">
            Select structured lessons tailored to your goals.
          </Step>
          <Step number="02" title="Complete Modules">
            Work through focused sessions designed for clarity and momentum.
          </Step>
          <Step number="03" title="Track Progress">
            Measure improvement and build consistency over time.
          </Step>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-black text-white dark:bg-white dark:text-black">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold">
            Ready to build your system?
          </h2>

          <p className="mt-4 text-zinc-400 dark:text-zinc-600">
            Start learning with structure and clarity today.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-block rounded-full bg-white text-black px-6 py-3 font-medium hover:bg-zinc-200 transition dark:bg-black dark:text-white dark:hover:bg-zinc-800"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ---------- Components ---------- */

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-400">{number}</p>
      <h3 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{children}</p>
    </div>
  );
}
