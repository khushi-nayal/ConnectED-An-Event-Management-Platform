const express = require("express");
const app = express();

var path = require("path");

var bodyParser = require("body-parser");
app.use(express.static(path.join(__dirname, "public")));
const expressHandlebars = require("express-handlebars");

app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mysql = require("mysql");
const { response } = require("express");
const { DEC8_BIN } = require("mysql/lib/protocol/constants/charsets");
var connection = mysql.createConnection({
  host: "localhost",
  //port: "3307",
  user: "root",
  password: "Muskan@182728",
  database: "connectdatabase",
  insecureAuth: true,
  multipleStatements: true,
});

connection.connect((err) => {
    if (!err) {
      console.log("DB CONNECTION SUCCEEDED");
    } else {
      console.log("DB CONNECTION FAILED \n Error :" + JSON.stringify(err));
    }
  });

  var currentUser;
  var currentUserEmail;
  var currentUserPhoneNumber;
  var currentUserType;
  var currentEventId
//   var currentShelterID;
//   var userNavbar;
app.get("/", (req, res) => {
    res.render("login.ejs");
  });

  app.get('/login',(req, res)=>{
    res.render('login.ejs')
})
  app.get('/rsvpsuccessful',(req, res)=>{
    res.render('rsvpsuccessful.ejs')
})
   app.get('/signup',(req, res)=>{
    res.render('signup.ejs')
})
app.get('/newrequest',(req, res)=>{
    res.render('newrequest.ejs')
})
app.get('/organiser',(req, res)=>{
    res.render('organiser_home.ejs')
})

app.post("/auth", function (request, response) {
    var email = request.body.emailid;
    var password = request.body.password;
    console.log(email);
    console.log(password);
    if (email && password) {
        console.log("Going in");
      connection.query(
        "SELECT * FROM UserInfo WHERE Email_Id = ? AND Password = ?",
        [email, password],
        function (error, results, fields) {
          if (results.length > 0) {
            currentUserID = results[0].Email_Id;
            currentUser = results[0].Name;
            currentUserType = results[0].Access_Level;
            currentUserPhoneNumber = results[0].Phone_Number;
            // currentShelterID = results[0].Shelter_ID;
            currentUserEmail=results[0].Email_Id;
            console.log("user ID",currentUserID);
    // if(currentUserType==1)
    // userNavbar="adoption_navbar";
    // else if(currentUserType==2)
    // userNavbar="user_navbar";
    // else if(currentUserType==3)
    // userNavbar="petsitternavbar";
    // console.log("usernavbar",userNavbar);
            console.log(currentUserID);
            console.log(results[0].Name);
            if(currentUserType==2)
            {
              response.render("organiser_home.ejs", { data: currentUser });
            }
            else if (currentUserType==1)
            {
              response.render("admin_home.ejs");
            }
            else if (currentUserType==3)
            { 
                return response.redirect('/upcomingevents');
            //   response.render("upcomingevents.ejs");
            }
            
          } else {
            message = "Incorrect Email and/or Password!";
            //res.send(message);
            response.render("message.ejs", { data: message });
            //response.send('Incorrect Username and/or Password!');
          }
          response.end();
        }
      );
    } else {
      response.send("Please enter Username and Password!");
      response.end();
    }
  });

  app.post("/signup", function (req, res) {
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    var new_pass = req.body.cpassword;
    var phone = req.body.phone;
    var department = req.body.department;
    var occupation=req.body.occupation;
    console.log(password);
  
    if (email && password && name && new_pass) {
        if (password == new_pass) {
        //   if (petsitter == 3) {
            connection.query(
             "INSERT INTO UserInfo (`Email_Id`, `Name`, `Password`, `Phone_Number`, `Department`, `Occupation`) VALUES(?,?,?,?,?,?)",
    [email, name ,password, phone, department, occupation],
              function (error, results, fields) {
                if (!error) {
                  currentUser = name;
                  userNavbar="petsitternavbar";
                  currentUserEmail=email;
                  res.render("home.ejs", { data: currentUser });
                } else {
                  message = "Something went wrong...";
                  //res.send(message);
                  res.render("message.ejs", { data: message });
                  //response.send('Incorrect Username and/or Password!');
                }
                res.end();
              }
            );
        //   } else {
        //     connection.query(
        //       "INSERT INTO boop_users(Username,Email_ID,Password, User_Type_Code,Location) VALUES(?,?,?,?,?)",
        //       [name, email, password, 2,location],
        //       function (error, results, fields) {
        //         if (!error) {
        //           currentUser = name;
        //           currentUserEmail=email;
        //           userNavbar="user_navbar";
        //           res.render("home.ejs", { data: currentUser });
        //           //res.render("user_signup.ejs", { data: currentUser });
        //         } else {
        //           message = "Something went wrong...";
        //           //res.send(message);
        //           res.render("message.ejs", { data: message });
        //           //response.send('Incorrect Username and/or Password!');
        //         }
        //         res.end();
        //       }
        //     );
        //   }
        } 
        else {
          message = "Passwords do not match!";
          res.render("message.ejs", { data: message });
          //response.send('Please enter all the details!');
          res.end();
        }
      } else {
        message = "Please enter all the details!";
        res.render("message.ejs", { data: message });
        //response.send('Please enter all the details!');
        res.end();
      }
    });

