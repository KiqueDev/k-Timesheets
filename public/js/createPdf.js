var createPDF = function(){

	var doc = new jsPDF();

	doc.setFontSize(12);
	doc.text(40, 25, "NON-TEACHING ADJUNCT and CONTINUING EDUCATION TEACHERS");
	doc.text(40, 30, "                                            TIME SHEET");
	doc.text(40, 35, "                              BROOKLYN COLLEGE PAYROLL");
	doc.text(40, 40, "                                                OFFICE");
	doc.text(20, 50, "PAYROLL TITLE         NT-Adjunct");
	doc.line(55, 51, 100, 51); 
	// Empty square
	doc.rect(20, 60, 65, 25);
	doc.text(22, 65, "DEPT#     EXP CODE    RATE");
	doc.line(20, 67, 85, 67);
	doc.line(40, 60, 40, 85);
	doc.line(65, 60, 65, 85);

	doc.text(105, 65, "Payroll Period:");
	doc.text(138, 65, payRoll);
	doc.line(135, 66, 185, 66);

	doc.text(105, 75, "Name:");
	doc.text(138, 75, contactInfo["lastName"] + " " + contactInfo["firstName"]);
	doc.line(135, 76, 185, 76); 

	doc.text(105, 85, "Soc. Sec. No:");
	doc.text(138, 85, contactInfo["ss"]);
	doc.line(135, 86, 185, 86); 

	doc.text(105, 95, "Deparment:");
	doc.text(138, 95, contactInfo["department"]);
	doc.line(135, 96, 185, 96); 

	doc.rect(20, 105, 170, 120);
	doc.text(21, 111, "                                             Time       Meal       Time         Work");
	doc.text(21, 116, "No     Day       Date                In          Period     Out           Hrs                   Signature");
	doc.line(20, 120, 190, 120);


	var l = 128;
	for(i = 0; i < 14; i++){
		doc.line(20, l, 190, l);
		l = l + 7;
	}


	doc.line(29, 105, 29, 170);
	doc.line(29, 177, 29, 225);
	var l2 = 45;
	for(i = 0; i < 6; i++){
		if(i == 1){
			doc.line(l2+5, 105, l2+5, 170);
			doc.line(l2+5, 177, l2+5, 225);
		}else if(i == 2){
			doc.line(l2+5, 105, l2+5, 170);
			doc.line(l2+5, 177, l2+5, 225);
		}else if(i < 4){
			doc.line(l2, 105, l2, 170);
			doc.line(l2, 177, l2, 225);
		}else{
			doc.line(l2, 105, l2, 242);
		}
		l2 = l2 + 20;
	}


	doc.rect(20, 225, 125, 17);
	doc.line(20, 232, 145, 232);

	var l3 = 128;
	var wk1Arr = context["week"][0].data;
	for(x in wk1Arr){
		doc.text(23, l3-2, wk1Arr[x].row.toString());
		doc.text(30, l3-2, wk1Arr[x].day);
		doc.text(47, l3-2, wk1Arr[x].date);


		var tIn = $(".tp1").eq(x).val();
		var tOut = $(".tp2").eq(x).val();
		var mealtTime = $(".mealTime").eq(x).text();
		var result = $(".results").eq(x).text();

		doc.text(71, l3-2, tIn);
		doc.text(94, l3-2, mealtTime);
		doc.text(106, l3-2, tOut);
		doc.text(130, l3-2, result);
		l3 = l3 + 7;
	}
	var l4 = 184;
	var wk2Arr = context["week"][1].data;
	for(x in wk1Arr){
		doc.text(23, l4-2, wk2Arr[x].row.toString());
		doc.text(30, l4-2, wk2Arr[x].day);
		doc.text(47, l4-2, wk2Arr[x].date);

		var newX = parseInt(x)+7;
		var tIn = $(".tp1").eq(newX).val();
		var tOut = $(".tp2").eq(newX).val();
		var mealtTime = $(".mealTime").eq(newX).text();
		var result = $(".results").eq(newX).text();

		doc.text(71, l4-2, tIn);
		doc.text(94, l4-2, mealtTime);
		doc.text(106, l4-2, tOut);
		doc.text(130, l4-2, result);

		l4 = l4 + 7;
	}

	doc.text(27, 175, "WEEK SUB-TOTAL");
	doc.text(27, 230, "WEEK SUB-TOTAL");
	doc.text(27, 239, "TOTAL HOURS");

	doc.text(22, 255, "I certify that the hours above have been worked. All computations are correct and there are");
	doc.text(22, 260, "sufficient funds in my allocation to pay this expenditure.");

	doc.line(18, 275, 85, 275); 
	doc.text(18, 280, "Prepared by");
	doc.line(90, 275, 110, 275); 
	doc.text(90, 280, "Extension");
	doc.line(120, 275, 190, 275); 
	doc.text(120, 280, "Deparment Chairperson/Area Head");

	var wk1Total = $(".weekTotal").eq(0).text();
	var wk2Total = $(".weekTotal").eq(1).text();
	var overAllTotal = $(".overAllTotal").text();
	doc.text(130, 175, wk1Total);
	doc.text(130, 230, wk2Total);
	doc.text(130, 239, overAllTotal);

	var string = doc.output('datauristring');
	$('.preview-pane').attr('src', string);

}
