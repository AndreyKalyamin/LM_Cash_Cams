var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, client) {
  app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
	console.log(details);
    db.collection('notes').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      } 
    });
  });
  
  app.get('/cam_port/:cam', (req, res) => {
	var MjpegProxy = require('mjpeg-proxy').MjpegProxy;
	var expresss = require('express');
	var appp = expresss();
    const cam = req.params.cam;
    const cam_ = req.query.numb;
	var cam1 =0;
	console.log(cam);
	console.log(cam_);
	db.collection('notes').findOne({mag: cam, cam: cam_}, function(err, item){
		console.log(item['ip']);
		console.log(item['login']);
		console.log(item['password']);
		console.log(cam);
		var str = 'http://'+item['login']+':'+item['password']+'@'+item['ip']+'/'+item['link'];
		console.log(str);
		appp.get('/index'+cam+cam_+'.jpg', new MjpegProxy(str).proxyRequest);
		var server = appp.listen(8080);
		function cl() {
			server.close();
			console.log('close server');
		}
		setTimeout(cl,2000);
		res.send(cam_);
	});
  });
  
  app.get('/cams/:mag', (req, res) => {
    const mag = req.params.mag;
    const details = { 'mag': mag };
    db.collection('notes').find({mag: mag}).toArray((err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      } 
    });
  });
  
 app.get('/uniq_mag', (req, res) => {
    db.collection('notes').distinct('mag', function(err, docs) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(docs);
      } 
    });
  });
  
	var db = client.db("test");
   app.post('/notes', (req, res) => {
    const note = {mag: req.body.mag, cam: req.body.cam, ip: req.body.ip, port: req.body.port };
    db.collection('notes').insert(note, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
  
  const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
  app.put('/upd_notes', jsonParser, (req, res) => {
    const note = {mag: req.body.mag, cam: req.body.cam, ip: req.body.ip, port: req.body.port, login: req.body.login, password: req.body.password, link: req.body.link };
	console.log(req.body);
	const tr={mag: req.body.fmag, cam: req.body.fcam};
    db.collection('notes').update(tr, note, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result);
      }
    });
  });
  
  app.post('/create_note', jsonParser, (req, res) => {
    const note = {mag: req.body.mag, cam: req.body.cam, ip: req.body.ip, port: req.body.port, login: req.body.login, password: req.body.password, link: req.body.link };
	console.log(req.body);
	const tr={mag: req.body.mag, cam: req.body.cam};
    db.collection('notes').insert(note, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result);
      }
    });
  });
  
  app.post('/delete_note', jsonParser, (req, res) => {
    const note = {mag: req.body.mag, cam: req.body.cam, ip: req.body.ip, port: req.body.port, login: req.body.login, password: req.body.password, link: req.body.link };
	console.log(req.body);
    db.collection('notes').remove(note, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + note.cam + ' deleted!');
      } 
    });
  });
  
  
};