console.log("Thoughts started!");

// TODOs del Thoughts
// 1. TODO fare un frontend che mostri sempre due cose: 1 form di inserimento di un pensiero (1 testo) e una lista dei pensieri precedentemente inseriti (in ordine INVERSO di inserimento)
// 2. TODO fare un backend che implementi le seguenti operazioni:
// 3. TODO list (dei pensieri)
// 4. TODO create pensiero
// 5. TODO delete pensiero
// 6. TODO mostrare un gradimento (numero) del pensiero
// 7. TODO gestire l'aggiunta di un +1 al gradimento di un pensiero
// 8. TODO gestire un selettore di cambio ordinamento lista che consente di mostrare la list in due modi (ordine temporale INVERSO oppure GRADIMENTO DISCENDENTE)


const fs = require('fs');
const express = require('express');
const app = express();
const port = 10001;
let users = [];

function getUserFromToken(token){

	for(li=0; li<users.length; li++){
		if(users[li].token ==token){
			// trovato utente con il token specificato
			return users[li];
		}
	}

	return null;
}

function loadUsers(){
	let s = fs.readFileSync('users.json', 'utf8');
	users = JSON.parse(s);
}

// init

loadUsers();

// route

app.use(express.static('static'));

app.get('/login', (req, res) => {
  
	let robj = {
		"result":0,
		"message":"welcome, you are logged in",
		"data":[]
	};
	
	try{

		if(typeof req.query.nickname === 'undefined' || req.query.nickname =='') throw('nickname parameter required in GET');
		if(typeof req.query.password === 'undefined' || req.query.password =='') throw('password parameter required in GET');

		loadUsers();

		let found = false;
		for(li=0; li<users.length; li++){
			if((users[li].nickname == req.query.nickname) && (users[li].password == req.query.password)){
				// trovato utente
				robj.data.push({
					nickname: users[li].nickname,
					token: users[li].token,
					author: users[li].author
				});
				found = true;
				break;
			}
		}
		if(!found) throw('user not found');

		//let new_s = JSON.stringify(sobj);
		//fs.writeFileSync('songs.json', new_s, 'utf8');
		
	} catch(err){
		robj.result = 10000;
		robj.message = err.toString();
	}
	let s= JSON.stringify(robj);
	res.send(s);
});

app.get('/list', (req, res) => {

	let robj = {
		"result":0,
		"message":"thoughts list successfully retrieved",
		"data":[]
	};
	
	try{
		let s = fs.readFileSync('thoughts.json', 'utf8');
		_t = JSON.parse(s);

		if(req.query.orderby == 'appreciated'){
			_t.sort((a,b)=>{
				return b.likes.length - a.likes.length;
			});
		}

		robj.data = _t;

	} catch(err){
		robj.result = 1000;
		robj.message = err.toString();
	}
	let s= JSON.stringify(robj);
	res.send(s);

});


app.get('/edit', (req, res) => {
  let robj = {
		"result":0,
		"message":"thought successfully edited",
		"data":[]
	};
	
	try{

		if(typeof req.query.id === 'undefined' || req.query.id =='') throw('id parameter required in GET');
		if(typeof req.query.token === 'undefined' || req.query.token =='') throw('token parameter required in GET');
		if(typeof req.query.thought === 'undefined' || req.query.thought =='') throw('thought parameter required in GET');

		let user = getUserFromToken(req.query.token);
		if(user == null) throw('user token not found in users');

		let s = fs.readFileSync('thoughts.json', 'utf8');
		let sobj = JSON.parse(s);
		let found = false;
		for(li=0; li<sobj.length; li++){
			if(sobj[li].id == req.query.id){
				// trovato modifico ed esco

				if(sobj[li].nickname !== user.nickname) throw('security issue #1 in /edit');

				sobj[li].thought = req.query.thought;
				found = true;
				break;
			}
		}
		if(!found) throw('thought to edit not found');

		let new_s = JSON.stringify(sobj);
		fs.writeFileSync('thoughts.json', new_s, 'utf8');
		
	} catch(err){
		robj.result = 4000;
		robj.message = err.toString();
	}
	let s= JSON.stringify(robj);
	res.send(s);
});


app.get('/create', (req, res) => {

  let robj = {
		"result":0,
		"message":"thought successfully created",
		"data":[]
	};
	
	try{

		if(typeof req.query.token === 'undefined' || req.query.token =='') throw('token parameter required in GET');
		if(typeof req.query.thought === 'undefined' || req.query.thought =='') throw('thought parameter required in GET');

		let user = getUserFromToken(req.query.token);
		if(user == null) throw('user token not found in users');

		const d = new Date();
		let time = d.getTime();

		let s = fs.readFileSync('thoughts.json', 'utf8');
		let sobj = JSON.parse(s);
		sobj.unshift(
			{
				id: time,
				thought: req.query.thought,
				author: user.author,
				nickname: user.nickname,
				likes: []
			}
		);
		let new_s = JSON.stringify(sobj);
		fs.writeFileSync('thoughts.json', new_s, 'utf8');
		
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
		"message":"thought successfully deleted",
		"data":[]
	};
	
	try{

		if(typeof req.query.token === 'undefined' || req.query.token =='') throw('token parameter required in GET');
		if(typeof req.query.id === 'undefined' || req.query.id =='') throw('id parameter required in GET');

		let user = getUserFromToken(req.query.token);
		if(user == null) throw('user token not found in users');


		let s = fs.readFileSync('thoughts.json', 'utf8');
		let sobj = JSON.parse(s);
		let found = false;
		for(li=0; li<sobj.length; li++){
			if(sobj[li].id == req.query.id){
				// trovato cancello ed esco

				if(sobj[li].nickname !== user.nickname) throw('security issue #1 in /delete');

				sobj.splice(li,1);
				found = true;
				break;
			}
		}
		if(!found) throw('thought to delete not found');

		let new_s = JSON.stringify(sobj);
		fs.writeFileSync('thoughts.json', new_s, 'utf8');
		
	} catch(err){
		robj.result = 3000;
		robj.message = err.toString();
	}
	let s= JSON.stringify(robj);
	res.send(s);
});

app.get('/appreciate', (req, res) => {
  
	let robj = {
		"result":0,
		"message":"thought successfully appreciated",
		"data":[]
	};
	
	try{

		if(typeof req.query.token === 'undefined' || req.query.token =='') throw('token parameter required in GET');
		if(typeof req.query.id === 'undefined' || req.query.id =='') throw('id parameter required in GET');

		let user = getUserFromToken(req.query.token);
		if(user == null) throw('user token not found in users');


		let s = fs.readFileSync('thoughts.json', 'utf8');
		let sobj = JSON.parse(s);
		let found = false;
		for(li=0; li<sobj.length; li++){
			if(sobj[li].id == req.query.id){
				// trovato lo apprezzo aggiungendo il nickname ai likes (solo se non c'è già) ed esco
				let like_index = sobj[li].likes.indexOf(user.nickname);
				if(like_index < 0)
					sobj[li].likes.push(user.nickname);
				else
					sobj[li].likes.splice(like_index, 1);

				found = true;
				break;
			}
		}
		if(!found) throw('thought to appreciate not found');

		let new_s = JSON.stringify(sobj);
		fs.writeFileSync('thoughts.json', new_s, 'utf8');
		
	} catch(err){
		robj.result = 5000;
		robj.message = err.toString();
	}
	let s= JSON.stringify(robj);
	res.send(s);
});

app.listen(port, () => {
	console.log(`Thoughts app listening on port ${port}`);
});