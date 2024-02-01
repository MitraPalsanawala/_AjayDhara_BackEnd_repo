var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PlanTypeSchema = new Schema({
    Type: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'plantypes' }, { timestamps: false });
module.exports = mongoose.model("plantypes", PlanTypeSchema);