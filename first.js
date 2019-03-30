var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var urlencodedParser = bodyParser.urlencoded({ extended: true });
var mysql = require('mysql');
var fs=require('fs');
var enc=require('bcrypt');
var jwt=require('jsonwebtoken');
var config=require('./configjwt.js');
var mid=require('./middlewarejwt.js');
var uenp = bodyParser.urlencoded({ extended: true });
var url = require('url');
var uni="baljeet";

//mysql connection
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123",
	database: "user"
	});

	con.connect(function(err){
		if(err) 
			return console.error(err.message);
		console.log("connected");
	}); 
	
//server connection
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("listening at %s Port", port)
});

//apps to handle various events 

//start page
app.get('/',function(req,res)
{
	fs.readFile("portal.html",function(err,data){
		if(err)
			throw err;
		else
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			res.end();
	});
});

app.use('/welcome',mid.checkToken,function(req,res){
		res.write('Welcome!');
		res.end();
		//console.log("Welcome");
		});

app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
  
//signup page
app.get('/signup', function (req, res) {
	fs.readFile("signup.html",function(err,data){
		if(err)
			throw err;
		else
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			res.end();
	});
});

//event for sign up
app.post('/thank',uenp, function (req, res){
	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var cpass=req.body.cpassword;
	var phone=req.body.mobilno;
	
	if(password==cpass)
	{
	var check1="Select count(*) As c From register where email=" +'"'+ email+'"';
	con.query(check1,function(err,rows,fields){
	var check2="Select count(*) As u From register where username=" +'"'+ username+'"';
	con.query(check2,function(err,r,f){
	if(rows[0].c>=1)
	{
		fs.readFile("signup.html",function(err,data){
		if(err)
			throw err;
		else
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("Invalid emailId, please sign up again");
			res.write(data);
			res.end();
	});
	}
	else if(r[0].u>=1)
	{
		fs.readFile("signup.html",function(err,data){
		if(err)
			throw err;
		else
			
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("Username already Taken, please sign up again");
			res.write(data);
			res.end();
	});
	}
	else{
		enc.hash(password,10,function(err,hash){
	var q="INSERT INTO register(email,username,password,name,phone) VALUES (" + '"'+ email +'"'+ ',' +'"'+ username +'"'+ ',' +'"'+ hash +'"'+ ',' +'"'+ name +'"'+ ',' +'"'+ phone +'"'+ ")";
		con.query(q,function(err,result)
					{
					console.log("added");
					}
				);
		});
	 var token = jwt.sign({username:uni},config.secret,{expiresIn:'10'});
	//req.json({success:true,message:'Authentication successful',token:token});
	//res.set('x-access-token',token);
	res.redirect('/welcome?token='+token);
	}
	});
	});
	}
	else
	{
		fs.readFile("signup.html",function(err,data){
		if(err)
			throw err;
		else
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("Password didn't match, please sign up again");
			res.write(data);
			res.end();
	});
	}
});



app.get('/signin', function (req, res) {
	fs.readFile("signin.html",function(err,data){
		if(err)
			throw err;
		else
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			res.end();
	});
});

app.post('/thank2', uenp,function (req, res){
	var username=req.body.username;
	var password=req.body.password;
	
	var check1="Select count(*) As c From register where username=" +'"'+username+'"';
	con.query(check1,function(err,rows,fields){
		if(rows[0].c!=1)
	{
		fs.readFile("signin.html",function(err,data){
		if(err)
			throw err;
		else
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("Invalid Username, please sign in again");
			res.write(data);
			res.end();
		});
	}
	else
	{
		var check2="Select * From register where username=" +'"'+username+'"';
	con.query(check2,function(err,r,f){
		enc.compare(password,r[0].password,function(err,res1){
		if(!res1)
		{
			fs.readFile("signin.html",function(err,data){
		if(err)
			throw err;
		else
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("Incorrect Password, please sign in again");
			res.write(data);
			res.end();
			});
		}
		else
		{
			var token = jwt.sign({username: uni},config.secret,{expiresIn:'10'});
	//req.json({token:token});
	//res.headers.add("x-access-token",token);
	//console.log(token);
	//console.log(res.headers['x-access-token']);
res.redirect('/welcome?token='+token);
		}
		});
	});
	}
});
});
