var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs=require('fs');
var enc=require('bcrypt');
var jwt=require('jsonwebtoken');
var config=require('./configjwt.js');
var mid=require('./middlewarejwt.js');
var uenp = bodyParser.urlencoded({ extended: true });
var url = require('url');
var uni="baljeet";
var Pusher=require('pusher');
var path = require('path');
var flash = require('connect-flash');
var say=require('say');
var mailer=require('./mail.js');
var randomstring = require("randomstring");
var cookieparser=require('cookie-parser');
var formidable = require('formidable');


app.use(cookieparser());
app.engine('html', require('ejs').renderFile);
app.use(flash());

app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());

  
app.post('/passwordsend.html',function(req,res){
		var check="Select count(*) as c from register where username = "+'"'+ req.body.username+'"'+";";
		//console.log(req.body.username);
		con.query(check,function(err,row)
		{
			//console.log(req.body.username);
			if(row[0].c==0)
			{
				var name="Invalid Username !";
				res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
			}
			else
			{
				var findemail="Select * from register where username ="+'"' + req.body.username+'"' +";";
				con.query(findemail,function(err,row,fields)
				{
				req.body.email=row[0].email;
				var newpass=randomstring.generate(6);
				req.body.password=newpass;
				enc.hash(newpass,10,function(err,hash){
				var newpass="update register set password="+'"'+hash+'"'+" where username="+'"'+req.body.username+'"'+";";
				con.query(newpass,function(err){
				if(err)
					console.log(err);
						});
				mailer.sendmail(req);
				var name="Your new password is sent to the registered email id";
				res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html",{name:name});
				});
				});
			}
		});
		
});


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


	
app.use(express.static('./forms'));


app.get('/download', function(req, res){
	
  var file =  'C:/Users/dell/Desktop/EAD/project/Resource/';
  res.write(file); // Set disposition and send it.
});


app.post("/fileupload",function(req,res)
{
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/dell/Desktop/EAD/project/Resource/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
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
	res.redirect('/main1.html');
	
});



app.use('/welcome',mid.checkToken,function(req,res){
		//value="true";
		//var q = url.parse(req.url, true);
		//var qdata = q.query; 
		//var usern =qdata.username; 
		//res.cookie(usern,value,{expire:40000+Date.now()});
		//var ssn=req.session;
		//ssn.user="true";
		res.render("C:/Users/dell/Desktop/EAD/project/forms/homepage.html");
		say.speak('Welcome to ACM-CSS');
		//res.write('Welcome!');
		//res.end();
});

/*app.get('/logout',function(req,res){
	res.clearCookie('user');
	res.render("C:/Users/dell/Desktop/EAD/project/forms/main1.html");
});*/


//event for sign up
app.post('/signup',uenp, function (req, res){
	var name1=req.body.name;
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
		var name="Invalid emailId, please sign up again";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signup2.html", {name:name});	
	}
	else if(r[0].u>=1)
	{
		var name="Username already Taken, please sign up again";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signup2.html", {name:name});
	}
	else{
		enc.hash(password,10,function(err,hash){
	var q="INSERT INTO register(email,username,password,name,phone) VALUES (" + '"'+ email +'"'+ ',' +'"'+ username +'"'+ ',' +'"'+ hash +'"'+ ',' +'"'+ name1 +'"'+ ',' +'"'+ phone +'"'+ ")";
		con.query(q,function(err,result)
					{
					console.log("added");
					}
				);
		});
	 var token = jwt.sign({username:uni},config.secret,{expiresIn:'100'});
	
	res.redirect('/welcome?token='+token+'&username='+username);
	}
	});
	});
	}
	else
	{
		var name="Password did not match, please sign up again";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signup2.html", {name:name});
	}
});


app.post('/signin', uenp,function (req, res){
	var username=req.body.username;
	var password=req.body.password;
	
	var check1="Select count(*) As c From register where username=" +'"'+username+'"';
	con.query(check1,function(err,rows,fields){
		if(rows[0].c!=1)
	{
		var name="Invalid Username, please sign in again";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
	}
	else
	{
		var check2="Select * From register where username=" +'"'+username+'"';
	con.query(check2,function(err,r,f){
		enc.compare(password,r[0].password,function(err,res1){
		if(!res1)
		{
			var name="Incorrect Password, please sign in again";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
		else
		{
			var token = jwt.sign({username: uni},config.secret,{expiresIn:'10'});
		res.redirect('/welcome?token='+token+'&username='+username);
		}
		});
	});
	}
});
});

var pusher = new Pusher({
  appId: '743803',
  key: 'ae1ad0b049515ea28202',
  secret: '9d9e9934d6b8166754d8',
  cluster: 'ap2',
  encrypted: true
});

//app.post('/resource.html',function(req,res){
	
	
/*
app.get('/commentbox',function(req,res){
	fs.readFile('commentbox.html',function(err,data){
		if(err)
			throw(err);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.end();
	});
});
	
app.post('/welcome', function(req, res){
	  var q = url.parse(req.url, true);
var qdata = q.query;  
  var username =qdata.username; 
  console.log(req.body);
  console.log(username);

  var newComment = {
    Query_type: req.body.type,
    Query: req.body.comment
  }
  
  pusher.trigger('comments', 'new_comment', newComment);
  res.json({ created: true });
});*/