var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BannerDetailSchema = new Schema({
    BannerID: { type: String, required: true },
    Image: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'BannerDetail' }, { timestamps: false });
module.exports = mongoose.model("BannerDetail", BannerDetailSchema);