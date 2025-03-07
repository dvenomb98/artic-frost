import {CATEGORY_ORDER} from "./definitions";
import {FileData} from "./generators";

function getPackageFromPathname(pathname: string) {
  if (!pathname) return null;
  const parts = pathname.split("/");
  return parts.length >= 2 ? parts[1] : null;
}

function sortByCategory(a: string, b: string): number {
  const orderA = CATEGORY_ORDER[a as keyof typeof CATEGORY_ORDER] ?? 999;
  const orderB = CATEGORY_ORDER[b as keyof typeof CATEGORY_ORDER] ?? 999;
  return orderA - orderB;
}

function sortByOrder(a: FileData, b: FileData): number {
  const orderA = a.metadata?.order ?? 999;
  const orderB = b.metadata?.order ?? 999;
  return orderA - orderB;
}

function sortGroups(groups: Record<string, FileData[]>) {
  return Object.entries(groups)
    .sort(([a], [b]) => sortByCategory(a, b))
    .reduce(
      (acc, [category, items]) => {
        acc[category] = items.sort((a, b) => sortByOrder(a, b));
        return acc;
      },
      {} as Record<string, FileData[]>
    );
}

export {getPackageFromPathname, sortByCategory, sortByOrder, sortGroups};
