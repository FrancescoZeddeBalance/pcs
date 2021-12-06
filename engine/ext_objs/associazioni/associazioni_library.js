"use strict";

var giocoAssociazioni = {
  associazioni: "",
  fineGame: "",
  stringaURL: "",
  boxHelp: "",
  informazione: "",
  dati: "",
  stringaDrop: "",
  stringaDrag: "",
  stringaPulsantiera: "",
  nrSchermata: 0,
  nrPallini: 0,
  nrPallinoAttuale: 1,
  nrPallinoAttualeSmart: 1,
  contaDrag: 0,
  larghezzaRisoluzione: 0,
  contaDragNavigazione: 0,
  positionLeftDragSmart: 0,
  startDrag: true,
  aggancio: new Array(),
  dragAgganciato: new Array(),
  testiAgganciati: new Array(),
  varInterval: null,
  primaVolta: true,
  dragSelezionato: 0,
  targetKeySel: -1,
  mostrami: "",
  mostraBoxFinale: "",
  orientamento: "",
};

function associazioni_initFunction(contenutiAssociazioni, folderReference) {
  app.lib.debugOnConsole("INIT :::associazioni:::");
  giocoAssociazioni.associazioni = contenutiAssociazioni.find("associazioni");
  giocoAssociazioni.boxHelp = contenutiAssociazioni.find("boxHelp");
  giocoAssociazioni.boxHelpSmart = contenutiAssociazioni.find("boxHelpSmart");
  giocoAssociazioni.fineGame = contenutiAssociazioni.find("fineGame");
  giocoAssociazioni.stringaURL = folderReference;
  //giocoAssociazioni.primaVolta = true;
  giocoAssociazioni.nrSchermata = 0;
  giocoAssociazioni.nrPallinoAttuale = 1;
  giocoAssociazioni.nrPallinoAttualeSmart = 1;
  
  //if(contenutiAssociazioni.find("fineGame").attr("mostrami")
  if(contenutiAssociazioni.find("fineGame").attr("mostrami")){
	  //è presente attributo "mostrami"
	  if(contenutiAssociazioni.find("fineGame").attr("mostrami")=="true")
		giocoAssociazioni.mostraBoxFinale="true";
	  else
		giocoAssociazioni.mostraBoxFinale="false";
  }
  else{
	  giocoAssociazioni.mostraBoxFinale="true";
  }

  if(window.innerWidth > window.innerHeight) {
	  giocoAssociazioni.orientamento = "orizzontale"
  }
  else{
	  giocoAssociazioni.orientamento = "verticale"
  }
  var associazioniHtml = "\n\t\t\t<div id=\"contentMK4\">\n\t\t\t\t<div class=\"conclusione\"></div>\n\t\t\t\t<div class=\"boxHelp\" role=\"dialog\" aria-labelledby=\"etichettaHelp\" aria-describedby=\"txtboxHelp\"></div>\n\t\t\t\t\n\t\t\t\t<div class=\"contentQuizMK4\">\n\t\t\t\t\t<div class=\"titolo\"><div></div></div>\n            \n\t\t\t\t\t<div class=\"contaDomande\"></div>\n\t\t\t\t\t<div class=\"istruzioniAss\" tabindex=\"-1\"></div>\n            \n\t\t\t\t\t<div class=\"contenitoreOpzioni\">            \n\t\t\t\t\t\t<div class=\"areaDropDomanda\"></div>\n                \n\t\t\t\t\t\t<div class=\"contenitoreDragSmart\">\n\t\t\t\t\t\t\t<div class=\"areaDragSmart\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"pulsantieraSmartphone\"></div>\n\t\t\t\t\t<div class=\"pulsantieraTablet\"></div>\n\t\t\t\t\t\n            \n\t\t\t\t</div>\n\t\t\t</div>";
  /// Adding HTML to object container

  $(".ax_box_pill_container .ax_current_object_container").html(associazioniHtml); /// Listen to keyboard navigationsss

  $(document).on("keydown", function (e) {
    /// ESC to exit
    if (e.which == 27) {
      $("#ax_desktop_header_icon_id_" + app.global.CURRENT_OBJECT_INDEX + ".ax_desktop_header_icon").click();
    }


    if (e.which == 13 || e.which == 32) {

      if (document.activeElement.className == "chiudiBoxHelpAssociazioni") {chiudiBoxHelpAssociazioni();}

      if (document.activeElement.className == "pulsRiavviaDD") {riavviaGiocoDD();}

      if (document.activeElement.className == "pulsRisSuccDD") {risorsaSuccessivaDD();}

      if (document.activeElement.id == "avanza") {schermataSuccessivaDD();}

      if (document.activeElement.className == "menuLi") {
        var qualeItem = document.activeElement.id.substr(6);
        muoviDrag(qualeItem);
      }

      if (document.activeElement.className.indexOf("draggable") != -1) {
        var indiceDragSelezionato = document.activeElement.id.substr(4);
        giocoAssociazioni.dragSelezionato = indiceDragSelezionato;
        giocoAssociazioni.targetKeySel = 0;
        apriMenuTarget(indiceDragSelezionato);

        for (var r = 0; r < giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag").length; r++) {
          //console.log(r + " == " + indiceDragSelezionato);
          if (r == indiceDragSelezionato) $("#contentMK4 #drag" + r).css("z-index", "10");else $("#contentMK4 #drag" + r).css("z-index", "3");
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
      //console.log("freccia giu: "+document.activeElement.id)
      if (document.activeElement.className == "menuLi") {
        giocoAssociazioni.targetKeySel++;
        $('.menuLi').blur();

        if (giocoAssociazioni.targetKeySel == giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio").length) {
          giocoAssociazioni.targetKeySel = 0;
          $("#contentMK4 #drag" + giocoAssociazioni.dragSelezionato + " #menuPopup").css("display", "none");
          indicizzaDrag();
        }

        $('#drag' + giocoAssociazioni.dragSelezionato + ' #menuLi' + giocoAssociazioni.targetKeySel).focus();
      }
    }

    if (e.which == 38) {
      //freccia su
      //console.log("freccia su: "+document.activeElement.id)
      if (document.activeElement.className == "menuLi") {
        $('.menuLi').blur();

        if (giocoAssociazioni.targetKeySel == 0) {
          var ultimoItem = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio").length - 1;
          giocoAssociazioni.targetKeySel = ultimoItem;
        } else {
          giocoAssociazioni.targetKeySel--;
        }

        $('#drag' + giocoAssociazioni.dragSelezionato + ' #menuLi' + giocoAssociazioni.targetKeySel).focus();
      }
    }
  });
  caricaContenutiAssociazioni(); /// complete at start
}

function apriMenuTarget(numero) {
  inibisciDrag();
  $("#contentMK4 #drag" + numero + " #menuPopup").css("display", "block");
  $('#drag' + numero + ' #menuLi' + giocoAssociazioni.targetKeySel).focus();
}

function muoviDrag(qualeItem) {
  abbinaDaTastiera();
}

function abbinaDaTastiera() {
  var dragScelto = giocoAssociazioni.dragSelezionato;
  var dropAgganciato = parseInt(giocoAssociazioni.targetKeySel) + 1;

  if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("drag:eq(" + dragScelto + ")").attr("aggancio") == dropAgganciato) {
    //////console.log( "esatta" )
    $("#contentMK4 #feedbackLive").html(giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").attr("feedbackCorrettoScreenReader"));
    $('#drag' + giocoAssociazioni.dragSelezionato).css("display", "none");
    giocoAssociazioni.aggancio[dropAgganciato - 1] = "1";
    giocoAssociazioni.dragAgganciato[dragScelto] = "1";
    var strFeedOk = "";
    strFeedOk += "<div class='contRispOk' tabindex='-1'><table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle' >";

    if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + dragScelto + ")").attr("pathImg") != "") {
      strFeedOk += "<img alt='" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("drag:eq(" + dragScelto + ")").attr("altImg") + "' src=\"" + giocoAssociazioni.stringaURL + "/" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("drag:eq(" + dragScelto + ")").attr("pathImg") + "" + "\"/>";
    } else {
      giocoAssociazioni.testiAgganciati[dropAgganciato - 1] += giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("drag:eq(" + dragScelto + ")").text() + "<br>";
      strFeedOk += giocoAssociazioni.testiAgganciati[dropAgganciato - 1].toUpperCase();
    }

    strFeedOk += "</td></tr></table>";
    strFeedOk += "<div class='feedOk' tabindex='-1'>";
    strFeedOk += "<svg id='svgSpuntaVerde' width='26' height='26' style='enable-background:new 0 0 128 128;' version='1.1' viewBox='0 0 128 128' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><circle class='st0' cx='64' cy='64' r='64'/></g><g><path class='st1' d='M54.3,97.2L24.8,67.7c-0.4-0.4-0.4-1,0-1.4l8.5-8.5c0.4-0.4,1-0.4,1.4,0L55,78.1l38.2-38.2   c0.4-0.4,1-0.4,1.4,0l8.5,8.5c0.4,0.4,0.4,1,0,1.4L55.7,97.2C55.3,97.6,54.7,97.6,54.3,97.2z'/></g></svg>";
    strFeedOk += "</div></div>";
    $("#contentMK4 #domanda" + giocoAssociazioni.targetKeySel).html(strFeedOk);

    if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio").length > 3) {
      $(".contentQuizMK4 .contRispOk table tr td img").css("width", "auto");
      $(".contentQuizMK4 .contRispOk table tr td img").css("height", "116px");
    } else {
      $(".contentQuizMK4 .contRispOk table tr td img").css("width", "auto");
      $(".contentQuizMK4 .contRispOk table tr td img").css("max-height", "160px");
    }

    indicizzaDrag();
    controllaConclusioneDD();
  } else {
    /////////console.log( "non esatta");
    $("#contentMK4 #feedbackLive").html(giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").attr("feedbackErratoScreenReader")); //TweenLite.to( $('.draggable') , 1 , { x:0 , y:0 });//revert
    //TweenLite.set(".draggable",{opacity:1});
  }
}

