require('dotenv').config();
const Appointment = require("../models/appointment_modal");
const Register = require("../models/registration");
const responseData = require("../helper/response");


exports.createAppointment = async (req, res) => {
    try {
        const appointmentData = req.body;
        const existingRegister = await Register.findById(appointmentData.register_id);
        if (!existingRegister) {
            return responseData.notFoundResponse(res, 'Register not found for the given register_id');
        }

        let data = await Appointment.create({
            register_id: appointmentData.register_id,
            appointment_date: appointmentData.appointment_date,
            appointment_time: appointmentData.appointment_time,
            symptoms: appointmentData.symptoms,
            status: appointmentData.status
        })
        return responseData.createResponse(res, 'Appointment created Successfully', data);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}


exports.getAppointment = async (req, res) => {
    try {
        const data = await Appointment.find()
        return responseData.sendResponse(res, 'Data fetch Successfully', data);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.getAppointByFilter = async (req, res) => {
    try {
        const appointmentData = await Appointment.aggregate([
            {
                $lookup: {
                    from: 'registers',
                    localField: 'register_id',
                    foreignField: '_id',
                    as: 'registerData'
                }
            },
            {
                $lookup: {
                    from: 'treatmentpayments',
                    localField: 'register_id',
                    foreignField: 'register_id',
                    as: 'treatmentData'
                }
            },
            {
                $unwind: '$registerData'
            },
            {
                $unwind: '$treatmentData'
            },
            {
                $project: {
                    _id: 1,
                    register_id: 1,
                    appointment_date: 1,
                    registerData: {
                        city: 1
                    },
                    treatmentData: {
                        payment_amount: 1,
                        payment_status: 1,
                        createdAt: 1,
                    }
                }
            }
        ]).exec();

        const dataByCity = {};
        const countByMonth = {};
        const totalAmountByYear = {};
        const paymentDataByCityAndYear = {};

        appointmentData.map((data) => data.registerData).map(el => {
            return dataByCity[el.city] = ((dataByCity[el.city] || 0) + 1)
        })

        appointmentData.forEach((appointment) => {
            const date = new Date(appointment.appointment_date);
            const monthName = date.toLocaleString('default', { month: 'short' });

            countByMonth[monthName] = (countByMonth[monthName] || 0) + 1
            const payment = {
                payment_amount: appointment.treatmentData.payment_amount,
                payment_status: appointment.treatmentData.payment_status,
                createdAt: appointment.treatmentData.createdAt
            };

            const city = appointment.registerData.city
            const year = new Date(appointment.appointment_date).getFullYear();
            paymentDataByCityAndYear[city] = paymentDataByCityAndYear[city] || {};
            paymentDataByCityAndYear[city][year] = (paymentDataByCityAndYear[city][year] || 0) + payment.payment_amount;

            totalAmountByYear[year] = (totalAmountByYear[year] || 0) + payment.payment_amount;
        });

        const paymentObject = {};
        Object.keys(paymentDataByCityAndYear).forEach(city => {
            paymentObject[city] = [paymentDataByCityAndYear[city]];
        });

        return responseData.sendResponse(res, 'Data fetch Successfully', { dataByCity: dataByCity, AppointmentCountByMonth: countByMonth, totalAmountByYearandCity: paymentObject });
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.get_FullDetail_Appointment = async (req, res) => {
    try {
        const AppointDateFilter = req.query.appoint_date || ''
        const regNameFilter = req.query.name || ''

        const dateFilter = {}
        const nameFilter = {}
        if (AppointDateFilter) {
            dateFilter.appointment_date = AppointDateFilter
        }
        if (nameFilter) {
            nameFilter['name'] = { $regex: new RegExp(regNameFilter, 'i') };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const totalDocuments = await Appointment.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);
        if (page > totalPages) {
            return responseData.errorResponse(res, 'Page number out of range');
        }

        const appointmentData = await Appointment.aggregate([
            {
                $match: dateFilter
            },
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
                $project: {
                    _id: 1,
                    register_id: 1,
                    appointment_date: 1,
                    appointment_time: 1,
                    symptoms: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    user_id: '$registerData.user_id',
                    name: '$registerData.name',
                    phone_number: '$registerData.phone_number',
                    city: '$registerData.city',
                    optional_phone_number: '$registerData.optional_phone_number',
                    age: '$registerData.age',
                    gender: '$registerData.gender',
                }
            },
            {
                $match: nameFilter
            },
            { $skip: skip },
            { $limit: limit }
        ]).exec();
        return responseData.sendResponse(res, 'Data fetch Successfully', appointmentData, { currentPage: page, totalPages: totalPages, totalRecords: totalDocuments });

    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Appointment.findByIdAndUpdate(id, req.body)
        const updatedData = await Appointment.findById(id)
        if (!data) {
            return responseData.errorResponse(res, "Appointment not find with given id");
        }
        return responseData.sendResponse(res, 'data update successfully', updatedData);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Appointment.findByIdAndDelete(id)
        if (!data) {
            return responseData.errorResponse(res, '"Appointment not find with given id"');
        }
        return responseData.sendResponse(res, 'Appointment delete Successfully', data);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.deleteMultipleAppointments = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return responseData.errorResponse(res, 'Invalid or empty IDs array');
        }

        const deletedAppointments = await Appointment.deleteMany({
            _id: { $in: ids }
        });

        if (!deletedAppointments.deletedCount) {
            return responseData.errorResponse(res, 'No appointments found with given IDs');
        }

        return responseData.sendResponse(res, 'Appointments deleted successfully', deletedAppointments);
    } catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
};


exports.testAppFilter = async (req, res) => {
    try {
        const appointmentData = await Appointment.aggregate([
            {
                $lookup: {
                    from: 'registers',
                    localField: 'register_id',
                    foreignField: '_id',
                    as: 'registerData'
                }
            },
            {
                $lookup: {
                    from: 'treatmentpayments',
                    localField: 'register_id',
                    foreignField: 'register_id',
                    as: 'treatmentData'
                }
            },
            {
                $unwind: '$registerData'
            },
            {
                $unwind: '$treatmentData'
            },
            {
                $project: {
                    _id: 1,
                    register_id: 1,
                    appointment_date: 1,
                    registerData: {
                        city: 1
                    },
                    treatmentData: {
                        payment_amount: 1,
                        payment_status: 1,
                        createdAt: 1,
                    }
                }
            }
        ]).exec();

        return responseData.sendResponse(res, 'Data fetch Successfully', appointmentData);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}