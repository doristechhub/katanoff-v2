const { cmsDbInstance } = require("../firebase");

const userUrl = process.env.USER_URL
const exportFunction = {};

exportFunction.findByEmail = (
  findPattern
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email } = findPattern

      const databaseRef  = cmsDbInstance.ref(`${userUrl}`)
      const snapshot = await databaseRef.orderByChild('email').equalTo(email).once('value')
      const usersList = snapshot.exists() ? Object.values(snapshot.val()) : []
      const foundData = usersList.length ? usersList[0] : null
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

      const databaseRef  = cmsDbInstance.ref(`${userUrl}/${userId}`)
      const snapshot = await databaseRef.once('value')
      const userData = snapshot.exists() ? snapshot.val() : null
      resolve(userData)
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
      const { userId } = findPattern

      await cmsDbInstance.ref(`${userUrl}/${userId}`).update(updatePattern)

      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = exportFunction;
