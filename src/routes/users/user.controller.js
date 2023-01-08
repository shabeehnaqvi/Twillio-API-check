const express = require("express");
const errorHandler = require("../../middleware/error");
const User = require("../../models/user");
const { generateAuthToken } = require("../../utils/helpers");
const createUserSchema = require("./validationSchema");

const upload = require("../../middleware/upload");
const { FormateUserObj } = require("./UserFormatter");
const router = express.Router();

router.get(
  "/",
  errorHandler(async (req, res) => {
    const limit =  req.headers.limit
    const skip = req.headers.skip
    console.log(limit)
    if(limit !== undefined){
      const user = await User.find().skip(skip).limit(limit).sort({ name: 1 });
      res.status(200).send(user);
    }
    else{
      const user = await User.find().select('name email password');
      res.status(200).send(user);
    }
    
    
  })
);

router.get(
  "/:userId",
  errorHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId });
    const UserObj = FormateUserObj(user);
    res.status(200).send(UserObj);
  })
);
router.post("/verify",async (req,res)=>{
  const accountSid ='ACf214a4db65015caf67fa0c1ef68b88e8';
  const authToken = 'b20e65ebf92e41b18de1cfc792ce4ef4'
  const client = require('twilio')(accountSid, authToken);
  console.log("Client Created")
  
    client.messages
      .create({body: 'Hi there Mazharrrrr I am from Twillo', from: '+15017122661', to: '+923016667374'} , (err,message)=>{
        console.log(err)
      })
      .then(message => res.status(200).send({ message}))
})

router.post("/", async (req, res) => {
  const payload = req.body;
  const { error } = createUserSchema(payload);
  
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  let user = new User(payload);

  user = await user.save();
  res.status(200).send({ user });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('name email password');
  console.log(user);
  if (!user) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }

  if (req.body.password !== user.password) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }

  const token = generateAuthToken({
    username: user.username,
    email: user.email,
  });

  res.status(200).send({ message: "success", "token":token, "User":user });
});



router.post("/upload", async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: "Error" });
    } else {
      const newUser = new User({
        name:req.body.name,
        email:req.body.email,
        date:req.body.date,
        role:req.body.role,
        password:req.body.password,
        image: {
          date: req.file.filename,
          contentType: "image/png",
        },
      });
      newUser
        .save()
        .then(() => res.status(200).send({ message: "success" }))
        .catch((err)=>  res.status(400).send({ message: err })
        );
    }
  });
});



module.exports = router;
