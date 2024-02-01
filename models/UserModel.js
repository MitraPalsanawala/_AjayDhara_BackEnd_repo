var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var UserSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    MobileNo: { type: String, required: true },
    Password: { type: String, required: false },
    CodeBook: { type: String, required: false },
    Email: { type: String, required: false },
    Address: { type: String, required: false },
    IDProof: { type: String, required: false },
    UserCode: { type: String, required: false },
    ReferralCode: { type: String, required: false },
    StartDate: { type: Date, required: false },
    EndDate: { type: Date, required: false },
    Photo: { type: String, required: false },
    PlanStatus: { type: String, required: false },//Pending,Working
    RegistrationAmount: { type: String, required: false },
    RegistrationStatus: { type: String, required: false },//Pending,Success
    MinimumMember: { type: String, required: false },
    TotalReferralCount: { type: Number, required: false, default: 0 },//0
    PlanTypeID: { type: ObjectId, ref: 'plantypes', required: false },//with Plan, without plan --- dropdown
    UserType: { type: String, required: false },//Main User//Sub User
    DeviceID: { type: String, required: false },
    IOSDeviceID: { type: String, required: false },
    IsGreen: { type: Boolean, required: false, default: 0 },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    IsBusiness: { type: Boolean, required: false, default: 0 },
    IsHomeInst: { type: Boolean, required: false, default: 0 },
    Date: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: 'User' }, { timestamps: false });
UserSchema.virtual("RefUserDetail", {
    ref: "UserWalletDetail",
    localField: "_id",
    foreignField: "MainUserID"
});
UserSchema.virtual("userwallet", {
    ref: "UserWallet",
    localField: "_id",
    foreignField: "UserID"
});
UserSchema.virtual("GetHealthInsurance", {
    ref: "HealthInsurance",
    localField: "_id",
    foreignField: "UserID"
});
// UserSchema.virtual("UserWithdrawal", {
//     ref: "UserWithdrawalRequest",
//     localField: "_id",
//     foreignField: "UserID"
// });
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set('toJSON', {
    virtuals: true, versionKey: false, transform(doc, ret) { delete ret.id; }
});
module.exports = mongoose.model("User", UserSchema);