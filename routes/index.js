var express = require("express");
var router = express.Router();
const AuthController = require("../controllers/AuthController");
const MasterController = require('../controllers/MasterController');
const OtherController = require("../controllers/OtherController");
const WebsiteController = require("../controllers/WebsiteController");
const UserAPIController = require('../controllers/UserAPIController');
router.get("/", (req, res) => {
    return res.render("index", { title: "Hi there, Welcome to Atal Ekta Foundation API (Using Node.js, Express, And MongoDB)." });
});
router.get("/GetContent", WebsiteController.GetContent);
router.get("/PrivacyAndPolicy", (req, res) => { res.render('PrivacyAndPolicy'); });
//-------------------------------Admin API --------------------------------08/04/2022--Vivek Mistry
router.post("/SystemRegister", AuthController.SystemRegister);
router.post("/SystemLogin", AuthController.SystemLogin);
//-------------------------------Main API --------------------------------08/04/2022--Vivek Mistry
router.post('/UserAdd', UserAPIController.UserAdd);
router.post('/UserLogin', UserAPIController.UserLogin);
router.post("/Logout", AuthController.Logout);
router.post('/UserPlan', UserAPIController.UserPlan);
router.post("/UserPlanActivation", UserAPIController.UserPlanActivation);
router.get("/UserRefView", UserAPIController.UserRefView);
router.post("/UserOwnMember", UserAPIController.UserOwnMember);
router.post("/UserMyMember", UserAPIController.UserMyMember);
router.post("/UserPassBook", UserAPIController.UserPassBook);
router.post("/GetBanner", UserAPIController.GetBanner);
router.get("/UserTransaction", UserAPIController.UserTransaction);
router.get("/UserTransaction1", UserAPIController.UserTransaction1);
router.post('/UserRemain', UserAPIController.UserRemain);
//-----------------------------Plan---------------------------------------------------------------
router.get("/BusinessPlan", UserAPIController.BusinessPlan);
router.get("/HomeInstallment", UserAPIController.HomeInstallment);
router.post("/MTBusinessPlan", UserAPIController.MTBusinessPlan);
router.post("/MTHomeInstallment", UserAPIController.MTHomeInstallment);
router.post("/HomeInstallmentAccept", UserAPIController.HomeInstallmentAccept);
router.post("/BusinessPlanAccept", UserAPIController.BusinessPlanAccept);
//-------------------------------Worker Zone API --------------------------------08/04/2022--Vivek Mistry
router.post("/AllUsersPage", UserAPIController.AllUsersPage);
router.post("/AllUsersPost", UserAPIController.AllUsersPost);
router.post("/UserRedPage", UserAPIController.UserRedPage);
router.post("/UserUnderYellowZone", UserAPIController.UserUnderYellowZone);//In Use
router.post("/UserBluePage", UserAPIController.UserBluePage);
router.post("/UserGreenPage", UserAPIController.UserGreenPage);
//-------------------------------User API --------------------------------08/04/2022--Vivek Mistry
router.get("/UserGet", UserAPIController.UserGet);
router.get("/UserBYID/:ID", UserAPIController.UserBYID);
router.post("/UserGetID", UserAPIController.UserGetID);
router.put("/UserUpdate", UserAPIController.UserUpdate);
router.post("/UserNewUpdate", UserAPIController.UserNewUpdate);
router.delete('/UserDelete/:ID', UserAPIController.UserDelete);
router.get('/UserActive/:ID', UserAPIController.UserActive);
//-------------------------------Auth API --------------------------------08/04/2022--Vivek Mistry
router.post('/MinMemberAdd', MasterController.MinMemberAdd);
router.post("/MinMemberGet", MasterController.MinMemberGet);
router.post("/MinMemberBYID", MasterController.MinMemberBYID);
router.put("/MinMemberUpdate", MasterController.MinMemberUpdate);
router.delete('/MinMemberDelete/:ID', MasterController.MinMemberDelete);
//-------------------------------RegistrationCharge API --------------------------------10/05/2022--Banti Parmar
router.post('/RegistrationChargeAdd', MasterController.RegistrationChargeAdd);
router.post("/RegistrationChargeGet", MasterController.RegistrationChargeGet);
router.post("/RegistrationChargeBYID", MasterController.RegistrationChargeBYID);
router.put("/RegistrationChargeUpdate", MasterController.RegistrationChargeUpdate);
router.delete('/RegistrationChargeDelete/:ID', MasterController.RegistrationChargeDelete);
//-------------------------------RegistrationCharge API --------------------------------10/05/2022--Banti Parmar
router.post('/PaidAmountAdd', MasterController.PaidAmountAdd);
router.post("/PaidAmountGet", MasterController.PaidAmountGet);
router.post("/PaidAmountBYID", MasterController.PaidAmountBYID);
router.put("/PaidAmountUpdate", MasterController.PaidAmountUpdate);
router.delete('/PaidAmountDelete/:ID', MasterController.PaidAmountDelete);
//-------------------------------HealthInsurance API --------------------------------11/05/2022--Vivek Mistry
router.post("/GetHealthInsurance", OtherController.HealthInsuranceSearch);
router.post('/HealthInsuranceAdd', OtherController.HealthInsuranceAdd);
router.get("/HealthInsuranceGet", OtherController.HealthInsuranceGet);
router.get("/HealthInsuranceBYID/:ID", OtherController.HealthInsuranceBYID);
router.put("/HealthInsuranceUpdate", OtherController.HealthInsuranceUpdate);
router.delete('/HealthInsuranceDelete/:ID', OtherController.HealthInsuranceDelete);
//-------------------------------Hospital API --------------------------------12/05/2022--Vivek Mistry
router.post('/HospitalRadius', OtherController.HospitalRadius);
router.post('/HospitalAdd', OtherController.HospitalAdd);
router.post("/HospitalGet", OtherController.HospitalGet);
router.post("/HospitalBYID", OtherController.HospitalBYID);
router.put("/HospitalUpdate", OtherController.HospitalUpdate);
router.delete('/HospitalDelete/:ID', OtherController.HospitalDelete);
//-------------------------------Appointment API --------------------------------12/05/2022--Vivek Mistry
router.post("/GetAppointment", OtherController.AppointmentSearch);
router.post('/AppointmentAdd', OtherController.AppointmentAdd);
router.get("/AppointmentGet", OtherController.AppointmentGet);
router.get("/AppointmentBYID/:ID", OtherController.AppointmentBYID);
router.put("/AppointmentUpdate", OtherController.AppointmentUpdate);
router.delete('/AppointmentDelete/:ID', OtherController.AppointmentDelete);
router.post("/GetRadius", OtherController.GetRadius);
//------------------------------Withdrawal Request API -----------------------------21/05/2022
router.post("/UserWithdrawal", UserAPIController.UserWithdrawal);
router.post("/GetUserWithdrawal", UserAPIController.GetUserWithdrawal);//Mobile APP
router.post("/GetWithdrawal", UserAPIController.GetWithdrawal);
router.get("/MainBalance", UserAPIController.GetMainBalance);
router.post("/WithdrawalAccept", UserAPIController.UserWithdrawalAccept);
//-------------------------------Website API --------------------------------11/05/2022--Vivek Mistry
//------------------------------AboutUs-------------------------------25/04/2022
router.get("/AboutUsGetAPP", WebsiteController.AboutUsGetAPP);
router.post("/AboutUsAdd", WebsiteController.AboutUsAdd);
router.post("/AboutUsGet", WebsiteController.AboutUsGet);
router.post("/AboutUsBYID", WebsiteController.AboutUsFindByID);
router.put("/AboutUsUpdate", WebsiteController.AboutUsUpdate);
router.delete('/AboutUsDelete/:ID', WebsiteController.AboutUsDelete);
//------------------------------Testimonial-------------------------------23/04/2022
router.post('/TeamMemberAdd', WebsiteController.TeamMemberAdd);
router.post("/TeamMemberGet", WebsiteController.TeamMemberGet);
router.post("/TeamMemberBYID", WebsiteController.TeamMemberBYID);
router.put("/TeamMemberUpdate", WebsiteController.TeamMemberUpdate);
router.delete('/TeamMemberDelete/:ID', WebsiteController.TeamMemberDelete);
//-------------------------------Contact Us --------------------------------05/01/21--vivek mistry
router.post("/ContactAdd", WebsiteController.AddContactData);
router.get("/GetContact", WebsiteController.GetContactData);
router.put("/ContactEdit", WebsiteController.EditContactData);
//------------------------------Testimonial-------------------------------23/04/2022
router.post('/CertificateAdd', WebsiteController.CertificateAdd);
router.post("/CertificateGet", WebsiteController.CertificateGet);
router.post("/CertificateBYID", WebsiteController.CertificateBYID);
router.put("/CertificateUpdate", WebsiteController.CertificateUpdate);
router.delete('/CertificateDelete/:ID', WebsiteController.CertificateDelete);
//--------------------------------ETC Disable APIS ------------------------
//router.get('/UserCounter', UserAPIController.UserCounter);
//router.get("/UserUnderRedZone", UserAPIController.UserUnderRedZone);
//router.get("/UserUnderBlueZone", UserAPIController.UserUnderBlueZone);
//router.get("/UserUnderGreenZone", UserAPIController.UserUnderGreenZone);
//router.post('/HospitalGetApp', OtherController.HospitalGetApp);
//router.get('/HospitalList', OtherController.HospitalList);
//router.get("/GetWithdrawal1", UserAPIController.GetWithdrawal1);
//router.get("/SearchWithdrawal", UserAPIController.SearchWithdrawal);
//router.get("/AggeSearchWithdrawal", UserAPIController.AggeSearchWithdrawal);

