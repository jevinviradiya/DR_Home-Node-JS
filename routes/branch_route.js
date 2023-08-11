const { createBranch, getBranch, updateBranch, deleteBranch, getBranchWithFilter, deleteMultipleBranches } = require("../controllers/branch")
const router = require("express").Router();
const auth = require('../middlewares/auth')

router.post("/createBranch", auth, createBranch);
router.get("/getBranch", auth, getBranch);
router.put("/updateBranch/:id", auth, updateBranch);
router.delete("/deleteBranch/:id", auth, deleteBranch);
router.delete("/delete_multiBranch", auth, deleteMultipleBranches);

module.exports = router;