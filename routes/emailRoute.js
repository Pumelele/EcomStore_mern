import { sendEmailController } from "../controllers/emailController";
import express from "express";

//router object

const router = express.Router();

//route
router.post("/sendEmail", sendEmailController);

//export
module.exports = router;