const express = require('express');
const path = require('path');
const { Stream } = require('stream');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer')
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const storage = multer.memoryStorage();
const upload = multer({storage:storage})
app.use(session({
  secret: 'secret_key',  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }    
}));

app.get('/', (req, res) => {
    const queries = {
      user: 'SELECT * FROM users',
      education: 'SELECT * FROM edutable',
      internshiptable: 'SELECT * FROM internshiptable',
      protable: 'SELECT * FROM protable',
      servtable: 'SELECT * FROM servtable',
      skilltable: 'SELECT * FROM skilltable'
    };
    
    
    const runQuery = (query) => {
      return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
    };
  
    
    Promise.all([
      runQuery(queries.user),
      runQuery(queries.education),
      runQuery(queries.internshiptable),
      runQuery(queries.protable),
      runQuery(queries.servtable),
      runQuery(queries.skilltable)
    ])
    .then(([user, education, internshiptable, protable, servtable, skilltable]) => {
        user = user[0];
        console.log(user.stream)
        
      
      res.render('index.html', {
        user,
        education,
        internshiptable,
        protable,
        servtable,
        skilltable
      });
      
      
    })
    .catch(err => {
      console.error('Error fetching data:', err.stack);
      res.send('Error fetching data');
    });
  });
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

const validUser = {
  name: 'admin',
  password: '12345'
};
const isAuthenticated = (req, res, next) => {
  if (req.session.isLoggedIn) {
    console.log(req.session.isLoggedIn)
      next();  
  } else {
      res.redirect('/login');  
      console.log(req.session.isLoggedIn)
  }
};
app.get('/login', (req, res) => {
  res.render('login.html');
});
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  if (name === validUser.name && password === validUser.password) {
    
    req.session.isLoggedIn = true;
    console.log('Login successful:', req.session.isLoggedIn);
    req.session.user = name;
      res.redirect('/create');
  } else {
      res.send('Invalid name or password. Please <a href="/login">try again</a>.');
  }
}); 

