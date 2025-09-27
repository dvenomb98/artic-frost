import { ROUTES } from "@/lib/routes";
import Link from "next/link";

function Logo() {
  return (
    <Link href={ROUTES.INDEX}>
      <p className="text-lg font-semibold text-foreground">db/chess ♟️</p>
    </Link>
  );
}

export {Logo};