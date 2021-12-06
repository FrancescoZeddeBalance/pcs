"use strict";

function apriDirectLink(numero){
	// Quando l'utente apre un link viene informato che si sta spostando in una nuova finestra
	//document.getElementById("avvisoNuovaFinestra").setAttribute("role", "alert");
	giocoMappa.directLinkURL = giocoMappa.steps.find("step:eq("+ (giocoMappa.nrPallinoAttuale - 1) +") punto:eq("+(numero-1)+") directLink").text();
	giocoMappa.directLinkType = giocoMappa.steps.find("step:eq("+ (giocoMappa.nrPallinoAttuale - 1) +") punto:eq("+(numero-1)+") directLink").attr("tipo");
	var apriDocumento;
	if(giocoMappa.directLinkType=="url"){
		apriDocumento = window.open( giocoMappa.directLinkURL, '_blank' );
	}
	else{
		apriDocumento = window.open( (giocoMappa.stringaURL + "" + giocoMappa.directLinkURL ), '_blank');
	}
	giocoMappa.puntiVisti[giocoMappa.nrPallinoAttuale - 1][numero - 1] = "1";
	giocoMappa.puntiVistiPrec[giocoMappa.nrPallinoAttuale - 1][numero - 1] = "1";
	var puntoVistoAttuale = "#stepSec" + giocoMappa.nrPallinoAttuale + " #puntoVisto" + giocoMappa.nrPallinoAttuale + "_" + numero;//giocoMappa.indiceBoxAperta;
    $(puntoVistoAttuale).css("visibility", "visible");
}

function apriBoxMapClick(event) {
	$(this).focus();
  //console.log(document.activeElement.className + " -- " + event.target.id);
  if (document.activeElement.className == "pulsanteLente") var indiceimgSelezionata = document.activeElement.id.substring(10);else var indiceimgSelezionata = event.target.id.substring(10);

  giocoMappa.directLink = giocoMappa.steps.find("step:eq("+ (giocoMappa.nrPallinoAttuale - 1) +") punto:eq("+(indiceimgSelezionata-1)+") directLink").attr("presenza");
	if( giocoMappa.directLink != "0" && giocoMappa.directLink){
		/*console.log("linkkkkkkk");*/
		apriDirectLink(indiceimgSelezionata)
	}
	else{
		apriBoxMap(indiceimgSelezionata);
	}
}

