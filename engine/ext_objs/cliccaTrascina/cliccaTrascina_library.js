"use strict";

var giocoTrascina = {
  quesiti: "",
  fineGame: "",
  istruzioni: "",
  boxHelp: "",
  boxHelpSmart: "",
  stringaURL: "",
  stringaDrop: "",
  stringaDrag: "",
  stringaPulsantiera: "",
  contaDrag: 0,
  scrollMaxSx: 20,
  scrollMaxDx: null,
  postitVisibili: null,
  posizioneScroll: 20,
  daPiattaforma: true,
  contaPossibilita: 0,
  nrAggiornatoDrag: 0,
  internetExplorer: 0,
  dragSelezionato: 0,
  targetKeySel: -1,
  dragSelezionatoDaTastiera: null,
  idDrag: null,
  idDrop: null,
  startDrag: false,
  dragCorretti: 0,
  mostrami: "",
  mostraBoxFinale: "",
  primaVolta: true,
  varInterval: null,
  varIntervalChiudiFeedback: null,
  varIntervalChiudiFeedbackEsatto: null,
  nrSchermata: 0,
  contaDragNavigazione: 0,
  nrPallini: null,
  nrPallinoAttuale: 1,
  nrPallinoAttualeSmart: 1,
  NuovoPallinoAttuale: null,
  fattore: 0,
  fattoreIntero: 0,
  deltaDrag: null,
  positionLeftDragSmart: null,
  aggancio: new Array(),
  dragAgganciato: new Array(),
  testiAgganciati: new Array(),
  larghezzaRisoluzione: null,
  dragAgganciati: new Array(),
  qualeFeedback: ""
};

function cliccaTrascina_initFunction(contenuti, folderReference) {
  app.lib.debugOnConsole("INIT :::cliccaTrascina:::");
  giocoTrascina.nrSchermata = 0;
  giocoTrascina.quesiti = contenuti.find("quesiti");
  giocoTrascina.boxHelp = contenuti.find("boxHelp");
  giocoTrascina.boxHelpSmart = contenuti.find("boxHelpSmart");
  giocoTrascina.fineGame = contenuti.find("fineGame");
  giocoTrascina.stringaURL = folderReference;
  giocoTrascina.istruzioni = contenuti.find("istruzioni");
  //giocoTrascina.primaVolta = true;
  
  if(contenuti.find("fineGame").attr("mostrami")){
	  //è presente attributo "mostrami"
	  if(contenuti.find("fineGame").attr("mostrami")=="true")
		giocoTrascina.mostraBoxFinale="true";
	  else
		giocoTrascina.mostraBoxFinale="false";
  }
  else{
	  giocoTrascina.mostraBoxFinale="true";
  }
  
  var objectHtmlContainer = "\n\t\t\t<div id=\"contentMK1\">\n\t\t\n\t\t<div class=\"conclusione\"></div>\n\t\t\n\t\t<div class=\"boxHelp\" role=\"dialog\" aria-labelledby=\"etichettaHelp\" aria-describedby=\"txtboxHelp\"></div>\n\t\n        <div class=\"contentQuizMK1\">\n           <!-- <div class=\"barra\"></div>-->\n            <!--<div class=\"titolo\"><div></div></div>-->\n            \n            <div class=\"areaDropDomanda\">\n            </div>\n            <p>&nbsp</p>\n            <div class=\"contenitoreDragSmart\">\n                <div class=\"areaDragSmart\"></div>\n                <div class=\"pulsantieraSmartphone\"></div>\n            </div>\n            \n            <div class=\"contenitoreDragTab\">\n                <div class=\"areaDragTab\"></div>\n                <div class=\"pulsantieraTablet\"></div>\n            </div>\n        </div>\n    </div>\n\t\t"; /// Adding HTML to object container

  $(".ax_box_pill_container .ax_current_object_container").html(objectHtmlContainer); /// Listen to keyboard navigationsss

  $(document).on("keydown", function (e) {
    /// ESC to exit
    if (e.which == 27) {
      $("#ax_desktop_header_icon_id_" + app.global.CURRENT_OBJECT_INDEX + ".ax_desktop_header_icon").click();
    }

    if (e.which == 13 || e.which == 32) {
      //console.log("document.activeElement.className: "+document.activeElement.className+ " / document.activeElement.id: "+document.activeElement.id)
      if (document.activeElement.className == "chiudiBoxHelpTrascina") {
        chiudiBoxHelpTrascina();
      }

      if (document.activeElement.className == "pulsRiavviaCT") {
        riavviaGiocoCT();
      }

      if (document.activeElement.className == "pulsRisSuccCT") {
        risorsaSuccessivaCT();
      }

      if (document.activeElement.className == "menuLi") {
        var qualeItem = document.activeElement.id.substr(6);
        muoviDragDD(qualeItem);
        $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + giocoTrascina.dragSelezionato + " #menuPopup").css("display", "none");
      }

      if (document.activeElement.className.indexOf("draggable") != -1) {
        var indiceDragSelezionato = document.activeElement.id.substr(6);
        giocoTrascina.dragSelezionatoDaTastiera = indiceDragSelezionato;
        giocoTrascina.dragSelezionato = indiceDragSelezionato;
        giocoTrascina.targetKeySel = 0;
        apriMenuTargetDD(indiceDragSelezionato);
      }

      if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
        if (document.activeElement.id == "pulsDx") {
          scorriDragSmart('DX');
        }

        if (document.activeElement.id == "pulsSx") {
          scorriDragSmart('SX');
        }
      } else {
        if (document.activeElement.id == "pulsDx") {
          scorriDragTablet('DX');
        }

        if (document.activeElement.id == "pulsSx") {
          scorriDragTablet('SX');
        }
      }
    }

    if (e.which == 9) {
      //freccia su
      if (document.activeElement.className == "menuLi") {
        e.preventDefault();
      }
    }

    if (e.which == 40) {
      //freccia giu
      if (document.activeElement.className == "menuLi") {
        giocoTrascina.targetKeySel++;
        $('.menuLi').blur();

        if (giocoTrascina.targetKeySel == giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda").length) {
          giocoTrascina.targetKeySel = 0;
          $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + giocoTrascina.dragSelezionato + " #menuPopup").css("display", "none");
          indicizzaDragT();
          $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + giocoTrascina.dragSelezionatoDaTastiera).focus();
        }

        $('#drab' + giocoTrascina.nrSchermata + '_' + giocoTrascina.dragSelezionato + ' #menuLi' + giocoTrascina.targetKeySel).focus();
      }
    }

    if (e.which == 38) {
      //freccia su
      if (document.activeElement.className == "menuLi") {
        $('.menuLi').blur();

        if (giocoTrascina.targetKeySel == 0) {
          var ultimoItem = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda").length - 1;
          giocoTrascina.targetKeySel = ultimoItem;
        } else {
          giocoTrascina.targetKeySel--;
        }

        $('#drab' + giocoTrascina.nrSchermata + '_' + giocoTrascina.dragSelezionato + ' #menuLi' + giocoTrascina.targetKeySel).focus();
      }
    }
  });
  caricaContenutiGiocoTrascina(); /// complete at start
  //app.main.tracer.completeCurrentItem();	
  /// start animation
  //cliccaTrascina_animateThisBoxInLibrary(".ext_animated_box");
}

function apriMenuTargetDD(numero) {
  inibisciDragT();
  $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + numero + " #menuPopup").css("display", "block");
  $('#contentMK1 #drab' + giocoTrascina.nrSchermata + '_' + numero + ' #menuLi' + giocoTrascina.targetKeySel).focus();
}

function muoviDragDD(qualeItem) {
  abbinaDaTastieraDD();
}

