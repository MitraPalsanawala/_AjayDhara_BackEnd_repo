var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BannerSchema = new Schema({
    Description: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'Banner' }, { timestamps: false });
BannerSchema.virtual('Banner_Detail', { ref: 'BannerDetail', localField: '_id', foreignField: 'BannerID' });
BannerSchema.set('toObject', { virtuals: true })
BannerSchema.set('toJSON', { virtuals: true })
module.exports = mongoose.model("Banner", BannerSchema);