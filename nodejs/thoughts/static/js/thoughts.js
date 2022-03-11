"use strict";

const base_url = "http://127.0.0.1:10001/";
let loginModal = null;
let template_thought = null;
let me = null;
let order_select = null;

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

function agganciaEventiAppreciateDelete(){
	alert("TODO agganciaEventiAppreciateDelete");
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
				rows += row.replaceAll("{{id}}", json.data[li].id)
					.replaceAll("{{thought}}", json.data[li].thought)
					.replaceAll("{{likes}}", json.data[li].likes)
					.replaceAll("{{author}}", json.data[li].author)
					.replaceAll("{{delete_switch}}", delete_switch);
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