function abbinaDaTastieraDD() {
  var dragScelto = giocoTrascina.dragSelezionato;
  var dropAgganciato = parseInt(giocoTrascina.targetKeySel) + 1;
  var attrRispEsattaDragPreso = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + dragScelto + ")").attr("esatta");
  var tempoFeedPositivo = parseInt(giocoTrascina.quesiti.attr("tempoFeedPositivo"));
  var tempoFeedNegativo = parseInt(giocoTrascina.quesiti.attr("tempoFeedNegativo"));
  var centroSchermata = parseInt($("#contentMK1 .areaDropDomanda").css("width")) / 2;
  var centroFeedback = parseInt($("#contentMK1 .feedEsatto img").css("width")) / 2;
  var posizionaFeedback = centroSchermata - centroFeedback;
  
  var animationDurationFeed = 500;
  if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFeed = 0;}
  if (attrRispEsattaDragPreso == dropAgganciato) {
    //console.log( "esatta" )
    giocoTrascina.dragAgganciati[giocoTrascina.nrSchermata][dragScelto] = 1;
    giocoTrascina.dragCorretti++;
    $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + dragScelto).css("display", "none");
    giocoTrascina.qualeFeedback = "Y";
    $("#contentMK1 .feedEsatto").animate({
      left: posizionaFeedback + 'px',
      opacity: 1
    }, animationDurationFeed);

    if (giocoTrascina.dragCorretti == giocoTrascina.contaPossibilita) {
      giocoTrascina.varInterval = setInterval(schermataSuccessivaCT, tempoFeedPositivo);
    } else {
      giocoTrascina.varIntervalChiudiFeedbackEsatto = setInterval(chiudiFeedbackDaTastiera, tempoFeedPositivo);
    }

    if (giocoTrascina.nrPallinoAttuale >= giocoTrascina.NuovoPallinoAttuale) {
      giocoTrascina.nrPallinoAttuale = giocoTrascina.NuovoPallinoAttuale;
    }

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      if (giocoTrascina.contaDragNavigazione == giocoTrascina.nrAggiornatoDrag) {
        scorriDragSmart("SX");
      }
    }

    $("#contentMK1 #feedbackLive").html(giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ")").attr("feedbackCorrettoScreenReader"));
  } else {
    /////////console.log( "non esatta");
    $("#contentMK1 #feedbackLive").html(giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ")").attr("feedbackErratoScreenReader"));
    $("#contentMK1 .feedErrato").animate({
      left: posizionaFeedback + 'px',
      opacity: 1
    }, animationDurationFeed);
    giocoTrascina.qualeFeedback = "N";
    giocoTrascina.varIntervalChiudiFeedback = setInterval(chiudiFeedbackDaTastiera, tempoFeedNegativo);
  }

  $("#contentMK1 #feedbackLive").focus();
}

function caricaContenutiGiocoTrascina() {
  $("#contentMK1 .contentQuizMK1").css("display", "block");

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    $("#contentMK1 .contenitoreDragTab").fadeIn("slow");
  } else if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
    $("#contentMK1 .contenitoreDragSmart").fadeIn("slow");
  }

  creaContenutiTrascina();
}

