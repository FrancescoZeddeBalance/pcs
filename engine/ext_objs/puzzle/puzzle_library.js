"use strict";

var giocoPuzzle = {
  primaVolta: true,
  smartphoneMK6: false,
  mostrami: "",
  mostraBoxFinale: "",
  istruzioni: "",
  associazioni: "",
  fineGame: "",
  boxHelp: "",
  boxHelpSmart: "",
  informazione: "",
  stringaURL: "",
  nrSchermata: 0,
  stringaDrop: "",
  stringaDrag: "",
  stringaPulsantiera: "",
  contaDrag: 0,
  larghezzaRisoluzione: 0,
  avantiBloccato: "",
  spostamento: false,
  idDrag: null,
  idDrop: null,
  startDrag: false,
  varInterval: null,
  varIntervalChiudiFeedback: null,
  mischiaTasselli: null,
  posizioniCorrette: new Array(),
  posizioni: new Array(),
  nuovaPosizione: new Array(),
  aggancio: new Array(),
  contaTestEstratti: 0,
  testRandomizzati: new Array(),
  numUsciti: new Array(),
  tasselloMemorizzato: new Array(),
  ordineTasselli: new Array(),
  nrPage: 0,
  contaRisposte: 0,
  nrDomandaRdm: null,
  tasselloSelezionatoDaTastiera: null,
  riflessione: false
};