window.addEventListener('orientationchange', orientaGameAssociazioni)

function orientaGameAssociazioni() {
	
  if(window.innerWidth > window.innerHeight) {
	  giocoAssociazioni.orientamento = "orizzontale";
  }
  
  if(window.innerWidth < window.innerHeight) {
	  giocoAssociazioni.orientamento = "verticale";
  }
  
}

function caricaContenutiAssociazioni() {
  $(".contentQuizMK4").css("display", "block"); //if($(".contentQuizMK4").css("width") > "750px" ){
//console.log("************: "+giocoAssociazioni.orientamento)
  //if (!app.global.IS_SMARTPHONE || giocoAssociazioni.larghezzaRisoluzione >= 768) {
	  //console.log( app.global.IS_SMARTPHONE +" && "+ giocoAssociazioni.larghezzaRisoluzione +" || "+giocoAssociazioni.orientamento )
  if ( (giocoAssociazioni.larghezzaRisoluzione < 600 && giocoAssociazioni.orientamento == "verticale") || (giocoAssociazioni.larghezzaRisoluzione < 900 && giocoAssociazioni.orientamento == "orizzontale") ) {
	//smartphone = true;
    $("#contentMK4 .contenitoreDragSmart").fadeIn("slow");
  } else {
    //smartphone = false;
    $("#contentMK4 .contenitoreDragTab").fadeIn("slow");
  }

  creaContenutiAssociazioni();
}

