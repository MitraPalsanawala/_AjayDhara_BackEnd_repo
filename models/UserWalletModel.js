var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var UserWalletSchema = new Schema({
    UserID: { type: ObjectId, ref: 'User', required: true },
    FinalAmount: { type: Number, required: false },
    TotalCreditedAmount: { type: Number, required: false },
    TotalWithdrawalAmount: { type: Number, required: false },
    Date: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: "UserWallet" }, { timestamps: false });
module.exports = mongoose.model("UserWallet", UserWalletSchema);