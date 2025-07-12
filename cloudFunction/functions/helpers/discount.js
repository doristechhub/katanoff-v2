const moment = require('moment');

// Optional: You can pass DATE_FORMAT as a second argument if you want to keep it dynamic
const getDiscountStatus = (dateRange, DATE_FORMAT = 'MM-DD-YYYY HH:mm') => {
    const now = moment();
    const beginsAt = dateRange?.beginsAt ? moment(dateRange.beginsAt, DATE_FORMAT, true) : null;
    const expiresAt = dateRange?.expiresAt ? moment(dateRange.expiresAt, DATE_FORMAT, true) : null;

    if (beginsAt?.isValid()) {
        if (now.isBefore(beginsAt)) return 'scheduled';
        if (!expiresAt || !expiresAt.isValid() || now.isBefore(expiresAt)) return 'active';
    }

    return 'expired';
};


module.exports = getDiscountStatus;