function puzzle_initFunction(contenutiPuzzle, folderReference) {
  //app.lib.debugOnConsole("INIT :::puzzle:::");
  giocoPuzzle.associazioni = contenutiPuzzle.find("associazioni");
  giocoPuzzle.boxHelp = contenutiPuzzle.find("boxHelp");
  giocoPuzzle.boxHelpSmart = contenutiPuzzle.find("boxHelpSmart");
  giocoPuzzle.fineGame = contenutiPuzzle.find("fineGame");
  giocoPuzzle.istruzioni = contenutiPuzzle.find("istruzioni");
  giocoPuzzle.stringaURL = folderReference;
  //giocoPuzzle.primaVolta = true;
  
  if(contenutiPuzzle.find("fineGame").attr("mostrami")){
	  //è presente attributo "mostrami"
	  if(contenutiPuzzle.find("fineGame").attr("mostrami")=="true")
		giocoPuzzle.mostraBoxFinale="true";
	  else
		giocoPuzzle.mostraBoxFinale="false";
  }
  else{
	  giocoPuzzle.mostraBoxFinale="true";
  }

  var objectHtmlContainer = "\n\t\t\t<div id=\"contentMK6\">\t\t\n\t\t\t\t<div class=\"ruotaTelefono\"></div>\t\t\t\t\n\t\t\t\t<div class=\"conclusione\"></div>\t\t\t\t\n\t\t\t\t<div class=\"boxHelp\" role=\"dialog\" aria-labelledby=\"etichettaHelp\" aria-describedby=\"txtboxHelp\"></div>\n\t\t\t\t<div class=\"boxS\"></div>\t\t\t\n\t\t\t\t<div class=\"contentQuizMK6\">\n\t\t\t\t\t<div class=\"titolo\"><div></div></div>\t\t\t\t\t\t\t\t\n\t\t\t\t\t<div class=\"contenitoreOpzioni\"></div>\t\t\t\t\t\n\t\t\t\t\t<div class=\"pulsanteSolRifl\"></div>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\t\t"; /// Adding HTML to object container

  $(".ax_box_pill_container .ax_current_object_container").html(objectHtmlContainer); /// Listen to keyboard navigationsss

  $(document).on("keydown", function (e) {
    /// ESC to exit
    if (e.which == 27) {
      $("#ax_desktop_header_icon_id_" + app.global.CURRENT_OBJECT_INDEX + ".ax_desktop_header_icon").click();
    }

    if (e.which == 9) {
      if (giocoPuzzle.spostamento) event.preventDefault();
    }

    if (e.which == 13 || e.which == 32) {
      //console.log("document.activeElement.className: "+document.activeElement.className+ " / document.activeElement.id: "+document.activeElement.id)
      if (document.activeElement.className == "chiudiBoxHelpPuzzle") {
        chiudiBoxHelpPuzzle();
      }

      if (document.activeElement.className == "pulsRiavviaPZ") {
        riavviaGiocoPZ();
      }

      if (document.activeElement.className == "pulsRisSuccPZ") {
        risorsaSuccessivaPZ();
      }

      if (document.activeElement.className == "pulsApriS") {
        apriBoxSoluzioneMK6();
      }

      ;

      if (document.activeElement.className == "pulsSol") {
        soluzioneMK6();
      }

      ;

      if (document.activeElement.className == "chiudiBoxSoluzione") {
        chiudiBoxS();
      }

      ;

      if (document.activeElement.className.indexOf("draggable") != -1) {
        var nrTasselloPrecedente = "";
        var indiceDragSelezionato = document.activeElement.id.substr(4);

        for (var r = 0; r < giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") drag").length; r++) {
          $("#contentMK6 #drag" + r).css("opacity", 0.5);
        }

        $("#contentMK6 #drag" + indiceDragSelezionato).css("opacity", 1);

        if (!giocoPuzzle.spostamento) {
          nrTasselloPrecedente = indiceDragSelezionato;
          $("#drag" + indiceDragSelezionato).css('border', 'solid 2px #ea447b');
          giocoPuzzle.spostamento = true;
          giocoPuzzle.dragSelezionato = indiceDragSelezionato;
          giocoPuzzle.tasselloSelezionatoDaTastiera = indiceDragSelezionato;
        } else {
          giocoPuzzle.spostamento = false;
          $("#contentMK6 .draggable").css('border', 'none');
          giocoPuzzle.dragSelezionatoDaTastiera = indiceDragSelezionato;
          agganciaTasselloDaTastiera();
        }

        controllaConclusioneMK6();
      }
    }

    if (e.which == 39) {
      //freccia dx
      if (giocoPuzzle.spostamento) {
        //draggable
        $("#contentMK6 .draggable").css("opacity", 0.5);

        for (var t = 0; t < giocoPuzzle.ordineTasselli.length; t++) {
          if (giocoPuzzle.ordineTasselli[t] == giocoPuzzle.dragSelezionato) {
            $("#contentMK6 #drag" + giocoPuzzle.ordineTasselli[t + 1]).focus();
          }
        }

        var indiceDragSelezionato = document.activeElement.id.substr(4);
        giocoPuzzle.dragSelezionato = indiceDragSelezionato;
        $("#contentMK6 #drag" + indiceDragSelezionato).focus();
        $("#contentMK6 #drag" + indiceDragSelezionato).css("opacity", 1);
      }
    }

    if (e.which == 37) {
      //freccia sx
      if (giocoPuzzle.spostamento) {
        if (giocoPuzzle.spostamento) {
          $("#contentMK6 .draggable").css("opacity", 0.5);

          for (var t = 0; t < giocoPuzzle.ordineTasselli.length; t++) {
            //console.log(giocoPuzzle.ordineTasselli[t] + "==" + giocoPuzzle.dragSelezionato);

            if (giocoPuzzle.ordineTasselli[t] == giocoPuzzle.dragSelezionato) {
              $("#contentMK6 #drag" + giocoPuzzle.ordineTasselli[t - 1]).focus();
            }
          }

          var indiceDragSelezionato = document.activeElement.id.substr(4);
          giocoPuzzle.dragSelezionato = indiceDragSelezionato;
          $("#contentMK6 #drag" + indiceDragSelezionato).focus();
          $("#contentMK6 #drag" + indiceDragSelezionato).css("opacity", 1);
        }
      }
    }

    if (e.which == 38) {
      //freccia up
      if (giocoPuzzle.spostamento) {
        if (giocoPuzzle.spostamento) {
          $("#contentMK6 .draggable").css("opacity", 0.5);

          for (var t = 0; t < giocoPuzzle.ordineTasselli.length; t++) {
            if (giocoPuzzle.ordineTasselli[t] == giocoPuzzle.dragSelezionato) {
              $("#contentMK6 #drag" + giocoPuzzle.ordineTasselli[t - 5]).focus();
            }
          }

          var indiceDragSelezionato = document.activeElement.id.substr(4);
          giocoPuzzle.dragSelezionato = indiceDragSelezionato;
          $("#contentMK6 #drag" + indiceDragSelezionato).focus();
          $("#contentMK6 #drag" + indiceDragSelezionato).css("opacity", 1);
        }
      }
    }

    if (e.which == 40) {
      //freccia down
      if (giocoPuzzle.spostamento) {
        if (giocoPuzzle.spostamento) {
          $("#contentMK6 .draggable").css("opacity", 0.5);

          for (var t = 0; t < giocoPuzzle.ordineTasselli.length; t++) {
            if (giocoPuzzle.ordineTasselli[t] == giocoPuzzle.dragSelezionato) {
              $("#contentMK6 #drag" + giocoPuzzle.ordineTasselli[t + 5]).focus();
            }
          }

          var indiceDragSelezionato = document.activeElement.id.substr(4);
          giocoPuzzle.dragSelezionato = indiceDragSelezionato;
          $("#contentMK6 #drag" + indiceDragSelezionato).focus();
          $("#contentMK6 #drag" + indiceDragSelezionato).css("opacity", 1);
        }
      }
    }
  });
  caricaContenutiGiocoMK6(); /// complete at start
  //app.main.tracer.completeCurrentItem();	
  /// start animation
  //genericExternalObject_animateThisBoxInLibrary(".ext_animated_box");
}

function agganciaTasselloDaTastiera() {
  var dragScelto = giocoPuzzle.dragSelezionatoDaTastiera;
  var dropAgganciato = giocoPuzzle.tasselloSelezionatoDaTastiera; //aggiorno l'array delle posizioni dei tasselli

  for (var t = 0; t < giocoPuzzle.ordineTasselli.length; t++) {
    if (giocoPuzzle.ordineTasselli[t] == dragScelto) giocoPuzzle.ordineTasselli[t] = dropAgganciato;else if (giocoPuzzle.ordineTasselli[t] == dropAgganciato) giocoPuzzle.ordineTasselli[t] = dragScelto;
  }

  var xPartenza = giocoPuzzle.nuovaPosizione[dragScelto].x;
  var yPartenza = giocoPuzzle.nuovaPosizione[dragScelto].y;
  var xArrivo = giocoPuzzle.nuovaPosizione[dropAgganciato].x;
  var yArrivo = giocoPuzzle.nuovaPosizione[dropAgganciato].y;
  $("#contentMK6 #drag" + dragScelto).css("left", xArrivo);
  $("#contentMK6 #drag" + dragScelto).css("top", yArrivo);
  $("#contentMK6 #drag" + dropAgganciato).animate({
    left: xPartenza,
    top: yPartenza
  }, 200);
  giocoPuzzle.nuovaPosizione[dragScelto].x = xArrivo;
  giocoPuzzle.nuovaPosizione[dragScelto].y = yArrivo;
  giocoPuzzle.nuovaPosizione[dropAgganciato].x = xPartenza;
  giocoPuzzle.nuovaPosizione[dropAgganciato].y = yPartenza;
  TweenMax.to($("#contentMK6 .draggable"), 0.05, {
    transform: "translate3d(0,0,0)"
  });
  TweenLite.set("#contentMK6 .draggable", {
    opacity: 1
  });
  inibisciTasselli();
  indicizzaTasselli();
  $("#contentMK6 #drag" + dragScelto).focus();
}

