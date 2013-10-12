
var curr =  Date.today().previous().saturday();// get current date
var context = {}
var contactInfo = {
    lastName:"",
    firstName:"",
    ss:"",
    deparment:""
}
var payRoll = "";

var nextClick = function(e){
    e.preventDefault();
    curr = curr.addWeeks(0);
    console.log(curr);
    getBiWeekly();
     $('.tp1, .tp2').timepicker('setTime', '');
}
var prevClick = function(e){
    e.preventDefault();
    curr = curr.addWeeks(-4);
    getBiWeekly();
    console.log(curr);
    $('.tp1, .tp2').timepicker('setTime', '');
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
//CALCULATE HOURS
var calculateHrs = function(){

    for(i=0; i < 14; i++){
        $(".results").eq(i).html("");

        var tp1 = $(".tp1").eq(i).val();
        var tp2 = $(".tp2").eq(i).val();
        // console.log(tp1.length + " " + tp2.length);
        if(tp1.length != 0 &&  tp2.length != 0){
            // console.log(tp1 + " " + tp2);
            var convertedTp1 = convertTime(tp1).split(":");
            var convertedTp2 = convertTime(tp2).split(":");

          
            if(parseInt(convertedTp2[0]) >= parseInt(convertedTp1[0]) && parseInt(convertedTp2[1]) >= parseInt(convertedTp1[1])){
                var hrs = parseInt(convertedTp2[0]) - parseInt(convertedTp1[0]);
                var mins;
                if(parseInt(convertedTp2[1]) >= parseInt(convertedTp1[1])){
                    mins = parseInt(convertedTp2[1]) - parseInt(convertedTp1[1])
                }else{
                    hrs = hrs - 1;
                    mins = parseInt(convertedTp1[1]) - parseInt(convertedTp2[1]);
                    mins = 60 - mins;
                }


                //meal time deduct
                if(hrs >= 5){
                    $(".mealTime").eq(i).html("0:30");
                    $(".mealTime").eq(i).removeAttr("disabled");
 
                    if(mins >= 30){
                        mins = mins - 30;
                    }else{
                        hrs = hrs - 1;
                        mins = 30 - mins;
                        mins = 60 - mins;
                    }
                }else{
                    $(".mealTime").eq(i).html("0:00");
                    $(".mealTime").eq(i).attr("disabled", "disabled");
                }
                console.log("Result: " + sHours + ":" + sMinutes);
                var sHours = hrs.toString();
                var sMinutes = mins.toString();
                if(hrs<10) sHours = "0" + sHours;
                if(mins<10) sMinutes = "0" + sMinutes;
                $(".results").eq(i).html(sHours + ":" + sMinutes);

            }
        }
    }
}

var convertTime = function(time){
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if(AMPM == "PM" && hours<12) hours = hours+12;
    if(AMPM == "AM" && hours==12) hours = hours-12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if(hours<10) sHours = "0" + sHours;
    if(minutes<10) sMinutes = "0" + sMinutes;
    console.log(sHours + ":" + sMinutes);
    return sHours + ":" + sMinutes;
}
//TEMPLATING
var setTemplate = function(){
    var source   = $("#tBodyContent-template").html();
    var template = Handlebars.compile(source);
    var html    = template(context);
    $("#tBodyContent").html(html);
}
var addWeekHrs = function(){
    var totalHrs = 0;
    var totalMins = 0;
    for(i=0; i < 7; i++){
        var r = $(".results").eq(i).text();
        if(r.length != 0){
            var convertedTime = r.split(":");
            totalHrs = totalHrs + parseInt(convertedTime[0]);
            totalMins = totalMins + parseInt(convertedTime[1]);

            if(totalMins >= 60){
                totalHrs = totalHrs + 1;
                totalMins = totalMins - 60;
            }
        }

    }

    var sTotalHours = totalHrs.toString();
    var sTotalMinutes = totalMins.toString();
    if(totalHrs<10) sTotalHours = "0" + sTotalHours;
    if(totalMins<10) sTotalMinutes = "0" + sTotalMinutes;

    console.log("Total HOURS: " +sTotalHours);
    console.log("Total MINS: " +sTotalMinutes);

    $(".weekTotal").eq(0).html(sTotalHours+":"+sTotalMinutes);
}

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
    $(document).on("click", "body", calculateHrs);
    $(document).on("click", "body", addWeekHrs);


    $("#settingsModal").keypress(function(e) {
        var key = e.which;
        if(key === 13){
            $("#saveButton").click();
        }
    });
    $('.tp1, .tp2').timepicker('setTime', '');
});

