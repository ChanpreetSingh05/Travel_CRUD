const Books = require("../models/books");

const getBooks = function (req, res) {
  Books.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched Successfully",
      posts: documents,
    });
  });
};

const createBooks = (req, res, next) => {
  // res.status(200).json({ status: "createBooks success" });
  const url = req.protocol + "://" + req.get("host");
  const post = new Books({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    type: req.body.type,
    pages: req.body.pages,
    imagePath: url + "/uploads/" + req.file.filename
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
  
  // Travel.create(
  //   {
  //     title: req.body.title,
  //     description: req.body.description,
  //     price: req.body.price,
  //     country: req.body.country,
  //     images: ""
  //   },
  //   (err, traveldata) => {
  //     if (err) {
  //       res.status(400).json(err);
  //     } else {
  //       res.status(200).json({ status: "createBooks success" });
  //     }
  //   }
  // );
};

const getSingleBooks = function (req, res) {
  Books.findById(req.params.Booksid).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post Not found!" });
    }
  });
};

const updateBooks = function (req, res) {

  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/uploads/" + req.file.filename;
  }
    const post = new Books({
      _id: req.params.Booksid,
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      type: req.body.type,
      pages: req.body.pages,
      imagePath: imagePath
    });
    console.log(post);
    //  res.status(200).json({ status: "createBooks success" });
    Books.updateOne({_id: req.params.Booksid}, post).then(result => {
      res.status(201).json({
        message: "Post Updated Succesfully"
      });
    });
  };

const deleteBooks = function (req, res) {
  const Booksid = req.params.Booksid;
  if (Booksid) {
    Books.findByIdAndRemove(Booksid).exec((err, Booksdata) => {
      if (err) {
        res.status(404).json(err);
        return;
      }
      res.status(204).json("Succesfully Deleted");
    });
  } else {
    res.status(404).json({ message: "No Booksid" });
  }
  // res.status(200).json({"status" : "deleteBook success"});
};



module.exports = {
  getBooks,
  createBooks,
  getSingleBooks,
  updateBooks,
  deleteBooks,
};
