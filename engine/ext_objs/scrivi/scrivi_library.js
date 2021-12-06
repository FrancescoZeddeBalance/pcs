"use strict";

var giocoScrivi = {
  radice: "",
  scrittura: "",
  fineGame: "",
  boxHelp: "",
  boxHelpSmart: "",
  stringaPulsantiera: "",
  stringaURL: "",
  nrSchermata: 0,
  parolaIndovinata: new Array(),
  paginaVista: new Array(),
  strAggancio: "",
  parolaSelezionata: null,
  valoreInput: "",
  indiceInputSelezionato: "",
  primaVolta: true,
  mostrami: "",
  mostraBoxFinale: "",
  avantiBloccato: "",
  avanzamentoAutomatico: "",
  varInterval: null,
  varIntervalFeedback: null,
  esitoFeedback: "",
  focusInputSelezionato: "0",
  tabIndexSchermata: 0,
  indiceSuggSel: null,
  orientamento: "",
  boxAperta: false,
  internetExplorer: 0
};

function scrivi_initFunction(contenutiScrivi, folderReference) {
  //app.lib.debugOnConsole("INIT :::scrivi:::");
  giocoScrivi.radice = contenutiScrivi;
  giocoScrivi.scrittura = contenutiScrivi.find("scrittura");
  giocoScrivi.boxHelp = contenutiScrivi.find("boxHelp");
  giocoScrivi.boxHelpSmart = contenutiScrivi.find("boxHelpSmart");
  giocoScrivi.fineGame = contenutiScrivi.find("fineGame");
  giocoScrivi.stringaURL = folderReference;
  giocoScrivi.nrSchermata = 0;
  //giocoScrivi.primaVolta = true;
  
  if(contenutiScrivi.find("fineGame").attr("mostrami")){
	  //è presente attributo "mostrami"
	  if(contenutiScrivi.find("fineGame").attr("mostrami")=="true")
		giocoScrivi.mostraBoxFinale="true";
	  else
		giocoScrivi.mostraBoxFinale="false";
  }
  else{
	  giocoScrivi.mostraBoxFinale="true";
  }
  
  
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {//alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));        
		//internet explorer
		giocoScrivi.internetExplorer = 1;
    }
    else  // If another browser, return 0
    {
        //alert('otherbrowser');
		giocoScrivi.internetExplorer = 0;
    }
  //console.log("------: "+screen.orientation.angle)
  //if ( screen.orientation.angle == 90 ) {
  if(window.innerWidth > window.innerHeight) {
	  giocoScrivi.orientamento = "orizzontale"
  }
  else{
	  giocoScrivi.orientamento = "verticale"
  }
  var objectHtmlContainer = "\n\t\t\t<div id=\"contentMK5\">\n\t\t\t\t<div class=\"conclusioneMK5\"></div>\n\t\t\t\t<div class=\"boxHelp\" role=\"dialog\" aria-labelledby=\"etichettaHelp\" aria-describedby=\"txtboxHelp\"></div>\n\t\t\t\t<div class=\"contentQuizMK5\">\n\t\t\t\t\t<div class=\"sfondoBox\"><div class=\"objBox\" role='dialog' aria-labelledby='' aria-describedby='testoIstruzioniScrivi'></div></div>\n\t\t\t\t\t<div class=\"titolo\"><div></div></div>\n\t\t\t\t\t<div class=\"contaDomande\"></div>\n\t\t\t\t\t<div class=\"contenitoreScrittura\"></div>\n\t\t\t\t\t<div class=\"pulsantieraSmartphone\"></div>\n\t\t\t\t\t<div class=\"pulsantieraTablet\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"; /// Adding HTML to object container

  $(".ax_box_pill_container .ax_current_object_container").html(objectHtmlContainer); /// Listen to keyboard navigationsss
  
  $(document).on("keydown", function (e) {
    /// ESC to exit
    if (e.which == 27) {
      $("#ax_desktop_header_icon_id_" + app.global.CURRENT_OBJECT_INDEX + ".ax_desktop_header_icon").click();
    } //console.log("classname: "+document.activeElement.className)


    if (e.which == 13 || e.which == 32) {
      if (document.activeElement.className == "hotspot txtParte") {
        apriBoxScritturaMK5(event);
      }

      if (document.activeElement.className == "pulsRiavviaMK5") {
        riavviaGiocoMK5();
      }

      if (document.activeElement.className == "pulsRisSuccMK5") {
        risorsaSuccessivaMK5();
      }

      if (document.activeElement.id == "pulsDx") {
        schermataSuccessivaMK5();
      }

      if (document.activeElement.id == "pulsSx") {
        schermataPrecedenteMK5();
      }

      if (document.activeElement.className == "suggerimento suggerimentoWidth") {
        selezionaSuggerimentoMK5();
      }

      if (document.activeElement.className == "suggerimentoControl") {
        controllaMK5();
      }

      if (document.activeElement.className == "suggerimentoSoluz") {
        soluzioneMK5();
      }

      if (document.activeElement.className == "chiudiBoxSuggerimenti") {
        chiudiBoxMK5();
      }

      if (document.activeElement.className == "chiudiBoxHelpScrivi") {
        chiudiBoxHelpScrivi();
      }
    }
  }); /// complete at start
  //app.main.tracer.completeCurrentItem();	
  /// start animation
  //scrivi_animateThisBoxInLibrary(".ext_animated_box");
  creaContenutiScrivi();
}

/*window.addEventListener("orientationchange", function() {
    $("#debugScrivi").html("the orientation of the device is now " + screen.orientation.angle);
});*/

window.addEventListener('orientationchange', orientaGameScrivi)

function orientaGameScrivi() {
	chiudiBoxMK5();
  if(window.innerWidth > window.innerHeight) {
	  giocoScrivi.orientamento = "orizzontale";
   //$("#debugScrivi").html("1 orizzontale"+window.orientation);
  }
  
  if(window.innerWidth < window.innerHeight) {
	  giocoScrivi.orientamento = "verticale";
	//$("#debugScrivi").html("1 verticale"+window.orientation);
  //then do other stuff
  }
  
}

