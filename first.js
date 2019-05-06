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
var formidable = require('formidable');


//app.use(cookieparser());
app.engine('html', require('ejs').renderFile);
app.use(flash());

app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
 app.use(bodyParser.json());

//server connection
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("listening at %s Port", port)
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


app.post('/comment',function(req,res){
	var q=url.parse(req.url,true);
	var query=q.query;
	var usern=query.user1;
	var type=req.body.type;
	var comm=req.body.comment;
	var check2="Select email From register where username=" +'"'+ usern+'"';
	con.query(check2,function(err,r,f){
	var email=r[0].email;
	
	var q="INSERT INTO query(Query_type,query,email) VALUES (" + '"'+ type +'"'+ ',' +'"'+ comm +'"'+ ',' +'"'+ email +'"'+")";
		con.query(q,function(err,result)
					{
					console.log("Query added");
					}
				);
	var mssg="Your Query has been posted"
	var q2="select Query from query where email='"+email+"'"+";"
		var q3="select answer from query where email='"+email+"'"+";"
	con.query(q2,function(err,row1)
	{
		con.query(q3,function(err,row2)
		{

	res.render("C:/Users/dell/Desktop/EAD/project/forms/announcement2.html",{usern:usern,mssg:mssg,qu:JSON.stringify(row1),ans:JSON.stringify(row2)});
		});
	});
	});
});

 
app.post('/passwordsend.html',function(req,res){
		var check="Select count(*) as c from register where username = "+'"'+ req.body.username+'"'+";";

		con.query(check,function(err,row)
		{

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


app.get('/resource', function(req, res){
	var q=url.parse(req.url,true);
	var query=q.query;
	var usern=query.user1;
	if(usern.includes("ebcss"))
	{
		var log2="Select count(*) As c From register where username=" +'"'+ usern+'"';
	con.query(log2,function(err,r,f)
	{
		if(r[0].c>=1)
		{
	var log1="select login from register where username=" +'"'+ usern+'"';
	con.query(log1,function(err,row,field)
	{
		if(row[0].login==1)
		{

  var fileindir =  fs.readdirSync('C:/Users/dell/Desktop/EAD/project/Resource/');

  res.render("C:/Users/dell/Desktop/EAD/project/forms/resource2.html",{files:fileindir,usern:usern});
		}
		else
		{
			var name="Please sign in to access the webpage";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
		}
		else
		{
			var name="To access the page please signin";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
	}	
		else
		{
	var log2="Select count(*) As c From register where username=" +'"'+ usern+'"';
	con.query(log2,function(err,r,f)
	{
		if(r[0].c>=1)
		{
	var log1="select login from register where username=" +'"'+ usern+'"';
	con.query(log1,function(err,row,field)
	{
		if(row[0].login==1)
		{

  var fileindir =  fs.readdirSync('C:/Users/dell/Desktop/EAD/project/Resource/');
 
  res.render("C:/Users/dell/Desktop/EAD/project/forms/resource.html",{files:fileindir,usern:usern});
		}
		else
		{
			var name="Please sign in to access the webpage";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
		}
		else
		{
			var name="To access the page please signin";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
	}
 
});

app.get('/aboutus', function(req, res){
	var q=url.parse(req.url,true);
	var query=q.query;
	var usern=query.user1;
	var log2="Select count(*) As c From register where username=" +'"'+ usern+'"';
	con.query(log2,function(err,r,f)
	{
		if(r[0].c>=1)
		{
	var log1="select login from register where username=" +'"'+ usern+'"';
	con.query(log1,function(err,row,field)
	{
		if(row[0].login==1)
		{
			res.render("C:/Users/dell/Desktop/EAD/project/forms/aboutus.html",{usern:usern});
		}
		else
		{
			var name="Please sign in to access the webpage";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
		}
		else
		{
			var name="To access the page please signin";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
 
});

app.get('/announcement', function(req, res){
	var q=url.parse(req.url,true);
	var query=q.query;
	var usern=query.user1;
	var log2="Select count(*) As c From register where username=" +'"'+ usern+'"';
	con.query(log2,function(err,r,f)
	{
		if(r[0].c>=1)
		{
	var log1="select login from register where username=" +'"'+ usern+'"';
	con.query(log1,function(err,row,field)
	{
		if(row[0].login==1)
		{
			res.render("C:/Users/dell/Desktop/EAD/project/forms/announcement.html",{usern:usern});
		}
		else
		{
			var name="Please sign in to access the webpage";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
		}
		else
		{
			var name="To access the page please signin";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
 
});


app.get('/events', function(req, res){
	var q=url.parse(req.url,true);
	var query=q.query;
	var usern=query.user1;
	var log2="Select count(*) As c From register where username=" +'"'+ usern+'"';
	con.query(log2,function(err,r,f)
	{
		if(r[0].c>=1)
		{
	var log1="select login from register where username=" +'"'+ usern+'"';
	con.query(log1,function(err,row,field)
	{
		if(row[0].login==1)
		{
			res.render("C:/Users/dell/Desktop/EAD/project/forms/events.html",{usern:usern});
		}
		else
		{
			var name="Please sign in to access the webpage";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
		}
		else
		{
			var name="To access the page please signin";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
 
});


app.get('/home2', function(req, res){
	var q=url.parse(req.url,true);
	var query=q.query;
	var usern=query.user1;
	var log2="Select count(*) As c From register where username=" +'"'+ usern+'"';
	con.query(log2,function(err,r,f)
	{
		if(r[0].c>=1)
		{
	var log1="select login from register where username=" +'"'+ usern+'"';
	con.query(log1,function(err,row,field)
	{
		if(row[0].login==1)
		{
			res.render("C:/Users/dell/Desktop/EAD/project/forms/home2.html",{usern:usern});
		}
		else
		{
			var name="Please sign in to access the webpage";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
		}
		else
		{
			var name="To access the page please signin";
		 res.render("C:/Users/dell/Desktop/EAD/project/forms/signin2.html", {name:name});
		}
	});
 
});



app.get('/download',function(req,res){
	var q=url.parse(req.url,true);
	var query=q.query;
	var file=query.file;
	res.download("C:/Users/dell/Desktop/EAD/project/Resource/"+file);
});

app.post("/fileupload",function(req,res)
{
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/dell/Desktop/EAD/project/Resource/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
		   var fileindir =  fs.readdirSync('C:/Users/dell/Desktop/EAD/project/Resource/');
				res.render("C:/Users/dell/Desktop/EAD/project/forms/resource2.html",{files:fileindir,usern:""});
      });
 });
});
	

//start page
app.get('/',function(req,res)
{
	res.redirect('/main1.html');
	
});



app.use('/welcome',mid.checkToken,function(req,res){
		
		var q = url.parse(req.url, true);
		var qdata = q.query; 
		var usern =qdata.username; 
		
		res.render("C:/Users/dell/Desktop/EAD/project/forms/homepage.html",{usern:usern});
		say.speak('Welcome to ACM-CSS');
});

app.get('/logout',function(req,res){
	var q = url.parse(req.url, true);
		var qdata = q.query; 
		var usern =qdata.user1; 
	var log1="update register set login=0 where username=" +'"'+ usern+'"';
	con.query(log1,function(err)
		{
			if(err)
				console.log(err);
		});
	res.render("C:/Users/dell/Desktop/EAD/project/forms/main1.html",{usern:usern});
});


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
	var q="INSERT INTO register(email,username,password,name,phone,login) VALUES (" + '"'+ email +'"'+ ',' +'"'+ username +'"'+ ',' +'"'+ hash +'"'+ ',' +'"'+ name1 +'"'+ ',' +'"'+ phone +'"'+ ',1'+")";
		con.query(q,function(err,result)
					{
					console.log("added");
					}
				);
		});
	 var token = jwt.sign({username:uni},config.secret,{expiresIn:'10'});
	
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
			var ins="update register set login=1 where username="+'"'+username+'";';
			con.query(ins,function(err){
			var token = jwt.sign({username: uni},config.secret,{expiresIn:'10'});
		res.redirect('/welcome?token='+token+'&username='+username);
			});
		}
		});
	});
	}
});
});