const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const moment = require('moment-timezone');
const PanelUserModel = require("../Models/PanelUserModel");
const AuthTokenModel = require("../models/AuthTokenModel");
const ErrorLogsModel = require("../models/ErrorLogsModel");
//let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
exports.SystemRegister = [async (req, res) => {
    try {
        if (!req.body.UserName) { return res.json({ status: 0, Message: "Please Enter Your Username!", data: null }); }
        else if (!req.body.Password) { return res.json({ status: 0, Message: "Please Enter Your Password!", data: null }); }
        else {
            let user = await PanelUserModel.findOne({ UserName: req.body.UserName }).exec();
            if (user) { return res.status(200).json({ status: 0, Message: "Username Already Exit!", data: null }); }
            else {
                var ciphertext = CryptoJS.AES.encrypt(req.body.Password, process.env.PASSWORD_SECRET).toString();
                let user = await new PanelUserModel({ UserName: req.body.UserName, CodeBook: req.body.Password, Password: ciphertext, Date: moment().format('DD-MM-YYYYTHH:mm:ss') }).save();
                return res.status(200).json({ status: 1, Message: "User Register Success.", data: user });
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.SystemLogin = [async (req, res) => {
    try {
        if (!req.body.UserName) { return res.json({ status: 0, Message: "Please Enter Username", data: null }); }
        else if (!req.body.Password) { return res.json({ status: 0, Message: "Please Enter Password", data: null }); }
        else {
            let user = await PanelUserModel.findOne({ UserName: req.body.UserName }).exec();
            if (!user) { return res.status(200).json({ status: 0, Message: "Please Enter Your Correct Username!", data: null }); }
            else {
                var bytes = CryptoJS.AES.decrypt(user.Password, process.env.PASSWORD_SECRET);
                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                if (originalText === req.body.Password) {
                    let Usertoken = await AuthTokenModel.findOne({ UserID: user._id }).exec();
                    if (Usertoken) {
                        await AuthTokenModel.updateOne({ _id: Usertoken._id }, { DeviceToken: (req.body.DeviceID) ? (req.body.DeviceID) : '' }).exec();
                        return res.status(200).json({ status: 1, Message: "Login Success.", data: user, token: Usertoken.Token });
                    } else {
                        let userData = { _id: user._id, Date: moment(new Date()).format('DD-MM-YYYYTHH:mm:ss') };
                        const jwtPayload = userData;//Prepare JWT token for authentication
                        const jwtData = { expiresIn: process.env.JWT_TIMEOUT_DURATION };
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign(jwtPayload, secret, jwtData);//Generated JWT token with Payload and secret.
                        await AuthTokenModel.create({
                            Token: token,
                            DeviceToken: (req.body.DeviceID) ? (req.body.DeviceID) : '',
                            UserID: user._id,
                            DeviceType: "",
                            Date: moment().format("YYYY-MM-DDTHH:mm:ss")
                        });
                        return res.status(200).json({ status: 1, Message: "Login Success.", data: user, token: token });
                    }
                } else { return res.status(200).send({ status: 0, Message: "Please Enter Your Correct Password!", data: null }); }
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.Logout = [async (req, res) => {
    try {
        if (!req.body.UserID) { return res.json({ status: 0, Message: "Please Enter User ID", data: null }); }
        else if (!req.body.DeviceID) { return res.json({ status: 0, Message: "Please Enter Your DeviceID", data: null }); }
        else {
            let Usertoken = await AuthTokenModel.findOne({ UserID: req.body.UserID, DeviceToken: req.body.DeviceID, Is_Loggedout: 0 }).exec();
            if (Usertoken) {
                await AuthTokenModel.updateOne({ _id: Usertoken._id }, { Is_Loggedout: 1 }).exec();
                return res.status(200).json({ status: 1, Message: "Logout Success.", data: null });
            } else {
                return res.status(200).json({ status: 1, Message: "Data Not Found.", data: null });
            }
        }
    } catch (err) { save(req, err.message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, Date: moment().format("YYYY-MM-DDTHH:mm:ss"), RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}