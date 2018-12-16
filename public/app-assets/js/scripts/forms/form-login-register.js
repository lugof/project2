$(document).ready(function () {
	'use strict';
	//Login Register Validation
	if ($("form.form-horizontal").attr("novalidate") != undefined) {
		$("input,select,textarea").not("[type=submit]").jqBootstrapValidation();
	}

	// Remember checkbox
	if ($('.chk-remember').length) {
		$('.chk-remember').iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue',
		});
	}
});

console.log("form-login-register.js loaded");

// login    ****************
$("#login").on("click", function (event) {
	//console.log("login init");
	event.preventDefault();
	var loginData = {
		username: $("#username").val().trim(),
		account_key: $("#user-password").val().trim()
	};

	localStorage.setItem('username1', JSON.stringify(loginData.username));
	console.log(loginData + " sent fron login form");
	if (loginData.account_key.length > 0 && loginData.username.length > 0) {
		$.ajax({
			type: "post",
			url: "/login",
			data: loginData
		}).then(function (data) {
			window.location.href = "/"
		});
	} else {
		console.log("**login error**");
		$("#create-err-msg").empty("").text("**login error**");
	}
});


// ADD    ****************
$("#add-account").on("click", function (event) {
	event.preventDefault();

	// make a newAccount obj
	var newAccount = {
		first_name: $("#inputFirst").val().trim(),
		last_name: $("#inputLast").val().trim(),
		username: $("#username").val().trim(),
		email: $("#user-email").val().trim(),
		account_key: $("#user-password").val().trim()

	};
	console.log(newAccount);

	if (newAccount.account_key.length > 0 && newAccount.email.length > 0 && newAccount.username.length > 0 && newAccount.last_name.length > 0 && newAccount.first_name.length > 0) {
		$.ajax({
			type: "post",
			url: "/signup",
			data: newAccount
		}).then(function (data) {
			window.location.href = "/"
		});
	} else {
		console.log("**Please fill out entire form**");
		$("#create-err-msg").empty("").text("**Please fill out entire form**");
	}
});
// UPDATE      **********************
$("#update-account").on("click", function (event) {
	event.preventDefault();

	// capture All changes
	var changeAccount = {
		first_name: $("#inputFirst").val().trim(),
		last_name: $("#inputLast").val().trim(),
		username: $("#user-name").val().trim(),
		email: $("#useremail").val().trim(),
		account_key: $("#user-password").val().trim(),
		account_id: $("#account-number").attr("data-accountid")
	};
	$("#err-msg").empty("");
	// $("#change-account-modal").modal("show");
	console.log(changeAccount);



	if (changeAccount.account_id.length > 0 && changeAccount.account_key.length > 0 && changeAccount.phone.length > 0 && changeAccount.email.length > 0 && changeAccount.balance.length > 0 && changeAccount.zip.length > 0 && changeAccount.state.length > 0 && changeAccount.city.length > 0 && changeAccount.street.length > 0 && changeAccount.account_key.length > 0 && changeAccount.last_name.length > 0 && changeAccount.first_name.length > 0) {
		$.ajax({
			type: "PUT",
			url: "/accounts/" + changeAccount.account_id + "/" + changeAccount.account_key,
			data: changeAccount
		}).then(
			function () {
				console.log("Updated account", changeAccount);
				// Reload the page to get the updated list
				location.reload();
			}
		);

	} else {
		console.log("**Please fill out entire form**");
		$("#update-err-msg").empty("").text("**Please fill out entire form**");
	}

});

// DELETE   ***************************************************
$("#delete-account").on("click", function (event) {
	event.preventDefault();
	$("#err-msg").empty("");
	$("#delete-account-modal").modal("show");
});

$("#confirm-delete").on("click", function (event) {
	var deleteAccount = {
		account_id: $("#account_id").val().trim(),
		account_key: $("#account_password").val().trim(),
	}
	console.log(deleteAccount);
	if (deleteAccount.account_id.length > 0 && deleteAccount.account_key.length > 0) {
		$.ajax("/accounts/" + deleteAccount.account_id + "/" + deleteAccount.account_key, {
			type: "DELETE"
		}).then(
			function () {
				console.log("deleted account", deleteAccount.account_id);
				// Reload the page to get the updated list
				location.reload();
			}

		);
	} else {
		console.log("fill out entire form");
		$("#err-msg").empty("").text("fill out entire form");
	}

});