function apriBoxMap(quale) {
  giocoMappa.indiceBoxAperta = quale;
  $(".objBox").html("");
  $("#contentMK3 .contentQuizMK3 .contenitorePagine #pulsantieraSmartphone").css("z-index", "-1");
  $("#contentMK3 .contentQuizMK3 #points_leftArrow_nav").css("z-index", "-1");
  $("#contentMK3 .contentQuizMK3 #points_rightArrow_nav").css("z-index", "-1");

  nascondiFrecce();
  inibisciImg();
  var tipoBox;

  for (var i = 0; i < giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto").length; i++) {
    if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("aperturaBox") != "full") {
      if (i != quale - 1) {
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).css("opacity", "0.5");
      } else {
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).css("opacity", "1");
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).css("z-index", "60");
      }
    } else {
      $("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).css("visibility", "hidden");
    }
  }

  var fattoreRidimensionamento = 1024 / $(".ax_current_object_container").width();
  var widthTablet = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg"));
  var heightTablet = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("HareaImg"));

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    var topPuntoCliccato = parseInt($("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("top"));
    var leftPuntoCliccato = parseInt($("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("left"));

    if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("aperturaBox") != "full") {
      var hImg = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("HareaImg"));
      var wImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg");

      if (topPuntoCliccato <= 80) {
        tipoBox = "H";
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("display", "block");

        if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") == "1") {
          $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("top", topPuntoCliccato + hImg + "px");
          topPuntoCliccato = parseInt($("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("top")) + giocoMappa.margintTopPagine + hImg + 20;
        } else {
          $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("top", topPuntoCliccato + 33 + "px");
          topPuntoCliccato = parseInt($("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("top")) + (100 - 30) + giocoMappa.margintTopPagine;
        }

        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("left", leftPuntoCliccato + "px");
      } else if (topPuntoCliccato >= 465) {
        tipoBox = "H";
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaT").css("display", "block");
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaT").css("top", topPuntoCliccato - 40 + "px");
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaT").css("left", leftPuntoCliccato + "px"); //topPuntoCliccato = parseInt($("#punto"+giocoMappa.nrPallinoAttuale+"_"+quale).css("top"))-(248+22)+giocoMappa.margintTopPagine;
      } else if (topPuntoCliccato > 80 && topPuntoCliccato < 465) {
        tipoBox = "V";
        var leftVero = leftPuntoCliccato; //leftPuntoCliccato = ( parseInt(leftPuntoCliccato)-(giocoMappa.larghezzaTotale*(giocoMappa.nrPallinoAttuale-1)) );
		var versoBox = "";
        if (leftPuntoCliccato > 355) {
          versoBox = "SX";
          var nuovaLarghezzaBox = giocoMappa.larghezzaTotale - (giocoMappa.larghezzaTotale - leftPuntoCliccato);
          $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaS").css("display", "block");

          if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") == "1") {
            $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaS").css("top", topPuntoCliccato + (hImg / 2 - 20) + "px");
          } else {
            $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaS").css("top", topPuntoCliccato + "px");
          }

          $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaS").css("left", leftVero - 25 + "px");
          leftPuntoCliccato = leftPuntoCliccato - (328 + 22);
        } else {
          versoBox = "DX"; //$("#stepSec"+giocoMappa.nrPallinoAttuale+" .contboxMappa").css("width",((giocoMappa.larghezzaTotale-leftPuntoCliccato)-35)+"px");

          $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaR").css("display", "block"); //alert((giocoMappa.larghezzaTotale+" - "+leftPuntoCliccato))

          if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") == "1") {
            if ($(".ax_current_object_container").width() > 768) {
              wImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg");
              hImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("HareaImg");
            } else {
              wImg = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg")) / fattoreRidimensionamento; //larghezza img ridotta rispetto al tablet

              hImg = wImg * heightTablet / widthTablet;
            }

            $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaR").css("top", topPuntoCliccato + (hImg / 2 - 20) + "px");
            $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaR").css("left", parseInt(leftVero) + parseInt(wImg) + "px");
            leftPuntoCliccato = parseInt(leftPuntoCliccato) + parseInt(wImg) + 22; //alert(Math.abs(leftPuntoCliccato))
          } else {
            $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaR").css("top", topPuntoCliccato + "px");
            $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaR").css("left", leftVero + 50 + "px");
            leftPuntoCliccato = leftPuntoCliccato + (100 - 28);
          }
        }
      }
    }
  }
  /*else{}*/


  var strImgPunto = "";

  if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") == "1") {
    var nomeImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("imgHtml");
    var altImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("altImg");
    var wImg;
    var hImg;

    if ($(".ax_current_object_container").width() > 768) {
      wImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg");
      hImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("HareaImg");
    } else {
      wImg = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg")) / fattoreRidimensionamento; //larghezza img ridotta rispetto al tablet

      hImg = wImg * heightTablet / widthTablet;
    }

    var strPulsanteLente = "";
    strPulsanteLente += "<div class='pulsanteLente' aria-hidden='true' aria-label='" + giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("img-aria-label") + "' tabindex='-1' role='button' id='pulsante" + giocoMappa.nrPallinoAttuale + "_" + quale + "' style='cursor:pointer;'>";
    strPulsanteLente += "<img alt='" + altImg + "' id='imgPlsnt" + giocoMappa.nrPallinoAttuale + "_" + quale + "' src='" + giocoMappa.stringaURL + "" + nomeImg + "' width='" + wImg + "' height='" + hImg + "'/>";

    strPulsanteLente += "</div>";
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #cella" + giocoMappa.nrPallinoAttuale + "_" + quale).html(strPulsanteLente);
  } else {
    //console.log("****************chiudi la box")
    var altLenteChiudi = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("hotspotChiudiAlt");
    var strChiudiBox = "";
    strChiudiBox += "<div class='pulsChiudiBoxMap' aria-hidden='false' aria-label='" + giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("chiudi-aria-label") + "' tabindex='-1' role='button' id='pulsante" + giocoMappa.nrPallinoAttuale + "_" + quale + "' style='cursor:pointer;' >";

    strChiudiBox += "<svg id='imgPlsnt" + giocoMappa.nrPallinoAttuale + "_" + quale + "' data-name='imgPlsnt" + giocoMappa.nrPallinoAttuale + "_" + quale + "' alt='" + altLenteChiudi + "' xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 23.88 23.88\"><defs><style>.plsCls-1{fill:none;}.plsCls-2{clip-path:url(#clip-path);}.plsCls-3{fill:#d4145a;}.plsCls-4{clip-path:url(#clip-path-2);}.plsCls-5{fill:#fff;fill-rule:evenodd;}</style><clipPath id=\"clip-path\" transform=\"translate(0 -0.12)\"><rect class=\"plsCls-1\" y=\"0.12\" width=\"23.88\" height=\"23.88\"/></clipPath><clipPath id=\"clip-path-2\" transform=\"translate(0 -0.12)\"><rect class=\"plsCls-1\" x=\"5.25\" y=\"5.38\" width=\"13.38\" height=\"13.39\"/></clipPath></defs><g class=\"plsCls-2\"><path class=\"plsCls-3\" d=\"M23.88,12.06A11.94,11.94,0,1,0,11.94,24,11.93,11.93,0,0,0,23.88,12.06\" transform=\"translate(0 -0.12)\"/></g><g class=\"plsCls-4\"><path class=\"plsCls-5\" d=\"M13.51,12.05,18.27,7.3a1.12,1.12,0,1,0-1.59-1.59l-4.75,4.76L7.17,5.71a1.12,1.12,0,0,0-1.59,0,1.14,1.14,0,0,0,0,1.59l4.76,4.75L5.58,16.81A1.12,1.12,0,0,0,7.17,18.4l4.76-4.76,4.75,4.76a1.14,1.14,0,0,0,1.59,0,1.12,1.12,0,0,0,0-1.59Z\" transform=\"translate(0 -0.12)\"/></g></svg>";
    strChiudiBox += "</div>";
	
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #cella" + giocoMappa.nrPallinoAttuale + "_" + quale).html(strChiudiBox);
  }

  var puntoSelezionato = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")"); //inizio costruzione della box

  var strBoxMap = "";

  if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("aperturaBox") != "full") {
    if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
      if (tipoBox == "V") strBoxMap += "<div class='contboxMappa contboxMappaV'>";else strBoxMap += "<div class='contboxMappa contboxMappaH'>";
    } else {
      strBoxMap += "<div class='contboxMappa'>";
    }
  } else {
    //apertura full
    strBoxMap += "<div class='contboxMappaF'>";
    strBoxMap += "<div class='chiudiBoxFull' style='cursor:pointer;' onClick='javascript:chiudiBoxMap(" + quale + ")'><img src='" + giocoMappa.stringaURL + "chiudiB.png'/></div>";
  }

  if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") == "1") {
    if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("aperturaBox") != "full") {
      var altLenteChiudi = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("hotspotChiudiAlt");
      strBoxMap += "<div style='cursor:pointer;position:absolute;right:5px;' id='pulsChiudiBoxMap' class='pulsChiudiBoxMap' tabindex='-1' aria-label='" + giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("chiudi-aria-label") + "' role='button'>";
      strBoxMap += "<svg version=\"1.1\" id=\"svgChiudiBoxMap\" alt='" + altLenteChiudi + "' xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 24 24\" style=\"enable-background:new 0 0 24 24;\" xml:space=\"preserve\"><g><rect x=\"2.4\" y=\"3.4\" class=\"stCB0\" width=\"18.7\" height=\"17.8\"/><g><path class=\"stCB1\" d=\"M21.3,0.1H2.7C1.2,0.1,0,1.3,0,2.7v18.7c0,1.5,1.2,2.7,2.7,2.7h18.7c1.5,0,2.7-1.2,2.7-2.7V2.7			C24,1.3,22.8,0.1,21.3,0.1z M18.7,16.9l-1.9,1.9L12,13.9l-4.8,4.8l-1.9-1.9l4.8-4.8L5.3,7.3l1.9-1.9l4.8,4.8l4.8-4.8l1.9,1.9			l-4.8,4.8L18.7,16.9z\"/></g></g></svg>";
      strBoxMap += "</div>";
    }
  }

  var indicizzaElementiMap = 30; //titolo

  if (puntoSelezionato.attr("titolo") != "") {
    indicizzaElementiMap++;
    strBoxMap += "<div id='titboxMap' class='titboxMap' role='heading' aria-level='2' tabindex='" + indicizzaElementiMap + "'>";
    strBoxMap += "<table width='100%' border='0'><tr><td style='text-align=center;' valign='middle'>" + puntoSelezionato.attr("titolo") + "</td></tr></table>";
    strBoxMap += "</div>";
  } //testo


  if (puntoSelezionato.children("testo").text() != "") {
    indicizzaElementiMap++;
    strBoxMap += "<div id='txtboxMap' class='txtboxMap' tabindex='" + indicizzaElementiMap + "'>";
    strBoxMap += puntoSelezionato.children("testo").text();
    strBoxMap += "</div>";
  } //immagine


  if (puntoSelezionato.children("immagine").text() != "") {
    indicizzaElementiMap++;
    strBoxMap += "<div class='imgboxMappa'>";
    strBoxMap += "<img width=\"320\" height=\"auto\" src='" + giocoMappa.stringaURL + "" + puntoSelezionato.children("immagine").text() + "' tabindex='" + indicizzaElementiMap + "' alt='" + puntoSelezionato.children("immagine").attr("alt") + "'/>";
    strBoxMap += "</div>";
  } //video


  if (puntoSelezionato.children("video").text() != "") {
    indicizzaElementiMap++;
    strBoxMap += "<div class='videoboxMappa' tabindex='" + indicizzaElementiMap + "' aria-label='" + puntoSelezionato.children("video").attr("aria-label") + "'>";
    strBoxMap += "<video width=\"320\" height=\"auto\" controls poster='"+giocoSlider.stringaURL + "/poster.jpg'>";
    strBoxMap += "<source src='" + giocoMappa.stringaURL + "" + puntoSelezionato.children("video").text() + "' type='video/mp4'>";
    strBoxMap += "Your browser does not support the video tag.";
    strBoxMap += "</video>";
    strBoxMap += "</div>";
  } //audio / dispensa


  if (puntoSelezionato.children("audio").text() != "" || puntoSelezionato.children("dispensa").text() != "") {
    strBoxMap += "<div class='contAudioPdfboxMappa'>";

    if (puntoSelezionato.children("audio").text() != "") {
      indicizzaElementiMap++;
      var iconaAudio = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").children("audio").attr("iconaAudio");
      var altIconaAudio = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").children("audio").attr("iconaAudio"); //onClick='javascript:apriAudio("+quale+")'

      strBoxMap += "<div class='contAudioboxMappa' role='button' tabindex='" + indicizzaElementiMap + "' aria-label='" + puntoSelezionato.children("audio").attr("aria-label") + "' >";
      strBoxMap += "<table width='100%' height='100%' border='0'><tr><td valign='middle' align='center'>";
      strBoxMap += "<div class='audioboxMappa'>";
      strBoxMap += "<img alt='" + altIconaAudio + "' src='" + giocoMappa.stringaURL + "" + iconaAudio + "'/>" + " " + giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").children("audio").attr("etichettaAudioPlay");
      strBoxMap += "</div>";
      strBoxMap += "</td></tr></table>";
      strBoxMap += "</div>";
    }

    if (puntoSelezionato.children("dispensa").text() != "") {
      indicizzaElementiMap++;
      strBoxMap += "<div class='contPdfboxMappa' style='background-color:" + puntoSelezionato.children("dispensa").attr("bgetichettaDispensa") + "'><a tabindex='" + indicizzaElementiMap + "' href='" + giocoMappa.stringaURL + "" + puntoSelezionato.children("dispensa").text() + "' target='_blank'>";
      strBoxMap += "<table width='100%' height='100%' border='0'><tr><td valign='middle' align='center'>";
      strBoxMap += "<div class='pdfboxMappa'>";
      strBoxMap += "<img alt='" + puntoSelezionato.children("dispensa").attr("altIconaDispensa") + "' src='" + giocoMappa.stringaURL + "" + puntoSelezionato.children("dispensa").attr("iconaDispensa") + "'/>  " + puntoSelezionato.children("dispensa").attr("etichettaDispensa");
      strBoxMap += "</div>";

      strBoxMap += "</td></tr></table>";
      strBoxMap += "</a></div>";
    }

    strBoxMap += "";
    strBoxMap += "</div>";
  }

  strBoxMap += "</div>"; //console.log(strBoxMap)

  $("#stepSec" + giocoMappa.nrPallinoAttuale + " .objBox").html(strBoxMap);
  if (puntoSelezionato.children("audio").text() != "") document.querySelector("#stepSec" + giocoMappa.nrPallinoAttuale + " .contAudioboxMappa").addEventListener("click", apriAudioMappa); //indicizzo il chiudi come ultima cosa della box

  $("#stepSec" + giocoMappa.nrPallinoAttuale + " .pulsChiudiBoxMap").attr("tabindex", indicizzaElementiMap + 1);
  if(puntoSelezionato.children("audio").attr("bgetichettaAudio")!="")
	$("#stepSec" + giocoMappa.nrPallinoAttuale + " .contAudioboxMappa").css("background-color", puntoSelezionato.children("audio").attr("bgetichettaAudio"));
  if(puntoSelezionato.children("dispensa").attr("bgetichettaDispensa")!="")
	$("#stepSec" + giocoMappa.nrPallinoAttuale + " .contPdfboxMappa").css("background-color", puntoSelezionato.children("dispensa").attr("bgetichettaDispensa"));

  $("#stepSec" + giocoMappa.nrPallinoAttuale + " .sfondoBox").css("display", "block");
  $("#stepSec" + giocoMappa.nrPallinoAttuale + " .sfondoBox .contboxMappa").css("display", "block"); //$(".sfondoBox  .contboxMappa").css("opacity",1);
  //var altezzaInnerHeight = $("#contentMK3 .objBox .contboxMappa").innerHeight();
	var altezzaInnerHeight;
  $("#stepSec" + giocoMappa.nrPallinoAttuale + " .objBox").css("z-index", 55);

  if (puntoSelezionato.children("testo").text() != "") {}

  if (puntoSelezionato.children("immagine").text() != "") {
    if (tipoBox == "H" || giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("aperturaBox") == "full") {
      $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .txtboxMap").css("width", "50%");
      $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .txtboxMap").css("float", "left");
      $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .imgBoxMappa").css("width", "50%");
      $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .imgBoxMappa").css("float", "left");

    }
  }

  if (puntoSelezionato.children("video").text() != "") {
    if (tipoBox == "H" || giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("aperturaBox") == "full") {
      $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .txtboxMap").css("width", "50%");
      $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .txtboxMap").css("float", "left");
      $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .videoBoxMappa").css("width", "50%");
      $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .videoBoxMappa").css("float", "left"); //if(!app.global.IS_SMARTPHONE){

      if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
        if (puntoSelezionato.children("dispensa").text() == "" && puntoSelezionato.children("audio").text() == "") {
          $("#contentMK3 .objBox .txtboxMap").css("height", "74%");
          $("#contentMK3 .objBox .videoBoxMappa").css("height", "74%");
        } else {
          $("#contentMK3 .objBox .txtboxMap").css("height", "65%");
          $("#contentMK3 .objBox .videoBoxMappa").css("height", "65%");
        }
      }
    }
  }

  if (puntoSelezionato.children("immagine").text() == "" && puntoSelezionato.children("video").text() == "") {
    if (puntoSelezionato.children("dispensa").text() == "" && puntoSelezionato.children("audio").text() == "") {
      if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
        if ($("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").hasClass("contboxMappaV")) {
          $("#contentMK3 .objBox .txtboxMap").css("height", "85%");
        } else {
          $("#contentMK3 .objBox .txtboxMap").css("height", "73%");
        }
      }
    } else {
      //if(!app.global.IS_SMARTPHONE){
      if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
        if ($("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").hasClass("contboxMappaV")) {
          $("#contentMK3 .objBox .txtboxMap").css("height", "73%");
        } else {
          $("#contentMK3 .objBox .txtboxMap").css("height", "62%");
        }
      }
    }
  }

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .titboxMap").css("marginTop", puntoSelezionato.attr("titoloMarginTop"));
	if(puntoSelezionato.attr("titoloSize")!="")
		$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .titboxMap table tr td").css("fontSize", puntoSelezionato.attr("titoloSize"));
	if(puntoSelezionato.attr("titoloLineHeight")!="")
		$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .titboxMap table tr td").css("lineHeight", puntoSelezionato.attr("titoloLineHeight"));
	if(puntoSelezionato.children("testo").attr("txtboxSize")!="")
		$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .txtboxMap").css("fontSize", puntoSelezionato.children("testo").attr("txtboxSize"));
	if(puntoSelezionato.children("testo").attr("txtboxLineHeight")!="")
		$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .txtboxMap").css("lineHeight", puntoSelezionato.children("testo").attr("txtboxLineHeight"));
    var altezzaInnerHeightH = $("#contentMK3 .objBox .contboxMappaH").innerHeight();

    if (tipoBox == "H") {
      //console.log( altezzaInnerHeightH )
      if (topPuntoCliccato >= 465) {
        topPuntoCliccato = parseInt($("#punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("top")) - parseInt($("#contentMK3 .objBox .contboxMappaH").innerHeight()) - 21;
      }

      $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").css("top", topPuntoCliccato + "px");
    }

    if (tipoBox == "V") {
      //$(".contboxMappa").css("left",leftPuntoCliccato+"px");
      if (versoBox == "SX") {
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").css("width", nuovaLarghezzaBox - 26 + "px");
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").css("left", "5px");
      } else {
        //alert()
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").css("width", giocoMappa.larghezzaTotale - Math.abs(leftPuntoCliccato) - 5 + "px");
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").css("left", Math.abs(leftPuntoCliccato) + "px");
      }

      $("#stepSec" + giocoMappa.nrPallinoAttuale + " .imgboxMappa img").css("height", "170px");
      var margintopbox;
      altezzaInnerHeight = $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .contboxMappa").innerHeight();

      if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") == "1") {
        if (altezzaInnerHeight <= 520) {
          margintopbox = topPuntoCliccato + hImg / 2 - altezzaInnerHeight / 2;
        } else {
          margintopbox = 10;
        }
      } else {
        margintopbox = topPuntoCliccato + 50 / 2 - altezzaInnerHeight / 2;
      }

      if (margintopbox <= 5) $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").css("top", "5px");else $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").css("top", margintopbox + "px");

      if (altezzaInnerHeight > 580) {
        $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .contboxMappa").css("height", "570px");
        if (puntoSelezionato.children("immagine").text() == "" && puntoSelezionato.children("video").text() == "") $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .contboxMappa .txtboxMap").css("height", "500px");else $("#stepSec" + giocoMappa.nrPallinoAttuale + " .txtboxMap").css("height", "280px");
      }

    }
  } else {
    var fattoreRidimensionamento = 1024 / $(".ax_current_object_container").width();
    altezzaInnerHeight = $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .objBox .contboxMappa").innerHeight();
    var altezzaIngombroSmart = $(".ax_current_object_container").height();

    var widthTablet = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg"));
    var heightTablet = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("HareaImg"));
    var topPuntoCliccatoSm = parseInt($("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("top"));
    var leftPuntoCliccatoSm = parseInt($("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("left"));
    var topPuntoVeroSm = parseInt($("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("top"));
    var leftPuntoVeroSm = parseInt($("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("left"));
    var calcoloAltezzaBoxSmartphone;

    if (topPuntoCliccatoSm >= 180) {
      $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaT").css("display", "block");

      if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") == "1") {
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaT").css("top", topPuntoVeroSm - 20 + "px");
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaT").css("left", leftPuntoVeroSm + 14 + "px");
      } else {
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaT").css("top", topPuntoVeroSm - 31 + "px");
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaT").css("left", leftPuntoVeroSm + 2 + "px");
      }

      calcoloAltezzaBoxSmartphone = topPuntoVeroSm - 30;

      topPuntoCliccatoSm = parseInt($("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("top")) - (calcoloAltezzaBoxSmartphone + 22);
    } else {
      wImg = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg")) / fattoreRidimensionamento; //larghezza img ridotta rispetto al tablet

      hImg = wImg * heightTablet / widthTablet;

      if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("aperturaBox") != "full") {
        $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("display", "block");

        if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") == "1") {
          var nomeImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("imgHtml");
          topPuntoCliccatoSm = parseInt($("#punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("top")) + hImg + 22;
          $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("top", topPuntoVeroSm + hImg + 5 + "px");
          $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("left", leftPuntoVeroSm + 14 + "px");
          calcoloAltezzaBoxSmartphone = altezzaIngombroSmart - (topPuntoVeroSm + hImg + 30);
        } else {
          topPuntoCliccatoSm = parseInt($("#punto" + giocoMappa.nrPallinoAttuale + "_" + quale).css("top")) + 72;
          $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("top", topPuntoVeroSm + 55 + "px");
          $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("left", leftPuntoVeroSm + 2 + "px");
          calcoloAltezzaBoxSmartphone = altezzaIngombroSmart - (topPuntoVeroSm + 75);
        }
      }
    }

    $(".contboxMappa").css("height", calcoloAltezzaBoxSmartphone + "px");

    $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").css("marginLeft", "10px");
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappa").css("top", topPuntoCliccatoSm + "px");
  }

  $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappaF").css("height", parseInt($(".contentQuizMK3").css("height")) - 20 + "px");
  $("#stepSec" + giocoMappa.nrPallinoAttuale + " .contboxMappaF").css("margin-top", "5px");
  $("#stepSec" + giocoMappa.nrPallinoAttuale + " .objBox").animate({
    opacity: 1,
    left: "+=50" //height: altezzaInnerHeight

  }, 500, function () {// Animation complete.
  }); //focus

  if (puntoSelezionato.attr("titolo") != "") {
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #titboxMap").focus();
  } else {
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #txtboxMap").focus();
  }
  
  //console.log( "#stepSec" + giocoMappa.nrPallinoAttuale + " .pulsChiudiBoxMap" )

  document.querySelector("#stepSec" + giocoMappa.nrPallinoAttuale + " .pulsChiudiBoxMap").addEventListener("click", chiudiBoxMapClick);
}

function chiudiBoxMapClick() {
  chiudiBoxMap(giocoMappa.indiceBoxAperta);
}

function chiudiBoxMap(quale) {
  giocoMappa.puntiVisti[giocoMappa.nrPallinoAttuale - 1][quale - 1] = "1";
  giocoMappa.puntiVistiPrec[giocoMappa.nrPallinoAttuale - 1][quale - 1] = "1";
  $("#contentMK3 .contentQuizMK3 .contenitorePagine #pulsantieraSmartphone").css("z-index", "1");
  $("#contentMK3 .contentQuizMK3 #points_leftArrow_nav").css("z-index", "1");
  $("#contentMK3 .contentQuizMK3 #points_rightArrow_nav").css("z-index", "1"); //$(".sfondoBox").fadeOut("slow", function() {

  $("#stepSec" + giocoMappa.nrPallinoAttuale + " .objBox").animate({
    opacity: 0,
    left: "+=50" //height: altezzaInnerHeight

  }, 500, function () {
    nascondiFrecce();
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " .sfondoBox").css("display", "none");
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " .objBox").html("");
    var quantiPunti = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto").length;

    for (var i = 0; i < quantiPunti; i++) {
      $("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).css("opacity", "1");
      $("#stepSec" + giocoMappa.nrPallinoAttuale + " #punto" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).css("z-index", "10");
    }

    if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") == "1") {
      var nomeImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("imgHtml");
      var altImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("altImg");
      var wImg;
      var hImg; //if( (!app.global.IS_SMARTPHONE)||($(".ax_current_object_container").width()>=768) ){

      if ($(".ax_current_object_container").width() > 768) {
        wImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg");
        hImg = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("HareaImg");
      } else {
        wImg = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("WareaImg")) - 60;
        hImg = parseInt(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("HareaImg")) - 60;
      }
    } else {
      var iconaHS = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot");
      var ariaLabelPunto = giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("img-aria-label");
      var strPlsLente = "";
      strPlsLente += "<div id='pulsante" + giocoMappa.nrPallinoAttuale + "_" + quale + "' aria-hidden='true' tabindex='-1' aria-label='" + ariaLabelPunto + "' role='button' class='pulsanteLente' style='cursor:pointer;' >"; //strPlsLente += "<img alt='"+altImg+"' id='imgPlsnt"+giocoMappa.nrPallinoAttuale+"_"+quale+"' src='"+giocoMappa.stringaURL + "icona"+iconaHS+".png'/></div>";

      strPlsLente += "<svg id='imgPlsnt" + giocoMappa.nrPallinoAttuale + "_" + quale + "' alt='" + altImg + "' data-name='imgPlsnt" + giocoMappa.nrPallinoAttuale + "_" + quale + "' xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 24 24\"><defs><style>.plsLnt-1{fill:none;}.plsLnt-2{opacity:0.5;}.plsLnt-3{clip-path:url(#clip-path);}.plsLnt-4{fill:#d4145a;}.plsLnt-5{fill:#fff;}</style><clipPath id=\"clip-path\" transform=\"translate(0 0)\"><rect class=\"plsLnt-1\" width=\"24\" height=\"24\"/></clipPath></defs><g class=\"plsLnt-2\"><g class=\"plsLnt-3\"><path class=\"plsLnt-4\" d=\"M12,24A12,12,0,1,0,0,12,12,12,0,0,0,12,24\" transform=\"translate(0 0)\"/></g></g><path class=\"plsLnt-5\" d=\"M5.46,19.64,7.4,17.71l1.54-1.55a6.77,6.77,0,0,0,4,1.27,6.84,6.84,0,1,0-6.84-6.84,6.76,6.76,0,0,0,1.44,4.18L4.84,17.42l-.09.11-.7.7Zm2.2-9a5.24,5.24,0,1,1,2,4.14A5.75,5.75,0,0,1,8.9,14a5.22,5.22,0,0,1-1.24-3.38\" transform=\"translate(0 0)\"/></svg>";
      strPlsLente += "</div>";
      $("#stepSec" + giocoMappa.nrPallinoAttuale + " #cella" + giocoMappa.nrPallinoAttuale + "_" + quale).html(strPlsLente);
    }

    giocoMappa.strPuntiVisti = "";

    for (var p = 1; p <= quantiPunti; p++) {
      if (giocoMappa.puntiVisti[giocoMappa.nrPallinoAttuale - 1][p - 1] == "1") giocoMappa.strPuntiVisti += "1";else giocoMappa.strPuntiVisti += "0";
    }

    if (giocoMappa.strPuntiVisti.indexOf("0") == -1) {
      giocoMappa.schermateViste[giocoMappa.nrPallinoAttuale - 1] = "1";

      controllaConclusioneMappa();
    }

    var puntoVistoAttuale = "#stepSec" + giocoMappa.nrPallinoAttuale + " #puntoVisto" + giocoMappa.nrPallinoAttuale + "_" + giocoMappa.indiceBoxAperta;
    $(puntoVistoAttuale).css("visibility", "visible");

    if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").attr("iconaHotspot") != "1") {
      //console.log("------------------------------")
      $(puntoVistoAttuale).css("top", "-15px");
      $(puntoVistoAttuale).css("right", "-10px");
    }

    indicizzaImgMappa();
    $("#pulsante" + giocoMappa.nrPallinoAttuale + "_" + giocoMappa.indiceBoxAperta).focus();
  });
}

function controllaConclusioneMappa() {
  var strConclusione = "";

  for (var i = 0; i < giocoMappa.steps.find("step").length; i++) {
    if (giocoMappa.schermateViste[i] == "1") strConclusione += "1";else strConclusione += "0";
  }

  if (giocoMappa.nrPallinoAttuale == giocoMappa.steps.find("step").length) {
    //tracciamento completato
    app.main.tracer.completeCurrentItem();
	
	if(giocoMappa.mostraBoxFinale=="true"){
	
		var indiceElementi = 30;

		if (giocoMappa.fineGame.attr("mostrami") != "false") {
		  strConclusione = "";

		  $(".contTxtConclusioni").attr("tabindex", indiceElementi);

		  if (giocoMappa.fineGame.attr("etichetta") != "") {
			indiceElementi++;
			$("#titConclusioni").html(giocoMappa.fineGame.attr("etichetta"));
			$("#titConclusioni").attr("tabindex", indiceElementi);
		  }

		  indiceElementi++;
		  $("#txtConclusioni").html(giocoMappa.fineGame.text());
		  $("#txtConclusioni").attr("tabindex", indiceElementi);
		  indiceElementi++;
		  $(".pulsRiavviaMappa").html(giocoMappa.fineGame.attr("pulsanteRiavvia"));
		  $(".pulsRiavviaMappa").attr("tabindex", indiceElementi);
		  $(".pulsRiavviaMappa").attr("aria-label", giocoMappa.fineGame.attr("aria-label-pulsante"));

		  if(giocoMappa.fineGame.attr("presenzaPulsanteRisSucc") == "1" ){
			  indiceElementi++;
			  $(".pulsRisSuccMappa").html(giocoMappa.fineGame.attr("pulsanteRisSucc"));
			  $(".pulsRisSuccMappa").attr("tabindex", indiceElementi);
			  $(".pulsRisSuccMappa").attr("aria-label", giocoMappa.fineGame.attr("aria-label-pulsanteRisSucc"));
		  }
		  $(".conclusioneMappa").fadeIn("slow", function () {
			// Animation complete
			inibisciImg(); //tolgo i tabindex e gli eventi da tutte le img
			//formattazione da xml
			if(giocoMappa.fineGame.attr("sfondoPulsante")!="")
				$(".pulsRiavviaMappa").css("background-color", giocoMappa.fineGame.attr("sfondoPulsante"));
			if(giocoMappa.fineGame.attr("coloreTestoPulsante")!="")
				$(".pulsRiavviaMappa").css("color", giocoMappa.fineGame.attr("coloreTestoPulsante"));
			if(giocoMappa.fineGame.attr("presenzaPulsanteRisSucc") == "1" ){
				$(".pulsRisSuccMappa").css("display","inline");
				if(giocoMappa.fineGame.attr("sfondoPulsante")!="")
					$(".pulsRisSuccMappa").css("background-color", giocoMappa.fineGame.attr("sfondoPulsante"));
				if(giocoMappa.fineGame.attr("coloreTestoPulsante")!="")
					$(".pulsRisSuccMappa").css("color", giocoMappa.fineGame.attr("coloreTestoPulsante"));
			}
			else{
				$(".pulsRisSuccMappa").css("display","none");
			}
			
			if(giocoMappa.fineGame.attr("coloreTestoContenuti")!=""){
				$(".titConclusioni").css("color", giocoMappa.fineGame.attr("coloreTestoContenuti"));
				$(".txtConclusioni").css("color", giocoMappa.fineGame.attr("coloreTestoContenuti"));
			}
			if(giocoMappa.fineGame.attr("sfondoBox")!="")
				$(".contTxtConclusioni").css("color", giocoMappa.fineGame.attr("sfondoBox"));
			if (giocoMappa.fineGame.attr("etichetta") != "") $(".titConclusioni").focus();else $(".txtConclusioni").focus(); //document.querySelector(".pulsRiavviaMappa").addEventListener("click",riavviaMappa);
			if(giocoMappa.fineGame.attr("presenzaPulsanteRisSucc") == "1" ){
				document.querySelector(".pulsRisSuccMappa").addEventListener("click", risorsaSuccessivaMappa);
			}
		  });
		}
	
	}
	
	
	
  }
} //risorsa successiva


function risorsaSuccessivaMappa() {
  app.pillnavigator.tryToGoToNextItemCover();
}

function riavviaMappa() {
  $(".conclusioneMappa").fadeOut("slow");

  for (var i = 0; i < giocoMappa.steps.find("step").length; i++) {
    giocoMappa.schermateViste[i] = 0;
    giocoMappa.puntiVisti[i] = new Array();
    giocoMappa.puntiVistiPrec[i] = new Array();

    for (var z = 0; z < giocoMappa.steps.find("step:eq(" + i + ")").children("punto").length; z++) {
      giocoMappa.puntiVisti[i][z] = "0";
      giocoMappa.puntiVistiPrec[i][z] = "0";
    }
  }

  if (giocoMappa.steps.find("step").length == 1) {
    //strConclusione = "";
    giocoMappa.nrPallinoAttuale = 1; //nrSchermata = 0;

    giocoMappa.contaDragNavigazione = 0;
    giocoMappa.margintTopPagine = 0;
    creaContenutiMappa();
  }
}