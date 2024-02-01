var mongoose = require("mongoose");
var AboutUsSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Image: { type: String, required: false },
    Date: { type: String, required: true },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'aboutUs' }, { timestamps: false });
module.exports = mongoose.model("aboutUs", AboutUsSchema);