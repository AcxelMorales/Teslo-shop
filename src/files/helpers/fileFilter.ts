export const fileFilter = (
  _: any,
  file: Express.Multer.File,
  callback: Function,
): void => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExt: string = file.mimetype.split('/')[1];
  const validExt: string[] = ['jpg', 'png', 'gif', 'jpeg'];

  if (validExt.includes(fileExt)) {
    return callback(null, true)
  }

  callback(null, false);
};
