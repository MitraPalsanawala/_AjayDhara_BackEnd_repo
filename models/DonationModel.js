var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var DonationSchema = new Schema({
    Name: { type: String, required: true },
    MobileNo: { type: String, required: true },
    Address: { type: String, required: true },
    Amount: { type: String, required: true },
    Image: { type: String, required: true },
    Date: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'Donation' }, { timestamps: false });
module.exports = mongoose.model("Donation", DonationSchema);