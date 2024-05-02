import { CategoryType, RegistryMap } from "../types/docs";

export const mapCategoryToTitle: Record<CategoryType, string> = {
  intro: "Getting started",
  guides: "Guides",
  components: "Components",
};

export const initialCategoryMap: RegistryMap = {
  intro: [],
  guides: [],
  components: [],
};

