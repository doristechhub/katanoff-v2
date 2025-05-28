const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')

const window = new JSDOM('').window

const DOMPurify = createDOMPurify(window)

const sanitizeValue = (params) => {
  return DOMPurify.sanitize(params)
}

module.exports = sanitizeValue
