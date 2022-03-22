"use strict";

const base_url = "http://127.0.0.1:10001/";
let loginModal = null;
let render_thoughts = null;
let me = null;
let order_select = null;
let button_save_thought = null;
let textarea_thought = null;

console.log("Thoughts for Handlebars front-end loaded");

// Handlebars Helpers

Handlebars.registerHelper('ismythought_switch', function (nickname) {
	return (me.nickname == nickname)?"true":"false";
})

Handlebars.registerHelper('has_likes', function (likes) {
	return (likes.length > 0)?"":"nascondi";
})

Handlebars.registerHelper('voters', function (likes) {
	return (Array.isArray(likes))?likes.join(', '):"";
})

Handlebars.registerHelper('ismine_switch', function (nickname) {
	return (me.nickname == nickname)?"":"nascondi";
})

Handlebars.registerHelper('appreciate_class_toggle', function (likes) {
	return (likes.includes(me.nickname))?"btn-primary":"btn-outline-primary";
})

Handlebars.registerHelper('appreciate_switch', function (nickname) {
	return (me.nickname == nickname)?"disabled":"";
})

Handlebars.registerHelper('length', function (a) {
	return (Array.isArray(a))?a.length:0;
})

// back-end functions

function login(event){

	event.preventDefault();

	let login_nickname = document.getElementById("input_nickname").value;
	let login_password = document.getElementById("input_password").value;

	fetch(base_url+"login?nickname="+encodeURIComponent(login_nickname)
		+"&password="+encodeURIComponent(login_password))
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
			
			console.log(json);

			if(json.result !== 0){
				alert("Error "+json.result+" in login: "+json.message);
			} else {
				console.log("Welcome "+login_nickname+"!");
				loginModal.hide();
				refreshThoughts();
				let _a = document.getElementsByClassName('span-author-name');
				for(let li=0; li<_a.length; li++){
					_a[li].innerHTML = json.data[0].author;
				}
				let _n = document.getElementsByClassName('span-nickname');
				for(let li=0; li<_n.length; li++){
					_n[li].innerHTML = json.data[0].nickname;
				}
				// me li tengo a futura memoria
				me = json.data[0];
			}
	})
	.catch(function(err) { 
			alert(err);
			console.log('Failed to fetch page: ', err);
	});
}

function deleteThought(event){
	let originator = event.currentTarget;
	let thought_id = originator.getAttribute('data-thought-id');
	console.log("delete id="+thought_id);

	if(confirm("Sei sicuro di voler cancellare il pensiero: "+thought_id)){
		fetch(base_url+"delete?id="+encodeURIComponent(thought_id)
		+"&token="+encodeURIComponent(me.token)
		)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
				
				console.log(json);

				if(json.result !== 0){
					alert("Error "+json.result+" in deleteThought: "+json.message);
				}
				refreshThoughts();
				
		})
		.catch(function(err) { 
				alert(err);
				console.log('Failed to fetch page: ', err);
		});
	}
}

function encodeHTMLEntities(text) {

	let _htmlent = text.replaceAll("&","&amp;")
	.replaceAll("<","&lt;")
	.replaceAll(">","&gt;")
	.replaceAll("\"","&quot;")
	.replaceAll("'","&#39;");

	//console.log("encodeHTMLEntities:"+text+"|"+_htmlent);
	return _htmlent;
}

function inputEditThought(event){

	let originator = event.currentTarget;
	let thought_id = originator.getAttribute('data-thought-id');
	let original_thought = originator.getAttribute('data-original-thought');
	let changed_thought = originator.textContent.trim();

	console.log("edit id="+thought_id, "|"+original_thought+"|", "|"+changed_thought+"|");
	
	let _b = document.querySelectorAll('.gruppo-edit-buttons[data-thought-id="'+thought_id+'"]');
	let non_modificato = (original_thought == changed_thought);

	if(non_modificato){
		originator.classList.remove('modificato');
	} else {
		originator.classList.add('modificato');
	}

	for(let li=0; li<_b.length; li++){
		_b[li].disabled = non_modificato;
		if(non_modificato){
			_b[li].classList.add('nascondi');
		} else {
			_b[li].classList.remove('nascondi');
		}
	}
}

function restoreThought(event){
	let originator = event.currentTarget;
	let thought_id = originator.getAttribute('data-thought-id');
	console.log("restore id="+thought_id);

	let _bq_array = document.querySelectorAll('.editable-blockquote[data-thought-id="'+thought_id+'"]');
	if(_bq_array.length>0){

		let _t = _bq_array[0].getAttribute("data-original-thought");
		// lo ripristino
		_bq_array[0].textContent = _t;
		//  e siccome è cambiato scateno su di lui un evento di input in modo che i bottoni si aggiornino
		var event = new Event('input');
		_bq_array[0].dispatchEvent(event);
	}
}

