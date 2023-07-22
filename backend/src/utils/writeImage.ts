import { createWriteStream } from 'fs';
import { join } from 'path';

const writeImage = (dir: string, image: Express.Multer.File) => {
  return new Promise<void>((res, rej) => {
    const ws = createWriteStream(dir);
    ws.write(image.buffer, (error) => {
      if (error) rej();
      res();
    });
  });
};

export default writeImage;
