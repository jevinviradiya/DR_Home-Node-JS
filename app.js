
const express = require('express'); 
const cors = require("cors");
const app = express();              

//routes 
const AuthRoutes = require("./routes/auth");
const RegisterRoutes = require("./routes/registration");
const TreatPaymentRoutes = require("./routes/treatmentPayment_routes");
const AppointmentRoutes = require("./routes/appointment_routs");
const BranchRoutes = require("./routes/branch_route");
const UserManageRoutes = require("./routes/userManagement_routes");

const port =  process.env.PORT || 3000;      

app.use(express.json());

var corsOption = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
  };
app.use(cors(corsOption));

// api routes
app.use("/dr/v1", AuthRoutes);
app.use("/dr/v1", RegisterRoutes);
app.use("/dr/v1", TreatPaymentRoutes);
app.use("/dr/v1", AppointmentRoutes);
app.use("/dr/v1", BranchRoutes);
app.use("/dr/v1", UserManageRoutes);


app.listen(port, () => {            
    console.log(`Now listening on port ${port}`); 
});

module.exports = app;
