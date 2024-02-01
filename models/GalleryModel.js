var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GallerySchema = new Schema({
    Title: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'Gallery' }, { timestamps: false });
GallerySchema.virtual('Gallery_Detail', { ref: 'GalleryDetail', localField: '_id', foreignField: 'GalleryID' });
GallerySchema.set('toObject', { virtuals: true })
GallerySchema.set('toJSON', { virtuals: true })
module.exports = mongoose.model("Gallery", GallerySchema);