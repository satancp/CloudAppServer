var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var port = 3000;
var multiparty = require('connect-multiparty');
var multi = multiparty();
var shell = require('shelljs');

app.get('/create/:id', function(req,res){
  fs.mkdirSync("" + req.params.id);
});

app.get('/deploy/:userid/:name/:portnum', function(req,res){
	console.log('do deploy');
	fs.access('./' + req.params.userid + '/' + req.params.name + '.war', fs.F_OK, (err1) => {
		if(err1) {
			fs.access('./' + req.params.userid + '/' + req.params.name + '.zip', fs.F_OK, (err2) => {
				if(err2) {
					
				}
				else {
					fs.access('./' + req.params.userid + '/' + req.params.name + '/Gruntfile.js', fs.F_OK, (err3) => {
						if(err3) {
							fs.access('./' + req.params.userid + '/' + req.params.name + '/app.js', fs.F_OK, (err4) => {
								if(err4) {
									fs.access('./' + req.params.userid + '/' + req.params.name + '/server.js', fs.F_OK, (err5) => {
										if(err5) {

										}
										else {
											shell.exec("sed -i s/listen\\(.*,/listen\\(" + req.params.portnum + ",/ " + './' + req.params.userid + '/' + req.params.name + '/server.js', {silent:false}).stdout;
											shell.exec("node ./" + req.params.userid + "/" + req.params.name + "/server.js", {silent:false}).stdout;
										}
									})
								}
								else {
									shell.exec("sed -i s/listen\\(.*,/listen\\(" + req.params.portnum + ",/ " + './' + req.params.userid + '/' + req.params.name + '/app.js', {silent:false}).stdout;
									shell.exec("node ./" + req.params.userid + "/" + req.params.name + "/app.js", {silent:false}).stdout;
								}
							})
						}
						else {
							shell.exec("cd " + req.params.userid + "/" + req.params.name, {silent:false}).stdout;
							shell.exec("grunt serve", {silent:false}).stdout;
							res.status(200).end();
						}
					})
				}
			})
		}
		else {
			shell.exec("cp -R ./" + req.params.userid + "/" + req.params.name + " ../../../../opt/tomcat/webapps/" + req.params.userid + "-" + req.params.name, {silent:false}).stdout;
			res.status(200).end();
		}
	})
});

app.post('/save/:userid/:appname/:name',multi, function(req,res){
  console.log('get a file');
  fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream('./' + req.params.userid + '/' + req.params.appname)).on('finish',function() {
  	shell.exec("unzip ./" + req.params.userid + "/" + req.params.appname + " -d ./" + req.params.userid + "/" + req.params.name, {silent:false}).stdout;
  	res.status(200).end();
  });
});

app.listen(port,function(){
  console.log('App server has been started in port ' + port);
});
