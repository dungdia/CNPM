const mysql = require("mysql2");

module.exports = class {
  #con;

  constructor() {
    this.#con = mysql.createConnection({
      host: process.env.HOST_NAME,
      user: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DBNAME,
    });


    this.#con.connect((err) => {
      if (err) {
        this.#con = null;
        return
      }
    });
  }

  select(querry, statementList = []) {
    return new Promise((resolve) => {
      this.#con.query(querry, statementList, (err, result) => {
        if (err) resolve(err);
        resolve(result);
      });
    });
  }

  insert(querry, list) {
    return new Promise((resolve) => {
      this.#con.query(querry, list, (err, result) => {
        if (err) resolve(err);
        if (result.affectedRows == 0)
          resolve({ messsage: "lỗi insert không thành công", status: 500 });
        resolve({ messsage: "insert thành công", status: 200 });
      });
    });
  }

  delete(querry, list) {
    return new Promise((resolve) => {
      this.#con.query(querry, list, (err, result) => {
        if (err) resolve(err);
        if (result.affectedRows == 0)
          resolve({ messsage: "lỗi delete không thành công", status: 500 });
        resolve({ messsage: "delete thành công", status: 200 });
      });
    });
  }

  update(querry, list) {
    return new Promise((resolve) => {
      this.#con.query(querry, list, (err, result) => {
        if (err) resolve(err);
        if (result.affectedRows == 0)
          resolve({ messsage: "lỗi update không thành công", status: 500 });
        resolve({ messsage: "update thành công", status: 200 });
      });
    });
  }

  startTransaction() {
    return new Promise((resolve) => {
      this.#con.beginTransaction((err) => {
        if (err) resolve(err);
        resolve(this.#con);
      });
    });
  }

  commit() {
    return new Promise((resolve) => {
      this.#con.commit((err) => {
        if (err) resolve(err);
        resolve(this.#con);
      });
    });
  }

  lastId() {
    return new Promise(resolve => {
      const query = "SELECT LAST_INSERT_ID() AS last_id";
      this.#con.query(query, (err, result) => {
        if (err) resolve(err);
        resolve(result[0].last_id);
      });
    })
  }

  closeConnect() {
    this.#con.end((err) => {
      if (err) {
        console.error("Error closing MySQL connection:", err);
        return;
      }
      // console.log('MySQL connection closed');
    });
  }
};
