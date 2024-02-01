const moment = require('moment-timezone');
var mongoose = require('mongoose');
const ErrorLogsModel = require("../models/ErrorLogsModel");
const UserModel = require("../models/UserModel");
const UserPlanDetailModel = require("../models/UserPlanDetailModel");
const MinMemberModel = require("../models/MinMemberModel");
const HealthInsuranceModel = require("../models/HealthInsuranceModel");
const HospitalModel = require("../models/HospitalModel");
const AppointmentModel = require("../models/AppointmentModel");
var mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid");
var multer = require("multer");
const DIR = "./public/uploads";
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, DIR) },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf|PDF)$/)) {
        req.fileValidationError = "Only pdf files are allowed!";
        return cb(new Error(ImageError), false);
    }
    cb(null, true);
};

var ImageError = 'Only .pdf format allowed!';
exports.GetRadius = [async (req, res) => {
    try {
        calcCrow(21.1860421, 72.7921654, 20.5993117, 72.8992255, function (callback) {
            return res.status(200).json({ status: 1, Message: "Success.", distance: callback, data: null });
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HealthInsuranceSearch = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else {
            if (req.body.StartDate && req.body.EndDate) {
                let todayi = new Date(req.body.StartDate);
                let todayEODi = new Date(req.body.EndDate);
                todayi.setHours(0, 0, 0, 0);
                todayEODi.setHours(23, 59, 59, 999);
                SDateCon = { $gte: todayi.toISOString(), $lte: todayEODi.toISOString() };
            } else {
                let today = new Date();
                let todayEOD = new Date();
                today.setHours(0, 0, 0, 0);
                todayEOD.setHours(23, 59, 59, 999);
                SDateCon = { $gte: today.toISOString(), $lte: todayEOD.toISOString() };
            }
        }
        let HealthInsuranceData = await HealthInsuranceModel.find({ UserID: req.body.UserID, CreatedDate: SDateCon, IsActive: true, IsDeleted: false }).populate({ path: 'HealthInsuranceUserDetail', select: 'Name MobileNo UserCode' }).sort({ '_id': -1 }).exec();
        if (HealthInsuranceData.length > 0) {
            var AllHealthInsuranceData = [];
            HealthInsuranceData.forEach((healthinsurancedata) => {
                AllHealthInsuranceData.push({
                    _id: healthinsurancedata._id,
                    Status: healthinsurancedata.Status,
                    IsActive: healthinsurancedata.IsActive,
                    IsDeleted: healthinsurancedata.IsDeleted,
                    UserID: healthinsurancedata.UserID,
                    Name: healthinsurancedata.HealthInsuranceUserDetail.Name,
                    MobileNo: healthinsurancedata.HealthInsuranceUserDetail.MobileNo,
                    UserCode: healthinsurancedata.HealthInsuranceUserDetail.UserCode,
                    PoliceName: healthinsurancedata.PoliceName,
                    PolicyNumber: healthinsurancedata.PolicyNumber,
                    PolicyProvider: healthinsurancedata.PolicyProvider,
                    StartDate: healthinsurancedata.StartDate,
                    EndDate: healthinsurancedata.EndDate,
                    InsuranceAmount: healthinsurancedata.InsuranceAmount,
                    Date: healthinsurancedata.Date
                })
            });
            return res.status(200).json({ status: 1, Message: "Success.", data: AllHealthInsuranceData });
        }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HealthInsuranceAdd = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter User ID!', data: null }); }
        else if (!req.body.PoliceName) { return res.json({ status: 0, Message: 'Please Enter Police Name!', data: null }); }
        else if (!req.body.PolicyNumber) { return res.json({ status: 0, Message: 'Please Enter Policy Number!', data: null }); }
        else if (!req.body.PolicyProvider) { return res.json({ status: 0, Message: 'Please Enter Policy Provider!', data: null }); }
        else if (!req.body.InsuranceAmount) { return res.json({ status: 0, Message: 'Please Enter Insurance Amount!', data: null }); }
        else if (!req.body.StartDate) { return res.json({ status: 0, Message: 'Please Slect StartDate!', data: null }); }
        else if (!req.body.EndDate) { return res.json({ status: 0, Message: 'Please Slect EndDate!', data: null }); }
        else {
            let healthIns = await HealthInsuranceModel.findOne({ UserID: req.body.UserID }).exec();
            if (healthIns) {
                let UserPlan = await UserPlanDetailModel.findOne({ UserID: req.body.UserID, PlanStatus: "Working", $and: [{ StartDate: { $lte: new Date() } }, { EndDate: { $gte: new Date() } }] }).exec();
                if (UserPlan) {
                    return res.status(200).json({ status: 0, Message: "HealthInsurance Already Allocated.", data: null });
                } else {
                    //db.sponsoreds.find({$and:[{startDate:{$lte:new Date()}},{endDate:{$gte:new Date()}}]})
                    let UserPlan = await UserPlanDetailModel.findOne({ UserID: req.body.UserID, PlanStatus: "Working" }).exec();
                    let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                    (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = "10";
                    if (UserPlan) {
                        if (Number(UserPlan.TotalReferralCount) >= Number(MinimumMember)) {
                            await new HealthInsuranceModel({
                                UserID: req.body.UserID,
                                PoliceName: req.body.PoliceName,
                                PolicyNumber: req.body.PolicyNumber,
                                PolicyProvider: req.body.PolicyProvider,
                                StartDate: moment(req.body.StartDate).format("DD-MM-YYYY"),
                                EndDate: moment(req.body.EndDate).format('DD-MM-YYYY'),
                                InsuranceAmount: req.body.InsuranceAmount,
                                Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                            }).save();
                            return res.status(200).json({ status: 1, Message: "HealthInsurance Detail Added Successfully.", data: null });
                        } else {
                            return res.status(200).json({ status: 0, Message: "Not Eligible For Health-Insurance.", data: null });
                        }
                    } else {
                        await new HealthInsuranceModel({
                            UserID: req.body.UserID,
                            PoliceName: req.body.PoliceName,
                            PolicyNumber: req.body.PolicyNumber,
                            PolicyProvider: req.body.PolicyProvider,
                            StartDate: moment(req.body.StartDate).format("DD-MM-YYYY"),
                            EndDate: moment(req.body.EndDate).format('DD-MM-YYYY'),
                            InsuranceAmount: req.body.InsuranceAmount,
                            Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                        }).save();
                        return res.status(200).json({ status: 1, Message: "HealthInsurance Detail Added Successfully.", data: null });
                    }
                }
            } else {
                await new HealthInsuranceModel({
                    UserID: req.body.UserID,
                    PoliceName: req.body.PoliceName,
                    PolicyNumber: req.body.PolicyNumber,
                    PolicyProvider: req.body.PolicyProvider,
                    StartDate: moment(req.body.StartDate).format("DD-MM-YYYY"),
                    EndDate: moment(req.body.EndDate).format('DD-MM-YYYY'),
                    InsuranceAmount: req.body.InsuranceAmount,
                    Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                }).save();
                return res.status(200).json({ status: 1, Message: "HealthInsurance Detail Added Successfully.", data: null });
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.NewHealthInsuranceAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single('PDF');
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(200).json({ status: 0, Message: ImageError, Data: '' }) }
            else {
                console.log('===req.body===', req.body);
                // console.log('===req.file===', req.file);
                if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter User ID!', data: null }); }
                else if (!req.body.PoliceName) { return res.json({ status: 0, Message: 'Please Enter Police Name!', data: null }); }
                else if (!req.body.PolicyNumber) { return res.json({ status: 0, Message: 'Please Enter Policy Number!', data: null }); }
                else if (!req.body.PolicyProvider) { return res.json({ status: 0, Message: 'Please Enter Policy Provider!', data: null }); }
                else if (!req.body.PolicyTypeID) { return res.json({ status: 0, Message: 'Please Enter Policy Type ID!', data: null }); }
                else if (!req.body.CustomerName) { return res.json({ status: 0, Message: 'Please Enter Customer Name!', data: null }); }
                else if (!req.body.CustomerMobileNo) { return res.json({ status: 0, Message: 'Please Enter Customer Mobile Number!', data: null }); }
                else if (!req.body.InsuranceAmount) { return res.json({ status: 0, Message: 'Please Enter Insurance Amount!', data: null }); }
                else if (!req.body.StartDate) { return res.json({ status: 0, Message: 'Please Select StartDate!', data: null }); }
                else if (!req.body.EndDate) { return res.json({ status: 0, Message: 'Please Select EndDate!', data: null }); }
                else if (!req.body.TypeMode) { return res.json({ status: 0, Message: 'Please Select Type Mode!', data: null }); }
                // else if (!req.file) { return res.json({ status: 0, Message: 'Please Select PDF File!', data: null }); }
                else {
                    let CheckPolicyNumber = await HealthInsuranceModel.findOne({ PolicyNumber: req.body.PolicyNumber, IsActive: true }).sort({ _id: -1 }).exec();
                    if (CheckPolicyNumber) { return res.json({ status: 0, Message: 'Policy Number Already Exist!', data: null }); }
                    else {
                        let Total = await HealthInsuranceModel.countDocuments({}).exec();
                        var UserCode = "AJAY" + (Number(Total) + 1) + req.body.CustomerMobileNo.slice(-3);
                        // var UserCode = "ATAL" + (Number(Total) + 1) + req.body.CustomerMobileNo.slice(-3)
                        console.log("===usercode===", UserCode)
                        if (req.body.ReferralCode) {
                            let CheckUserData = await UserModel.findOne({ UserCode: req.body.ReferralCode, IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                            if (CheckUserData) {
                                await new HealthInsuranceModel({
                                    UserID: req.body.UserID,
                                    PoliceName: req.body.PoliceName,
                                    PolicyNumber: req.body.PolicyNumber,
                                    PolicyProvider: req.body.PolicyProvider,
                                    UserCode: UserCode,
                                    ReferralCode: req.body.ReferralCode ? req.body.ReferralCode : '',
                                    CustomerName: req.body.CustomerName,
                                    CustomerMobileNo: req.body.CustomerMobileNo,
                                    PDF: (req.file) ? (req.file.filename) : (''),
                                    AgentName: req.body.AgentName ? req.body.AgentName : '',
                                    AgentMobileNo: req.body.AgentMobileNo ? req.body.AgentMobileNo : '',
                                    TypeMode: req.body.TypeMode,
                                    PolicyTypeID: req.body.PolicyTypeID,
                                    StartDate: req.body.StartDate,
                                    EndDate: req.body.EndDate,
                                    InsuranceAmount: req.body.InsuranceAmount,
                                    Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                return res.status(200).json({ status: 1, Message: "Insurance Detail Added Successfully.", data: null });
                            } else {
                                return res.status(200).json({ status: 0, Message: "Invalid Referral Code.", data: null });
                            }
                        } else {
                            await new HealthInsuranceModel({
                                UserID: req.body.UserID,
                                PoliceName: req.body.PoliceName,
                                PolicyNumber: req.body.PolicyNumber,
                                PolicyProvider: req.body.PolicyProvider,
                                UserCode: UserCode,
                                ReferralCode: '',
                                CustomerName: req.body.CustomerName,
                                CustomerMobileNo: req.body.CustomerMobileNo,
                                PDF: (req.file) ? (req.file.filename) : (''),
                                AgentName: req.body.AgentName ? req.body.AgentName : '',
                                AgentMobileNo: req.body.AgentMobileNo ? req.body.AgentMobileNo : '',
                                TypeMode: req.body.TypeMode,
                                PolicyTypeID: req.body.PolicyTypeID,
                                StartDate: req.body.StartDate,
                                EndDate: req.body.EndDate,
                                InsuranceAmount: req.body.InsuranceAmount,
                                Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                            }).save();
                            return res.status(200).json({ status: 1, Message: "Insurance Detail Added Successfully.", data: null });
                        }
                    }
                }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.NewHealthInsuranceGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, PoliceName, PolicyNumber, PolicyProvider, InsuranceAmount, PlanTypeID } = req.query;
        const { limit, offset } = getPagination(page, size);
        let obj = {}, obj1 = {};
        obj1['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj1['PlanTypeID'] = PlanTypeID ? mongoose.Types.ObjectId(PlanTypeID) : { $ne: null };
        obj1['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj1['PoliceName'] = PoliceName ? { $regex: new RegExp(PoliceName), $options: "i" } : { $ne: null };
        obj1['PolicyNumber'] = PolicyNumber ? { $regex: new RegExp(PolicyNumber), $options: "i" } : { $ne: null };
        obj1['PolicyProvider'] = PolicyProvider ? { $regex: new RegExp(PolicyProvider), $options: "i" } : { $ne: null };
        obj1['InsuranceAmount'] = InsuranceAmount ? { $regex: new RegExp(InsuranceAmount), $options: "i" } : { $ne: null };
        obj1['IsActive'] = true;
        obj1['IsDeleted'] = false;
        console.log("==obj===", obj1)
        console.log("==obj1===", obj1)
        await HealthInsuranceModel.aggregate([
            {
                $lookup:
                {
                    from: 'User',
                    localField: 'UserID',
                    foreignField: '_id',
                    as: 'user_docs'
                }
            },
            {
                $lookup:
                {
                    from: 'policytypes',
                    localField: 'PolicyTypeID',
                    foreignField: '_id',
                    as: 'policy_docs'
                }
            },
            {
                $match: {
                    "PoliceName": obj1['PoliceName'],
                    "PolicyNumber": obj1['PolicyNumber'],
                    "PolicyProvider": obj1['PolicyProvider'],
                    "InsuranceAmount": obj1['InsuranceAmount'],
                    "IsActive": obj1['IsActive'],
                    "IsDeleted": obj1['IsDeleted'],
                    "user_docs.Name": obj1['Name'],
                    "user_docs.MobileNo": obj1['MobileNo'],
                    "user_docs.PlanTypeID": obj1['PlanTypeID']
                }
            }
            // {
            //     $match: {
            //         user_docs:
            //         {
            //             $elemMatch: obj
            //         }
            //     }
            // }
        ]).exec(async (err, ObjData) => {

            console.log("ObjData", ObjData);
            if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
            else {
                if (ObjData.length > 0) {
                    await HealthInsuranceModel.aggregate([
                        {
                            $lookup: { from: 'User', localField: 'UserID', foreignField: '_id', as: 'user_docs' }
                        },
                        {
                            $lookup: { from: 'policytypes', localField: 'PolicyTypeID', foreignField: '_id', as: 'policy_docs' },
                        },
                        { $sort: { _id: -1 } },
                        {
                            $match: {
                                "PoliceName": obj1['PoliceName'],
                                "PolicyNumber": obj1['PolicyNumber'],
                                "PolicyProvider": obj1['PolicyProvider'],
                                "InsuranceAmount": obj1['InsuranceAmount'],
                                "IsActive": obj1['IsActive'],
                                "IsDeleted": obj1['IsDeleted'],
                                "user_docs.Name": obj1['Name'],
                                "user_docs.MobileNo": obj1['MobileNo'],
                                "user_docs.PlanTypeID": obj1['PlanTypeID']
                            }
                        },
                        //{ $match: obj1 },
                        // $match: { user_docs: { $elemMatch: obj } } },
                        { $skip: offset }, { $limit: limit }
                    ]).exec(function (err, results) {
                        if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
                        else {
                            if (results.length > 0) {
                                let Total = ObjData.length;
                                let round = Math.ceil(Total / size);
                                return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: results, count: Total });
                            } else { return res.status(200).json({ status: 0, Message: 'Data Not Found!', data: null }); }
                        }
                    });
                } else { return res.status(200).json({ status: 0, Message: 'Data Not Found!', data: null }); }
            }
        });
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.ViewHealthInsurance = [async (req, res) => {
    try {
        var UserID = ((req.body.UserID) ? (req.body.UserID) : { $nin: [] });
        // var UserID = ((req.body.UserID) ? ({ $in: [req.body.UserID] }) : { $nin: [] });
        var ReferralCode = ((req.body.ReferralCode) ? (req.body.ReferralCode) : { $nin: [] });
        let HealthInsuranceData = await HealthInsuranceModel.find({ UserID: UserID, ReferralCode: ReferralCode, IsActive: true, IsDelete: false })
            .populate({ path: 'UserID', select: 'Name' })
            .populate({ path: 'PolicyTypeID', select: 'Type' }).exec();
        if (HealthInsuranceData) {
            return res.status(200).json({ status: 1, Message: "Success.", data: HealthInsuranceData });
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.NewHealthInsuranceUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single('PDF');
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(200).json({ status: 0, Message: ImageError, Data: '' }) }
            else {
                // if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                // else if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter User ID!', data: null }); }
                // else if (!req.body.PolicyTypeID) { return res.json({ status: 0, Message: 'Please Enter Policy Type ID!', data: null }); }
                // else if (!req.body.PoliceName) { return res.json({ status: 0, Message: 'Please Enter Police Name!', data: null }); }
                // else if (!req.body.PolicyNumber) { return res.json({ status: 0, Message: 'Please Enter Policy Number!', data: null }); }
                // else if (!req.body.PolicyProvider) { return res.json({ status: 0, Message: 'Please Enter Policy Provider!', data: null }); }
                // else if (!req.body.InsuranceAmount) { return res.json({ status: 0, Message: 'Please Enter Insurance Amount!', data: null }); }
                // else if (!req.body.TypeMode) { return res.json({ status: 0, Message: 'Please Select Type Mode!', data: null }); }
                // else {
                let CheckPolicyNumber = await HealthInsuranceModel.findOne({ _id: { $nin: req.body.CID }, PolicyNumber: req.body.PolicyNumber, IsActive: true }).sort({ _id: -1 }).exec();
                if (CheckPolicyNumber) { return res.json({ status: 0, Message: 'Policy Number Already Exist!', data: null }); }
                else {
                    let Total = await HealthInsuranceModel.countDocuments({}).exec();
                    var UserCode = "AJAY" + (Number(Total) + 1) + req.body.CustomerMobileNo.slice(-3);
                    // var UserCode = "ATAL" + (Number(Total) + 1) + req.body.CustomerMobileNo.slice(-3)
                    console.log("===usercode===", UserCode)
                    if (req.body.ReferralCode) {
                        let CheckUserData = await UserModel.findOne({ _id: { $nin: req.body.CID }, UserCode: req.body.ReferralCode, IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                        if (CheckUserData) {
                            console.log("====req.body====", req.body);
                            var UpdateHealthInsuranceData = {};
                            if (req.body.UserID) { UpdateHealthInsuranceData["UserID"] = req.body.UserID }
                            if (req.file) { UpdateHealthInsuranceData["PDF"] = req.file.filename }
                            if (req.body.CustomerName) { UpdateHealthInsuranceData["CustomerName"] = req.body.CustomerName }
                            if (req.body.CustomerMobileNo) { UpdateHealthInsuranceData["CustomerMobileNo"] = req.body.CustomerMobileNo }
                            if (req.body.AgentName) { UpdateHealthInsuranceData["AgentName"] = req.body.AgentName }
                            if (req.body.AgentMobileNo) { UpdateHealthInsuranceData["AgentMobileNo"] = req.body.AgentMobileNo }
                            if (req.body.StartDate) { UpdateHealthInsuranceData["StartDate"] = req.body.StartDate }
                            if (req.body.EndDate) { UpdateHealthInsuranceData["EndDate"] = req.body.EndDate }
                            if (req.body.ReferralCode) { UpdateHealthInsuranceData["ReferralCode"] = req.body.ReferralCode }
                            if (req.body.PoliceName) { UpdateHealthInsuranceData["PoliceName"] = req.body.PoliceName }
                            if (req.body.PolicyTypeID) { UpdateHealthInsuranceData["PolicyTypeID"] = req.body.PolicyTypeID }
                            if (req.body.TypeMode) { UpdateHealthInsuranceData["TypeMode"] = req.body.TypeMode }
                            if (req.body.PolicyNumber) { UpdateHealthInsuranceData["PolicyNumber"] = req.body.PolicyNumber }
                            if (req.body.PolicyProvider) { UpdateHealthInsuranceData["PolicyProvider"] = req.body.PolicyProvider }
                            if (req.body.InsuranceAmount) { UpdateHealthInsuranceData["InsuranceAmount"] = req.body.InsuranceAmount }
                            UpdateHealthInsuranceData["ModifiedDate"] = new Date();
                            await HealthInsuranceModel.updateOne({ _id: req.body.CID }, UpdateHealthInsuranceData).exec();
                            return res.status(200).json({ status: 1, Message: "Insurance Detail Updated Successfully.", data: null });
                        } else {
                            return res.status(200).json({ status: 0, Message: "Invalid Referral Code.", data: null });
                        }
                    } else {
                        console.log("====req.body====", req.body);
                        var UpdateHealthInsuranceData = {};
                        if (req.body.UserID) { UpdateHealthInsuranceData["UserID"] = req.body.UserID };
                        if (req.file) { UpdateHealthInsuranceData["PDF"] = req.file.filename }
                        if (req.body.CustomerName) UpdateHealthInsuranceData["CustomerName"] = req.body.CustomerName
                        if (req.body.CustomerMobileNo) UpdateHealthInsuranceData["CustomerMobileNo"] = req.body.CustomerMobileNo
                        if (req.body.AgentName) { UpdateHealthInsuranceData["AgentName"] = req.body.AgentName }
                        if (req.body.AgentMobileNo) { UpdateHealthInsuranceData["AgentMobileNo"] = req.body.AgentMobileNo }
                        if (req.body.StartDate) { UpdateHealthInsuranceData["StartDate"] = req.body.StartDate }
                        if (req.body.EndDate) { UpdateHealthInsuranceData["EndDate"] = req.body.EndDate }
                        if (req.body.ReferralCode) { UpdateHealthInsuranceData["ReferralCode"] = req.body.ReferralCode }
                        if (req.body.PoliceName) { UpdateHealthInsuranceData["PoliceName"] = req.body.PoliceName }
                        if (req.body.PolicyTypeID) { UpdateHealthInsuranceData["PolicyTypeID"] = req.body.PolicyTypeID }
                        if (req.body.TypeMode) { UpdateHealthInsuranceData["TypeMode"] = req.body.TypeMode }
                        if (req.body.PolicyNumber) { UpdateHealthInsuranceData["PolicyNumber"] = req.body.PolicyNumber }
                        if (req.body.PolicyProvider) { UpdateHealthInsuranceData["PolicyProvider"] = req.body.PolicyProvider }
                        if (req.body.InsuranceAmount) { UpdateHealthInsuranceData["InsuranceAmount"] = req.body.InsuranceAmount }
                        UpdateHealthInsuranceData["ModifiedDate"] = new Date();
                        await HealthInsuranceModel.updateOne({ _id: req.body.CID }, UpdateHealthInsuranceData).exec();
                        return res.status(200).json({ status: 1, Message: "Insurance Detail Updated Successfully.", data: null });

                    }
                }
                // }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.HealthInsuranceGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, PoliceName, PolicyNumber, PolicyProvider, InsuranceAmount } = req.query;
        const { limit, offset } = getPagination(page, size);
        let obj = {}, obj1 = {};
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj1['PoliceName'] = PoliceName ? { $regex: new RegExp(PoliceName), $options: "i" } : { $ne: null };
        obj1['PolicyNumber'] = PolicyNumber ? { $regex: new RegExp(PolicyNumber), $options: "i" } : { $ne: null };
        obj1['PolicyProvider'] = PolicyProvider ? { $regex: new RegExp(PolicyProvider), $options: "i" } : { $ne: null };
        obj1['InsuranceAmount'] = InsuranceAmount ? { $regex: new RegExp(InsuranceAmount), $options: "i" } : { $ne: null };
        obj1['IsActive'] = true;
        obj1['IsDeleted'] = false;
        await HealthInsuranceModel.aggregate([
            { $lookup: { from: 'User', localField: 'UserID', foreignField: '_id', as: 'user_docs' } }, { $match: obj1 }, { $match: { user_docs: { $elemMatch: obj } } }
        ]).exec(async (err, ObjData) => {
            if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
            else {
                if (ObjData.length > 0) {
                    await HealthInsuranceModel.aggregate([
                        { $lookup: { from: 'User', localField: 'UserID', foreignField: '_id', as: 'user_docs' } },
                        { $sort: { _id: -1 } },
                        { $match: obj1 },
                        { $match: { user_docs: { $elemMatch: obj } } },
                        { $skip: offset }, { $limit: limit }
                    ]).exec(function (err, results) {
                        if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
                        else {
                            if (results.length > 0) {
                                let Total = ObjData.length;
                                let round = Math.ceil(Total / size);
                                return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: results, count: Total });
                            } else { return res.status(200).json({ status: 0, Message: 'Data Not Found!', data: null }); }
                        }
                    });
                } else { return res.status(200).json({ status: 0, Message: 'Data Not Found!', data: null }); }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HealthInsuranceBYID = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let HealthInsuranceData = await HealthInsuranceModel.findOne({ _id: req.params.ID, IsActive: true, IsDeleted: false }).
                populate({ path: 'HealthInsuranceUserDetail', select: 'Name MobileNo UserCode' }).exec();
            if (HealthInsuranceData) {
                return res.status(200).json({ status: 1, Message: "Success.", data: HealthInsuranceData });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.FetchHealthInsuranceBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let HealthInsuranceData = await HealthInsuranceModel.findOne({ _id: req.body.ID, IsActive: true, IsDeleted: false }).
                populate({ path: 'HealthInsuranceUserDetail', select: 'Name MobileNo UserCode' })
                .populate({ path: 'PolicyTypeID', select: 'Type' }).exec();
            if (HealthInsuranceData) {
                return res.status(200).json({ status: 1, Message: "Success.", data: HealthInsuranceData });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];

exports.HealthInsuranceUpdate = [async (req, res) => {
    try {
        if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter User ID!', data: null }); }
        else if (!req.body.PoliceName) { return res.json({ status: 0, Message: 'Please Enter Police Name!', data: null }); }
        else if (!req.body.PolicyNumber) { return res.json({ status: 0, Message: 'Please Enter Policy Number!', data: null }); }
        else if (!req.body.PolicyProvider) { return res.json({ status: 0, Message: 'Please Enter Policy Provider!', data: null }); }
        else if (!req.body.InsuranceAmount) { return res.json({ status: 0, Message: 'Please Enter Insurance Amount!', data: null }); }
        else {
            var UpdateHealthInsuranceData = {};
            UpdateHealthInsuranceData["UserID"] = req.body.UserID;
            UpdateHealthInsuranceData["PoliceName"] = req.body.PoliceName;
            UpdateHealthInsuranceData["PolicyNumber"] = req.body.PolicyNumber;
            UpdateHealthInsuranceData["PolicyProvider"] = req.body.PolicyProvider;
            UpdateHealthInsuranceData["InsuranceAmount"] = req.body.InsuranceAmount;
            UpdateHealthInsuranceData["ModifiedDate"] = new Date();
            await HealthInsuranceModel.updateOne({ _id: req.body.CID }, UpdateHealthInsuranceData).exec();
            return res.status(200).json({ status: 1, Message: "Health Insurance Detail Updated Successfully.", data: null });
        }
    } catch (err) {
        save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.HealthInsuranceDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            await HealthInsuranceModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, ModifiedDate: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "Health Insurance Detail Deleted Successfully.", data: null })
        }
    } catch (err) {
        save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.HospitalRadius = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        if (req.body.Latitude && req.body.Longitude) {
            var lt = Number(req.body.Latitude);
            var long = Number(req.body.Longitude);
            await HospitalModel.aggregate([
                {
                    // $geoNear: {
                    //     near: {
                    //         type: "Point",
                    //         coordinates: [lt, long]
                    //     },
                    //     distanceField: "dist",
                    //     maxDistance: 50000,
                    //     spherical: true
                    // }
                    $geoNear: {
                        maxDistance: 50000, // 400 Meters
                        distanceMultiplier: 6378.137,
                        //num: 10,
                        near: [lt, long],
                        spherical: true,
                        key: "loc",
                        distanceField: "dist"
                    }
                },
                {
                    $project: {
                        "_id": "$_id", "Name": "$Name", "meter": "$dist", "MobileNo": "$MobileNo",
                        "Address": "$Address", "UserName": "$UserName", "Password": "$Password",
                        "Latitude": "$Latitude", "Longitude": "$Longitude", "DoctorName1": "$DoctorName1",
                        "DoctorMobileNo1": "$DoctorMobileNo1", "Email": "$Email",
                        "DoctorName2": "$DoctorName2", "DoctorMobileNo2": "$DoctorMobileNo2", "Date": "$Date",
                    }
                }
            ]).exec(function (err, results) {
                if (err) { save(req, err.message); return res.status(200).json({ status: 0, Message: err.message, data: null }); }
                else { return res.status(200).json({ status: 1, Message: "Success.", data: results }); }
            });
        } else {
            let HospitalData = await HospitalModel.find({ IsActive: true, IsDeleted: false }, '-IsActive -IsDeleted -loc -CreatedDate -ModifiedDate -__v').sort({ '_id': -1 }).exec();
            if (HospitalData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", data: HospitalData }); }
            else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { console.log(err); save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HospitalAdd = [async (req, res) => {
    try {
        if (!req.body.Name) { return res.json({ status: 0, Message: 'Please Enter Name!', data: null }); }
        else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter MobileNo!', data: null }); }
        else if (!req.body.Address) { return res.json({ status: 0, Message: 'Please Enter Address!', data: null }); }
        else if (!req.body.UserName) { return res.json({ status: 0, Message: 'Please Enter UserName!', data: null }); }
        else if (!req.body.Password) { return res.json({ status: 0, Message: 'Please Enter Password!', data: null }); }
        else if (!req.body.Latitude) { return res.json({ status: 0, Message: 'Please Enter Latitude!', data: null }); }
        else if (!req.body.Longitude) { return res.json({ status: 0, Message: 'Please Enter Longitude!', data: null }); }
        else if (!req.body.DocName) { return res.json({ status: 0, Message: 'Please Enter Doctor Name!', data: null }); }
        else if (!req.body.DocContact) { return res.json({ status: 0, Message: 'Please Enter Doctor MobileNo!', data: null }); }
        else {
            var lt = Number(req.body.Latitude);
            var long = Number(req.body.Longitude);
            await new HospitalModel({
                Name: req.body.Name,
                MobileNo: req.body.MobileNo,
                Address: req.body.Address,
                UserName: req.body.UserName,
                Password: req.body.Password,
                Latitude: req.body.Latitude,
                Longitude: req.body.Longitude,
                loc: { "type": "Point", "coordinates": [lt, long] },
                DoctorName1: req.body.DocName,
                DoctorMobileNo1: req.body.DocContact,
                Email: (req.body.Email) ? (req.body.Email) : '',
                DoctorName2: (req.body.AltDocName) ? (req.body.AltDocName) : '',
                DoctorMobileNo2: (req.body.AltDocContact) ? (req.body.AltDocContact) : '',
                Date: moment().format("YYYY-MM-DDTHH:mm:ss")
            }).save();
            return res.status(200).json({ status: 1, Message: "Hospital Detail Added Successfully.", data: null });
        }
    } catch (err) { console.log(err); save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HospitalGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, Address } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj['Address'] = Address ? { $regex: new RegExp(Address), $options: "i" } : { $ne: null };
        let Total = await HospitalModel.countDocuments(obj).exec();
        let UserData = await HospitalModel.find(obj).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HospitalBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else if (req.body.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let HospitalData = await HospitalModel.findOne({ _id: req.body.ID, IsActive: true, IsDeleted: false }).exec();
            if (HospitalData) { return res.status(200).json({ status: 1, Message: "Success.", data: HospitalData }); }
            else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HospitalUpdate = [async (req, res) => {
    try {
        if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else if (!req.body.Name) { return res.json({ status: 0, Message: 'Please Enter Name!', data: null }); }
        else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter MobileNo!', data: null }); }
        else if (!req.body.Address) { return res.json({ status: 0, Message: 'Please Enter Address!', data: null }); }
        else if (!req.body.UserName) { return res.json({ status: 0, Message: 'Please Enter UserName!', data: null }); }
        else if (!req.body.Password) { return res.json({ status: 0, Message: 'Please Enter Password!', data: null }); }
        else if (!req.body.Latitude) { return res.json({ status: 0, Message: 'Please Enter Latitude!', data: null }); }
        else if (!req.body.Longitude) { return res.json({ status: 0, Message: 'Please Enter Longitude!', data: null }); }
        else if (!req.body.DocName) { return res.json({ status: 0, Message: 'Please Enter Doctor Name!', data: null }); }
        else if (!req.body.DocContact) { return res.json({ status: 0, Message: 'Please Enter Doctor MobileNo!', data: null }); }
        else {
            var lt = Number(req.body.Latitude);
            var long = Number(req.body.Longitude);
            var UpdatePaidAmountData = {};
            UpdatePaidAmountData["Name"] = req.body.Name;
            UpdatePaidAmountData["MobileNo"] = req.body.MobileNo;
            UpdatePaidAmountData["Address"] = req.body.Address;
            UpdatePaidAmountData["UserName"] = req.body.UserName;
            UpdatePaidAmountData["Password"] = req.body.Password;
            UpdatePaidAmountData["Latitude"] = req.body.Latitude;
            UpdatePaidAmountData["Longitude"] = req.body.Longitude;
            UpdatePaidAmountData["loc"] = { "type": "Point", "coordinates": [lt, long] };
            UpdatePaidAmountData["DoctorName1"] = req.body.DocName;
            UpdatePaidAmountData["DoctorMobileNo1"] = req.body.DocContact;
            UpdatePaidAmountData["Email"] = (req.body.Email) ? (req.body.Email) : '';
            UpdatePaidAmountData["DoctorName2"] = (req.body.AltDocName) ? (req.body.AltDocName) : '';
            UpdatePaidAmountData["DoctorMobileNo2"] = (req.body.AltDocContact) ? (req.body.AltDocContact) : '';
            UpdatePaidAmountData["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss");
            UpdatePaidAmountData["ModifiedDate"] = new Date();
            await HospitalModel.updateOne({ _id: req.body.CID }, UpdatePaidAmountData).exec();
            return res.status(200).json({ status: 1, Message: "Hospital Detail Updated Successfully.", data: null });
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HospitalDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            await HospitalModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, ModifiedDate: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "Hospital Detail Deleted Successfully.", data: null })
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AppointmentSearch = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            return res.json({ status: 0, Message: 'Please Enter UserID!', data: null });
        } else {
            //var CheckHospitalID = ((req.body.HospitalID) ? ({ $in: [mongoose.Types.ObjectId(req.body.HospitalID)] }) : { $nin: [] });
            var SDateCon = "";
            if (req.body.StartDate && req.body.EndDate) {
                let todayi = new Date(req.body.StartDate);
                let todayEODi = new Date(req.body.EndDate);
                todayi.setHours(0, 0, 0, 0);
                todayEODi.setHours(23, 59, 59, 999);
                SDateCon = { $gte: todayi, $lte: todayEODi };
            } else {
                let today = new Date();
                let todayEOD = new Date();
                today.setHours(0, 0, 0, 0);
                todayEOD.setHours(23, 59, 59, 999);
                SDateCon = { $gte: today, $lte: todayEOD };
            }
            var UID = mongoose.Types.ObjectId(req.body.UserID);
            await AppointmentModel.aggregate(
                [
                    {
                        "$match": {
                            "UserID": UID,
                            "AppointmentDate": SDateCon
                            //"HospitalID": CheckHospitalID
                        }
                    },
                    {
                        "$project": { "_id": "_id", "Appointment": "$$ROOT" }
                    },
                    {
                        "$lookup": {
                            "localField": "Appointment.UserID", "from": "User", "foreignField": "_id", "as": "User"
                        }
                    },
                    {
                        "$unwind": { "path": "$User", "preserveNullAndEmptyArrays": false }
                    },
                    {
                        "$lookup": {
                            "localField": "Appointment.HospitalID", "from": "Hospital", "foreignField": "_id", "as": "Hospital"
                        }
                    },
                    {
                        "$unwind": { "path": "$Hospital", "preserveNullAndEmptyArrays": false }
                    },
                    {
                        "$project": {
                            "_id": "$Appointment._id",
                            "Status": "$Appointment.Status",
                            "IsActive": "$Appointment.IsActive",
                            "IsDeleted": "$Appointment.IsDeleted",
                            "UserID": "$Appointment.UserID",
                            "Name": "$User.Name",
                            "MobileNo": "$User.MobileNo",
                            "HospitalID": "$Appointment.HospitalID",
                            "HospitalName": "$Hospital.Name",
                            "HospitalMobileNo": "$Hospital.MobileNo",
                            "ContactNo": "$Appointment.ContactNo",
                            "Email": "$Appointment.Email",
                            "Description": "$Appointment.Description",
                            "AppointmentDate": "$Appointment.AppointmentDate",
                            "Time": "$Appointment.Time",
                            "Date": "$Appointment.Date"
                            //"CreatedDate": "$Appointment.CreatedDate",
                            //"ModifiedDate": "$Appointment.ModifiedDate",
                        }
                    }]
            ).exec(function (err, results) {
                if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
                else { return res.status(200).json({ status: 1, Message: "Success.", data: results }); }
            });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AppointmentAdd = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else if (!req.body.HospitalID) { return res.json({ status: 0, Message: 'Please Enter HospitalID!', data: null }); }
        else if (!req.body.ContactNo) { return res.json({ status: 0, Message: 'Please Enter ContactNo!', data: null }); }
        else if (!req.body.AppointmentDate) { return res.json({ status: 0, Message: 'Please Enter Appointment Date!', data: null }); }
        else if (!req.body.Time) { return res.json({ status: 0, Message: 'Please Enter Time!', data: null }); }
        else {
            var isoDateString = new Date(req.body.AppointmentDate).toISOString();
            await new AppointmentModel({
                UserID: req.body.UserID,
                HospitalID: req.body.HospitalID,
                ContactNo: req.body.ContactNo,
                Email: (req.body.Email) ? (req.body.Email) : '',
                Description: (req.body.Description) ? (req.body.Description) : '',
                //AppointmentDate: new Date(req.body.AppointmentDate),
                AppointmentDate: isoDateString,
                Time: req.body.Time,
                Date: moment().format("YYYY-MM-DDTHH:mm:ss")
            }).save();
            return res.status(200).json({ status: 1, Message: "Appointment Detail Added Successfully.", data: null });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AppointmentGet = [async (req, res) => {
    try {
        // const getPagination = (page, size) => {
        //     const limit = size ? +size : 10; const offset = page ? page * limit : 0;
        //     return { limit, offset };
        // };
        // const { page, size, ContactNo } = req.query;
        // const { limit, offset } = getPagination(page, size);
        // let obj = {};
        // obj['ContactNo'] = ContactNo ? { $regex: new RegExp(ContactNo), $options: "i" } : { $ne: null };
        // obj['IsActive'] = true;
        // obj['IsDeleted'] = false;
        // let Total = await AppointmentModel.countDocuments(obj).exec();
        // let UserData = await AppointmentModel.find(obj).populate({ path: 'UserID', select: 'Name MobileNo UserCode' })
        //     .populate({ path: 'AppointmentUserDetail', select: 'Name MobileNo UserCode' })
        //     .populate({ path: 'AppointmentHospitalDetail', select: 'Name MobileNo' })
        //     .skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        // let round = Math.ceil(Total / size);
        // if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: UserData, count: Total }); }
        // else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, HospitalName, ContactNo } = req.query;
        const { limit, offset } = getPagination(page, size);
        let obj = {}, obj1 = {}, obj2 = {};
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj2['Name'] = HospitalName ? { $regex: new RegExp(HospitalName), $options: "i" } : { $ne: null };
        obj1['ContactNo'] = ContactNo ? { $regex: new RegExp(ContactNo), $options: "i" } : { $ne: null };
        obj1['IsActive'] = true;
        obj1['IsDeleted'] = false;
        await AppointmentModel.aggregate([
            { $lookup: { from: 'User', localField: 'UserID', foreignField: '_id', as: 'user_docs' } },
            { $lookup: { from: 'Hospital', localField: 'HospitalID', foreignField: '_id', as: 'hospital_docs' } },
            { $match: obj1 }, { $match: { user_docs: { $elemMatch: obj }, hospital_docs: { $elemMatch: obj2 } } }
        ]).exec(async (err, ObjData) => {
            if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
            else {
                if (ObjData.length > 0) {
                    await AppointmentModel.aggregate([
                        { $lookup: { from: 'User', localField: 'UserID', foreignField: '_id', as: 'user_docs' } },
                        { $lookup: { from: 'Hospital', localField: 'HospitalID', foreignField: '_id', as: 'hospital_docs' } },
                        { $sort: { _id: -1 } },
                        { $match: obj1 },
                        { $match: { user_docs: { $elemMatch: obj }, hospital_docs: { $elemMatch: obj2 } } },
                        { $skip: offset }, { $limit: limit }
                    ]).exec(function (err, results) {
                        if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
                        else {
                            if (results.length > 0) {
                                let Total = ObjData.length;
                                let round = Math.ceil(Total / size);
                                return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: results, count: Total });
                            } else { return res.status(200).json({ status: 0, Message: 'Data Not Found!', data: null }); }
                        }
                    });
                } else { return res.status(200).json({ status: 0, Message: 'Data Not Found!', data: null }); }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AppointmentBYID = [async (req, res) => {
    try {
        if (!req.params.ID) {
            return res.send({ status: 0, Message: "Please Enter Your ID!", data: null });
        }
        else if (req.params.ID === ":ID") {
            return res.send({ status: 0, Message: "Please Enter Your ID!", data: null });
        }
        else {
            let AppointmentData = await AppointmentModel.findOne({ _id: req.params.ID, IsActive: true, IsDeleted: false }).
                populate({ path: 'AppointmentUserDetail', select: 'Name MobileNo UserCode' }).sort({ _id: -1 }).
                populate({ path: 'AppointmentHospitalDetail', select: 'Name MobileNo' }).exec();
            if (AppointmentData) {
                return res.status(200).json({ status: 1, Message: "Success.", data: AppointmentData });
            }
            else {
                return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AppointmentUpdate = [async (req, res) => {
    try {
        if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else if (!req.body.HospitalID) { return res.json({ status: 0, Message: 'Please Enter HospitalID!', data: null }); }
        else if (!req.body.ContactNo) { return res.json({ status: 0, Message: 'Please Enter ContactNo!', data: null }); }
        else if (!req.body.AppointmentDate) { return res.json({ status: 0, Message: 'Please Enter Appointment Date!', data: null }); }
        else if (!req.body.Time) { return res.json({ status: 0, Message: 'Please Enter Time!', data: null }); }
        else {
            var UpdateAppointmentData = {};
            UpdateAppointmentData["UserID"] = req.body.UserID;
            UpdateAppointmentData["HospitalID"] = req.body.HospitalID;
            UpdateAppointmentData["ContactNo"] = req.body.ContactNo;
            UpdateAppointmentData["Email"] = req.body.Email;
            UpdateAppointmentData["Description"] = req.body.Description;
            UpdateAppointmentData["AppointmentDate"] = req.body.AppointmentDate;
            UpdateAppointmentData["Time"] = req.body.Time;
            UpdateAppointmentData["ModifiedDate"] = new Date();
            await AppointmentModel.updateOne({ _id: req.body.CID }, UpdateAppointmentData).exec();
            return res.status(200).json({ status: 1, Message: "Appointment Detail Updated Successfully.", data: null });
        }
    } catch (err) {
        save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.AppointmentDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        else if (req.params.ID === ":ID") {
            return res.send({ status: 0, Message: "Please Enter Your ID!", data: null });
        } else {
            await AppointmentModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, ModifiedDate: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "Appointment Detail Deleted Successfully.", data: null })
        }
    } catch (err) {
        save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

exports.DateWiseInsurance2 = [async (req, res) => {
    try {
        const getDateRange = (start, end) => {
            const arr = [];
            for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
                arr.push(new Date(dt));
            }
            return arr;
        };
        const subtractDays = (date, days) => {
            return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        }
        // console.log("===getDateRange===",getDateRange);
        // console.log("===subtractDays===",subtractDays);

        const end = new Date();
        const start = subtractDays(end, 10);
        const range = getDateRange(start, end);

        // console.log("===end===",end);
        // console.log("===start==",start);

        let Insdata = await HealthInsuranceModel.find({ IsActive: true, IsDeleted: false, CreatedDate: { '$lte': start, '$gte': end } })
            .populate({ path: 'UserID', select: 'Name MobileNo' })
            .populate({ path: 'PolicyTypeID', select: 'Type' })
            .sort({ '_id': -1 }).exec();
        console.log("INSDATA", Insdata)
        if (Insdata) {
            return res.status(200).json({ status: 1, Message: "Success.", data: Insdata });
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
        }
    } catch (err) {
        console.log(err);
        save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DateWiseInsurance1 = [async (req, res) => {
    try {
        var data = await HealthInsuranceModel.aggregate([
            {
                $match: {
                    $expr: {
                        $gt: [
                            "$date",
                            { $dateSubtract: { startDate: "$$NOW", unit: "day", amount: 5 } }
                        ]
                    }
                }
            }
        ]).exec();
        console.log("===data===", data);
        // let Insdata = await HealthInsuranceModel.find({ IsActive: true, IsDeleted: false})
        // .populate({ path: 'UserID', select: 'Name' })
        // .populate({ path: 'PolicyTypeID', select: 'Type' })
        // .sort({ '_id': -1 }).exec();
        // console.log("INSDATA", Insdata)
        // if (Insdata) {
        //     return res.status(200).json({ status: 1, Message: "Success.", data: Insdata });
        // } else {
        //     return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
        // }
    } catch (err) {
        save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DateWiseInsurance11 = [async (req, res) => {
    try {
        const getDateRange = (start, end) => {
            const arr = [];
            for (let dt = new Date(start);
                dt <= end;
                dt.setDate(dt.getDate() + 1)
            ) {
                arr.push(new Date(dt));
            }
            return arr;
        };
        // const subtractDays = (date, days) => {
        //     return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        // }
        // console.log("===getDateRange===",getDateRange);
        // console.log("===subtractDays===",subtractDays);

        // const end = new Date();
        // const start = subtractDays(end, 10);
        // const range = getDateRange(start, end);

        // console.log("===end===",end);
        // console.log("===start==",start);

        // createdAt: {
        //     $gte: moment().add(-10, "days"),
        // }
        let Insdata = await HealthInsuranceModel.find({
            IsActive: true, IsDeleted: false,
            "StartDate": { "$lt": new Date().getTime() - 1000 * 86400 * 2 }
        })
            .populate({ path: 'UserID', select: 'Name MobileNo' })
            .populate({ path: 'PolicyTypeID', select: 'Type' })
            .sort({ '_id': -1 }).exec();
        console.log("INSDATA", Insdata)
        if (Insdata) {
            return res.status(200).json({ status: 1, Message: "Success.", data: Insdata });
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
        }
    } catch (err) {
        console.log(err);
        save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DateWiseInsuranceDone = [async (req, res) => {
    try {

        // let today = new Date().toISOString().slice(0, 10)

        // const startDate = '19-08-2022';
        // const endDate = today;

        // const diffInMs = new Date(endDate) - new Date(startDate)
        // const diffInDays = diffInMs / (1000 * 60 * 60 * 24);


        //  alert(diffInDays);
        // console.log("===ABC===", diffInMs);
        // console.log("===xyz===", diffInDays);

        // const end = moment().startOf('day').format("YYYY-MM-DDTHH:mm:ss");
        // const start = moment().startOf('day').subtract(15, 'day').format("YYYY-MM-DDTHH:mm:ss");


        // const dateDiffInMs = 1 * 24 * 60 * 60000

        // var diff = Math.floor((start - end) / 24 * 60 * 60 * 1000);

        const end = moment().startOf('day').toDate();
        const start = moment().startOf('day').subtract(15, 'day').toDate();

        // const diffInMs = new Date(end) - new Date(start)
        // const diffInDays = moment(end).diff(moment(start), 'days');

        // var oneDay = 24 * 60 * 60 * 1000;
        // var date1InMillis = end.getTime();
        // var date2InMillis = start.getTime();
        // var days = Math.round(Math.abs(date2InMillis - date1InMillis) / oneDay);

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // console.log("=====days===", days);
        console.log("=====diffTime===", diffTime);
        console.log("=====diffDays===", diffDays);
        console.log("===end==", end);
        console.log("==start===", start);
        // console.log("===diffInMs===", diffInMs);
        // console.log("===diff==", diffInDays1);
        // console.log("===diffInDays==", diffInDays);



        let Insdata = await HealthInsuranceModel.find({
            IsActive: true, IsDeleted: false,
            CreatedDate: { "$gte": start, "$lte": end }
            // StartDate: { "$gte": start, "$lte": end }
            // "StartDate": { "$gte": new Date().getTime() - 1000 * 86400 * 2 }
        }).populate({ path: 'UserID', select: 'Name MobileNo' })
            .populate({ path: 'PolicyTypeID', select: 'Type' })
            .sort({ '_id': -1 }).exec();
        console.log("INSDATA", Insdata);
        let Total = await HealthInsuranceModel.countDocuments(Insdata).exec();


        // console.log("====diff===", diff);
        console.log("===total==", Total);

        //     HealthInsuranceModel.countDocuments({name: 'anand'}, function(err, c) {
        //         console.log('Count is ' + c);
        //    });
        if (Insdata) {
            return res.status(200).json({ status: 1, Message: "Success.", data: Insdata, days: diffDays });
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
        }
    } catch (err) {
        console.log(err);
        save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DateWiseInsurance = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, PoliceName, PolicyNumber, PolicyProvider, InsuranceAmount, PlanTypeID } = req.query;
        const { limit, offset } = getPagination(page, size);
        let obj = {}, obj1 = {};
        obj1['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj1['PlanTypeID'] = PlanTypeID ? mongoose.Types.ObjectId(PlanTypeID) : { $ne: null };
        obj1['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj1['PoliceName'] = PoliceName ? { $regex: new RegExp(PoliceName), $options: "i" } : { $ne: null };
        obj1['PolicyNumber'] = PolicyNumber ? { $regex: new RegExp(PolicyNumber), $options: "i" } : { $ne: null };
        obj1['PolicyProvider'] = PolicyProvider ? { $regex: new RegExp(PolicyProvider), $options: "i" } : { $ne: null };
        obj1['InsuranceAmount'] = InsuranceAmount ? { $regex: new RegExp(InsuranceAmount), $options: "i" } : { $ne: null };
        obj1['IsActive'] = true;
        obj1['IsDeleted'] = false;
        console.log("==obj===", obj1)

        await HealthInsuranceModel.aggregate([
            {
                "$project": {
                    "_id": "_id",
                    "HealthInsurance": "$$ROOT"

                }
            },
            {
                $lookup:
                {
                    localField: 'HealthInsurance.UserID',
                    from: 'User',
                    foreignField: '_id',
                    as: 'user_docs'
                }
            },
            {
                "$unwind": {
                    "path": "$user_docs",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $lookup:
                {
                    localField: 'HealthInsurance.PolicyTypeID',
                    from: 'policytypes',
                    foreignField: '_id',
                    as: 'policy_docs'
                }
            },
            {
                "$addFields": {
                    "timestamp": {
                        "$subtract": ["$HealthInsurance.EndDate", "$$NOW"]
                    }
                }
            },
            {
                "$addFields": {
                    "daysSpent": {
                        "$trunc": {
                            "$ceil": {
                                "$abs": {
                                    "$sum": { "$divide": ["$timestamp", 60 * 1000 * 60 * 24] }
                                }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    $expr: {
                        $lte: [
                            "$daysSpent", 15
                        ]
                    }

                }
            },
            {

                $project: {
                    _id: "$HealthInsurance._id",
                    PoliceName: "$HealthInsurance.PoliceName",
                    PolicyNumber: "$HealthInsurance.PolicyNumber",
                    CustomerName: "$HealthInsurance.CustomerName",
                    CustomerMobileNo: "$HealthInsurance.CustomerMobileNo",
                    StartDate: "$HealthInsurance.StartDate",
                    EndDate: "$HealthInsurance.EndDate",
                    UserID: "$HealthInsurance.UserID",
                    UserName: "$user_docs.Name",
                    UserMobileNo: "$user_docs.MobileNo",
                    PolicyTypeID: "$HealthInsurance.PolicyTypeID",
                    InsuranceAmount: "$HealthInsurance.InsuranceAmount",
                    IsUpdated: "$HealthInsurance.IsUpdated",
                    Date: "$HealthInsurance.Date",

                    days: { $toInt: { $cond: { if: { $eq: ["$daysSpent", 0] }, then: 1, else: "$daysSpent" } } },
                }

            }
        ]).exec(async (err, ObjData) => {
            if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
            else {
                if (ObjData.length > 0) {
                    let Total = ObjData.length;
                    let round = Math.ceil(Total / size);
                    return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: ObjData, count: Total });
                }
            }
        });
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DateWiseInsuranceComplete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else {
            var UpdateData = {};
            UpdateData["IsUpdated"] = "true";
            UpdateData["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss");
            UpdateData["ModifiedDate"] = new Date();
            await HealthInsuranceModel.updateOne({ _id: req.params.ID }, UpdateData).exec();
            return res.status(200).json({ status: 1, Message: "Status Change Confirm.", data: UpdateData });
        }
    } catch (err) {
        console.log(err);
        save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, Date: moment().format("YYYY-MM-DDTHH:mm:ss"), RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}
function calcCrow(lat1, lon1, lat2, lon2, callback) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    callback(d);
    //return d;
}
// Converts numeric degrees to radians
function toRad(Value) { return Value * Math.PI / 180; }
//
// exports.HospitalList = [async (req, res) => {
//     try {
//         const getPagination = (page, size) => {
//             const limit = size ? +size : 10;
//             const offset = page ? page * limit : 0;
//             return { limit, offset };
//         };
//         const { page, size } = req.query;
//         const { limit, offset } = getPagination(page, size);
//         let Total = await UserModel.countDocuments({ UserType: { $nin: ['Main User'] }, PlanStatus: 'Pending', RegistrationStatus: 'Pending', TotalReferralCount: 0, IsActive: true, IsDeleted: false }).exec();
//         let HospitalData = await UserModel.find({ UserType: { $nin: ['Main User'] }, PlanStatus: 'Pending', RegistrationStatus: 'Pending', TotalReferralCount: 0, IsActive: true, IsDeleted: false })
//             .skip(offset).limit(limit).sort({ '_id': -1 }).exec();
//         let totalPages = (Total / size);
//         let round = Math.floor(totalPages);
//         if (HospitalData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, tutorials: HospitalData, count: Total }); }
//         else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
//     } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null, count: null }); }
// }];