import {Logo} from "./logo";

function MarketingNavBar() {
  return (
    <nav className="flex items-center justify-between gap-2 pt-5 container">
      <Logo />
    </nav>
  );
}

export {MarketingNavBar};
