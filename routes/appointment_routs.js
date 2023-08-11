const { createAppointment, getAppointment, deleteAppointment, updateAppointment, get_FullDetail_Appointment, getAppointByFilter, deleteMultipleAppointments, testAppFilter } = require("../controllers/appointment")
const router = require("express").Router();
const auth = require('../middlewares/auth')

router.post("/createAppointment", auth, createAppointment);
router.get("/getAppointment", auth, getAppointment);
router.get("/getAppoint_by_filter", auth, getAppointByFilter);
router.get("/get_Full_Appointment", auth, get_FullDetail_Appointment);
router.put("/updateAppointment/:id", auth, updateAppointment);
router.delete("/deleteAppointment/:id", auth, deleteAppointment);
router.delete('/delete_MultiAppoint', auth, deleteMultipleAppointments);

router.get("/testApp_Filter", auth, testAppFilter);

module.exports = router;