require('dotenv').config();
const Branch = require("../models/branch_modal");
const responseData = require("../helper/response");


exports.createBranch = async (req, res) => {
    try {
        const BranchData = req.body;

        const existingBranch = await Branch.aggregate([
            {
                $match: {
                    email: BranchData.email.toLowerCase()
                }
            }
        ]);

        if (existingBranch.length > 0) {
            return responseData.errorResponse(res, "Branch is already registered with Email");
        }

        let data = await Branch.create({
            branch_name: BranchData.branch_name,
            email: BranchData.email,
            opening_date: BranchData.opening_date,
            contact_no: BranchData.contact_no,
            city: BranchData.city,
            address: BranchData.address,
        })
        return responseData.createResponse(res, "Branch Create Successfully", data);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}


exports.getBranch = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const branchNameFilter = req.query.branch_name || '';
        const filter = {};
        if (branchNameFilter) {
            filter.branch_name = { $regex: new RegExp(branchNameFilter, 'i') };
        }

        const totalDocuments = await Branch.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);

        if (page > totalPages) {
            return responseData.errorResponse(res, "Page number out of range");
        }

        const data = await Branch.find(filter).skip(skip).limit(limit);
        return responseData.sendResponse(res, "Data Fetch Successfully", data, { currentPage: page, totalPages: totalPages, totalRecords: totalDocuments });
    } catch (err) {
        return responseData.errorResponse(res, err.message);
    }
}


exports.updateBranch = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Branch.findByIdAndUpdate(id, req.body)
        if (!data) {
            return responseData.errorResponse(res, "Branch not found");
        }
        const updateData = await Branch.findById(id)
        return responseData.sendResponse(res, "Update Branch Successfully", updateData);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.deleteBranch = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Branch.findByIdAndDelete(id)
        if (!data) {
            return responseData.errorResponse(res, "Branch not found");
        }
        return responseData.sendResponse(res, "Delete Branch Successfully", data);
    }
    catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
}

exports.deleteMultipleBranches = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return responseData.errorResponse(res, 'Invalid or empty IDs array');
        }

        const deletedBranches = await Branch.deleteMany({
            _id: { $in: ids }
        });

        if (!deletedBranches.deletedCount) {
            return responseData.errorResponse(res, 'No branch found with given IDs');
        }

        return responseData.sendResponse(res, 'Branches deleted successfully', deletedBranches);
    } catch (err) {
        return responseData.serverErrResponse(res, err.message);
    }
};
