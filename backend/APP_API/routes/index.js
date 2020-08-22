var express = require('express');
var router = express.Router();
const ctrlBooks = require("../controllers/books");
const multer = require('multer');
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/uploads");
  // }
      // callBack(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  // filename: (req, file, callBack) => {
  //     callBack(null, `FunOfHeuristic_${file.originalname}`)
  }
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get('', ctrlBooks.getBooks);

router.post('',checkAuth, upload.single('image'), ctrlBooks.createBooks);

router.get('/:Booksid', ctrlBooks.getSingleBooks);

router.put('/:Booksid', upload.single('image'), ctrlBooks.updateBooks);

router.delete('/:Booksid', ctrlBooks.deleteBooks);

module.exports = router;