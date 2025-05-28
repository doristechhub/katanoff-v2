import { uid } from "uid";
import moment from "moment";
import { appointmentsUrl, fetchWrapperService, sanitizeObject } from "@/_helper";

const isDateTimeInValid = (date) => {
  const futureDate = moment(date, "DD-MM-YYYY HH:mm");
  const twoDaysLater = moment().add(2, "days");

  if (
    !futureDate.isSameOrAfter(twoDaysLater, "day") ||
    futureDate.day() === 6 ||
    futureDate.day() === 0
  ) {
    return true;
  }
  return false;
};

const addNewAppointment = (params) => {
  return new Promise(async (resolve, reject) => {
    try {

      let { name, email, mobile, dateTime, message } = sanitizeObject(params);
      name = name ? name?.trim() : null;
      email = email ? email?.trim() : null;
      mobile = mobile ? Number(mobile) : null;
      dateTime = dateTime ? dateTime?.trim() : null;
      message = message ? message?.trim() : null;


      if (name && email && mobile && dateTime && message) {
        const format = "DD-MM-YYYY HH:mm";
        const isValidDateTimeFormat = moment(dateTime, format, true).isValid();

        if (!isValidDateTimeFormat) {
          reject(new Error("Invalid date and time format"));
          return;
        }

        if (isDateTimeInValid(dateTime)) {
          reject(
            new Error(
              "The date must be at least two days later and not fall on a Saturday or Sunday."
            )
          );
          return;
        }

        const findPattern = {
          url: appointmentsUrl,
          key: "dateTime",
          value: dateTime,
        };
        const appointmentData = await fetchWrapperService.find(findPattern);

        const filteredData = appointmentData.filter(
          (item) =>
            item?.appointmentStatus?.toLowerCase() === "approved" ||
            item?.appointmentStatus?.toLowerCase() === "pending"
        );

        if (filteredData?.length) {
          reject(
            new Error(
              "Sorry, this slot is already booked. Please choose another time."
            )
          );
          return;
        }

        const uuid = uid();
        let insertPattern = {
          name,
          email,
          mobile,
          dateTime,
          message,
          appointmentStatus: "pending",
          id: uuid,
          createdDate: Date.now(),
          updatedDate: Date.now(),
        };
        const createPattern = {
          url: `${appointmentsUrl}/${uuid}`,
          insertPattern,
        };
        fetchWrapperService
          .create(createPattern)
          .then((response) => {
            resolve(createPattern);
          })
          .catch((e) => {
            reject(
              new Error("An error occurred during creating a new appointment.")
            );
          });
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const appointmentService = {
  addNewAppointment,
};