function caricaContenutiGiocoMK6() {
  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    giocoPuzzle.smartphoneMK6 = false;
    $("#contentMK6 .contenitoreDragTab").fadeIn("slow");
  } else if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
    giocoPuzzle.smartphoneMK6 = true;
    $("#contentMK6 .contenitoreDragSmart").fadeIn("slow");
  }

  randomizzaQuestionMK6();
  creaContenutiMK6();
}

function randomizzaQuestionMK6() {
  while (giocoPuzzle.contaTestEstratti < 15) {
    giocoPuzzle.nrPage = Math.floor(Math.random() * 15);

    if (controlloNRmk6(giocoPuzzle.nrPage)) {
      giocoPuzzle.numUsciti.push(giocoPuzzle.nrPage);
      giocoPuzzle.contaTestEstratti++;
    }
  }
}

function controlloNRmk6(nr) {
  var inc = true;

  for (var i = 0; i < giocoPuzzle.numUsciti.length; i++) {
    if (nr == giocoPuzzle.numUsciti[i]) inc = false;
  }

  if (inc) {
    giocoPuzzle.testRandomizzati.push(nr);
  }

  return inc;
}

/*window.addEventListener('orientationchange', orientaGamePuzzle)

function orientaGamePuzzle() {
  var maxnumX = Math.max(window.innerWidth);
    
	if(window.innerWidth > 1024){
		margineLaterale = ( 1024 - parseInt($("#contentMK6 .contenitoreOpzioni").css("width"))) / 2;
	}
	else{
		margineLaterale = (maxnumX - parseInt($("#contentMK6 .contenitoreOpzioni").css("width"))) / 2;
	}
    $("#contentMK6 .contenitoreOpzioni").css("left", parseInt(margineLaterale) + "px");

  if(window.innerWidth > window.innerHeight) {
	  giocoScrivi.orientamento = "orizzontale";
  }
  
  if(window.innerWidth < window.innerHeight) {
	  giocoScrivi.orientamento = "verticale";
  }
  
}*/