function creaContenutiTrascina() {
  giocoTrascina.NuovoPallinoAttuale = 1;
  giocoTrascina.nrPallinoAttuale = 1;
  giocoTrascina.contaDragNavigazione = 0;
  giocoTrascina.positionLeftDragSmart = 0;
  $("#contentMK1 .areaDragSmart").css("marginLeft", "0px");
  $("#contentMK1 .areaDragSmart").css("float", "left");
  $("#contentMK1 .areaDragSmart").css("height", "200px");
  if(giocoTrascina.quesiti.attr("bgcolor")!="")
	$("#contentMK1 .contentQuizMK1").css("background-color", giocoTrascina.quesiti.attr("bgcolor"));
  giocoTrascina.larghezzaRisoluzione = $(".ax_current_object_container").width();
  
  /*font e dimensione di riferimento*/
  if(giocoTrascina.quesiti.attr("fontFamily")!="")
	$("#contentMK1").css("font-family",giocoTrascina.quesiti.attr("fontFamily"));
  if(giocoTrascina.quesiti.attr("fontSize")!="")
	$("#contentMK1").css("font-size",giocoTrascina.quesiti.attr("fontSize"));
  
  var contaDomande = "<div id='contatore' class='contatore' aria-label='" + giocoTrascina.quesiti.attr("contatoreFraseIniziale") + " " + (giocoTrascina.nrSchermata + 1) + " " + giocoTrascina.quesiti.attr("contatorePreposizione") + " " + giocoTrascina.quesiti.find("quesito").length + "'>" + giocoTrascina.quesiti.attr("contatoreFraseIniziale") + " " + (giocoTrascina.nrSchermata + 1) + " " + giocoTrascina.quesiti.attr("contatorePreposizione") + " " + giocoTrascina.quesiti.find("quesito").length + "</div>";
  if (giocoTrascina.quesiti.find("quesito").length > 1) giocoTrascina.stringaDrop = contaDomande;else giocoTrascina.stringaDrop = "";
  var stringaIstruzioni = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ")").children("istruzioni").text();

  if (stringaIstruzioni.length > 0) {
    var grandezzaFONTistr = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") istruzioni").attr("fontSizeTablet");
    var interlineaFONTistr = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") istruzioni").attr("lineHeightTablet");
    var coloreFONTistr = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") istruzioni").attr("color");
    var marginTopFONTistr = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") istruzioni").attr("marginTop");

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      giocoTrascina.stringaDrop += "<div class=\"istruzioniTrascina\" id=\"istruzioniTrascina\" tabindex=\"-1\" style=\"color:" + coloreFONTistr + "; padding:2px;\">" + stringaIstruzioni + "</div>";
    } else {
      giocoTrascina.stringaDrop += "<div class=\"istruzioniTrascina\" id=\"istruzioniTrascina\" tabindex=\"-1\" style=\"color:" + coloreFONTistr + "; font-size:" + grandezzaFONTistr + "; line-height:" + interlineaFONTistr + "; margin-top:" + marginTopFONTistr + "; padding:3px;\">" + stringaIstruzioni + "</div>";
    }
  } //FEEDBACK LIVE


  giocoTrascina.stringaDrop += "<div id=\"feedbackLive\" role=\"alert\" style=\"position:absolute; z-index:-1; font-size:0.2em;\"></div>";

  for (var i = 0; i < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda").length; i++) {
    var grandezzaFONT = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").attr("txtboxSize");
    var interlineaFONT = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").attr("txtboxLineHeight");
    var coloreFONT = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").attr("textColor");
    var coloreSfondoDrop = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").attr("bgColor");
    var lunghezzaDomanda = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda").length;
    if (lunghezzaDomanda == 1) giocoTrascina.stringaDrop += "<div id='domanda" + giocoTrascina.nrSchermata + "_" + i + "' class='droppable' style='color:" + coloreFONT + "; font-size:" + grandezzaFONT + "; line-height:" + interlineaFONT + "; background-color:" + coloreSfondoDrop + "; '>";
    if (lunghezzaDomanda == 2) giocoTrascina.stringaDrop += "<div id='domanda" + giocoTrascina.nrSchermata + "_" + i + "' class='droppable' style='float:left; width:49.8%;margin:0.1%; background-color:" + coloreSfondoDrop + "; '>";
    if (lunghezzaDomanda == 3) giocoTrascina.stringaDrop += "<div id='domanda" + giocoTrascina.nrSchermata + "_" + i + "' class='droppable' style='float:left; width:33%;margin:0.1%; background-color:" + coloreSfondoDrop + "; '>";

    if (giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").attr("pathImg") != "") {
      giocoTrascina.stringaDrop += "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle'><img id='imgDomanda" + (giocoTrascina.nrSchermata + 1) + "_" + (i + 1) + "' src=\"" + giocoTrascina.stringaURL + "" + giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").attr("pathImg") + "" + "\"/></div></td></tr></table></div>";
    } else {
      if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
        //smartphone
        giocoTrascina.stringaDrop += "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td><div class='margineDomanda' style='color:" + coloreFONT + ";'>" + giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").text() + "</div></td></tr></table></div>";
      } else {
        giocoTrascina.stringaDrop += "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td><div class='margineDomanda' style='color:" + coloreFONT + "; font-size:" + grandezzaFONT + "; line-height:" + interlineaFONT + ";'>" + giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").text() + "</div></td></tr></table></div>";
      }
    }
  }

  giocoTrascina.stringaDrop += "<div class='feedEsatto'><table><tr><td><img src=\"" + giocoTrascina.stringaURL + "feedSi.png" + "\"/></td></tr></table></div>";
  giocoTrascina.stringaDrop += "<div class='feedErrato'><table><tr><td><img src=\"" + giocoTrascina.stringaURL + "feedNo.png" + "\"/></td></tr></table></div>";
  giocoTrascina.dragAgganciati[giocoTrascina.nrSchermata] = new Array();

  for (var r = 0; r < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length; r++) {
    giocoTrascina.dragAgganciati[giocoTrascina.nrSchermata][r] = 0;
  }

  contenutiDrag();
  $("#contentMK1 #pulsSx").hide();
  if (giocoTrascina.nrPallini == 1) $("#contentMK1 #pulsDx").hide();else $("#contentMK1 #pulsDx").show();
  /*help*/

  giocoTrascina.mostrami = giocoTrascina.boxHelp.attr("mostrami");

  if (giocoTrascina.mostrami == "true" && giocoTrascina.primaVolta) {
    //if(mostrami){
    giocoTrascina.primaVolta = false;
    var strBoxHelp = "";
    strBoxHelp += "<div class='muoviBoxHelp'>";
    strBoxHelp += "<div class='contboxHelp'>";
    strBoxHelp += "<div class='titboxHelp'>";
    strBoxHelp += "<table width='100%' border='0'><tr><td id='distanziaEtHelp' style='text-align=center;'></td><td id='cellaIconaHelp' width='30px' style='text-align=center; valign:middle;'>";
    strBoxHelp += "<!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon --><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' xml:space='preserve'><metadata> Svg Vector Icons :http://www.onlinewebfonts.com/icon </metadata><g><path fill='#FFFFFF' d='M500,9.8C229.4,9.8,10,229.3,10,500c0,270.7,219.4,490.2,490,490.2c270.6,0,490-219.5,490-490.2C990,229.3,770.6,9.8,500,9.8z M500,908.5C274.5,908.5,91.7,725.6,91.7,500C91.7,274.4,274.5,91.5,500,91.5c225.5,0,408.3,182.9,408.3,408.5C908.3,725.6,725.5,908.5,500,908.5z M459.2,744.8h81.7v-80.4l-81.9-1L459.2,744.8z M620.5,278.3c-35-25.3-72.7-36.5-125.6-34.1c-28.8,1.3-67.3,10.4-94.3,29.3c-47.7,33-62.1,77.8-64.8,144.5h82.4c0-19.4,5.7-45.9,17-63.9c11.3-18,30.8-30.2,64.1-33.4c34.6-2.9,57,9.2,67.2,18.1c25.5,23,15.2,81.1-6.1,104c-9.1,10.4-48.5,40.8-48.5,40.8c-25.2,19.7-37,37.1-43.1,52.2c-6.1,15.2-8.6,47.6-10,87.2h82.5l0.7-9.6c0,0-8.2-57,21.9-76.4l38.9-25.7c25.2-19.6,32.1-26.9,41-39.6c15.2-20.9,26.6-46.5,26.6-77C670.5,344.9,655.5,303.6,620.5,278.3z'/></g></svg>";
    strBoxHelp += "</td><td><div id='etichettaHelp' tabindex='31'>" + giocoTrascina.boxHelp.attr("etichetta") + "</div></td><td width='20px'><div class='chiudiBoxHelpTrascina' style='text-align:right; cursor:pointer;' role='button' aria-label='" + giocoTrascina.boxHelp.attr("aria-label-help") + "' tabindex='33'>";
    strBoxHelp += "<svg id=\"svgChiudiHelp\" data-name=\"svgChiudiHelp\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.clicca_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"clicca_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
    strBoxHelp += "</div></td></tr></table>";
    strBoxHelp += "</div>";
    strBoxHelp += "<hr>";
    strBoxHelp += "<div id='txtboxHelp' class='txtboxHelp' tabindex='32'>"; //boxHelpSmart

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      strBoxHelp += giocoTrascina.boxHelpSmart.text();
    } else {
      strBoxHelp += giocoTrascina.boxHelp.text();
    }

    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    $("#contentMK1 .boxHelp").html(strBoxHelp); //$(".boxHelp").fadeIn("slow");

    $("#contentMK1 .boxHelp").css("display", "block");
	var animationDurationFirst = 800;
	if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
    $("#contentMK1 .muoviBoxHelp").fadeIn().css({
      top: -200,
      position: 'absolute'
    }).animate({
      top: 5
    }, animationDurationFirst, function () {
      //callback
      $("#contentMK1 #etichettaHelp").focus();
    });
    document.querySelector(".chiudiBoxHelpTrascina").addEventListener("click", chiudiBoxHelpTrascina);
  } else {
    //se non è presente l'help, inserire il focus sul primo oggetto
    if (apertura) apertura = false;
    indicizzaDragT();

    if (giocoTrascina.quesiti.find("quesito").length > 1) {
      $("#contentMK1 .contatore").focus();
    } else if (giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ")").children("istruzioni").text().length > 0) {
      $("#contentMK1 .istruzioniTrascina").focus();
    } else {
      $("#contentMK1 #domanda" + giocoTrascina.nrSchermata + "_0").focus();
    }
  }

  for (var i = 0; i < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda").length; i++) {
    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      $("#contentMK1 #imgDomanda" + (giocoTrascina.nrSchermata + 1) + "_" + (i + 1)).css("max-height", "180px");
      $("#contentMK1 #imgDomanda" + (giocoTrascina.nrSchermata + 1) + "_" + (i + 1)).css("width", "auto");
    } else {
      if (giocoTrascina.internetExplorer == 0) {
        $("#contentMK1 #imgDomanda" + (giocoTrascina.nrSchermata + 1) + "_" + (i + 1)).css("max-height", "200px");
        $("#contentMK1 #imgDomanda" + (giocoTrascina.nrSchermata + 1) + "_" + (i + 1)).css("width", "auto");
      } else {
        $("#contentMK1 #imgDomanda" + (giocoTrascina.nrSchermata + 1) + "_" + (i + 1)).css("height", "auto");
        $("#contentMK1 #imgDomanda" + (giocoTrascina.nrSchermata + 1) + "_" + (i + 1)).css("width", "100%");
      }
    }
  }

  if (stringaIstruzioni.length > 0) {
    var topFeedback = parseInt($("#contentMK1 .feedEsatto").css("top"));

    if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
      $("#contentMK1 .feedEsatto").css("top", topFeedback + "px");
      $("#contentMK1 .feedErrato").css("top", topFeedback + "px");
    }
  } else {
    //se non sono presenti le istruzioni sposto di 30px i feedback in verticale
    var topFeedback = parseInt($("#contentMK1 .feedEsatto").css("top"));

    if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
      $("#contentMK1 .feedEsatto").css("top", topFeedback - 30 + "px");
      $("#contentMK1 .feedErrato").css("top", topFeedback - 30 + "px");
    }
  }
}

