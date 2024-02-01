const moment = require('moment-timezone');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
var multer = require("multer");
const DIR = "./public/uploads";
const UserModel = require("../models/UserModel");
const AuthTokenModel = require("../models/AuthTokenModel");
const UserPlanDetailModel = require("../models/UserPlanDetailModel");
const PaidAmountModel = require("../models/PaidAmountModel");
const UserWalletModel = require("../models/UserWalletModel");
const UserWalletDetailModel = require("../models/UserWalletDetailModel");
const MinMemberModel = require("../models/MinMemberModel");
const RegistrationChargeModel = require("../models/RegistrationChargeModel");
//const HealthInsuranceModel = require("../models/HealthInsuranceModel");
const UserWithdrawalRequestModel = require("../models/UserWithdrawalRequestModel");
const PlanTypeModel = require("../models/PlanTypeModel");
const ErrorLogsModel = require("../models/ErrorLogsModel");
var FCM = require('fcm-node');
var serverKey = 'AAAANYAfOuI:APA91bHl1nxserMdSJ8yS_9VsJ5kMonUPTf859F8KUInOMgG5fODUaJ-f1iuJM0FqyyAfuaAjxb5-_hKYqWhg-vCq2Cuo7rO69a6IK25WHJqumI0hsWl2Jfj5HqXdJKVUcPKpZStgDFm'; //put your server key here
var fcm = new FCM(serverKey);
var SenderID = '229782797026';
const ImageError = "Only .png, .jpg and .jpeg format allowed!";
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, DIR); },
    filename: function (req, file, cb) { const fileName = file.originalname.toLowerCase().split(" ").join("-"); cb(null, uuidv4() + "-" + fileName); }
});
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) { req.fileValidationError = "Only image files are allowed!"; return cb(new Error(ImageError), false); }
    cb(null, true);
};
exports.UserLogin1 = [async (req, res) => {
    try {
        if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your Mobile No!', data: null }); }
        else if (!req.body.Password) { return res.json({ status: 0, Message: 'Please Enter Your Password!', data: null }); }
        else {
            let UserData = await UserModel.findOne({ MobileNo: req.body.MobileNo, IsDeleted: false }).exec();
            if (UserData) {
                var bytes = CryptoJS.AES.decrypt(UserData.Password, 'SFVSFB@%#$%^5454@Q$%$@#').toString(CryptoJS.enc.Utf8);
                if (bytes === req.body.Password) {
                    if (UserData.RegistrationStatus !== "Success") {
                        return res.json({ status: 0, Message: 'Your plan is not activated,Please active then try to login!', data: null });
                    } else if (UserData.IsActive !== true) {
                        return res.json({ status: 0, Message: 'Your account is disabled,Please contact to admin department!', data: null });
                    } else {
                        let Usertoken = await AuthTokenModel.findOne({ UserID: UserData._id }).exec();
                        if (Usertoken) {
                            await AuthTokenModel.updateOne({ _id: Usertoken._id }, { DeviceToken: (req.body.DeviceID) ? (req.body.DeviceID) : '' }).exec();
                            return res.status(200).json({ status: 1, Message: "Success.", data: UserData, token: Usertoken.Token });
                        } else {
                            let userData = { _id: UserData._id, Date: moment(new Date()).format('DD-MM-YYYYTHH:mm:ss') };
                            const jwtPayload = userData;//Prepare JWT token for authentication
                            const jwtData = { expiresIn: process.env.JWT_TIMEOUT_DURATION };
                            const secret = process.env.JWT_SECRET;
                            const token = jwt.sign(jwtPayload, secret, jwtData);//Generated JWT token with Payload and secret.
                            await AuthTokenModel.create({
                                Token: token,
                                DeviceToken: (req.body.DeviceID) ? (req.body.DeviceID) : '',
                                UserID: UserData._id,
                                DeviceType: "",
                                Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                            });
                            return res.status(200).json({ status: 1, Message: "Success.", data: UserData, token: token });
                        }
                    }
                } else { return res.status(200).json({ status: 0, Message: "Please Enter Correct Password!", data: null }); }
            } else { return res.status(200).json({ status: 0, Message: "Please Enter Correct UserName!", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];

exports.UserLogin = [async (req, res) => {
    try {
        if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your Mobile No!', data: null }); }
        else if (!req.body.Password) { return res.json({ status: 0, Message: 'Please Enter Your Password!', data: null }); }
        else {
            var UserData = await UserModel.findOne({ MobileNo: req.body.MobileNo, IsDeleted: false }).exec();

            console.log("===Userdata==", UserData)
            //Step 1: Check UserData is Null or Undefind
            //Step 2 : Userdata.Name -> .Name availble or not in json data. if available add to push data
            // var data = []
            //Step 3 : send Respoonse
            //    var a;
            //    if(a= null ? a=undefind : '')

            // if (UserData == null || UserData == undefined || UserData.PlanTypeID == undefined) {
            //     return res.json({ status: 0, Message: 'Data Not Found', data: null });
            // }

            if (UserData) {

                var bytes = CryptoJS.AES.decrypt(UserData.Password, 'SFVSFB@%#$%^5454@Q$%$@#').toString(CryptoJS.enc.Utf8);
                if (bytes === req.body.Password) {
                    if (UserData.RegistrationStatus !== "Success") {
                        return res.json({ status: 0, Message: 'Your plan is not activated,Please active then try to login!', data: null });
                    } else if (UserData.IsActive !== true) {
                        return res.json({ status: 0, Message: 'Your account is disabled,Please contact to admin department!', data: null });
                    } else {
                        let Usertoken = await AuthTokenModel.findOne({ UserID: UserData._id }).exec();
                        if (Usertoken) {
                            var userdetail = await UserModel.findOne({ _id: UserData._id, IsDeleted: false })
                                .populate({ path: 'PlanTypeID', select: 'Type' }).exec();
                            console.log("====676776===", userdetail);

                            var AllData = [];
                            if (userdetail) {
                                AllData.push({
                                    Name: userdetail.Name,
                                    IsActive: userdetail.IsActive,
                                    IsDeleted: userdetail.IsDeleted,
                                    PlanType: userdetail.PlanTypeID.Type,
                                    // PlanType: userdetail.PlanTypeID.Type + '|' + userdetail.PlanTypeID._id,
                                    TotalReferralCount: userdetail.TotalReferralCount,
                                    IsGreen: userdetail.IsGreen,
                                    // IsActive: userdetail.IsActive,
                                    IsDeleted: userdetail.IsDeleted,
                                    IsBusiness: userdetail.IsBusiness,
                                    IsHomeInst: userdetail.IsHomeInst,
                                    _id: userdetail._id,
                                    Name: userdetail.Name,
                                    MobileNo: userdetail.MobileNo,
                                    Password: userdetail.Password,
                                    CodeBook: userdetail.CodeBook,
                                    Email: userdetail.Email,
                                    Address: userdetail.Address,
                                    IDProof: userdetail.IDProof,
                                    UserCode: userdetail.UserCode,
                                    ReferralCode: userdetail.ReferralCode,
                                    StartDate: userdetail.StartDate,
                                    EndDate: userdetail.EndDate,
                                    Photo: userdetail.Photo,
                                    PlanStatus: userdetail.PlanStatus,
                                    RegistrationStatus: userdetail.RegistrationStatus,
                                    RegistrationAmount: userdetail.RegistrationAmount,
                                    MinimumMember: userdetail.MinimumMember,
                                    UserType: userdetail.UserType,
                                    Date: userdetail.Date,
                                    CreatedDate: userdetail.CreatedDate,
                                    ModifiedDate: userdetail.ModifiedDate
                                });
                            }

                            await AuthTokenModel.updateOne({ _id: Usertoken._id }, { DeviceToken: (req.body.DeviceID) ? (req.body.DeviceID) : '' }).exec();
                            return res.status(200).json({ status: 1, Message: "Success.", data: AllData, token: Usertoken.Token });
                        } else {
                            let userData = { _id: UserData._id, Date: moment(new Date()).format('DD-MM-YYYYTHH:mm:ss') };
                            const jwtPayload = userData;//Prepare JWT token for authentication
                            const jwtData = { expiresIn: process.env.JWT_TIMEOUT_DURATION };
                            const secret = process.env.JWT_SECRET;
                            const token = jwt.sign(jwtPayload, secret, jwtData);//Generated JWT token with Payload and secret.
                            await AuthTokenModel.create({
                                Token: token,
                                DeviceToken: (req.body.DeviceID) ? (req.body.DeviceID) : '',
                                UserID: UserData._id,
                                DeviceType: "",
                                Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                            });

                            var userdetail = await UserModel.findOne({ _id: UserData._id, IsDeleted: false })
                                .populate({ path: 'PlanTypeID', select: 'Type' }).exec();
                            console.log("====676776===", userdetail);

                            var AllData = [];
                            if (userdetail) {
                                AllData.push({

                                    Name: userdetail.Name ? userdetail.Name : "",
                                    IsActive: userdetail.IsActive ? userdetail.IsActive : "",
                                    IsDeleted: userdetail.IsDeleted ? userdetail.IsDeleted : "",
                                    PlanType: userdetail.PlanTypeID.Type ? userdetail.PlanTypeID.Type : "",
                                    // PlanType: userdetail.PlanTypeID.Type + '|' + userdetail.PlanTypeID._id,
                                    TotalReferralCount: userdetail.TotalReferralCount ? userdetail.TotalReferralCount : "",
                                    IsGreen: userdetail.IsGreen ? userdetail.IsGreen : "",
                                    // IsActive: userdetail.IsActive,
                                    IsDeleted: userdetail.IsDeleted ? userdetail.IsDeleted : "",
                                    IsBusiness: userdetail.IsBusiness ? userdetail.IsBusiness : "",
                                    IsHomeInst: userdetail.IsHomeInst ? userdetail.IsHomeInst : "",
                                    _id: userdetail._id,
                                    Name: userdetail.Name ? userdetail.Name : "",
                                    MobileNo: userdetail.MobileNo ? userdetail.MobileNo : "",
                                    Password: userdetail.Password ? userdetail.Password : "",
                                    CodeBook: userdetail.CodeBook ? userdetail.CodeBook : "",
                                    Email: userdetail.Email ? userdetail.Email : "",
                                    Address: userdetail.Address ? userdetail.Address : "",
                                    IDProof: userdetail.IDProof ? userdetail.IDProof : "",
                                    UserCode: userdetail.UserCode ? userdetail.UserCode : "",
                                    ReferralCode: userdetail.ReferralCode ? userdetail.ReferralCode : "",
                                    StartDate: userdetail.StartDate ? userdetail.StartDate : "",
                                    EndDate: userdetail.EndDate ? userdetail.EndDate : "",
                                    Photo: userdetail.Photo ? userdetail.Photo : "",
                                    PlanStatus: userdetail.PlanStatus ? userdetail.PlanStatus : "",
                                    RegistrationStatus: userdetail.RegistrationStatus ? userdetail.RegistrationStatus : "",
                                    RegistrationAmount: userdetail.RegistrationAmount ? userdetail.RegistrationAmount : "",
                                    MinimumMember: userdetail.MinimumMember ? userdetail.MinimumMember : "",
                                    UserType: userdetail.UserType ? userdetail.UserType : "",
                                    Date: userdetail.Date ? userdetail.Date : "",
                                    CreatedDate: userdetail.CreatedDate ? userdetail.CreatedDate : "",
                                    ModifiedDate: userdetail.ModifiedDate ? userdetail.ModifiedDate : ""
                                });
                            }

                            return res.status(200).json({ status: 1, Message: "Success.", data: AllData, token: token });
                        }
                    }
                } else { return res.status(200).json({ status: 0, Message: "Please Enter Correct Password!", data: null }); }
            } else { return res.status(200).json({ status: 0, Message: "Please Enter Correct MobileNo!", data: null }); }
        }
    } catch (err) {
        console.log(err);
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

exports.UserAdd1 = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.Name) { return res.json({ status: 0, Message: 'Please Enter Your Name!', data: null }); }
                else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your Mobile No!', data: null }); }
                else if (!req.body.Password) { return res.json({ status: 0, Message: 'Please Enter Your Password!', data: null }); }
                else {
                    let CheckMobileNoExists = await UserModel.findOne({ MobileNo: req.body.MobileNo, IsActive: true }).sort({ _id: -1 }).exec();
                    if (CheckMobileNoExists) { return res.json({ status: 0, Message: 'Mobile No Already Exist!', data: null }); }
                    else {
                        let Total = await UserModel.countDocuments({}).exec();
                        var MinimumMember = "", RegistrationAmount = "";
                        var UserCode = "AJAY" + (Number(Total) + 1) + req.body.MobileNo.slice(-3);
                        let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                        (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = "10";
                        let RegistrationChargeData = await RegistrationChargeModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                        (RegistrationChargeData) ? (RegistrationAmount = RegistrationChargeData.Amount) : RegistrationAmount = "0";
                        var StartDate = moment();
                        var EndDate = moment().add(1, 'years');
                        var ciphertext = CryptoJS.AES.encrypt(req.body.Password, "SFVSFB@%#$%^5454@Q$%$@#").toString();
                        if (req.body.ReferralCode) {
                            let CheckUserData = await UserModel.findOne({ UserCode: req.body.ReferralCode, IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                            if (CheckUserData) {
                                let User = await new UserModel({
                                    Name: req.body.Name, MobileNo: req.body.MobileNo, Password: ciphertext, CodeBook: req.body.Password,
                                    Email: (req.body.Email) ? (req.body.Email) : '', Address: req.body.Address, IDProof: req.body.IDProof, UserCode: UserCode,
                                    ReferralCode: req.body.ReferralCode, StartDate: StartDate, EndDate: EndDate,
                                    Photo: (req.file) ? (req.file.filename) : '',
                                    PlanStatus: "Pending", RegistrationStatus: "Pending", TotalReferralCount: 0,
                                    RegistrationAmount: RegistrationAmount, MinimumMember: MinimumMember,
                                    UserType: "Sub User", Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                await new UserPlanDetailModel({
                                    UserID: User._id, StartDate: StartDate, TotalReferralCount: "",
                                    EndDate: EndDate, Year: moment().format('YYYY'),
                                    PlanStatus: "Working", MinimumMember: MinimumMember, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                return res.status(200).json({ status: 1, Message: "User Detail Added Successfully.", data: User });
                            } else { return res.status(200).json({ status: 0, Message: "Invalid Referral Code.", data: null }); }
                        } else {
                            let User1 = await new UserModel({
                                Name: req.body.Name, MobileNo: req.body.MobileNo, Password: ciphertext, CodeBook: req.body.Password,
                                Email: (req.body.Email) ? (req.body.Email) : '', Address: req.body.Address, IDProof: req.body.IDProof, UserCode: UserCode,
                                ReferralCode: "", StartDate: StartDate, EndDate: EndDate, Photo: (req.file) ? (req.file.filename) : '',
                                PlanStatus: "Pending", RegistrationStatus: "Pending", TotalReferralCount: 0,
                                RegistrationAmount: RegistrationAmount, MinimumMember: MinimumMember,
                                UserType: "Sub User", Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                            }).save();
                            await new UserPlanDetailModel({
                                UserID: User1._id, StartDate: StartDate, TotalReferralCount: "",
                                EndDate: EndDate, Year: moment().format('YYYY'),
                                PlanStatus: "Working", MinimumMember: MinimumMember, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                            }).save();
                            return res.status(200).json({ status: 1, Message: "User Detail Added Successfully.", data: User1 });
                        }
                    }
                }
            }
        });
    } catch (err) { console.log("<--IS-Error-->", err); save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.Name) { return res.json({ status: 0, Message: 'Please Enter Your Name!', data: null }); }
                else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your Mobile No!', data: null }); }
                else if (!req.body.Password) { return res.json({ status: 0, Message: 'Please Enter Your Password!', data: null }); }
                else {
                    let CheckMobileNoExists = await UserModel.findOne({ MobileNo: req.body.MobileNo, IsActive: true }).sort({ _id: -1 }).exec();
                    if (CheckMobileNoExists) { return res.json({ status: 0, Message: 'Mobile No Already Exist!', data: null }); }
                    else {
                        if (req.body.PlanTypeID == "62e8b3ee9d181220e4d7a81f") {
                            let Total = await UserModel.countDocuments({}).exec();
                            var MinimumMember = "", RegistrationAmount = "";
                            var UserCode = "AJAY" + (Number(Total) + 1) + req.body.MobileNo.slice(-3);
                            console.log("---usercode---", UserCode);
                            let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                            (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = "10";
                            let RegistrationChargeData = await RegistrationChargeModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                            (RegistrationChargeData) ? (RegistrationAmount = RegistrationChargeData.Amount) : RegistrationAmount = "0";
                            var StartDate = moment();
                            var EndDate = moment().add(1, 'years');
                            var ciphertext = CryptoJS.AES.encrypt(req.body.Password, "SFVSFB@%#$%^5454@Q$%$@#").toString();
                            if (req.body.ReferralCode) {
                                let CheckUserData = await UserModel.findOne({ UserCode: req.body.ReferralCode, IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                                if (CheckUserData) {
                                    let User = await new UserModel({
                                        Name: req.body.Name, MobileNo: req.body.MobileNo, Password: ciphertext, CodeBook: req.body.Password,
                                        Email: (req.body.Email) ? (req.body.Email) : '', Address: req.body.Address, IDProof: req.body.IDProof, UserCode: UserCode,
                                        ReferralCode: req.body.ReferralCode, StartDate: StartDate, EndDate: EndDate,
                                        Photo: (req.file) ? (req.file.filename) : '',
                                        PlanStatus: "Pending", RegistrationStatus: "Pending", TotalReferralCount: 0,
                                        RegistrationAmount: RegistrationAmount, MinimumMember: MinimumMember,
                                        UserType: "Sub User", PlanTypeID: req.body.PlanTypeID, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                    }).save();
                                    await new UserPlanDetailModel({
                                        UserID: User._id, StartDate: StartDate, TotalReferralCount: "",
                                        EndDate: EndDate, Year: moment().format('YYYY'),
                                        PlanStatus: "Working", MinimumMember: MinimumMember, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                    }).save();
                                    return res.status(200).json({ status: 1, Message: "User Detail Added Successfully.", data: User });
                                } else { return res.status(200).json({ status: 0, Message: "Invalid Referral Code.", data: null }); }
                            } else {
                                let User1 = await new UserModel({
                                    Name: req.body.Name, MobileNo: req.body.MobileNo, Password: ciphertext, CodeBook: req.body.Password,
                                    Email: (req.body.Email) ? (req.body.Email) : '', Address: req.body.Address, IDProof: req.body.IDProof, UserCode: UserCode,
                                    ReferralCode: "", StartDate: StartDate, EndDate: EndDate, Photo: (req.file) ? (req.file.filename) : '',
                                    PlanStatus: "Pending", RegistrationStatus: "Pending", TotalReferralCount: 0,
                                    RegistrationAmount: RegistrationAmount, MinimumMember: MinimumMember,
                                    UserType: "Sub User", PlanTypeID: req.body.PlanTypeID, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                await new UserPlanDetailModel({
                                    UserID: User1._id, StartDate: StartDate, TotalReferralCount: "",
                                    EndDate: EndDate, Year: moment().format('YYYY'),
                                    PlanStatus: "Working", MinimumMember: MinimumMember, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                return res.status(200).json({ status: 1, Message: "User Detail Added Successfully.", data: User1 });
                            }
                        } else {
                            let Total = await UserModel.countDocuments({}).exec();
                            var MinimumMember = "", RegistrationAmount = "";
                            var UserCode = "AJAY" + (Number(Total) + 1) + req.body.MobileNo.slice(-3);
                            console.log("---usercode---", UserCode);
                            let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                            (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = "10";
                            let RegistrationChargeData = await RegistrationChargeModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                            (RegistrationChargeData) ? (RegistrationAmount = RegistrationChargeData.Amount) : RegistrationAmount = "0";
                            var StartDate = moment();
                            var EndDate = moment().add(1, 'years');
                            var ciphertext = CryptoJS.AES.encrypt(req.body.Password, "SFVSFB@%#$%^5454@Q$%$@#").toString();
                            if (req.body.ReferralCode) {
                                let CheckUserData = await UserModel.findOne({ UserCode: req.body.ReferralCode, IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                                if (CheckUserData) {
                                    let User = await new UserModel({
                                        Name: req.body.Name, MobileNo: req.body.MobileNo, Password: ciphertext, CodeBook: req.body.Password,
                                        Email: (req.body.Email) ? (req.body.Email) : '', Address: req.body.Address, IDProof: req.body.IDProof, UserCode: UserCode,
                                        ReferralCode: req.body.ReferralCode, StartDate: StartDate, EndDate: EndDate,
                                        Photo: (req.file) ? (req.file.filename) : '',
                                        PlanStatus: "Pending", RegistrationStatus: "Success", TotalReferralCount: 0,
                                        RegistrationAmount: RegistrationAmount, MinimumMember: MinimumMember,
                                        UserType: "Sub User", PlanTypeID: req.body.PlanTypeID, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                    }).save();
                                    await new UserPlanDetailModel({
                                        UserID: User._id, StartDate: StartDate, TotalReferralCount: "",
                                        EndDate: EndDate, Year: moment().format('YYYY'),
                                        PlanStatus: "Working", MinimumMember: MinimumMember, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                    }).save();
                                    return res.status(200).json({ status: 1, Message: "User Detail Added Successfully.", data: User });
                                } else { return res.status(200).json({ status: 0, Message: "Invalid Referral Code.", data: null }); }
                            } else {
                                let User1 = await new UserModel({
                                    Name: req.body.Name, MobileNo: req.body.MobileNo, Password: ciphertext, CodeBook: req.body.Password,
                                    Email: (req.body.Email) ? (req.body.Email) : '', Address: req.body.Address, IDProof: req.body.IDProof, UserCode: UserCode,
                                    ReferralCode: "", StartDate: StartDate, EndDate: EndDate, Photo: (req.file) ? (req.file.filename) : '',
                                    PlanStatus: "Pending", RegistrationStatus: "Success", TotalReferralCount: 0,
                                    RegistrationAmount: RegistrationAmount, MinimumMember: MinimumMember,
                                    UserType: "Sub User", PlanTypeID: req.body.PlanTypeID, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                await new UserPlanDetailModel({
                                    UserID: User1._id, StartDate: StartDate, TotalReferralCount: "",
                                    EndDate: EndDate, Year: moment().format('YYYY'),
                                    PlanStatus: "Working", MinimumMember: MinimumMember, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                return res.status(200).json({ status: 1, Message: "User Detail Added Successfully.", data: User1 });
                            }
                        }

                    }
                }
            }
        });
    } catch (err) { console.log("<--IS-Error-->", err); save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserGet = [async (req, res) => {
    try {
        let UserData = await UserModel.find({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", data: UserData }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserUnderYellowZone = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10;
            const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, UserCode } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['UserType'] = { $nin: ['Main User'] };
        obj['PlanStatus'] = 'Working';
        obj['RegistrationStatus'] = 'Success';
        obj['TotalReferralCount'] = 0;
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj['UserCode'] = UserCode ? { $regex: new RegExp(UserCode), $options: "i" } : { $ne: null };
        let Total = await UserModel.countDocuments(obj).exec();
        let HospitalData = await UserModel.find(obj)
            .skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let totalPages = (Total / size);
        let round = Math.floor(totalPages);
        if (HospitalData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, tutorials: HospitalData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserGreenPage = [async (req, res) => {
    try {
        let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
        (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = 10;
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, UserCode } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['UserType'] = { $nin: ['Main User'] };
        obj['PlanStatus'] = 'Working';
        obj['RegistrationStatus'] = 'Success';
        obj['$and'] = [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $gte: MinimumMember } }];
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj['UserCode'] = UserCode ? { $regex: new RegExp(UserCode), $options: "i" } : { $ne: null };
        let Total = await UserModel.countDocuments(obj).exec();
        let UserData = await UserModel.find(obj).populate('GetHealthInsurance', 'UserID PoliceName').skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.round(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, tutorials: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserBluePage = [async (req, res) => {
    try {
        let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
        (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = 10;
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, UserCode } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['UserType'] = { $nin: ['Main User'] };
        obj['PlanStatus'] = 'Working';
        obj['RegistrationStatus'] = 'Success';
        obj['$and'] = [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $lt: MinimumMember } }];
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj['UserCode'] = UserCode ? { $regex: new RegExp(UserCode), $options: "i" } : { $ne: null };
        let Total = await UserModel.countDocuments(obj).exec();
        let UserData = await UserModel.find(obj).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.round(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, tutorials: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserOrangePage = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, UserCode } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['UserType'] = { $nin: ['Main User'] };
        obj['PlanStatus'] = 'Pending';
        obj['PlanTypeID'] = '62e8b3f49d181220e4d7a821'
        obj['RegistrationStatus'] = 'Success';
        obj['TotalReferralCount'] = 0;
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj['UserCode'] = UserCode ? { $regex: new RegExp(UserCode), $options: "i" } : { $ne: null };
        let Total = await UserModel.countDocuments(obj).exec();
        let UserData = await UserModel.find(obj).populate('GetHealthInsurance', 'UserID PoliceName').skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.round(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, tutorials: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.AllUsersPage = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, UserCode } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['UserType'] = { $nin: ['Main User'] };
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj['UserCode'] = UserCode ? { $regex: new RegExp(UserCode), $options: "i" } : { $ne: null };
        let Total = await UserModel.countDocuments(obj).exec();
        UserModel.find(obj).populate('GetHealthInsurance', 'UserID PoliceName').skip(offset).limit(limit).sort({ '_id': -1 }).exec((error, UserData) => {
            if (error) {
                return res.status(200).json({ status: 0, Message: error.message, data: null });
            } else {
                let round = Math.ceil(Total / size);
                if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, tutorials: UserData, count: Total }); }
                else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
            }
        });
        // let UserData = await UserModel.find(obj).populate('GetHealthInsurance', 'UserID PoliceName').skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        // let round = Math.ceil(Total / size);
        // if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, tutorials: UserData, count: Total }); }
        // else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AllUsersPost = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, UserCode } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['UserType'] = { $nin: ['Main User'] };
        obj['Name'] = Name ? { $regex: new RegExp(Name) } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo) } : { $ne: null };
        obj['UserCode'] = UserCode ? { $regex: new RegExp(UserCode) } : { $ne: null };
        let UserData = await UserModel.find(obj).populate('GetHealthInsurance', 'UserID PoliceName').skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let Total = await UserModel.countDocuments(obj).exec();
        let round = Math.ceil(Total / 10);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, tutorials: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserRedPage = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, UserCode } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['UserType'] = { $nin: ['Main User'] };
        obj['PlanStatus'] = 'Pending';
        obj['RegistrationStatus'] = 'Pending';
        obj['TotalReferralCount'] = 0;
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj['UserCode'] = UserCode ? { $regex: new RegExp(UserCode), $options: "i" } : { $ne: null };
        let Total = await UserModel.countDocuments(obj).exec();
        let UserData = await UserModel.find(obj).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.round(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, tutorials: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserBYID = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let UserData = await UserModel.findOne({ _id: req.params.ID }).exec();
            if (UserData) {
                return res.status(200).json({ status: 1, Message: "Success.", data: UserData });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserGetID = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let UserData = await UserModel.findOne({ _id: req.body.UserID }).exec();
            if (UserData) {
                return res.status(200).json({ status: 1, Message: "Success.", data: UserData });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserNewUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                else if (!req.body.Name) { return res.json({ status: 0, Message: 'Please Enter Your Name!', data: null }); }
                else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your Mobile No!', data: null }); }
                else if (!req.body.Password) { return res.json({ status: 0, Message: 'Please Enter Your Password!', data: null }); }
                else {
                    var ciphertext = CryptoJS.AES.encrypt(req.body.Password, "SFVSFB@%#$%^5454@Q$%$@#").toString();
                    let CheckMobileNoExists = await UserModel.findOne({ MobileNo: req.body.MobileNo, _id: { $nin: req.body.CID }, IsActive: true }).sort({ _id: -1 }).exec();
                    if (CheckMobileNoExists) { return res.json({ status: 0, Message: 'Mobile No Already Exist!', data: null }); }
                    else {
                        var UpdateUserData = {};
                        UpdateUserData["Name"] = req.body.Name;
                        UpdateUserData["MobileNo"] = req.body.MobileNo;
                        UpdateUserData["Password"] = ciphertext;
                        UpdateUserData["CodeBook"] = req.body.Password;
                        UpdateUserData["Email"] = req.body.Email;
                        UpdateUserData["Address"] = req.body.Address;
                        UpdateUserData["IDProof"] = req.body.IDProof;
                        if (req.file) { UpdateUserData["Photo"] = req.file.filename }
                        UpdateUserData["ModifiedDate"] = new Date();
                        if (req.body.ReferralCode) {
                            let userCheck = await UserModel.findOne({ _id: req.body.CID, IsDeleted: false }).exec();
                            if (userCheck.ReferralCode) {
                                let F1 = await UserModel.findOneAndUpdate({ _id: req.body.CID }, UpdateUserData, { new: true }).populate('GetHealthInsurance', 'UserID PoliceName').exec();
                                return res.status(200).json({ status: 1, Message: "User Detail Update Successfully.", data: F1 });
                            } else if (userCheck.PlanStatus === "Pending" && userCheck.RegistrationStatus === "Pending") {
                                let ReferralData = await UserModel.findOne({ UserCode: req.body.ReferralCode, IsDeleted: false }).exec();
                                if (ReferralData) {
                                    UpdateUserData["ReferralCode"] = req.body.ReferralCode;
                                    let F2 = await UserModel.findOneAndUpdate({ _id: req.body.CID }, UpdateUserData, { new: true }).populate('GetHealthInsurance', 'UserID PoliceName').exec();
                                    return res.status(200).json({ status: 1, Message: "User Detail Update Successfully.", data: F2 });
                                } else { return res.status(200).json({ status: 0, Message: "Referral User Not Found.", data: null }); }
                            } else {
                                let F3 = await await UserModel.findOneAndUpdate({ _id: req.body.CID }, UpdateUserData, { new: true }).populate('GetHealthInsurance', 'UserID PoliceName').exec();
                                return res.status(200).json({ status: 1, Message: "User Detail Update Successfully.", data: F3 });
                            }
                        } else {
                            let F4 = await UserModel.findOneAndUpdate({ _id: req.body.CID }, UpdateUserData, { new: true }).populate('GetHealthInsurance', 'UserID PoliceName').exec();
                            return res.status(200).json({ status: 1, Message: "User Detail Update Successfully.", data: F4 });
                        }
                    }
                }
            }
        });
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserUpdate = [async (req, res) => {
    try {
        if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
        else if (!req.body.Name) { return res.json({ status: 0, Message: 'Please Enter Your Name!', data: null }); }
        else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your Mobile No!', data: null }); }
        else if (!req.body.Password) { return res.json({ status: 0, Message: 'Please Enter Your Password!', data: null }); }
        else {
            var ciphertext = CryptoJS.AES.encrypt(req.body.Password, "SFVSFB@%#$%^5454@Q$%$@#").toString();
            let CheckMobileNoExists = await UserModel.findOne({ MobileNo: req.body.MobileNo, _id: { $nin: req.body.CID }, IsActive: true }).sort({ _id: -1 }).exec();
            if (CheckMobileNoExists) { return res.json({ status: 0, Message: 'Mobile No Already Exist!', data: null }); }
            else {
                var UpdateUserData = {};
                UpdateUserData["Name"] = req.body.Name;
                UpdateUserData["MobileNo"] = req.body.MobileNo;
                UpdateUserData["Password"] = ciphertext;
                UpdateUserData["CodeBook"] = req.body.Password;
                UpdateUserData["Email"] = req.body.Email;
                UpdateUserData["Address"] = req.body.Address;
                UpdateUserData["IDProof"] = req.body.IDProof;
                UpdateUserData["ModifiedDate"] = new Date();
                if (req.body.ReferralCode) {
                    let userCheck = await UserModel.findOne({ _id: req.body.CID, IsDeleted: false }).exec();
                    if (userCheck.ReferralCode) {
                        //await UserModel.updateOne({ _id: req.body.CID }, UpdateUserData).exec();
                        let F1 = await UserModel.findOneAndUpdate({ _id: req.body.CID }, UpdateUserData, { new: true }).populate('GetHealthInsurance', 'UserID PoliceName').exec();
                        return res.status(200).json({ status: 1, Message: "User Detail Update Successfully.", data: F1 });
                    } else if (userCheck.PlanStatus === "Pending" && userCheck.RegistrationStatus === "Pending") {
                        let ReferralData = await UserModel.findOne({ UserCode: req.body.ReferralCode, IsDeleted: false }).exec();
                        if (ReferralData) {
                            UpdateUserData["ReferralCode"] = req.body.ReferralCode;
                            //await UserModel.updateOne({ _id: req.body.CID }, UpdateUserData).exec();
                            let F2 = await UserModel.findOneAndUpdate({ _id: req.body.CID }, UpdateUserData, { new: true }).populate('GetHealthInsurance', 'UserID PoliceName').exec();
                            return res.status(200).json({ status: 1, Message: "User Detail Update Successfully.", data: F2 });
                        } else { return res.status(200).json({ status: 0, Message: "Referral User Not Found.", data: null }); }
                    } else {
                        let F3 = await UserModel.findOneAndUpdate({ _id: req.body.CID }, UpdateUserData, { new: true }).populate('GetHealthInsurance', 'UserID PoliceName').exec();
                        return res.status(200).json({ status: 1, Message: "User Detail Update Successfully.", data: F3 });
                    }
                } else {
                    let F4 = await UserModel.findOneAndUpdate({ _id: req.body.CID }, UpdateUserData, { new: true }).populate('GetHealthInsurance', 'UserID PoliceName').exec();
                    return res.status(200).json({ status: 1, Message: "User Detail Update Successfully.", data: F4 });
                }
            }
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            await UserModel.updateOne({ _id: req.params.ID }, { IsDeleted: true, Date: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "User Detail Deleted Successfully.", data: null })
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserActive = [async (req, res) => {
    try {
        if (!req.params.ID) { return res.send({ status: 0, Message: "Please Enter Your ID", data: null }); }
        else if (req.params.ID === ":ID") { return res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            await UserModel.updateOne({ _id: req.params.ID }, { IsDeleted: false, Date: moment().format("YYYY-MM-DDTHH:mm:ss") }).exec();
            return res.status(200).json({ status: 1, Message: "User Restore Successfully.", data: null })
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserPlan = [async (req, res) => {
    try {
        if (!req.body.UserID) { res.json({ status: 0, Message: 'Please Enter Your User ID!', data: null }); }
        else { return res.status(200).json({ status: 1, Message: "User Detail Added Successfully.", data: null }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserPlanActivation = [async (req, res) => {
    try {
        if (!req.body.UserID) { res.json({ status: 0, Message: 'Please Enter Your User ID!', data: null }); }
        else {
            let Usertoken = await AuthTokenModel.findOne({ UserID: req.body.UserID, Is_Loggedout: 0 }, 'DeviceToken').sort({ '_id': -1 }).exec();
            if (Usertoken) {
                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: Usertoken.DeviceToken,
                    collapse_key: SenderID,
                    notification: { click_action: 'notify', title: 'Plan Activation for User', body: 'Your Payment Is Received Successful.' }
                };
                fcm.send(message, function (err, response) {
                    if (err) { console.log("Something has gone wrong!", err); } else { console.log("Success", response); }
                });
            }
            let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
            let UserData = await UserModel.findOne({ _id: req.body.UserID, PlanStatus: 'Pending', RegistrationStatus: 'Pending', IsDeleted: false }).exec();
            if (UserData) {
                if (UserData.ReferralCode) {
                    let ReferralData = await UserModel.findOne({ UserCode: UserData.ReferralCode, IsDeleted: false }).exec();
                    if (ReferralData) {
                        let RegAmt = await RegistrationChargeModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                        let PaidAmt = await PaidAmountModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                        var UpdateUserData = {};
                        UpdateUserData["PlanStatus"] = 'Working';
                        UpdateUserData["RegistrationStatus"] = 'Success';
                        UpdateUserData["ModifiedDate"] = new Date();
                        if (ReferralData.UserType === "Main User") {
                            var TotalRFCount = Number((ReferralData.TotalReferralCount) ? (ReferralData.TotalReferralCount) : 0) + 1;
                            await UserModel.updateOne({ _id: req.body.UserID }, UpdateUserData).exec();
                            await UserModel.updateOne({ _id: ReferralData._id }, { TotalReferralCount: TotalRFCount, ModifiedDate: new Date() }).exec();
                            let MasterWallet = await UserWalletModel.findOne({ UserID: ReferralData._id }).exec();
                            if (MasterWallet) {
                                //--------------------------------------Main User Transaction--Start-------------------------------------------------------------------------------------------------------------
                                var mainWal = {}, UpdateWallet = {};
                                var old = MasterWallet.FinalAmount;
                                var Total = (RegAmt) ? (old + Number(RegAmt.Amount)) : (old + 0);
                                let old_2 = MasterWallet.TotalCreditedAmount;
                                var Total_2 = (RegAmt) ? (old_2 + Number(RegAmt.Amount)) : (old_2 + 0);
                                mainWal["FinalAmount"] = Total; mainWal["TotalCreditedAmount"] = Total_2;
                                mainWal["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss"); mainWal["ModifiedDate"] = new Date();
                                await UserWalletModel.updateOne({ UserID: MasterWallet.UserID }, mainWal).exec();
                                //--------------------------------------Main User Transaction--End-------------------------------------------------------------------------------------------------------------
                                let AdminWallet = await UserWalletModel.findOne({ UserID: ReferralData._id }).exec();
                                var old = AdminWallet.FinalAmount;
                                var current = (PaidAmt) ? PaidAmt.SubAmount : 0;
                                var Total = old + current;
                                let old_1 = AdminWallet.TotalCreditedAmount;
                                var Total_1 = (PaidAmt) ? (old_1 + PaidAmt.SubAmount) : (old_1 + 0);
                                UpdateWallet["FinalAmount"] = Total;
                                UpdateWallet["TotalCreditedAmount"] = Total_1;
                                UpdateWallet["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss");
                                UpdateWallet["ModifiedDate"] = new Date();
                                await UserWalletModel.updateOne({ UserID: AdminWallet.UserID }, UpdateWallet).exec();
                                return res.status(200).json({ status: 1, Message: "User Successfully Activated.", data: null });
                            }
                        } else {
                            let RegAmt = await RegistrationChargeModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                            let PaidAmt = await PaidAmountModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                            var TotalRFCount = Number((ReferralData.TotalReferralCount) ? (ReferralData.TotalReferralCount) : 0) + 1;
                            let userplan = await UserPlanDetailModel.findOne({ UserID: ReferralData._id }).sort({ '_id': -1 }).exec();
                            var PlnTotalRFCount = Number((userplan.TotalReferralCount) ? (userplan.TotalReferralCount) : 0) + 1;
                            await UserModel.updateOne({ _id: req.body.UserID }, UpdateUserData).exec();
                            await UserModel.updateOne({ _id: ReferralData._id }, { TotalReferralCount: TotalRFCount, ModifiedDate: new Date() }).exec();
                            if (TotalRFCount === 1) {
                                let Usertoken = await AuthTokenModel.findOne({ UserID: ReferralData._id, Is_Loggedout: 0 }, 'DeviceToken').exec();
                                if (Usertoken) {
                                    var message = {
                                        to: Usertoken.DeviceToken,
                                        collapse_key: SenderID,
                                        notification: { click_action: 'notify', title: 'Yellow Zone', body: 'Your Memeber Is Active Successful.' }
                                    };
                                    fcm.send(message, function (err, response) {
                                        if (err) { console.log("Something has gone wrong!", err); }
                                        else { console.log("Success", response); }
                                    });
                                }
                            }
                            if (Number(MinMemberData.TotalMember) <= Number(TotalRFCount)) {
                                let UserCheck = await UserModel.findOne({ _id: ReferralData._id, IsGreen: true }).exec();
                                if (!UserCheck) {
                                    let DToken = await AuthTokenModel.findOne({ UserID: ReferralData._id, Is_Loggedout: 0 }, 'DeviceToken').exec();
                                    if (DToken) {
                                        var message = {
                                            to: DToken.DeviceToken,
                                            collapse_key: SenderID,
                                            notification: { click_action: 'notify', title: 'Green Zone', body: 'Your Memeber Target Achive Successful.' }
                                        };
                                        fcm.send(message, function (err, response) {
                                            if (err) { console.log("Something has gone wrong!", err); } else { console.log("Success", response); }
                                        });
                                    }
                                }
                                await UserModel.updateOne({ _id: ReferralData._id }, { IsGreen: true }).exec();
                            }
                            //console.log("-->PlnTotalRFCount-->", PlnTotalRFCount);
                            await UserPlanDetailModel.updateOne({ UserID: ReferralData._id }, { TotalReferralCount: PlnTotalRFCount, ModifiedDate: new Date() }).exec();
                            //------------------------------------------------------Section-1 ----------------------------------------------------------------------------------------------------------
                            let ADWallet = await UserModel.findOne({ UserType: 'Main User', IsDeleted: false }).exec();
                            if (ADWallet) {
                                let MsWalt = await UserWalletModel.findOne({ UserID: ADWallet._id }).exec();
                                if (MsWalt) {
                                    var ActWal = {};
                                    var ActAmt = MsWalt.FinalAmount;
                                    var ActTotal = (RegAmt) ? (ActAmt + Number(RegAmt.Amount)) : (ActAmt + 0);
                                    let CrtAmt = MsWalt.TotalCreditedAmount;
                                    var CrtTotal = (RegAmt) ? (CrtAmt + Number(RegAmt.Amount)) : (CrtAmt + 0);
                                    ActWal["FinalAmount"] = ActTotal; ActWal["TotalCreditedAmount"] = CrtTotal;
                                    ActWal["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss"); ActWal["ModifiedDate"] = new Date();
                                    await UserWalletModel.updateOne({ UserID: MsWalt.UserID }, ActWal).exec();
                                }
                            }
                            //------------------------------------------------------Section-1 ----------------------------------------------------------------------------------------------------------
                            //------------------------------------------------------Section-2 ----------------------------------------------------------------------------------------------------------
                            let SubWallet = await UserWalletModel.findOne({ UserID: ReferralData._id }).exec();
                            if (SubWallet) {
                                var SBWallet = {};
                                var MntAmt = SubWallet.FinalAmount;
                                var MntTotal = (PaidAmt) ? (MntAmt + PaidAmt.SubAmount) : (MntAmt + 0);
                                let MntCrtAmt = SubWallet.TotalCreditedAmount;
                                var MntCrtTotal = (PaidAmt) ? (MntCrtAmt + PaidAmt.SubAmount) : (MntCrtAmt + 0);
                                SBWallet["FinalAmount"] = MntTotal;
                                SBWallet["TotalCreditedAmount"] = MntCrtTotal
                                SBWallet["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss");
                                SBWallet["ModifiedDate"] = new Date();
                                await UserWalletModel.updateOne({ UserID: SubWallet.UserID }, SBWallet).exec();
                                await new UserWalletDetailModel({
                                    UserWalletID: SubWallet._id, MainUserID: ReferralData._id, SubUserID: req.body.UserID,
                                    UserPlanDetailID: userplan._id, Amount: ((PaidAmt) ? PaidAmt.SubAmount : 0),
                                    Type: 'Credit', Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                //------------------------------------------------------Section-3 ----------------------------------------------------------------------------------------------------------
                                let ChildLog = await UserModel.findOne({ UserCode: ReferralData.ReferralCode }).exec();
                                if (ChildLog) {
                                    if (ChildLog.UserType === "Main User") {
                                        let SDWallet = await UserModel.findOne({ UserType: 'Main User', IsDeleted: false }).exec();
                                        if (SDWallet) {
                                            let MsWalt = await UserWalletModel.findOne({ UserID: SDWallet._id }).exec();
                                            if (MsWalt) {
                                                var SctWal = {};
                                                var ActAmt = MsWalt.FinalAmount;
                                                var ActTotal = (PaidAmt) ? (ActAmt + PaidAmt.SubChildAmount) : (ActAmt + 0);
                                                let CrtAmt = MsWalt.TotalCreditedAmount;
                                                var CrtTotal = (PaidAmt) ? (CrtAmt + PaidAmt.SubChildAmount) : (CrtAmt + 0);
                                                SctWal["FinalAmount"] = ActTotal; SctWal["TotalCreditedAmount"] = CrtTotal;
                                                SctWal["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss"); SctWal["ModifiedDate"] = new Date();
                                                await UserWalletModel.updateOne({ UserID: MsWalt.UserID }, SctWal).exec();
                                            }
                                        }
                                    } else {
                                        let SubChWallet = await UserWalletModel.findOne({ UserID: ChildLog._id }).exec();
                                        if (SubChWallet) {
                                            var ChWal = {};
                                            var ChActAmt = SubChWallet.FinalAmount;
                                            var ActTotal = (PaidAmt) ? (ChActAmt + PaidAmt.SubChildAmount) : (ChActAmt + 0);
                                            let CrtAmt = SubChWallet.TotalCreditedAmount;
                                            var CrtTotal = (PaidAmt) ? (CrtAmt + PaidAmt.SubChildAmount) : (CrtAmt + 0);
                                            ChWal["FinalAmount"] = ActTotal; ChWal["TotalCreditedAmount"] = CrtTotal;
                                            ChWal["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss"); ChWal["ModifiedDate"] = new Date();
                                            await UserWalletModel.updateOne({ UserID: SubChWallet.UserID }, ChWal).exec();
                                            await new UserWalletDetailModel({
                                                UserWalletID: SubChWallet._id, MainUserID: ChildLog._id, SubUserID: req.body.UserID,
                                                UserPlanDetailID: userplan._id, Amount: ((PaidAmt) ? PaidAmt.SubChildAmount : 0),
                                                Type: 'Credit', IsMember: true, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                            }).save();
                                        } else {
                                            let W1 = await new UserWalletModel({
                                                UserID: ChildLog._id, FinalAmount: (PaidAmt) ? PaidAmt.SubChildAmount : 0,
                                                TotalCreditedAmount: (PaidAmt) ? PaidAmt.SubChildAmount : 0,
                                                TotalWithdrawalAmount: '0', Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                            }).save();
                                            await new UserWalletDetailModel({
                                                UserWalletID: W1._id, MainUserID: ChildLog._id, SubUserID: req.body.UserID,
                                                UserPlanDetailID: userplan._id, Amount: ((PaidAmt) ? PaidAmt.SubChildAmount : 0),
                                                Type: 'Credit', IsMember: true, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                            }).save();
                                        }
                                    }
                                } else { console.log('User Not Found At System!'); }
                                //------------------------------------------------------Section-3 ----------------------------------------------------------------------------------------------------------
                            } else {
                                let RegAmt = await RegistrationChargeModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                                let PaidAmt = await PaidAmountModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                                let W2 = await new UserWalletModel({
                                    UserID: ReferralData._id, FinalAmount: (PaidAmt) ? PaidAmt.SubAmount : 0,
                                    TotalCreditedAmount: (PaidAmt) ? PaidAmt.SubAmount : 0,
                                    TotalWithdrawalAmount: '0', Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                await new UserWalletDetailModel({
                                    UserWalletID: W2._id, MainUserID: ReferralData._id, SubUserID: req.body.UserID,
                                    UserPlanDetailID: userplan._id, Amount: ((PaidAmt) ? PaidAmt.SubAmount : 0),
                                    Type: 'Credit', Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                }).save();
                                //------------------------------------------------------Section-3 ----------------------------------------------------------------------------------------------------------
                                let ChildLog = await UserModel.findOne({ UserCode: ReferralData.ReferralCode }).exec();
                                if (ChildLog) {
                                    if (ChildLog.UserType === "Main User") {
                                        let SDWallet = await UserModel.findOne({ UserType: 'Main User', IsDeleted: false }).exec();
                                        if (SDWallet) {
                                            let MsWalt = await UserWalletModel.findOne({ UserID: SDWallet._id }).exec();
                                            if (MsWalt) {
                                                var SctWal = {};
                                                var ActAmt = MsWalt.FinalAmount;
                                                var ActTotal = (PaidAmt) ? (ActAmt + PaidAmt.SubChildAmount) : (ActAmt + 0);
                                                let CrtAmt = MsWalt.TotalCreditedAmount;
                                                var CrtTotal = (PaidAmt) ? (CrtAmt + PaidAmt.SubChildAmount) : (CrtAmt + 0);
                                                SctWal["FinalAmount"] = ActTotal; SctWal["TotalCreditedAmount"] = CrtTotal;
                                                SctWal["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss"); SctWal["ModifiedDate"] = new Date();
                                                await UserWalletModel.updateOne({ UserID: MsWalt.UserID }, SctWal).exec();
                                            }
                                        }
                                    } else {
                                        let SubChWallet = await UserWalletModel.findOne({ UserID: ChildLog._id }).exec();
                                        if (SubChWallet) {
                                            var ChWal = {};
                                            var ChActAmt = SubChWallet.FinalAmount;
                                            var ActTotal = (PaidAmt) ? (ChActAmt + PaidAmt.SubChildAmount) : (ChActAmt + 0);
                                            let CrtAmt = SubChWallet.TotalCreditedAmount;
                                            var CrtTotal = (PaidAmt) ? (CrtAmt + PaidAmt.SubChildAmount) : (CrtAmt + 0);
                                            ChWal["FinalAmount"] = ActTotal; ChWal["TotalCreditedAmount"] = CrtTotal;
                                            ChWal["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss"); ChWal["ModifiedDate"] = new Date();
                                            await UserWalletModel.updateOne({ UserID: SubChWallet.UserID }, ChWal).exec();
                                            await new UserWalletDetailModel({
                                                UserWalletID: SubChWallet._id, MainUserID: ChildLog._id, SubUserID: req.body.UserID,
                                                UserPlanDetailID: userplan._id, Amount: ((PaidAmt) ? PaidAmt.SubChildAmount : 0),
                                                Type: 'Credit', IsMember: true, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                            }).save();
                                        } else {
                                            let W1 = await new UserWalletModel({
                                                UserID: ChildLog._id, FinalAmount: (PaidAmt) ? PaidAmt.SubChildAmount : 0,
                                                TotalCreditedAmount: (PaidAmt) ? PaidAmt.SubChildAmount : 0,
                                                TotalWithdrawalAmount: '0', Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                            }).save();
                                            await new UserWalletDetailModel({
                                                UserWalletID: W1._id, MainUserID: ChildLog._id, SubUserID: req.body.UserID, IsMember: true,
                                                UserPlanDetailID: userplan._id, Amount: ((PaidAmt) ? PaidAmt.SubChildAmount : 0),
                                                Type: 'Credit', Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                                            }).save();
                                        }
                                    }
                                } else { console.log('User Not Found At System!'); }
                                //------------------------------------------------------Section-3 ----------------------------------------------------------------------------------------------------------
                            }
                            return res.status(200).json({ status: 1, Message: "User Successfully Activated.", data: null });
                        }
                    } else {
                        let RegAmt = await RegistrationChargeModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                        let PaidAmt = await PaidAmountModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                        var UpdateUserData = {};
                        UpdateUserData["PlanStatus"] = 'Working';
                        UpdateUserData["RegistrationStatus"] = 'Success';
                        UpdateUserData["ModifiedDate"] = new Date();
                        await UserModel.updateOne({ _id: req.body.UserID }, UpdateUserData).exec();
                        let SDWallet = await UserModel.findOne({ UserType: 'Main User', IsDeleted: false }).exec();
                        if (SDWallet) {
                            let MsWalt = await UserWalletModel.findOne({ UserID: SDWallet._id }).exec();
                            if (MsWalt) {
                                var SctWal = {};
                                var ActAmt = MsWalt.FinalAmount;
                                var ActTotal = (RegAmt) ? (ActAmt + Number(RegAmt.Amount)) : (ActAmt + 0);
                                let CrtAmt = MsWalt.TotalCreditedAmount;
                                var CrtTotal = (RegAmt) ? (CrtAmt + Number(RegAmt.Amount)) : (CrtAmt + 0);
                                SctWal["FinalAmount"] = ActTotal; SctWal["TotalCreditedAmount"] = CrtTotal;
                                SctWal["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss"); SctWal["ModifiedDate"] = new Date();
                                await UserWalletModel.updateOne({ UserID: MsWalt.UserID }, SctWal).exec();
                            }
                        }
                        return res.status(200).json({ status: 1, Message: "User Successfully Activated.", data: null });
                    }
                } else {
                    let RegAmt = await RegistrationChargeModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                    let PaidAmt = await PaidAmountModel.findOne({ IsActive: true, IsDeleted: false }).sort({ '_id': -1 }).exec();
                    var UpdateUserData = {};
                    UpdateUserData["PlanStatus"] = 'Working';
                    UpdateUserData["RegistrationStatus"] = 'Success';
                    UpdateUserData["ModifiedDate"] = new Date();
                    await UserModel.updateOne({ _id: req.body.UserID }, UpdateUserData).exec();
                    let SDWallet = await UserModel.findOne({ UserType: 'Main User', IsDeleted: false }).exec();
                    if (SDWallet) {
                        let MsWalt = await UserWalletModel.findOne({ UserID: SDWallet._id }).exec();
                        if (MsWalt) {
                            var SctWal = {};
                            var ActAmt = MsWalt.FinalAmount;
                            var ActTotal = (RegAmt) ? (ActAmt + Number(RegAmt.Amount)) : (ActAmt + 0);
                            let CrtAmt = MsWalt.TotalCreditedAmount;
                            var CrtTotal = (RegAmt) ? (CrtAmt + Number(RegAmt.Amount)) : (CrtAmt + 0);
                            SctWal["FinalAmount"] = ActTotal; SctWal["TotalCreditedAmount"] = CrtTotal;
                            SctWal["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss"); SctWal["ModifiedDate"] = new Date();
                            await UserWalletModel.updateOne({ UserID: MsWalt.UserID }, SctWal).exec();
                        }
                    }
                    return res.status(200).json({ status: 1, Message: "User Successfully Activated.", data: null });
                }
            } else { return res.status(200).json({ status: 0, Message: "User Not Found.", data: null }); }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.UserRefView = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, UserCode } = req.query;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj['UserCode'] = UserCode ? { $regex: new RegExp(UserCode), $options: "i" } : { $ne: null };
        obj['UserType'] = { $nin: ['Main User'] };
        obj['TotalReferralCount'] = { $ne: 0 };
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        obj['RegistrationStatus'] = 'Success';
        let Total = await UserModel.countDocuments(obj).exec();
        let UserData = await UserModel.find(obj).populate({
            path: 'RefUserDetail', select: 'MainUserID SubUserID IsMember', match: { IsMember: false, Type: { $nin: ['Debit'] } },
            populate: { path: 'SubUserID', select: 'Name MobileNo UserCode TotalReferralCount CreatedDate' }
        }).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.round(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
        // let UserData = await UserModel.find({ RegistrationStatus: 'Success', IsActive: true, IsDeleted: false, UserType: { $nin: ['Main User'] } }, 'Name MobileNo UserCode TotalReferralCount CreatedDate')
        //     .populate({
        //         path: 'RefUserDetail', select: 'MainUserID SubUserID IsMember', match: { IsMember: false, Type: { $nin: ['Debit'] } },
        //         populate: { path: 'SubUserID', select: 'Name MobileNo UserCode TotalReferralCount CreatedDate' }
        //     }).sort({ '_id': -1 }).exec();
        // if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", data: UserData }); }
        // else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserOwnMember = [async (req, res) => {
    try {
        if (!req.body.UserID) { res.json({ status: 0, Message: 'Please Enter Your User ID!', data: null }); }
        else {
            let UserData = await UserModel.find({ _id: req.body.UserID, RegistrationStatus: "Success", IsActive: true, IsDeleted: false, UserType: { $nin: ['Main User'] } }, 'Name MobileNo UserCode TotalReferralCount')
                .populate({
                    path: 'RefUserDetail', select: 'MainUserID SubUserID',
                    populate: { path: 'SubUserID', select: 'Name MobileNo UserCode TotalReferralCount' }
                }).sort({ '_id': -1 }).exec();
            if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", data: UserData }); }
            else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserMyMember = [async (req, res) => {
    try {
        if (!req.body.UserID) { res.json({ status: 0, Message: 'Please Enter Your User ID!', data: null }); }
        else {
            var QueryObj = {};
            if (req.body.Type) {
                QueryObj['IsActive'] = true;
                QueryObj['IsDeleted'] = false;
                let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
                (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = 10;
                if (req.body.Type === "Red") {
                    QueryObj['PlanStatus'] = 'Pending';
                    QueryObj['RegistrationStatus'] = 'Pending';
                    QueryObj['TotalReferralCount'] = 0;
                } else if (req.body.Type === "Yellow") {
                    QueryObj['PlanStatus'] = 'Working';
                    QueryObj['RegistrationStatus'] = 'Success';
                    QueryObj['TotalReferralCount'] = 0;
                } else if (req.body.Type === "Blue") {
                    QueryObj['PlanStatus'] = 'Working';
                    QueryObj['RegistrationStatus'] = 'Success';
                    QueryObj['$and'] = [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $lt: MinimumMember } }];
                } else if (req.body.Type === "Green") {
                    QueryObj['PlanStatus'] = 'Working';
                    QueryObj['RegistrationStatus'] = 'Success';
                    QueryObj['$and'] = [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $gte: MinimumMember } }];
                }
            } else {
                QueryObj['IsActive'] = true;
                QueryObj['IsDeleted'] = false;
            }
            let UserData = await UserModel.findOne({
                _id: req.body.UserID,
                RegistrationStatus: "Success",
                IsActive: true,
                IsDeleted: false,
                UserType: { $nin: ['Main User'] }
            }, 'Name MobileNo UserCode TotalReferralCount')
                .populate({
                    path: 'RefUserDetail',
                    select: 'SubUserID -MainUserID -_id',
                    match: {
                        IsMember: false,
                        Type: { $nin: ['Debit'] }
                    },
                    options: { sort: { '_id': -1 } },
                    populate: {
                        path: 'SubUserID',
                        match: QueryObj,
                        select: 'Name MobileNo Email Address IDProof UserCode TotalReferralCount Date'
                    }
                }).sort({ '_id': -1 }).exec();
            if (UserData) {
                var ResultObj = {}, Result = [];
                if (UserData.RefUserDetail.length > 0) {
                    await UserData.RefUserDetail.forEach((doc1) => { if (doc1.SubUserID) { Result.push(doc1.SubUserID) } })
                }
                ResultObj['_id'] = UserData._id;
                ResultObj['Name'] = UserData.Name;
                ResultObj['MobileNo'] = UserData.MobileNo;
                ResultObj['UserCode'] = UserData.UserCode;
                ResultObj['TotalReferralCount'] = UserData.TotalReferralCount;
                ResultObj['RefUserDetail'] = Result;
                return res.status(200).json({ status: 1, Message: "Success.", data: ResultObj });
            } else {
                return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserPassBook = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else {
            var obj = {};
            if (req.body.StartDate && req.body.EndDate) {
                let todayi = new Date(req.body.StartDate);
                let todayEODi = new Date(req.body.EndDate);
                todayi.setHours(0, 0, 0, 0);
                todayEODi.setHours(23, 59, 59, 999);
                SDateCon = { $gte: todayi.toISOString(), $lte: todayEODi.toISOString() };
                obj["MainUserID"] = req.body.UserID;
                obj["CreatedDate"] = SDateCon;
            } else {
                obj["MainUserID"] = req.body.UserID;
            }
            var Result = [];
            let UserWallet = await UserWalletDetailModel.find(obj)
                .populate('SubUserID', 'Name').sort({ '_id': -1 }).exec();
            if (UserWallet.length > 0) {
                let MyAmt = await UserWalletModel.findOne({ UserID: req.body.UserID }).exec();
                let FinalAmt = (MyAmt) ? (MyAmt.FinalAmount) : 0;
                await UserWallet.forEach((doc) => {
                    Result.push({
                        _id: doc._id, Name: (doc.SubUserID) ? (doc.SubUserID.Name) : '',
                        Amount: doc.Amount, Type: doc.Type, Date: doc.Date, CreatedDate: doc.CreatedDate
                    });
                });
                return res.status(200).json({ status: 1, Message: "Success.", FinalAmount: FinalAmt, data: Result });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", FinalAmount: 0, data: Result }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserTransaction = [async (req, res) => {
    try {
        let UserData = await UserModel.find({ RegistrationStatus: "Success", IsActive: true, IsDeleted: false, UserType: { $nin: ['Main User'] } },
            'Name MobileNo Address IDProof UserCode ReferralCode TotalReferralCount RegistrationAmount MinimumMember Date')
            .populate('userwallet', 'UserID FinalAmount TotalCreditedAmount TotalWithdrawalAmount')
            .populate({
                path: 'RefUserDetail', select: 'MainUserID SubUserID Amount Type Date', options: { sort: { '_id': -1 } },
                populate: { path: 'SubUserID', select: 'Name' }
            }).sort({ '_id': -1 }).exec();
        if (UserData.length > 0) {
            var Result = [];
            await UserData.forEach(async (doc) => {
                var Result1 = []
                if (doc.RefUserDetail.length > 0) {
                    await doc.RefUserDetail.forEach(async (doc1) => {
                        if (doc1.SubUserID) { Result1.push({ _id: doc1._id, Name: doc1.SubUserID.Name, Amount: doc1.Amount, Type: doc1.Type, Date: doc1.Date }) }
                    });
                    Result.push({
                        _id: doc._id, Name: doc.Name, MobileNo: doc.MobileNo, Address: doc.Address, IDProof: doc.IDProof, UserCode: doc.UserCode,
                        RefUserDetail: Result1,
                        FinalAmount: (doc.userwallet.length > 0) ? (doc.userwallet[0].FinalAmount) : (0),
                        TotalCreditedAmount: (doc.userwallet.length > 0) ? (doc.userwallet[0].TotalCreditedAmount) : (0),
                        TotalWithdrawalAmount: (doc.userwallet.length > 0) ? (doc.userwallet[0].TotalWithdrawalAmount) : (0),
                        Date: doc.Date
                    });
                }
            });
            return res.status(200).json({ status: 1, Message: "Success.", list: UserData, data: Result });
        } else {
            return res.status(200).json({ status: 1, Message: "Success.", data: [] });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserTransaction1 = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo, UserCode } = req.query;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        obj['UserCode'] = UserCode ? { $regex: new RegExp(UserCode), $options: "i" } : { $ne: null };
        obj['UserType'] = { $nin: ['Main User'] };
        obj['TotalReferralCount'] = { $ne: 0 };
        obj['IsActive'] = true;
        obj['IsDeleted'] = false;
        obj['RegistrationStatus'] = 'Success';
        let Total = await UserModel.countDocuments(obj).exec();
        let UserData = await UserModel.find(obj, 'Name MobileNo UserCode TotalReferralCount Date')
            .populate('userwallet', 'UserID FinalAmount TotalCreditedAmount TotalWithdrawalAmount')
            .populate({
                path: 'RefUserDetail', select: 'MainUserID SubUserID Amount Type Date', options: { sort: { '_id': -1 } },
                populate: { path: 'SubUserID', select: 'Name' }
            }).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.round(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserRemain = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else {
            let Green = await UserModel.findOne({ _id: req.body.UserID, IsActive: true, IsDeleted: false }, 'TotalReferralCount').exec();
            let Res_Green = Green.TotalReferralCount;
            let Business_Plan = 0, Home_Plan = 0;
            let CountUserData = await UserModel.find({
                _id: req.body.UserID, RegistrationStatus: "Success", IsActive: true, IsDeleted: false, UserType: { $nin: ['Main User'] }
            }, 'Name MobileNo Address UserCode TotalReferralCount IsGreen IsBusiness Date')
                .populate({
                    path: 'RefUserDetail', select: 'MainUserID SubUserID', match: { IsMember: false, Type: { $nin: ['Debit'] } },
                    populate: { path: 'SubUserID', select: 'Name UserCode TotalReferralCount IsGreen' }
                }).sort({ '_id': -1 }).exec();
            if (CountUserData.length > 0) {
                let STTotal = 0;
                for (i = 0; i < CountUserData.length; i++) {
                    if (CountUserData[i].RefUserDetail.length > 0) {
                        var CK = 0;
                        for (j = 0; j < CountUserData[i].RefUserDetail.length; j++) {
                            if (CountUserData[i].RefUserDetail[j].SubUserID.IsGreen === true) {
                                CK = CK + 1; STTotal = CK;
                            }
                        }
                    }
                }
                Business_Plan = STTotal;
            }
            let HomeCountUserData = await UserModel.find({
                _id: req.body.UserID, $and: [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $gte: 100 } }],
                IsGreen: true, IsActive: true, IsDeleted: false, UserType: { $nin: ['Main User'] }, RegistrationStatus: "Success"
            }, 'Name MobileNo Address UserCode TotalReferralCount IsGreen IsHomeInst Date')
                .populate({
                    path: 'RefUserDetail', select: 'MainUserID SubUserID', match: { IsMember: false, Type: { $nin: ['Debit'] } },
                    populate: { path: 'SubUserID', select: 'Name MobileNo UserCode TotalReferralCount IsGreen' }
                }).sort({ '_id': -1 }).exec();
            if (HomeCountUserData.length > 0) {
                let HomeResult = []
                for (i = 0; i < HomeCountUserData.length; i++) {
                    if (HomeCountUserData[i].RefUserDetail.length > 0) {
                        var SK = 0, LoopTerminate = false;
                        for (j = 0; j < HomeCountUserData[i].RefUserDetail.length; j++) {
                            if (HomeCountUserData[i].RefUserDetail[j].SubUserID.IsGreen === true) {
                                SK = SK + 1;
                                if (SK >= 100 && LoopTerminate === false) {
                                    HomeResult.push({ "_id": HomeCountUserData[i]._id, "Name": HomeCountUserData[i].Name }); LoopTerminate = true;
                                }
                            }
                        }
                    }
                }
                Home_Plan = (HomeResult.length > 0 ? 1 : 0);
            }
            return res.status(200).json({
                status: 1,
                Message: "Success.",
                GreenZone: Res_Green + '/' + 10,
                BusinessZone: Business_Plan + '/' + 10,
                HomeInsZone: Home_Plan + '/' + 100,
                data: null
            });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.BusinessPlan = [async (req, res) => {
    try {
        //IsGreen: true,
        let UserData = await UserModel.find({
            $and: [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $gte: 10 } }],
            UserType: { $nin: ['Main User'] }, IsActive: true, IsDeleted: false
        }, '_id').sort({ '_id': -1 }).exec();
        if (UserData.length > 0) {
            var Result = [];
            for (let l = 0; l < UserData.length; l++) { Result.push(UserData[l]._id); }
            let CountUserData = await UserModel.find({
                _id: { $in: Result }, RegistrationStatus: "Success", IsActive: true, IsDeleted: false, UserType: { $nin: ['Main User'] }
            }, 'Name MobileNo Address UserCode TotalReferralCount IsGreen IsBusiness Date')
                .populate({
                    path: 'RefUserDetail', select: 'MainUserID SubUserID', match: { IsMember: false, Type: { $nin: ['Debit'] } },
                    populate: { path: 'SubUserID', select: 'Name UserCode TotalReferralCount IsGreen' }
                }).sort({ '_id': -1 }).exec();
            if (CountUserData.length > 0) {
                let Result = []
                for (i = 0; i < CountUserData.length; i++) {
                    if (CountUserData[i].RefUserDetail.length > 0) {
                        var CK = 0, LoopTerminate = false;
                        for (j = 0; j < CountUserData[i].RefUserDetail.length; j++) {
                            if (CountUserData[i].RefUserDetail[j].SubUserID.IsGreen === true) {
                                CK = CK + 1;
                                if (CK >= 10 && LoopTerminate === false) {
                                    Result.push({
                                        "_id": CountUserData[i]._id, "Name": CountUserData[i].Name, "Address": CountUserData[i].Address,
                                        "MobileNo": CountUserData[i].MobileNo, "UserCode": CountUserData[i].UserCode,
                                        "TotalReferralCount": CountUserData[i].TotalReferralCount, "IsBusiness": CountUserData[i].IsBusiness,
                                        "IsGreen": CountUserData[i].IsGreen, "Date": CountUserData[i].Date
                                    });
                                    LoopTerminate = true;
                                }
                            }
                        }
                    }
                }
                let Total = Result.length;
                let round = Math.ceil(Total / 10);
                return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, data: Result, count: Total });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HomeInstallment = [async (req, res) => {
    try {
        let UserData = await UserModel.find({
            $and: [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $gte: 100 } }],
            UserType: { $nin: ['Main User'] }, IsGreen: true, IsActive: true, IsDeleted: false
        }, '_id').sort({ '_id': -1 }).exec();
        if (UserData.length > 0) {
            var Result = [];
            for (let l = 0; l < UserData.length; l++) { Result.push(UserData[l]._id); }
            let CountUserData = await UserModel.find({
                _id: { $in: Result }, RegistrationStatus: "Success", IsActive: true, IsDeleted: false, UserType: { $nin: ['Main User'] }
            }, 'Name MobileNo Address UserCode TotalReferralCount IsGreen IsHomeInst Date')
                .populate({
                    path: 'RefUserDetail', select: 'MainUserID SubUserID', match: { IsMember: false, Type: { $nin: ['Debit'] } },
                    populate: { path: 'SubUserID', select: 'Name MobileNo UserCode TotalReferralCount IsGreen' }
                }).sort({ '_id': -1 }).exec();
            if (CountUserData.length > 0) {
                let Result = []
                for (i = 0; i < CountUserData.length; i++) {
                    if (CountUserData[i].RefUserDetail.length > 0) {
                        var CK = 0, LoopTerminate = false;
                        for (j = 0; j < CountUserData[i].RefUserDetail.length; j++) {
                            if (CountUserData[i].RefUserDetail[j].SubUserID.IsGreen === true) {
                                CK = CK + 1;
                                if (CK >= 100 && LoopTerminate === false) {
                                    Result.push({
                                        "_id": CountUserData[i]._id, "Name": CountUserData[i].Name, "Address": CountUserData[i].Address,
                                        "MobileNo": CountUserData[i].MobileNo, "UserCode": CountUserData[i].UserCode,
                                        "TotalReferralCount": CountUserData[i].TotalReferralCount, "IsHomeInst": CountUserData[i].IsHomeInst,
                                        "IsGreen": CountUserData[i].IsGreen, "Date": CountUserData[i].Date
                                    });
                                    LoopTerminate = true;
                                }
                            }
                        }
                    }
                }
                let Total = Result.length;
                let round = Math.ceil(Total / 10);
                return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, data: Result, count: Total });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.MTBusinessPlan = [async (req, res) => {
    try {
        //IsGreen: true,
        let UserData = await UserModel.find({
            $and: [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $gte: 10 } }],
            UserType: { $nin: ['Main User'] }, IsActive: true, IsDeleted: false
        }, '_id').sort({ '_id': -1 }).exec();
        if (UserData.length > 0) {
            var Result = [];
            for (let l = 0; l < UserData.length; l++) { Result.push(UserData[l]._id); }
            let CountUserData = await UserModel.find({
                _id: { $in: Result }, RegistrationStatus: "Success", IsActive: true, IsDeleted: false, UserType: { $nin: ['Main User'] }
            }, 'Name MobileNo Address UserCode TotalReferralCount IsGreen IsBusiness Date')
                .populate({
                    path: 'RefUserDetail', select: 'MainUserID SubUserID', match: { IsMember: false, Type: { $nin: ['Debit'] } },
                    populate: { path: 'SubUserID', select: 'Name UserCode TotalReferralCount IsGreen' }
                }).sort({ '_id': -1 }).exec();
            if (CountUserData.length > 0) {
                let Result = []
                for (i = 0; i < CountUserData.length; i++) {
                    if (CountUserData[i].RefUserDetail.length > 0) {
                        var CK = 0, LoopTerminate = false;
                        for (j = 0; j < CountUserData[i].RefUserDetail.length; j++) {
                            if (CountUserData[i].RefUserDetail[j].SubUserID.IsGreen === true) {
                                CK = CK + 1;
                                if (CK >= 10 && LoopTerminate === false) {
                                    Result.push({
                                        "_id": CountUserData[i]._id, "Name": CountUserData[i].Name, "Address": CountUserData[i].Address,
                                        "MobileNo": CountUserData[i].MobileNo, "UserCode": CountUserData[i].UserCode,
                                        "TotalReferralCount": CountUserData[i].TotalReferralCount, "IsBusiness": CountUserData[i].IsBusiness,
                                        "IsGreen": CountUserData[i].IsGreen, "Date": CountUserData[i].Date
                                    });
                                    LoopTerminate = true;
                                }
                            }
                        }
                    }
                }
                return res.status(200).json({ status: 1, Message: "Success.", data: Result });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.MTHomeInstallment = [async (req, res) => {
    try {
        let UserData = await UserModel.find({
            $and: [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $gte: 100 } }],
            UserType: { $nin: ['Main User'] }, IsGreen: true, IsActive: true, IsDeleted: false
        }, '_id').sort({ '_id': -1 }).exec();
        if (UserData.length > 0) {
            var Result = [];
            for (let l = 0; l < UserData.length; l++) { Result.push(UserData[l]._id); }
            let CountUserData = await UserModel.find({
                _id: { $in: Result }, RegistrationStatus: "Success", IsActive: true, IsDeleted: false, UserType: { $nin: ['Main User'] }
            }, 'Name MobileNo Address UserCode TotalReferralCount IsGreen IsHomeInst Date')
                .populate({
                    path: 'RefUserDetail', select: 'MainUserID SubUserID', match: { IsMember: false, Type: { $nin: ['Debit'] } },
                    populate: { path: 'SubUserID', select: 'Name MobileNo UserCode TotalReferralCount IsGreen' }
                }).sort({ '_id': -1 }).exec();
            if (CountUserData.length > 0) {
                let Result = []
                for (i = 0; i < CountUserData.length; i++) {
                    if (CountUserData[i].RefUserDetail.length > 0) {
                        var CK = 0, LoopTerminate = false;
                        for (j = 0; j < CountUserData[i].RefUserDetail.length; j++) {
                            if (CountUserData[i].RefUserDetail[j].SubUserID.IsGreen === true) {
                                CK = CK + 1;
                                if (CK >= 100 && LoopTerminate === false) {
                                    Result.push({
                                        "_id": CountUserData[i]._id, "Name": CountUserData[i].Name, "Address": CountUserData[i].Address,
                                        "MobileNo": CountUserData[i].MobileNo, "UserCode": CountUserData[i].UserCode,
                                        "TotalReferralCount": CountUserData[i].TotalReferralCount, "IsHomeInst": CountUserData[i].IsHomeInst,
                                        "IsGreen": CountUserData[i].IsGreen, "Date": CountUserData[i].Date
                                    });
                                    LoopTerminate = true;
                                }
                            }
                        }
                    }
                }
                return res.status(200).json({ status: 1, Message: "Success.", data: Result });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.BusinessPlanAccept = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else {
            await UserModel.updateOne({ _id: req.body.UserID }, { IsBusiness: true }).exec();
            return res.json({ status: 1, Message: 'Your Business Plan is Added Successfully.', data: null });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.HomeInstallmentAccept = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else {
            await UserModel.updateOne({ _id: req.body.UserID }, { IsHomeInst: true }).exec();
            return res.json({ status: 1, Message: 'Your Home Installment Plan is Added Successfully.', data: null });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserWithdrawal = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else if (!req.body.Amount) { return res.json({ status: 0, Message: 'Please Enter Amount!', data: null }); }
        else {
            let userWallet = await UserWalletModel.findOne({ UserID: req.body.UserID }).exec();
            if (userWallet) {
                if (Number(userWallet.FinalAmount) < Number(req.body.Amount)) {
                    return res.json({ status: 0, Message: 'Wallet Balance Is Low,Please try another amount!', data: null });
                } else {
                    await new UserWithdrawalRequestModel({ UserID: req.body.UserID, Amount: req.body.Amount, Date: moment().format("YYYY-MM-DDTHH:mm:ss") }).save();
                    return res.json({ status: 1, Message: 'Withdrawal Request Success!', data: null });
                }
            } else { return res.status(200).json({ status: 0, Message: "User Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.GetUserWithdrawal = [async (req, res) => {
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
            let userWithdrawal = await UserWithdrawalRequestModel.find({ UserID: req.body.UserID, CreatedDate: SDateCon, IsDeleted: false }).populate('UserID', 'Name MobileNo').sort({ '_id': -1 }).exec();
            if (userWithdrawal.length > 0) {
                return res.status(200).json({ status: 1, Message: "Success.", data: userWithdrawal });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.GetWithdrawal = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 10; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size, Name, MobileNo } = req.body;
        const { limit, offset } = getPagination(page, size);
        let obj = {};
        obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
        obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
        await UserWithdrawalRequestModel.aggregate([
            { $lookup: { from: 'User', localField: 'UserID', foreignField: '_id', as: 'user_docs' } }, { $match: { user_docs: { $elemMatch: obj } } }
        ]).exec(async (err, ObjData) => {
            if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
            else {
                if (ObjData.length > 0) {
                    await UserWithdrawalRequestModel.aggregate([
                        { $lookup: { from: 'User', localField: 'UserID', foreignField: '_id', as: 'user_docs' } },
                        { $sort: { _id: -1 } }, { $match: { user_docs: { $elemMatch: obj } } },
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
exports.GetMainBalance = [async (req, res) => {
    try {
        let SDWallet = await UserModel.findOne({ UserType: 'Main User', IsDeleted: false }).exec();
        if (SDWallet) {
            let WalletResult = await UserWalletModel.findOne({ UserID: SDWallet._id }).sort({ '_id': -1 }).exec();
            console.log("====user====", WalletResult)
            if (WalletResult) {
                return res.json({ status: 1, Message: 'Success', data: WalletResult });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        } else { return res.status(200).json({ status: 0, Message: "User Not Found.", data: null }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserWithdrawalAccept = [async (req, res) => {
    try {
        if (!req.body.CID) { return res.json({ status: 0, Message: 'Please Enter ID!', data: null }); }
        else if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else if (!req.body.Amount) { return res.json({ status: 0, Message: 'Please Enter Amount!', data: null }); }
        else {
            let SDWallet = await UserModel.findOne({ UserType: 'Main User', IsDeleted: false }).exec();
            let WalletResult = await UserWalletModel.findOne({ UserID: SDWallet._id }).sort({ '_id': -1 }).exec();
            let userWallet = await UserWalletModel.findOne({ UserID: req.body.UserID }).sort({ '_id': -1 }).exec();
            if (WalletResult && userWallet) {
                if (WalletResult.FinalAmount < Number(req.body.Amount)) {
                    return res.json({ status: 0, Message: 'Admin Wallet Amount insufficient!', data: null });
                } else if (userWallet.FinalAmount < Number(req.body.Amount)) {
                    return res.json({ status: 0, Message: 'User Wallet Amount insufficient!', data: null });
                } else {
                    //-------------------------------Admin Transaction----------------------------------------------------------------------------------
                    var AdminWallet = {};
                    AdminWallet["FinalAmount"] = WalletResult.FinalAmount - Number(req.body.Amount);
                    AdminWallet["TotalWithdrawalAmount"] = (WalletResult.TotalWithdrawalAmount + Number(req.body.Amount));
                    AdminWallet["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss");
                    AdminWallet["ModifiedDate"] = new Date();
                    await UserWalletModel.updateOne({ UserID: WalletResult.UserID }, AdminWallet).exec();
                    await new UserWalletDetailModel({
                        UserWalletID: WalletResult._id, MainUserID: WalletResult.UserID, SubUserID: WalletResult.UserID, Amount: req.body.Amount,
                        Type: 'Debit', Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                    }).save();
                    //-----------------------------------------------------------------------------------------------------------------
                    //-------------------------------User Transaction----------------------------------------------------------------------------------
                    var UserWallet = {};
                    UserWallet["FinalAmount"] = userWallet.FinalAmount - Number(req.body.Amount);
                    UserWallet["TotalWithdrawalAmount"] = (userWallet.TotalWithdrawalAmount + Number(req.body.Amount));
                    UserWallet["Date"] = moment().format("YYYY-MM-DDTHH:mm:ss");
                    UserWallet["ModifiedDate"] = new Date();
                    await UserWalletModel.updateOne({ UserID: req.body.UserID }, UserWallet).exec();
                    await new UserWalletDetailModel({
                        UserWalletID: userWallet._id, MainUserID: req.body.UserID, SubUserID: req.body.UserID, Amount: req.body.Amount,
                        Type: 'Debit', Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                    }).save();
                    // await UserWithdrawalRequestModel.updateOne({ _id: req.body.CID }, { Status: false, Date: moment().format("YYYY-MM-DDTHH:mm:ss"), ModifiedDate: new Date() }).exec();
                    // return res.json({ status: 1, Message: 'Withdrawal Request Success!', data: null });
                    let F1 = await UserWithdrawalRequestModel.findOneAndUpdate({ _id: req.body.CID }, { Status: false, Date: moment().format("YYYY-MM-DDTHH:mm:ss"), ModifiedDate: new Date() }, { new: true }).exec();
                    return res.json({ status: 1, Message: 'Withdrawal Request Success!', data: F1 });
                    //-----------------------------------------------------------------------------------------------------------------
                }
            } else { return res.status(200).json({ status: 0, Message: "User Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.GetMainBalance = [async (req, res) => {
    try {
        let SDWallet = await UserModel.findOne({ UserType: 'Main User', IsDeleted: false }).exec();
        if (SDWallet) {
            let WalletResult = await UserWalletModel.findOne({ UserID: SDWallet._id }).sort({ '_id': -1 }).exec();
            if (WalletResult) {
                return res.json({ status: 1, Message: 'Success', data: WalletResult });
            } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
        } else { return res.status(200).json({ status: 0, Message: "User Not Found.", data: null }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.GetBanner1 = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else {
            let UserData = await UserModel.findOne({ _id: req.body.UserID, IsDeleted: false }).exec();
            //let HIData = await HealthInsuranceModel.findOne({ UserID: req.body.UserID }).exec();
            if (UserData) {
                var ObjData = {};
                ObjData["_id"] = UserData._id;
                ObjData["IsActive"] = UserData.IsActive;
                ObjData["RegistrationStatus"] = UserData.RegistrationStatus;
                ObjData["PlanStatus"] = UserData.PlanStatus;
                ObjData["HealthInsurance"] = (UserData.IsGreen === true) ? (true) : (false);
                return res.status(200).json({ status: 1, Message: "Success.", data: ObjData });

            } else { return res.status(200).json({ status: 0, Message: "User Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.GetBanner = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: 'Please Enter UserID!', data: null }); }
        else {
            let UserData = await UserModel.findOne({ _id: req.body.UserID, IsDeleted: false })
                .populate({ path: 'PlanTypeID', select: 'Type' }).exec();
            console.log("===Userdata==", UserData);
            //let HIData = await HealthInsuranceModel.findOne({ UserID: req.body.UserID }).exec();
            if (UserData) {
                var ObjData = {};
                ObjData["_id"] = UserData._id;
                ObjData["IsActive"] = UserData.IsActive;
                ObjData["RegistrationStatus"] = UserData.RegistrationStatus;
                ObjData["PlanStatus"] = UserData.PlanStatus;
                ObjData["PlanType"] = UserData.PlanTypeID.Type;
                ObjData["HealthInsurance"] = (UserData.IsGreen === true) ? (true) : (false);
                return res.status(200).json({ status: 1, Message: "Success.", data: ObjData });

            } else { return res.status(200).json({ status: 0, Message: "User Not Found.", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.PlanTypeAdd = [async (req, res) => {
    try {
        console.log("====req.body===", req.body);
        if (!req.body.Type) { res.json({ status: 0, Message: 'Please Enter Your Type!', data: null }); }
        else {
            await new PlanTypeModel({
                Type: req.body.Type
            }).save();
            return res.status(200).json({ status: 1, Message: "Plan Type Added Successfully.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.PlanTypeGet = [async (req, res) => {
    try {
        plantypedata = await PlanTypeModel.find({ IsDeleted: false }).sort({ '_id': -1 }).exec();
        return res.status(200).json({ status: 1, Message: "Success.", data: plantypedata });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DropDownPlanType = [async (req, res) => {
    try {
        let plantype = await PlanTypeModel.find({}, '_id Type').sort({ '_id': -1 }).exec();
        if (plantype.length > 0) {
            var Result = [];
            await plantype.forEach((doc) => {
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
// ETC API LISTS
// exports.UserCounter = [async (req, res) => {
//     try {
//         let Total = await UserModel.countDocuments({}).exec();
//         let Red = await UserModel.countDocuments({ PlanStatus: 'Pending', RegistrationStatus: 'Pending', TotalReferralCount: 0, IsActive: true, IsDeleted: false }).exec();
//         let Yellow = await UserModel.countDocuments({ PlanStatus: 'Working', RegistrationStatus: 'Success', TotalReferralCount: 0, IsActive: true, IsDeleted: false }).exec();
//         let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
//         (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = "10";
//         let Blue = await UserModel.countDocuments({
//             $and: [{ TotalReferralCount: { $ne: 0 } },
//             { TotalReferralCount: { $lt: Number(MinimumMember) } }], PlanStatus: 'Working', RegistrationStatus: 'Success', IsActive: true, IsDeleted: false
//         }).exec();
//         let Green = await UserModel.countDocuments({
//             $and: [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $gte: MinimumMember } }],
//             PlanStatus: 'Working', RegistrationStatus: 'Success', IsActive: true, IsDeleted: false
//         }).exec();
//         return res.status(200).json({ status: 1, Message: "Success.", Total: Total, Red: Red, Yellow: Yellow, Blue: Blue, Green: Green, data: null });
//     } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
// }];
// exports.UserUnderGreenZone = [async (req, res) => {
//     try {
//         let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
//         (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = 10;
//         let UserData = await UserModel.find({
//             UserType: { $nin: ['Main User'] },
//             $and: [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $gte: MinimumMember } }],
//             PlanStatus: 'Working', RegistrationStatus: 'Success', IsActive: true, IsDeleted: false
//         }, '-IsActive -IsDeleted -Password -StartDate -EndDate -CreatedDate -__v').sort({ '_id': -1 }).exec();
//         if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", data: UserData }); }
//         else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
//     } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
// }];
// exports.UserUnderBlueZone = [async (req, res) => {
//     try {
//         let MinMemberData = await MinMemberModel.findOne({ IsActive: true, IsDeleted: false }).sort({ _id: -1 }).exec();
//         (MinMemberData) ? (MinimumMember = MinMemberData.TotalMember) : MinimumMember = 10;
//         let UserData = await UserModel.find({
//             UserType: { $nin: ['Main User'] },
//             $and: [{ TotalReferralCount: { $ne: 0 } }, { TotalReferralCount: { $lt: MinimumMember } }],
//             PlanStatus: 'Working', RegistrationStatus: 'Success', IsActive: true, IsDeleted: false
//         }, '-IsActive -IsDeleted -Password -StartDate -EndDate -UserType -CreatedDate -__v').sort({ '_id': -1 }).exec();
//         if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", data: UserData }); }
//         else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
//     } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
// }];
// exports.UserUnderRedZone = [async (req, res) => {
//     try {
//         let UserData = await UserModel.find({ UserType: { $nin: ['Main User'] }, PlanStatus: 'Pending', RegistrationStatus: 'Pending', TotalReferralCount: 0, IsActive: true, IsDeleted: false },
//             '-IsActive -IsDeleted -Password -StartDate -EndDate -UserType -CreatedDate -__v').sort({ '_id': -1 }).exec();
//         if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", data: UserData }); }
//         else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null }); }
//     } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
// }];
//Last Change 04-06-2022
// exports.UserMyMember = [async (req, res) => {
//     try {
//         if (!req.body.UserID) { res.json({ status: 0, Message: 'Please Enter Your User ID!', data: null }); }
//         else {
//             let UserData = await UserModel.findOne({
//                 _id: req.body.UserID,
//                 RegistrationStatus: "Success",
//                 IsActive: true,
//                 IsDeleted: false,
//                 UserType: { $nin: ['Main User'] }
//             }, 'Name MobileNo UserCode TotalReferralCount')
//                 .populate({
//                     path: 'RefUserDetail',
//                     select: 'SubUserID -MainUserID -_id',
//                     match: {
//                         IsMember: false,
//                         Type: { $nin: ['Debit'] }
//                     },
//                     options: { sort: { '_id': -1 } },
//                     populate: {
//                         path: 'SubUserID',
//                         select: 'Name MobileNo Email Address IDProof UserCode TotalReferralCount Date'
//                     }
//                 }).sort({ '_id': -1 }).exec();
//             if (UserData) {
//                 return res.status(200).json({ status: 1, Message: "Success.", data: UserData });
//             } else {
//                 return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
//             }
//         }
//     } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
// }];
// exports.GetWithdrawal1 = [async (req, res) => {
//     try {
//         const getPagination = (page, size) => {
//             const limit = size ? +size : 10; const offset = page ? page * limit : 0;
//             return { limit, offset };
//         };
//         const { page, size } = req.query;
//         const { limit, offset } = getPagination(page, size);
//         let obj = {};
//         obj['IsDeleted'] = false;
//         let Total = await UserWithdrawalRequestModel.countDocuments(obj).exec();
//         let UserData = await UserWithdrawalRequestModel.find(obj)
//             .populate('UserID', 'Name MobileNo').skip(offset).limit(limit).sort({ '_id': -1 }).exec();
//         let round = Math.round(Total / size);
//         if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: UserData, count: Total }); }
//         else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
//     } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
// }];
// exports.SearchWithdrawal = [async (req, res) => {
//     try {
//         const getPagination = (page, size) => {
//             const limit = size ? +size : 10; const offset = page ? page * limit : 0;
//             return { limit, offset };
//         };
//         const { page, size, Name, MobileNo } = req.query;
//         const { limit, offset } = getPagination(page, size);
//         let obj = {};
//         obj['IsDeleted'] = false;
//         if (!Name) {
//         }
//         let obj1 = {};
//         obj["UserID.Name"] = "Nikhil";
//         //User.name
//         //obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
//         //obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
//         let Total = await UserWithdrawalRequestModel.countDocuments(obj).exec();
//         let UserData = await UserWithdrawalRequestModel.find(obj)
//             .populate({ path: 'UserID', match: { Name: "Nikhil" } })
//             //.slice('UserID', -10)
//             //.select('-Name')
//             //.lean()
//             .skip(offset)
//             .limit(limit)
//             .sort({ '_id': -1 }).exec();
//         let round = Math.round(Total / size);
//         if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: UserData, count: Total }); }
//         else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
//     } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
// }];
// exports.AggeSearchWithdrawal = [async (req, res) => {
//     try {
//         const getPagination = (page, size) => {
//             const limit = size ? +size : 10; const offset = page ? page * limit : 0;
//             return { limit, offset };
//         };
//         const { page, size, Name, MobileNo } = req.query;
//         const { limit, offset } = getPagination(page, size);
//         let obj = {};
//         obj['Name'] = Name ? { $regex: new RegExp(Name), $options: "i" } : { $ne: null };
//         obj['MobileNo'] = MobileNo ? { $regex: new RegExp(MobileNo), $options: "i" } : { $ne: null };
//         await UserWithdrawalRequestModel.aggregate([
//             { $lookup: { from: 'User', localField: 'UserID', foreignField: '_id', as: 'user_docs' } }, { $match: { user_docs: { $elemMatch: obj } } }
//         ]).exec(async (err, ObjData) => {
//             if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
//             else {
//                 if (ObjData.length > 0) {
//                     await UserWithdrawalRequestModel.aggregate([
//                         { $lookup: { from: 'User', localField: 'UserID', foreignField: '_id', as: 'user_docs' } },
//                         { $sort: { _id: -1 } }, { $match: { user_docs: { $elemMatch: obj } } },
//                         { $skip: offset }, { $limit: limit }
//                     ]).exec(function (err, results) {
//                         if (err) { return res.status(200).json({ status: 0, Message: err.message, data: null }); }
//                         else {
//                             if (results.length > 0) {
//                                 let Total = ObjData.length;
//                                 let round = Math.ceil(Total / size);
//                                 return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, Data: results, count: Total });
//                             } else { return res.status(200).json({ status: 0, Message: 'Data Not Found!', data: null }); }
//                         }
//                     });
//                 } else { return res.status(200).json({ status: 0, Message: 'Data Not Found!', data: null }); }
//             }
//         });
//     } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
// }];