const express = require('express');
const path = require('path');
const { Stream } = require('stream');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',  
    database: 'mydatabase',
    multipleStatements:true   
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL server');
});
const query = 'desc users'
connection.query(query, (err, results) => {
    if (err) {
        console.error('Error fetching data:', err.stack);
        res.send('Error fetching data');
        return;
    }

    
     
    console.log(results);

}); 
const query1 = 'SHOW TABLES'
connection.query(query1, (err, resultss) => {
    if (err) {
        console.error('Error fetching data:', err.stack);
        res.send('Error fetching data');
        return;
    }
    console.log(resultss)
});
    
     
//     resultss.forEach(row=>{
//         const tablename = Object.values(row)[0];
//         const qr = `DROP TABLE IF EXISTS\`${tablename}\``;
//             console.log(`${tablename }`)
//             connection.query(qr,(err,resultss)=>{
//                 if(err) throw err;
//                 console.log(resultss)
//             })
//         })
//     });

    const query2 = 'SELECT * FROM users'
    connection.query(query2, (err, resultss) => {
        if (err) {
            console.error('Error fetching data:', err.stack);
            res.send('Error fetching data');
            return;
        }
        console.log(resultss);
        });
 