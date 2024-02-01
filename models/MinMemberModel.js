var mongoose = require("mongoose");
var MinMemberSchema = new mongoose.Schema({
    TotalMember: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDeleted: {type: Boolean, required: false, default: 0 },
    Date: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now }
}, { collection: 'MinMember' }, { timestamps: false });
module.exports = mongoose.model("MinMember", MinMemberSchema);