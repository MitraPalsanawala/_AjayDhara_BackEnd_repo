var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var HealthInsuranceSchema = new Schema({
    UserID: { type: ObjectId, ref: 'User', required: true },
    PoliceName: { type: String, required: true },
    PolicyNumber: { type: String, required: true },
    CustomerName: { type: String, required: false },
    CustomerMobileNo: { type: String, required: false },
    PolicyProvider: { type: String, required: true },
    PDF: { type: String, required: false },
    AgentName: { type: String, required: false },
    AgentMobileNo: { type: String, required: false },
    UserCode: { type: String, required: false },
    ReferralCode: { type: String, required: false },
    PolicyTypeID: { type: ObjectId, ref: 'policytypes', required: false },
    // Payment: { type: String, required: false },
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true },
    InsuranceAmount: { type: Number, required: false },
    Status: { type: Boolean, required: false, default: 0 },
    InsMode: { type: String, required: false, default: 'Active' },//Active//Expire//Renewable
    TypeMode: { type: String, required: false, default: 'regular' },//regular//port
    Date: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    IsUpdated: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: "HealthInsurance" }, { timestamps: false });
// HealthInsuranceSchema.virtual('HealthInsuranceUserDetail', { ref: 'User', localField: 'UserID', foreignField: '_id' });
// HealthInsuranceSchema.set('toObject', { virtuals: true })
// HealthInsuranceSchema.set('toJSON', { virtuals: true })
// HealthInsuranceSchema.set('toJSON', {
//     virtuals: true, versionKey: false, transform(doc, ret) { delete ret.id; }
// });
module.exports = mongoose.model("HealthInsurance", HealthInsuranceSchema);