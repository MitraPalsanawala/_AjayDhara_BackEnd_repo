const moment = require('moment-timezone');
const { v4: uuidv4 } = require("uuid");
var multer = require("multer");
const DIR = "./public/uploads";
const testFolder = './public/uploads/Photo';
const fs = require('fs');
// var ip = require("ip");
const ErrorLogsModel = require("../models/ErrorLogsModel");
const AboutUsModel = require('../models/AboutUsModel');
const TeamMemberModel = require('../models/TeamMemberModel');
const ContactUsModel = require('../models/ContactUsModel');
const CertificateModel = require('../models/CertificateModel');
const GalleryModel = require('../models/GalleryModel');
const GalleryDetailModel = require('../models/GalleryDetailModel');
const DonationModel = require('../models/DonationModel');
const UserGalleryModel = require('../models/UserGalleryModel');
const BankDetailModel = require('../models/BankDetailModel');
const BannerModel = require('../models/BannerModel');
const BannerDetailModel = require('../models/BannerDetailModel');
const { dirname } = require('path');
let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const ImageError = "Only .png, .jpg and .jpeg format allowed!";
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, DIR); },
    filename: function (req, file, cb) { const fileName = file.originalname.toLowerCase().split(" ").join("-"); cb(null, uuidv4() + "-" + fileName); }
});
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) { req.fileValidationError = "Only image files are allowed!"; return cb(new Error(ImageError), false); }
    cb(null, true);
};
exports.GetContent = [async (req, res) => {
    try {
        let view = {
            "agreement_1": [
                {
                    "language": "hindi",
                    "data": `सादर नमस्कार
                    में अजय डी दूबे आप लोगों के साथ इस संस्था के माध्यम से जुड़ कर अपार हर्ष का अनुभव कर रहा हूँ मित्रों इस संस्था को शुरू करने का विचार मेरे मन में अकारण ही नहीं आया मै विगत कई वर्षों से सोशल मिडिया से जुड़ा हुआ हूँ! 
                    
                    जैसा की आप भी होंगे कुछ समय पूर्व मै एक वैश्विक संस्था का सशोल मिडिया पर अध्यनन पढ़ रहा था जिसमे बताया गया था कि जो लोग सोशल मिडिया पर अधिक समय व्यतीत करते हैं वे अधिक निराश और दुखी रहते हैं उन लोगों की अपेक्षा जो की सोशल मिडिया का प्रयोग नहीं करते हैं इस तथ्य का परीक्षण करने का निश्चय मैंने किया ध्यान से देखने पर इस बात का पता चला की सोशल मिडिया पर तमाम प्रकार के विचार लगातार चलते रहते हैं!
                    
                    जिसमे सकारात्मक एवं नकारात्मक दोनों प्रकार के होते हैं! मित्रों लम्बे समय तक नजर रखने पर मैंने पाया की नकारात्मक पोस्ट पर लोग अधिक प्रतिक्रिया देते हैं जब की सकारात्मक पोस्ट को कम ऐसा क्यों ये प्रश्न मुझे लगातार सोचने पर विवश करता रहा है नकारात्मकता के इस बीमारी से बचना इतना सरल नहीं है जितना दिखाई देता है
                    
                    नकारात्मक सोच (NEGATIVE THOUGHT) को एक बीमारी ही मानता हूँ ऐसी मानसिक बीमारी जो दीमक की तरह अन्दर ही अन्दर व्यक्ति को खोखला कर देती है सबसे बुरी बात तो ये है की बहुत से लोगों को इस बात का पता भी नहीं होता की हमारी नकारात्मक सोच ही हमारी सबसे बड़ी शत्रु है जो की हमें सफल होने से रोकती है! और आत्मविश्वाश को कमजोर कर देती है जिस काम को हम आसानी से कर सकते हैं वह आत्मविश्वाश की कमी एवं डर के वजह से बहुत ही बड़ी एवं मुश्किल लगती है!
                                       
                    दोस्तों नकारात्मक सोच हमारे मन मस्तिस्क का वह रोग है जो कभी भी हमें सुखी जीवन जीने नहीं देता है इस बीमारी की एक मात्र दवा है जिसका नाम है ” सकारात्मक सोच (POSITIVE THOUGHT) इस लिए इस ब्लॉग के माध्यम से मै आप लोगो से इस बात की चर्चा करूँगा की हम किस प्रकार से अपने नकारात्मक सोच को सकारात्मक सोच में परिवर्तित कर सकते हैं एवं और किस प्रकार से अपने भीतर सकारात्मक बदलाव करके अपने को अधिक मूल्यवान और सफल बना सकते हैं!
                    
                    विश्वास आत्मविश्वास ही वह सोई हुई शक्ति है जिसने मानव को धरती से अंतरिक्ष तक विजेता बनाया है बात-बात पर डरने वाले मानव मन ने जब भी निडर हो कर किसी लक्ष्य की साधना की है तो एक नये इतिहास का जन्म हुआ है ” डर या भय “ हमारे मन के नकारात्मक भावनाओं की अनियंत्रित कल्पना ही तो है ” डर ” आत्मविश्वास का परम शत्रु है डर पर जीत हासिल करने का और आत्मविश्वास अर्जित करने का एक मात्र उपाय ” सकारात्मक विचार “ही हैं!
                    
                    क्योंकि मानव विचारों से निर्मित प्राणी है जिसके जैसे विचार उसकी वैसी भावनाएं नकारात्मक विचार नकारात्मक भावनाओं को जन्म देती हैं एवं नकारात्मक भावनाएं नकारात्मक क्रियाओं को अतः सकारात्मक सोच के साथ किया गया कार्य व्यक्ति के भीतर सकारात्मक ऊर्जा का निर्माण करता है जिससे आत्मविश्वाश में वृद्धि होती है अतः परिस्थितियां कुछ भी हों स्वयं को सकारात्मक रखना चाहिए विश्वास ,दृढ विश्वास , मस्तिष्क को प्रेरित करता है!`
                },
                {
                    "language": "english",
                    "data": "Welcome to Ajay Dhara Foundation, You Have Been Associated With The Goal of Social Service, All The Rules Given By The Office Bearers of The Irganization Will be Valid, If You Do Any Work Against The Organization, Then Your Membership Will be Canceled, If You Disagree With Anything, Then By Sitting With The Officials, Its Solutions Will Be Taken Out, Administrative Rules Will Not Apply!"
                },
                {
                    "language": "gujarati",
                    "data": "અજય ધારા ફાઉન્ડેશન (એનજીઓ) એ નોંધણી અધિનિયમ 1860 અને બોમ્બે પબ્લિક ટ્રસ્ટ એક્ટ 1950 હેઠળ સ્થાપિત બિન-સરકારી સંસ્થા (એનજીઓ) છે. સંસ્થા (એનજીઓ) નો મુખ્ય ઉદ્દેશ્ય મજૂર વર્ગના લોકો સાથે એક ટીમ બનાવવાનો અને વંચિત લોકો અને તેમના પરિવારોને તેમની સારી આવક, આરોગ્ય, રોજગાર, ઘર, શિક્ષણ પર વિવિધ સરકારી અને અર્ધ-સરકારી પ્રોજેક્ટ્સ દ્વારા લાભ આપવાનો છે. , આજીવિકા, મહિલા સશક્તિકરણ. અન્ય સામાજિક મુદ્દાઓ પર નિઃસ્વાર્થ બૌદ્ધિક અને મૌખિક સેવાઓ પ્રદાન કરવા."
                }
            ]
        }
        return res.status(200).json({ status: 1, Message: "Success.", data: view });
    } catch (err) { return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
//----------------------------------AboutUs----------------------------------------//
exports.AboutUsAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.Title) { res.json({ status: 0, Message: 'Please Enter Your Title!', data: null }); }
                else if (!req.body.Description) { res.json({ status: 0, Message: 'Please Enter Your Description!', data: null }); }
                else if (!req.file) { return res.json({ status: 0, Message: "Please Upload Image!", data: null }); }
                else {
                    await new AboutUsModel({
                        Title: req.body.Title, Description: req.body.Description,
                        Image: req.file.filename, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                    }).save();
                    return res.status(200).json({ status: 1, Message: "AboutUs Added Successfully.", data: null });
                }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AboutUsGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let Total = await AboutUsModel.countDocuments({}).exec();
        let UserData = await AboutUsModel.find({}).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, data: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AboutUsGetAPP = [async (req, res) => {
    try {
        let Result = await AboutUsModel.findOne({}, '-EntryDate -__v').lean().sort({ '_id': -1 }).exec();
        let Team = await TeamMemberModel.find({}, '-EntryDate -__v').sort({ '_id': -1 }).exec();
        let Certificate = await CertificateModel.find({}, '-EntryDate -__v').sort({ '_id': -1 }).exec();
        Result["TeamData"] = Team;
        Result["CertificateData"] = Certificate;
        return res.status(200).json({ status: 1, Message: "Data Not Found.", data: Result });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AboutUsFindByID = [async (req, res) => {
    try {
        if (!req.body.ID) { res.send({ status: 0, Message: "Please Enter Your AboutUs ID!", data: null }); }
        else {
            let Result = await AboutUsModel.findOne({ _id: req.body.ID }).exec();
            if (Result) {
                return res.status(200).json({ status: 1, Message: "Success.", data: Result });
            } else {
                return res.status(200).json({ status: 1, Message: "Data Not Found", data: null });
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AboutUsUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.CID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                else if (!req.body.Title) { res.json({ status: 0, Message: 'Please Enter Your Title!', data: null }); }
                else if (!req.body.Description) { res.json({ status: 0, Message: 'Please Enter Your Description!', data: null }); }
                else {
                    var UpdateData = {};
                    UpdateData["Title"] = req.body.Title;
                    UpdateData["Description"] = req.body.Description
                    if (req.file) { UpdateData["Image"] = req.file.filename }
                    await AboutUsModel.updateOne({ _id: req.body.CID }, UpdateData).exec();
                    return res.status(200).json({ status: 1, Message: "AboutUs Update Successfully.", data: null });
                }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.AboutUsDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { res.send({ status: 0, Message: "Please Enter Your About ID!", data: null }); }
        else {
            await AboutUsModel.findOneAndDelete({ _id: req.params.ID }).exec();
            return res.status(200).json({ status: 1, Message: "Delete Successfully.", data: null });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
//----------------------------------Testimonial----------------------------------------//
exports.TeamMemberAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(200).json({ status: 0, Message: ImageError, data: "" }); }
            else {
                if (!req.body.Name) { return res.json({ status: 0, Message: 'Please Enter Your Name!', data: null }); }
                else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your MobileNo!', data: null }); }
                else if (!req.body.Designation) { return res.json({ status: 0, Message: 'Please Enter Your Designation!', data: null }); }
                else if (!req.body.Description) { return res.json({ status: 0, Message: 'Please Enter Your Description!', data: null }); }
                else if (!req.file) { return res.json({ status: 0, Message: "Please Upload Image!", data: null }); }
                else {
                    await new TeamMemberModel({
                        Name: req.body.Name, MobileNo: req.body.MobileNo, Designation: req.body.Designation,
                        Description: req.body.Description, Image: req.file.filename,
                        Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                    }).save();
                    return res.status(200).json({ status: 1, Message: "TeamMember Added Successfully.", data: null });
                }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.TeamMemberGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let Total = await TeamMemberModel.countDocuments({}).exec();
        let UserData = await TeamMemberModel.find({}).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);
        if (UserData.length > 0) {
            return res.status(200).json({ status: 1, Message: "Success.", mypage: round, totalItems: Total, totalPages: round, data: UserData, count: Total });
        } else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.TeamMemberBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let Result = await TeamMemberModel.findOne({ _id: req.body.ID }).exec();
            if (Result) { return res.status(200).json({ status: 1, Message: "Success.", data: Result }); }
            else { return res.status(200).json({ status: 1, Message: "Data Not Found", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.TeamMemberUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.CID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                else if (!req.body.Name) { res.json({ status: 0, Message: 'Please Enter Your Name!', data: null }); }
                else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your MobileNo!', data: null }); }
                else if (!req.body.Designation) { res.json({ status: 0, Message: 'Please Enter Your Designation!', data: null }); }
                else if (!req.body.Description) { res.json({ status: 0, Message: 'Please Enter Your Description!', data: null }); }
                else {
                    var UpdateData = {};
                    UpdateData["Name"] = req.body.Name;
                    UpdateData["MobileNo"] = req.body.MobileNo;
                    UpdateData["Designation"] = req.body.Designation;
                    UpdateData["Description"] = req.body.Description;
                    if (req.file) { UpdateData["Image"] = req.file.filename }
                    await TeamMemberModel.updateOne({ _id: req.body.CID }, UpdateData).exec();
                    return res.status(200).json({ status: 1, Message: "TeamMember Update Successfully.", data: null });
                }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.TeamMemberDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { res.send({ status: 0, Message: "Please Enter Your TeamMember ID!", data: null }); }
        else {
            await TeamMemberModel.deleteOne({ _id: req.params.ID }).exec();
            return res.status(200).json({ status: 1, Message: "Delete Successfully.", data: null });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
//----------------------------------Contact Us----------------------------------------//
exports.AddContactData = [async (req, res) => {
    try {
        if (!req.body.OfficeAddress) { res.json({ status: 0, Message: 'Please Enter Your Office Address!', Data: null }); }
        else if (!req.body.MobileNumber) { res.json({ status: 0, Message: 'Please Enter Your Mobile Number!', Data: null }); }
        else if (!req.body.EmailAddress) { res.json({ status: 0, Message: 'Please Enter Your Email Address!', Data: null }); }
        else if (!req.body.EmailAddress.match(regexEmail)) { res.json({ status: 0, Message: 'Please Enter Your Valid Email!', Data: null }); }
        else {
            var ContactModelDetails = new ContactUsModel({
                OfficeAddress: req.body.OfficeAddress, AltOfficeAddress: ((req.body.AltOfficeAddress) ? (req.body.AltOfficeAddress) : ''),
                MobileNumber: req.body.MobileNumber, AltMobileNumber: ((req.body.AltMobileNumber) ? (req.body.AltMobileNumber) : ''),
                EmailAddress: req.body.EmailAddress, AltEmailAddress: ((req.body.AltEmailAddress) ? (req.body.AltEmailAddress) : ''),
                Instagram: ((req.body.Instagram) ? (req.body.Instagram) : ''), Facebook: ((req.body.Facebook) ? (req.body.Facebook) : ''),
                Twitter: ((req.body.Twitter) ? (req.body.Twitter) : ''), Youtube: ((req.body.Youtube) ? (req.body.Youtube) : ''),
                Website: ((req.body.Website) ? (req.body.Website) : ''), WhatsApp: ((req.body.WhatsApp) ? (req.body.WhatsApp) : ''),
                Date: moment().format("YYYY-MM-DDTHH:mm:ss")
            });
            await ContactModelDetails.save();
            res.json({ status: 1, Message: 'Contact Details Successfully Inserted.', Data: null });
        }
    } catch (err) { save(req, err.message); return res.json({ status: 0, Message: err.message, Data: null }); }
}];
exports.GetContactData = [async (req, res) => {
    try {
        let contactDS = await ContactUsModel.findOne().exec();
        if (contactDS) {
            res.json({ status: 1, Message: 'Success.', Data: contactDS });
        } else {
            res.json({ status: 0, Message: 'Data Not Found.', Data: null });
        }
    } catch (err) { save(req, err.message); return res.json({ status: 0, Message: err.message, Data: null }); }
}];
exports.EditContactData = [async (req, res) => {
    try {
        if (!req.body.currentId) { res.json({ status: 0, Message: 'Please Enter Your Curent ID!', Data: null }); }
        else if (!req.body.OfficeAddress) { res.json({ status: 0, Message: 'Please Enter Your Office Address!', Data: null }); }
        else if (!req.body.MobileNumber) { res.json({ status: 0, Message: 'Please Enter Your Mobile Number!', Data: null }); }
        else if (!req.body.EmailAddress) { res.json({ status: 0, Message: 'Please Enter Your Email Address!', Data: null }); }
        else if (!req.body.EmailAddress.match(regexEmail)) { res.json({ status: 0, Message: 'Please Enter Your Valid Email!', Data: null }); }
        else {
            var ObjEdit = {};
            ObjEdit["OfficeAddress"] = req.body.OfficeAddress; ObjEdit["AltOfficeAddress"] = ((req.body.AltOfficeAddress) ? (req.body.AltOfficeAddress) : '');
            ObjEdit["MobileNumber"] = req.body.MobileNumber; ObjEdit["AltMobileNumber"] = ((req.body.AltMobileNumber) ? (req.body.AltMobileNumber) : '');
            ObjEdit["EmailAddress"] = req.body.EmailAddress; ObjEdit["AltEmailAddress"] = ((req.body.AltEmailAddress) ? (req.body.AltEmailAddress) : '');
            ObjEdit["Instagram"] = ((req.body.Instagram) ? (req.body.Instagram) : ''); ObjEdit["Facebook"] = ((req.body.Facebook) ? (req.body.Facebook) : '');
            ObjEdit["Twitter"] = ((req.body.Twitter) ? (req.body.Twitter) : ''); ObjEdit["Youtube"] = ((req.body.Youtube) ? (req.body.Youtube) : '');
            ObjEdit["Website"] = ((req.body.Website) ? (req.body.Website) : ''); ObjEdit["WhatsApp"] = ((req.body.WhatsApp) ? (req.body.WhatsApp) : '');
            await ContactUsModel.updateOne({ _id: req.body.currentId }, ObjEdit).exec();
            res.json({ status: 1, Message: 'Contact Details Successfully Updated.', Data: null });
        }
    } catch (err) { save(req, err.message); return res.json({ status: 0, Message: err.message, Data: null }); }
}];
//----------------------------------Certificate -------------------------------------//
exports.CertificateAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(200).json({ status: 0, Message: ImageError, data: "" }); }
            else {
                if (!req.body.Title) { return res.json({ status: 0, Message: 'Please Enter Your Title!', data: null }); }
                else if (!req.file) { return res.json({ status: 0, Message: "Please Upload Image!", data: null }); }
                else {
                    await new CertificateModel({
                        Title: req.body.Title, Description: (req.body.Description) ? (req.body.Description) : (''),
                        Image: req.file.filename, Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                    }).save();
                    return res.status(200).json({ status: 1, Message: "Certificate Added Successfully.", data: null });
                }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.CertificateGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let Total = await CertificateModel.countDocuments({}).exec();
        let UserData = await CertificateModel.find({}).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);
        if (UserData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, data: UserData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.CertificateBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let Result = await CertificateModel.findOne({ _id: req.body.ID }).exec();
            if (Result) { return res.status(200).json({ status: 1, Message: "Success.", data: Result }); }
            else { return res.status(200).json({ status: 1, Message: "Data Not Found", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.CertificateUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.CID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                else if (!req.body.Title) { res.json({ status: 0, Message: 'Please Enter Your Title!', data: null }); }
                else {
                    var UpdateData = {};
                    UpdateData["Name"] = req.body.Name;
                    UpdateData["Description"] = (req.body.Description) ? (req.body.Description) : ('');
                    if (req.file) { UpdateData["Image"] = req.file.filename }
                    await CertificateModel.updateOne({ _id: req.body.CID }, UpdateData).exec();
                    return res.status(200).json({ status: 1, Message: "Certificate Update Successfully.", data: null });
                }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.CertificateDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { res.send({ status: 0, Message: "Please Enter Your Certificate ID!", data: null }); }
        else {
            await CertificateModel.deleteOne({ _id: req.params.ID }).exec();
            return res.status(200).json({ status: 1, Message: "Delete Successfully.", data: null });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
// exports.GetImagePath = [async (req, res) => {
//     try {
//         var data = fs.readdirSync(DIR)
//         console.log(data)
//         var ip = require("ip");
//         //var prefix = "http://" + ip.address() + ':4242/uploads/'
//         var prefix = "http://ajaydharafoundation.com:4242/uploads/"
//         //var prefix = "./uploads" + '/localhost:4242/'
//         var data_ = []
//         if (data.length > 0) {
//             for (var i = 0; i < data.length; i++) {
//                 data_[i] = prefix + data[i]
//             }
//         }
//         res.send({
//             file: data_
//         })
//     } catch (err) {
//         save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
//     }
// }]
exports.GetImagePath = [async (req, res) => {
    try {
        var data = fs.readdirSync(testFolder)
        console.log(data)
        var ip = require("ip");
        //var prefix = "http://" + ip.address() + ':4242/uploads/Photo/'
        var prefix = "http://ajaydharafoundation.com:4242/uploads/Photo/";
        //var prefix = "./uploads" + '/localhost:4242/'
        var data_ = []
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                data_.push(prefix + data[i]);
            }
        }
        var Result = [];
        data.forEach(async (doc) => {
            Result.push({
                Image: doc
            });
        });

        res.json({ status: 1, Message: 'Success', data: Result });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

exports.GalleryAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).array('Image', 5)
        upload(req, res, async (err) => {
            if (err) {
                return res.status(200).json({ status: 0, Message: 'Five Or More Image Could Not Added!', data: "" })
            } else if (req.fileValidationError) {
                return res.status(500).json({ status: 0, Message: ImageError, data: "" });
            } else {
                if (!req.body.Title) { res.json({ status: 0, Message: "Please Enter Your Title!", data: null }); }
                else {
                    console.log("====req.body==", req.body)
                    let GalleryMaster = await new GalleryModel({
                        Title: req.body.Title,
                    }).save();
                    req.files.forEach(async (doc) => {
                        await new GalleryDetailModel({ Image: doc.filename, GalleryID: GalleryMaster._id }).save();
                    });
                    return res.status(200).json({ status: 1, Message: "Gallery Add Successfully.", data: null });
                }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.GalleryGet2 = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);

        let Total = await GalleryModel.countDocuments({}).exec();
        // let UserData = await GalleryModel.find({}).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);

        let gallerydata = await GalleryModel.find({})
            .populate({ path: 'Gallery_Detail', select: '_id GalleryID Image' }).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        if (gallerydata.length > 0) {
            var GetAllImage = [];
            gallerydata.forEach((doc) => {
                var ImageData = [];
                doc.Gallery_Detail.forEach((cb) => { ImageData.push(cb.Image) });
                GetAllImage.push({
                    _id: doc._id,
                    Title: doc.Title,
                    Image: ImageData,
                });
            });
            return res.status(200).json({ status: 1, Message: "Success..", data: GetAllImage, totalItems: Total, totalPages: round, count: Total });
        } else {
            return res.status(200).json({ status: 0, Message: "Success..", data: [], count: Total });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.GalleryUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).array('Image', 5);
        upload(req, res, async (err) => {
            // console.log("fdhfgd", req.body);
            // console.log("fdhfgd", req.file);
            if (err) {
                return res.status(200).json({ status: 0, Message: 'Five Or More Image Could Not Added!', data: "" })
            } else if (req.fileValidationError) {
                return res.status(500).json({ status: 0, Message: ImageError, data: "" });
            } else {
                if (!req.body.CID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                else if (!req.body.Title) { res.json({ status: 0, Message: 'Please Enter Your Title!', data: null }); }
                var UpdateData = {};
                UpdateData["Title"] = req.body.Title ? req.body.Title : '';
                await GalleryModel.updateOne({ _id: req.body.CID }, UpdateData).exec();
                getdata = await GalleryModel.findOne({ _id: req.body.CID })
                    .populate({ path: 'Gallery_Detail', select: '_id GalleryID Image' }).exec();

                var NewImage = req.files.length;
                var OldImage = getdata.Gallery_Detail.length;
                var lblImage = NewImage + OldImage
                console.log("===lbl===", lblImage)
                // if (req.files.length > 0) {
                if (req.files.length > 0) {
                    if (lblImage > 5) {
                        console.log("--12---", lblImage)
                        return res.status(200).json({ status: 0, Message: 'Five or more Image could not Added!', data: "" })
                    } else {
                        console.log("--2555---", lblImage)
                        req.files.forEach(async (doc) => {
                            await new GalleryDetailModel({ Image: doc.filename, GalleryID: req.body.CID }).save();
                        });
                    }
                    // await GalleryDetailModel.deleteMany({ GalleryID: req.body.CID }).exec();
                    // req.files.forEach(async (doc) => {
                    //     await new GalleryDetailModel({ Image: doc.filename, GalleryID: req.body.CID }).save();
                    // });
                    return res.status(200).json({ status: 1, Message: "Gallery Successfully Updated.", data: null });
                } else {
                    return res.status(200).json({ status: 1, Message: "Gallery Successfully Updated.", data: null });

                }
                //  }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.GalleryUpdate1 = [
    async (req, res) => {
        try {
            let upload = multer({ storage: storage, fileFilter: imageFilter }).array(
                "Images",
                5
            );
            upload(req, res, async (err) => {
                if (req.fileValidationError) {
                    return res
                        .status(200)
                        .json({ status: 0, Message: ImageError, data: "" });
                } else {
                    if (!req.body.Title) {
                        res.json({
                            status: 0,
                            Message: "Please Enter Your Title!",
                            data: null,
                        });
                    } else {
                        var Updatedata = {};
                        Updatedata["Title"] = req.body.Title;
                        await GalleryModel.updateOne(
                            { _id: req.body.CID },
                            Updatedata
                        ).exec();
                        if (req.files.length > 0) {
                            await GalleryDetailModel.deleteMany({
                                GalleryID: req.body.CID,
                            }).exec();
                            req.files.forEach(async (doc) => {
                                await new GalleryDetailModel({
                                    Image: doc.filename,
                                    GalleryID: req.body.CID,
                                }).save();
                            });
                            return res.status(200).json({
                                status: 1,
                                Message: "Gallery Successfully Updated.",
                                data: null,
                            });
                        } else {
                            return res.status(200).json({
                                status: 1,
                                Message: "Gallery Successfully Updated.",
                                data: null,
                            });
                        }
                    }
                }
            });
        } catch (err) {
            save(req, err.message);
            return res
                .status(500)
                .json({ status: 0, Message: err.message, data: null });
        }
    },
];
exports.GalleryEdit = [async (req, res) => {
    try {
        if (!req.body.ID) { res.send({ status: 0, Message: "Please Enter Your Gallery ID!", data: null }); }
        else {
            let gallerydetails = await GalleryModel.findOne({ _id: req.body.ID }).populate({ path: 'Gallery_Detail', select: '-_id GalleryID Image' }).exec();
            return res.status(200).json({ status: 1, Message: "Success.", data: gallerydetails });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.GalleryDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { res.send({ status: 0, Message: "Please Enter Your Gallery ID!", data: null }); }
        else {
            await GalleryModel.findOneAndDelete({ _id: req.params.ID }).exec();
            await GalleryDetailModel.deleteMany({ GalleryID: req.params.ID }).exec();
            return res.status(200).json({ status: 1, Message: "Gallery Details Successfully Deleted.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DeleteImage1 = [async (req, res) => {
    try {
        if (!req.params.ID) { res.send({ status: 0, Message: "Please Enter Your Gallery ID!", data: null }); }
        else {
            await GalleryDetailModel.findOneAndDelete({ _id: req.body.GalleryID }).exec();
            return res.status(200).json({ status: 1, Message: "Gallery Details Successfully Deleted.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

// exports.DeleteImage = [async (req, res) => {
//     try {
//         console.log('=====asasasasasas======', req.body);
//         var UpdateData = {};
//         UpdateData[req.body.ImageName] = ""
//         detaildata = await GalleryDetailModel.findOneAndDelete({ Image: req.body.Image }).exec();
//         AllData = await GalleryModel.updateOne({ _id: req.body.GalleryID }, UpdateData).exec();
//         console.log('=====Alldata=====', AllData);
//         return res.status(200).json({ status: 1, Message: "Successfully Deleted.", data: null });
//     } catch (err) {
//         save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
//     }
// }];

exports.DeleteGalleryPhoto = [async (req, res) => {
    try {
        if (!req.params.ID) {
            res.send({ status: 0, Message: "Please Enter Your Gallery ID!", data: null });
        } else {
            await GalleryDetailModel.findOneAndDelete({
                _id: req.params.ID,
            }).exec();
            return res.status(200).json({ status: 1, Message: "Image Successfully Deleted.", data: null });
        }
    } catch (err) {
        save(req, err.message);
        return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
},
];

exports.GalleryGet = [
    async (req, res) => {
        try {
            const getPagination = (page, size) => {
                const limit = size ? +size : 5;
                const offset = page ? page * limit : 0;
                return { limit, offset };
            };
            const { page, size } = req.body;
            const { limit, offset } = getPagination(page, size);
            let Total = await GalleryModel.countDocuments({}).exec();
            let UserData = await GalleryModel.find({})
                .populate({ path: "Gallery_Detail", select: "Image _id -GalleryID" })
                .skip(offset)
                .limit(limit)
                .sort({ _id: -1 })
                .exec();
            let round = Total === 0 ? 0 : Math.ceil(Total / size);
            if (UserData.length > 0) {
                return res.status(200).json({
                    status: 1,
                    Message: "Success.",
                    totalItems: Total,
                    totalPages: round,
                    data: UserData,
                    count: Total,
                });
            } else {
                return res.status(200).json({
                    status: 0,
                    Message: "Data Not Found.",
                    totalItems: Total,
                    totalPages: round,
                    data: null,
                    count: Total,
                });
            }
        } catch (err) {
            save(req, err.message);
            return res
                .status(500)
                .json({ status: 0, Message: err.message, data: null });
        }
    },
];

exports.DonationAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(200).json({ status: 0, Message: ImageError, data: "" }); }
            else {
                if (!req.body.Name) { return res.json({ status: 0, Message: 'Please Enter Your Name!', data: null }); }
                else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your MobileNo!', data: null }); }
                else if (!req.body.Address) { return res.json({ status: 0, Message: 'Please Enter Your Address!', data: null }); }
                else if (!req.body.Amount) { return res.json({ status: 0, Message: 'Please Enter Your Amount!', data: null }); }
                else if (!req.file) { return res.json({ status: 0, Message: "Please Upload Image!", data: null }); }
                else {
                    await new DonationModel({
                        Name: req.body.Name,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address,
                        Amount: req.body.Amount,
                        Image: req.file.filename,
                        Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                    }).save();
                    return res.status(200).json({ status: 1, Message: "Donation Added Successfully.", data: null });
                }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DonationGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let Total = await DonationModel.countDocuments({}).exec();
        let DonationData = await DonationModel.find({}).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);
        if (DonationData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, data: DonationData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.DonationBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let Result = await DonationModel.findOne({ _id: req.body.ID }).exec();
            if (Result) { return res.status(200).json({ status: 1, Message: "Success.", data: Result }); }
            else { return res.status(200).json({ status: 1, Message: "Data Not Found", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.DonationUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Image");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.CID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                else if (!req.body.Name) { return res.json({ status: 0, Message: 'Please Enter Your Name!', data: null }); }
                else if (!req.body.MobileNo) { return res.json({ status: 0, Message: 'Please Enter Your MobileNo!', data: null }); }
                else if (!req.body.Address) { return res.json({ status: 0, Message: 'Please Enter Your Address!', data: null }); }
                else if (!req.body.Amount) { return res.json({ status: 0, Message: 'Please Enter Your Amount!', data: null }); }
                // else if (!req.file) { return res.json({ status: 0, Message: "Please Upload Image!", data: null }); }
                else {
                    var UpdateData = {};
                    UpdateData["Name"] = req.body.Name;
                    UpdateData["MobileNo"] = req.body.MobileNo;
                    UpdateData["Address"] = req.body.Address;
                    UpdateData["Amount"] = req.body.Amount;
                    // UpdateData["Description"] = (req.body.Description) ? (req.body.Description) : ('');
                    if (req.file) { UpdateData["Image"] = req.file.filename }
                    await DonationModel.updateOne({ _id: req.body.CID }, UpdateData).exec();
                    return res.status(200).json({ status: 1, Message: "Donation Update Successfully.", data: null });
                }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.DonationDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { res.send({ status: 0, Message: "Please Enter Your Donation ID!", data: null }); }
        else {
            await DonationModel.deleteOne({ _id: req.params.ID }).exec();
            return res.status(200).json({ status: 1, Message: "Delete Successfully.", data: null });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];


exports.BankDetailAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("QRCodeImage");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(200).json({ status: 0, Message: ImageError, data: "" }); }
            else {
                if (!req.body.BankName) { return res.json({ status: 0, Message: 'Please Enter Your Bank Name!', data: null }); }
                else if (!req.body.AccountName) { return res.json({ status: 0, Message: 'Please Enter Your Account Name!', data: null }); }
                else if (!req.body.AccountNumber) { return res.json({ status: 0, Message: 'Please Enter Your Account Number!', data: null }); }
                else if (!req.body.IFSCCode) { return res.json({ status: 0, Message: 'Please Enter Your IFSCCode!', data: null }); }
                else if (!req.body.AccountHolderName) { return res.json({ status: 0, Message: 'Please Enter Your Account Holder Name!', data: null }); }
                else if (!req.file) { return res.json({ status: 0, Message: "Please Upload Image!", data: null }); }
                else {
                    await new BankDetailModel({
                        BankName: req.body.BankName,
                        AccountName: req.body.AccountName,
                        AccountNumber: req.body.AccountNumber,
                        IFSCCode: req.body.IFSCCode,
                        AccountHolderName: req.body.AccountHolderName,
                        QRCodeImage: req.file.filename,
                        Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                    }).save();
                    return res.status(200).json({ status: 1, Message: "Bank Detail Added Successfully.", data: null });
                }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.BankDetailGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5; const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let Total = await BankDetailModel.countDocuments({}).exec();
        let DonationData = await BankDetailModel.find({}).skip(offset).limit(limit).sort({ '_id': -1 }).exec();
        let round = Math.ceil(Total / size);
        if (DonationData.length > 0) { return res.status(200).json({ status: 1, Message: "Success.", totalItems: Total, totalPages: round, data: DonationData, count: Total }); }
        else { return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null, count: Total }); }

    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];
exports.BankDetailBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { res.send({ status: 0, Message: "Please Enter Your ID!", data: null }); }
        else {
            let Result = await BankDetailModel.findOne({ _id: req.body.ID }).exec();
            if (Result) { return res.status(200).json({ status: 1, Message: "Success.", data: Result }); }
            else { return res.status(200).json({ status: 1, Message: "Data Not Found", data: null }); }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.BankDetailUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("QRCodeImage");
        upload(req, res, async (err) => {
            if (req.fileValidationError) { return res.status(500).json({ status: 1, Message: ImageError, data: "" }); }
            else {
                if (!req.body.CID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                if (!req.body.BankName) { return res.json({ status: 0, Message: 'Please Enter Your Bank Name!', data: null }); }
                else if (!req.body.AccountName) { return res.json({ status: 0, Message: 'Please Enter Your Account Name!', data: null }); }
                else if (!req.body.AccountNumber) { return res.json({ status: 0, Message: 'Please Enter Your Account Number!', data: null }); }
                else if (!req.body.IFSCCode) { return res.json({ status: 0, Message: 'Please Enter Your IFSCCode!', data: null }); }
                else if (!req.body.AccountHolderName) { return res.json({ status: 0, Message: 'Please Enter Your Account Holder Name!', data: null }); }
                // else if (!req.file) { return res.json({ status: 0, Message: "Please Upload Image!", data: null }); }
                else {
                    var UpdateData = {};
                    UpdateData["BankName"] = req.body.BankName;
                    UpdateData["AccountName"] = req.body.AccountName;
                    UpdateData["AccountNumber"] = req.body.AccountNumber;
                    UpdateData["IFSCCode"] = req.body.IFSCCode;
                    UpdateData["AccountHolderName"] = req.body.AccountHolderName;
                    // UpdateData["Description"] = (req.body.Description) ? (req.body.Description) : ('');
                    if (req.file) { UpdateData["QRCodeImage"] = req.file.filename }
                    await BankDetailModel.updateOne({ _id: req.body.CID }, UpdateData).exec();
                    return res.status(200).json({ status: 1, Message: "Bank Detail Update Successfully.", data: null });
                }
            }
        });
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.BankDetailDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { res.send({ status: 0, Message: "Please Enter Your Donation ID!", data: null }); }
        else {
            await BankDetailModel.deleteOne({ _id: req.params.ID }).exec();
            return res.status(200).json({ status: 1, Message: "Delete Successfully.", data: null });
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];

exports.BannerAdd = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).array('Image', 5)
        upload(req, res, async (err) => {
            if (err) {
                return res.status(200).json({ status: 0, Message: 'Five Or More Image Could Not Added!', data: "" })
            } else if (req.fileValidationError) {
                return res.status(500).json({ status: 0, Message: ImageError, data: "" });
            } else {
                if (!req.body.Description) { res.json({ status: 0, Message: "Please Enter Your Description!", data: null }); }
                else {
                    console.log("====req.body==", req.body)
                    let BannerMaster = await new BannerModel({
                        Description: req.body.Description,
                    }).save();
                    req.files.forEach(async (doc) => {
                        await new BannerDetailModel({ Image: doc.filename, BannerID: BannerMaster._id }).save();
                    });
                    return res.status(200).json({ status: 1, Message: "Banner Add Successfully.", data: null });
                }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });

    }
}];
exports.BannerGet = [async (req, res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 5;
            const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        let Total = await BannerModel.countDocuments({}).exec();
        let UserData = await BannerModel.find({})
            .populate({ path: "Banner_Detail", select: "Image _id -BannerID" })
            .skip(offset)
            .limit(limit)
            .sort({ _id: -1 })
            .exec();
        console.log("====12121===", UserData)
        let round = Total === 0 ? 0 : Math.ceil(Total / size);
        if (UserData.length > 0) {
            return res.status(200).json({
                status: 1,
                Message: "Success.",
                totalItems: Total,
                totalPages: round,
                data: UserData,
                count: Total,
            });
        } else {
            return res.status(200).json({
                status: 0,
                Message: "Data Not Found.",
                totalItems: Total,
                totalPages: round,
                data: null,
                count: Total,
            });
        }
    } catch (err) {
        save(req, err.message);
        return res
            .status(500)
            .json({ status: 0, Message: err.message, data: null });
    }
},
];
exports.BannerBYID = [async (req, res) => {
    try {
        if (!req.body.ID) { res.send({ status: 0, Message: "Please Enter Your Banner ID!", data: null }); }
        else {
            let bannerdetails = await BannerModel.findOne({ _id: req.body.ID }).populate({ path: 'Banner_Detail', select: '-_id BannerID Image' }).exec();
            return res.status(200).json({ status: 1, Message: "Success.", data: bannerdetails });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });

    }
}];
exports.BannerUpdate = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).array('Image', 5);
        upload(req, res, async (err) => {
            if (err) {
                return res.status(200).json({ status: 0, Message: 'Five Or More Image Could Not Added!', data: "" })
            } else if (req.fileValidationError) {
                return res.status(500).json({ status: 0, Message: ImageError, data: "" });
            } else {
                if (!req.body.CID) { res.json({ status: 0, Message: 'Please Enter Your ID!', data: null }); }
                else if (!req.body.Description) { res.json({ status: 0, Message: 'Please Enter Your Description!', data: null }); }
                var UpdateData = {};
                UpdateData["Description"] = req.body.Description ? req.body.Description : '';
                await BannerModel.updateOne({ _id: req.body.CID }, UpdateData).exec();
                getdata = await BannerModel.findOne({ _id: req.body.CID })
                    .populate({ path: 'Banner_Detail', select: '_id BannerID Image' }).exec();
                var NewImage = req.files.length;
                var OldImage = getdata.Banner_Detail.length;
                var lblImage = NewImage + OldImage
                console.log("===lbl===", lblImage)
                // if (req.files.length > 0) {
                if (req.files.length > 0) {
                    if (lblImage > 5) {
                        console.log("--12---", lblImage)
                        return res.status(200).json({ status: 0, Message: 'Five or more Image could not Added!', data: "" })
                    } else {
                        console.log("--2555---", lblImage)
                        req.files.forEach(async (doc) => {
                            await new BannerDetailModel({ Image: doc.filename, BannerID: req.body.CID }).save();
                        });
                    }
                    return res.status(200).json({ status: 1, Message: "Banner Successfully Updated.", data: null });
                } else {
                    return res.status(200).json({ status: 1, Message: "Banner Successfully Updated.", data: null });

                }
                //  }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });

    }
}];
exports.BannerDelete = [async (req, res) => {
    try {
        if (!req.params.ID) { res.send({ status: 0, Message: "Please Enter Your Banner ID!", data: null }); }
        else {
            await BannerModel.findOneAndDelete({ _id: req.params.ID }).exec();
            await BannerDetailModel.deleteMany({ BannerID: req.params.ID }).exec();
            return res.status(200).json({ status: 1, Message: "Banner Details Successfully Deleted.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });

    }
}];
exports.DeleteBannerPhoto = [async (req, res) => {
    try {
        if (!req.params.ID) {
            res.send({ status: 0, Message: "Please Enter Your Banner ID!", data: null });
        } else {
            await BannerDetailModel.findOneAndDelete({
                _id: req.params.ID,
            }).exec();
            return res.status(200).json({ status: 1, Message: "Banner Image Successfully Deleted.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, Date: moment().format("YYYY-MM-DDTHH:mm:ss"), RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}