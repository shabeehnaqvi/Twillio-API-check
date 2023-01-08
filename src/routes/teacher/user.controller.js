const express = require("express");
const errorHandler = require("../../middleware/error");
const Teacher = require("../../models/Teacher");
const { generateAuthToken } = require("../../utils/helpers");
const createStudentSchema = require("./validationSchema");

const authHandler = require("../../middleware/auth");

const router = express.Router();

router.get(
  "/",
  errorHandler(async (req, res) => {
    const teacher = await Teacher.find();
    res.status(200).send(teacher);
  })
);

router.get(
  "/:userId",
  authHandler,
  errorHandler(async (req, res) => {
    const teacher = await Teacher.findOne({ _id: req.params.userId });

    res.status(200).send(teacher);
  })
);

router.post("/", async (req, res) => {
  const payload = req.body;
  const { error } = createStudentSchema(payload);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  let teacher = new Teacher(payload);

  teacher = await teacher.save();
  res.status(200).send({ teacher });
});

router.patch("/:teacherId", authHandler, async (req, res) => {
  const updatedUser = await Teacher.findByIdAndUpdate(
    req.params.teacherId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  try {
    res.status(200).json({
      status: "Success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:teacherId", authHandler, async (req, res) => {
  const id = req.params.teacherId;
  await Teacher.findByIdAndRemove(id).exec();
  res.send("Deleted");
});

router.post("/login", async (req, res) => {
  const teacher = await Teacher.findOne({ email: req.body.email });
  console.log(teacher);

  if (!teacher) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }

  if (req.body.password !== teacher.password) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }

  const token = generateAuthToken({
    username: teacher.username,
    email: teacher.email,
    id: teacher._id,
  });
  teacher["token"] = token;
  new_teacher = Object.assign(teacher, { token: token });
  console.log(teacher);
  const updatedUser = await Teacher.findByIdAndUpdate(
    teacher._id,
    new_teacher,
    {
      runValidators: true,
    }
  );
  res.status(200).send({ message: "success", token, User: updatedUser });
});

router.get(
  "/logout",
  authHandler,
  errorHandler(async (req, res) => {
    req.params.token;

    res.status(200).send(teacher);
  })
);

module.exports = router;