function creaContenutiMK6() {
  giocoPuzzle.larghezzaRisoluzione = $(".ax_current_object_container").width();
  $("#contentMK6 .ruotaTelefono").html("<div class='txtRuota'>" + giocoPuzzle.associazioni.attr("msgRuotaTelefono") + "</div><div class='imgRuota'><img src='" + giocoPuzzle.stringaURL + "ruota.png'/></div>");

  if (giocoPuzzle.smartphoneMK6) {
    var positionLeftDragSmart = 0;
    $("#contentMK6 .areaDragSmart").animate({
      marginLeft: positionLeftDragSmart + "px"
    });
  }

  giocoPuzzle.stringaDrag = "";
  var contenutoDrag;

  for (var r = 0; r < giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") drag").length; r++) {
    contenutoDrag = "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td width='100%' height='100%' valign='top'><img id='imgDrag" + (r + 1) + "' src=\"" + giocoPuzzle.stringaURL + /*"" +*/ giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") drag:eq(" + r + ")").attr("pathImg") + "" + "\"/></td></tr></table>";
    giocoPuzzle.tasselloMemorizzato[r] = "<div id=\"drag" + r + "\" class=\"draggable dragTab\">" + contenutoDrag + "</div>";
    giocoPuzzle.stringaDrag += "<div id=\"drag" + r + "\" class=\"draggable dragTab\" tabindex=\"-1\" role=\"button\" aria-label=\" " + giocoPuzzle.associazioni.attr("aria-label-tassello") + " \">" + contenutoDrag + "</div>";
  }

  var strPulsSoluzione = "";
  strPulsSoluzione += "<div class='pulsSol' tabindex='-1' role='button' aria-label=' " + giocoPuzzle.associazioni.attr("aria-label-soluzione") + " '>";
  strPulsSoluzione += giocoPuzzle.associazioni.attr("pulsanteSoluzione");
  strPulsSoluzione += "</div>";
  var stringaIstruzioni = giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ")").children("istruzioni").text();
  var strCostruisciIstruzioni = "";

  if (stringaIstruzioni.length > 0) {
    var grandezzaFONTistr = giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") istruzioni").attr("fontSizeTablet");
    var interlineaFONTistr = giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") istruzioni").attr("lineHeightTablet");
    var coloreFONTistr = giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") istruzioni").attr("color");
    var marginTopFONTistr = giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") istruzioni").attr("marginTop");

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      strCostruisciIstruzioni = "<div class=\"istruzioniPuzzle\" tabindex=\"-1\" style=\"color:" + coloreFONTistr + "; padding:2px;\">" + stringaIstruzioni + "</div>";
    } else {
      strCostruisciIstruzioni = "<div class=\"istruzioniPuzzle\" tabindex=\"-1\" style=\"color:" + coloreFONTistr + "; font-size:" + grandezzaFONTistr + "; line-height:" + interlineaFONTistr + "; margin-top:" + marginTopFONTistr + "; padding:3px;\">" + stringaIstruzioni + "</div>";
    }
  }

  $("#contentMK6 .titolo").html(strCostruisciIstruzioni);
  $("#contentMK6 .contenitoreOpzioni").html("<div class='pulsApriS'><img src='./engine/imgs/info.png'/></div><div class='contenitoreDragTab'><table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle'>" + giocoPuzzle.stringaDrag + "</td></tr></table></div>");
  document.querySelector("#contentMK6 .pulsApriS").addEventListener("click", apriBoxSoluzioneMK6);

  //if (giocoPuzzle.smartphoneMK6) {
    //calcolo della centratura del puzzle
    //var maxnumX = Math.max(parseInt(screen.width), parseInt(screen.height));
	//var maxnumX = Math.max(parseInt(screen.width));
	var maxnumX = Math.max(window.innerWidth);
	
	if(window.innerWidth > 1024){
		margineLaterale = ( 1024 - parseInt($("#contentMK6 .contenitoreOpzioni").css("width"))) / 2;
	}
	else{
		margineLaterale = (maxnumX - parseInt($("#contentMK6 .contenitoreOpzioni").css("width"))) / 2;
	}
    $("#contentMK6 .contenitoreOpzioni").css("left", parseInt(margineLaterale) + "px");
	//$(".istruzioniPuzzle").html(screen.width+ " *** " +window.innerWidth+ " -- " +parseInt($("#contentMK6 .contenitoreOpzioni").css("width"))+ " // "+margineLaterale)
  //}

  $("#contentMK6 .pulsanteSolRifl").html(strPulsSoluzione);
  document.querySelector("#contentMK6 .pulsSol").addEventListener("click", soluzioneMK6);
  var colorePulsante = giocoPuzzle.associazioni.attr("bgPulsante");
  if(colorePulsante!="")
	$("#contentMK6 .pulsSol").css("background-color", colorePulsante);
  $("#contentMK6 .contenitoreOpzioni").css("marginTop", "1em");
  $("#contentMK6 .contenitoreDragTab").fadeIn("fast");
  var contaRiga = 0;
  var contaColonne = 0;
  var margineLaterale = 0;

  for (var r = 0; r < giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") drag").length; r++) {
    giocoPuzzle.posizioni[r] = new Object();
    giocoPuzzle.posizioniCorrette[r] = new Object();
    giocoPuzzle.nuovaPosizione[r] = new Object();
    var larghezzaTassello = parseInt($("#contentMK6 .draggable").css("width"));
    var altezzaTassello = parseInt($("#contentMK6 .draggable").css("height"));
    $("#contentMK6 #drag" + r).css("left", larghezzaTassello * contaColonne + "px");
    $("#contentMK6 #drag" + r).css("top", altezzaTassello * contaRiga + "px");

    if (contaColonne == 4) {
      contaColonne = 0;
      contaRiga++;
    } else {
      contaColonne++;
    }

    giocoPuzzle.posizioni[r].x = $("#contentMK6 #drag" + r).css("left");
    giocoPuzzle.posizioni[r].y = $("#contentMK6 #drag" + r).css("top");
    giocoPuzzle.posizioniCorrette[r].x = $("#contentMK6 #drag" + r).css("left");
    giocoPuzzle.posizioniCorrette[r].y = $("#contentMK6 #drag" + r).css("top");
    giocoPuzzle.nuovaPosizione[r].x = $("#contentMK6 #drag" + r).css("left");
    giocoPuzzle.nuovaPosizione[r].y = $("#contentMK6 #drag" + r).css("top");
  }
  /*help*/


  giocoPuzzle.mostrami = giocoPuzzle.boxHelp.attr("mostrami");

  if (giocoPuzzle.mostrami == "true" && giocoPuzzle.primaVolta) {
    giocoPuzzle.primaVolta = false;
    var strBoxHelp = "";
    strBoxHelp += "<div class='muoviBoxHelp'>";
    strBoxHelp += "<div class='contboxHelp'>";
    strBoxHelp += "<div class='titboxHelp'>";
    strBoxHelp += "<table width='100%' border='0'><tr><td id='distanziaEtHelp' style='text-align=center;'></td><td id='cellaIconaHelp' width='30px' style='text-align=center; valign:middle;'>";
    strBoxHelp += "<!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon --><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' xml:space='preserve'><metadata> Svg Vector Icons :http://www.onlinewebfonts.com/icon </metadata><g><path fill='#FFFFFF' d='M500,9.8C229.4,9.8,10,229.3,10,500c0,270.7,219.4,490.2,490,490.2c270.6,0,490-219.5,490-490.2C990,229.3,770.6,9.8,500,9.8z M500,908.5C274.5,908.5,91.7,725.6,91.7,500C91.7,274.4,274.5,91.5,500,91.5c225.5,0,408.3,182.9,408.3,408.5C908.3,725.6,725.5,908.5,500,908.5z M459.2,744.8h81.7v-80.4l-81.9-1L459.2,744.8z M620.5,278.3c-35-25.3-72.7-36.5-125.6-34.1c-28.8,1.3-67.3,10.4-94.3,29.3c-47.7,33-62.1,77.8-64.8,144.5h82.4c0-19.4,5.7-45.9,17-63.9c11.3-18,30.8-30.2,64.1-33.4c34.6-2.9,57,9.2,67.2,18.1c25.5,23,15.2,81.1-6.1,104c-9.1,10.4-48.5,40.8-48.5,40.8c-25.2,19.7-37,37.1-43.1,52.2c-6.1,15.2-8.6,47.6-10,87.2h82.5l0.7-9.6c0,0-8.2-57,21.9-76.4l38.9-25.7c25.2-19.6,32.1-26.9,41-39.6c15.2-20.9,26.6-46.5,26.6-77C670.5,344.9,655.5,303.6,620.5,278.3z'/></g></svg>";
    strBoxHelp += "</td><td><div id='etichettaHelp' tabindex='31'>" + giocoPuzzle.boxHelp.attr("etichetta") + "</div></td><td width='20px'><div class='chiudiBoxHelpPuzzle' style='text-align:right; cursor:pointer;' role='button' aria-label='" + giocoPuzzle.boxHelp.attr("aria-label-help") + "' tabindex='33'>";
    strBoxHelp += "<svg id=\"svgChiudiHelp\" data-name=\"svgChiudiHelp\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.puzzle_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"puzzle_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
    strBoxHelp += "</div></td></tr></table>";
    strBoxHelp += "</div>";
    strBoxHelp += "<hr>";
    strBoxHelp += "<div id='txtboxHelp' class='txtboxHelp' tabindex='32'>"; //boxHelpSmart

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      strBoxHelp += giocoPuzzle.boxHelpSmart.text();
    } else {
      strBoxHelp += giocoPuzzle.boxHelp.text();
    }

    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    $("#contentMK6 .boxHelp").html(strBoxHelp);
    $("#contentMK6 .boxHelp").css("display", "block");
	var animationDurationFirst = 800;
    if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
    $("#contentMK6 .muoviBoxHelp").fadeIn().css({
      top: -200,
      position: 'absolute'
    }).animate({
      top: 5
    }, animationDurationFirst, function () {
      //callback
      $("#contentMK6 #etichettaHelp").focus();
    });
    document.querySelector(".chiudiBoxHelpPuzzle").addEventListener("click", chiudiBoxHelpPuzzle);
  } else {
    //se non è presente l'help, inserire il focus sul primo oggetto
    giocoPuzzle.mischiaTasselli = setInterval(riposizionaMK6, 2000);
  }
  
  if(giocoPuzzle.associazioni.attr("backgroundColor")!="")
	$("#contentMK6").css("background-color", giocoPuzzle.associazioni.attr("backgroundColor"));
}

