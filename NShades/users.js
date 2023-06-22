const jwt =  require('jsonwebtoken')
const db = require('../db')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  db.query('SELECT * FROM users WHERE email=?', [email], (err, result) => {
    if (err) {
      console.error('Error querying database', err);
      res.sendStatus(500);
    } else if (result.length > 0) {
      const hashedPassword = result[0].password; // Get the hashed password from the database
      
      bcrypt.compare(password, hashedPassword, (compareErr, isMatch) => {
        if (compareErr) {
          console.error('Error comparing passwords', compareErr);
          res.sendStatus(500);
        } else if (isMatch) {
          const jwttoken = jwt.sign({ userId: result[0].userid }, 'codewell-keshav');
          const token = { user: true };
          console.log("oka")
          res.status(200).send({ token });
        } else {
            res.status(404).send({user:false});
          console.log('NO okat')
          
        }
      });
    } else {
      res.sendStatus(404);
    }
  });
};

exports.loginVendor = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  db.query('SELECT * FROM service_providers WHERE email=?', [email], (err, result) => {
    if (err) {
      console.error('Error querying database', err);
      res.sendStatus(500);
    } else if (result.length > 0) {
      const hashedPassword = result[0].password; // Get the hashed password from the database
      
      bcrypt.compare(password, hashedPassword, (compareErr, isMatch) => {
        if (compareErr) {
          console.error('Error comparing passwords', compareErr);
          res.sendStatus(500);
        } else if (isMatch) {
          const jwttoken = jwt.sign({ userId: result[0].userid }, 'codewell-keshav');
          const token = { user: true };
          console.log("oka")
          res.status(200).send({ token });
        } else {
            res.status(404).send({user:false});
          console.log('NO okat')
          
        }
      });
    } else {
      res.sendStatus(404);
    }
  });
};
  
  exports.changePassword = (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    console.log("fsfs",email,currentPassword,newPassword)

  
    // Check if the user exists in the database
    db.query('SELECT * FROM service_providers WHERE email = ?', [email], (err, result) => {
      if (err) {
        console.error('Error querying database', err);
        res.sendStatus(500);
      } else if (result.length > 0) {
        const hashedPassword = result[0].password; // Get the hashed password from the database
  
        // Compare the current password provided with the hashed password
        bcrypt.compare(currentPassword, hashedPassword, (compareErr, isMatch) => {
          if (compareErr) {
            console.error('Error comparing passwords', compareErr);
            res.sendStatus(500);
          } else if (isMatch) {
            // If the current password is a match, hash the new password
            bcrypt.hash(newPassword, 10, (hashErr, hashedNewPassword) => {
              if (hashErr) {
                console.error('Error hashing new password', hashErr);
                res.sendStatus(500);
              } else {
                // Update the user's password in the database
                db.query('UPDATE service_providers SET password = ? WHERE email = ?', [hashedNewPassword, email], (updateErr) => {
                  if (updateErr) {
                    console.error('Error updating password in the database', updateErr);
                    res.status(500);
                  } else {
                    res.status(200).send({msg:'okay'});
                  }
                });
              }
            });
          } else {
            res.sendStatus(401);
          }
        });
      } else {
        res.sendStatus(404);
      }
    });
  };
  
  



  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("Received", email);
    const ssql = 'SELECT * FROM service_providers WHERE email=?';
    const query = `UPDATE service_providers SET password = ? WHERE email = ?`;
    if (email.length===0)
    {
      return res.status(500).send("error")
    }
  
    db.query(ssql, [email], async (err, result) => {
      if (result.length > 0) {
        const randomString = generateRandomString(10);
        const hashedPassword = await bcrypt.hash(randomString, 10);
        const values = [hashedPassword, email];
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
  
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Password Reset',
          text: `Your new password is: ${randomString}`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('An error occurred while sending the email.');
          } else {
            console.log('Email sent:', info.response);
            db.query(query, values, (err, result) => {
              if (err) {
                console.error('Error updating password:', err);
                res.status(500).send('An error occurred while updating the password.');
              } else {
                console.log('Password updated successfully');
                res.status(200).send('Password reset instructions sent to your email.');
              }
            });
          }
        });
      } else {
        res.status(404).send('User not found.');
      }
    });
  };
  

  
  exports.createServiceProvider = (req, res) => {
    const { email, password } = req.body;
  
    // Check if the email already exists in the users table
    db.query('SELECT * FROM service_providers WHERE email=?', [email], (err, userResult) => {
      if (err) {
        console.error('Error querying database:', err);
        res.sendStatus(500);
      } else if (userResult.length > 0) {
        // Email already exists in the users table
        res.status(409).send({ msg: "Account already exists as a user." });
      } else {
        // Check if the service provider already exists in the database
        db.query('SELECT * FROM service_providers WHERE email=?', [email], (err, providerResult) => {
          if (err) {
            console.error('Error querying database:', err);
            res.sendStatus(500);
          } else if (providerResult.length > 0) {
            // Service provider already exists
            res.status(409).send({ msg: "Account already exists as a service provider." });
          } else {
            // Service provider doesn't exist, create a new provider
            bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
              if (hashErr) {
                console.error('Error hashing password:', hashErr);
                res.status(500).send('Error');
              } else {
                db.query(
                  'INSERT INTO service_providers (email, password, name,profile_image,type) VALUES (?, ?, ?,?,?)',
                  [email, hashedPassword, 'Vendor','https://cdn.pixabay.com/photo/2016/08/31/11/54/icon-1633249_1280.png','vendors'],
                  (insertErr) => {
                    if (insertErr) {
                      console.error('Error creating service provider:', insertErr);
                      res.status(500).send('Error');
                    } else {
                      res.status(201).send({ user: email });
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  };
    