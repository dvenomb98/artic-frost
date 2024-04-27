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

export const categoryIndex: Record<CategoryType, number> = {
  intro: 0,
  guides: 1,
  components: 2,
};
