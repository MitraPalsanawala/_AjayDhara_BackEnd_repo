const CryptoJS = require("crypto-js");
const PanelUserModel = require("../Models/PanelUserModel");
const ErrorLogsModel = require("../models/ErrorLogsModel");
exports.GetUserLogin = [async (req, res) => {
    try {
        res.clearCookie("admindata");
        res.render('./PanelUser/Splash', { alertMessage: '', alertTitle: '' });
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.UserLogin = [async (req, res) => {
    try {
        if (!req.body.UserName) { return res.json({ status: 0, Message: 'Please Enter User Name!', data: null }); }
        else if (!req.body.Password) { return res.json({ status: 0, Message: 'Please Enter Password!', data: null }); }
        else {
            let admindata = await PanelUserModel.findOne({ UserName: req.body.UserName }).exec();
            if (admindata) {
                var bytes = CryptoJS.AES.decrypt(admindata.Password, 'SFVSFB@%#$%^5454@Q$%$@#').toString(CryptoJS.enc.Utf8);
                if (bytes === req.body.Password) {
                    let adminuser = { ID: admindata.id, UserName: admindata.UserName, Name: admindata.Name, UserType: admindata.UserType }
                    res.cookie("admindata", adminuser, { maxAge: 1000 * 3600 });
                    return res.status(200).json({ status: 0, Message: "Please Enter Correct UserName!", data: adminuser });
                } else {
                    res.clearCookie("admindata");
                    return res.status(200).json({ status: 0, Message: "Please Enter Correct Password!", data: null });
                }
            } else { return res.status(200).json({ status: 0, Message: "Please Enter Correct UserName!", data: null }); }
        }
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
exports.GetUserLogout = [async (req, res) => {
    try {
        res.clearCookie("admindata");
        res.redirect('./Splash');
    } catch (err) { save(req, res.Message); return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, Date: moment().format("YYYY-MM-DDTHH:mm:ss"), RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}