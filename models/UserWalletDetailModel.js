var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var UserWalletDetailSchema = new Schema({
    UserWalletID: { type: ObjectId, ref: 'UserWallet', required: true },
    MainUserID: { type: ObjectId, ref: 'User', required: false },
    SubUserID: { type: ObjectId, ref: 'User', required: false },
    UserPlanDetailID: { type: ObjectId, ref: 'UserPlanDetail', required: false },
    Amount: { type: Number, required: false },
    Type: { type: String, required: false },//Credit,Debit
    IsMember: { type: Boolean, required: false, default: 0 },
    Date: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: "UserWalletDetail" }, { timestamps: false });
module.exports = mongoose.model("UserWalletDetail", UserWalletDetailSchema);