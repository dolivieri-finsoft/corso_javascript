"use strict";

const base_url = "http://127.0.0.1:10001/";
let loginModal = null;

console.log("Thoughts front-end loaded");

function login(event){

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
			}
	})
	.catch(function(err) { 
			alert(err);
			console.log('Failed to fetch page: ', err);
	});
}

function refreshThoughts(){
	alert("TODO: "+refreshThoughts);
}

window.addEventListener(
	'DOMContentLoaded', 
	function(event){

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