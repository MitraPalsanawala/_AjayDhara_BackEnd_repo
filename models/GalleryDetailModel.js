var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GalleryDetailSchema = new Schema({
    GalleryID: { type: String, required: true },
    Image: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'GalleryDetail' }, { timestamps: false });
module.exports = mongoose.model("GalleryDetail", GalleryDetailSchema);