function schermataSuccessivaCT() {
  clearInterval(giocoTrascina.varInterval);
  clearInterval(giocoTrascina.varIntervalChiudiFeedback);
  clearInterval(giocoTrascina.varIntervalChiudiFeedbackEsatto);

  if (giocoTrascina.nrSchermata == giocoTrascina.quesiti.find("quesito").length - 1) {
    //gioco finito
    app.main.tracer.completeCurrentItem();
	
	
	if(giocoTrascina.mostraBoxFinale=="true"){
	
	
		var indiceElementi = 30;
		var strConclusione = "";
		strConclusione += "<div class='contTxtConclusioniCT' role='dialog' aria-labelledby='titConclusioniCT' aria-describedby='txtConclusioniCT' tabindex='" + indiceElementi + "'>";

		if (giocoTrascina.fineGame.attr("etichetta") != "") {
		  indiceElementi++;
		  strConclusione += "<div class='titConclusioniCT' tabindex='" + indiceElementi + "'>";
		  strConclusione += giocoTrascina.fineGame.attr("etichetta");
		  strConclusione += "</div>";
		}

		strConclusione += "<hr>";
		indiceElementi++;
		strConclusione += "<div class='txtConclusioniCT' tabindex='" + indiceElementi + "'>";
		strConclusione += giocoTrascina.fineGame.text();
		strConclusione += "</div>";

		if (giocoTrascina.fineGame.attr("mostraRiavvia") == "true") {
		  indiceElementi++;
		  strConclusione += "<div class='contPulsRiavviaCT'>";
		  strConclusione += "<div class='pulsRiavviaCT' tabindex='" + indiceElementi + "' role='button' aria-label='" + giocoTrascina.fineGame.attr("aria-label-pulsante") + "'>" + giocoTrascina.fineGame.attr("pulsanteRiavvia") + "</div>";
		}
		
		if( giocoTrascina.fineGame.attr("presenzaPulsanteRisSucc")=="1" ){
			indiceElementi++;
			strConclusione += "<div class='pulsRisSuccCT' tabindex='" + indiceElementi + "' role='button' aria-label='" + giocoTrascina.fineGame.attr("aria-label-pulsanteRisSucc") + "'>" + giocoTrascina.fineGame.attr("pulsanteRisSucc") + "</div>";
		}
		strConclusione += "</div>";
		strConclusione += "</div>";
		$("#contentMK1 .conclusione").html(strConclusione);
		$("#contentMK1 .conclusione").fadeIn("slow", function () {
		  // Animation complete
		  inibisciDragT(); //tolgo i tabindex e gli eventi
		  //formattazione da xml
		  if(giocoTrascina.fineGame.attr("sfondoPulsante")!="")
			$("#contentMK1 .pulsRiavviaCT").css("background-color", giocoTrascina.fineGame.attr("sfondoPulsante"));
		  if(giocoTrascina.fineGame.attr("coloreTestoPulsante")!="")
			$("#contentMK1 .pulsRiavviaCT").css("color", giocoTrascina.fineGame.attr("coloreTestoPulsante"));
		  
		  if( giocoTrascina.fineGame.attr("presenzaPulsanteRisSucc")=="1" ){
			  if(giocoTrascina.fineGame.attr("sfondoPulsante")!="")
				$("#contentMK1 .pulsRisSuccCT").css("background-color", giocoTrascina.fineGame.attr("sfondoPulsante"));
			  if(giocoTrascina.fineGame.attr("coloreTestoPulsante")!="")
				$("#contentMK1 .pulsRisSuccCT").css("color", giocoTrascina.fineGame.attr("coloreTestoPulsante"));
		  }
		  
		  if(giocoTrascina.fineGame.attr("coloreTestoContenuti")!="")
			$("#contentMK1 .titConclusioniCT").css("color", giocoTrascina.fineGame.attr("coloreTestoContenuti"));

		  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
			//tablet
			//$("#contentMK1 .titConclusioniCT").css("line-height",giocoTrascina.fineGame.attr("txtboxLineHeight"));
			//$("#contentMK1 .titConclusioniCT").css("font-size",giocoTrascina.fineGame.attr("txtboxSize"));
			if(giocoTrascina.fineGame.attr("txtboxLineHeight")!="")
				$("#contentMK1 .txtConclusioniCT").css("line-height", giocoTrascina.fineGame.attr("txtboxLineHeight"));
			if(giocoTrascina.fineGame.attr("txtboxSize"))
				$("#contentMK1 .txtConclusioniCT").css("font-size", giocoTrascina.fineGame.attr("txtboxSize"));
		  }
		  if(giocoTrascina.fineGame.attr("coloreTestoContenuti")!="")
			$("#contentMK1 .txtConclusioniCT").css("color", giocoTrascina.fineGame.attr("coloreTestoContenuti"));
		  if(giocoTrascina.fineGame.attr("sfondoBox")!="")
			$("#contentMK1 .contTxtConclusioniCT").css("background-color", giocoTrascina.fineGame.attr("sfondoBox"));
		  if (giocoTrascina.fineGame.attr("etichetta") != "") $("#contentMK1 .titConclusioniCT").focus();else $("#contentMK1 .txtConclusioniCT").focus();
		  document.querySelector("#contentMK1 .pulsRiavviaCT").addEventListener("click", riavviaGiocoCT);
		  if( giocoTrascina.fineGame.attr("presenzaPulsanteRisSucc")=="1" ){
			document.querySelector("#contentMK1 .pulsRisSuccCT").addEventListener("click", risorsaSuccessivaCT);
		  }
		});
	
	}
	else{
		//caso in cui la box finale non appare
	}
	
	
  } else {
    giocoTrascina.nrSchermata++;
    $("#contentMK1 .areaDropDomanda").css("display", "none");
    creaContenutiTrascina();
  }
  
  
  
  
  
}

function riavviaGiocoCT() {
  $("#contentMK1 .conclusione").fadeOut("slow");
  //giocoTrascina.primaVolta = true;
  giocoTrascina.nrPallinoAttuale = 1;
  giocoTrascina.nrSchermata = 0;
  $("#contentMK1 .areaDragSmart").css("marginLeft", "0px");
  giocoTrascina.contaDragNavigazione = 0;
  caricaContenutiGiocoTrascina();
}

function risorsaSuccessivaCT() {
  app.pillnavigator.tryToGoToNextItemCover();
}

function chiudiBoxHelpTrascina(e) {
  $("#contentMK1 .boxHelp").fadeOut("slow");
  var animationDurationFirst = 800;
  if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
  $("#contentMK1 .muoviBoxHelp").fadeIn().css({
    top: 5,
    position: 'absolute'
  }).animate({
    top: -200
  }, animationDurationFirst, function () {
    //callback
    $("#contentMK1 .boxHelp").css("display", "none");
    indicizzaDragT();

    if (giocoTrascina.quesiti.find("quesito").length > 1) {
      $("#contentMK1 .contatore").focus();
    } else if (giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ")").children("istruzioni").text().length > 0) {
      $("#contentMK1 .istruzioniTrascina").focus();
    } else {
      $("#contentMK1 #domanda" + giocoTrascina.nrSchermata + "_0").focus();
    }
  });
}

/*var scorriIndietro = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"ax_desktop_cover_arrows_img svg replaced-svg\" alt=\"prev\" role=\"presentation\"><path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>";
var scorriAvanti = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"ax_desktop_cover_arrows_img svg replaced-svg\" alt=\"next\" role=\"presentation\"><path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>";*/
var scorriIndietro = "<img src=\"./engine/icons/chevron_left_24px.svg\" />";
var scorriAvanti = "<img src=\"./engine/icons/chevron_right_24px.svg\" />";