function creaContenutiScrivi() {
	
  /*font e dimensione di riferimento*/
  if(giocoScrivi.radice.attr("fontFamily")!="")
	$("#contentMK5").css("font-family",giocoScrivi.radice.attr("fontFamily"));
  if(giocoScrivi.radice.attr("fontSize")!="")
	$("#contentMK5").css("font-size",giocoScrivi.radice.attr("fontSize"));
  
  giocoScrivi.strAggancio = "";

  for (var s = 0; s < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola").length; s++) {
    giocoScrivi.parolaIndovinata[s] = "0";
    giocoScrivi.strAggancio += "0";
  }

  giocoScrivi.avantiBloccato = giocoScrivi.radice.attr("avantiBloccato");
  giocoScrivi.avanzamentoAutomatico = giocoScrivi.radice.attr("avanzamentoAutomatico");
  var larghezzaRisoluzione = $(".ax_current_object_container").width();

  if (giocoScrivi.scrittura.find("step").length > 1) {
    var testoContatore = giocoScrivi.scrittura.attr("contatoreFraseIniziale") + " " + (giocoScrivi.nrSchermata + 1) + " " + giocoScrivi.scrittura.attr("contatorePreposizione") + " " + giocoScrivi.scrittura.find("step").length;
    //$("#contentMK5 .contaDomande").html("<div id='debugScrivi'></div><div id='contatore' class='contatore' aria-label='" + testoContatore + "'>" + testoContatore + "</div>");
	$("#contentMK5 .contaDomande").html("<div id='contatore' class='contatore' aria-label='" + testoContatore + "'>" + testoContatore + "</div>");
  }

  var strBlocchiTesto = "";

  for (var z = 0; z < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").length; z++) {
    strBlocchiTesto += "<div class='rigaBlocco' tabindex='-1'>";

    if (giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("testo").attr("pathImg") != "") {
      var altImg = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("testo").attr("alt");
      strBlocchiTesto += "<div class='cellaImgBlocco'><img id='imgB" + (z + 1) + "' alt='" + altImg + "' tabindex='-1' src=\"" + giocoScrivi.stringaURL + "" + giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("testo:eq(" + z + ")").attr("pathImg") + "" + "\"/></div>";
      strBlocchiTesto += "<div class='cellaTxtBlocco' id='testo" + (z + 1) + "'></div>";
    } else {
      strBlocchiTesto += "<div class='cellaTxtBloccoSingolo' id='testo" + (z + 1) + "'></div>";
    }

    strBlocchiTesto += "</div>";
  } //FEEDBACK LIVE


  strBlocchiTesto += "<div id=\"feedbackLiveMK5\" role=\"alert\" style=\"position:absolute; z-index:-1; font-size:0.2em;\"></div>";
  var testoTitoloStep = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("titolo");
  $("#contentMK5 .contenitoreScrittura").html("<div class='titoloGame' tabindex='-1' aria-label='" + testoTitoloStep + "'>" + testoTitoloStep + "</div>" + strBlocchiTesto);
  $("#contentMK5 .contenitoreScrittura").css("display", "none");
  $("#contentMK5 .contenitoreScrittura").fadeIn("slow");
  var contaParola = 0;
  var stringaTesto = "";
  var stringaTesto2 = "";
  var splittaStringaTesto;

  for (var z = 0; z < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").length; z++) {
    stringaTesto2 = "";
    stringaTesto = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("testo").text();
    splittaStringaTesto = stringaTesto.split("&&campo&&");

    for (var s = 0; s < splittaStringaTesto.length; s++) {
      splittaStringaTesto[s] = "<span class='txtParte' id='split" + s + "' aria-label='" + splittaStringaTesto[s] + "' tabindex='-1'>" + splittaStringaTesto[s] + "</span>";

      if (s < splittaStringaTesto.length - 1) {
        stringaTesto2 += splittaStringaTesto[s] + "&&campo&&";
      } else {
        stringaTesto2 += splittaStringaTesto[s];
      }
    }

    for (var i = 0; i < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("parola").length; i++) {
      contaParola++;
      stringaTesto2 = stringaTesto2.replace("&&campo&&", "<span id='HS" + contaParola + "' class='hotspot txtParte' style='background-color:" + giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("coloreFondoHotSpot") + "' role='button' aria-label='pulsante suggerimenti'>.....................</span>");
    }

    $("#contentMK5 #testo" + (z + 1)).html(stringaTesto2);
  }

  $("#contentMK5 #testo1").focus();
  var strPulsanti = "";
  //var scorriIndietro = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"ax_desktop_cover_arrows_img svg replaced-svg\" alt=\"prev\" role=\"presentation\"><path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>";
  var scorriIndietro = "<img src=\"./engine/icons/chevron_left_24px.svg\" />";
  //var scorriAvanti = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"ax_desktop_cover_arrows_img svg replaced-svg\" alt=\"next\" role=\"presentation\"><path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>";
  var scorriAvanti = "<img src=\"./engine/icons/chevron_right_24px.svg\" />";
  strPulsanti += "<div id='inserisciPulsSx'><table width='100%'  height='100%' border='0'><tr><td height='100%' valign='middle'><div id=\"pulsSx\" class=\"pulsNavigazioneMK5\" aria-label=" + app.labels.nav_backward + ">" + scorriIndietro + "</div></td></tr></table></div>";
  strPulsanti += "<div id='inserisciPulsDx'><table width='100%' height='100%' border='0'><tr><td height='100%' valign='middle'><div id=\"pulsDx\" class=\"pulsNavigazioneMK5\" aria-label=" + app.labels.nav_forward + ">" + scorriAvanti + "</div></td></tr></table></div>";
  $("#contentMK5 .contenitoreScrittura").append(strPulsanti);
  aggiornaPalliniMK5();
  /*help*/

  giocoScrivi.mostrami = giocoScrivi.boxHelp.attr("mostrami");

  if (giocoScrivi.mostrami == "true" && giocoScrivi.primaVolta) {
    giocoScrivi.primaVolta = false;
    var strBoxHelp = "";
    strBoxHelp += "<div class='muoviBoxHelp'>";
    strBoxHelp += "<div class='contboxHelp'>";
    strBoxHelp += "<div class='titboxHelp'>";
    strBoxHelp += "<table width='100%' border='0'><tr><td id='distanziaEtHelp' style='text-align=center;'></td><td id='cellaIconaHelp' width='30px' style='text-align=center; valign:middle;'>";
    strBoxHelp += "<!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon --><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' xml:space='preserve'><metadata> Svg Vector Icons :http://www.onlinewebfonts.com/icon </metadata><g><path fill='#FFFFFF' d='M500,9.8C229.4,9.8,10,229.3,10,500c0,270.7,219.4,490.2,490,490.2c270.6,0,490-219.5,490-490.2C990,229.3,770.6,9.8,500,9.8z M500,908.5C274.5,908.5,91.7,725.6,91.7,500C91.7,274.4,274.5,91.5,500,91.5c225.5,0,408.3,182.9,408.3,408.5C908.3,725.6,725.5,908.5,500,908.5z M459.2,744.8h81.7v-80.4l-81.9-1L459.2,744.8z M620.5,278.3c-35-25.3-72.7-36.5-125.6-34.1c-28.8,1.3-67.3,10.4-94.3,29.3c-47.7,33-62.1,77.8-64.8,144.5h82.4c0-19.4,5.7-45.9,17-63.9c11.3-18,30.8-30.2,64.1-33.4c34.6-2.9,57,9.2,67.2,18.1c25.5,23,15.2,81.1-6.1,104c-9.1,10.4-48.5,40.8-48.5,40.8c-25.2,19.7-37,37.1-43.1,52.2c-6.1,15.2-8.6,47.6-10,87.2h82.5l0.7-9.6c0,0-8.2-57,21.9-76.4l38.9-25.7c25.2-19.6,32.1-26.9,41-39.6c15.2-20.9,26.6-46.5,26.6-77C670.5,344.9,655.5,303.6,620.5,278.3z'/></g></svg>";
    strBoxHelp += "</td><td><div id='etichettaHelp' tabindex='31'>" + giocoScrivi.boxHelp.attr("etichetta") + "</div></td><td width='20px'><div class='chiudiBoxHelpScrivi' style='text-align:right; cursor:pointer;' role='button' aria-label='" + giocoScrivi.boxHelp.attr("aria-label-help") + "' tabindex='33'>";
    strBoxHelp += "<svg id=\"svgChiudiHelp\" data-name=\"svgChiudiHelp\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.scrivi_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"scrivi_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
    strBoxHelp += "</div></td></tr></table>";
    strBoxHelp += "</div>";
    strBoxHelp += "<hr>";
    strBoxHelp += "<div id='txtboxHelp' class='txtboxHelp' tabindex='32'>"; //boxHelpSmart

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      strBoxHelp += giocoScrivi.boxHelpSmart.text();
    } else {
      strBoxHelp += giocoScrivi.boxHelp.text();
    }

    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    $("#contentMK5 .boxHelp").html(strBoxHelp);
    $("#contentMK5 .boxHelp").css("display", "block");
	var animationDurationFirst = 800;
    if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
    $("#contentMK5 .muoviBoxHelp").fadeIn().css({
      top: -200,
      position: 'absolute'
    }).animate({
      top: 5
    }, animationDurationFirst, function () {
      //callback
      $("#contentMK5 #etichettaHelp").focus();
    });
    document.querySelector(".chiudiBoxHelpScrivi").addEventListener("click", chiudiBoxHelpScrivi);
  } else {
    //se non è presente l'help, inserire il focus sul primo oggetto
    indicizzaTestiMK5();
    $("#contentMK5 .contatore").focus();
  }
  if(giocoScrivi.scrittura.attr("bgColor")!="")
	$("#contentMK5").css("background-color", giocoScrivi.scrittura.attr("bgColor")); //MANIPOLO IL CSS DEL FONT

  var coloreFONT;
  var coloreFONTtit;
  var grandezzaFONT;
  var interlineaFONT;
  var grandezzaFONTtit;
  var interlineaFONTtit;
  contaParola = 0;

  for (var z = 0; z < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").length; z++) {
    coloreFONT = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("testo").attr("textColor");
	if(coloreFONT!="")
		$("#contentMK5 .contentQuizMK5 .contenitoreScrittura #testo" + (z + 1) + "").css("color", coloreFONT);
    grandezzaFONT = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("testo").attr("txtboxSize");
    interlineaFONT = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("testo").attr("txtboxLineHeight");

	//giocoScrivi.orientamento = "verticale"
    //if ( !app.global.IS_SMARTPHONE || ($(".ax_current_object_container").width() >= 768 &&giocoScrivi.orientamento == "verticale") ) {
	/*if ( !app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768 ) {
      $("#contentMK5 .contentQuizMK5 .contenitoreScrittura #testo" + (z + 1) + "").css("font-size", grandezzaFONT);
      $("#contentMK5 .contentQuizMK5 .contenitoreScrittura #testo" + (z + 1) + "").css("line-height", interlineaFONT);
    }*/
	
	switch(giocoScrivi.orientamento) {
	  case "orizzontale":
		// code block
		if ( !app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() > 900 ) {
		  if(grandezzaFONT!="")
			$("#contentMK5 .contentQuizMK5 .contenitoreScrittura #testo" + (z + 1) + "").css("font-size", grandezzaFONT);
		  if(interlineaFONT!="")
			$("#contentMK5 .contentQuizMK5 .contenitoreScrittura #testo" + (z + 1) + "").css("line-height", interlineaFONT);
		}
		break;
	  case "verticale":
		// code block
		if ( !app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() == 768 ) {
		  if(grandezzaFONT!="")
			$("#contentMK5 .contentQuizMK5 .contenitoreScrittura #testo" + (z + 1) + "").css("font-size", grandezzaFONT);
		  if(interlineaFONT!="")
			$("#contentMK5 .contentQuizMK5 .contenitoreScrittura #testo" + (z + 1) + "").css("line-height", interlineaFONT);
		}
		break;
	  default:
		// code block
	}
	

    for (var p = 0; p < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("parola").length; p++) {
      contaParola++;
      document.querySelector("#contentMK5 #HS" + contaParola).addEventListener("click", apriBoxScritturaMK5);
    }
  } //css titolo


  coloreFONTtit = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("titTextColor");
  grandezzaFONTtit = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("titboxSize");
  interlineaFONTtit = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("titboxLineHeight");
  if(coloreFONTtit!="")
	$("#contentMK5 .contentQuizMK5 .titoloGame").css("color", coloreFONTtit);
  if(grandezzaFONTtit!="")
	$("#contentMK5 .contentQuizMK5 .titoloGame").css("font-size", grandezzaFONTtit);
  if(interlineaFONTtit!="")
	$("#contentMK5 .contentQuizMK5 .titoloGame").css("line-height", interlineaFONTtit);
}

