var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var UserWithdrawalRequestDetailSchema = new Schema({
    UserID: { type: ObjectId, ref: 'User', required: false },
    Amount: { type: Number, required: false },
    Status: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    Date: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: "UserWithdrawalRequest" }, { timestamps: false });
module.exports = mongoose.model("UserWithdrawalRequest", UserWithdrawalRequestDetailSchema);