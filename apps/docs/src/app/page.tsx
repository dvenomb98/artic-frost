import Link from "next/link";

const LIST_OF_PACKAGES = [
  {
    name: "chess-lite",
    description: "A minimalistic headless chess library for Javascript.",
    href: "/chess-lite",
  },
  {
    name: "fresh-scroll",
    description:
      "A zero-dependency, TypeScript-ready infinite scroll component for React",
    href: "/fresh-scroll",
  },
];

export default function Home() {
  return (
    <section className="container max-w-md mx-auto text-center h-screen flex flex-col justify-center">
      <h2 className="text-muted-foreground">Daniel Bílek</h2>
      <h1 className="h1">Docs</h1>

      <p>A documentation for my open-source projects.</p>

      <div className="grid gap-4 mt-8">
        {LIST_OF_PACKAGES.map(pkg => (
          <div key={pkg.name}>
            <Link className="underline" href={pkg.href}>
              {pkg.name}
            </Link>
            <p className="text-muted-foreground">{pkg.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-muted-foreground text-sm">
        Learn more about me:{" "}
        <Link className="underline text-foreground" href="https://danielbilek.com">
          danielbilek.com
        </Link>
      </p>
    </section>
  );
}
