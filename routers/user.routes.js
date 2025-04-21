const express = require("express");
const router = express.Router();
const { addUser, getUsers, getUser } = require("./controllers_import");

router.post("/add-user", addUser);
router.get("/users", getUsers);
router.get("/single-user/:ticket_id", getUser); 

module.exports = router;