function chiudiBoxHelpPuzzle(e) {
  $("#contentMK6 .boxHelp").fadeOut("slow");
  var animationDurationFirst = 800;
  if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
  $("#contentMK6 .muoviBoxHelp").fadeIn().css({
    top: 5,
    position: 'absolute'
  }).animate({
    top: -200
  }, animationDurationFirst, function () {
    //callback
    $("#contentMK6 .boxHelp").css("display", "none");
    giocoPuzzle.mischiaTasselli = setInterval(riposizionaMK6, 2000);
  });
}

function riposizionaMK6() {
  clearInterval(giocoPuzzle.mischiaTasselli);

  for (var r = 0; r < giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") drag").length; r++) {
    var xArrivo = giocoPuzzle.posizioni[parseInt(giocoPuzzle.numUsciti[r])].x;
    var yArrivo = giocoPuzzle.posizioni[parseInt(giocoPuzzle.numUsciti[r])].y;
    giocoPuzzle.ordineTasselli[parseInt(giocoPuzzle.numUsciti[r])] = r;
    $("#contentMK6 #drag" + r).animate({
      top: yArrivo,
      left: xArrivo
    }, 500);
    giocoPuzzle.nuovaPosizione[r].x = xArrivo;
    giocoPuzzle.nuovaPosizione[r].y = yArrivo;
  }

  $("#contentMK6 .pulsanteSolRifl").css("visibility", "visible");
  indicizzaTasselli();
  settaPuzzle();
}

