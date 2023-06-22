  const db = require('../db')

  exports.EditWorkersProfile = (req, res) => {
    const { name, email, address, phone_number, workingHours, expertise, profileImage, coverImage, otherImages, myemail, url, more, wpokay } = req.body;
    console.log(profileImage, coverImage, otherImages);
  
    console.log("<", myemail);
  
    // Update the profile data in the service_providers table
    const query = `UPDATE service_providers 
      SET 
      name = ?, 
      description  = ?, 
      address = ?, phone_number = ?, 
      working_hours = ?, 
      expertise = ?,
      profile_image = ?,
      cover_image = ?,
      other_image1 = ?,
      url = ?,
      more = ?,
      wpokay = ?
      WHERE email = ?`;
    console.log(more);
    const values = [name, email, address, phone_number, workingHours, expertise, profileImage, coverImage, otherImages, url, more, wpokay, myemail];
  
    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error updating profile data: ', error);
        res.sendStatus(500); // Internal Server Error
      } else {
        console.log('Profile data updated successfully');
        res.sendStatus(200); // OK
      }
    });
  };
  
   

  exports.ViewProfile = (req, res) => {
    const { email } = req.body;
    console.log(email,'profile');
  
    const sqlQuery = `
      SELECT sp.*, COUNT(l.user_email) AS likes_count
      FROM service_providers AS sp
      LEFT JOIN likes AS l ON sp.email = l.user_email
      WHERE sp.email = ?
    `;
  
    db.query(sqlQuery, [email], (err, result) => {
      if (err) {
        console.error('Error retrieving profile:', err);
        res.status(500).json({ error: 'An error occurred while retrieving profile' });
        return;
      }
  
      if (result.length > 0) {
        console.log("Profile retrieved successfully");
        console.log(result);
        res.send(result);
      } else {
        res.send([]);
      }
    });
  };
    

  exports.ViewServices = (req, res) => {
    const sqlQuery = 'SELECT * FROM service_providers WHERE type = "vendors" AND name != "Vendor" and description != "" and expertise != "";';
    const workSqlQuery = `UPDATE service_providers AS sp
      SET likes = (
          SELECT COUNT(*) 
          FROM likes 
          WHERE post_email = sp.email
          GROUP BY post_email
      );`;
  
    db.query(workSqlQuery, (err) => {
      if (err) {
        console.error('Error updating likes count:', err);
        res.status(500).json({ error: 'An error occurred while updating likes count' });
        return;
      }
  
      db.query(sqlQuery, (err, result) => {
        if (err) {
          console.error('Error retrieving service providers:', err);
          res.status(500).json({ error: 'An error occurred while retrieving service providers' });
          return;
        }
  
        res.send(result);
      });
    });
  };
  
  exports.postComment = (req, res) => {
    let { myemail, toemail, content } = req.body;
    myemail = myemail;
    toemail = toemail.email;
  
    const sqlQuery = `INSERT INTO comments (comment_text, created_at, updated_at, user_email, post_email) VALUES (?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), ?, ?)`;
    db.query(sqlQuery, [content, myemail, toemail], (err, result) => {
      if (err) {
        // Handle any errors that occurred during the query
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while adding the comment.' });
      }
  
      // Return a success response
      res.json({ message: 'Comment added successfully.' });
    });
  };
    

  exports.getComments = (req, res) => {
    const { email } = req.body;
    console.log(email.email);
  
    const sqlQuery = 'SELECT * FROM comments WHERE post_email = ? ORDER BY created_at DESC';
    db.query(sqlQuery, [email.email], (err, result) => {
      if (result && result.length > 0) {
        console.log("here", email.email);
        res.send(result);
      } else {
        res.send([]);
      }
    });
  };
  
  exports.totalLikes = (req, res) => {
    const { email } = req.body;
    console.log("Check", email);
  
    const sqlQuery = 'SELECT COUNT(*) AS total FROM likes WHERE post_email = ?';
    db.query(sqlQuery, [email.email], (err, result) => {
      if (result.length > 0) {
        console.log(result[0].total);
        res.send({ total: result[0].total });
      } else {
        res.send([]);
      }
    });
  };
  
  exports.isLiked = (req, res) => {
    const { user_email, post_email } = req.body;
  
    const sqlQuery = 'SELECT * FROM likes WHERE user_email = ? AND post_email = ?';
  
    db.query(sqlQuery, [user_email, post_email.email], (err, result) => {
      if (err) {
        console.error('Error checking like status:', err);
        res.status(500).json({ error: 'An error occurred while checking like status' });
        return;
      }
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send([]);
      }
    });
  };
  exports.AddLike = (req, res) => {
    const { user_email, post_email } = req.body;
  
    const checkSqlQuery = 'SELECT * FROM likes WHERE user_email = ? AND post_email = ?';
    const deleteSqlQuery = 'DELETE FROM likes WHERE user_email = ? AND post_email = ?';
    const insertSqlQuery = 'INSERT INTO likes (user_email, post_email) VALUES (?, ?)';
  
    db.query(checkSqlQuery, [user_email, post_email.email], (err, result) => {
      if (err) {
        console.error('Error checking like status:', err);
        res.status(500).json({ error: 'An error occurred while checking like status' });
        return;
      }
  
      if (result.length > 0) {
        // Like exists, so delete it
        db.query(deleteSqlQuery, [user_email, post_email.email], (err, result) => {
          if (err) {
            console.error('Error deleting like:', err);
            res.status(500).json({ error: 'An error occurred while deleting the like' });
            return;
          }
          // Like deleted successfully
          res.status(200).json({ message: 'Like deleted' });
        });
      } else {
        // Like doesn't exist, so insert it
        db.query(insertSqlQuery, [user_email, post_email.email], (err, result) => {
          if (err) {
            console.error('Error adding like:', err);
            res.status(500).json({ error: 'An error occurred while adding the like' });
            return;
          }
          // Like added successfully
          res.status(200).json({ message: 'Like added' });
        });
      }
    });
  };
  
  exports.EnquiryForm = (req, res) => {
    const { name, email, message, number, toemail } = req.body;
    console.log("here");
    const sqlQuery = 'INSERT INTO enquires (name, email, message, number, toemail) VALUES (?, ?, ?, ?, ?)';
    db.query(sqlQuery, [name, email, message, number, toemail], (err, result) => {
      if (err) {
        console.error('Error inserting enquiry:', err);
        res.status(500);
        return;
      }
      res.status(200).send({ status: 'ok' });
    });
  };
  
  exports.GetAllForms = (req, res) => {
    const { email } = req.body;
    console.log(email);
    const sqlQuery = 'SELECT * FROM enquires WHERE toemail = ? ORDER BY attime DESC';
    db.query(sqlQuery, [email], (err, result) => {
      if (err) {
        console.error('Error retrieving forms:', err);
        res.status(500).json({ error: 'An error occurred while retrieving forms' });
        return;
      }
      res.send(result);
    });
  };
    
  exports.GetAllLikes = (req,res) => {
    const {email} = req.body
    console.log(';olikes',email)
    const mysql = 'select * from likes where post_email=?'
    db.query(mysql,[email],(err,result)=>
    {
      if(result.length>0)
      {
        
        res.send(result)
      }
      if (result.length===0)
      { 
        res.send([])
      }
      if (err){
        console.log("eror",result)
      }
    })
  }
  
  
  exports.GetProfilePicture = (req,res) => {
    const {email} = req.body
    const mysql = 'select profile_image from service_providers where email=?'
    db.query(mysql,[email],(err,result)=>{
      if (result && result.length>0)
      {
        console.log("result",result[0])
        res.send(result[0])
      }
    })
  }