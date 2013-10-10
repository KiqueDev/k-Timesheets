// $(document).on("click", "table.table tr th",headerClick);
//$(document).on("click", "table.table tr td",dataClick);

                      
// function headerClick(e) {
//     console.log(e);
//     $(e.currentTarget).css({
//         color:"red"
//     });
// }
var curr =  Date.today().previous().saturday();// get current date
var context = {}
var contactInfo = {
    lastName:"",
    firstName:"",
    ss:"",
    deparment:""
}
var payRoll = "";
$(document).ready(function() {
    curr = curr.addWeeks(-2);
    /* code here */ 
    contactInfo = $.jStorage.get("contactInfo");

    getBiWeekly();

    appendContact();

    //Handle Listener
    $(document).on("click", "#saveButton", saveButton);
    $(document).on("click", "#previous", prevClick);
    $(document).on("click", "#next", nextClick);

    $("#settingsModal").keypress(function(e) {
        var key = e.which;
        if(key === 13){
            $("#saveButton").click();
        }
   });
});
// var dataClick = function(e) {
//     console.log(e);
//     if (e.currentTarget.innerHTML != "") return;
//     if(e.currentTarget.contentEditable != null){
//         $(e.currentTarget).attr("contentEditable",true);
//     }
//     else{
//         $(e.currentTarget).append("<input type='text'>");
//     }    
// }
var dataClick = function(e) {
    console.log(e);
    if (e.currentTarget.innerHTML != "") return;
    if(e.currentTarget.contentEditable != null){
        $(e.currentTarget).attr("contentEditable",true);
    }
    else{
        $(e.currentTarget).append("<input type='text'>");
    }    
}
var nextClick = function(){
    curr = curr.addWeeks(0);
    console.log(curr);
    getBiWeekly();
}
var prevClick = function(){
    curr = curr.addWeeks(-4);
    getBiWeekly();
    console.log(curr);
}
var getBiWeekly = function(){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    context["week"] = [
        {data:[]},
        {data:[]}
    ];

    var firstPayRoll = "";
    var lastPayroll ="";
    for(i=0; i < 14; i++){
        var date = curr.add(1).days().toString("MM/dd/yyyy");
        if(i<7){
            if(i==0)
                firstPayRoll = date;
            context["week"][0]["data"].push({row:i+1, date:date, day:days[i]});
        }else{
            if(i==13)
                lastPayroll = date;
            context["week"][1]["data"].push({row:i+1, date:date, day:days[i-7]});
        }
    }
    payRoll = firstPayRoll + " - " + lastPayroll;
    console.log(context);
    $("#payRoll").text(payRoll);
    setTemplate();
}

var appendContact = function() {
    contactInfo = $.jStorage.get("contactInfo");
    if(contactInfo != null){
        $("#fName").text(contactInfo["firstName"]);
        $("#lName").text(contactInfo["lastName"]);
        $("#ss").text(contactInfo["ss"]);
        $("#department").text(contactInfo["department"]);

        $("#fNameText").val(contactInfo["firstName"]);
        $("#lNameText").val(contactInfo["lastName"]);
        $("#ssText").val(contactInfo["ss"]);
        $("#departmentText").val(contactInfo["department"]);
    }

}

//TEMPLATING
var setTemplate = function(){
    var source   = $("#tBodyContent-template").html();
    var template = Handlebars.compile(source);
    var html    = template(context);
    $("#tBodyContent").html(html);
}
