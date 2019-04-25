var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var auth = require('./auth/index')
var cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

//Helper Functions
function validUser(user) {
  const validEmail = typeof user.email == 'string' && user.email.trim() != '';
  const validPassword = typeof user.password == 'string' &&
    user.password.trim() != '' &&
    user.password.trim().length >= 6;

  return validEmail && validPassword;
}

//Generates a random string of 6 letters and numbers
function generateRandomString() {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 7; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

//All GET routes here
app.get("/", (req, res) => {
  res.render("index.ejs");
});

//register page users who are not already registered can register.
//changes routes names from /register
app.get("/users/new", (req, res) => {
  let templateVars = { users: users[req.session["userId"]], showLogin: false };
  res.render("urls_register", templateVars);
});

app.post("/users", (req, res) => {
  const randomID = generateRandomString();
  const { email, password } = req.body;
  // const newUser = {
  //   id: randomID,
  //   email,
  //   password: hashedPassword
  // };

  if (validUser(email, password)) {
    // users[randomID] = newUser;
    req.session.userId = randomID;
    res.redirect("/");
  } else if (!email || !password) {
    res.send("UH OH Please try Again!");
  } else {
    res.status(400).send("You are already a registered user");
  }
});

// //Login page where only registered users can login
// app.get("/login", (req, res) => {
//   let templateVars = { urls: urlDatabase, users: users[req.session["userId"]] };
//   res.render("urls_login", templateVars);
// });

// //Login page retrieve users who have already registered using the helper function up top. Error messages if not already registered.
// app.post("/login", (req, res) => {
//   const user = retrieveUser(req.body.email, req.body.password);
//   if (user) {
//     req.session.userId = user.id;
//     res.redirect("/urls");
//   } else {
//     res.status(400).send("THOU shalt not pass");
//   }
// });

// //Logout button application, redirects to login and deletes session encrypted cookie.
// app.post("/logout", (req, res) => {
//   req.session = null;
//   res.redirect("/");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





//Helper functions here
//generates a hashed password using bcrypt
// function genHashPassword(value) {
//   return (hashedPassword = bcrypt.hashSync(value, 10));
// }

// //Generates a random string of 6 letters and numbers
// function generateRandomString() {
//   let text = "";
//   let possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   for (let i = 0; i < 7; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// }

// //Retrieves user info to cross refernce against input login registration user data.
// function retrieveUser(email, password) {
//   for (username in users) {
//     let userEmail = users[username]["email"];
//     let userPassword = bcrypt.compareSync(
//       password,
//       users[username]["password"]
//     );
//     if (email === userEmail && userPassword) {
//       return users[username];
//     }
//   }
//   return false;
// }

// //Function that makes sure the user is logged in to view urls on main urls page.
// function userUrls(userId) {
//   let urls = {};
//   for (shorturl in urlDatabase) {
//     if (userId === urlDatabase[shorturl].userID) {
//       urls[shorturl] = urlDatabase[shorturl];
//     }
//   }
//   return urls;
// }

//Main urls page where only logged in user can create edit or delete urls.
// app.get("/urls", (req, res) => {
//   let templateVars = {
//     users: users[req.session["userId"]],
//     urls: userUrls(req.session["userId"])
//   };
//   res.render("urls_index", templateVars);
// });

//Page where logged in registered user can create or add new urls to there profile.
// app.get("/urls/new", (req, res) => {
//   let templateVars = { users: users[req.session["userId"]] };
//   res.render("urls_new", templateVars);
// });


//short urls verification page.
// app.get("/urls/:shortURL", (req, res) => {
//   let templateVars = {
//     shortURL: req.params.shortURL,
//     longURL: urlDatabase[req.params.shortURL],
//     users: users[req.session["userId"]]
//   };
//   if (!req.session["userId"]) {
//     res.status(400).send('get the heck outta here!')
//   } else {
//     res.render("urls_show", templateVars);
//   }
// });


// app.get("/u/:shortURL", (req, res) => {
//   const longURL = urlDatabase[req.params.shortURL].longURL;
//   res.redirect(longURL);
// });

//All POST routes here
// app.post("/urls", (req, res) => {
//   const i = generateRandomString();
//   urlDatabase[i] = {
//     longURL: req.body.longURL,
//     userID: req.session["userId"]
//   };
//   res.redirect("/urls");
// });


//Delete urls that only belong to specific longed in user. cookies verify users.
// app.post("/urls/:shortURL/delete", (req, res) => {
//   const userId = urlDatabase[req.params.shortURL].userID;
//   if (userId === req.session["userId"]) {
//     delete urlDatabase[req.params.shortURL];
//     res.redirect("/urls");
//   } else {
//     res.status(400).send("Can't Delete URL");
//   }
// });

//working short url link to long url.
// app.post("/urls/:shortURL/", (req, res) => {
//   if (urlDatabase[req.params.shortURL].userID !== req.session["userId"]) {
//     console.log(urlDatabase[req.params.shortURL].userID)
//     console.log(req.session["userId"])
//     return res.send('get the heck outta here!')
//   } else {
//     urlDatabase[req.params.shortURL].longURL = req.body.longURL;
//     res.redirect("/urls/");
//   }
// });


// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done(users => {
//     for (user of users) {
//       $("<div>")
//         .text(user.name)
//         .appendTo($("body"));
//     }
//   });
// });