app.listen(3307, ()=>{
    console.log("Server running");
})

// app.get('/insert',(req, res)=>{
//     connection.query('INSERT INTO UserInfo (`Email_Id`, `Name`, `Password`, `Access_Level`, `Phone_Number`, `Department`, `Occupation`) VALUES ("jg250@snu.edu.in", "Jyothis Mahadev", "pass123", 3, 9857321303, "CSE", "Student")',
//     (err, result)=>{
//         if(err)
//         console.log(err);
//         res.send(result);
//     })
// })

app.post("/newrequest", function (req, res) {
    var id= Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    console.log(id);
    var name = req.body.org;
    // var email = req.body.email;
    var eventname =req.body.eventname;
    var eventdate=req.body.eventdate;
    var venue = req.body.venue;
    var starttime = req.body.stiming;
    var endtime = req.body.etiming;
    var fee = req.body.fee;
    var budgetreq=req.body.request;
    var justification=req.body.justification;
    var description=req.body.description;
    var material=req.body.matreq;
    console.log(name);
    console.log(eventname);
    console.log(venue);
    console.log(endtime);
    console.log(starttime);
    console.log(fee);
    console.log(budgetreq);
    console.log(material);
  
    if (name && eventname && eventdate && venue && starttime && endtime && fee && budgetreq && material) {
        // if (password == new_pass) {
            connection.query(
             "INSERT INTO EventRequest (`Event Id`, `Organizer`, `Event_Name`, `Event_Date`, `Venue`, `Start_Time`, `End_Time`, `Entry_Fee`, `Budget_Request`, `Budget_Justification`, `Description`, `Material_Requirement`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [id, name ,eventname, eventdate, venue, starttime, endtime, fee, budgetreq, justification, description, material],
              function (error, results, fields) {
                if (!error) {
                  currentUser = name;
                  currentUserEmail= name;
                  currentEventId=id;
                  message="Request Sent";
                  res.render("message.ejs", { data: message });
                } else {
                  console.log(error);
                  message = "Something went wrong...";
                  res.render("message.ejs", { data: message });
                }
                res.end();
              }
            );
    
        } 
    //     else {
    //       message = "Passwords do not match!";
    //       res.render("message.ejs", { data: message });
    //       //response.send('Please enter all the details!');
    //       res.end();
    //     }
    //   } 
    else {
        message = "Please enter all the details!";
        res.render("message.ejs", { data: message });
        //response.send('Please enter all the details!');
        res.end();
      }
    });

    app.get("/viewsentrequest", function (req, res) {
        console.log(currentUserEmail);
        connection.query(
            "SELECT * from EventRequest where Organizer=?",[currentUserEmail],
            (err, rows, fields) => {
              if (!err) {
                console.log("sent status!! ", rows);
                 res.render("viewsentrequest.ejs", { datatable: rows});
              } else {
                console.log(err);
              }
            }
          );
    });

    app.get("/getrequest", (req, res) => {
        connection.query(
            "SELECT Event_Id, Organizer, Event_Name, Event_Date, Venue, Start_Time, End_Time, Entry_Fee, Budget_Request, Budget_Justification, Description, Material_Requirement FROM EventRequest where Status='0' ",
            (err, rows, fields) => {
              if (!err) {
                console.log("YAYYY");
                console.log(rows);
                res.render("approverequest.ejs", { datatable: rows });
              } else {
                console.log(err);
              }
            }
          );
        });

        
  app.post("/rejectrequest", (req, res) => {
    console.log("Request rejected");
    currentEventId= req.body.Event_Id;
    console.log(currentEventId);
    console.log(req.body);
    connection.query(
      "UPDATE EventRequest SET Status=2 WHERE Event_id=?",
      [req.body.Event_Id],
      (err, rows, fields) => {
        if (!err) {
          console.log("DONEEEEE");
          res.render("rejectrequest.ejs", { datatable: rows});
          // connection.query(
          //   "SELECT * FROM pet_sitter_interest",
          //   (err, rows, fields) => {
          //     if (!err) {
          //       res.render("petsitteracceptsuccess.ejs", { datatable: rows });
          //     } else {
          //       console.log(err);
          //     }
          //   }
          // );
        } else {
          console.log(err);
        }
      }
    );
  });

  app.post("/acceptpage", (req, res) => {
    console.log("Accept request");
    currentEventId= req.body.Event_Id;
    console.log(currentEventId);
    console.log(req.body);
    connection.query(
      "UPDATE EventRequest SET Status=1 WHERE Event_id =?",
      [req.body.Event_Id],
      (err, rows, fields) => {
        if (!err) {
          console.log("DONEEEEE");
          res.render("acceptpage.ejs", { datatable: rows});
        } else {
          console.log(err);
        }
      }
    );
  });

  app.post("/viewrequest", (req, res) => {
    console.log("View Request");
    connection.query(
        "SELECT Event_Id, Organizer, Event_Name, Event_Date, Venue, Start_Time, End_Time, Entry_Fee, Budget_Request, Budget_Justification, Description, Material_Requirement FROM EventRequest where Event_Id=? ",[req.body.Event_Id],
        (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            res.render("viewrequest.ejs", { datatable: rows });
          } else {
            console.log(err);
          }
        }
      );
  });

  app.get("/upcomingevents", (req, res) => {
    connection.query(
        "SELECT Event_Id,Event_Name, Venue, Event_Date, Start_Time,End_Time FROM EventRequest where Status=1",
        (err, rows, fields) => {
          if (!err) {
            console.log("Displaying events");
            console.log(rows);
            res.render("upcomingevents.ejs", { datatable: rows });
          } else {
            console.log(err);
          }
        }
      );
    });

    app.post("/rsvprequest", (req, res) => {
        console.log("View Request");
        console.log(req.body.Event_Id);
        connection.query(
            "UPDATE EventRequest SET RSVP=RSVP+1 where Event_Id=?",[req.body.Event_Id],
            (err, rows, fields) => {
              if (!err) {
                console.log(rows);
                res.render("rsvpsuccessful.ejs", { datatable: rows });
              } else {
                console.log(err);
              }
            }
          );
      });

      app.get("/upcomingeventlist", (req, res) => {
        connection.query(
            "SELECT Event_Id,Event_Name, Venue, Event_Date, Start_Time,End_Time FROM EventRequest where Status=1",
            (err, rows, fields) => {
              if (!err) {
                console.log("Displaying event list");
                console.log(rows);
                res.render("upcomingeventlist.ejs", { datatable: rows });
              } else {
                console.log(err);
              }
            }
          );
        });


