require('dotenv').config();
const treatmentPayment = require("../models/treatmentPayment");
const Register = require("../models/registration");
const responseData = require("../helper/response");

exports.createTreatment = async (req, res) => {
    try {
        const treatmentData = req.body;
        const existingRegister = await Register.findById(treatmentData.register_id);
        if (!existingRegister) {
            return responseData.notFoundResponse(res, "Register not found for the given register_id");
        }

        let data = await treatmentPayment.create({
            register_id: treatmentData.register_id,
            payment_amount: treatmentData.payment_amount,
            payment_status: treatmentData.payment_status,
            action: treatmentData.action
        })
        return responseData.createResponse(res, "Treatment Create Successfully", data);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}


exports.getTreatmentPayment = async (req, res) => {
    try {
        const data = await treatmentPayment.find()
        return responseData.sendResponse(res, "fetch data Successfully", data);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}


exports.get_withRegData_TreatmentPayment = async (req, res) => {
    try {

        const nameFilter = req.query.name || '';

        const filter = {}
        if (nameFilter) {
            filter['name'] = { $regex: new RegExp(nameFilter, 'i') };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalDocuments = await Register.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);

        if (page > totalPages) {
            return responseData.errorResponse(res, "Page number out of range");
        }

        const treatmentData = await treatmentPayment.aggregate([
            {
                $lookup: {
                    from: 'registers',
                    localField: 'register_id',
                    foreignField: '_id',
                    as: 'registerData'
                }
            },
            {
                $unwind: '$registerData'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'registerData.user_id',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $project: {
                    _id: 1,
                    register_id: 1,
                    payment_amount: 1,
                    payment_status: 1,
                    action: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    email: '$userData.email',
                    user_id: '$registerData.user_id',
                    date: '$registerData.date',
                    name: '$registerData.name',
                    phone_number: '$registerData.phone_number',
                    city: '$registerData.city',
                    state: '$registerData.state',
                    zipcode: '$registerData.zipcode',
                    optional_phone_number: '$registerData.optional_phone_number',
                    followUpDate: '$registerData.followUpDate',
                    patientHashKey: '$registerData.patientHashKey'
                }
            },
            {
                $match: filter
            },
            { $skip: skip },
            { $limit: limit }
        ]).exec();
        return responseData.sendResponse(res, "fetch data Successfully", treatmentData, { currentPage: page, totalPages: totalPages, totalRecords: totalDocuments });
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}
