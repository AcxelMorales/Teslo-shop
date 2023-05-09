import { Request } from 'express';
import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
): void => {
  const fileExt = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExt}`;

  callback(null, fileName);
};
