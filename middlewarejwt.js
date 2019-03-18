var jwt = require('jsonwebtoken');
var config = require('./configjwt.js');
var url = require('url');
var uni="baljeet";

var checkToken = function(req, res, next) {
  var q = url.parse(req.url, true);
var qdata = q.query; 
//console.log(qdata.token); 
  var token =qdata.token; 
  /*if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }*/

  if (token) {
	  var verify = jwt.sign({username:uni},config.secret,{expiresIn:'10'});
		if (token == verify)
        next();
		else
		{
			return res.json({
      success: false,
      message: 'Unauthorized login'
			});
		}
  }
  else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken
}