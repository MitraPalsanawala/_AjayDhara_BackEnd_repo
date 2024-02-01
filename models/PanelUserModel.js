var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PanelUserSchema = new Schema({
   Name: { type: String, required: false },
   MobileNo: { type: String, required: false },
   Email: { type: String, required: false },
   UserName: { type: String, required: false },
   Password: { type: String, required: false },
   CodeBook: { type: String, required: false },
   UserType: { type: String, required: false },
   EntryDate: { type: Date, default: Date.now },
}, { collection: 'PanelUser' }, { timestamps: false });
module.exports = mongoose.model('PanelUser', PanelUserSchema);