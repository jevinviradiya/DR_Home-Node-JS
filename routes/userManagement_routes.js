const { createUserManagement, getUserManagement, updateUserManagement, deleteUserManagement, DeleteMultiUserManagement } = require("../controllers/userManagement")
const router = require("express").Router();
const auth = require('../middlewares/auth')

router.post("/createUserManagement", auth, createUserManagement);
router.get("/getUserManagement", auth, getUserManagement);
router.put("/updateUserManagement/:id", auth, updateUserManagement);
router.delete("/deleteUserManagement/:id", auth, deleteUserManagement);
router.delete("/delete_multi_UserManagement", auth, DeleteMultiUserManagement);

module.exports = router;