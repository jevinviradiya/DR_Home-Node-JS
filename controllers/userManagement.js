require('dotenv').config();
const UserManagement = require("../models/userManagement_modal");
const User = require("../models/users");
const { signUpUser } = require('./auth');
const responseData = require("../helper/response");


exports.createUserManagement = async (req, res) => {
    try {
        const ManagementData = req.body;
        try {
            const data = await signUpUser(req)
            const { _id } = data;
            if (data) {
                let managementData = await UserManagement.create({
                    user_id: _id,
                    name: ManagementData.name,
                    branch_name: ManagementData.branch_name,
                    date: ManagementData.date,
                    contact_no: ManagementData.contact_no,
                    user_type: ManagementData.user_type
                })
                return responseData.createResponse(res, "User Create Successfully", managementData);
            }
        } catch (err) {
            return responseData.errorResponse(res, err.message);
        }
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}


exports.getUserManagement = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const userNameFilter = req.query.user_name || '';
        const filter = {};
        if (userNameFilter) {
            filter.name = { $regex: new RegExp(userNameFilter, 'i') };
        }

        const totalDocuments = await UserManagement.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);

        if (page > totalPages) {
            return responseData.errorResponse(res, "Page number out of range");
        }

        const data = await UserManagement.find(filter).skip(skip).limit(limit);
        return responseData.sendResponse(res, "Fetch data Successfully", data, { currentPage: page, totalPages: totalPages, totalRecords: totalDocuments });
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.updateUserManagement = async (req, res) => {
    try {
        const { id } = req.params
        const data = await UserManagement.findByIdAndUpdate(id, req.body)
        if (!data) {
            return responseData.errorResponse(res, "User not found");
        }
        const updateData = await UserManagement.findById(id)
        return responseData.sendResponse(res, "Update User Successfully", updateData);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.deleteUserManagement = async (req, res) => {
    try {
        const { id } = req.params;

        const userManagementData = await UserManagement.findById(id);
        if (!userManagementData) {
            return responseData.errorResponse(res, "User Management not found");
        }

        const user_id = userManagementData.user_id;
        const deletedUser = await User.findByIdAndDelete(user_id);
        if (!deletedUser) {
            return responseData.errorResponse(res, "User not found");
        }

        const deletedUserManagement = await UserManagement.findByIdAndDelete(id);
        if (!deletedUserManagement) {
            return responseData.errorResponse(res, "User Management delete failed");
        }

        return responseData.sendResponse(res, "User Management and corresponding user deleted successfully");
    } catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
};

exports.DeleteMultiUserManagement = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return responseData.errorResponse(res, 'Invalid or empty IDs array');
        }

        const deletedInfo = { deletedUserManagements: [], deletedUsers: [] };

        for (const id of ids) {
            const userManagementData = await UserManagement.findById(id);
            if (userManagementData) {
                const user_id = userManagementData.user_id;
                const deletedUser = await User.findByIdAndDelete(user_id);
                if (deletedUser) {
                    const deletedUserManagement = await UserManagement.findByIdAndDelete(id);
                    if (deletedUserManagement) {
                        deletedInfo.deletedUserManagements.push(id);
                        deletedInfo.deletedUsers.push(user_id);
                    }
                }
            }
        }

        if (deletedInfo.deletedUserManagements.length === 0) {
            return responseData.errorResponse(res, 'No matching records found for deletion');
        }

        return responseData.sendResponse(res, 'Bulk UserManagement deletion successful', deletedInfo);
    } catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
};
