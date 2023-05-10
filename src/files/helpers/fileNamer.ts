import { Request } from 'express';
import { v4 as uuid } from 'uuid';

export const fileNamer = (
  _: any,
  file: Express.Multer.File,
  callback: Function,
): void => {
  const fileExt: string = file.mimetype.split('/')[1];
  const fileName: string = `${uuid()}.${fileExt}`;

  callback(null, fileName);
};
