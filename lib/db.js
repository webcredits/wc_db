module.exports = {
  getConnection : getConnection
}

// Requires
var Sequelize = require('sequelize')

/**
* Setup database.
* @param  {Object} config          The config object.
* @param  {string} config.dialect  The db dialect sqlite | mysql.
* @param  {string} config.host     The db host.
* @param  {string} config.database The db database name.
* @param  {string} config.username The db username.
* @param  {string} config.password The db password.
* @return {Object}                 Sequelize db object.
*/
function getConnection(config) {
  var sequelize
  var defaultStorage = 'store.db'
  var logging = config.logging || false

  if (config.dialect === 'sqlite') {
    if (!config.storage) {
      config.storage = defaultStorage
    }

    sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      storage: config.storage,
      logging: logging
    })
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      logging: logging
    })
  }
  return sequelize
}

/**
 * Run SQL as promise
 * @param  {string} sql          The SQL to run
 * @param  {Object} config          The config object.
 * @param  {string} config.dialect  The db dialect sqlite | mysql.
 * @param  {string} config.host     The db host.
 * @param  {string} config.database The db database name.
 * @param  {string} config.username The db username.
 * @param  {string} config.password The db password.
 * @param  {Object} conn            Sequelize connection.
 * @param  {Object} replacements    Possiblle replacements.
 * @return {Object}                 Promise
 */
function runSQL(sql, config, conn, replacements) {
  return new Promise(function(resolve, reject) {
    if (!config && !conn) {
      reject('Must set config or connection')
    }

    if (!sql) {
      reject('Need some sql')
    }

    if (!conn) {
      conn = getConnection(config)
    }

    replacements = replacements || {}

    conn.query(sql, { replacements: replacements }).then(function(ret){
      return resolve({"ret" : ret, "conn" : conn})
    }).catch(function(err) {
      return reject(err)
    })

  })

}
