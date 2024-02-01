var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PolicyTypeSchema = new Schema({
    Type: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'policytypes' }, { timestamps: false });
module.exports = mongoose.model("policytypes", PolicyTypeSchema);