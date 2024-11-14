import { z } from "zod";

const CATEGORY_ORDER = {
  "Getting Started": 1,
  Examples: 3,
  "API": 2,
} as const;

type Category = keyof typeof CATEGORY_ORDER;

const METADATA_SCHEMA = z.object({
    category: z.enum(Object.keys(CATEGORY_ORDER) as [Category, ...Category[]]),
    title: z.string(),
    order: z.number().optional().default(999),
  })

export { METADATA_SCHEMA, CATEGORY_ORDER };