function contenutiDrag() {
  giocoTrascina.stringaDrag = "";
  giocoTrascina.nrAggiornatoDrag = 0;

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    //tablet
    giocoTrascina.stringaDrag += "<div id='inserisciPulsSx' height='100%' valign='middle'><div id=\"pulsSx\" aria-label=" + app.labels.nav_backward + ">" + scorriIndietro + "</div></div>";
    giocoTrascina.stringaDrag += "<div id='inserisciDrag' height='100%'>";
  }

  var contenutoDrag;
  giocoTrascina.contaPossibilita = 0; //conta quanti drag devono essere agganciati se attributo "esatta" != ""	

  for (var r = 0; r < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length; r++) {
    var grandezzaFONT = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").attr("txtboxSize");
    var interlineaFONT = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").attr("txtboxLineHeight");
    var coloreFONT = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").attr("textColor");
    var coloreSfondoDrag = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").attr("bgColor");
    var indiceRispostaEsatta = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").attr("esatta");

    if (indiceRispostaEsatta != "" && indiceRispostaEsatta != "0") {
      giocoTrascina.contaPossibilita++;
    }

    if (giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").attr("pathImg") != "") {
      contenutoDrag = "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle'><img id='imgDrag" + (r + 1) + "' src=\"" + giocoTrascina.stringaURL + "" + giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").attr("pathImg") + "" + "\"/></td></tr></table>";
    } else {
      if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
        //tablet
        contenutoDrag = "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle'><div class='txtContenutoDrag' style='font-size:" + grandezzaFONT + "; line-height:" + interlineaFONT + "; color:" + coloreFONT + "; '>" + giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").text() + "</div></td></tr></table>";
      } else {
        contenutoDrag = "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle'><div class='txtContenutoDrag' style='color:" + coloreFONT + "; '>" + giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").text() + "</div></td></tr></table>";
      }
    }

    contenutoDrag += "<div id=\"menuPopup\" role=\"menu\" aria-labelledby=\"menubutton\">";
    var indicizzaItem = 30;

    for (var i = 0; i < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda").length; i++) {
      var ariaLabelTarget = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").attr("aria-label-drop");
      var imgTarget = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").attr("pathImg");
      var ariaLabelEseguiItem = giocoTrascina.quesiti.attr("label-esegui-item");

      if (imgTarget != "") {
        //se presente l'img, nel menu appare la descrizione
        contenutoDrag += "<div id=\"menuLi" + i + "\" class=\"menuLi\" role=\"menuitem\" tabindex=\"" + (indicizzaItem + i) + "\" aria-label=\"" + ariaLabelTarget + " " + giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").text() + " " + ariaLabelEseguiItem + "\">" + ariaLabelTarget + "</div>";
      } else {
        contenutoDrag += "<div id=\"menuLi" + i + "\" class=\"menuLi\" role=\"menuitem\" tabindex=\"" + (indicizzaItem + i) + "\" aria-label=\"" + ariaLabelTarget + " " + giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").text() + " " + ariaLabelEseguiItem + "\">" + giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda:eq(" + i + ")").text() + "</div>";
      }
    }

    contenutoDrag += "</div>";

    if (giocoTrascina.dragAgganciati[giocoTrascina.nrSchermata][r] == 0) {
      giocoTrascina.nrAggiornatoDrag++;
      var label1 = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").attr("aria-label-drag");
      var label2 = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").text();

      if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
        giocoTrascina.stringaDrag += "<div style='id=\"divDrab" + giocoTrascina.nrSchermata + "_" + r + "\" height:180px; float:left; width:" + $(".ax_current_object_container").width() + "px;'><div id=\"drab" + giocoTrascina.nrSchermata + "_" + r + "\" class=\"draggable draggable" + giocoTrascina.nrSchermata + " draggableClic draggableClicVisible\" role=\"button\" aria-grabbed=\"false\" aria-dropeffect=\"none\" draggable=\"true\" aria-haspopup='true' aria-label=\" " + label1 + " " + label2 + "\" style='background-color:" + coloreSfondoDrag + "'><table width='100%' height='100%' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle'>" + contenutoDrag + "</td></tr></table></div></div>";
      } else {
        //tablet
        if (r < giocoTrascina.nrPallinoAttuale * 3) giocoTrascina.stringaDrag += "<div id=\"drab" + giocoTrascina.nrSchermata + "_" + r + "\" class=\"draggable dragTab\" role=\"button\" aria-grabbed=\"false\" aria-dropeffect=\"none\" draggable=\"true\" aria-haspopup='true' aria-label=\" " + label1 + " " + label2 + "\" style='background-color:" + coloreSfondoDrag + "'>" + contenutoDrag + "</div>"; //dragTab
        else giocoTrascina.stringaDrag += "<div id=\"drab" + giocoTrascina.nrSchermata + "_" + r + "\" class=\"draggable\" role=\"button\" aria-grabbed=\"false\" aria-dropeffect=\"none\" draggable=\"true\" aria-haspopup='true' aria-label=\" " + label1 + " " + label2 + "\" style='background-color:" + coloreSfondoDrag + "'>" + contenutoDrag + "</div>";
      }
    }
  }

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    //tablet
    giocoTrascina.stringaDrag += "</div>";
    giocoTrascina.stringaDrag += "<div id='inserisciPulsDx'><div id=\"pulsDx\" aria-label=" + app.labels.nav_forward + ">" + scorriAvanti + "</div></div>";
  }

  var larghezzaContDragSmart = parseInt(giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length) * giocoTrascina.larghezzaRisoluzione;
  $("#contentMK1 .areaDragSmart").css("width", larghezzaContDragSmart + "px");
  $("#contentMK1 .areaDropDomanda").html(giocoTrascina.stringaDrop);
  $("#contentMK1 .areaDropDomanda").fadeIn("slow");

  if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
    $("#contentMK1 .areaDragSmart").html(giocoTrascina.stringaDrag);
    giocoTrascina.positionLeftDragSmart = parseInt($("#contentMK1 .areaDragSmart").css("margin-left"));
    aggiustaPosizioneDragSmart();
    aggiornaPalliniSmartphone();
  } else {
    $("#contentMK1 .areaDragTab").html("");
    $("#contentMK1 .areaDragTab").html(giocoTrascina.stringaDrag); //in risoluzione tablet, se i drag sono 2 li centro nella schermata

    if (giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length < 3) {
      $("#contentMK1 .draggable:eq(0)").css("margin-left", "12.4em");
    }

    if (giocoTrascina.internetExplorer == 1) {
      //solo internet explorer
      for (var r = 0; r < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length; r++) {
        if ($('#imgDrag' + (r + 1)).css("width") > "180px") {
          $('#imgDrag' + (r + 1)).css("width", "180px");
          $('#imgDrag' + (r + 1)).css("height", "auto");
        }
      }
    }

    aggiornaPalliniTablet();
  }

  settaDragTrascina();
}

function aggiustaPosizioneDragSmart() {
  var risoluzione = parseInt(screen.width);
  var larghezzaContenitore = $(".ax_current_object_container").width();
  $("#contentMK1 .contenitoreDragSmart").css("width", larghezzaContenitore * giocoTrascina.nrAggiornatoDrag + "px");
  var larghezzaDrag = parseInt($("#contentMK1 .draggableClic").css("width"));
  var scartoRisoluzione = (larghezzaContenitore - larghezzaDrag) / 2;
  $("#contentMK1 .areaDragSmart .draggableClic").css("margin-left", scartoRisoluzione + "px");
}

