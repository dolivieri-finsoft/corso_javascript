const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

// 1. DONE creare un file JSON (copia del vecchio stub per iniziare) che sia il DB delle nostre canzoni
// 2. DONE implementare la list servendo il file JSON stesso (cercare come servire file statici in express js) 
// 3. DONE implementare la create: legge il json, aggiunge un oggetto all'array, lo salva e risponde come nello stub precedente
// 4. DONE implementare la edit: legge il json, cerca/modifica un oggetto in array, lo salva e risponde come nello stub precedente
// 5. DONE implementare la delete: legge il json, cerca e cancella oggetto, lo salva e risponde come nello stub precedente
// 6. TODO alla route / (la prima) sostituire il manualetto servendo lavera e propria applicazione di frontend che abbiamo fatto
//    nelle precedenti lezioni

// respond with "hello world" when a GET request is made to the homepage
/*app.get('/', (req, res) => {
  res.send('Songs API - welcome aboard - available routings: create, delete, edit, list');
});*/
app.use(express.static('static'));

app.get('/create', (req, res) => {

  let robj = {
		"result":0,
		"message":"song successfully created",
		"data":[]
	};
	
	try{

		if(typeof req.query.title === 'undefined' || req.query.title =='') throw('title parameter required in GET');
		if(typeof req.query.author === 'undefined' || req.query.author =='') throw('author parameter required in GET');
		if(typeof req.query.composer === 'undefined' || req.query.composer =='') throw('composer parameter required in GET');

		const d = new Date();
		let time = d.getTime();

		let s = fs.readFileSync('songs.json', 'utf8');
		let sobj = JSON.parse(s);
		sobj.push(
			{
				id: time,
				title: req.query.title,
				author: req.query.author,
				composer: req.query.composer
			}
		);
		let new_s = JSON.stringify(sobj);
		fs.writeFileSync('songs.json', new_s, 'utf8');
		
	} catch(err){
		robj.result = 2000;
		robj.message = err.toString();
	}
	let s= JSON.stringify(robj);
	res.send(s);
});

app.get('/delete', (req, res) => {
  
	let robj = {
		"result":0,
		"message":"song successfully deleted",
		"data":[]
	};
	
	try{

		if(typeof req.query.id === 'undefined' || req.query.id =='') throw('id parameter required in GET');

		let s = fs.readFileSync('songs.json', 'utf8');
		let sobj = JSON.parse(s);
		let found = false;
		for(li=0; li<sobj.length; li++){
			if(sobj[li].id == req.query.id){
				// trovato cancello ed esco
				sobj.splice(li,1);
				found = true;
				break;
			}
		}
		if(!found) throw('song to delete not found');

		let new_s = JSON.stringify(sobj);
		fs.writeFileSync('songs.json', new_s, 'utf8');
		
	} catch(err){
		robj.result = 3000;
		robj.message = err.toString();
	}
	let s= JSON.stringify(robj);
	res.send(s);
});

app.get('/edit', (req, res) => {
  let robj = {
		"result":0,
		"message":"song successfully edited",
		"data":[]
	};
	
	try{

		if(typeof req.query.id === 'undefined' || req.query.id =='') throw('id parameter required in GET');
		if(typeof req.query.title === 'undefined' || req.query.title =='') throw('title parameter required in GET');
		if(typeof req.query.author === 'undefined' || req.query.author =='') throw('author parameter required in GET');
		if(typeof req.query.composer === 'undefined' || req.query.composer =='') throw('composer parameter required in GET');

		let s = fs.readFileSync('songs.json', 'utf8');
		let sobj = JSON.parse(s);
		let found = false;
		for(li=0; li<sobj.length; li++){
			if(sobj[li].id == req.query.id){
				// trovato modifico ed esco
				sobj[li].title = req.query.title;
				sobj[li].author = req.query.author;
				sobj[li].composer = req.query.composer;
				found = true;
				break;
			}
		}
		if(!found) throw('song to edit not found');

		let new_s = JSON.stringify(sobj);
		fs.writeFileSync('songs.json', new_s, 'utf8');
		
	} catch(err){
		robj.result = 4000;
		robj.message = err.toString();
	}
	let s= JSON.stringify(robj);
	res.send(s);
});

app.get('/list', (req, res) => {

	let robj = {
		"result":0,
		"message":"songs list successfully retrieved",
		"data":[]
	};
	
	try{
		let s = fs.readFileSync('songs.json', 'utf8');
		robj.data = JSON.parse(s);
		
	} catch(err){
		robj.result = 1000;
		robj.message = err.toString();
	}
	let s= JSON.stringify(robj);
	res.send(s);

});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});