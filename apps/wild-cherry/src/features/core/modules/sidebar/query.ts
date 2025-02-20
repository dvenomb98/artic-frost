import { z } from "zod";
import { DATA, SidebarDataValues } from "./data";

const SB_QUERY_KEY = "view";
const DEFAULT_VIEW: SidebarDataValues = "tools";

const VIEW_PARAM_SCHEMA = z.enum(
    Object.keys(DATA) as [SidebarDataValues, ...SidebarDataValues[]],
);

function safeParseViewParam(
    param: string | string[] | null,
): SidebarDataValues {
    if (!param) return DEFAULT_VIEW;

    const parsedParam = Array.isArray(param) ? param[0] : param;

    const result = VIEW_PARAM_SCHEMA.safeParse(parsedParam);
    if (!result.success) return DEFAULT_VIEW;

    return result.data;
}

export { safeParseViewParam, SB_QUERY_KEY };