function chiudiBoxHelpScrivi(e) {
  $("#contentMK5 .boxHelp").fadeOut("slow");
  var animationDurationFirst = 800;
  if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
  $("#contentMK5 .muoviBoxHelp").fadeIn().css({
    top: 5,
    position: 'absolute'
  }).animate({
    top: -200
  }, animationDurationFirst, function () {
    //callback
    $("#contentMK5 .boxHelp").css("display", "none");
    indicizzaTestiMK5();
    $("#contentMK5 .contatore").focus();
  });
}

$('#contentMK5 input').on('touchstart', function(e){
	//console.log("/////////////////// -------------");
     e.preventDefault();
     e.stopPropagation();
     $(this).trigger('focus');
});

function apriBoxScritturaMK5(event) {
  giocoScrivi.boxAperta = true;
  var idSelezionato = event.target.id;
  var quale = parseInt(idSelezionato.substr(2)) - 1;
  giocoScrivi.parolaSelezionata = quale;
  inibisciTestiMK5();
  var strBoxCard = "";
  var p = $("#contentMK5 #" + event.target.id);
  var contenitoreH = parseInt($(".ax_object_container").height());
  var contenitore = parseInt($(".ax_object_container").width());
  var position = p.position();
  var offset = p.offset(); //detect scale value

  var contenitorePillola = document.getElementById("ax_scalable_pill_container_id");
  var st = window.getComputedStyle(contenitorePillola, null);
  var trasformazione = st.getPropertyValue("-webkit-transform") || st.getPropertyValue("-moz-transform") || st.getPropertyValue("-ms-transform") || st.getPropertyValue("-o-transform") || st.getPropertyValue("transform") || "fail...";
  var calcoloTop;
  var calcoloLeft; //console.log('Matrix: ' + trasformazione);

  if (trasformazione != "none") {
    var splittaValues = trasformazione.split('(')[1];
    splittaValues = splittaValues.split(')')[0];
    splittaValues = splittaValues.split(',');
    var scaleValue = splittaValues[0];
    calcoloTop = parseInt(position.top * contenitoreH / ($(".ax_object_container").height() * scaleValue));
    calcoloLeft = parseInt(position.left * contenitore / ($(".ax_object_container").width() * scaleValue));
  } else {
    calcoloTop = parseInt(position.top * contenitoreH / $(".ax_object_container").height());
    calcoloLeft = parseInt(position.left * contenitore / $(".ax_object_container").width());
  }

  strBoxCard += "";
  strBoxCard += "<div class='frecciaBoxSu' tabindex='-1' style='margin-bottom:-0.2em; text-align:left; width:100%;'><table cellpadding='0' cellspacing='0' border='0'><tr><td valign='top'>";
  strBoxCard += "<img src='./engine/imgs/freccia.png'/>";
  strBoxCard += "</td></tr></table></div>";
  strBoxCard += "<div class='contbox'>";
  var indiceTab = 29;
  strBoxCard += "<div class='titboxType' tabindex='-1' aria-label=''>";
  /*istruzioni dinamiche*/

  var campoSuggerimento = false;
  var campoScrittura = false;
  var txtIstruzioni = "";

  for (var x = 0; x < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + quale + ")").children("suggerimento").length; x++) {
    if (giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + quale + ")").children("suggerimento:eq(" + x + ")").text() != "&&input&&") {
      campoSuggerimento = true;
    } else {
      campoScrittura = true;
    }

    if (campoSuggerimento && campoScrittura) txtIstruzioni = giocoScrivi.radice.children("istruzioni").text();else if (campoSuggerimento) txtIstruzioni = giocoScrivi.radice.children("istruzioniSelect").text();else if (campoScrittura) txtIstruzioni = giocoScrivi.radice.children("istruzioniType").text();
  }
  /*fine istruzioni dinamiche*/


  indiceTab++;
  strBoxCard += "<table width='100%' border='0'><tr>";
  strBoxCard += "<td><div class='testoIstruzioniScrivi' tabindex='" + indiceTab + "' aria-label='" + txtIstruzioni + "'>" + txtIstruzioni + "</td>";
  strBoxCard += "<td width='20px'><div class='chiudiBoxSuggerimenti' tabindex='-1' aria-label='" + giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("ariaLabelChiudiPopUp") + "' style='text-align:right; cursor:pointer;'>";
  strBoxCard += "<svg id=\"svgChiudiPopupMK5\" data-name=\"svgChiudiPopupMK5\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.scrivi_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"scrivi_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
  strBoxCard += "</div></td></tr></table>";
  strBoxCard += "</div>";
  strBoxCard += "<hr>";
  strBoxCard += "<div class='txtboxParole' aria-hidden:'false'>";
  var svgErrore = "<svg version=\"1.1\" id=\"feedNoMK5\" aria-label=\""+giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("feedbackErratoScreenReader")+"\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 24 24\" style=\"enable-background:new 0 0 24 24;\" xml:space=\"preserve\"><style type=\"text/css\">.st0MK5{fill:#FFFFFF;}.st1MK5{fill:#B00020;}</style><g><rect x=\"2.4\" y=\"3.4\" class=\"st0MK5\" width=\"18.7\" height=\"17.8\"/><g><path class=\"st1MK5\" d=\"M21.3,0H2.7C1.2,0,0,1.2,0,2.7v18.7C0,22.8,1.2,24,2.7,24h18.7c1.5,0,2.7-1.2,2.7-2.7V2.7	C24,1.2,22.8,0,21.3,0z M18.7,16.8l-1.9,1.9L12,13.9l-4.8,4.8l-1.9-1.9l4.8-4.8L5.3,7.2l1.9-1.9l4.8,4.8l4.8-4.8l1.9,1.9L13.9,12 L18.7,16.8z\"/></g></g></svg>";

  for (var z = 0; z < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + quale + ")").children("suggerimento").length; z++) {
	  
	var AriaLabelSuggerimento = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + quale + ")").children("suggerimento:eq(" + z + ")").attr("aria-label");
	
    if (giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + quale + ")").children("suggerimento:eq(" + z + ")").text() != "&&input&&") {
      indiceTab++;
      var testoSuggerimento = giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + quale + ")").children("suggerimento:eq(" + z + ")").text();
      
      strBoxCard += "<div class='suggerimento suggerimentoWidth' id='sugg" + z + "' tabindex='" + indiceTab + "' role='button' aria-label='" + AriaLabelSuggerimento + "' onClick='javascript:selezionaSuggerimentoMK5(" + z + ")'>";
      strBoxCard += "<div class='txtSuggerimento' id='txsg" + z + "' onClick='javascript:selezionaSuggerimentoMK5(" + z + ")'>";
      strBoxCard += testoSuggerimento;
	  if(giocoScrivi.internetExplorer == 1)
		strBoxCard += "<div id='feedNo" + z + "' class='feedNoIE'>";
	  else
		strBoxCard += "<div id='feedNo" + z + "' class='feedNo'>";
      strBoxCard += svgErrore;
      strBoxCard += "</div>";
      strBoxCard += "</div>";
      strBoxCard += "</div>";
    } else {
      giocoScrivi.indiceInputSelezionato = z;
      indiceTab++;
      strBoxCard += "<div class='contSuggerimento'>";
      strBoxCard += "<div class='suggerimentoInput suggerimentoWidth'>";
      strBoxCard += "<input id='input" + z + "' class='campotesto' tabindex='" + indiceTab + "' aria-label='" + AriaLabelSuggerimento + "' type='text' onkeyup='ctrlParolaMK5(event)' placeholder='" + giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + quale + ")").attr("txtPlaceHolder") + "' style='outline: none;'>";
      if(giocoScrivi.internetExplorer == 1)
		strBoxCard += "<div id='feedNo" + z + "' class='feedNoIE'>";
	  else
		strBoxCard += "<div id='feedNo" + z + "' class='feedNo'>";
      strBoxCard += svgErrore;
      strBoxCard += "</div>";
      strBoxCard += "</div>";
      indiceTab++;
      strBoxCard += "<div class='suggerimentoControl' aria-label='" + giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("ariaLabelControlla") + "' role='button' tabindex='" + indiceTab + "'>";
      strBoxCard += "<div>" + giocoScrivi.scrittura.attr("etichettaControllo") + "&nbsp;</div>";
      strBoxCard += "</div>";
      indiceTab++;
      strBoxCard += "<div class='suggerimentoSoluz' aria-label='" + giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("ariaLabelSuggerimentoSoluz") + "' role='button' tabindex='" + indiceTab + "'>";
      strBoxCard += "<div>" + giocoScrivi.scrittura.attr("etichettaSoluzione") + "&nbsp;</div>";
      strBoxCard += "</div>";
      strBoxCard += "</div>";
    }
  }

  strBoxCard += "</div>";
  strBoxCard += "</div>";
  strBoxCard += "<div class='frecciaBoxGiu' style='margin-bottom:-0.2em; text-align:left; width:100%;'><table cellpadding='0' cellspacing='0' border='0'><tr><td valign='top'>";
  strBoxCard += "<img src='./engine/imgs/freccia_giu.png'/>"; //strBoxCard += "<div id=\"triangle-down\"></div>"

  strBoxCard += "</tr></td></table></div>";
  $("#contentMK5 .objBox").html(strBoxCard);
  $("#contentMK5 .objBox").fadeIn("fast");
  document.querySelector(".chiudiBoxSuggerimenti").addEventListener("click", chiudiBoxMK5); //document.querySelector(".suggerimento").addEventListener("click",selezionaSuggerimentoMK5);

  $("#contentMK5 .suggerimentoControl").hide();
  $("#contentMK5 .suggerimentoSoluz").hide();
  $("#contentMK5 .suggerimentoControl").css("cursor", "default");
  $("#contentMK5 .suggerimentoSoluz").css("cursor", "default");
  indiceTab++;
  $("#contentMK5 .chiudiBoxSuggerimenti").attr("tabindex", indiceTab); //posiziono il feedback negativo sopra la parola digitata
  //$(".contentQuizMK5 .suggerimentoInput .feedNo").css("margin-left",( (parseInt( ($(".contentQuizMK5 .suggerimentoInput").css("width")))/2) )+"%");
  //$(".contentQuizMK5 .suggerimentoInput .feedNo").css("margin-left",( (parseInt( ($(".contentQuizMK5 .suggerimentoInput").css("width")))-10) )+"%");

  
  if(giocoScrivi.internetExplorer == 1){
	  $(".contentQuizMK5 .suggerimentoInput .feedNoIE").css("width", "100%");
	  $(".contentQuizMK5 .suggerimentoInput .feedNoIE").css("text-align", "right");
	  $(".contentQuizMK5 .suggerimentoInput .feedNoIE").css("margin-top", "-8px");
  }
  else{
	  $(".contentQuizMK5 .suggerimentoInput .feedNo").css("width", "100%");
	  $(".contentQuizMK5 .suggerimentoInput .feedNo").css("text-align", "right");
	  $(".contentQuizMK5 .suggerimentoInput .feedNo").css("margin-top", "-8px");
  }
  var altezzaBox = $("#contentMK5 .contbox").height();
  var altezzaFreccia = $("#contentMK5 .frecciaBoxSu").height();
  var altezzaComplessiva;
  if (app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() < 768) altezzaComplessiva = altezzaBox + 55;else altezzaComplessiva = altezzaBox + 85;

  if (parseInt(position.top) > $(".ax_current_object_container").width() / 2) {
    $("#contentMK5 .frecciaBoxSu").css("display", "none");
    $("#contentMK5 .frecciaBoxGiu").css("display", "block");
    $("#contentMK5 .objBox").css("top", parseInt(calcoloTop) - altezzaComplessiva - 95 + "px");
    $("#contentMK5 .frecciaBoxGiu img").css("marginLeft", calcoloLeft + "px");
  } else {
    $("#contentMK5 .frecciaBoxSu").css("display", "block");
    $("#contentMK5 .frecciaBoxGiu").css("display", "none");
    $("#contentMK5 .objBox").css("top", parseInt(calcoloTop) + p.height() + "px");
    $("#contentMK5 .frecciaBoxSu img").css("marginLeft", calcoloLeft + "px");
  }

  $("#contentMK5 .sfondoBox").fadeIn("slow", function () {});

  /*if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    var larghezzaSugg = 100 / giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + quale + ")").children("suggerimento").length;
    $("#contentMK5 .suggerimentoWidth").css("width", parseInt(larghezzaSugg) - 0.6 + "%");
  }*/

  $("#contentMK5 .testoIstruzioniScrivi").focus();
}

