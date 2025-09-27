import {DbSave} from "./types";

function getDefaultTitle(save: DbSave) {
  return save.title || `Saved Position #${save.id}`;
}

export {getDefaultTitle};
