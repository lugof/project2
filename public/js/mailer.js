
var $mailer = $("#submitTask");

console.log("mailer esta siendo leido");

var sendMail = function (event) {
    $.get("send", {
        to: $("#issueinput1").val().trim(),
        text: $("#issueinput8").val().trim(),
        mail: $("#issueinput0").val().trim()
    }, function (data) {
        if (data == "sent") {
            console.log("mail sent js")
        }
    });
};

$mailer.on("click", sendMail);