router.post("/NewsAdd", MasterController.NewsAdd);
router.get("/NewsGet", MasterController.NewsGet);
router.post("/NewsFindByID", MasterController.NewsFindByID);
router.put("/NewsUpdate", MasterController.NewsUpdate);
router.delete("/NewsDelete/:ID", MasterController.NewsDelete);
router.post("/CalculationAdd", MasterController.CalculationAdd);
router.post("/CalculationGet", MasterController.CalculationGet);
router.post("/CalculationFindByID", MasterController.CalculationFindByID);
router.put("/CalculationUpdate", MasterController.CalculationUpdate);
router.delete("/CalculationDelete/:ID", MasterController.CalculationDelete);
router.post("/PlanTypeAdd", UserAPIController.PlanTypeAdd);
router.get("/PlanTypeGet", UserAPIController.PlanTypeGet);
router.get("/DropDownPlanType", UserAPIController.DropDownPlanType);
router.post("/PolicyTypeAdd", MasterController.PolicyTypeAdd);
router.get("/PolicyTypeGet", MasterController.PolicyTypeGet);
router.post("/PolicyTypeFindByID", MasterController.PolicyTypeFindByID);
router.put("/PolicyTypeUpdate", MasterController.PolicyTypeUpdate);
router.delete("/PolicyTypeDelete/:ID", MasterController.PolicyTypeDelete);
router.get("/DropDownPolicyType", MasterController.DropDownPolicyType);
router.post("/NewHealthInsuranceAdd", OtherController.NewHealthInsuranceAdd);
router.get("/NewHealthInsuranceGet", OtherController.NewHealthInsuranceGet);
router.post("/NewHealthInsuranceUpdate", OtherController.NewHealthInsuranceUpdate);
router.post("/ViewHealthInsurance", OtherController.ViewHealthInsurance);
router.post("/UserOrangePage", UserAPIController.UserOrangePage);
router.post("/FetchHealthInsuranceBYID", OtherController.FetchHealthInsuranceBYID);
router.get("/DateWiseInsuranceDone", OtherController.DateWiseInsuranceDone);