function settaPuzzle() {
  var overlapThreshold = '10%';
  var foundIndex = null; //current droparea index user is hovering

  var Targets = document.querySelectorAll('#contentMK6 .draggable');
  var larghezzaDrag;
  var altezzaDrag;
  giocoPuzzle.dragCorretti = 0;
  var StartX;
  var StartY;
  var myDraggable = Draggable.create("#contentMK6 .draggable", {
    type: 'x,y',
    throwProps: true,
    edgeResistance: 1,
    bounds: "#contentMK6",
    overshootTolerance: 0,
    zIndexBoost: false,
    inertia: true,
    onPress: function onPress() {
      $("#contentMK6 #" + this.target.id).focus();
      giocoPuzzle.spostamento = false;
      $("#contentMK6 .draggable").css("opacity", 1);
      StartX = this.x;
      StartY = this.y; //posizioni di partenza

      $("#contentMK6 #" + this.target.id).attr("aria-grabbed", "true");
      larghezzaDrag = $("#contentMK6 #" + this.target.id).css("width");
      altezzaDrag = $("#contentMK6 #" + this.target.id).css("height");
      $("#contentMK6 #" + this.target.id).css("z-index", 10);
    },
    onDragStart: function onDragStart() {
      giocoPuzzle.startDrag = true;
      TweenLite.set($("#contentMK6 #" + this.target.id), {
        cursor: "-webkit-grabbing",
        opacity: 0.6
      });
      TweenLite.to($("#contentMK6 #" + this.target.id), 0.5, {
        scale: 0.90,
        transformOrigin: "center top"
      });
    },
    onDrag: function onDrag(e) {
      for (var i = 0; i < Targets.length; i++) {
        if (this.hitTest(Targets[i], '50%')) {
          $(".draggable").css("border", "none");
          $("#" + Targets[i].id).css('border', 'solid 2px #ea447b');
        }
      }
    },
    onDragEnd: function onDragEnd() {
      giocoPuzzle.startDrag = false;
      $(".draggable").css("border", "none");
      TweenLite.to($("#contentMK6 #" + this.target.id), 0.5, {
        scale: 1,
        transformOrigin: "center top"
      });
      $("#contentMK6 #" + this.target.id).attr("aria-grabbed", "false");
      var areaSelezionata;

      for (var i = 0; i < Targets.length; i++) {
        if (this.hitTest(Targets[i], '50%')) {
          areaSelezionata = Targets[i].id;
        }
      }

      if (areaSelezionata != undefined) {
        var idDrag = this.target.id;
        var dragScelto = parseInt(this.target.id.substr(4));
        var dropToccato = areaSelezionata;
        var dropAgganciato = parseInt(dropToccato.substr(4));
        $("#contentMK6 #" + this.target.id).attr("aria-dropeffect", "move");
        var centroSchermata = parseInt($("#contentMK6 .areaDropDomanda").css("width")) / 2;
        var centroFeedback = parseInt($("#contentMK6 .feedEsatto img").css("width")) / 2;
        var posizionaFeedback = centroSchermata - centroFeedback;

        if (dropToccato.indexOf("drag") != -1) {
          var xPartenza = giocoPuzzle.nuovaPosizione[dragScelto].x;
          var yPartenza = giocoPuzzle.nuovaPosizione[dragScelto].y;
          var xArrivo = giocoPuzzle.nuovaPosizione[dropAgganciato].x;
          var yArrivo = giocoPuzzle.nuovaPosizione[dropAgganciato].y;
          $("#contentMK6 #drag" + dragScelto).css("left", xArrivo);
          $("#contentMK6 #drag" + dragScelto).css("top", yArrivo);
          $("#contentMK6 #" + dropToccato).animate({
            left: xPartenza,
            top: yPartenza
          }, 200);
          giocoPuzzle.nuovaPosizione[dragScelto].x = xArrivo;
          giocoPuzzle.nuovaPosizione[dragScelto].y = yArrivo;
          giocoPuzzle.nuovaPosizione[dropAgganciato].x = xPartenza;
          giocoPuzzle.nuovaPosizione[dropAgganciato].y = yPartenza;
          TweenMax.to($("#contentMK6 .draggable"), 0.05, {
            transform: "translate3d(0,0,0)"
          });
          TweenLite.set("#contentMK6 .draggable", {
            opacity: 1
          }); //aggiorno l'array delle posizioni dei tasselli

          for (var t = 0; t < giocoPuzzle.ordineTasselli.length; t++) {
            if (giocoPuzzle.ordineTasselli[t] == dragScelto) giocoPuzzle.ordineTasselli[t] = dropAgganciato;else if (giocoPuzzle.ordineTasselli[t] == dropAgganciato) giocoPuzzle.ordineTasselli[t] = dragScelto;
          }
        }

        controllaConclusioneMK6();
      } else {
        TweenLite.to(this.target, 0.3, {
          x: StartX,
          y: StartY
        }); //revert

        TweenLite.set(".draggable", {
          opacity: 1
        });
      }
    }
  });
}

function controllaConclusioneMK6() {
  var strAggancio = "";

  for (var s = 0; s < giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") drag").length; s++) {
    if (giocoPuzzle.posizioniCorrette[s].x == giocoPuzzle.nuovaPosizione[s].x && giocoPuzzle.posizioniCorrette[s].y == giocoPuzzle.nuovaPosizione[s].y) {
      strAggancio += "1";
    } else {
      strAggancio += "0";
    }
  }

  if (strAggancio.indexOf("0") == -1) {
    //fine pagina
    //console.log("gioco finito");
    giocoPuzzle.varInterval = setInterval(conclusionePuzzle, 500);
  } else {
    indicizzaTasselli();
  }
}

