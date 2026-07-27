const express = require("express");
const upload = require("../middleware/upload");
const Student = require('../modals/admissionSchema')
const router = express.Router();

router.post(
  "/Imageupload",
  upload.single("image"),
  async (req, res) => {
    console.log(req.body.recordId);
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded." });
      }

      const filename = await upload.compressAndSave(req.file, "uploads");
      let student = await Student.findById(req.body.recordId);
      const profileURL = "/uploads/" + filename;
      student.ProfilePhotoURL = profileURL;
      await student.save();
      student = await Student.findById(req.body.recordId);
      console.log(student);
      req.file.filename = filename;
    } catch (err) {
      console.log(err);
    }
    res.json({
      message: "File uploaded successfully",
      file: req.file,
    });
  }
);

module.exports = router;
