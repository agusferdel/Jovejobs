import {promises as fs} from 'fs';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const delFile = async(file, folder)=> {
  if (!file) return;

  const filePath = path.join(__dirname, "../public/images", folder, file);
  await fs.unlink(filePath);
}