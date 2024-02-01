var mongoose = require("mongoose");
var ContactUsSchema = new mongoose.Schema({
   OfficeAddress: { type: String, required: true },
   AltOfficeAddress: { type: String, required: false },
   MobileNumber: { type: String, required: true },
   AltMobileNumber: { type: String, required: false },
   EmailAddress: { type: String, required: true },
   AltEmailAddress: { type: String, required: false },
   Instagram: { type: String, required: false },
   Facebook: { type: String, required: false },
   Twitter: { type: String, required: false },
   Youtube: { type: String, required: false },
   Website: { type: String, required: false },
   WhatsApp: { type: String, required: false },
   Date: { type: String, required: true },
   EntryDate: { type: Date, default: Date.now }
}, { collection: 'contactUs' }, { timestamps: false });
module.exports = mongoose.model("contactUs", ContactUsSchema);