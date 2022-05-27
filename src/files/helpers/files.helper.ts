export const renameImage = (req, file, cb) => {
  const randomName = Math.floor(Math.random() * 1000000);
  const extension = file.originalname.split('.')[1];
  const nameFile = file.originalname.split('.')[0];
  if (extension === undefined) {
    cb(null, `${nameFile}-${randomName}`);
  } else {
    cb(null, `${nameFile}-${randomName}.${extension}`);
  }
};

export const isImage = file => {
  const extension = file.originalname.split('.')[1];
  if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
    return true;
  }
  return false;
};
