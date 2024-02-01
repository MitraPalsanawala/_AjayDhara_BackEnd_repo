var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var UserPlanDetailSchema = new Schema({
    UserID: { type: ObjectId, ref: 'User', required: true },
    HealthInsuranceID: { type: ObjectId, ref: 'HealthInsurance', required: false },
    StartDate: { type: Date, required: false },
    EndDate: { type: Date, required: false },
    Year: { type: String, required: false },
    Section: { type: String, required: false },//Red,Yellow,Green,Blue
    PlanStatus: { type: String, required: false },//Working//Expire
    MinimumMember: { type: String, required: false },
    TotalReferralCount: { type: String, required: false },
    Date: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }//
}, { collection: "UserPlanDetail" }, { timestamps: false });
module.exports = mongoose.model("UserPlanDetail", UserPlanDetailSchema);