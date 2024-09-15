const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  multipleStatements: true 
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');

  connection.query('CREATE DATABASE IF NOT EXISTS mydatabase', (err, result) => {
    if (err) throw err;
    console.log('Database created or already exists');
    const dbConnection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'mydatabase',
      multipleStatements: true
    });
    dbConnection.connect((err) => {
      if (err) throw err;
      console.log('Connected to my_database');

      const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
          email VARCHAR(255) UNIQUE,
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) DEFAULT 'user',
          stream VARCHAR(255) DEFAULT 'DEV' NOT NULL,
          linkedin VARCHAR(255),
          github VARCHAR(255), 
          number VARCHAR(10),
          insta VARCHAR(255),
          cv LONGBLOB,
          img LONGBLOB,
          place VARCHAR(255)  DEFAULT 'bengaluru'
      );
      CREATE TABLE IF NOT EXISTS skilltable (
         skill_id INT AUTO_INCREMENT PRIMARY KEY,
         skill VARCHAR(255) NOT NULL,
         skill_desc VARCHAR(255) NOT NULL,
         user_id INT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
      );
      CREATE TABLE IF NOT EXISTS edutable (
        edu_id INT AUTO_INCREMENT PRIMARY KEY,
        edu VARCHAR(255) NOT NULL,
        edu_desc VARCHAR(255) NOT NULL,
        user_id INT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
      );
      CREATE TABLE IF NOT EXISTS protable (
          pro_id INT AUTO_INCREMENT PRIMARY KEY,
          pro VARCHAR(255) NOT NULL,
          pro_desc VARCHAR(255) NOT NULL,
          link VARCHAR(255),
          img LONGBLOB,
          user_id INT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
      );
      CREATE TABLE IF NOT EXISTS internshiptable (
            int_id INT AUTO_INCREMENT PRIMARY KEY,
            intern VARCHAR(255) NOT NULL,
            int_desc VARCHAR(255) NOT NULL,
            img LONGBLOB,
            user_id INT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
      );
      CREATE TABLE IF NOT EXISTS servtable (
              serv_id INT AUTO_INCREMENT PRIMARY KEY,
              serv VARCHAR(255) NOT NULL,
              serv_desc VARCHAR(255) NOT NULL,
              user_id INT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
      );
      `;

      dbConnection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Tables created or already exist');

        dbConnection.end((err) => {
          if (err) throw err;
          console.log('Database connection closed');
        });
      });
    });
  });
});