function aggiornaPalliniSmartphone() {
  giocoTrascina.stringaPulsantiera = "";
  giocoTrascina.stringaPulsantiera += "<table width='100%'><tr>";

  if (giocoTrascina.contaDragNavigazione == 0) {
    giocoTrascina.stringaPulsantiera += "<td width='25%'><div id=\"pulsSx\">" + scorriIndietro + "</div></td>";
  } else {
    giocoTrascina.stringaPulsantiera += "<td width='25%'><div id=\"pulsSx\" onClick=\"javascript:scorriDragSmart('SX')\">" + scorriIndietro + "</div></td>";
  }

  giocoTrascina.stringaPulsantiera += "<td width='50%'><div id=\"contPallini\">";

  for (var r = 0; r < giocoTrascina.nrAggiornatoDrag; r++) {
    if (r == giocoTrascina.contaDragNavigazione) {
      giocoTrascina.stringaPulsantiera += "<div id=\"pallino" + r + "\" class=\"pallino grigio\" style='background-color: #464646; border: 1px solid " + giocoTrascina.quesiti.attr("bgcolor") + "; box-shadow: 0 0 0 2px #999999;'></div>";
    } else {
      giocoTrascina.stringaPulsantiera += "<div id=\"pallino" + r + "\" class=\"pallino\"></div>";
    }
  }

  giocoTrascina.stringaPulsantiera += "</div></td>";

  if (giocoTrascina.contaDragNavigazione == giocoTrascina.nrAggiornatoDrag - 1) {
    giocoTrascina.stringaPulsantiera += "<td width='25%'><div id=\"pulsDx\">" + scorriAvanti + "</div></td>";
  } else {
    giocoTrascina.stringaPulsantiera += "<td width='25%'><div id=\"pulsDx\" onClick=\"javascript:scorriDragSmart('DX')\">" + scorriAvanti + "</div></td>";
  }

  giocoTrascina.stringaPulsantiera += "</tr></table>";
  if (giocoTrascina.nrAggiornatoDrag > 3) $("#contentMK1 .pulsantieraSmartphone").html(giocoTrascina.stringaPulsantiera);else $("#contentMK1 .pulsantieraSmartphone").html("");
  $(".pulsantieraSmartphone").html(giocoTrascina.stringaPulsantiera);
  $("#contentMK1 #pulsSx").hide();
  $("#contentMK1 #pulsDx").hide();

  if (giocoTrascina.contaDragNavigazione == giocoTrascina.nrAggiornatoDrag - 1) {
    if (giocoTrascina.nrAggiornatoDrag == 1) {
      $("#contentMK1 .pulsantieraSmartphone").html("");
    } else {
      if (giocoTrascina.nrAggiornatoDrag > 0) {
        $("#contentMK1 #pulsSx").show();
        $("#contentMK1 #pulsSx").css("cursor", "pointer");
      }
    }
  } else {
    if (giocoTrascina.contaDragNavigazione == 0) {
      $("#contentMK1 #pulsSx").hide();
    } else {
      $("#contentMK1 #pulsSx").show();
      $("#contentMK1 #pulsSx").css("cursor", "pointer");
    }

    $("#contentMK1 #pulsDx").show();
    $("#contentMK1 #pulsDx").css("cursor", "pointer");
  }
}

function aggiornaPalliniTablet() {
  giocoTrascina.nrAggiornatoDrag = 0;

  for (var r = 0; r < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length; r++) {
    if (giocoTrascina.dragAgganciati[giocoTrascina.nrSchermata][r] == 0) {
      giocoTrascina.nrAggiornatoDrag++;
    }
  }

  giocoTrascina.fattore = giocoTrascina.nrAggiornatoDrag / 3;
  giocoTrascina.fattoreIntero = Math.ceil(giocoTrascina.fattore);
  var pagPalliniPieni = 3 * giocoTrascina.fattoreIntero;
  giocoTrascina.nrPallini = giocoTrascina.fattoreIntero;
  giocoTrascina.stringaPulsantiera = "";
  giocoTrascina.stringaPulsantiera += "<table width='100%' border='0'><tr>";
  giocoTrascina.stringaPulsantiera += "<td height='20px' valign='middle'>"; //giocoTrascina.stringaPulsantiera += "<div id=\"contPallini\">";

  if (giocoTrascina.nrPallini > 1) {
    for (var r = 0; r < giocoTrascina.nrPallini; r++) {
      if (r == giocoTrascina.nrPallinoAttuale - 1) {
        giocoTrascina.stringaPulsantiera += "<div id=\"pallino" + r + "\" class=\"pallino grigio\" style='background-color: #464646; border: 1px solid " + giocoTrascina.quesiti.attr("bgcolor") + "; box-shadow: 0 0 0 2px #999999;'></div>";
      } else {
        giocoTrascina.stringaPulsantiera += "<div id=\"pallino" + r + "\" class=\"pallino\"></div>";
      }
    }
  } //giocoTrascina.stringaPulsantiera += "</div>";


  giocoTrascina.stringaPulsantiera += "</td>";
  giocoTrascina.stringaPulsantiera += "</tr></table>";
  if (giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length > 3) $("#contentMK1 .pulsantieraTablet").html(giocoTrascina.stringaPulsantiera);else $("#contentMK1 .pulsantieraTablet").html("");
  if (giocoTrascina.nrPallinoAttuale > giocoTrascina.nrPallini) scorriDragTablet('SX');
  if (giocoTrascina.nrPallini == 1) giocoTrascina.nrPallinoAttuale = 1;

  if (giocoTrascina.nrPallinoAttuale < giocoTrascina.nrPallini) {
    if (giocoTrascina.nrPallinoAttuale == 1) {
      $("#contentMK1 #inserisciPulsSx").html("<div id=\"pulsSx\">" + scorriIndietro + "</div>");
      $("#contentMK1 #inserisciPulsDx").html("<div id=\"pulsDx\" onClick=\"javascript:scorriDragTablet('DX')\">" + scorriAvanti + "</div>");
      $("#contentMK1 #pulsDx").css("visibility", "visible");
      $("#contentMK1 #pulsSx").hide();
      $("#contentMK1 #pulsDx").css({
        opacity: 1
      });
      $("#contentMK1 #pulsDx").css("cursor", "pointer");
    } else {
      $("#contentMK1 #inserisciPulsDx").html("<div id=\"pulsDx\" onClick=\"javascript:scorriDragTablet('DX')\">" + scorriAvanti + "</div>");
      $("#contentMK1 #inserisciPulsSx").html("<div id=\"pulsSx\" onClick=\"javascript:scorriDragTablet('SX')\">" + scorriIndietro + "</div>");
      $("#contentMK1 #pulsSx").css("visibility", "visible");
      $("#contentMK1 #pulsDx").css("visibility", "visible");
      $("#contentMK1 #pulsSx").css({
        opacity: 1
      });
      $("#contentMK1 #pulsDx").css({
        opacity: 1
      });
      $("#contentMK1 #pulsSx").css("cursor", "pointer");
      $("#contentMK1 #pulsDx").css("cursor", "pointer");
    }
  } else {
    if (giocoTrascina.nrPallinoAttuale == giocoTrascina.nrPallini && giocoTrascina.nrPallini == 1) {
      $("#contentMK1 #inserisciPulsSx").html("<div id=\"pulsSx\">" + scorriIndietro + "</div>");
      $("#contentMK1 #inserisciPulsDx").html("<div id=\"pulsDx\">" + scorriAvanti + "</div>");
      $("#contentMK1 #pulsSx").css("visibility", "hidden");
      $("#contentMK1 #pulsDx").css("visibility", "hidden");
    } else {
      $("#contentMK1 #inserisciPulsSx").html("<div id=\"pulsSx\" onClick=\"javascript:scorriDragTablet('SX')\">" + scorriIndietro + "</div>");
      $("#contentMK1 #inserisciPulsDx").html("<div id=\"pulsDx\">" + scorriAvanti + "</div>");
      $("#contentMK1 #pulsSx").css("visibility", "visible");
      $("#contentMK1 #pulsSx").css({
        opacity: 1
      });
      $("#contentMK1 #pulsDx").hide();
      $("#contentMK1 #pulsSx").css("cursor", "pointer");
    }
  }
}

function scorriDragSmart(verso) {
  var risoluzione = $(".ax_current_object_container").width();
  var larghezzaDrag = parseInt($("#contentMK1 .draggable").css("width"));
  var scartoRisoluzione = (risoluzione - larghezzaDrag) / 2;

  if (verso == "DX") {
    giocoTrascina.positionLeftDragSmart = parseInt(giocoTrascina.positionLeftDragSmart - giocoTrascina.larghezzaRisoluzione);
    $("#contentMK1 .areaDragSmart").animate({
      marginLeft: giocoTrascina.positionLeftDragSmart + "px"
    });
    giocoTrascina.contaDragNavigazione++;
  }

  if (verso == "SX") {
    giocoTrascina.positionLeftDragSmart = parseInt(giocoTrascina.positionLeftDragSmart + giocoTrascina.larghezzaRisoluzione);
    $("#contentMK1 .areaDragSmart").animate({
      marginLeft: giocoTrascina.positionLeftDragSmart + "px"
    });
    giocoTrascina.contaDragNavigazione--;
  }

  aggiornaPalliniSmartphone();
}

