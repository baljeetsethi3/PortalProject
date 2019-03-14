var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var mysql = require('mysql');
var fs=require('fs');

//mysql connection
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "protista",
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
  console.log("Example app listening at %s:%s Port", host, port)
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
app.post('/thank', urlencodedParser, function (req, res){
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
	var q="INSERT INTO register(email,username,password,name,phone) VALUES (" + '"'+ email +'"'+ ',' +'"'+ username +'"'+ ',' +'"'+ password +'"'+ ',' +'"'+ name +'"'+ ',' +'"'+ phone +'"'+ ")";
		con.query(q,function(err,result)
					{
					console.log("Added");
					}
				);
	res.send("Thanks");
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

app.post('/thank2', urlencodedParser, function (req, res){
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
		if(r[0].password != password)
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
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("Welcome!!");
			res.end();
		}
	});
	}
});
});