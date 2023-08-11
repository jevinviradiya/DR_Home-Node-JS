require('dotenv').config();
const Register = require("../models/registration");
const { generateDateAfter24Hours, isValidDate } = require('../helper/helper');
const responseData = require("../helper/response");


exports.registerUser = async (req, res) => {
    try {
        const registerData = req.body;
        const collectionCount = await Register.count()
        
        let data = await Register.create({
            user_id: req.user.user_id,
            name: registerData.name,
            city: registerData.city,
            birthday: registerData.birthday,
            date: registerData.date,
            optional_phone_number: registerData.optional_phone_number,
            phone_number: registerData.phone_number,
            age: registerData.age,
            gender: registerData.gender,
            typeofpregnency: registerData.typeofpregnency,
            current_disease: registerData.current_disease,
            current_disease_text: registerData.current_disease_text,
            followUpDate: generateDateAfter24Hours(registerData.date),
            patientHashKey: `DR-HOME${collectionCount + 1}`
        })
        return responseData.createResponse(res, "User Register Successfully", data);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.getRegisterUser = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const userNameFilter = req.query.name || '';
        const followupDateFilter = req.query.followUpDate?.slice(0, 10) || '';
        const birthDateFilter = req.query.birth_date?.slice(0, 10) || '';
        const dateFilter = req.query.date?.slice(0, 10) || '';

        const filter = {};
        if (userNameFilter) {
            filter.name = { $regex: new RegExp(userNameFilter, 'i') };
        }
        if (isValidDate(followupDateFilter)) {
            filter.followUpDate = followupDateFilter
        }

        if (isValidDate(birthDateFilter)) {
            filter.birthday = birthDateFilter
        }
        if (isValidDate(dateFilter)) {
            filter.date = dateFilter
        }

        const totalDocuments = await Register.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);

        if (page > totalPages) {
            return responseData.errorResponse(res, "Page number out of range");
        }

        let data = await Register.find(filter).skip(skip).limit(limit);

        return responseData.sendResponse(res, "Fetch data Successfully", data, {currentPage: page, totalPages: totalPages, totalRecords: totalDocuments});
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.deleteRegisterUser = async (req, res) => {
    try {
        const { id } = req.params
        let data = await Register.findByIdAndDelete(id)
        if (!data) {
            return responseData.errorResponse(res, "RegisterUser not found!");
        }
        return responseData.sendResponse(res, "RegisterUser delete Successfully", data);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.deleteMultipleRegisterUsers = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return responseData.errorResponse(res, 'Invalid or empty IDs array');
        }

        const deletedUsers = await Register.deleteMany({
            _id: { $in: ids }
        });

        if (!deletedUsers.deletedCount) {
            return responseData.errorResponse(res, 'No users found with given IDs');
        }

        return responseData.sendResponse(res, 'Users deleted successfully', deletedUsers);
    } catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
};

exports.updateRegisterUser = async (req, res) => {
    try {
        const { id } = req.params;
        let data = await Register.findByIdAndUpdate(id, req.body)
        if (!data) {
            return responseData.errorResponse(res, "RegisterUser not found!");
        }
        let updatedData = await Register.findById(id)
        return responseData.sendResponse(res, "RegisterUser update Successfully", updatedData);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}   