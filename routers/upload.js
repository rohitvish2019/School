const express = require("express");
const upload = require("../middleware/upload");
const Student = require('../modals/admissionSchema')
const router = express.Router();

router.post(
  "/Imageupload",
  upload.single("image"),
  async (req, res) => {
    console.log(req.body.recordId)
    try {
      let student = await Student.findById(req.body.recordId);
      let profileURL = '/uploads/' + req.file.filename
      student.ProfilePhotoURL = profileURL;
      await student.save()
      student = await Student.findById(req.body.recordId);
      console.log(student)
      //let student = await Student.findOneAndUpdate({_id : req.body.recordId},{$set : {ProfilePhotoURL : req.file.filename}})
    } catch(err) {
        console.log(err)
    } 
    res.json({
      message: "File uploaded successfully",
      file: req.file,
    });
  }
);

module.exports = router;
