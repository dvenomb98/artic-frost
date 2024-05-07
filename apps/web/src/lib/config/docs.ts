import { CategoryType, RegistryMap } from "../types/docs";

export const mapCategoryToTitle: Record<CategoryType, string> = {
  intro: "Getting started",
  packages: "Packages",
  guides: "Guides",
  components: "Components",
};

export const initialCategoryMap: RegistryMap = {
  intro: [],
  packages: [],
  guides: [],
  components: [],
};