function scorriDragTablet(verso) {
  $("#contentMK1 #menuPopup").css("display", "none");
  var inizioDragNascosti;
  var fineDragNascosti;
  var inizioDragVisibili;
  var fineDragVisibili;
  var posizioneDrag;
  var partenza;
  var arrivo;

  if (verso == "DX") {
    giocoTrascina.nrPallinoAttuale++;
    inizioDragNascosti = (giocoTrascina.contaDragNavigazione + 1) * 3 - 3;
    fineDragNascosti = (giocoTrascina.contaDragNavigazione + 1) * 3;
    inizioDragVisibili = (giocoTrascina.contaDragNavigazione + 1) * 3 - 3;
    fineDragVisibili = (giocoTrascina.contaDragNavigazione + 1) * 3;
    giocoTrascina.stringaDrag = "";
    posizioneDrag = 0;
    giocoTrascina.contaDragNavigazione++;
  }

  if (verso == "SX") {
    inizioDragNascosti = (giocoTrascina.contaDragNavigazione + 1) * 3 - 3;
    fineDragNascosti = (giocoTrascina.contaDragNavigazione + 1) * 3;
    giocoTrascina.contaDragNavigazione--;
    inizioDragVisibili = (giocoTrascina.contaDragNavigazione + 1) * 3 - 3;
    fineDragVisibili = (giocoTrascina.contaDragNavigazione + 1) * 3;
    posizioneDrag = 0;
    giocoTrascina.nrPallinoAttuale--;
  }

  var conta = 0;
  partenza = 3 * (giocoTrascina.nrPallinoAttuale - 1);
  arrivo = 3 * giocoTrascina.nrPallinoAttuale;
  var individuaPrimoDragDisponibile = false;
  var indiceDragFocus = null;

  for (var r = 0; r < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length; r++) {
    $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + r).css("display", "none");

    if (giocoTrascina.dragAgganciati[giocoTrascina.nrSchermata][r] == 0) {
      conta++;

      if (conta > partenza && conta <= arrivo) {
        $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + r).fadeIn("fast");

        if (!individuaPrimoDragDisponibile) {
          individuaPrimoDragDisponibile = true;
          indiceDragFocus = r;
        }

        if (giocoTrascina.internetExplorer == 1) {
          //solo internet explorer
          if ($('#imgDrag' + (r + 1)).css("width") > "180px") {
            $('#imgDrag' + (r + 1)).css("width", "180px");
            $('#imgDrag' + (r + 1)).css("height", "auto");
          }
        }
      }
    }
  }

  aggiornaPalliniTablet();
  indicizzaDragT();
  $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + indiceDragFocus).focus();
}

function settaDragTrascina() {
  var overlapThreshold = '10%';
  var foundIndex = null; //current droparea index user is hovering

  var Targets = document.querySelectorAll('#contentMK1 .droppable');
  var larghezzaDrag;
  var altezzaDrag;
  giocoTrascina.dragCorretti = 0;
  var StartX;
  var StartY;
  var myDraggable = Draggable.create("#contentMK1 .draggable", {
    type: 'x,y',
    throwProps: true,
    edgeResistance: 1,
    bounds: "#contentMK1",
    overshootTolerance: 0,
    zIndexBoost: false,
    inertia: true,
    onPress: function onPress() {
      StartX = this.x;
      StartY = this.y; //posizioni di partenza

      $("#contentMK1 #" + this.target.id).attr("aria-grabbed", "true");
      larghezzaDrag = $("#contentMK1 #" + this.target.id).css("width");
      altezzaDrag = $("#contentMK1 #" + this.target.id).css("height");
      $("#contentMK1 #" + this.target.id).css("position", "relative");
      $("#contentMK1 #" + this.target.id).css("z-index", 10);
      $("#contentMK1 #" + this.target.id).focus();
    },
    onDragStart: function onDragStart() {
      giocoTrascina.startDrag = true;
	  //$("#contentMK1 #" + this.target.id).css('border', 'solid 10px rgba(212,20,90,1.00)');
	  $("#contentMK1 #" + this.target.id).addClass("bordini");

      TweenLite.set($("#contentMK1 #" + this.target.id), {
        cursor: "-webkit-grabbing",
        opacity: 0.6
      });
      TweenLite.to($("#contentMK1 #" + this.target.id), 0.5, {
        scale: 0.90,
        transformOrigin: "center top"
      });
    },
    onDrag: function onDrag(e) {},
    onDragEnd: function onDragEnd() {
      giocoTrascina.startDrag = false;
	  $("#contentMK1 #" + this.target.id).removeClass("bordini");
	$("#contentMK1 #" + this.target.id).css('border', 'none');
	//console.log( $("#contentMK1 #" + this.target.id).css('border') );
      if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
        for (var md = 0; md < myDraggable.length; md++) {
          myDraggable[md].disable();
        }
      }

      TweenLite.to($("#contentMK1 #" + this.target.id), 0.5, {
        scale: 1,
        transformOrigin: "center top"
      });
      $("#contentMK1 #" + this.target.id).attr("aria-grabbed", "false");
      var areaSelezionata;

      for (var i = 0; i < Targets.length; i++) {
        if (this.hitTest(Targets[i], '50%')) {
          areaSelezionata = Targets[i].id;
        }
      }

      if (areaSelezionata != undefined) {
        var idDrag = this.target.id;
        var dragScelto = parseInt(this.target.id.charAt(6)) + 1;
        var idDrop = areaSelezionata;
        $("#contentMK1 #" + this.target.id).attr("aria-dropeffect", "move");
        var dropAgganciato = parseInt(areaSelezionata.charAt(7)) + 1;
        var numDragPreso = parseInt(idDrag.charAt(6));
        var numDropPreso = parseInt(idDrop.charAt(9));
        //var centroSchermata = parseInt($("#contentMK1 .areaDropDomanda").css("width")) / 2;
		chiudiFeedback();
		var centroSchermata = $(".ax_current_object_container").width() / 2;
        var centroFeedback = parseInt($("#contentMK1 .feedEsatto img").css("width")) / 2;
		
        //var posizionaFeedback = centroSchermata - centroFeedback;
		//console.log(window.innerWidth +" - "+ parseInt($("#contentMK1 .feedEsatto").css("width")))
		var posizionaFeedback = parseInt($(".ax_current_object_container").width() - parseInt($("#contentMK1 .feedEsatto").css("width")))/2;
		
        var tempoFeedPositivo = parseInt(giocoTrascina.quesiti.attr("tempoFeedPositivo"));
        var tempoFeedNegativo = parseInt(giocoTrascina.quesiti.attr("tempoFeedNegativo"));
        var attrRispEsattaDragPreso = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + numDragPreso + ")").attr("esatta");
        var rispostaEsatta;
        var rispostaData;
        rispostaData = numDropPreso + 1;
        rispostaEsatta = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + numDragPreso + ")").attr("esatta");
		
		var animationDurationRevert = 0.3;
		var animationDurationFeed = 500;
		if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationRevert=0.001;animationDurationFeed = 0;}

        if (rispostaData == rispostaEsatta) {
          //console.log( "esatta")
          giocoTrascina.dragAgganciati[giocoTrascina.nrSchermata][numDragPreso] = 1;
          giocoTrascina.dragCorretti++;
          $("#contentMK1 #" + idDrag).css("display", "none");
          giocoTrascina.qualeFeedback = "Y";
          $("#contentMK1 .feedEsatto").animate({
            left: posizionaFeedback + 'px',
            opacity: 1
          }, animationDurationFeed);

          if (giocoTrascina.dragCorretti == giocoTrascina.contaPossibilita) {
            giocoTrascina.varInterval = setInterval(schermataSuccessivaCT, tempoFeedPositivo);
          } else {
            giocoTrascina.varIntervalChiudiFeedbackEsatto = setInterval(chiudiFeedback, tempoFeedNegativo);
          }

          aggiornaDrag();

          if (giocoTrascina.nrPallinoAttuale >= giocoTrascina.NuovoPallinoAttuale) {
            giocoTrascina.nrPallinoAttuale = giocoTrascina.NuovoPallinoAttuale;
            aggiornaDrag();
          }

          if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
            if (giocoTrascina.contaDragNavigazione == giocoTrascina.nrAggiornatoDrag) {
              scorriDragSmart("SX");
            }
          }
        } else {
          //console.log( "non esatta");
		  //console.log(posizionaFeedback + 'px')
          giocoTrascina.qualeFeedback = "N";
          $("#contentMK1 .feedErrato").animate({
            left: posizionaFeedback + 'px',
            opacity: 1
          }, animationDurationFeed);
          giocoTrascina.varIntervalChiudiFeedback = setInterval(chiudiFeedback, tempoFeedNegativo);
          TweenLite.to(this.target, animationDurationRevert, {
            x: StartX,
            y: StartY
          }); //revert

          TweenLite.set(".draggable", {
            opacity: 1
          });
        }
      } else {
        TweenLite.to(this.target, animationDurationRevert, {
          x: StartX,
          y: StartY
        }); //revert

        TweenLite.set(".draggable", {
          opacity: 1
        });

        if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
          for (var md = 0; md < myDraggable.length; md++) {
            myDraggable[md].enable();
          }
        }
      }
    }
  });

  if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
    //sistemo i drag per lo smartphone
    TweenMax.to($("#contentMK1 .draggable"), 0, {
      transform: "translate3d(0,0,0)"
    });
  }

  function chiudiFeedback() {
    clearInterval(giocoTrascina.varIntervalChiudiFeedback);
    clearInterval(giocoTrascina.varIntervalChiudiFeedbackEsatto);

    if (giocoTrascina.qualeFeedback == "N") {
      $("#contentMK1 .feedErrato").css("opacity", 0);

      if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
        $("#contentMK1 .feedErrato").css("left", "1000px");

        for (var md = 0; md < myDraggable.length; md++) {
          myDraggable[md].enable();
        }
      } else {
        $("#contentMK1 .feedErrato").css("left", "300px");
      }
    } else {
      $("#contentMK1 .feedEsatto").css("opacity", 0);

      if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
        if (giocoTrascina.nrAggiornatoDrag >= 1) aggiornaPalliniSmartphone();
        $("#contentMK1 .feedEsatto").css("left", "300px");
      } else {
        $("#contentMK1 .feedEsatto").css("left", "1000px");
        if (giocoTrascina.nrAggiornatoDrag >= 3) aggiornaPalliniTablet();

        for (var md = 0; md < myDraggable.length; md++) {
          myDraggable[md].enable();
        }
      }
    }

    giocoTrascina.qualeFeedback = "";
  }
}

