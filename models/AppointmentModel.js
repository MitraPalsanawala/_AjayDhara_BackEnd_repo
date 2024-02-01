var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var AppointmentMasterSchema = new Schema({
    UserID: { type: ObjectId, ref: 'User', required: true },
    HospitalID: { type: ObjectId, ref: 'Hospital', required: true },
    ContactNo: { type: String, required: true },
    Email: { type: String, required: false },
    Description: { type: String, required: true },
    AppointmentDate: { type: Date, required: true },
    Time: { type: String, required: true },
    Status: { type: Boolean, required: false, default: 0 },
    Date: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: "Appointment" }, { timestamps: false });
AppointmentMasterSchema.virtual('AppointmentUserDetail', { ref: 'User', localField: 'UserID', foreignField: '_id' });
AppointmentMasterSchema.virtual('AppointmentHospitalDetail', { ref: 'Hospital', localField: 'HospitalID', foreignField: '_id' });
AppointmentMasterSchema.set('toObject', { virtuals: true })
AppointmentMasterSchema.set('toJSON', { virtuals: true })
AppointmentMasterSchema.set('toJSON', { virtuals: true, versionKey: false, transform(doc, ret) { delete ret.id; } });
module.exports = mongoose.model("Appointment", AppointmentMasterSchema);