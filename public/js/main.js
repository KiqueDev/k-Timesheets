// $(document).on("click", "table.table tr th",headerClick);
//$(document).on("click", "table.table tr td",dataClick);

                      
// function headerClick(e) {
//     console.log(e);
//     $(e.currentTarget).css({
//         color:"red"
//     });
// }

var context = {}
var contactInfo = {
    lastName:"",
    firstName:"",
    ss:"",
    deparment:""
}
var payRoll = "";
$(document).ready(function() { 
    /* code here */ 
    contactInfo = $.jStorage.get("contactInfo");

    getBiWeekly();
    $("#payRoll").text(payRoll);

    appendContact();

    setTemplate();

    $(document).on("click", "#saveButton", saveButton);

    $("#settingsModal").keypress(function(e) {
        var key = e.which;
        if(key === 13){
            $("#saveButton").click();
        }
       //do stuff with "key" here...
   });
});
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
var saveButton = function(){
    $.jStorage.set("contactInfo", contactInfo = {
        lastName:"",
        firstName:"",
        ss:"",
        deparment:""
    });

    contactInfo["lastName"] = $("#lNameText").val();
    contactInfo["firstName"] = $("#fNameText").val();
    contactInfo["ss"] = $("#ssText").val();
    contactInfo["department"] = $("#departmentText").val();

    $.jStorage.set("contactInfo", contactInfo);

    appendContact();

    $('#settingsModal').modal('hide');
}
var getBiWeekly = function(){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var curr = new Date; // get current date
    var first = ( curr.getDate() - curr.getDay() ); // First day is the day of the month - the day of the week


    context["week"] = [
        {data:[]},
        {data:[]}
    ];

    var firstPayRoll = "";
    var lastPayroll ="";
    for(i=0; i < 14; i++){
        if(i<7){
            var date = convertDate(new Date(curr.setDate( first+i )));
            if(i==0)
                firstPayRoll = date;
            context["week"][0]["data"].push({row:i+1, date:date, day:days[i]});
        }else{
            var date = convertDate(new Date(curr.setDate( first+i )));
            if(i==13){
                lastPayroll = date;
            }
            context["week"][1]["data"].push({row:i+1, date:date, day:days[i-7]});
        }

    }
    payRoll = firstPayRoll + " - " + lastPayroll;
    console.log(context);
}
var convertDate = function(inputFormat) {
  var d = new Date(inputFormat);
  return [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/');
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

        // console.log(contactInfo);
    }

}

//TEMPLATING
var setTemplate = function(){
    var source   = $("#tBodyContent-template").html();
    var template = Handlebars.compile(source);
    var html    = template(context);
    $("#tBodyContent").html(html);
}
