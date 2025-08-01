const VERSION = process.env.npm_package_version;

function MarketingNavBar() {
  return (
    <nav className="flex items-center justify-between gap-2 pt-5 container">
      <p className="text-lg font-semibold text-foreground">db/chess ♟️</p>
      <p className="text-sm text-muted-foreground">Alpha {VERSION}</p>
    </nav>
  );
}

export {MarketingNavBar};
