const { amsDbInstance } = require("../firebase");

const adminUrl = process.env.ADMIN_URL
const exportFunction = {};

exportFunction.findByEmail = (
  findPattern
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email } = findPattern

      const databaseRef  = amsDbInstance.ref(`${adminUrl}`)
      const snapshot = await databaseRef.orderByChild('email').equalTo(email).once('value')
      const adminsList = snapshot.exists() ? Object.values(snapshot.val()) : []
      const foundData = adminsList.length ? adminsList[0] : null
      resolve(foundData)
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
      const { userId } = findPattern
      const databaseRef  = amsDbInstance.ref(`${adminUrl}/${userId}`)
      const snapshot = await databaseRef.once('value')
      const adminData = snapshot.exists() ? snapshot.val() : null
      resolve(adminData)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = exportFunction;
