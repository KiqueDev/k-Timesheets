var curr = new Date(Date.today().getFullYear(), Date.today().getMonth(), 0);// First day of Month
// var curr =  Date.today().previous().saturday();// get current date
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
    curr.addWeeks(0);
    console.log(curr);
    getBiWeekly();
     $('.tp1, .tp2').timepicker('setTime', '');
     disableTimeTextfield();
}
var prevClick = function(e){
    e.preventDefault();
    curr.addWeeks(-4);
    getBiWeekly();
    console.log(curr);
    $('.tp1, .tp2').timepicker('setTime', '');
    disableTimeTextfield();
}
var getBiWeekly = function(){
    var days = ['SUN','MON','TUES','WED','THURS','FRI','SAT'];

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
    //console.log(context);
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

            var hrsTin = parseInt(convertedTp1[0]);
            var hrsTout = parseInt(convertedTp2[0]);
            var minsTin = parseInt(convertedTp1[1]);
            var minsTout = parseInt(convertedTp2[1]);

            if( (hrsTout > hrsTin) || ( (hrsTin == hrsTout) && (minsTout >= minsTin) ) ){
                var hrs = hrsTout - hrsTin;
                var mins;
                if(minsTout >= minsTin){
                    mins = minsTout - minsTin;
                }else{
                    hrs = hrs - 1;
                    mins = minsTin - minsTout;
                    mins = 60 - mins;
                }

                console.log("hrs: " + hrs + "    mins: " + mins);
                //meal time deduct
                if((hrs > 5) || (hrs == 5 && mins > 0)){
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
                //console.log("Result: " + sHours + ":" + sMinutes);
                var sHours = hrs.toString();
                var sMinutes = mins.toString();
                if(hrs<10) sHours = "0" + sHours;
                if(mins<10) sMinutes = "0" + sMinutes;
                $(".results").eq(i).html(sHours + ":" + sMinutes);

            }
        }
    }
}
var calculateOverTotal = function(){
    var wk1 = $(".weekTotal").eq(0).text().split(":");
    var wk2 = $(".weekTotal").eq(1).text().split(":");

    var week1Hrs = parseInt(wk1[0]);
    var week2Hrs = parseInt(wk2[0]);
    var week1Mins = parseInt(wk1[1]);
    var week2Mins = parseInt(wk2[1]);

    var weekHrs = week1Hrs + week2Hrs;
    var weekMins = week1Mins + week2Mins;
    if(weekMins >= 60){
        weekHrs = weekHrs + 1;
        weekMins = weekMins - 60;
    }

    var sHours = weekHrs.toString();
    var sMinutes = weekMins.toString();
    if(weekHrs<10) sHours = "0" + sHours;
    if(weekMins<10) sMinutes = "0" + sMinutes;
    $(".overAllTotal").html(sHours + ":" + sMinutes);
    // var total = weekHrs 
    // console.log("overallTotal: " +  sHours + ":" + sMinutes);
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
    // console.log(sHours + ":" + sMinutes);
    return sHours + ":" + sMinutes;
}
//TEMPLATING
var setTemplate = function(){
    var source   = $("#tBodyContent-template").html();
    var template = Handlebars.compile(source);
    var html    = template(context);
    $("#tBodyContent").html(html);
}
var addWeekHrs = function(args){
    var totalHrs = 0;
    var totalMins = 0;
    for(i=args.start; i < args.end; i++){
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

    // console.log("Total HOURS: " +sTotalHours);
    // console.log("Total MINS: " +sTotalMinutes);

    $(".weekTotal").eq(args.week).html(sTotalHours+":"+sTotalMinutes);
}
var addWeek1 = function(){
    addWeekHrs({start:0, end:7, week:0});
}
var addWeek2 = function(){
    addWeekHrs({start:7, end:14, week:1});
}
var clearBtn = function(e){
    var id = e.target.id-1;
    $(".tp1").eq(id).timepicker('setTime', '');
    $(".tp2").eq(id).timepicker('setTime', '');
    disableTimeTextfield();
    $(".mealTime").eq(id).attr("disabled","disabled");
    $(".mealTime").eq(id).text("0:00");
    //$(".results").eq(0).text("");
}
var clearAllBtn = function(){
    $('.tp1, .tp2').timepicker('setTime', '');
    disableTimeTextfield();
    $(".mealTime").attr("disabled","disabled");
    $(".mealTime").text("0:00");
    //$(".results").eq(0).text("");
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

var disableTimeTextfield = function(){
    $(".bootstrap-timepicker-hour, .bootstrap-timepicker-minute, .bootstrap-timepicker-meridian").attr("disabled", "disabled");
}

$(document).ready(function() {
    //Check which payment of the biWeek
    var future = curr.addWeeks(2);
    console.log("FUTURE: ", future);
    var today = Date.today();
    console.log("TODAY:", today);
    if(today.compareTo(future) > 0)
        curr.addWeeks(2);

    // Put Back to Original
    curr.addWeeks(-4);

    contactInfo = $.jStorage.get("contactInfo");

    if(!contactInfo){
        $(".settingsBtn").click();
    }

    getBiWeekly();

    appendContact();

    //Handle Listener
    $(document).on("click", "#saveButton", saveButton);
    $(document).on("click", "#previous", prevClick);
    $(document).on("click", "#next", nextClick);
    $(document).on("click", "body", calculateHrs);
    $(document).on("click", "body", addWeek1);
    $(document).on("click", "body", addWeek2);
    $(document).on("click", "body", calculateOverTotal);


    $(document).on("click", ".clearTime", clearBtn);
    $(document).on("click", ".clearAll", clearAllBtn);

    $(document).on("click", ".pdfBtn", createPDF);

    $(document).on("hidden.bs.modal", "#settingsModal", function () {
      // do something…
      $("#saveButton").click();
    })


    $("#settingsModal").keypress(function(e) {
        var key = e.which;
        if(key === 13){
            $("#saveButton").click();
        }
    });
    $('.tp1, .tp2').timepicker('setTime', '');
    disableTimeTextfield();
});

