var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserGallerySchema = new Schema({
    Title: { type: String, required: true },
    Image1: { type: String, required: false },
    Image2: { type: String, required: false },
    Image3: { type: String, required: false },
    Image4: { type: String, required: false },
    Image5: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: { type: Boolean, required: false, default: 0 },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'UserGallery' }, { timestamps: false });
module.exports = mongoose.model("UserGallery", UserGallerySchema);