router.get("/DateWiseInsurance", OtherController.DateWiseInsurance);
router.get("/DateWiseInsuranceComplete/:ID", OtherController.DateWiseInsuranceComplete);

router.get("/GetImagePath", WebsiteController.GetImagePath);

router.post("/GalleryAdd", WebsiteController.GalleryAdd);
router.post("/GalleryGet", WebsiteController.GalleryGet);
router.put("/GalleryUpdate", WebsiteController.GalleryUpdate);
router.post("/GalleryEdit", WebsiteController.GalleryEdit);
router.delete("/GalleryDelete/:ID", WebsiteController.GalleryDelete);
router.delete("/DeleteGalleryPhoto/:ID", WebsiteController.DeleteGalleryPhoto);


router.post("/DonationAdd", WebsiteController.DonationAdd);
router.post("/DonationGet", WebsiteController.DonationGet);
router.post("/DonationBYID", WebsiteController.DonationBYID);
router.put("/DonationUpdate", WebsiteController.DonationUpdate);
router.delete("/DonationDelete/:ID", WebsiteController.DonationDelete);

router.post("/BankDetailAdd", WebsiteController.BankDetailAdd);
router.post("/BankDetailGet", WebsiteController.BankDetailGet);
router.post("/BankDetailBYID", WebsiteController.BankDetailBYID);
router.put("/BankDetailUpdate", WebsiteController.BankDetailUpdate);
router.delete("/BankDetailDelete/:ID", WebsiteController.BankDetailDelete);


router.get("/BankDetailGet", WebsiteController.BankDetailGet);
router.get("/DonationGet", WebsiteController.DonationGet);
router.get("/GalleryGet", WebsiteController.GalleryGet);

router.get("/BannerGet", WebsiteController.BannerGet);
router.post("/BannerAdd", WebsiteController.BannerAdd);
router.post("/BannerGet", WebsiteController.BannerGet);
router.put("/BannerUpdate", WebsiteController.BannerUpdate);
router.post("/BannerEdit", WebsiteController.BannerBYID);
router.delete("/BannerDelete/:ID", WebsiteController.BannerDelete);
router.delete("/DeleteBannerPhoto/:ID", WebsiteController.DeleteBannerPhoto);

// router.post("/DeleteImage", WebsiteController.DeleteImage);


module.exports = router;