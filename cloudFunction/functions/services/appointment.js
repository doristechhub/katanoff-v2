const { appointmentDbInstance } = require('../firebase');

const appointmentUrl = process.env.APPOINTMENT_URL
const exportFunction = {};

exportFunction.getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const appointmentRef  = appointmentDbInstance.ref(`${appointmentUrl}`)
      const snapshot = await appointmentRef.once('value')
      const appointmentList = snapshot.exists() ? Object.values(snapshot.val()) : []
      resolve(appointmentList)
    } catch (e) {
      reject(e)
    }
  })
}

exportFunction.findOne = (
  findPattern
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { appointmentId } = findPattern
      const appointmentRef  = appointmentDbInstance.ref(`${appointmentUrl}/${appointmentId}`)
      const snapshot = await appointmentRef.once('value')
      const appointmentData = snapshot.exists() ? snapshot.val() : null
      resolve(appointmentData)
    } catch (e) {
      reject(e)
    }
  })
}

exportFunction.findOneAndUpdate = (
  findPattern,
  updatePattern
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { appointmentId } = findPattern
      await appointmentDbInstance.ref(`${appointmentUrl}/${appointmentId}`).update(updatePattern)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = exportFunction;