function creaContenutiAssociazioni() {
  giocoAssociazioni.larghezzaRisoluzione = $(".ax_current_object_container").width();
  giocoAssociazioni.targetKeySel = 0;
  
  /*font e dimensione di riferimento*/
  if(giocoAssociazioni.associazioni.attr("fontFamily")!="")
	$("#contentMK4").css("font-family",giocoAssociazioni.associazioni.attr("fontFamily"));
  
  if(giocoAssociazioni.associazioni.attr("fontSize")!="")
	$("#contentMK4").css("font-size",giocoAssociazioni.associazioni.attr("fontSize"));
  
  
  giocoAssociazioni.stringaDrop = "";
  var fraseContatore = giocoAssociazioni.associazioni.attr("contatoreFraseIniziale") + " " + (giocoAssociazioni.nrSchermata + 1) + " " + giocoAssociazioni.associazioni.attr("contatorePreposizione") + " " + giocoAssociazioni.associazioni.find("associazione").length; //ISTRUZIONI E FEEDBACK LIVE

  if (giocoAssociazioni.associazioni.find("associazione").length > 1) $("#contentMK4 .contaDomande").html("<div id='contatore' class='contatore' tabindex='-1' aria-label='" + fraseContatore + "'>" + fraseContatore + "</div><div id=\"feedbackLive\" role=\"alert\" style=\"position:absolute; z-index:-1; font-size:0.2em;\"></div>"); //COSTRUISCO I DROP
  
  var numeroAgganciMK4 = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio").length;
  var numeroDragMK4 = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag").length;

  for (var s = 0; s < numeroAgganciMK4; s++) {
    giocoAssociazioni.testiAgganciati[s] = "";
    giocoAssociazioni.aggancio[s] = "0";
    var grandezzaFONT = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").attr("txtboxSize");
    var interlineaFONT = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").attr("txtboxLineHeight");
    var coloreFONT = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").attr("textColor");
    var coloreSfondoDrop = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").attr("bgColor");
	
	var classDroppable = ""
	var classDroppable = "";
	if(numeroAgganciMK4 == 2)
		classDroppable = "droppable duedrop"
	if(numeroAgganciMK4 == 3)
		classDroppable = "droppable tredrop"
	if(numeroAgganciMK4 == 4)
		classDroppable = "droppable quattrodrop"
	if(numeroAgganciMK4 == 5)
		classDroppable = "droppable cinquedrop"
	if(numeroAgganciMK4 == 6)
		classDroppable = "droppable seidrop"
	
    //if ( (app.global.IS_SMARTPHONE && giocoAssociazioni.larghezzaRisoluzione < 768) || (giocoAssociazioni.larghezzaRisoluzione < 900 && giocoAssociazioni.orientamento == "orizzontale") ) {
	if ( (giocoAssociazioni.larghezzaRisoluzione < 600 && giocoAssociazioni.orientamento == "verticale") || (giocoAssociazioni.larghezzaRisoluzione < 900 && giocoAssociazioni.orientamento == "orizzontale") ) {
      giocoAssociazioni.stringaDrop += "<div id='domanda" + s + "' class='"+classDroppable+"' aria-label='" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").attr("aria-label-drop") + "' tabindex='-1' style='color:" + coloreFONT + "; background-color:" + coloreSfondoDrop + " '>";
    }
	else {
      giocoAssociazioni.stringaDrop += "<div id='domanda" + s + "' class='"+classDroppable+"' aria-label='" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").attr("aria-label-drop") + "' tabindex='-1' style='color:" + coloreFONT + "; font-size:" + grandezzaFONT + "; line-height:" + interlineaFONT + "; background-color:" + coloreSfondoDrop + " '>";
    }

    giocoAssociazioni.stringaDrop += "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle'>";

    if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").attr("pathImg") != "") {
      giocoAssociazioni.stringaDrop += "<img alt='" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").attr("altImg") + "' src=\"" + giocoAssociazioni.stringaURL + "/" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").attr("pathImg") + "" + "\"/>";
    } else {
      giocoAssociazioni.stringaDrop += giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + s + ")").text();
    }

    giocoAssociazioni.stringaDrop += "</td></tr></table></div>";
  }

  giocoAssociazioni.stringaDrag = ""; //COSTRUISCO I DRAG

  var contenutoDrag;

  for (var r = 0; r < giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag").length; r++) {
    giocoAssociazioni.dragAgganciato[r] = "0";
    var grandezzaFONTdrag = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("txtboxSize");
    var interlineaFONTdrag = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("txtboxLineHeight");
    var coloreFONTdrag = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("textColor");
    var coloreSfondoDrag = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("bgColor");
    contenutoDrag = "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle'>";

    if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("pathImg") != "") {
      //immagine drag
      contenutoDrag += "<img alt='" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("altImg") + "' id='imgDrag" + (r + 1) + "' src=\"" + giocoAssociazioni.stringaURL + "/" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("pathImg") + "" + "\"/>";
    } else {
      //testo drag
      if ( (giocoAssociazioni.larghezzaRisoluzione < 600 && giocoAssociazioni.orientamento == "verticale") || (giocoAssociazioni.larghezzaRisoluzione < 900 && giocoAssociazioni.orientamento == "orizzontale") ) {
        contenutoDrag += "<div class='txtContenutoDrag'>" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").text() + "</div>";
      } else {
        contenutoDrag += "<div class='txtContenutoDrag' style='font-size:" + grandezzaFONTdrag + "; line-height:" + interlineaFONTdrag + "; '>" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").text() + "</div>";
      }
    }

    contenutoDrag += "</td></tr></table>";
    //tablet
	
	var classeDrag = "";
	if(numeroDragMK4 == 2)
		classeDrag = "draggable duedrag dragTab"
	if(numeroDragMK4 == 3)
		classeDrag = "draggable tredrag dragTab"
	if(numeroDragMK4 == 4)
		classeDrag = "draggable quattrodrag dragTab"
	if(numeroDragMK4 == 5){
		classeDrag = "draggable cinquedrag dragTab";
	}
	if(numeroDragMK4 == 6){
		classeDrag = "draggable seidrag dragTab";
	}

    giocoAssociazioni.stringaDrag += "<div id=\"drag" + r + "\" class=\""+classeDrag+"\" role=\"button\" aria-grabbed=\"false\" aria-dropeffect=\"none\" draggable=\"true\" tabindex=\"-1\" aria-haspopup='true' aria-label=\" " + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("aria-label-drag") + " " + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").text() + "\" style=\"color:" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("textColor") + "; position:relative; z-index:2; background-color:" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + r + ")").attr("bgColor") + "\" >" + contenutoDrag;
    giocoAssociazioni.stringaDrag += "<div id=\"menuPopup\" role=\"menu\" aria-labelledby=\"menubutton\">";
    var indicizzaItem = 30;

    for (var i = 0; i < giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio").length; i++) {
      var ariaLabelTarget = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + i + ")").attr("aria-label-drop");
      var ariaLabelEseguiItem = giocoAssociazioni.associazioni.attr("label-esegui-item");
      giocoAssociazioni.stringaDrag += "<div id=\"menuLi" + i + "\" class=\"menuLi\" role=\"menuitem\" tabindex=\"" + (indicizzaItem + i) + "\" aria-label=\"" + ariaLabelTarget + " " + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + i + ")").text() + " " + ariaLabelEseguiItem + "\">" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + i + ")").text() + "</div>";
    }

    giocoAssociazioni.stringaDrag += "";
    giocoAssociazioni.stringaDrag += "";
    giocoAssociazioni.stringaDrag += "";
    giocoAssociazioni.stringaDrag += "";
    giocoAssociazioni.stringaDrag += "</div>";
    giocoAssociazioni.stringaDrag += "</div>"; //}
  }

  $("#contentMK4 .istruzioniAss").html(giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").text());
  
  if(giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").attr("coloreIstruzioni")!="")
	$("#contentMK4 .istruzioniAss").css("color", giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").attr("coloreIstruzioni"));

  if ( (giocoAssociazioni.larghezzaRisoluzione < 600 && giocoAssociazioni.orientamento == "verticale") || (giocoAssociazioni.larghezzaRisoluzione < 900 && giocoAssociazioni.orientamento == "orizzontale") ) {
    //console.log("smartphone--------"+giocoAssociazioni.stringaDrag);
    $("#contentMK4 .areaDragSmart").html(giocoAssociazioni.stringaDrag);
    $("#contentMK4 .areaDropDomanda").html("<table width='100%' height='100%' border='0'><tr><td height='100%' valign='middle'>" + giocoAssociazioni.stringaDrop + "</td></tr></table>");
    giocoAssociazioni.positionLeftDragSmart = parseInt($("#contentMK4 .areaDragSmart").css("left")); //aggiustaPosizioneDragSmart();
    //aggiornaPalliniSmartphoneMK4();
  } else {
    $("#contentMK4 .istruzioniAss").css("top", giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").attr("topIstruzioni"));
	
	if(giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").attr("sizeIstruzioni")!="")
		$("#contentMK4 .istruzioniAss").css("fontSize", giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").attr("sizeIstruzioni"));
	
    $("#contentMK4 .istruzioniAss").css("lineHeight", giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").attr("lineHeight"));

    if (numeroAgganciMK4 > 4) {
      $("#contentMK4 .contenitoreOpzioni").html("<div class='contenitoreDragTab'><table width='100%' height='100%' border='0' aria-hidden='true'><tr><td height='100%' valign='middle'>" + giocoAssociazioni.stringaDrag + "</td></tr></table></div><div class='areaDropDomanda'><table width='100%' height='100%' border='0'><tr><td height='100%' valign='middle'>" + giocoAssociazioni.stringaDrop + "</td></tr></table></div>");
    } else {
      $("#contentMK4 .contenitoreOpzioni").html("<div class='areaDropDomanda'><table width='100%' height='100%' border='0'><tr><td height='100%' valign='middle'>" + giocoAssociazioni.stringaDrop + "</td></tr></table></div><div class='contenitoreDragTab'>" + giocoAssociazioni.stringaDrag + "</div>");
    }

    $("#contentMK4 .contenitoreDragTab").fadeIn("fast");
  }

  $("#contentMK4 .areaDropDomanda").fadeIn("fast"); //settaDraggable();
  
	if(numeroDragMK4 >= 5){
		$("#contentMK4 .areaDropDomanda").addClass("areaDropDomandaCinque");
		$("#contentMK4 .contenitoreDragTab").addClass("contenitoreDragTabCinque");
	}

  var strPulsanti = "";

  if (!app.global.IS_SMARTPHONE || giocoAssociazioni.larghezzaRisoluzione >= 768) {
    //tablet		
    strPulsanti += "<nav id=\"associa_rightArrow_nav\" class=\"associa_arrow_nav\" tabindex=\"-1\"><svg role=\"link\" aria-label=" + app.labels.nav_forward + " id=\"associa_rightArrow\" class=\"associa_arrow\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g stroke-linejoin=\"round\" stroke-linecap=\"round\" >	<circle r=\"46\" cx=\"50\" cy=\"50\" /><polyline points=\"40 25, 70 50, 40 75\" ></polyline></g></svg></nav>";
  }

  aggiornaPalliniTabletMK4();

  /*help*/

  giocoAssociazioni.mostrami = giocoAssociazioni.boxHelp.attr("mostrami"); //console.log("--------------mostrami: "+mostrami);

  if (giocoAssociazioni.mostrami == "true" && giocoAssociazioni.primaVolta) {
    //if(mostrami){
    giocoAssociazioni.primaVolta = false;
    var strBoxHelp = "";
    strBoxHelp += "<div class='muoviBoxHelp'>";
    strBoxHelp += "<div class='contboxHelp'>";
    strBoxHelp += "<div class='titboxHelp'>";
    strBoxHelp += "<table width='100%' border='0'><tr><td id='distanziaEtHelp' style='text-align=center;'></td><td id='cellaIconaHelp' width='30px' style='text-align=center; valign:middle;'>";
    strBoxHelp += "<!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon --><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' xml:space='preserve'><metadata> Svg Vector Icons :http://www.onlinewebfonts.com/icon </metadata><g><path fill='#FFFFFF' d='M500,9.8C229.4,9.8,10,229.3,10,500c0,270.7,219.4,490.2,490,490.2c270.6,0,490-219.5,490-490.2C990,229.3,770.6,9.8,500,9.8z M500,908.5C274.5,908.5,91.7,725.6,91.7,500C91.7,274.4,274.5,91.5,500,91.5c225.5,0,408.3,182.9,408.3,408.5C908.3,725.6,725.5,908.5,500,908.5z M459.2,744.8h81.7v-80.4l-81.9-1L459.2,744.8z M620.5,278.3c-35-25.3-72.7-36.5-125.6-34.1c-28.8,1.3-67.3,10.4-94.3,29.3c-47.7,33-62.1,77.8-64.8,144.5h82.4c0-19.4,5.7-45.9,17-63.9c11.3-18,30.8-30.2,64.1-33.4c34.6-2.9,57,9.2,67.2,18.1c25.5,23,15.2,81.1-6.1,104c-9.1,10.4-48.5,40.8-48.5,40.8c-25.2,19.7-37,37.1-43.1,52.2c-6.1,15.2-8.6,47.6-10,87.2h82.5l0.7-9.6c0,0-8.2-57,21.9-76.4l38.9-25.7c25.2-19.6,32.1-26.9,41-39.6c15.2-20.9,26.6-46.5,26.6-77C670.5,344.9,655.5,303.6,620.5,278.3z'/></g></svg>";
    strBoxHelp += "</td><td><div id='etichettaHelp' tabindex='31'>" + giocoAssociazioni.boxHelp.attr("etichetta") + "</div></td><td width='20px'><div class='chiudiBoxHelpAssociazioni' style='text-align:right; cursor:pointer;' role='button' aria-label='" + giocoAssociazioni.boxHelp.attr("aria-label-help") + "' tabindex='33'>";
    strBoxHelp += "<svg id=\"svgChiudiHelp\" data-name=\"svgChiudiHelp\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.associazioni_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"associazioni_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
    strBoxHelp += "</div></td></tr></table>";
    strBoxHelp += "</div>";
    strBoxHelp += "<hr>";
    strBoxHelp += "<div id='txtboxHelp' class='txtboxHelp' tabindex='32'>"; //boxHelpSmart

    if ( (giocoAssociazioni.larghezzaRisoluzione < 600 && giocoAssociazioni.orientamento == "verticale") || (giocoAssociazioni.larghezzaRisoluzione < 900 && giocoAssociazioni.orientamento == "orizzontale") ) {
      strBoxHelp += giocoAssociazioni.boxHelpSmart.text();
    } else {
      strBoxHelp += giocoAssociazioni.boxHelp.text();
    }

    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    $("#contentMK4 .boxHelp").html(strBoxHelp); //$(".boxHelp").fadeIn("slow");

    $("#contentMK4 .boxHelp").css("display", "block");
	var animationDurationFirst = 800;

	if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
	
    $("#contentMK4 .muoviBoxHelp").fadeIn().css({
      top: -200,
      position: 'absolute'
    }).animate({
      top: 5
    }, animationDurationFirst, function () {
      //callback
      $("#contentMK4 #etichettaHelp").focus(); //$(".chiudiBoxHelpAssociazioni").focus();
    });
    document.querySelector(".chiudiBoxHelpAssociazioni").addEventListener("click", chiudiBoxHelpAssociazioni);
  } else {
    //se non è presente l'help, inserire il focus sul primo oggetto
	var apertura;
    if (apertura) apertura = false;
    indicizzaDrag();
  }
  

  var imageUrl = giocoAssociazioni.associazioni.attr("background-image");
  var sfdColor = giocoAssociazioni.associazioni.attr("bg-color"); //$("#contentMK4 .contentQuizMK4 .contenitoreOpzioni").html("<img src='"+giocoAssociazioni.stringaURL+imageUrl+"'/>");

  if (imageUrl != ""){
  $("#contentMK4 .contentQuizMK4 .contenitoreOpzioni").css("background-image", "url(" + giocoAssociazioni.stringaURL + "/" + imageUrl + ")");}
  else {
	  if(sfdColor!="")
		$("#contentMK4 .contentQuizMK4 .contenitoreOpzioni").css("background-color", sfdColor);
  }
  settaDraggable();
}

function aggiornaPalliniTabletMK4() {
  giocoAssociazioni.nrPallini = giocoAssociazioni.associazioni.find("associazione").length;
  giocoAssociazioni.stringaPulsantiera = "";
  giocoAssociazioni.stringaPulsantiera += "<div id=\"contPallini\">";

  for (var r = 0; r < giocoAssociazioni.nrPallini; r++) {
    if (r == giocoAssociazioni.nrPallinoAttuale - 1) {
      giocoAssociazioni.stringaPulsantiera += "<div id=\"pallino" + r + "\" class=\"pallino\" style='background-color: #464646; border: 1px solid #FCFCFC; box-shadow: 0 0 0 2px #999999; width:15px; height:15px;'></div>";
    } else {
      giocoAssociazioni.stringaPulsantiera += "<div id=\"pallino" + r + "\" class=\"pallino\"></div>";
    }
  }

  giocoAssociazioni.stringaPulsantiera += "</div>";
  if (giocoAssociazioni.associazioni.find("associazione").length > 1) $(".contentQuizMK4 .pulsantieraTablet").html(giocoAssociazioni.stringaPulsantiera);else $(".contentQuizMK4 .pulsantieraTablet").html("");

}

function chiudiBoxHelpAssociazioni(e) {
	
	var animationDurationFirst = 800;
	if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
	
  $(".boxHelp").fadeOut("slow");
  $(".muoviBoxHelp").fadeIn().css({
    top: 5,
    position: 'absolute'
  }).animate({
    top: -200
  }, animationDurationFirst, function () {
    //callback
    $(".boxHelp").css("display", "none");
    indicizzaDrag();
  });
}

function indicizzaDrag() {
  var indiceTab = 29;

  if (giocoAssociazioni.associazioni.find("associazione").length > 1) {
    indiceTab++;
    $("#contentMK4 .contatore").attr("tabindex", indiceTab);
    var stringaIstruzioni = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").text();

    if (stringaIstruzioni.length > 0) {
      indiceTab++;
      $("#contentMK4 .istruzioniAss").attr("tabindex", indiceTab);
    }
  } else {
    if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").text().length > 0) {
      $("#contentMK4 .istruzioniAss").attr("tabindex", indiceTab);
    }
  }

  var mettiIlfocus = false; //console.log("giocoAssociazioni.nrSchermata: "+giocoAssociazioni.nrSchermata)

  for (var r = 0; r < giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag").length; r++) {
    
    if ($('#drag' + r).css("display") != "none") {
      indiceTab++;
	  
      $("#contentMK4 #drag" + r).attr("tabindex", indiceTab);
    }
  }

  for (var s = 0; s < giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio").length; s++) {
    indiceTab++;
    $("#contentMK4 #domanda" + s).attr("tabindex", indiceTab);
  }

  if (giocoAssociazioni.associazioni.find("associazione").length > 1) {
    $("#contentMK4 .contatore").focus();
  } else if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("istruzioni").text().length > 0) {
    $("#contentMK4 .istruzioniAss").focus();
  } else {
    $("#contentMK4 #domanda0").focus();
  }
}

function inibisciDrag() {
  for (var r = 0; r < giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag").length; r++) {
    $("#contentMK4 #drag" + r).attr("tabindex", "-1");
  }

  for (var s = 0; s < giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio").length; s++) {
    $("#contentMK4 #domanda" + s).attr("tabindex", "-1");
  }

  $("#contentMK4 .contatore").attr("tabindex", "-1");
  $("#contentMK4 .istruzioniAss").attr("tabindex", "-1");
  $("#contentMK4 #drag" + giocoAssociazioni.dragSelezionato).blur();
  $("#contentMK4 #drag" + giocoAssociazioni.dragSelezionato).attr("aria-grabbed", "false");
}

function settaDraggable() {
  var overlapThreshold = '10%';
  var foundIndex = null; //current droparea index user is hovering

  var Targets = document.querySelectorAll('.droppable');
  var larghezzaDrag;
  var altezzaDrag;
  var StartX;
  var StartY;
  var startDrag;
  Draggable.create(".draggable", {
    type: 'x,y',
    throwProps: true,
    edgeResistance: 1,
    bounds: "#contentMK4",
    overshootTolerance: 0,
    zIndexBoost: false,
    inertia: true,
    onPress: function onPress() {
      StartX = this.x;
      StartY = this.y; //posizioni di partenza

      $("#contentMK4 #" + this.target.id).attr("aria-grabbed", "true");
      larghezzaDrag = $("#contentMK4 #" + this.target.id).css("width");
      altezzaDrag = $("#contentMK4 #" + this.target.id).css("height"); //$("#"+this.target.id).focus();
    },
    onDragStart: function onDragStart() {
      startDrag = true;
      TweenLite.set($("#contentMK4 #" + this.target.id), {
        cursor: "-webkit-grabbing",
        opacity: 0.6
      });
      TweenLite.to($("#contentMK4 #" + this.target.id), 0.5, {
        scale: 0.70,
        transformOrigin: "center top"
      });
    },
    onDrag: function onDrag(e) {
		for (var i = 0; i < Targets.length; i++) {
		  $("#contentMK4 #" + Targets[i].id).css('border', 'none');
        if (this.hitTest(Targets[i], '50%')) {
          //$(".draggable").css("border", "none");
          $("#contentMK4 #" + Targets[i].id).css('border', 'solid 2px #ea447b');
        }
      }
	},
    onDragEnd: function onDragEnd() {
      startDrag = false;
	
      TweenLite.to($("#contentMK4 #" + this.target.id), 0.5, {
        scale: 1,
        transformOrigin: "center top"
      });

      $("#contentMK4 #" + this.target.id).attr("aria-grabbed", "false");
      var areaSelezionata; //for(var i=Targets.length;i==0; i--){

      for (var i = 0; i < Targets.length; i++) {
		$("#contentMK4 #" + Targets[i].id).css('border', 'none');
        if (this.hitTest(Targets[i], '50%')) {
          //console.log("target1: "+Targets[i].id)
          areaSelezionata = Targets[i].id;
        }
      }

      if (areaSelezionata != undefined) {
        var idDrag = this.target.id;
        var dragScelto = parseInt(this.target.id.charAt(4)) + 1;
        var idDrop = areaSelezionata;
        $("#contentMK4 #" + this.target.id).attr("aria-dropeffect", "move");
        var dropAgganciato = parseInt(areaSelezionata.charAt(7)) + 1;

        if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("drag:eq(" + (dragScelto - 1) + ")").attr("aggancio") == dropAgganciato) {
          //console.log( "esatta" )
          giocoAssociazioni.aggancio[dropAgganciato - 1] = "1";
          giocoAssociazioni.dragAgganciato[dragScelto - 1] = "1";

          if ( (giocoAssociazioni.larghezzaRisoluzione < 600 && giocoAssociazioni.orientamento == "verticale") || (giocoAssociazioni.larghezzaRisoluzione < 900 && giocoAssociazioni.orientamento == "orizzontale") ) {
            var indexDrag = dragScelto;
            $("#contentMK4 #contenitoreDragSm" + indexDrag).css("display", "none");
            giocoAssociazioni.positionLeftDragSmart = 0;
            giocoAssociazioni.contaDragNavigazione = 0;
          }

          $("#contentMK4 #" + idDrag).css("display", "none");
          var grandezzaFONTfeed = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + (dropAgganciato - 1) + ")").attr("txtboxSize");
          var interlineaFONTfeed = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + (dropAgganciato - 1) + ")").attr("txtboxLineHeight");
          var coloreFONTfeed = giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio:eq(" + (dropAgganciato - 1) + ")").attr("textColor");
          var strFeedOk = "";

          if ( (giocoAssociazioni.larghezzaRisoluzione < 600 && giocoAssociazioni.orientamento == "verticale") || (giocoAssociazioni.larghezzaRisoluzione < 900 && giocoAssociazioni.orientamento == "orizzontale") ) {
            strFeedOk += "<div class='contRispOk'><table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle' >";
          } else {
            strFeedOk += "<div class='contRispOk' style='color:" + coloreFONTfeed + "; font-size:" + grandezzaFONTfeed + "; line-height:" + interlineaFONTfeed + "; '><table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr><td height='100%' valign='middle' >";
          }

          if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag:eq(" + (dragScelto - 1) + ")").attr("pathImg") != "") {
            strFeedOk += "<img alt='" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("drag:eq(" + (dragScelto - 1) + ")").attr("altImg") + "' src=\"" + giocoAssociazioni.stringaURL + "/" + giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("drag:eq(" + (dragScelto - 1) + ")").attr("pathImg") + "" + "\"/>";
          } else {
            giocoAssociazioni.testiAgganciati[dropAgganciato - 1] += giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ")").children("drag:eq(" + (dragScelto - 1) + ")").text() + "<br>";
            strFeedOk += giocoAssociazioni.testiAgganciati[dropAgganciato - 1].toUpperCase();
          }

          strFeedOk += "</td></tr></table>";
          strFeedOk += "<div class='feedOk'>";

          strFeedOk += "<svg id='svgSpuntaVerde' width='26' height='26' style='enable-background:new 0 0 128 128;' version='1.1' viewBox='0 0 128 128' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><circle class='st0' cx='64' cy='64' r='64'/></g><g><path class='st1' d='M54.3,97.2L24.8,67.7c-0.4-0.4-0.4-1,0-1.4l8.5-8.5c0.4-0.4,1-0.4,1.4,0L55,78.1l38.2-38.2   c0.4-0.4,1-0.4,1.4,0l8.5,8.5c0.4,0.4,0.4,1,0,1.4L55.7,97.2C55.3,97.6,54.7,97.6,54.3,97.2z'/></g></svg>";
          strFeedOk += "</div></div>";
          $("#contentMK4 #" + idDrop).html(strFeedOk);

          if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio").length > 3) {
            $(".contentQuizMK4 .contRispOk table tr td img").css("width", "auto");
            $(".contentQuizMK4 .contRispOk table tr td img").css("height", "116px");
          } else {
            $(".contentQuizMK4 .contRispOk table tr td img").css("width", "auto");
            $(".contentQuizMK4 .contRispOk table tr td img").css("max-height", "160px");
          }

          TweenLite.set(".draggable", {
            opacity: 1
          });
          controllaConclusioneDD();
        } else {
          //console.log( "non esatta");
          TweenLite.to(this.target, 0.3, {
            x: StartX,
            y: StartY
          }); //revert

          TweenLite.set(".draggable", {
            opacity: 1
          });
        }
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
} //conclusione


function controllaConclusioneDD() {
  var strAggancio = "";

  for (var s = 0; s < giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") drag").length; s++) {
    
    if (giocoAssociazioni.dragAgganciato[s] == "1") {
      strAggancio += "1";
    } else {
      strAggancio += "0";
    }
  }

  if (strAggancio.indexOf("0") == -1) {
    //fine pagina
	
    var strAvanza = "<div id='avanza' tabindex=\"30\" aria-label=\"" + giocoAssociazioni.associazioni.attr("aria-label-avanza") + "\" style=\"background-color:" + giocoAssociazioni.associazioni.attr("pulsanteAvanzaBgColor") + "; color:" + giocoAssociazioni.associazioni.attr("pulsanteAvanzaTextColor") + "\">" + giocoAssociazioni.associazioni.attr("pulsanteAvanza") + "</div>";
	
	if ( (giocoAssociazioni.mostraBoxFinale!="true") && (giocoAssociazioni.nrSchermata == giocoAssociazioni.associazioni.find("associazione").length - 1) ) {
		conclusione();
	 } 
	 else{
		 
		if ($("#contentMK4 .contenitoreDragTab").css("display") == "block") {
		  $("#contentMK4 .contenitoreDragTab").html("<div class='contAvanza' tabindex=\"-1\">" + strAvanza + "</div>");
		  document.querySelector(".contenitoreDragTab #avanza").addEventListener("click", schermataSuccessivaDD);

		  if (giocoAssociazioni.associazioni.find("associazione:eq(" + giocoAssociazioni.nrSchermata + ") aggancio").length > 4) {
			  
			if (!app.global.IS_SMARTPHONE || giocoAssociazioni.larghezzaRisoluzione >= 768) {
			  $(".contentQuizMK4 .contAvanza").css({
				position: 'absolute'
			  });
			}
		  }
		} else {
		  $("#contentMK4 .areaDragSmart").html(strAvanza);
		  document.querySelector(".areaDragSmart #avanza").addEventListener("click", schermataSuccessivaDD);
		}
	
	
	 }
	
  }
}

function conclusione() {
  app.main.tracer.completeCurrentItem();
  var indiceElementi = 30;
  
	if(giocoAssociazioni.mostraBoxFinale=="true"){
		
	  var strConclusione = "";
	  strConclusione += "<div class='contTxtConclusioniDD' role='dialog' aria-labelledby='titConclusioniDD' aria-describedby='txtConclusioniDD' tabindex='" + indiceElementi + "'>";

	  if (giocoAssociazioni.fineGame.attr("etichetta") != "") {
		indiceElementi++;
		strConclusione += "<div class='titConclusioniDD' tabindex='" + indiceElementi + "'>";
		strConclusione += giocoAssociazioni.fineGame.attr("etichetta");
		strConclusione += "</div>";
	  }

	  strConclusione += "<hr>";
	  indiceElementi++;
	  strConclusione += "<div class='txtConclusioniDD' tabindex='" + indiceElementi + "'>";
	  strConclusione += giocoAssociazioni.fineGame.text();
	  strConclusione += "</div>";
	  indiceElementi++;
	  strConclusione += "<div class='contPulsRiavviaDD'>";
	  strConclusione += "<div class='pulsRiavviaDD' tabindex='" + indiceElementi + "' role='button' aria-label='" + giocoAssociazioni.fineGame.attr("aria-label-pulsante") + "'>" + giocoAssociazioni.fineGame.attr("pulsanteRiavvia") + "</div>";
	  if( giocoAssociazioni.fineGame.attr("presenzaPulsanteRisSucc") == "1" ){
		 indiceElementi++;
		strConclusione += "<div class='pulsRisSuccDD' tabindex='" + indiceElementi + "' role='button' aria-label='" + giocoAssociazioni.fineGame.attr("aria-label-pulsanteRisSucc") + "'>" + giocoAssociazioni.fineGame.attr("pulsanteRisSucc") + "</div>";
	  }
	  strConclusione += "</div>";
	  strConclusione += "</div>";
	  strConclusione += "</div>";
	  $("#contentMK4 .conclusione").html(strConclusione);
	  $("#contentMK4 .conclusione").fadeIn("slow", function () {
		// Animation complete
		inibisciDrag(); //tolgo i tabindex e gli eventi
		//formattazione da xml
		
		if(giocoAssociazioni.fineGame.attr("sfondoPulsante")!="")
			$("#contentMK4 .pulsRiavviaDD").css("background-color", giocoAssociazioni.fineGame.attr("sfondoPulsante"));
		if(giocoAssociazioni.fineGame.attr("coloreTestoPulsante")!="")
			$("#contentMK4 .pulsRiavviaDD").css("color", giocoAssociazioni.fineGame.attr("coloreTestoPulsante"));
		if(giocoAssociazioni.fineGame.attr("sfondoPulsante")!="")
			$("#contentMK4 .pulsRisSuccDD").css("background-color", giocoAssociazioni.fineGame.attr("sfondoPulsante"));
		if(giocoAssociazioni.fineGame.attr("coloreTestoPulsante")!="")
			$("#contentMK4 .pulsRisSuccDD").css("color", giocoAssociazioni.fineGame.attr("coloreTestoPulsante"));
		if(giocoAssociazioni.fineGame.attr("coloreTestoContenuti")!="")
			$("#contentMK4 .titConclusioniDD").css("color", giocoAssociazioni.fineGame.attr("coloreTestoContenuti"));
		if(giocoAssociazioni.fineGame.attr("coloreTestoContenuti")!="")
			$("#contentMK4 .txtConclusioniDD").css("color", giocoAssociazioni.fineGame.attr("coloreTestoContenuti"));
		if(giocoAssociazioni.fineGame.attr("sfondoBox")!="")
			$("#contentMK4 .contTxtConclusioniDD").css("color", giocoAssociazioni.fineGame.attr("sfondoBox"));
		if (giocoAssociazioni.fineGame.attr("etichetta") != "") $("#contentMK4 .titConclusioniDD").focus();else $("#contentMK4 .txtConclusioniDD").focus();
		document.querySelector("#contentMK4 .pulsRiavviaDD").addEventListener("click", riavviaGiocoDD);
		if( giocoAssociazioni.fineGame.attr("presenzaPulsanteRisSucc") == "1" ){
			document.querySelector("#contentMK4 .pulsRisSuccDD").addEventListener("click", risorsaSuccessivaDD);
		}
	  });
	  
	}
}

function riavviaGiocoDD() {
  $("#contentMK4 .conclusione").fadeOut("slow");
  //giocoAssociazioni.primaVolta = true;
  giocoAssociazioni.nrPallinoAttuale = 1;
  giocoAssociazioni.nrSchermata = 0;
  $("#contentMK4 .areaDragSmart").css("marginLeft", "0px");
  giocoAssociazioni.contaDragNavigazione = 0;
  caricaContenutiAssociazioni();
  indicizzaDrag();
} //risorsa successiva


function risorsaSuccessivaDD() {
  app.pillnavigator.tryToGoToNextItemCover();
}

function schermataSuccessivaDD() {
  inibisciDrag();
  
  orientaGameAssociazioni();

  if ($("#contentMK4 .contenitoreDragTab").css("display") == "block") {
    document.querySelector(".contenitoreDragTab #avanza").removeEventListener("click", schermataSuccessivaDD);
  } else {
    document.querySelector("#contentMK4 .areaDragSmart #avanza").removeEventListener("click", schermataSuccessivaDD);
  }

  if (giocoAssociazioni.nrSchermata == giocoAssociazioni.associazioni.find("associazione").length - 1) {
    conclusione();
  } else {
    $("#contentMK4 .areaDropDomanda").css("display", "none");
    giocoAssociazioni.contaDragNavigazione = 0;
    giocoAssociazioni.nrSchermata++;
    giocoAssociazioni.nrPallinoAttuale++;
    giocoAssociazioni.dragSelezionato = 0;
    giocoAssociazioni.targetKeySel = 0;
    caricaContenutiAssociazioni();
	//creaContenutiAssociazioni();
    indicizzaDrag();
  }
}