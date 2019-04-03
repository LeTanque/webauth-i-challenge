const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');
const restricted = require('../auth/restricted-middleware.js');

const errors = { // J.Pinkman Dynamic error messaging based on sqlite codes 
  '1': 'We ran into an error, yo! I dunno!',
  '4': 'Operation aborted, yo!',
  '9': 'Operation aborted, yo!',
  '19': 'Another record with that value exists, yo!'
};



// Auth endpoints
// POST add user to /api/register. Username and password required. Username must be unique, tested in users-model. 
// SQLITE error message deconstructed to let user know if user already exists.
router.post('/register', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ message:"Username and Password required" })
  }
  let userCredentials = req.body;
  const hash = bcrypt.hashSync(userCredentials.password, 10); // 2 ^ n
  userCredentials.password = hash;

  Users.add(userCredentials)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      const message = errors[error.errno] || 'We ran into an error, yo! Crazy!';
      res.status(500).json({ message });
    });
});


// POST route for login. 
router.post('/login', (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // req.session is added by express-session
        req.session.user = user;

        res.status(200).json({
          message: `Welcome ${user.username}! User ID: ${req.session.user.id}`,
        });
      } else {
        res.status(401).json({ message:"You shall not pass!" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


// GET for logout
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({
          message:
            'you can check out any time you like, but you can never leave',
        });
      } else {
        res.status(200).json({ message: 'bye, thanks for visiting' });
      }
    });
  } else {
    res.status(200).json({ message: 'bye, thanks for visiting' });
  }
});


router.get('/users', restricted, (req, res) => {
  Users.get()
    .then(usersWithID => {
      res.json(usersWithID);
    })
    .catch(error => {
      res.status(401).json({ message:"You shall not pass!", error:error });
    });
})


module.exports = router;