function editThought(event){
	let originator = event.currentTarget;
	let thought_id = originator.getAttribute('data-thought-id');
	console.log("edit id="+thought_id);

	let _bq_array = document.querySelectorAll('.editable-blockquote[data-thought-id="'+thought_id+'"]');
	if(_bq_array.length>0){

		let thought = _bq_array[0].textContent;

		fetch(base_url+"edit?id="+encodeURIComponent(thought_id)
			+"&thought="+encodeURIComponent(thought.trim())
			+"&token="+encodeURIComponent(me.token))
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
				
				console.log(json);

				if(json.result !== 0){
					alert("Error "+json.result+" in editThought: "+json.message);
				}
				refreshThoughts();
				
		})
		.catch(function(err) { 
				alert(err);
				console.log('Failed to fetch page: ', err);
		});
	}
	
}

function appreciateThought(event){
	let originator = event.currentTarget;
	let thought_id = originator.getAttribute('data-thought-id');
	console.log("appreciate id="+thought_id);

	fetch(base_url+"appreciate?id="+encodeURIComponent(thought_id)
	+"&token="+encodeURIComponent(me.token)
	)
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
			
			console.log(json);

			if(json.result !== 0){
				alert("Error "+json.result+" in appreciateThought: "+json.message);
			}
			refreshThoughts();
			
	})
	.catch(function(err) { 
			alert(err);
			console.log('Failed to fetch page: ', err);
	});
}

function agganciaEventiAppreciateDeleteEdit(){

	let blockquoteEditThought = document.querySelectorAll('.editable-blockquote[contenteditable="true"]');
	for(let li=0; li<blockquoteEditThought.length; li++){
		blockquoteEditThought[li].addEventListener("input", inputEditThought);
	}

	let bottoniRestoreThought = document.getElementsByClassName("restore-thought");
	for(let li=0; li<bottoniRestoreThought.length; li++){
		bottoniRestoreThought[li].addEventListener("click", restoreThought);
	}

	let bottoniEditThought = document.getElementsByClassName("edit-thought");
	for(let li=0; li<bottoniEditThought.length; li++){
		bottoniEditThought[li].addEventListener("click", editThought);
	}

	let bottoniDeleteThought = document.getElementsByClassName("delete-thought");
	for(let li=0; li<bottoniDeleteThought.length; li++){
		bottoniDeleteThought[li].addEventListener("click", deleteThought);
	}

	let bottoniAppreciateThought = document.getElementsByClassName("appreciate-thought");
	for(let li=0; li<bottoniAppreciateThought.length; li++){
		bottoniAppreciateThought[li].addEventListener("click", appreciateThought);
	}

}

function refreshThoughts(event){

	fetch(base_url+"list?orderby="+order_select.value)
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
			
		console.log(json);

		// TODO posso ridisegnare la lista dei pensieri
		let rows = "";

		if(json.result !== 0){
			alert("Error "+json.result+" in refreshThoughts: "+json.message);
		} else {
			rows = render_thoughts(json.data);
		}
		document.getElementById("thoughts-container").innerHTML = rows;
		agganciaEventiAppreciateDeleteEdit();
	})
	.catch(function(err) { 
			alert(err);
			console.log('Failed to fetch page: ', err);
	});	
}

function createThought(event){

	let thought = textarea_thought.value;

	fetch(base_url+"create?thought="+encodeURIComponent(thought.trim())
		+"&token="+encodeURIComponent(me.token))
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
			
			console.log(json);

			if(json.result !== 0){
				alert("Error "+json.result+" in createThought: "+json.message);
			}
			textarea_thought.value = "";
			refreshThoughts();
			
	})
	.catch(function(err) { 
			alert(err);
			console.log('Failed to fetch page: ', err);
	});

}

window.addEventListener(
	'DOMContentLoaded', 
	function(event){

		render_thoughts = Handlebars.compile( document.getElementById("template-thoughts").innerHTML );

		let bottoniRefreshThoughts = document.getElementsByClassName("refresh-thoughts");
		for(let li=0; li<bottoniRefreshThoughts.length; li++){
			bottoniRefreshThoughts[li].addEventListener("click", refreshThoughts);
		}

		order_select = document.getElementById("select-thoughts-order");
    order_select.addEventListener("change", refreshThoughts);

		textarea_thought = document.getElementById("textarea-thought");
		button_save_thought = document.getElementById("button-create-thought");
		button_save_thought.addEventListener("click", createThought);

		loginModal = new bootstrap.Modal(document.getElementById('loginModal'), {});

		let formLogin = document.getElementById("form-login");
		formLogin.addEventListener("submit", login);

		loginModal.show();
});