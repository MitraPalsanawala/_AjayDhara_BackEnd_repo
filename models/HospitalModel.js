var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var HospitalSchema = new Schema({
    Name: { type: String, required: true },
    MobileNo: { type: String, required: true },
    Email: { type: String, required: false },
    Address: { type: String, required: true },
    UserName: { type: String, required: true },
    Password: { type: String, required: true },
    CodeBook: { type: String, required: false },
    Latitude: { type: String, required: true },
    Longitude: { type: String, required: true },
    loc: {
        type: Object,
        properties: {
            type: {
                type: String,
                enum: 'Point',
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        }
    },
    DoctorName1: { type: String, required: false },
    DoctorMobileNo1: { type: String, required: false },
    DoctorName2: { type: String, required: false },
    DoctorMobileNo2: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    Date: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: "Hospital" }, { timestamps: false });
HospitalSchema.index({ "loc": '2dsphere' });
module.exports = mongoose.model("Hospital", HospitalSchema);