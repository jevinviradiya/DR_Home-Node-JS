const {registerUser, getRegisterUser, deleteRegisterUser, updateRegisterUser, deleteMultipleRegisterUsers} = require("../controllers/registration")
const router = require("express").Router();
const auth = require('../middlewares/auth')

router.post("/register", auth, registerUser);
router.get("/getRegister", auth, getRegisterUser);
router.put("/updateRegUser/:id", auth, updateRegisterUser);
router.delete("/deleteRegUser/:id", auth, deleteRegisterUser);
router.delete("/delete_Multi_RegUser", auth, deleteMultipleRegisterUsers);

module.exports = router;