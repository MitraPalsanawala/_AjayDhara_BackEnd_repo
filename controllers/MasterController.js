const moment = require('moment-timezone');
const MinMemberModel = require("../models/MinMemberModel");
const RegistrationChargeModel = require("../models/RegistrationChargeModel");
const PaidAmountModel = require("../models/PaidAmountModel");
const NewsModel = require("../models/NewsModel");
const CalculationModel = require("../models/CalculationModel");
const PolicyTypeModel = require("../models/PolicyTypeModel");
const ErrorLogsModel = require("../models/ErrorLogsModel");
const { v4: uuidv4 } = require("uuid");
var multer = require("multer");
const DIR = "./public/uploads";
const ImageError = "Only .png, .jpg and .jpeg format allowed!";
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, DIR); },
    filename: function (req, file, cb) { const fileName = file.originalname.toLowerCase().split(" ").join("-"); cb(null, uuidv4() + "-" + fileName); }
});
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) { req.fileValidationError = "Only image files are allowed!"; return cb(new Error(ImageError), false); }
    cb(null, true);
};
exports.MinMemberAdd = [async (req, res) => {
    try {
        if (!req.body.TotalMember) { return res.json({ status: 0, Message: 'Please Enter Your Total Member!', data: null }); }
        else {
            let MinData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).exec();
            if (MinData) {
                return res.status(200).json({ status: 0, Message: "You must add atleast 1 Minimum Member.", data: null });
            } else {
                await new MinMemberModel({ TotalMember: req.body.TotalMember, Date: moment().format("YYYY-MM-DDTHH:mm:ss") }).save();
                return res.status(200).json({ status: 1, Message: "Minimum Member Detail Added Successfully.", data: null });
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.MinMemberGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        let Total = await MinMemberModel.countDocuments(obj).exec();
        let UserData = await MinMemberModel.find(obj).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, data: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.MinMemberBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else if (req.body.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let MinData = await MinMemberModel.findOne({ _id: req.body.ID, IsActive: true, IsDeleted: false }).exec();
            if (MinData) { return res.status(200).json({ status: 1, Message: "Success.", data: MinData }); }
            else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.MinMemberUpdate = [async (req, res) => {
    try {
        if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else if (!req.body.TotalMember) { return res.json({ status: 0, Message: 'Please Enter Your Total Member!', data: null }); }
        else {
            var UpdateData = {};
            UpdateData["TotalMember"] = req.body.TotalMember;
            UpdateData["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss");
            UpdateData["ModifiedDate"] = new Date();
            await MinMemberModel.updateOne({ _id: req.body.CID }, UpdateData).exec();
            return res.status(200).json({ status: 1, Message: "Minimum Member Detail Update Successfully.", data: null });
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.MinMemberDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            await MinMemberModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, Date: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "Minimum Member Detail Delete Successfully.", data: null })
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.RegistrationChargeAdd = [async (req, res) => {
    try {
        if (!req.body.Amount) { return res.json({ status: 0, Message: 'Please Enter Amount!', data: null }); }
        else {
            let MinData = await RegistrationChargeModel.findOne({ IsActive: true, IsDeleted: false }).exec();
            if (MinData) {
                return res.status(200).json({ status: 0, Message: "You must add atleast 1 Registration Charge.", data: null });
            } else {
                await new RegistrationChargeModel({ Amount: req.body.Amount, Date: moment().format("YYYY-MM-DDTHH:mm:ss") }).save();
                return res.status(200).json({ status: 1, Message: "Registration Charge Detail Added Successfully.", data: null });
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.RegistrationChargeGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        let Total = await RegistrationChargeModel.countDocuments(obj).exec();
        let UserData = await RegistrationChargeModel.find(obj).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, data: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.RegistrationChargeBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else if (req.body.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let RegistrationChargeData = await RegistrationChargeModel.findOne({ _id: req.body.ID, IsActive: true, IsDeleted: false }).exec();
            if (RegistrationChargeData) { return res.status(200).json({ status: 1, Message: "Success.", data: RegistrationChargeData }); }
            else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.RegistrationChargeUpdate = [async (req, res) => {
    try {
        if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else if (!req.body.Amount) { return res.json({ status: 0, Message: 'Please Enter Amount!', data: null }); }
        else {
            await RegistrationChargeModel.updateOne({ _id: req.body.CID }, { Amount: req.body.Amount, ModifiedDate: new Date() }).exec();
            return res.status(200).json({ status: 1, Message: "Registration Charge Detail Updated Successfully.", data: null });
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.RegistrationChargeDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            await RegistrationChargeModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, ModifiedDate: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "Registration Charge Detail Deleted Successfully.", data: null })
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.PaidAmountAdd = [async (req, res) => {
    try {
        if (!req.body.MainAmount) { return res.json({ status: 0, Message: 'Please Enter Main Amount!', data: null }); }
        else if (!req.body.SubAmount) { return res.json({ status: 0, Message: 'Please Enter Sub Amount!', data: null }); }
        else if (!req.body.SubChildAmount) { return res.json({ status: 0, Message: 'Please Enter Sub Child Amount!', data: null }); }
        else {
            let MinData = await PaidAmountModel.findOne({ IsActive: true, IsDeleted: false }).exec();
            if (MinData) {
                return res.status(200).json({ status: 0, Message: "You must add atleast 1 Paid Amount Detail.", data: null });
            } else {
                await new PaidAmountModel({
                    MainAmount: req.body.MainAmount,
                    SubAmount: req.body.SubAmount,
                    SubChildAmount: req.body.SubChildAmount,
                    Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                }).save();
                return res.status(200).json({ status: 1, Message: "Paid Amount Detail Added Successfully.", data: null });
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.PaidAmountGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        let Total = await PaidAmountModel.countDocuments(obj).exec();
        let UserData = await PaidAmountModel.find(obj).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, data: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.PaidAmountBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else if (req.body.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let PaidAmountData = await PaidAmountModel.findOne({ _id: req.body.ID, IsActive: true, IsDeleted: false }).exec();
            if (PaidAmountData) { return res.status(200).json({ status: 1, Message: "Success.", data: PaidAmountData }); }
            else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.PaidAmountUpdate = [async (req, res) => {
    try {
        if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else if (!req.body.MainAmount) { return res.json({ status: 0, Message: 'Please Enter Main Amount!', data: null }); }
        else if (!req.body.SubAmount) { return res.json({ status: 0, Message: 'Please Enter Sub Amount!', data: null }); }
        else {
            var UpdatePaidAmountData = {};
            UpdatePaidAmountData["MainAmount"] = req.body.MainAmount;
            UpdatePaidAmountData["SubAmount"] = req.body.SubAmount;
            UpdatePaidAmountData["SubChildAmount"] = req.body.SubChildAmount;
            UpdatePaidAmountData["ModifiedDate"] = new Date();
            await PaidAmountModel.updateOne({ _id: req.body.CID }, UpdatePaidAmountData).exec();
            return res.status(200).json({ status: 1, Message: "Paid Amount Detail Updated Successfully.", data: null });
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.PaidAmountDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            await PaidAmountModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, ModifiedDate: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "Paid Amount Detail Deleted Successfully.", data: null })
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.NewsAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.Title) { res.json({ status: 0, Message: 'Please Enter Your Title!', data: null }); }
                else if (!req.body.Description) { res.json({ status: 0, Message: 'Please Enter Your Description!', data: null }); }
                else if (!req.file) { return res.json({ status: 0, Message: "Please Upload Image!", data: null }); }
                else if (!req.body.URL) { return res.json({ status: 0, Message: "Please Enter Your URL!", data: null }); }
                else {
                    console.log("----req.body---", req.body);
                    await new NewsModel({
                        Title: req.body.Title, Description: req.body.Description,
                        Image: req.file.filename, URL: req.body.URL
                    }).save();
                    return res.status(200).json({ status: 1, Message: "News Added Successfully.", data: null });
                }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.NewsGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5;
            const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        let Total = await NewsModel.countDocuments(obj).exec();
        let newsdata = await NewsModel.find(obj).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        // let newsdata = await NewsModel.find(obj).sort({ '_id': -1 }).exec();
        if (newsdata.length > 0) {
            return res.status(200).json({ status: 1, Message: "Success.", data: newsdata, totalItems: Total, count: Total });
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.NewsFindByID = [async (req, res) => {
    try {
        if (!req.body.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let newsdata = await NewsModel.findOne({ _id: req.body.ID, IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
            if (newsdata) {
                return res.status(200).json({ status: 1, Message: "Success.", data: newsdata });
            } else {
                return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.NewsUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.ID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                // else if (!req.body.Title) { res.json({ status: 0, Message: 'Please Enter Your Title!', data: null }); }
                // else if (!req.body.Description) { res.json({ status: 0, Message: 'Please Enter Your Description!', data: null }); }
                // else if (!req.file) { return res.json({ status: 0, Message: "Please Upload Image!", data: null }); }
                // else if (!req.body.URL) { return res.json({ status: 0, Message: "Please Enter Your URL!", data: null }); }
                else {
                    var UpdateData = {};

                    if (req.body.Title) { UpdateData["Title"] = req.body.Title }
                    if (req.body.Description) { UpdateData["Description"] = req.body.Description }
                    if (req.file) { UpdateData["Image"] = req.file.filename }
                    if (req.body.URL) { UpdateData["URL"] = req.body.URL }
                    await NewsModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    return res.status(200).json({ status: 1, Message: "News Update Successfully.", data: null });
                }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.NewsDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        // else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            await NewsModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, IsActive: false, ModifiedDate: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "News Detail Deleted Successfully.", data: null })
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.CalculationAdd = [async (req, res) => {
    try {
        console.log("====req.body===", req.body);
        if (!req.body.Title) { res.json({ status: 0, Message: 'Please Enter Your Title!', data: null }); }
        else if (!req.body.URL) { return res.json({ status: 0, Message: "Please Enter Your URL!", data: null }); }
        else if (!req.body.Type) { res.json({ status: 0, Message: 'Please Enter Your Type!', data: null }); }
        else {
            await new CalculationModel({
                Title: req.body.Title,
                URL: req.body.URL,
                Type: req.body.Type
            }).save();
            return res.status(200).json({ status: 1, Message: "Calculation Added Successfully.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.CalculationGet = [async (req, res) => {
    try {
        var Type = ((req.body.Type) ? (req.body.Type) : { $nin: [] });
        let calculationdata = await CalculationModel.find({ IsDeleted: false, Type: Type }).sort({ '_id': -1 }).exec();
        if (calculationdata.length > 0) {
            return res.status(200).json({ status: 1, Message: "Success.", data: calculationdata });
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.CalculationFindByID = [async (req, res) => {
    try {
        if (!req.body.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let calculationdata = await CalculationModel.findOne({ _id: req.body.ID, IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
            if (calculationdata) {
                return res.status(200).json({ status: 1, Message: "Success.", data: calculationdata });
            } else {
                return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.CalculationUpdate = [async (req, res) => {
    try {
        if (!req.body.ID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else {
            var UpdateData = {};
            if (req.body.Title) { UpdateData["Title"] = req.body.Title }
            if (req.body.URL) { UpdateData["URL"] = req.body.URL }
            if (req.body.Type) { UpdateData["Type"] = req.body.Type }
            await CalculationModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
            return res.status(200).json({ status: 1, Message: "Calculation Update Successfully.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.CalculationDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        // else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            await CalculationModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, ModifiedDate: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "Calculation Detail Deleted Successfully.", data: null })
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.PolicyTypeAdd = [async (req, res) => {
    try {
        if (!req.body.Type) { res.json({ status: 0, Message: 'Please Enter Your Type!', data: null }); }
        else {
            await new PolicyTypeModel({
                Type: req.body.Type
            }).save();
            return res.status(200).json({ status: 1, Message: "Policy Type Added Successfully.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.PolicyTypeGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5;
            const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        let Total = await PolicyTypeModel.countDocuments(obj).exec();
        let policytypedata = await PolicyTypeModel.find(obj).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        // let policytypedata = await PolicyTypeModel.find(obj).sort({ '_id': -1 }).exec();
        if (policytypedata.length > 0) {
            return res.status(200).json({ status: 1, Message: "Success.", data: policytypedata, totalItems: Total, count: Total });
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.PolicyTypeFindByID = [async (req, res) => {
    try {
        if (!req.body.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let policytypedata = await PolicyTypeModel.findOne({ _id: req.body.ID, IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
            if (policytypedata) {
                return res.status(200).json({ status: 1, Message: "Success.", data: policytypedata });
            } else {
                return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.PolicyTypeUpdate = [async (req, res) => {
    try {
        if (!req.body.ID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else {
            var Updatedata = {};
            if (req.body.Type) { Updatedata["Type"] = req.body.Type; }
            await PolicyTypeModel.updateOne({ _id: req.body.ID }, Updatedata).exec();
            return res.status(200).json({ status: 1, Message: "Policy Type Added Successfully.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.PolicyTypeDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        else {
            await PolicyTypeModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, ModifiedDate: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "Policy Type Detail Deleted Successfully.", data: null })
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DropDownPolicyType = [async (req, res) => {
    try {
        let policytype = await PolicyTypeModel.find({}, '_id Type').sort({ '_id': -1 }).exec();
        if (policytype.length > 0) {
            var Result = [];
            await policytype.forEach((doc) => {
                Result.push({
                    label: doc.Type,
                    value: doc._id
                });
            })
            return res.status(200).json({ status: 1, Message: "Success", data: Result });
        } else {
            return res.status(200).json({ status: 1, Message: "Success", data: [] });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, Date: moment().format("YYYY-MM-DDTHH:mm:ss"), RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}