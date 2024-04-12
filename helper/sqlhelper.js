require('dotenv').config();
const mysql = require('mysql');

const DB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

DB.getConnection(function (err, con) {
    if (!err) console.log(":) Database Connected..");
    else
        console.log(err, ":( Database Not Connected..");
});

const sqlhelper = {};

sqlhelper.fetchData = async (query, array_data = []) => {
    return new Promise((resolve, reject) => {
        DB.getConnection((getConnectionErr, con) => {
            if (getConnectionErr) {
                reject(getConnectionErr);
            } else {
                const sql_data = con.query(query, array_data, (queryErr, res) => {
                    con.destroy(); // Release the connection back to the pool

                    if (queryErr) {
                        reject(queryErr);
                    } else {
                        resolve(res);
                    }
                });
                console.log(sql_data.sql);
            }
        });
    });
};

/** Insert Data */
sqlhelper.insertData = async (table_name, insert_data = {}, callback) => {
    return new Promise(async (resolve, reject) => {
        try {
            DB.getConnection(function (getConnectionErr, con) {
                if (getConnectionErr) {
                    reject(getConnectionErr);
                } else {
                    sql_data = con.query('INSERT INTO ' + table_name + ' SET ?', insert_data, (err, res) => {
                        // con.destroy();
                        con.destroy();
                        if (err) {
                            return reject(err);;
                        } else {
                            return resolve(res);
                        }
                    });
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

/** Update sql query */
sqlhelper.updateData = async (table_name, update_data = {}, where = {}) => {
    if (Object.keys(where).length == 0 || Object.keys(update_data).length == 0) {
        return;
    }

    const update_keys = Object.keys(update_data);
    const update_values = Object.values(update_data);

    const where_keys = Object.keys(where);
    const where_values = Object.values(where);

    const update_clause = update_keys.map(key => `${key}=?`).join(', ');
    const where_clause = where_keys.map(key => `${key}=?`).join(' AND ');

    const sql_query = `UPDATE ${table_name} SET ${update_clause} WHERE ${where_clause}`;
    const sql_params = [...update_values, ...where_values];

    return new Promise(async (resolve, reject) => {
        DB.getConnection(function (getConnectionErr, con) {
            if (getConnectionErr) {
                reject(getConnectionErr);
            } else {
                var sql_data = con.query(sql_query, sql_params, (err, res) => {
                    // con.destroy();
                    con.destroy();
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(res);
                    }
                });
            }
        });
    });
}

/** Delete sql query */
sqlhelper.delete = async (table_name, where = {}) => {
    const where_keys = Object.keys(where);
    const where_values = Object.values(where);

    const where_clause = where_keys.map(key => `${key}=?`).join(' AND ');

    const sql_query = `DELETE FROM ${table_name} WHERE ${where_clause}`;
    const sql_params = [...where_values];

    return new Promise(async (resolve, reject) => {
        DB.getConnection(function (getConnectionErr, con) {
            if (getConnectionErr) {
                reject(getConnectionErr);
            } else {
                var sql_data = con.query(sql_query, sql_params, (err, res) => {
                    // con.destroy();
                    con.destroy();
                    if (err) {
                        return reject(err);
                    } else {
                        console.log(res);
                        return resolve(res);
                    }
                });
            }
        });
    });
}

module.exports = sqlhelper;

