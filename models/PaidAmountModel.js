var mongoose = require("mongoose");
var PaidAmountSchema = new mongoose.Schema({
    MainAmount: { type: Number, required: true },
    SubAmount: { type: Number, required: true },
    SubChildAmount: { type: Number, required: true },
    Date: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    Date: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: 'PaidAmount' }, { timestamps: false });
module.exports = mongoose.model("PaidAmount", PaidAmountSchema);