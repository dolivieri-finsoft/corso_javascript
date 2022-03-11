"use strict";

const base_url = "http://127.0.0.1:10001/";
let loginModal = null;
let template_thought = null;
let me = null;
let order_select = null;
let button_save_thought = null;
let textarea_thought = null;

console.log("Thoughts front-end loaded");

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

function agganciaEventiAppreciateDelete(){

	/*
	let bottoniEditThought = document.getElementsByClassName("edit-thought");
	for(let li=0; li<bottoniEditThought.length; li++){
		bottoniEditThought[li].addEventListener("click", editThought);
	}
	*/

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
			for(let li=0; li<json.data.length; li++){
				let row = template_thought;
				let delete_switch = (me.nickname == json.data[li].nickname)?"":"nascondi";
				let appreciate_switch = (me.nickname == json.data[li].nickname)?"disabled":"";
				let appreciate_class_toggle = (json.data[li].likes.includes(me.nickname))?"btn-primary":"btn-outline-primary";
				rows += row.replaceAll("{{id}}", json.data[li].id)
					.replaceAll("{{thought}}", json.data[li].thought)
					.replaceAll("{{likes}}", json.data[li].likes.length)
					.replaceAll("{{author}}", json.data[li].author)
					.replaceAll("{{delete_switch}}", delete_switch)
					.replaceAll("{{appreciate_switch}}", appreciate_switch)
					.replaceAll("{{appreciate-class-toggle}}", appreciate_class_toggle);
			}
		}
		document.getElementById("thoughts-container").innerHTML = rows;
		agganciaEventiAppreciateDelete();
	})
	.catch(function(err) { 
			alert(err);
			console.log('Failed to fetch page: ', err);
	});	
}

function createThought(event){

	let thought = textarea_thought.value;

	fetch(base_url+"create?thought="+encodeURIComponent(thought)
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

		template_thought = document.getElementById("template-thought").innerHTML;

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

			/*data_list = document.getElementById("data-list");
			item_template = data_list.innerHTML;
			
			btn_add_thought = document.getElementById("btn_add_thought");
			btn_add_thought.addEventListener('click',addThought)
			
			input_text = document.getElementById("input_thought");

			order_select = document.getElementById("table_order_select");
			order_select.addEventListener("change", orderChange);

			data_list.innerHTML="";
			getAllThoughts();
			*/
});