function conclusionePuzzle() {
  app.main.tracer.completeCurrentItem();
  clearInterval(giocoPuzzle.varInterval);
  
  if(giocoPuzzle.mostraBoxFinale=="true"){
  
	  var indiceElementi = 30;
	  var strConclusione = "";
	  strConclusione += "<div class='contTxtConclusioniPZ' role='dialog' aria-labelledby='titConclusioniPZ' aria-describedby='txtConclusioniPZ' tabindex='" + indiceElementi + "'>";

	  if (giocoPuzzle.fineGame.attr("etichetta") != "") {
		indiceElementi++;
		strConclusione += "<div class='titConclusioniPZ' tabindex='" + indiceElementi + "'>";
		strConclusione += giocoPuzzle.fineGame.attr("etichetta");
		strConclusione += "</div>";
	  }

	  strConclusione += "<hr>";
	  indiceElementi++;
	  strConclusione += "<div class='txtConclusioniPZ' tabindex='" + indiceElementi + "'>";
	  strConclusione += giocoPuzzle.fineGame.text();
	  strConclusione += "</div>";

	  if (giocoPuzzle.fineGame.attr("mostraRiavvia") == "true") {
		indiceElementi++;
		strConclusione += "<div class='contPulsRiavviaPZ'>";
		strConclusione += "<div class='pulsRiavviaPZ' tabindex='" + indiceElementi + "' role='button' aria-label='" + giocoPuzzle.fineGame.attr("aria-label-pulsante") + "'>" + giocoPuzzle.fineGame.attr("pulsanteRiavvia") + "</div>";
	  }

	  indiceElementi++;
	  strConclusione += "<div class='pulsRisSuccPZ' tabindex='" + indiceElementi + "' role='button' aria-label='" + giocoPuzzle.fineGame.attr("aria-label-pulsanteRisSucc") + "'>" + giocoPuzzle.fineGame.attr("pulsanteRisSucc") + "</div>";
	  strConclusione += "</div>";
	  strConclusione += "</div>";
	  $("#contentMK6 .conclusione").html(strConclusione);
	  $("#contentMK6 .conclusione").fadeIn("slow", function () {
		// Animation complete
		inibisciTasselli(); //tolgo i tabindex e gli eventi
		//formattazione da xml
		if(giocoPuzzle.fineGame.attr("sfondoPulsante")!="")
			$("#contentMK6 .pulsRiavviaPZ").css("background-color", giocoPuzzle.fineGame.attr("sfondoPulsante"));
		if(giocoPuzzle.fineGame.attr("coloreTestoPulsante")!="")
			$("#contentMK6 .pulsRiavviaPZ").css("color", giocoPuzzle.fineGame.attr("coloreTestoPulsante"));
		if(giocoPuzzle.fineGame.attr("sfondoPulsante")!="")
			$("#contentMK6 .pulsRisSuccPZ").css("background-color", giocoPuzzle.fineGame.attr("sfondoPulsante"));
		if(giocoPuzzle.fineGame.attr("coloreTestoPulsante")!="")
			$("#contentMK6 .pulsRisSuccPZ").css("color", giocoPuzzle.fineGame.attr("coloreTestoPulsante"));
		if(giocoPuzzle.fineGame.attr("coloreTestoContenuti")!="")
			$("#contentMK6 .titConclusioniPZ").css("color", giocoPuzzle.fineGame.attr("coloreTestoContenuti"));

		if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
		  //tablet
		  //$("#contentMK6 .titConclusioniPZ").css("line-height",giocoPuzzle.fineGame.attr("txtboxLineHeight"));
		  //$("#contentMK6 .titConclusioniPZ").css("font-size",giocoPuzzle.fineGame.attr("txtboxSize"));
		  if(giocoPuzzle.fineGame.attr("txtboxLineHeight")!="")
			$("#contentMK6 .txtConclusioniPZ").css("line-height", giocoPuzzle.fineGame.attr("txtboxLineHeight"));
		  if(giocoPuzzle.fineGame.attr("txtboxSize")!="")
			$("#contentMK6 .txtConclusioniPZ").css("font-size", giocoPuzzle.fineGame.attr("txtboxSize"));
		}
		if(giocoPuzzle.fineGame.attr("coloreTestoContenuti")!="")
			$("#contentMK6 .txtConclusioniPZ").css("color", giocoPuzzle.fineGame.attr("coloreTestoContenuti"));
		if(giocoPuzzle.fineGame.attr("sfondoBox")!="")
			$("#contentMK6 .contTxtConclusioniPZ").css("background-color", giocoPuzzle.fineGame.attr("sfondoBox"));
		if (giocoPuzzle.fineGame.attr("etichetta") != "") $("#contentMK6 .titConclusioniPZ").focus();else $("#contentMK6 .txtConclusioniPZ").focus();
		document.querySelector("#contentMK6 .pulsRiavviaPZ").addEventListener("click", riavviaGiocoPZ);
		document.querySelector("#contentMK6 .pulsRisSuccPZ").addEventListener("click", risorsaSuccessivaPZ);
	  });
  
  }
  
}