function chiudiBoxMK5() {
	if(giocoScrivi.boxAperta){
		$("#contentMK5 .objBox").fadeOut("slow");
		$("#contentMK5 .sfondoBox").fadeOut("fast");
		indicizzaTestiMK5();
		$("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).focus(); //metto il focus sull'hotspot da cui provenivo
	}
	giocoScrivi.boxAperta = false;
}

function ctrlParolaMK5(event) {
  giocoScrivi.valoreInput = $("#contentMK5 input").val();
  $("#contentMK5 #feedNo" + giocoScrivi.indiceInputSelezionato).css("visibility", "hidden");

  if ($("#contentMK5 input").val().length > 0) {
    $("#contentMK5 .suggerimentoControl").show();
    $("#contentMK5 .suggerimentoSoluz").show();
    document.querySelector("#contentMK5 .suggerimentoControl").addEventListener("click", controllaMK5);
    document.querySelector("#contentMK5 .suggerimentoSoluz").addEventListener("click", soluzioneMK5);
    $("#contentMK5 .suggerimentoControl").css("cursor", "pointer");
    $("#contentMK5 .suggerimentoSoluz").css("cursor", "pointer");
  } else {
    $("#contentMK5 .suggerimentoControl").hide();
    $("#contentMK5 .suggerimentoSoluz").hide();
  }

  if (event.which == 13) {
    //alert('You pressed enter!');
    controllaMK5(giocoScrivi.parolaSelezionata);
  }
}

function controllaMK5(parola) {
	clearInterval(giocoScrivi.varIntervalFeedback);
  if (giocoScrivi.valoreInput.toLowerCase() == giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + giocoScrivi.parolaSelezionata + ")").attr("corretta").toLowerCase()) {
    //console.log("esatta")
    giocoScrivi.parolaIndovinata[giocoScrivi.parolaSelezionata] = "1";
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).html(giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + giocoScrivi.parolaSelezionata + ")").attr("corretta"));
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).removeClass("hotspot");
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).addClass("txtVerde");
    document.querySelector("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).removeEventListener("click", apriBoxScritturaMK5);
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).css("background-color", "transparent");
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).attr("aria-label", $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).html());
    giocoScrivi.esitoFeedback = "1";
    $("#contentMK5 #feedbackLiveMK5").html(giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("feedbackCorrettoScreenReader"));
    //$("#contentMK5 #feedbackLiveMK5").focus();
    giocoScrivi.varIntervalFeedback = setInterval(leggiFeedbackScrivi, 500);
	//clearInterval(giocoScrivi.varIntervalFeedback);
	//leggiFeedbackScrivi();

    chiudiBoxMK5();
  } else {
    //console.log("errata"+" // "+ indiceInputSelezionato)
    giocoScrivi.esitoFeedback = "0";
    giocoScrivi.focusInputSelezionato = "1";
    $("#contentMK5 #feedNo" + giocoScrivi.indiceInputSelezionato).css("visibility", "visible");

    if (giocoScrivi.valoreInput.length > 1) {//$(".suggerimentoControl").html( "<div style='cursor:pointer;' onClick='javascript:controlla("+parolaSelezionata+")'>"+gioco.scrittura.attr("etichettaControllo")+"</div>" );
      //$("#contentMK5 .suggerimentoSoluz").html( "<div style='cursor:pointer;' onClick='javascript:soluzione("+giocoScrivi.parolaSelezionata+")'>"+giocoScrivi.scrittura.attr("etichettaSoluzione")+"</div>" );
    } else {//$(".suggerimentoControl").html( "<div>&nbsp;</div>" );
        //$("#contentMK5 .suggerimentoSoluz").html( "<div>&nbsp;</div>" );
      }

    $("#contentMK5 #feedbackLiveMK5").html(giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("feedbackErratoScreenReader"));
    //$("#contentMK5 #feedbackLiveMK5").focus();
    giocoScrivi.varIntervalFeedback = setInterval(leggiFeedbackScrivi, 500);
	//clearInterval(giocoScrivi.varIntervalFeedback);
	//leggiFeedbackScrivi();
  }
}

