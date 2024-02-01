var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BankDetailSchema = new Schema({
    BankName: { type: String, required: true },
    AccountName: { type: String, required: true },
    AccountNumber: { type: String, required: true },
    IFSCCode: { type: String, required: true },
    AccountHolderName: { type: String, required: true },
    QRCodeImage: { type: String, required: true },
    Date: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'BankDetail' }, { timestamps: false });
module.exports = mongoose.model("BankDetail", BankDetailSchema);