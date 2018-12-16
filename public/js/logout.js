// Get references to page elements
var $loGout = $("#loGout");


console.log("task.js esta siendo leido");


var getLogout = function () {
    localStorage.removeItem("username1");
    localStorage.removeItem("generalid");

    console.log("Loggedout ");
};

$loGout.on("click", getLogout);