function leggiFeedbackScrivi() {
  clearInterval(giocoScrivi.varIntervalFeedback);

  $("#contentMK5 #feedbackLiveMK5").focus();
  $("#contentMK5 #feedbackLiveMK5").html("");

  if (giocoScrivi.esitoFeedback == "1" || giocoScrivi.esitoFeedback == "2") {
    //corretta o soluzione
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).focus();
    controllaConclusioneMK5();
  } else {
    if (giocoScrivi.focusInputSelezionato == "1") {
      giocoScrivi.focusInputSelezionato = "0";
      $("#contentMK5 #input" + giocoScrivi.indiceInputSelezionato).focus();
    } else {
      $("#contentMK5 #sugg" + giocoScrivi.indiceSuggSel).focus();
    }

  }

  giocoScrivi.esitoFeedback = "";
}

function selezionaSuggerimentoMK5(sugg) {
	clearInterval(giocoScrivi.varIntervalFeedback);
  var suggSelezionato = document.activeElement.id;
  giocoScrivi.indiceSuggSel = suggSelezionato.substr(4);
  sugg = giocoScrivi.indiceSuggSel;

  if (giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + giocoScrivi.parolaSelezionata + ")").children("suggerimento:eq(" + sugg + ")").text() == giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + giocoScrivi.parolaSelezionata + ")").attr("corretta")) {
    //console.log("esatta")
    giocoScrivi.esitoFeedback = "1";
    giocoScrivi.parolaIndovinata[giocoScrivi.parolaSelezionata] = "1";
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).html(giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + giocoScrivi.parolaSelezionata + ")").attr("corretta"));
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).removeClass("hotspot");
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).addClass("txtVerde");
    document.querySelector("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).removeEventListener("click", apriBoxScritturaMK5);
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).css("background-color", "transparent");
    $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).attr("aria-label", $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).html());
    chiudiBoxMK5();
    $("#contentMK5 #feedbackLiveMK5").html(giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("feedbackCorrettoScreenReader"));
    $("#contentMK5 #feedbackLiveMK5").focus();
    giocoScrivi.varIntervalFeedback = setInterval(leggiFeedbackScrivi, 500);
	//clearInterval(giocoScrivi.varIntervalFeedback);
	//leggiFeedbackScrivi();
  } else {
    //console.log("errata"+" // "+ sugg)
    $("#contentMK5 #feedNo" + sugg).css("visibility", "visible");
    $("#contentMK5 #feedbackLiveMK5").html(giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").attr("feedbackErratoScreenReader"));
    $("#contentMK5 #feedbackLiveMK5").focus();
    giocoScrivi.varIntervalFeedback = setInterval(leggiFeedbackScrivi, 500);
	//clearInterval(giocoScrivi.varIntervalFeedback);
	//leggiFeedbackScrivi();
  }
}

