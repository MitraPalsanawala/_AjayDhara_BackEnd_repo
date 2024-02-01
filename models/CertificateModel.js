var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CertificateSchema = new Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: false },
    Image: { type: String, required: false },
    Date: { type: String, required: true },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'Certificate' }, { timestamps: false });
module.exports = mongoose.model("Certificate", CertificateSchema);