import { access } from "node:fs/promises";

export default async function isItemExist(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch(_err) {
    return false;
  }
};