function soluzioneMK5() {
	clearInterval(giocoScrivi.varIntervalFeedback);
  giocoScrivi.parolaIndovinata[giocoScrivi.parolaSelezionata] = "1";
  giocoScrivi.esitoFeedback = "2";
  $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).html(giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + giocoScrivi.parolaSelezionata + ")").attr("corretta"));
  $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).removeClass("hotspot");
  $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).addClass("txtVerde");
  document.querySelector("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).removeEventListener("click", apriBoxScritturaMK5);
  $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).css("background-color", "transparent");
  $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).attr("aria-label", $("#contentMK5 #HS" + (giocoScrivi.parolaSelezionata + 1)).html());
  chiudiBoxMK5();
  $("#contentMK5 #feedbackLiveMK5").html("La soluzione è " + giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola:eq(" + giocoScrivi.parolaSelezionata + ")").attr("corretta"));
  $("#contentMK5 #feedbackLiveMK5").focus();
  giocoScrivi.varIntervalFeedback = setInterval(leggiFeedbackScrivi, 500);
  //clearInterval(giocoScrivi.varIntervalFeedback);
  //leggiFeedbackScrivi();
}

function aggiornaPalliniMK5() {
  var nrPallini = giocoScrivi.scrittura.find("step").length;
  giocoScrivi.stringaPulsantiera = "";
  giocoScrivi.stringaPulsantiera += "<div id=\"contPallini\">";

  for (var r = 0; r < nrPallini; r++) {
    if (r == giocoScrivi.nrSchermata) {
      giocoScrivi.stringaPulsantiera += "<div id=\"pallino" + r + "\" class=\"pallino\" style='background-color: #464646; border: 1px solid " + giocoScrivi.scrittura.attr("bgColor") + "; box-shadow: 0 0 0 2px #999999;'></div>";
    } else {
      giocoScrivi.stringaPulsantiera += "<div id=\"pallino" + r + "\" class=\"pallino\"></div>";
    }
  }

  giocoScrivi.stringaPulsantiera += "</div>";
  if (giocoScrivi.scrittura.find("step").length > 1) $(".contentQuizMK5 .pulsantieraTablet").html(giocoScrivi.stringaPulsantiera);else $(".contentQuizMK5 .pulsantieraTablet").html("");

  if (giocoScrivi.nrSchermata == nrPallini - 1 && nrPallini == 1) {
    $("#pulsSx").hide();
    $("#pulsDx").hide();
  } else {
    if (giocoScrivi.nrSchermata == nrPallini - 1) {
      $("#pulsSx").show();
      $("#pulsDx").hide();
      $("#pulsSx").css("cursor", "pointer");
      $("#pulsDx").css("cursor", "default");
    } else {
      if (giocoScrivi.nrSchermata + 1 == 1) {
        $("#pulsSx").hide();
        $("#pulsSx").css("cursor", "default");
      } else {
        $("#pulsSx").show();
        $("#pulsSx").css("cursor", "pointer");
      }

      if (giocoScrivi.avanzamentoAutomatico != "Y") {
        if (giocoScrivi.avantiBloccato == "Y") {
          if (giocoScrivi.strAggancio.indexOf("0") == -1 || giocoScrivi.paginaVista[giocoScrivi.nrSchermata] == "1") {
            $("#pulsDx").show();
            $("#pulsDx").css("cursor", "pointer");
          } else {
            $("#pulsDx").hide();
            $("#pulsDx").css("cursor", "default");
          }
        } else {
          $("#pulsDx").show();
          $("#pulsDx").css("cursor", "pointer");
        }
      } else {
        //avanzamento automatico
        $("#pulsDx").hide();
      }
    }
  }

  if ($("#pulsDx").css("display") != "none") document.querySelector("#pulsDx").addEventListener("click", schermataSuccessivaMK5);
  if ($("#pulsSx").css("display") != "none") document.querySelector("#pulsSx").addEventListener("click", schermataPrecedenteMK5);
}

