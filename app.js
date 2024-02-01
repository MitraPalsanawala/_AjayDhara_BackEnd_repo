var express = require("express");
var path = require("path");
var cors = require("cors");
const cron = require("node-cron");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	if (process.env.NODE_ENV !== "test") {
		console.log("Connected to %s", MONGODB_URL);
		console.log("App is running ... \n");
		console.log("Press CTRL + C to stop the process. \n");
	}
}).catch(err => { console.error("App starting error:", err.message), process.exit(1); });
//mongoose.set("debug", true);
//var db = mongoose.connection;
var app = express();
const UserPlanDetailModel = require("./models/UserPlanDetailModel");
const HealthInsuranceModel = require("./models/HealthInsuranceModel");
cron.schedule("0 22 * * * *", async () => {
	// let today = new Date();
	// let todayEOD = new Date();
	// today.setHours(0, 0, 0, 0);
	// todayEOD.setHours(23, 59, 59, 999);
	// SDateCon = { $gte: today.toISOString(), $lte: todayEOD.toISOString() };
	// var StartDate = moment();
	// var EndDate = moment().add(1, 'years');
	// let UserPlan = await UserPlanDetailModel.find({ PlanStatus: "Working", EndDate: SDateCon }).exec();
	// if (UserPlan.length > 0) {
	// 	for (i = 0; i < UserPlan.length; i++) {
	// 		await UserPlanDetailModel.updateOne({ UserID: UserPlan[i].UserID },
	// 			{ PlanStatus: "Expire", Date: moment().format("YYYY-MM-DDTHH:mm:ss"), ModifiedDate: new Date() }).exec();
	// 		await new UserPlanDetailModel({
	// 			UserID: UserPlan[i].UserID, StartDate: StartDate, TotalReferralCount: "",
	// 			EndDate: EndDate, Year: moment().format('YYYY'), PlanStatus: "Working",
	// 			MinimumMember: "", Date: moment().format("YYYY-MM-DDTHH:mm:ss")
	// 		}).save();
	// 	}
	// }
	// let INSPlan = await HealthInsuranceModel.find({ EndDate: SDateCon }).exec();
	// if (INSPlan.length > 0) {
	// 	for (i = 0; i < INSPlan.length; i++) {
	// 		await HealthInsuranceModel.updateOne({ UserID: INSPlan[i].UserID },
	// 			{ InsMode: "Expire", Date: moment().format("YYYY-MM-DDTHH:mm:ss"), ModifiedDate: new Date() }).exec();
	// 	}
	// }
	console.log("<=======>running a task every 5 Min <-------->", new Date().toString());
});
if (process.env.NODE_ENV !== "test") { app.use(logger("dev")); }
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(logger('dev'));
app.set('view cache', false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//app.use('/uploads', express.static(process.cwd() + '/uploads'));
app.use(cors()); //To allow cross-origin requests
app.use("/", indexRouter);
app.use("/api/", apiRouter);
app.all("*", function (req, res) {
	return res.status(404).json({ status: 0, message: "Page not found" });
});
process.env.DMURL = "http://localhost:4646/uploads/";
app.use((err, req, res) => {
	if (err.name == "UnauthorizedError") {
		return res.status(401).json({ status: 0, message: "UnauthorizedError" });
	}
});
module.exports = app;