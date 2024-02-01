var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NewsSchema = new Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: false },
    Image: { type: String, required: false },
    URL: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'News' }, { timestamps: false });
module.exports = mongoose.model("News", NewsSchema);