function schermataSuccessivaMK5() {
  giocoScrivi.nrSchermata++;
  creaContenutiScrivi();
  inibisciTestiMK5();
  indicizzaTestiMK5();
  $("#contentMK5 .contatore").focus();
}

function schermataPrecedenteMK5() {
  giocoScrivi.nrSchermata--;
  creaContenutiScrivi();
  inibisciTestiMK5();
  indicizzaTestiMK5();
  $("#pulsDx").show();
  if ($("#pulsDx").css("display") != "none") document.querySelector("#pulsDx").addEventListener("click", schermataSuccessivaMK5);
  $("#contentMK5 .contatore").focus();
}

function controllaConclusioneMK5() {
	clearInterval(giocoScrivi.varIntervalFeedback);
  giocoScrivi.strAggancio = "";

  for (var s = 0; s < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").children("parola").length; s++) {
    if (giocoScrivi.parolaIndovinata[s] == "1") {
      giocoScrivi.strAggancio += "1";
    } else {
      giocoScrivi.strAggancio += "0";
    }
  }
  
  console.log("giocoScrivi.strAggancio: "+giocoScrivi.strAggancio)

  if (giocoScrivi.strAggancio.indexOf("0") == -1) {
    //fine pagina
    giocoScrivi.paginaVista[giocoScrivi.nrSchermata] = "1";

    if (giocoScrivi.nrSchermata == giocoScrivi.scrittura.find("step").length - 1) {
		console.log("quiiiiiii")
      giocoScrivi.varInterval = setInterval(conclusioneMK5, 500);
    } else {
      if (giocoScrivi.avanzamentoAutomatico != "Y") {
        $("#pulsDx").show();
        $("#pulsDx").css("cursor", "pointer");
      } else {
        giocoScrivi.varInterval = setInterval(avanzamentoAutomatico, 500);
      }
    }
  }
}

function avanzamentoAutomatico() {
  clearInterval(giocoScrivi.varInterval);
  schermataSuccessivaMK5();
}