function chiudiFeedbackDaTastiera() {
  clearInterval(giocoTrascina.varIntervalChiudiFeedback);
  clearInterval(giocoTrascina.varIntervalChiudiFeedbackEsatto);
  $("#contentMK1 #feedbackLive").html("");
  aggiornaDrag();

  if (giocoTrascina.qualeFeedback == "N") {
    $("#contentMK1 .feedErrato").css("left", "1000px");
    $("#contentMK1 .feedErrato").css("opacity", 0);
  } else {
    $("#contentMK1 .feedEsatto").css("left", "1000px");
    $("#contentMK1 .feedEsatto").css("opacity", 0);

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      if (giocoTrascina.nrAggiornatoDrag >= 1) aggiornaPalliniSmartphone();
    } else {
      if (giocoTrascina.nrAggiornatoDrag >= 3) aggiornaPalliniTablet();
    }
  }
}

function aggiornaDrag() {
  giocoTrascina.dragVisibiliAttuale = 0;
  giocoTrascina.nrAggiornatoDrag = 0; //numero di drag rimanenti a mano a mano che si agganciano

  var partenza = 3 * (giocoTrascina.nrPallinoAttuale - 1);
  var arrivo = 3 * giocoTrascina.nrPallinoAttuale;
  giocoTrascina.contaNuovoPallino = 0;
  giocoTrascina.NuovoPallinoAttuale = 1;
  var individuaPrimoDragDisponibile = false;

  for (var r = 0; r < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length; r++) {
    if (giocoTrascina.dragAgganciati[giocoTrascina.nrSchermata][r] == 0) {
      giocoTrascina.contaNuovoPallino++;
      giocoTrascina.dragVisibiliAttuale++;
      giocoTrascina.nrAggiornatoDrag++; //numero attuale di drag a mano a mano che vengono agganciati

      if (giocoTrascina.dragVisibiliAttuale > partenza && giocoTrascina.dragVisibiliAttuale <= arrivo) {
        if ($("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + r).css("display") == "none") $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + r).fadeIn("fast");

        if (!individuaPrimoDragDisponibile) {
          individuaPrimoDragDisponibile = true;
          $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + r).focus();
        }

        if (giocoTrascina.internetExplorer == 1) {
          //solo internet explorer
          if ($('#contentMK1 #imgDrag' + (r + 1)).css("width") > "180px") {
            $('#contentMK1 #imgDrag' + (r + 1)).css("width", "180px");
            $('#contentMK1 #imgDrag' + (r + 1)).css("height", "auto");
          }
        }
      }
    }
  }

  giocoTrascina.NuovoPallinoAttuale = Math.ceil(giocoTrascina.dragVisibiliAttuale / 3);
  indicizzaDragT();
}

function indicizzaDragT() {
  var indiceTab = 29;

  if (giocoTrascina.quesiti.find("quesito").length > 1) {
    indiceTab++;
    $("#contentMK1 .contatore").attr("tabindex", indiceTab);
    var stringaIstruzioni = giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ")").children("istruzioni").text();

    if (stringaIstruzioni.length > 0) {
      indiceTab++;
      $("#contentMK1 .istruzioniTrascina").attr("tabindex", indiceTab);
    }
  } else {
    if (giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ")").children("istruzioni").text().length > 0) {
      $("#contentMK1 .istruzioniTrascina").attr("tabindex", indiceTab);
    }
  }

  var mettiIlfocus = false;

  for (var r = 0; r < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length; r++) {
    if ($('#drab' + giocoTrascina.nrSchermata + '_' + r).css("display") != "none") {
      indiceTab++;
      $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + r).attr("tabindex", indiceTab);
      $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + r).attr("aria-label", giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag:eq(" + r + ")").attr("aria-label-drag"));
    }
  }

  for (var s = 0; s < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda").length; s++) {
    indiceTab++;
    $("#contentMK1 #domanda" + giocoTrascina.nrSchermata + "_" + s).attr("tabindex", indiceTab);
  }

  if (giocoTrascina.nrPallinoAttuale < giocoTrascina.nrPallini) {
    indiceTab++;
    $("#pulsDx").attr("tabindex", indiceTab);
  }

  if (giocoTrascina.nrPallinoAttuale > 1) {
    indiceTab++;
    $("#pulsSx").attr("tabindex", indiceTab);
  }
}

function inibisciDragT() {
  for (var r = 0; r < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") drag").length; r++) {
    $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + r).attr("tabindex", "-1");
  }

  for (var s = 0; s < giocoTrascina.quesiti.find("quesito:eq(" + giocoTrascina.nrSchermata + ") domanda").length; s++) {
    $("#contentMK1 #domanda" + giocoTrascina.nrSchermata + "_" + s).attr("tabindex", "-1");
  }

  $("#contentMK1 .contatore").attr("tabindex", "-1");
  $("#contentMK1 .istruzioniTrascina").attr("tabindex", "-1");
  $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + giocoTrascina.dragSelezionato).blur();
  $("#contentMK1 #drab" + giocoTrascina.nrSchermata + "_" + giocoTrascina.dragSelezionato).attr("aria-grabbed", "false");
  $("#pulsDx").attr("tabindex", "-1");
  $("#pulsSx").attr("tabindex", "-1");
}