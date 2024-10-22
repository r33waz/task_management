import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "E:/Project/task_management/server/public/uploads");
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
    cb(null, uniqueSuffix);
    // console.log(file);
  },

});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid File type. Only images allowed."));
  }
  // console.log(file);
};

export const upload = multer({
  storage,
  limits: {
    //30 mb max size
    fileSize: 60 * 1024 * 1024,
  },
  fileFilter,
});

