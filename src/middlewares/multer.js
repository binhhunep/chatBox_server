import multer from "multer";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/avatars");
//   },
//   filename: (req, file, cb) => {
//     // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const uniqueSuffix = Date.now() + "-" + req.params.id;
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// }); //tao noi luu file tren server va ten file duoc luu

const upload = multer({
  // storage: storage,
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //bytes
  },
});

//tao middleware upload files.

module.exports = { upload };
