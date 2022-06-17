sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (Controller, JSONModel, MessageBox, MessageToast, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("PSA_Report3PSA_Report3.controller.View1", {
		onInit: function () {
			var viewModel = new JSONModel({
				busy: true,
				showPages: false
			});
			this.getView().setModel(viewModel, "viewModel");
			//this._pushFirstTab();
			//this._pushSecodTab();

		},
		_pushFirstTab: function () {
			var that = this,
				viewModel = this.getView().getModel("viewModel"),
				tab1 = [];
			var obj = {};
			obj.type = "Terminal ( EPF1 )";
			obj.cap = "2000";
			obj.store = "100";
			tab1.push(obj);
			var obj = {};
			obj.type = "Terminal ( EPF2 )";
			obj.cap = "2000";
			obj.store = "120";
			tab1.push(obj);
			var obj = {};
			obj.type = "Terminal ( EPF3 )";
			obj.cap = "2000";
			obj.store = "10";
			tab1.push(obj);
			var obj = {};
			obj.type = "Terminal ( EPF4 )";
			obj.cap = "2000";
			obj.store = "20";
			tab1.push(obj);
			var obj = {};
			obj.type = "Terminal ( EPF5 )";
			obj.cap = "2000";
			obj.store = "30";
			tab1.push(obj);

			viewModel.setProperty("/tab1", tab1);
			viewModel.refresh(true);
		},
		_pushSecodTab() {
			var that = this,
				viewModel = this.getView().getModel("viewModel"),
				tab2 = [];
			var obj = {};
			obj.SN = "1";
			obj.Day = "Saturday";
			obj.Date = "30.11.2021";
			obj.col1 = "120";
			obj.col2 = "120";
			obj.col3 = "120";
			obj.col4 = "120";
			obj.col5 = "120";
			obj.col6 = "120";
			obj.col7 = "120";
			obj.col8 = "120";
			obj.col9 = "120";
			obj.col10 = "120";
			obj.col11 = "120";
			obj.col12 = "120";
			obj.col13 = "120";
			obj.col14 = "120";
			obj.col15 = "120";
			obj.col16 = "120";
			obj.col17 = "120";
			obj.col18 = "120";
			obj.col19 = "120";
			obj.col20 = "120";
			obj.col21 = "120";
			obj.col22 = "120";
			obj.col23 = "120";
			obj.col24 = "120";
			obj.col25 = "120";
			obj.col26 = "120";
			tab2.push(obj);
			viewModel.setProperty("/tab2", tab2);
			viewModel.refresh(true);
		},
		_filTab2: function () {
			var that = this,
				viewModel = this.getView().getModel("viewModel");
			for (var i = 0; i < 7; i++) {
				_pushSecodTab();
			}
		},
		onExecute: function () {
			var that = this,
				viewModel = this.getView().getModel("viewModel"),
				oModel = this.getOwnerComponent().getModel(),
				aFilters = [];
			var companyCode = that.byId("company_code").getValue(),
				PSCName = that.byId("PSC_Name").getValue(),
				PSAProduct = that.byId("PSA_Product").getValue(),
				Fiscal_Year = that.byId("Fiscal_Year").getValue().substring(0, 4);
			if (Fiscal_Year.length < 1) {
				MessageBox.error("Please Enter Date.", {
					icon: MessageBox.Icon.ERROR,
					title: "Error"
				});
				return;
			}
			if (PSCName.length < 1) {
				MessageBox.error("Please Enter PSA Name.", {
					icon: MessageBox.Icon.ERROR,
					title: "Error"
				});
				return;
			}
			viewModel.setProperty("/showPages", true);
			viewModel.refresh(true);
			sap.ui.core.BusyIndicator.show(0);
			//var filter = `Bukrs=` + `'` + companyCode + `'` + `,PscName=` + `'` + PSCName + `'` + `,PscProduct=` + `'` + PSAProduct + `'` + `,PscYear=` + `'` + Fiscal_Year + `'` + `?$expand=PsaDeatillSet`;
			//var path = `/PsaHeaderSet(` + filter + `)`;
			var sPath = oModel.createKey("/PsaHeaderSet", {
				Bukrs: companyCode,
				PscName: PSCName,
				PscProduct: PSAProduct,
				PscYear: Fiscal_Year,
				Total_IND: ""
			});
			oModel.read(sPath, {
				method: "GET",
				async: false,
				urlParameters: {
					"$expand": "PsaDeatillSet,PsaConfSet,lastTotalsSet"
				},
				success: function (data) {
					sap.ui.core.BusyIndicator.hide(0);
					//that.onInit();
					viewModel.setProperty("/PsaDeatillSet", data.PsaDeatillSet.results);
					viewModel.setProperty("/PsaConfSet", data.PsaConfSet.results);
					viewModel.setProperty("/lastTotalsSet", data.lastTotalsSet.results);
					that.preapareResponseData();
					// MessageBox.success("Please Check Log.", {
					// 	icon: MessageBox.Icon.SUCCESS,
					// 	title: "Success"
					// });
					console.log("response", data);
				},
				error: function (error) {
					sap.ui.core.BusyIndicator.hide(0);
					MessageBox.error("There is an Error. Pleas check with Admin.", {
						icon: MessageBox.Icon.ERROR,
						title: "Error"
					});;
					that.onInit();
				}
			});
			sap.ui.core.BusyIndicator.hide(0);
		},
		getDayName: function (day) {
			var dayNumber = new Date(day).getDay(),
				dayName;
			if (dayNumber === 0)
				dayName = "الاحد ";
			else if (dayNumber === 1)
				dayName = "الاتنين ";
			else if (dayNumber === 2)
				dayName = "الثلاثاء";
			else if (dayNumber === 3)
				dayName = "الاربعاء";
			else if (dayNumber === 4)
				dayName = "الخميس ";
			else if (dayNumber === 5)
				dayName = "الجمعة";
			else
				dayName = "السبت";

			return dayName;
		},
		getMonth: function (month) {
			var monthName;
			if (month === '01')
				monthName = "يناير";
			if (month === '02')
				monthName = "فبراير";
			if (month === '03')
				monthName = "مارس";
			if (month === '04')
				monthName = "ابريل";
			if (month === '05')
				monthName = "مايو";
			if (month === '06')
				monthName = "يونيه";
			if (month === '07')
				monthName = "يوليو";
			if (month === '08')
				monthName = "اغسطس";
			if (month === '09')
				monthName = "سبتمبر";
			if (month === '10')
				monthName = "اكتوبر";
			if (month === '11')
				monthName = "نوفمبر";
			if (month === '12')
				monthName = "ديسمبر";

			return monthName;
		},
		preapareResponseData: function () {
			var that = this,
				viewModel = this.getView().getModel("viewModel"),
				PsaDeatillSet = viewModel.getProperty("/PsaDeatillSet"),
				lastTotalsSet = viewModel.getProperty("/lastTotalsSet"),
				psa1 = [],
				pas2 = [],
				pas9 = [],
				pas2Uniqe = [],
				psa1_Term1 = [],
				psa2_Term1 = [],
				psaTerm2 = [],
				psaTerm3 = [],
				psaTerm4 = [],
				termOneTab = [],
				termTwoTab = [],
				termThreeTab = [],
				termFourTeb = [],
				termFiveTebTeb = [],
				terrmSixTabTeb = [];
			// divied the array into PSA1 , PSA2 , PSA09	
			for (var i = 0; i < PsaDeatillSet.length; i++) {
				if (PsaDeatillSet[i].ShipCode.length > 1 && PsaDeatillSet[i].Distance !== 'PSA09') {
					PsaDeatillSet[i].Volume = parseFloat(PsaDeatillSet[i].Volume);
					pas2.push(PsaDeatillSet[i]);
				} else if (PsaDeatillSet[i].Distance === 'PSA09') {
					PsaDeatillSet[i].Volume = parseFloat(PsaDeatillSet[i].Volume);
					pas9.push(PsaDeatillSet[i]);
				} else {
					PsaDeatillSet[i].Volume = parseFloat(PsaDeatillSet[i].Volume);
					psa1.push(PsaDeatillSet[i]);
				}

			}
			// collect PSA02 (Lifting)
			pas2.reduce(function (res, value) {
				var key = value.PrdDate + value.Term;
				if (!res[key]) {
					res[key] = {
						Bukrs: value.Bukrs,
						Distance: value.Distance,
						PrdDate: value.PrdDate,
						PscName: value.PscName,
						PscProduct: value.PscProduct,
						PscYear: value.PscYear,
						ShipCode: value.ShipCode,
						Term: value.Term,
						Volume: 0,
					};
					pas2Uniqe.push(res[key])
				}
				res[key].Volume += value.Volume;
				return res;
			}, {});
			console.log(pas2Uniqe);

			// Divied into 5 Terms 
			for (var i = 0; i < psa1.length; i++) {
				var ps2a001Index = pas2Uniqe.findIndex(el => el.PrdDate === psa1[i].PrdDate && el.Term === psa1[i].Term),
					obj = {};
				if (ps2a001Index !== -1) {
					if (i === 0) { // first Iteration 
						var term = psa1[i].Term.substring(3); //0001
						var index_total = lastTotalsSet.findIndex(el => el.term === term);

						obj = {
							Day: that.getDayName(psa1[i].PrdDate),
							Date: psa1[i].PrdDate,
							prd: psa1[i].Volume,
							lift: pas2Uniqe[ps2a001Index].Volume,
							//sub: psa1[i].Volume - pas2Uniqe[ps2a001Index].Volume
							// this is changed to be = TodayPRD + YesterDayPRD - Fiting toDay 
							sub: psa1[i].Volume - pas2Uniqe[ps2a001Index].Volume,
							DateFormat: new Date(psa1[i].PrdDate)
						}
					} else {
						obj = {
							Day: that.getDayName(psa1[i].PrdDate),
							Date: psa1[i].PrdDate,
							prd: psa1[i].Volume,
							lift: pas2Uniqe[ps2a001Index].Volume,
							//sub: psa1[i].Volume - pas2Uniqe[ps2a001Index].Volume
							// this is changed to be = TodayPRD + YesterDayPRD - Fiting toDay 
							sub: psa1[i].Volume + psa1[i - 1].Volume - pas2Uniqe[ps2a001Index].Volume,
							DateFormat: new Date(psa1[i].PrdDate)
						}
					}
				} else { // dosn't have lift value (maybe there is production and there is no lift )
					obj = {
						Day: that.getDayName(psa1[i].PrdDate),
						Date: psa1[i].PrdDate,
						prd: psa1[i].Volume,
						lift: 0,
						sub: psa1[i].Volume - 0,
						DateFormat: new Date(psa1[i].PrdDate)
					}
				}

				if (psa1[i].Term === '0001') {
					termOneTab.push(obj);
				} else if (psa1[i].Term === '0002') {
					termTwoTab.push(obj);
				} else if (psa1[i].Term === '0003') {
					termThreeTab.push(obj);
				} else if (psa1[i].Term === '0004') {
					termFourTeb.push(obj);
				} else if (psa1[i].Term === '0005') {
					termFiveTebTeb.push(obj);
				} else if (psa1[i].Term === '0006') {
					terrmSixTabTeb.push(obj);
				}

			}
			//-------------------------------------------------------------------------------------------
			// 								Term #1
			//-------------------------------------------------------------------------------------------
			// calculate Sub for all Items 
			var index_total = lastTotalsSet.findIndex(el => el.term === '1');
			for (var i = 0; i < termOneTab.length; i++) {
				if (i === 0) {
					termOneTab[i].sub = termOneTab[i].prd + parseInt(lastTotalsSet[index_total].sub) - termOneTab[i].lift;
					// termOneTab[i].sub = termOneTab[i].prd - termOneTab[i].lift;
				} else {
					termOneTab[i].sub = termOneTab[i].prd + termOneTab[i - 1].sub - termOneTab[i].lift;
				}

			}
			termOneTab.sort((a, b) => { // Sort Descending By Date
				return b.DateFormat - a.DateFormat;
			});
			viewModel.setProperty("/termOneTab", termOneTab); // For Binding 
			viewModel.setProperty("/termOneTabAll", termOneTab); // For All
			//-------------------------------------------------------------------------------------------
			// 								Term #2
			//-------------------------------------------------------------------------------------------
			// calculate Sub for all Items 
			var index_total = lastTotalsSet.findIndex(el => el.term === '2');
			for (var i = 0; i < termTwoTab.length; i++) {
				if (i === 0) {
					termTwoTab[i].sub = termTwoTab[i].prd + parseInt(lastTotalsSet[index_total].sub) - termTwoTab[i].lift;
					// termTwoTab[i].sub = termTwoTab[i].prd - termTwoTab[i].lift;
				} else {
					termTwoTab[i].sub = termTwoTab[i].prd + termTwoTab[i - 1].sub - termTwoTab[i].lift;
				}

			}
			termTwoTab.sort((a, b) => {// Sort Descending By Date
				return b.DateFormat - a.DateFormat;
			});
			viewModel.setProperty("/termTwoTab", termTwoTab); // For Binding 
			viewModel.setProperty("/termTwoTabAll", termTwoTab); // For All
			//-------------------------------------------------------------------------------------------
			// 								Term #3
			//------------------------------------------------------------------------------------------
			var index_total = lastTotalsSet.findIndex(el => el.term === '3');
			for (var i = 0; i < termThreeTab.length; i++) {
				if (i === 0) {
					termThreeTab[i].sub = termThreeTab[i].prd + parseInt(lastTotalsSet[index_total].sub) - termThreeTab[i].lift;
					//termThreeTab[i].sub = termThreeTab[i].prd - termThreeTab[i].lift;
				} else {
					termThreeTab[i].sub = termThreeTab[i].prd + termThreeTab[i - 1].sub - termThreeTab[i].lift;
				}

			}
			termThreeTab.sort((a, b) => {// Sort Descending By Date
				return b.DateFormat - a.DateFormat;
			});
			viewModel.setProperty("/termThreeTab", termThreeTab); // For Binding 
			viewModel.setProperty("/termThreeTabAll", termThreeTab); // For All
			//-------------------------------------------------------------------------------------------
			// 								Term #4
			//------------------------------------------------------------------------------------------
			var index_total = lastTotalsSet.findIndex(el => el.term === '4');
			for (var i = 0; i < termFourTeb.length; i++) {
				if (i === 0) {
					termFourTeb[i].sub = termFourTeb[i].prd + parseInt(lastTotalsSet[index_total].sub) - termFourTeb[i].lift;
					//termFourTeb[i].sub = termFourTeb[i].prd - termFourTeb[i].lift;
				} else {
					termFourTeb[i].sub = termFourTeb[i].prd + termFourTeb[i - 1].sub - termFourTeb[i].lift;
				}

			}
			termFourTeb.sort((a, b) => {// Sort Descending By Date
				return b.DateFormat - a.DateFormat;
			});
			viewModel.setProperty("/termFourTeb", termFourTeb); // For Binding 
			viewModel.setProperty("/termFourTebAll", termFourTeb); // For All
			// Term #5
			//-------------------------------------------------------------------------------------------
			// 								Term #5
			//------------------------------------------------------------------------------------------
			var index_total = lastTotalsSet.findIndex(el => el.term === '5');
			for (var i = 0; i < termFiveTebTeb.length; i++) {
				if (i === 0) {
					termFiveTebTeb[i].sub = termFiveTebTeb[i].prd + parseInt(lastTotalsSet[index_total].sub) - termFiveTebTeb[i].lift;
					//termFiveTebTeb[i].sub = termFiveTebTeb[i].prd - termFiveTebTeb[i].lift;
				} else {
					termFiveTebTeb[i].sub = termFiveTebTeb[i].prd + termFiveTebTeb[i - 1].sub - termFiveTebTeb[i].lift;
				}
			}
			termFiveTebTeb.sort((a, b) => {// Sort Descending By Date
				return b.DateFormat - a.DateFormat;
			});
			viewModel.setProperty("/termFiveTebTeb", termFiveTebTeb); // For Binding 
			viewModel.setProperty("/termFiveTebTebAll", termFiveTebTeb); // For All

			// Term #6
			//-------------------------------------------------------------------------------------------
			// 								Term #6
			//------------------------------------------------------------------------------------------
			var index_total = lastTotalsSet.findIndex(el => el.term === '6');
				for (var i = 0; i < terrmSixTabTeb.length; i++) {
					if (i === 0) {
						terrmSixTabTeb[i].sub = terrmSixTabTeb[i].prd + parseInt(lastTotalsSet[index_total].sub) - terrmSixTabTeb[i].lift;
						//terrmSixTabTeb[i].sub = terrmSixTabTeb[i].prd - termFiveTebTeb[i].lift;
					} else {
						terrmSixTabTeb[i].sub = terrmSixTabTeb[i].prd + terrmSixTabTeb[i - 1].sub - terrmSixTabTeb[i].lift;
					}
				}
				terrmSixTabTeb.sort((a, b) => {// Sort Descending By Date
					return b.DateFormat - a.DateFormat;
				});
			viewModel.setProperty("/terrmSixTabTeb", terrmSixTabTeb); // For Binding 
			viewModel.setProperty("/terrmSixTabTebAll", terrmSixTabTeb); // For All

			// PSA 09 
			viewModel.setProperty("/PSA09Set", pas9);

			that.getCapacityTable();

			viewModel.refresh(true);
			console.log("termOneTab 1 ", termOneTab);
		},
		// This is the First Table (Stored Table && Capacity ) -- المخرون / سعه التخزين
		getCapacityTable: function () {
			var that = this,
				viewModel = this.getView().getModel("viewModel"),
				lastTotalsSet = viewModel.getProperty("/lastTotalsSet"),
				psa09 = viewModel.getProperty("/PSA09Set"),
				term01 = viewModel.getProperty("/termOneTab"),
				term02 = viewModel.getProperty("/termTwoTab"),
				term03 = viewModel.getProperty("/termThreeTab"),
				term04 = viewModel.getProperty("/termFourTeb"),
				term05 = viewModel.getProperty("/termFiveTebTeb"),
				term06 = viewModel.getProperty("/terrmSixTabTeb");

			var totalTerm1 = 0,
				totalTerm2 = 0,
				totalTerm3 = 0,
				totalTerm4 = 0,
				totalTerm5 = 0,
				totalTerm6 = 0,
				tabOne = [],
				totalTermsArray = [];
			var totalLift01 = 0, totalPdr01 = 0, totalSub01 = 0;
			var totalLift02 = 0, totalPdr02 = 0, totalSub02 = 0;
			var totalLift03 = 0, totalPdr03 = 0, totalSub03 = 0;
			var totalLift04 = 0, totalPdr04 = 0, totalSub04 = 0;
			var totalLift05 = 0, totalPdr05 = 0, totalSub05 = 0;
			var totalLift06 = 0, totalPdr06 = 0, totalSub06 = 0;
			// Get Sub For Evey Term
			var index_total = lastTotalsSet.findIndex(el => el.term === '1');
			for (var i = 0; i < term01.length; i++) {
				totalTerm1 = + term01[i].sub;
				// For New Tab Total
				totalLift01 += term01[i].lift;
				totalPdr01 += term01[i].prd;
				//totalSub01 += term01[i].sub;
			}
			totalSub01 = totalPdr01 - totalLift01 + parseInt(lastTotalsSet[index_total].sub);
			var index_total = lastTotalsSet.findIndex(el => el.term === '2');
			for (var i = 0; i < term02.length; i++) {
				totalTerm2 = + term02[i].sub;
				// For New Tab Total
				totalLift02 += term02[i].lift;
				totalPdr02 += term02[i].prd;
				//totalSub02 += term02[i].sub;
			}
			totalSub02 = totalPdr02 - totalLift02 + parseInt(lastTotalsSet[index_total].sub);
			var index_total = lastTotalsSet.findIndex(el => el.term === '3');
			for (var i = 0; i < term03.length; i++) {
				totalTerm3 = + term03[i].sub;
				// For New Tab Total
				totalLift03 += term03[i].lift;
				totalPdr03 += term03[i].prd;
				//totalSub03 += term03[i].sub;
			}
			totalSub03 = totalPdr03 - totalLift03 + parseInt(lastTotalsSet[index_total].sub);
			var index_total = lastTotalsSet.findIndex(el => el.term === '4');
			for (var i = 0; i < term04.length; i++) {
				totalTerm4 = + term04[i].sub;
				// For New Tab Total
				totalLift04 += term04[i].lift;
				totalPdr04 += term04[i].prd;
				//totalSub04 += term04[i].sub;
			}
			totalSub04 = totalPdr04 - totalLift04 + parseInt(lastTotalsSet[index_total].sub);
			var index_total = lastTotalsSet.findIndex(el => el.term === '5');
			for (var i = 0; i < term05.length; i++) {
				totalTerm5 = + term05[i].sub;
				// For New Tab Total
				totalLift05 += term05[i].lift;
				totalPdr05 += term05[i].prd;
				//totalSub05 += term05[i].sub;
			}
			totalSub05 = totalPdr05 - totalLift05 + parseInt(lastTotalsSet[index_total].sub);

			//term 06
			var index_total = lastTotalsSet.findIndex(el => el.term === '6');
			for (var i = 0; i < term06.length; i++) {
				totalTerm6 = + term06[i].sub;
				// For New Tab Total
				totalLift06 += term06[i].lift;
				totalPdr06 += term06[i].prd;
				//totalSub05 += term05[i].sub;
			}
			totalSub06 = totalPdr06 - totalLift06 ;
			if (index_total > -1 ){
				totalSub06 += parseInt(lastTotalsSet[index_total].sub);
			}

			// Get El Table 
			for (var i = 0; i < psa09.length; i++) {
				var obj = {}, total;
				if (psa09[i].Term === "0001") {
					obj.total = term01[0].sub;
					//obj.total = totalTerm1;
					obj.Volume = psa09[i].Volume;
					obj.Text = "محطة انتاج رقم (1)";
				} else if (psa09[i].Term === "0002") {
					obj.total = term02[0].sub;
					//obj.total = totalTerm2;
					obj.Volume = psa09[i].Volume;
					obj.Text = "محطة انتاج رقم (2)";
				} else if (psa09[i].Term === "0003") {
					obj.total = term03[0].sub;
					//obj.total = totalTerm3;
					obj.Volume = psa09[i].Volume;
					obj.Text = "محطة انتاج رقم (3)";
				} else if (psa09[i].Term === "0004") {
					obj.total = term04[0].sub;
					//obj.total = totalTerm4;
					obj.Volume = psa09[i].Volume;
					obj.Text = "محطة انتاج رقم (4)";
				} else if (psa09[i].Term === "0005") {
					obj.total = term05[0].sub;
					//obj.total = totalTerm5;
					obj.Volume = psa09[i].Volume;
					obj.Text = "محطة انتاج رقم (5)";
				}else if (psa09[i].Term === "0006") {
					obj.total = term06[0].sub;
					//obj.total = totalTerm5;
					obj.Volume = psa09[i].Volume;
					obj.Text = "محطة انتاج رقم (6)";
				}

				tabOne.push(obj);
			}
			//var totalLift01 = 0, totalPdr01 = 0, totalSub01 = 0;
			var objTerm01;
			objTerm01 = {};
			objTerm01.Text = "محطة انتاج رقم (1)";
			objTerm01.totalLift = totalLift01;
			objTerm01.totalPdr = totalPdr01;
			objTerm01.totalSub = totalSub01;
			totalTermsArray.push(objTerm01);
			objTerm01 = {};
			objTerm01.Text = "محطة انتاج رقم (2)";
			objTerm01.totalLift = totalLift02;
			objTerm01.totalPdr = totalPdr02;
			objTerm01.totalSub = totalSub02;
			totalTermsArray.push(objTerm01);
			objTerm01 = {};
			objTerm01.Text = "محطة انتاج رقم (3)";
			objTerm01.totalLift = totalLift03;
			objTerm01.totalPdr = totalPdr03;
			objTerm01.totalSub = totalSub03;
			totalTermsArray.push(objTerm01);
			objTerm01 = {};
			objTerm01.Text = "محطة انتاج رقم (4)";
			objTerm01.totalLift = totalLift04;
			objTerm01.totalPdr = totalPdr04;
			objTerm01.totalSub = totalSub04;
			totalTermsArray.push(objTerm01);
			objTerm01 = {};
			objTerm01.Text = "محطة انتاج رقم (5)";
			objTerm01.totalLift = totalLift05;
			objTerm01.totalPdr = totalPdr05;
			objTerm01.totalSub = totalSub05;
			totalTermsArray.push(objTerm01);

			//term 6
			objTerm01 = {};
			objTerm01.Text = "محطة انتاج رقم (6)";
			objTerm01.totalLift = totalLift06;
			objTerm01.totalPdr = totalPdr06;
			objTerm01.totalSub = totalSub06;
			totalTermsArray.push(objTerm01);

			// الاجمالي 
			objTerm01 = {};
			objTerm01.Text = "الاجمالي";
			objTerm01.totalLift = totalLift01 + totalLift02 + totalLift03 + totalLift04 + totalLift05 + totalLift06;
			objTerm01.totalPdr = totalPdr01 + totalPdr02 + totalPdr03 + totalPdr04 + totalPdr05 + totalPdr06;
			objTerm01.totalSub = totalSub01 + totalSub02 + totalSub03 + totalSub04 + totalSub05 + totalSub06;
			totalTermsArray.push(objTerm01);


			viewModel.setProperty("/tabOne", tabOne);
			viewModel.setProperty("/totalTermsArray", totalTermsArray);

		},
		// On Filter Term #1 
		onFilterSelect: function (oEvent) {
			var that = this,
				viewModel = this.getView().getModel("viewModel"),
				// oBinding = this.byId("EPF1_tab").getBinding("rows"),
				// termOneTab = viewModel.getProperty("/termOneTabAll"),
				sKey = oEvent.getParameter("key"),
				filterArrMonths = [],
				filterArrQuar = [],
				eventName = oEvent.mParameters.id.split("--")[1];
			if (eventName === 'EPF1') {
				var oBinding = this.byId("EPF1_tab").getBinding("rows"),
					termOneTab = viewModel.getProperty("/termOneTabAll"),
					propertyName = "/termOneTab";
			} else if (eventName === 'EPF2') {
				var oBinding = this.byId("EPF2_tab").getBinding("rows"),
					termOneTab = viewModel.getProperty("/termTwoTabAll"),
					propertyName = "/termTwoTab";
			} else if (eventName === 'EPF3') {
				var oBinding = this.byId("EPF3_tab").getBinding("rows"),
					termOneTab = viewModel.getProperty("/termThreeTabAll"),
					propertyName = "/termThreeTab";
			} else if (eventName === 'EPF4') {
				var oBinding = this.byId("EPF4_tab").getBinding("rows"),
					termOneTab = viewModel.getProperty("/termFourTebAll"),
					propertyName = "/termFourTeb";
			} else if (eventName === 'EPF5') {
				var oBinding = this.byId("EPF5_tab").getBinding("rows"),
					termOneTab = viewModel.getProperty("/termFiveTebTebAll"),
					propertyName = "/termFiveTebTeb";
			} else if (eventName === 'EPF6') {
				var oBinding = this.byId("EPF6_tab").getBinding("rows"),
					termOneTab = viewModel.getProperty("/terrmSixTabTebAll"),
					propertyName = "/terrmSixTabTeb";
			}

			if (sKey === 'All' || sKey === 'Days')
				viewModel.setProperty(propertyName, termOneTab);
			else if (sKey === 'Months') {
				termOneTab.reduce(function (res, value) {
					var idKey = value.Date.substring(0, 7);
					if (!res[idKey]) {
						res[idKey] = {
							Day: that.getMonth(value.Date.substring(5, 7)),
							Date: value.Date.substring(0, 7),
							lift: 0,
							prd: 0,
							sub: value.sub
						};
						filterArrMonths.push(res[idKey])
					}
					res[idKey].lift += value.lift;
					res[idKey].prd += value.prd;
					//res[idKey].sub += value.sub;
					return res;
				}, {});
				//var filterMonthsName =that.getMonthsName();
				viewModel.setProperty(propertyName, filterArrMonths);
			} else if (sKey === 'Quarters') {
				termOneTab.reduce(function (res, value) {
					var idKey = value.Date.substring(0, 7),
						month = parseInt(idKey.substring(5, 7)),
						quarter;
					if (month <= 3)
						quarter = 'Q1';
					else if (month > 3 & month <= 6)
						quarter = 'Q2';
					else if (month > 6 & month <= 9)
						quarter = 'Q3';
					else if (month > 9 & month <= 12)
						quarter = 'Q4';

					if (!res[quarter]) {
						res[quarter] = {
							Day: "Q1",
							Date: value.Date,
							lift: 0,
							prd: 0,
							sub: value.sub,
							Quarter: quarter
						};
						filterArrQuar.push(res[quarter])
					}
					res[quarter].lift += value.lift;
					res[quarter].prd += value.prd;
					//res[quarter].sub += value.sub;
					return res;
				}, {});
				viewModel.setProperty(propertyName, filterArrQuar);
			}
			//oBinding.filter(filterArr);
			viewModel.refresh(true);
		},
		onPressValueHelp: function (oEvent) {
			var that = this,
				viewModel = this.getView().getModel("viewModel"),
				oModel = that.getOwnerComponent().getModel(), //pram.split('--')[pram.split('--').length -1 ]
				pram = oEvent.getSource().getId().split('--')[oEvent.getSource().getId().split('--').length - 1],
				helpValueName = pram;
			oModel.read("/PsaConfSet", {
				method: "GET",
				async: false,
				success: function (data) {
					var property = '/' + pram;
					//const event = that.localModel.getProperty("oEvent");
					viewModel.setProperty(property, data);
					that.onValueHelpPress(helpValueName);
					return;
				},
				error: function (error) {
					console.log("error value help", error);
					return;
				}
			});
		},
		onValueHelpPress: function (helpValueName) {
			var oController = this,
				oFilters = [];

			oController._valueHelpControl = helpValueName;
			if (oController._valueHelpDialog) {
				oController._valueHelpDialog.destroy();
				oController._valueHelpDialog = null;
			}
			if (!oController._valueHelpDialog) {
				oController._valueHelpDialog = sap.ui.xmlfragment(oController.getView().getId(), "PSA_Report3PSA_Report3.view.fragments.ValueHelp",
					oController);
				oController.getView().addDependent(oController._valueHelpDialog);
			}

			if (helpValueName.lastIndexOf("company_code") > -1) {
				var items = this.getView().getModel("viewModel").getProperty("/company_code");
				// filter for just enpedco
				items = [];
				var obj = {};
				obj.CompanyCode = "1000";
				obj.PSCName = "ENPEDCO";
				items.push(obj);
				this.getView().getModel("viewModel").setProperty("/company_code/results", items);
				var oTemplate = new sap.m.StandardListItem({
					title: "{viewModel>CompanyCode}",
					description: "{viewModel>PSCName}",
					type: "Active"
				});
				oController._valueHelpDialog.bindAggregation("items", {
					path: "viewModel>/company_code/results",
					template: oTemplate
				});
				oController._valueHelpDialog.open();
			}
			if (helpValueName.lastIndexOf("PSC_Name") > -1) {
				var items = this.getView().getModel("viewModel").getProperty("/PSC_Name");
				var oTemplate = new sap.m.StandardListItem({
					title: "{viewModel>CompanyCode}",
					description: "{viewModel>PSCName}",
					type: "Active"
				});
				oController._valueHelpDialog.bindAggregation("items", {
					path: "viewModel>/PSC_Name/results",
					template: oTemplate
				});
				oController._valueHelpDialog.open();
			}
		},
		// search for value help
		handleValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value"),
				eventName = oEvent.getSource().getId().split('--')[oEvent.getSource().getId().split('--').length - 1];
			var oFilter = new Filter("PSCName", FilterOperator.Contains, sValue);
			var oFilter2 = new Filter("CompanyCode", FilterOperator.Contains, sValue);

			var oBinding = oEvent.getSource().getBinding("items");
			var f1 = oBinding.filter([oFilter]);
			if (f1.iLength === 0)
				var f2 = oBinding.filter([oFilter2]);
		},
		handleValueHelpClose: function (oEvent) {
			var oController = this,
				oSelectedItem = oEvent.getParameter("selectedItem"),
				dataModel = oController.getView().getModel("viewModel");
			// getTitle ===> is the description of value help
			if (oSelectedItem) {
				// this is to set description of sectore  
				if (this._valueHelpControl.lastIndexOf("company_code") > -1) {
					this.getView().byId('company_code').setValue(oSelectedItem.getTitle());
				}
				if (this._valueHelpControl.lastIndexOf("PSC_Name") > -1) {
					this.getView().byId('PSC_Name').setValue(oSelectedItem.getTitle());
				}
			}

		},
	});
});