function conclusioneMK5() {
  clearInterval(giocoScrivi.varInterval); //giocoFinito();

  app.main.tracer.completeCurrentItem();
  var indiceElementi = 30;
  
    if(giocoScrivi.mostraBoxFinale=="true"){
  
	  var strConclusione = "";
	  strConclusione += "<div class='contTxtConclusioniMK5' role='dialog' aria-labelledby='titConclusioniMK5' aria-describedby='txtConclusioniMK5' tabindex='" + indiceElementi + "'>";

	  if (giocoScrivi.fineGame.attr("etichetta") != "") {
		indiceElementi++;
		strConclusione += "<div class='titConclusioniMK5' tabindex='" + indiceElementi + "'>";
		strConclusione += giocoScrivi.fineGame.attr("etichetta");
		strConclusione += "</div>";
	  }

	  strConclusione += "<hr>";
	  indiceElementi++;
	  strConclusione += "<div class='txtConclusioniMK5' tabindex='" + indiceElementi + "'>";
	  strConclusione += giocoScrivi.fineGame.text();
	  strConclusione += "</div>";

	  if (giocoScrivi.fineGame.attr("mostraRiavvia") == "true") {
		indiceElementi++;
		strConclusione += "<div class='contPulsRiavviaMK5'>";
		strConclusione += "<div class='pulsRiavviaMK5' tabindex='" + indiceElementi + "' role='button' aria-label='" + giocoScrivi.fineGame.attr("aria-label-pulsante") + "'>" + giocoScrivi.fineGame.attr("pulsanteRiavvia") + "</div>";
	  }
	  
	  if( giocoScrivi.fineGame.attr("presenzaPulsanteRisSucc")=="1" ){
		indiceElementi++;
		strConclusione += "<div class='pulsRisSuccMK5' tabindex='" + indiceElementi + "' role='button' aria-label='" + giocoScrivi.fineGame.attr("aria-label-pulsanteRisSucc") + "'>" + giocoScrivi.fineGame.attr("pulsanteRisSucc") + "</div>";
	  }
	  strConclusione += "</div>";
	  strConclusione += "</div>";
	  $("#contentMK5 .conclusioneMK5").html(strConclusione);
	  inibisciTestiMK5(); //tolgo i tabindex e gli eventi
	  //formattazione da xml
	  
	  if(giocoScrivi.fineGame.attr("sfondoPulsante")!="")
		$("#contentMK5 .pulsRiavviaMK5").css("background-color", giocoScrivi.fineGame.attr("sfondoPulsante"));
	  if(giocoScrivi.fineGame.attr("coloreTestoPulsante")!="")
		$("#contentMK5 .pulsRiavviaMK5").css("color", giocoScrivi.fineGame.attr("coloreTestoPulsante"));
	  if( giocoScrivi.fineGame.attr("presenzaPulsanteRisSucc")=="1" ){
		if(giocoScrivi.fineGame.attr("sfondoPulsante")!="")
			$("#contentMK5 .pulsRisSuccMK5").css("background-color", giocoScrivi.fineGame.attr("sfondoPulsante"));
		if(giocoScrivi.fineGame.attr("coloreTestoPulsante")!="")
			$("#contentMK5 .pulsRisSuccMK5").css("color", giocoScrivi.fineGame.attr("coloreTestoPulsante"));
	  }
	  if(giocoScrivi.fineGame.attr("coloreTestoContenuti")!=""){
		$("#contentMK5 .titConclusioniMK5").css("color", giocoScrivi.fineGame.attr("coloreTestoContenuti"));
		$("#contentMK5 .txtConclusioniMK5").css("color", giocoScrivi.fineGame.attr("coloreTestoContenuti"));
	  }

	  //if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
	  if ( !app.global.IS_SMARTPHONE || ($(".ax_current_object_container").width() >= 768 &&giocoScrivi.orientamento == "verticale") ) {
		//$("#contentMK5 .titConclusioniMK5").css("line-height",giocoScrivi.fineGame.attr("txtboxLineHeight"));
		//$("#contentMK5 .titConclusioniMK5").css("font-size",giocoScrivi.fineGame.attr("txtboxSize"));
		if(giocoScrivi.fineGame.attr("txtboxLineHeight")!="")
			$("#contentMK5 .txtConclusioniMK5").css("line-height", giocoScrivi.fineGame.attr("txtboxLineHeight"));
		if(giocoScrivi.fineGame.attr("txtboxSize")!="")
			$("#contentMK5 .txtConclusioniMK5").css("font-size", giocoScrivi.fineGame.attr("txtboxSize"));
	  }
	  if(giocoScrivi.fineGame.attr("sfondoBox")!="")
		$("#contentMK5 .contTxtConclusioniMK5").css("background-color", giocoScrivi.fineGame.attr("sfondoBox"));
	  $("#contentMK5 .conclusioneMK5").fadeIn(500, function () {
		if (giocoScrivi.fineGame.attr("etichetta") != "") $("#contentMK5 .titConclusioniMK5").focus();else $("#contentMK5 .txtConclusioniMK5").focus();
	  });
	  document.querySelector("#contentMK5 .pulsRiavviaMK5").addEventListener("click", riavviaGiocoMK5);
	  if( giocoScrivi.fineGame.attr("presenzaPulsanteRisSucc")=="1" ){
		document.querySelector("#contentMK5 .pulsRisSuccMK5").addEventListener("click", risorsaSuccessivaMK5);
	  }
    }
}

function riavviaGiocoMK5() {
  $("#contentMK5 .conclusioneMK5").fadeOut("slow");
  //giocoScrivi.primaVolta = true;
  giocoScrivi.nrPallinoAttuale = 1;
  giocoScrivi.nrSchermata = 0;
  creaContenutiScrivi();
}

function risorsaSuccessivaMK5() {
  app.pillnavigator.tryToGoToNextItemCover();
}

function indicizzaTestiMK5() {
  var indiceTab = 29;
  var contaParola = 0;
  indiceTab++;
  $("#contentMK5 .contatore").attr("tabindex", indiceTab);
  indiceTab++;
  $("#contentMK5 .titoloGame").attr("tabindex", indiceTab);

  for (var z = 0; z < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").length; z++) {
    if (giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("testo").attr("pathImg") != "") {
      indiceTab++;
      $("#imgB" + (z + 1)).attr("tabindex", indiceTab);
    }

    var listaSpan = document.getElementsByClassName("txtParte");

    for (var i = 0; i < listaSpan.length; i++) {
      indiceTab++;
      $("#contentMK5 span").attr("tabindex", indiceTab);
    }
  }

  if ($("#pulsDx").css("display") != "none") {
    indiceTab++;
    $("#pulsDx").attr("tabindex", indiceTab);
  }

  if ($("#pulsSx").css("display") != "none") {
    indiceTab++;
    $("#pulsSx").attr("tabindex", indiceTab);
  }
}

function inibisciTestiMK5() {
  $("#contentMK5 .contatore").attr("tabindex", "-1");
  $("#contentMK5 .titoloGame").attr("tabindex", "-1");
  $("#contentMK5 #pulsDx").attr("tabindex", "-1");
  $("#contentMK5 #pulsSx").attr("tabindex", "-1");

  for (var z = 0; z < giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco").length; z++) {
    $("#contentMK5 #testo" + (z + 1)).attr("tabindex", "-1");

    if (giocoScrivi.scrittura.find("step:eq(" + giocoScrivi.nrSchermata + ")").children("blocco:eq(" + z + ")").children("testo").attr("pathImg") != "") {
      $("#imgB" + (z + 1)).attr("tabindex", "-1");
    }

    var listaSpan = document.getElementsByClassName("txtParte");

    for (var i = 0; i < listaSpan.length; i++) {
      $("#contentMK5 span").attr("tabindex", "-1");
    }
  }
}