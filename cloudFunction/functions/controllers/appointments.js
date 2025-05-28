const { appointmentService, userService } = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const { getMailTemplateForAppointmentStatus } = require("../utils/template");
const { sendMail } = require("../helpers/mail");
const dotenv = require("dotenv");
dotenv.config();
const moment = require("moment");
const { getCurrentDate } = require("../helpers/common");

/**
  This API is used for update appointment status into appointment for admin.
*/
const updateAppointmentStatus = async (req, res) => {
  try {
    // console.log('first', first)
    let { appointmentId, appointmentStatus, rejectReason } = req.body;
    // required
    appointmentId = sanitizeValue(appointmentId) ? appointmentId.trim() : null;
    appointmentStatus = sanitizeValue(appointmentStatus)
      ? appointmentStatus.trim()
      : null;
    rejectReason = sanitizeValue(rejectReason) ? rejectReason.trim() : null;

    if (
      appointmentId &&
      appointmentStatus &&
      ["pending", "approved", "rejected"].includes(appointmentStatus)
    ) {
      const findPattern = {
        appointmentId: appointmentId,
      };
      let appointmentData = await appointmentService.findOne(findPattern);
      if (appointmentData) {
        if (appointmentData.appointmentStatus === appointmentStatus) {
          return res.json({
            status: 409,
            message: message.alreadyExist("appointment status"),
          });
        }
        if (
          appointmentData.appointmentStatus == "approved" &&
          (appointmentStatus === "rejected" || appointmentStatus === "pending")
        ) {
          return res.json({
            status: 409,
            message: message.custom(
              `Appointment already approved so you can't change status.`
            ),
          });
        }
        if (
          appointmentData.appointmentStatus == "rejected" &&
          (appointmentStatus === "approved" || appointmentStatus === "pending")
        ) {
          return res.json({
            status: 409,
            message: message.custom(
              `Appointment already rejected so you can't change status.`
            ),
          });
        }
        let updatePattern = {
          appointmentStatus: appointmentStatus,
          updatedDate: getCurrentDate(),
        };
        if (appointmentStatus === "rejected") {
          if (!rejectReason) {
            return res.json({
              status: 400,
              message: message.custom("Provide reject reason"),
            });
          } else {
            updatePattern.rejectReason = rejectReason;
          }
        }

        await appointmentService.findOneAndUpdate(findPattern, updatePattern);
        // send mail for appointment status
        const formattedDateTime = moment(
          appointmentData.dateTime,
          "DD-MM-YYYY HH:mm"
        ).format("DD-MM-YYYY hh:mm A");
        const { subject, description } = getMailTemplateForAppointmentStatus(
          appointmentData.name,
          appointmentStatus,
          formattedDateTime,
          rejectReason ? rejectReason : null
        );
        sendMail(appointmentData.email, subject, description);
        return res.json({
          status: 200,
          message: message.SUCCESS,
        });
      } else {
        return res.json({
          status: 404,
          message: message.DATA_NOT_FOUND,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

module.exports = {
  updateAppointmentStatus,
};
