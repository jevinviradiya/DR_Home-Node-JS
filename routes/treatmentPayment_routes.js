const { createTreatment, getTreatmentPayment, get_withRegData_TreatmentPayment } = require("../controllers/treatmentPayment")
const router = require("express").Router();
const auth = require('../middlewares/auth')

router.post("/createTreatPayment", auth, createTreatment);
router.get("/getTreatPayment", auth, getTreatmentPayment);
router.get("/get_AllData_TreatPayment", auth, get_withRegData_TreatmentPayment);

module.exports = router;