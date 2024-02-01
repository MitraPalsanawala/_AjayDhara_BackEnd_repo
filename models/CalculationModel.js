var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CalculationSchema = new Schema({
    Title: { type: String, required: true },
    URL: { type: String, required: false },
    Type: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'calculations' }, { timestamps: false });
module.exports = mongoose.model("calculations", CalculationSchema);