function apriBoxSoluzioneMK6() {
  inibisciTasselli();
  var strBoxS = "";
  strBoxS += "<div class='muoviBoxS' style='width:100%; height:100%;'>";
  strBoxS += "<div class='contboxS' role='dialog' aria-labelledby='etichettaInfo' aria-describedby='txtboxS'>";
  strBoxS += "<div class='titboxS'>";
  strBoxS += "<table width='100%' border='0'><tr><td width='25px' style='text-align=center;'>";
  strBoxS += "<!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon --><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' xml:space='preserve'><metadata> Svg Vector Icons :http://www.onlinewebfonts.com/icon </metadata><g><path fill='#FFFFFF' d='M500,9.8C229.4,9.8,10,229.3,10,500c0,270.7,219.4,490.2,490,490.2c270.6,0,490-219.5,490-490.2C990,229.3,770.6,9.8,500,9.8z M500,908.5C274.5,908.5,91.7,725.6,91.7,500C91.7,274.4,274.5,91.5,500,91.5c225.5,0,408.3,182.9,408.3,408.5C908.3,725.6,725.5,908.5,500,908.5z M459.2,744.8h81.7v-80.4l-81.9-1L459.2,744.8z M620.5,278.3c-35-25.3-72.7-36.5-125.6-34.1c-28.8,1.3-67.3,10.4-94.3,29.3c-47.7,33-62.1,77.8-64.8,144.5h82.4c0-19.4,5.7-45.9,17-63.9c11.3-18,30.8-30.2,64.1-33.4c34.6-2.9,57,9.2,67.2,18.1c25.5,23,15.2,81.1-6.1,104c-9.1,10.4-48.5,40.8-48.5,40.8c-25.2,19.7-37,37.1-43.1,52.2c-6.1,15.2-8.6,47.6-10,87.2h82.5l0.7-9.6c0,0-8.2-57,21.9-76.4l38.9-25.7c25.2-19.6,32.1-26.9,41-39.6c15.2-20.9,26.6-46.5,26.6-77C670.5,344.9,655.5,303.6,620.5,278.3z'/></g></svg>";
  strBoxS += "</td>";
  strBoxS += "<td><div class='etichettaInfo' tabindex='30' aria-label='" + giocoPuzzle.associazioni.attr("etichettaInfo") + "'>" + giocoPuzzle.associazioni.attr("etichettaInfo") + "</div></td>";
  strBoxS += "<td width='20px'><div class='chiudiBoxSoluzione' tabindex='32' style='text-align:right; cursor:pointer;'>";
  strBoxS += "<svg id=\"svgChiudiHelp\" data-name=\"svgChiudiHelp\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.puzzle_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"puzzle_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
  strBoxS += "</div></td></tr></table>";
  strBoxS += "</div>";
  strBoxS += "<hr>";
  strBoxS += "<div class='txtboxS'>";
  strBoxS += "<img tabindex='31' alt='" + giocoPuzzle.associazioni.find("associazione").attr("altImgSoluzione") + "' src='" + giocoPuzzle.stringaURL + "" + giocoPuzzle.associazioni.find("associazione").attr("imgSoluzione") + "'/>";
  strBoxS += "</div>";
  strBoxS += "</div>";
  strBoxS += "</div>";
  $("#contentMK6 .boxS").html(strBoxS);
  $("#contentMK6 .boxS").css("display", "block");
  $("#contentMK6 .muoviBoxS").fadeIn("slow", function () {// Animation complete
  });
  $("#contentMK6 .etichettaInfo").focus();
  document.querySelector("#contentMK6 .chiudiBoxSoluzione").addEventListener("click", chiudiBoxS);
}

function chiudiBoxS() {
  $("#contentMK6 .boxS").fadeOut("slow", function () {
    // Animation complete
    indicizzaTasselli();
  });
}

function soluzioneMK6() {
  if (!giocoPuzzle.riflessione) {
    giocoPuzzle.riflessione = true;

    for (var r = 0; r < giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") drag").length; r++) {
      var xArrivo = giocoPuzzle.posizioniCorrette[r].x;
      var yArrivo = giocoPuzzle.posizioniCorrette[r].y;
      $("#contentMK6 #drag" + r).animate({
        top: yArrivo,
        left: xArrivo
      }, 500);
      giocoPuzzle.nuovaPosizione[r].x = xArrivo;
      giocoPuzzle.nuovaPosizione[r].y = yArrivo;
    }
	
	if(giocoPuzzle.mostraBoxFinale=="true"){
		$("#contentMK6 .pulsSol").html(giocoPuzzle.associazioni.attr("pulsanteRiflessione"));
		$("#contentMK6 .pulsSol").attr("aria-label", giocoPuzzle.associazioni.attr("aria-label-riflessione"));
	}
	else{
		$("#contentMK6 .pulsSol").html("");
		$("#contentMK6 .pulsSol").css("display","none");
		app.main.tracer.completeCurrentItem();
	}
	
  } else {
    controllaConclusioneMK6();
  }
}

function riavviaGiocoPZ() {
  $("#contentMK6 .conclusione").fadeOut("slow");
  //giocoPuzzle.primaVolta = true;
  giocoPuzzle.nrSchermata = 0;
  $("#contentMK6 .pulsSol").css("visibility", "visible");
  $("#contentMK6 .pulsSol").html(giocoPuzzle.associazioni.attr("pulsanteSoluzione"));
  caricaContenutiGiocoMK6();
}

function risorsaSuccessivaPZ() {
  app.pillnavigator.tryToGoToNextItemCover();
}

function indicizzaTasselli() {
  var indiceTab = 29;
  var stringaIstruzioni = giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ")").children("istruzioni").text();

  if (stringaIstruzioni.length > 0) {
    indiceTab++;
    $("#contentMK6 .istruzioniPuzzle").attr("tabindex", indiceTab);
  }

  var mettiIlfocus = false;

  for (var r = 0; r < giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") drag").length; r++) {
    indiceTab++;
    $("#contentMK6 #drag" + giocoPuzzle.ordineTasselli[r]).attr("tabindex", indiceTab);
  }

  indiceTab++;
  $("#contentMK6 .pulsApriS").attr("tabindex", indiceTab);
  indiceTab++;
  $("#contentMK6 .pulsSol").attr("tabindex", indiceTab);

  if (stringaIstruzioni.length > 0) {
    $("#contentMK6 .istruzioniPuzzle").focus();
  } else {
    $("#contentMK6 #drag" + giocoPuzzle.ordineTasselli[0]).focus();
  }
}

function inibisciTasselli() {
  $("#contentMK6 .istruzioniPuzzle").attr("tabindex", "-1");

  for (var r = 0; r < giocoPuzzle.associazioni.find("associazione:eq(" + giocoPuzzle.nrSchermata + ") drag").length; r++) {
    $("#contentMK6 #drag" + giocoPuzzle.ordineTasselli[r]).attr("tabindex", "-1");
  }

  $("#contentMK6 .pulsApriS").attr("tabindex", "-1");
  $("#contentMK6 .pulsSol").attr("tabindex", "-1");
}