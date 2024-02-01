var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var LocationSchema = new Schema({
    Name: { type: String, required: true },
    MobileNo: { type: String, required: true },
    Email: { type: String, required: false },
    Address: { type: String, required: true },
    UserName: { type: String, required: true },
    Password: { type: String, required: true },
    CodeBook: { type: String, required: false },
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
    // loc: {
    //     type: {
    //         type: String,
    //         default: "Point"
    //     },
    //     coordinates: {
    //         type: [Number]
    //     }
    //     //index: '2dsphere'
    // },
    Latitude: { type: String, required: true },
    Longitude: { type: String, required: true },
    DoctorName1: { type: String, required: false },
    DoctorMobileNo1: { type: String, required: false },
    DoctorName2: { type: String, required: false },
    DoctorMobileNo2: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    Date: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: "Location" }, { timestamps: false });
LocationSchema.index({ "loc": '2dsphere' });
//db.locations.createIndex( { "loc" : "2dsphere" } )
module.exports = mongoose.model("Location", LocationSchema);