app.get('/create',isAuthenticated, (req, res) => {
  res.render('create.html'); 
});
app.get('/admin',isAuthenticated, (req, res) => {
  const queries = {
    user: 'SELECT * FROM users',
    education: 'SELECT * FROM edutable',
    internshiptable: 'SELECT * FROM internshiptable',
    protable: 'SELECT * FROM protable',
    servtable: 'SELECT * FROM servtable',
    skilltable: 'SELECT * FROM skilltable'
  };
  
  
  const runQuery = (query) => {
    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  
  Promise.all([
    runQuery(queries.user),
    runQuery(queries.education),
    runQuery(queries.internshiptable),
    runQuery(queries.protable),
    runQuery(queries.servtable),
    runQuery(queries.skilltable)
  ])
  .then(([user, education, internshiptable, protable, servtable, skilltable]) => {
      user = user[0];
      console.log(user.stream)
      
    
    res.render('admin.html', {
      user,
      education,
      internshiptable,
      protable,
      servtable,
      skilltable
    });
    
    
  })
  .catch(err => {
    console.error('Error fetching data:', err.stack);
    res.send('Error fetching data');
  });
}); 
  
 
app.post('/create',upload.fields([
  { name: 'img', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]),(req, res) => {
   let img =null, cv = null
   console.log(req.file)
   
    const {  name, stream, email,linkedin,github,number,place,insta  } = req.body;
    if (req.file) {
      img = req.file.buffer;
      cv = req.file.buffer; 
  }
     
    console.log({ name, stream, email,linkedin,github,number,place,insta,img,cv })
    const insertQuery = 'INSERT INTO users(name, stream, email,linkedin,github,number,place,insta,img,cv) VALUES (?, ?, ?, ?,?,?,?,?,?,?)';
    const values = [name, stream, email,linkedin,github,number,place,insta,img,cv ];

     
    connection.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.stack);
            res.send('Error inserting data');
            return;
        }
        console.log('Data inserted successfully');
        res.redirect('/admin');
    });
});
app.post('/addskill',(req,res)=>{
  const { skill, skill_desc, user_id }=  req.body;
  const insertqry = 'INSERT INTO skilltable(skill,skill_desc,user_id) VALUES(?,?,?)';
  const values=[skill,skill_desc,user_id];
  connection.query(insertqry,values,(err,result)=>{
    if(err){
      console.error('Error insertion data:',err.stack);
      res.send('Error inserting data');
      return
    }
    console.log('Data inserted Successfully');
    res.redirect('/admin');
  });
});
app.post('/addedu',(req,res)=>{
  const { edu,edu_desc,id }=  req.body;
  const insertqry = 'INSERT INTO edutable(edu,edu_desc,user_id) VALUES(?,?,?)';
  const values=[edu,edu_desc,id];
  connection.query(insertqry,values,(err,result)=>{
    if(err){
      console.error('Error insertion data:',err.stack);
      res.send('Error inserting data');
      return
    }
    console.log('Data inserted Successfully');
    res.redirect('/admin');
  });
});
app.post('/addpro', upload.single('proimage'), (req, res) => {
  const { pro, pro_desc,link, id } = req.body;
  const proimage = req.file ?  req.file.buffer : null;  

  const insertqry = 'INSERT INTO protable(pro, pro_desc, user_id, img,link) VALUES(?,?,?,?,?)';
  const values = [pro, pro_desc, id, proimage,link];

  connection.query(insertqry, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err.stack);
      res.send('Error inserting data');
      return;
    }
    console.log('Data inserted successfully');
    res.redirect('/admin');
  });
});
app.post('/addintern',upload.single('intimage'), (req,res)=>{
  const {intern, intern_desc, id } =  req.body;
  console.log({intern, intern_desc, id} )
  const intimage = req.file ? req.file.buffer : null;
  const insertqry = 'INSERT INTO internshiptable(intern,int_desc,user_id,img) VALUES(?,?,?,?)';
  const values=[intern,intern_desc,id,intimage];
  console.log([intern,intern_desc,id,intimage])
  connection.query(insertqry,values,(err,result)=>{
    if(err){
      console.error('Error insertion data:',err.stack);
      res.send('Error inserting data');
      return
    }
    console.log('Data inserted Successfully');
    res.redirect('/admin');
  });
});
app.post('/addserv',(req,res)=>{
  const {services,services_desc,id }=  req.body;
  console.log({services,services_desc,id })
  const insertqry = 'INSERT INTO servtable(serv,serv_desc,user_id) VALUES(?,?,?)';
  const values=[services,services_desc,id ];
  connection.query(insertqry,values,(err,result)=>{
    if(err){
      console.error('Error insertion data:',err.stack);
      res.send('Error inserting data');
      return
    }
    console.log('Data inserted Successfully');
    res.redirect('/admin');
  });
});


 
app.post('/update', upload.fields([
  { name: 'img', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), (req, res) => {
  const { skill_id, edu_id, pro_id, int_id, serv_id, id } = req.body;
  
  
  if (skill_id) {
       
      const { skill, skill_desc } = req.body;
      
      const query = `UPDATE skilltable SET skill = ?, skill_desc = ? WHERE skill_id = ?`;
      connection.query(query, [skill, skill_desc, skill_id], (err, result) => {
          if (err) throw err;
          res.redirect('/admin');  
      });
  } else if (edu_id) {
       
      const { edu, edu_desc } = req.body;
      const query = `UPDATE edutable SET edu = ?, edu_desc = ? WHERE edu_id = ?`;
      connection.query(query, [edu, edu_desc, edu_id], (err, result) => {
          if (err) throw err;
          res.redirect('/admin');
      });
  } else if (pro_id) {
       
      const { pro, pro_desc,link } = req.body;
      const img = req.file ? req.file.buffer : null;  
      console.log(img,req.file)
      let query = `UPDATE protable SET pro = ?, pro_desc = ? link = ?`;
      const params = [pro, pro_desc,link];
      if (img) {
          query += `, img = ?`;
          params.push(img);
      }
      query += ` WHERE pro_id = ?`;
      params.push(pro_id);

      connection.query(query, params, (err, result) => {
          if (err) throw err;
          res.redirect('/admin');
      });
  } else if (int_id) {
      
      const { intern, intern_desc } = req.body;
      const img = req.file ? req.file.buffer : null;
      console.log(req.file)
      let query = `UPDATE internshiptable SET intern = ?, int_desc = ?`;
      const params = [intern, intern_desc];
      if (img) {
          query += `, img = ?`;
          params.push(img);
      }
      query += ` WHERE int_id = ?`;
      params.push(int_id);

      connection.query(query, params, (err, result) => {
          if (err) throw err;
          res.redirect('/admin');
      });
  } else if (serv_id) {
     
      const { serv, serv_desc } = req.body;
      const query = `UPDATE servtable SET serv = ?, serv_desc = ? WHERE serv_id = ?`;
      connection.query(query, [serv, serv_desc, serv_id], (err, result) => {
          if (err) throw err;
          res.redirect('/admin');
      });
  }
  else if (id) {
     
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const id = req.body.id;
    const { name, place, stream, linkedin, github, number, insta } = req.body;
    const cv = req.files && req.files['cv'] ? req.files['cv'][0].buffer : null;
    const img = req.files && req.files['img'] ? req.files['img'][0].buffer : null;

    let query = `UPDATE users SET name = ?, place = ?, stream = ?, linkedin = ?, github = ?, number = ?, insta = ?`;
    const params = [name, place, stream, linkedin, github, number, insta];

    if (img) {
        query += `, img = ?`;
        params.push(img);
    }

    if (cv) {
        query += `, cv = ?`;
        params.push(cv);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    connection.query(query, params, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).send('Error updating data');
        }
        res.redirect('/admin');
    });
  }
});

app.post('/delete', (req, res) => {
  const { id, option } = req.body;

  const idColumnMap = {
    users: 'id',
    skilltable: 'skill_id',
    edutable: 'edu_id',
    protable: 'pro_id',
    internshiptable: 'int_id',
    servtable: 'serv_id'
};

const idColumn = idColumnMap[option];  

   
  const query = `DELETE FROM ${option} WHERE ${idColumn} = ?`;

  connection.query(query, [id], (err, result) => {
      if (err) {
          console.error('Error deleting data:', err.stack);
          res.send('Error deleting data');
          return;
      }
      console.log('Data deleted successfully');
      const rearrangeSql = `
            SET @count = 0;
            UPDATE ${option} SET ${idColumn} = @count := @count + 1;
            ALTER TABLE ${option} AUTO_INCREMENT = 1;
        `;
        connection.query(rearrangeSql, (err, result) => {
            if (err) {
                console.error('Error rearranging IDs:', err);
                return res.status(500).send('Error rearranging IDs');
            }

            console.log('IDs rearranged successfully');
      res.redirect('/admin');  
  });
});
});
app.get('/download-cv/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT cv, name FROM users WHERE id = ?';
  connection.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching CV:', err);
          return res.status(500).send('Error fetching CV');
      }

      if (results.length === 0) {
          return res.status(404).send('CV not found');
      }

      const cv = results[0].cv;
      const fileName = results[0].name + '_CV.pdf';
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(cv);
  });
});


app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
