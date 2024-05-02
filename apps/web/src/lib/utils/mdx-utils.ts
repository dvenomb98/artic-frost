import fs from "fs";
import path from "path";
import { MdxFile } from "../types/docs";

const dirPath = path.join(process.cwd(), "__registry__", "all");

/**
 * Return files from generated directory __ registry __ at build time
**/
export async function getDocsFiles() {
  "use server"
  try {
    const files = await fs.promises.readdir(dirPath);
    const jsonFiles = files.filter(file => path.extname(file) === '.json');
    
    const documents = await Promise.all(jsonFiles.map(async file => {
      const filePath = path.join(dirPath, file);
      const data = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(data)
    }));
    return documents as MdxFile[]
  } catch (error: any) {
    console.error('Failed to read documents:', error);
    throw new Error("Failed to read documents: " + error?.message); 
  }
}
