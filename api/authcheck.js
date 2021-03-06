const jwt = require('jsonwebtoken')
const env = require('../env')

const publicUserInfo = (user) => ({
  email: user.email,
  id: user.id
})

module.exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if (bearerHeader) {
    const bearerToken = bearerHeader.split(' ')[1]
    req.token = bearerToken
    jwt.verify(req.token, env.JWTKEY, (err, data) => {
      if (err) return res.sendStatus(403)

      req.user = data
      next()
    })
  } else {
    res.sendStatus(403)
  }
}

module.exports.generateToken = user => {
  return { jotKey: jwt.sign(publicUserInfo(user), env.JWTKEY) }
}