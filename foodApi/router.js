const express = require("express");
const router = express.Router();
const model = require("./model");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ellaapis",
  api_key: "396249747953272",
  api_secret: "d266Sd06MmsmJABHOi4r3LkEaUI",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb("unsupported file format");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 3 },
}).single("image");

router.post("/", upload, async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const newData = {
      meal: req.body.meal,
      order: req.body.order,
      price: req.body.price,
      image: result.secure_url,
      cloud_id: result.public_id,
    };
    const newEntry = await model.create(newData);
    res.status(200).json({
      mgs: "created successfully",
      data: newEntry,
    });
  } catch (err) {
    res.json(err.message);
  }
});

router.put("/:id", upload, async (req, res) => {
  try {
    const findID = await model.findById(req.params.id);
    if (findID) {
      await cloudinary.uploader.destroy(findID.cloud_id);
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    const newData = {
      meal: req.body.meal,
      order: req.body.order,
      price: req.body.price,
      image: result.secure_url,
    };
    const newEntry = await model.findByIdAndUpdate(req.params.id, newData);
    res.status(200).json({
      mgs: "created successfully",
      data: newEntry,
    });
  } catch (err) {
    res.json(err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const getData = await model.find();
    res.status(200).json(getData);
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const getData = await model.findById(req.params.id);
    res.status(200).json(getData);
  } catch (error) {
    res.json(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const findID = await model.findById(req.params.id);
    await cloudinary.uploader.destroy(findID.cloud_id);

    const deleteData = await model.findByIdAndDelete(req.params.id, req.body);
  } catch (error) {
    error.message;
  }
});

module.exports = router;
