// Get references to page elements
var $submitTask = $("#submitTask");
var $newTask = $(".newTask");
var $editTask = $("#editTask");
var $editing = $(".editing");
var $deleting = $(".deleting");
var $tasks = $("#tasks");
var $profile = $("#profile");
var username;
var bool = false;

console.log("task.js esta siendo leido");

// The API object contains methods for each kind of request we'll make
var API = {
    savetareas: function (tareas) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "api/tareas",
            data: JSON.stringify(tareas),
        });
    },
    task: function (username) {
        return $.ajax({
            url: "/task",
            type: "GET",
            data: username
        });
    },

    deletetareas: function (id) {
        return $.ajax({
            url: "api/delete/" + id,
            type: "DELETE"
        });
    },
    newTask: function () {
        return $.ajax({
            url: "/create",
            type: "GET"
        });
    },
    index: function (username) {
        return $.ajax({
            url: "/",
            type: "GET"
        });
    },
    edit: function (id, tareas) {
        return $.ajax({
            url: "/api/edit/" + id,
            type: "PUT",
            data: tareas
        });
    },
    newedit: function (id) {
        return $.ajax({
            url: "/edit",
            type: "GET",
            data: id
        });
    },
    profile: function (username){
        return $.ajax({
            url: "/profile",
            type: "GET",
            data: username
        })
    },
    getemail: function (tareas) {
        return $.ajax({
            url: "send",
            type: "GET",
            data: tareas
        });
    }


};

var tasksform = function(){
    username = localStorage.getItem('username1');
    username= username.replace(/['"]+/g, '');
    console.log("this is the username: ", username);
    if(bool===false){
    API.task(username).then(function (data) {
        console.log(data);
        bool=true;
      });
}else{
   
    return;
}
}


var profileform = function(){
    
    console.log("we are on function profile");
    username = localStorage.getItem('username1');
    username= username.replace(/['"]+/g, '');
    console.log("username is: ", username);
    if(bool===false){
        API.profile(username).then(function (data, data2) {
            console.log("this is what we get back on data1: ",data1,  " what we get back on data 2: ",data2);
            bool=true;
          });
    }else{
        return;
    }
}

// refreshtareas gets new tareas from the db and repopulates the list
var refreshtareas = function () {
    username = localStorage.getItem('username1');
    username= username.replace(/['"]+/g, '');
    console.log("we are about to go to index");
    API.task(username).then(function (data) {
        console.log(data );
    });
    
};

// handleFormSubmit is called whenever we submit a new tareas
// Save the new tareas to the db and refresh the list
var handleFormSubmit = function (event) {

    console.log("we are in handleform submit")
    var tareas = {
        assignedUser: $("#issueinput1").val().trim(),
        assignedBy: username,
        task: $("#issueinput8").val().trim(),
        taskStatus: "assigned",
        deadline: $("#issueinput3").val().trim() + " " + $("#issueinput4").val().trim(),
        progress: $("#issueinput5").val().trim(),
        assignedtoMail: $("#issueinput0").val().trim()
    };

    if (!(tareas.assignedUser && tareas.assignedBy && tareas.task && tareas.deadline && tareas.progress)) {
        alert("You must enter all fields");
        return;
    }
    API.savetareas(tareas).then(function () {

        console.log("we sent the create to the database: " + tareas);
        
        refreshtareas();
    });
    API.getemail(tareas).then(function (error) {
      if (error) {
                console.log(error)}
        console.log("we sent the getemail function ");
    });
};

//EDITING TASK
var editTaskform = function () {
    username = localStorage.getItem('username1');
    username= username.replace(/['"]+/g, '');
    console.log("we are going to edit task taking the values entered!");

    var generalid = localStorage.getItem('generalid');
    var id = generalid;
    id = id.replace(/['"]+/g, '');
    console.log(id, " edittaskform function");
    var tareas = {
        id: id,
        assignedUser: $("#issueinput1").val().trim(),
        assignedBy: username,
        task: $("#issueinput8").val().trim(),
        taskStatus: "assigned",
        deadline: $("#issueinput3").val().trim() + " " + $("#issueinput4").val().trim(),
        progress: $("#issueinput5").val().trim()
      
    };
    if (!(tareas.assignedUser && tareas.assignedBy && tareas.task && tareas.deadline && tareas.progress)) {
        alert("You must enter an tareas text and description!");
        return;
    }
    API.edit(id, tareas).then(function () {
        console.log("we are editing");

        //refreshtareas();
    });
};


//Getting the create handlebar

var getCreate = function () {

    console.log("we are trying to send it to server");
    API.newTask();
};

// Getting the edit handlebar

var getedit = function () {
    username = localStorage.getItem('username1');
    username= username.replace(/['"]+/g, '');

    var id = $(this).attr("data-id");
    generalid = id;
    localStorage.setItem('generalid', JSON.stringify(generalid));
    console.log(id, "getedit function");
    API.newedit(id).then(function (web, da) {
        //});
    });
};

var deleteform = function () {

    var id = $(this).attr("data-id");
    console.log("we are on deleteform, id is: " + id);
    API.deletetareas(id).then(function () {
        refreshtareas();
    });
}

//function var mailer starts----------------------------------------------------------------------

//mailer finishes----------------------------------------------------------------------------------

// handleDeleteBtnClick is called when an tareas's delete button is clicked
// Remove the tareas from the db and refresh the list


//API.gettareas();

// Add event listeners to the submit and delete buttons
$submitTask.on("click", handleFormSubmit);
//$tareasList.on("click", ".delete", handleDeleteBtnClick);
$editTask.on("click", editTaskform);
$newTask.on("click", getCreate);
$editing.on("click", getedit);
$deleting.on("click", deleteform);
$tasks.on("click", tasksform);
$profile.on("click", profileform);
//$cancel.on("click",cancelform);