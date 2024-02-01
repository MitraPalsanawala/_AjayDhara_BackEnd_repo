var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var auth_token = new Schema({
	Token: { type: String, default: null },//Security API Auth Access Token 
	DeviceToken: { type: String, default: null },//Firebased Token(Andriod),APNS Token(IOS)
	UserID: { type: ObjectId, default: null, ref: "User" },
	DeviceType: { type: Number, default: 0 },//Device Type=(1-Android,2-IOS,0-Web)
	Is_Loggedout: { type: Number, default: 0 },//Device Login Status(0-Login,1-Logout)
	Date: { type: String, required: true },
	EntryDate: { type: Date, default: Date.now },
}, { collection: "auth_token" }, { timestamps: true });
module.exports = mongoose.model("auth_token", auth_token);