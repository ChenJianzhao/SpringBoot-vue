var path = require('path')
var config = require('../config')

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? config.build.baseUrl
    : config.dev.baseUrl
}
