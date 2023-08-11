const moment = require('moment');

function isValidDate(dateString) {
    // Check if the dateString is in a valid date format (YYYY-MM-DD)
    const validDateFormat = 'YYYY-MM-DD';
    return moment(dateString, validDateFormat, true).isValid();
}

const generateDateAfter24Hours = (date) => {
    const currentDate = new Date(date);
    const after24HoursDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const formattedDate = moment(after24HoursDate).format("YYYY-MM-DD")

    return formattedDate.toString()
};

module.exports = { generateDateAfter24Hours, isValidDate };