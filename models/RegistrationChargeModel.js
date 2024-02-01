var mongoose = require("mongoose");
var RegistrationChargeSchema = new mongoose.Schema({
    Amount: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: 'RegistrationCharge' }, { timestamps: false });
module.exports = mongoose.model("RegistrationCharge", RegistrationChargeSchema);