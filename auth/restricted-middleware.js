module.exports = (req, res, next) => {
    try {
      // if this throws, please don't crash my app
      if (req && req.session && req.session.user) { // Does req.session exist?
        next(); // If yes, move to next thing. If no, finish out this try/catch pattern
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    } catch (error) {
      res.status(500).json({ message: 'you broke it!' });
    }
  };
  