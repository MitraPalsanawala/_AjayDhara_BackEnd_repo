var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TeamMemberSchema = new Schema({
    Name: { type: String, required: true },
    MobileNo: { type: String, required: true },
    Designation: { type: String, required: true },
    Description: { type: String, required: false },
    Image: { type: String, required: false },
    Date: { type: String, required: true },
    EntryDate: { type: Date, default: Date.now }
}, { collection: 'TeamMember' }, { timestamps: false });
module.exports = mongoose.model("TeamMember", TeamMemberSchema);