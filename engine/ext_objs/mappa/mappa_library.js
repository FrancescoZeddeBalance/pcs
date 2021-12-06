"use strict";

var giocoMappa = {
  steps: "",
  step: 0,
  fineGame: "",
  boxHelp: "",
  boxHelpSmart: "",
  strPunti: "",
  stringaURL: "",
  indiceBoxAperta: "",
  strPuntiVisti: "",
  nrPallinoAttuale: 1,
  nrPallini: 0,
  larghezzaTotale: 0,
  altezzaTotale: 0,
  margintTopPagine: 0,
  contaDragNavigazione: 0,
  puntiVisti: new Array(),
  puntiVistiPrec: new Array(),
  schermateViste: new Array(),
  mostrami: "",
  mostraBoxFinale: "",
  primaVolta: true,
  directLink:"0",
  directLinkType:"",
  directLinkURL:""
};

function mappa_initFunction(contenutiMappa, folderReference) {
  //app.lib.debugOnConsole("INIT :::mappa:::");
  giocoMappa.steps = contenutiMappa.find("steps");
  giocoMappa.boxHelp = contenutiMappa.find("boxHelp");
  //giocoMappa.primaVolta = true;
  giocoMappa.boxHelpSmart = contenutiMappa.find("boxHelpSmart");
  giocoMappa.fineGame = contenutiMappa.find("fineGame");
  giocoMappa.stringaURL = folderReference;
  
  if(contenutiMappa.find("fineGame").attr("mostrami")){
	  //è presente attributo "mostrami"
	  if(contenutiMappa.find("fineGame").attr("mostrami")=="true")
		giocoMappa.mostraBoxFinale="true";
	  else
		giocoMappa.mostraBoxFinale="false";
  }
  else{
	  giocoMappa.mostraBoxFinale="true";
  }
  
  var objectHtmlContainer = "\n\t\t\t<div id=\"contentMK3\">\n\t\t\t\t<div class=\"conclusioneMappa\">\n\t\t\t\t\t<div class='contTxtConclusioni' role='dialog' aria-labelledby='titConclusioni' aria-describedby='txtConclusioni' tabindex='-1'>\n\t\t\t\t\t\t<div id='titConclusioni' class='titConclusioni' tabindex='-1'></div>\n\t\t\t\t\t\t<hr class='hrConclusione'>\n\t\t\t\t\t\t<div id='txtConclusioni' class='txtConclusioni' tabindex='-1'></div>\n\t\t\t\t\t\t<div class='contPulsRiavviaMappa'>\n\t\t\t\t\t\t\t<div class='pulsRiavviaMappa' tabindex='-1' role='button' aria-label=''></div>\n\t\t\t\t\t\t\t<div class='pulsRisSuccMappa' tabindex='-1' role='button' aria-label=''></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"boxHelp\" role=\"dialog\" aria-labelledby=\"etichettaHelp\" aria-describedby=\"txtboxHelp\"></div>\n\t\t\t\t<div class=\"contentQuizMK3\">\n\t\t\t\t\t<!--<div class=\"sfondoBox\"><div class=\"objBox\" role=\"dialog\" aria-labelledby=\"titboxMap\" aria-describedby=\"txtboxMap\" tabindex=\"-1\"></div></div>-->\n\t\t\t\t\t<div class=\"contenitorePagine\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"; /// Adding HTML to object container

  $(".ax_box_pill_container .ax_current_object_container").html(objectHtmlContainer); /// Listen to keyboard navigationsss

  $(document).on("keydown", function (e) {
    /// ESC to exit
    if (e.which == 27) {
      $("#ax_desktop_header_icon_id_" + app.global.CURRENT_OBJECT_INDEX + ".ax_desktop_header_icon").click();
    }


    if (e.which == 13 || e.which == 32) {
      if (document.activeElement.className == "chiudiBoxHelpMappa") {
        chiudiBoxHelpMappa();
      }

      if (document.activeElement.className == "pulsChiudiBoxMap") {
        chiudiBoxMap(giocoMappa.indiceBoxAperta);
      }

      if (document.activeElement.className == "pulsanteLente") {
        var indiceimgSelezionata = parseInt(document.activeElement.id.substring(10));
		giocoMappa.directLink = giocoMappa.steps.find("step:eq("+ (giocoMappa.nrPallinoAttuale - 1) +") punto:eq("+(indiceimgSelezionata-1)+") directLink").attr("presenza");
		if( giocoMappa.directLink != "0" ){
			apriDirectLink(indiceimgSelezionata)
		}
		else{
			apriBoxMap(indiceimgSelezionata);
		}
        //apriBoxMap(indiceimgSelezionata);
      }

      if (document.activeElement.className == "contAudioboxMappa") {
        apriAudioMappa();
      }

      if (document.activeElement.className == "pulsRiavviaMappa") {
        if (giocoMappa.steps.find("step").length > 1) {
          slideAnim("resetta_slider");
        } else {
          riavviaMappa();
        }
      }

      if (document.activeElement.className == "pulsRisSuccMappa") {
        risorsaSuccessivaMappa();
      }

      if (document.activeElement.id == "points_rightArrow_nav") {
        _slideAnim("keyboard_forward");
      }

      if (document.activeElement.id == "points_leftArrow_nav") {
        _slideAnim("keyboard_back");
      }

    }
  });
  resettaVariabili();
  caricaContenutiGiocoMappa();

  if (giocoMappa.steps.find("step").length > 1) {
    /// main action check which of the 4 types of interaction called the function
    var _slideAnim = function _slideAnim(e) {
      inibisciImg();
      oldSlide = activeSlide; //$("#card"+gioco.primaCardSchermataCorrente).focus();
      /// dragging the panels

      if (e == "keyboard_back" || e == "keyboard_forward" || e == "resetta_slider") {
        if (e == "keyboard_back") {
          activeSlide -= 1;
        } else {
          activeSlide += 1;
        }

        if (e == "resetta_slider") {
          activeSlide = 0;
          riavviaMappa();
        }
      } else if (this.id === "dragger") {
        activeSlide = offsets.indexOf(this.endX); //console.log("----------------2: "+activeSlide);
      } else {
        if (TweenMax.isTweening(containerMk3)) {
          return;
        } /// arrow clicks


        if (this.id === "points_leftArrow_nav" || this.id === "points_rightArrow_nav") {
          activeSlide = this.id === "points_rightArrow_nav" ? activeSlide += 1 : activeSlide -= 1;
        } else if (this.className === "pulsRiavviaMappa") {
          activeSlide = 0;
          riavviaMappa(); //giocoMappa.nrPallinoAttuale = 1;
          /// click on a dot
        } else if (this.className === "cards_dot") {
          activeSlide = this.index; //console.log("----------------1: "+activeSlide);
          /// scrollwheel
        } else {
          activeSlide = e.deltaY > 0 ? activeSlide += 1 : activeSlide -= 1;
        }
      } /// make sure we're not past the end or beginning slide


      activeSlide = activeSlide < 0 ? 0 : activeSlide;
      activeSlide = activeSlide > slides.length - 1 ? slides.length - 1 : activeSlide;

      if (oldSlide === activeSlide) {
        return;
      } /// eventually fire the object completion


      $(".points_arrow_nav").show();

      if (activeSlide == slides.length - 1) {
        $("#points_rightArrow_nav").hide(); //app.main.tracer.completeCurrentItem(); 
      } else if (activeSlide == 0) {
        $("#points_leftArrow_nav").hide();
      } //gioco.paginaCorrente = activeSlide;		  
      /// aria-hidden and tab navigation switch
      /// if we're dragging we don't animate the container


      if (typeof this === "undefined" || this.id != "dragger") {
        TweenMax.to(containerMk3, dur, {
          x: offsets[activeSlide],
          onUpdate: tweenDot
        });
      }

      giocoMappa.nrPallinoAttualeSmart = activeSlide + 1;
      giocoMappa.nrPallinoAttuale = activeSlide + 1;
	  
	  if(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("coloreSfondo")!="")
		$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + "").css("background-color", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("coloreSfondo"));
	  
	  if(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("coloreIstruzioni")!="")
		$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .istruzioniMappa").css("color", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("coloreIstruzioni"));

      if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
        $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .istruzioniMappa").css("top", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("topIstruzioni"));
		
		if(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("sizeIstruzioni")!="")
			$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .istruzioniMappa").css("fontSize", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("sizeIstruzioni"));
		if(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("lineHeight")!="")
			$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .istruzioniMappa").css("lineHeight", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("lineHeight"));
      } //console.log("----******----")


      indicizzaImgMappa();
    }; // update the draggable element snap points


    var sizeItCard = function sizeItCard() {
      offsets = []; //iw = 1024;

      iw = $(".ax_current_object_container").width(); //console.log("slides: "+slides.length)

      TweenMax.set(".paginaPunti", {
        width: slides.length * iw + 100
      });
      TweenMax.set(slides, {
        width: iw
      });

      for (var _i2 = 0; _i2 < slides.length; _i2++) {
        //offsets.push(-slides[i].offsetLeft);
        offsets.push(-(iw * _i2));
      }

      TweenMax.set(containerMk3, {
        x: offsets[activeSlide]
      });
    };

    //window.addEventListener("resize", sizeIt);
    // update dot animation when dragger moves
    var tweenDot = function tweenDot() {
      TweenMax.set(dotAnim, {
        time: Math.abs(containerMk3._gsTransform.x / iw) + 1
      });

      if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("istruzioni") != "") {
        $("#contentMK3 .contentQuizMK3 .contenitorePagine #stepSec" + giocoMappa.nrPallinoAttuale + " #istruzioniMappa").focus();
      } else {
        $("#pulsante" + giocoMappa.nrPallinoAttuale + "_1").focus();
      }
    }; //}


    //slider gsap
    /// Draggable			
    var dur = 0.3;
	if(!app.global.GLOBAL_PILL_ANIMATION){dur=0.001;}
    var offsets = [];
    var oldSlide = 0;
    var activeSlide = 0;
    var navpunti_dots = []; //var iw = 1024;

    var iw = $(".ax_current_object_container").width();
    var slides = document.querySelectorAll(".sectionPaginaPunti");
    var containerMk3 = document.querySelector(".paginaPunti");
    var punti_dots = document.querySelector("#contPallini");
    document.querySelector("#points_leftArrow_nav").addEventListener("click", _slideAnim);
    document.querySelector("#points_rightArrow_nav").addEventListener("click", _slideAnim);
    document.querySelector(".pulsRiavviaMappa").addEventListener("click", _slideAnim); // set slides background colors and create the nav punti_dots

    for (var _i = 0; _i < slides.length; _i++) {
      //TweenMax.set(slides[i], { backgroundColor: colorArray[i] });
      var newDot = document.createElement("div");
      newDot.className = "cards_dot";
      $(newDot).attr("tabindex", "-1");
      newDot.id = "pallino" + _i;
      newDot.index = _i;
      navpunti_dots.push(newDot);
      newDot.addEventListener("click", _slideAnim);
      punti_dots.appendChild(newDot);
    } // get elements positioned
    //TweenMax.set("#contPallini, .cards_titleWrap", {xPercent:-50});


    TweenMax.set(".points_arrow_nav", {
      yPercent: -50
    });
    TweenMax.set(".cards_title", {
      y: 30
    }); // lower screen animation with nav punti_dots and rotating titles

    var dotAnim = new TimelineMax({
      paused: true
    });
    dotAnim.staggerTo(".cards_dot", 1, {
      scale: 1,
      backgroundColor: '#464646',
      border: '1px solid #FFFFFF',
	  boxShadow: '0 0 0 2px #999999',
      rotation: 0.1,
      yoyo: true,
      repeat: 1,
      ease: Linear.easeNone
    }, 1); //dotAnim.staggerTo(".cards_dot", 1, {scale:2.1,  rotation:0.1, yoyo:true, repeat:1, ease:Linear.easeNone}, 1);
    //dotAnim.to(".cards_title", slides.length + 1, {y:-(slides.length*30), rotation:0.01, ease:Linear.easeNone}, 0);

    dotAnim.time(1);

    sizeItCard();
    TweenMax.set(".contentQuizMK3", {
      opacity: 1
    }); //window.addEventListener("wheel", slideAnim);

    $("#points_leftArrow_nav").hide();
  } else {
    $(".points_arrow_nav").hide();
    document.querySelector(".pulsRiavviaMappa").addEventListener("click", riavviaMappa);
  } /// complete at start
  //app.main.tracer.completeCurrentItem();	
  /// start animation
  //mappa_animateThisBoxInLibrary(".ext_animated_box");
  //sliderGsap();

}

function resettaVariabili() {
  giocoMappa.step = 0;
  giocoMappa.nrPallinoAttuale = 1;
  $("#contPallini").html("");
}

function creaContenutiMappa() {
  nascondiFrecce();
  //oldSlide = 0;
  //activeSlide = 0;
  //giocoMappa.steps
  /*font e dimensione di riferimento*/
  if(giocoMappa.steps.attr("fontFamily")!="")
	$("#contentMK3").css("font-family",giocoMappa.steps.attr("fontFamily"));
  if(giocoMappa.steps.attr("fontSize")!="")
	$("#contentMK3").css("font-size",giocoMappa.steps.attr("fontSize"));
  var strPagPunti = "";
  strPagPunti += "<div class='paginaPunti'>";

  for (var i = 0; i < giocoMappa.steps.find("step").length; i++) {
    strPagPunti += "<section id='stepSec" + (i + 1) + "' class='sectionPaginaPunti'>"; //immagine di sfondo step

    strPagPunti += "<div class=\"sfondoBox\"><div id=\"objBox" + (i + 1) + "\" class=\"objBox\" role=\"dialog\" aria-labelledby=\"titboxMap\" aria-describedby=\"txtboxMap\" tabindex=\"-1\"></div></div>";
    strPagPunti += "<div id='istruzioniMappa' class='istruzioniMappa' tabindex='-1' aria-label='" + giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").text() + "'>" + giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").text() + "</div>";

    for (var z = 0; z < giocoMappa.steps.find("step:eq(" + i + ")").children("punto").length; z++) {
      giocoMappa.puntiVisti[i][z] = "0";
    }

    if (giocoMappa.steps.find("step:eq(" + i + ")").attr("sfondoImg") != "") {
      strPagPunti += "<div class=\"imgSfondoStep\">";

      if (app.global.IS_SMARTPHONE) {
        //console.log("-------------------------------------smartphone--------------------------------------")
        strPagPunti += "<table width='100%' height='350px' border='0' cellspacing='0' cellpadding='0'><tr><td align='center'><img class='immagineSfondo' alt='" + giocoMappa.steps.find("step:eq(" + i + ")").attr("txtAltSfondo") + "' tabindex='-1' height='auto' src='" + giocoMappa.stringaURL + "" + giocoMappa.steps.find("step:eq(" + i + ")").attr("sfondoImg") + "'/></td></tr></table>";
      } else {
        //console.log("-------------------------------------tablet--------------------------------------")
        strPagPunti += "<table width='100%' border='0' align='center' cellspacing='0' cellpadding='0'><tr><td align='center'><img class='immagineSfondo' alt='" + giocoMappa.steps.find("step:eq(" + i + ")").attr("txtAltSfondo") + "' tabindex='-1'  width='auto' height='100%' src='" + giocoMappa.stringaURL + "" + giocoMappa.steps.find("step:eq(" + i + ")").attr("sfondoImg") + "'/></td></tr></table>"; //immagine sfondo come background
      }

      strPagPunti += "</div>";
    }

    strPagPunti += "<div id=\"ip" + (i + 1) + "\" class=\"inserisciPunti\"></div>";
    strPagPunti += "</section>";
  }

  strPagPunti += "</div>"; //lettore audio

  strPagPunti += "<audio id=\"lettoreAudio\">";
  strPagPunti += "<source src=\"\" type=\"audio/mpeg\">";
  strPagPunti += "Your browser does not support the audio element.";
  strPagPunti += "</audio>";

  strPagPunti += "<nav id=\"points_leftArrow_nav\" class=\"points_arrow_nav\" tabindex=\"-1\" aria-label=" + app.labels.nav_backward + ">";
  //strPagPunti += "<svg style='transform: scale(-1,1);' role=\"link\" aria-label=" + app.labels.nav_backward + " id=\"cards_leftArrow\" class=\"points_arrow\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 23 37.22\"><g id=\"Livello_2\" data-name=\"Livello 2\"><g id=\"Livello_9\" data-name=\"Livello 9\"><polygon class=\"mappa_cls-1\" points=\"4.39 0 0 4.39 14.22 18.61 0 32.83 4.39 37.22 23 18.61 4.39 0\"/></g></g></svg>";
  strPagPunti += "<img src=\"./engine/icons/chevron_left_24px.svg\" />";
  strPagPunti += "</nav>"; //31

  strPagPunti += "<nav id=\"points_rightArrow_nav\" class=\"points_arrow_nav\" tabindex=\"-1\" aria-label="+app.labels.nav_forward+">";
  //strPagPunti += "<svg role=\"link\" aria-label=" + app.labels.nav_backward + " id=\"cards_leftArrow\" class=\"points_arrow\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 23 37.22\"><g id=\"Livello_2\" data-name=\"Livello 2\"><g id=\"Livello_9\" data-name=\"Livello 9\"><polygon class=\"mappa_cls-1\" points=\"4.39 0 0 4.39 14.22 18.61 0 32.83 4.39 37.22 23 18.61 4.39 0\"/></g></g></svg>";
  strPagPunti += "<img src=\"./engine/icons/chevron_right_24px.svg\" />";
  strPagPunti += "</nav>"; //<svg role=\"link\" aria-label="+app.labels.nav_forward+" id=\"cards_rightArrow\" class=\"points_arrow\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g stroke-linejoin=\"round\" stroke-linecap=\"round\" >	<circle r=\"46\" cx=\"50\" cy=\"50\" /><polyline points=\"40 25, 70 50, 40 75\" ></polyline></g></svg></nav>"

  strPagPunti += "<div id='pulsantieraSmartphone'>";
  strPagPunti += "<table height='100%' align='center'><tr>";
  strPagPunti += "<td><div id='divInserisciPulsSx' aria-disabled=\"true\" aria-label=" + app.labels.nav_backward + "></div></td>";
  strPagPunti += "<td valign='middle'><div id=\"contPallini\"></div></td>";
  strPagPunti += "<td><div id='divInserisciPulsDx' aria-disabled=\"true\" aria-label=" + app.labels.nav_forward + "></div></td>";
  strPagPunti += "</tr></table>";
  strPagPunti += "</div>";
  //strPagPunti += "<p id='avvisoNuovaFinestra' style='position:absolute; z-index:-1; visibility:hidden;'>"+giocoMappa.steps.attr("aria-live")+"</p>";
  //document.getElementById("avvisoNuovaFinestra").setAttribute("role", "alert");
  $("#contentMK3 .contentQuizMK3 .contenitorePagine").html(strPagPunti);
  $(".sectionPaginaPunti").css("height", $(".ax_current_object_container").height() + "px");
  
  if(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("coloreIstruzioni")!="")
	$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .istruzioniMappa").css("color", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("coloreIstruzioni"));

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    $("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .istruzioniMappa").css("top", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("topIstruzioni"));
	
	if(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("sizeIstruzioni")!="")
		$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .istruzioniMappa").css("fontSize", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("sizeIstruzioni"));
	if(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("lineHeight")!="")
		$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + " .istruzioniMappa").css("lineHeight", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("istruzioni").attr("lineHeight"));
  } //imposto parametri


  giocoMappa.larghezzaTotale = $(".ax_current_object_container").width();
  giocoMappa.altezzaTotale = $(".ax_current_object_container").height();

  $(".paginaPunti").css("height", $(".ax_current_object_container").height() + "px");
  $(".imgSfondoStep").css("width", giocoMappa.larghezzaTotale + "px");
  $(".imgSfondoStep table").css("width", giocoMappa.larghezzaTotale + "px");
  $(".imgSfondoStep table").css("height", giocoMappa.altezzaTotale + "px");
  if(giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("coloreSfondo")!="")
	$("#contentMK3 #stepSec" + giocoMappa.nrPallinoAttuale + "").css("background-color", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("coloreSfondo")); //aggiornaPalliniMappa();

  giocoMappa.margintTopPagine = ($(".ax_current_object_container").height() - $(".imgSfondoStep table").height()) / 2;
  $("#contentMK3 .contentQuizMK3 .contenitorePagine .paginaPunti").css("margin-top", giocoMappa.margintTopPagine + "px");
  scriviPuntiInterattivi();
  /*help*/

  giocoMappa.mostrami = giocoMappa.boxHelp.attr("mostrami"); //if(mostrami&&primaVolta){

  if (giocoMappa.mostrami == "true" && giocoMappa.primaVolta) {
    giocoMappa.primaVolta = false;
    var strBoxHelp = "";
    strBoxHelp += "<div class='muoviBoxHelp'>";
    strBoxHelp += "<div class='contboxHelp'>";
    strBoxHelp += "<div class='titboxHelp'>";
    strBoxHelp += "<table width='100%' border='0'><tr><td id='distanziaEtHelp' style='text-align=center;'></td><td id='cellaIconaHelp' width='30px' style='text-align=center; valign:middle;'>";
    strBoxHelp += "<!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon --><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' xml:space='preserve'><metadata> Svg Vector Icons :http://www.onlinewebfonts.com/icon </metadata><g><path fill='#FFFFFF' d='M500,9.8C229.4,9.8,10,229.3,10,500c0,270.7,219.4,490.2,490,490.2c270.6,0,490-219.5,490-490.2C990,229.3,770.6,9.8,500,9.8z M500,908.5C274.5,908.5,91.7,725.6,91.7,500C91.7,274.4,274.5,91.5,500,91.5c225.5,0,408.3,182.9,408.3,408.5C908.3,725.6,725.5,908.5,500,908.5z M459.2,744.8h81.7v-80.4l-81.9-1L459.2,744.8z M620.5,278.3c-35-25.3-72.7-36.5-125.6-34.1c-28.8,1.3-67.3,10.4-94.3,29.3c-47.7,33-62.1,77.8-64.8,144.5h82.4c0-19.4,5.7-45.9,17-63.9c11.3-18,30.8-30.2,64.1-33.4c34.6-2.9,57,9.2,67.2,18.1c25.5,23,15.2,81.1-6.1,104c-9.1,10.4-48.5,40.8-48.5,40.8c-25.2,19.7-37,37.1-43.1,52.2c-6.1,15.2-8.6,47.6-10,87.2h82.5l0.7-9.6c0,0-8.2-57,21.9-76.4l38.9-25.7c25.2-19.6,32.1-26.9,41-39.6c15.2-20.9,26.6-46.5,26.6-77C670.5,344.9,655.5,303.6,620.5,278.3z'/></g></svg>";

    strBoxHelp += "</td><td><div id='etichettaHelp' tabindex='31'>" + giocoMappa.boxHelp.attr("etichetta") + "</div></td><td width='20px'><div class='chiudiBoxHelpMappa' style='text-align:right; cursor:pointer;' role='button' aria-label='" + giocoMappa.boxHelp.attr("aria-label-help") + "' tabindex='33'>";

    strBoxHelp += "<svg id=\"svgChiudiHelp\" data-name=\"svgChiudiHelp\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.mappa_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"mappa_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
    strBoxHelp += "</div></td></tr></table>";
    strBoxHelp += "</div>";
    strBoxHelp += "<hr>";
    strBoxHelp += "<div id='txtboxHelp' class='txtboxHelp' tabindex='32'>";

    if (app.global.IS_SMARTPHONE) {
      strBoxHelp += giocoMappa.boxHelpSmart.text();
    } else {
      strBoxHelp += giocoMappa.boxHelp.text();
    }

    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    $(".boxHelp").html(strBoxHelp);

    $(".boxHelp").css("display", "block");
    $(".muoviBoxHelp").fadeIn().css({
      top: -200,
      position: 'absolute'
    }).animate({
      top: 5
    }, 800, function () {
      //callback
      $("#etichettaHelp").focus();
    });
    document.querySelector(".chiudiBoxHelpMappa").addEventListener("click", chiudiBoxHelpMappa);
  } else {
    //se non è presente l'help, inserire il focus sul primo oggetto
    //if (apertura) apertura = false;
    indicizzaImgMappa();

    if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("istruzioni") != "") {
      $("#contentMK3 .contentQuizMK3 .contenitorePagine #stepSec" + giocoMappa.nrPallinoAttuale + " #istruzioniMappa").focus();
    } else {
      $("#pulsante" + giocoMappa.nrPallinoAttuale + "_1").focus();
    }
  }

  if (giocoMappa.steps.find("step").length == 1) $(".points_arrow_nav").hide(); //se ci sono più step si attiva lo slider

}

function chiudiBoxHelpMappa(e) {
  $(".boxHelp").fadeOut("slow");
  $(".muoviBoxHelp").fadeIn().css({
    top: 5,
    position: 'absolute'
  }).animate({
    top: -200
  }, 800, function () {
    //callback
    $(".boxHelp").css("display", "none");
    indicizzaImgMappa();

    if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("istruzioni") != "") {
      $("#contentMK3 .contentQuizMK3 .contenitorePagine #stepSec" + giocoMappa.nrPallinoAttuale + " #istruzioniMappa").focus();
    } else {
      $("#pulsante" + giocoMappa.nrPallinoAttuale + "_1").focus();
    }
  });
}

function caricaContenutiGiocoMappa() {
  for (var i = 0; i < giocoMappa.steps.find("step").length; i++) {
    giocoMappa.schermateViste[i] = 0;
    giocoMappa.puntiVisti[i] = new Array();
    giocoMappa.puntiVistiPrec[i] = new Array();

    for (var z = 0; z < giocoMappa.steps.find("step:eq(" + i + ")").children("punto").length; z++) {
      giocoMappa.puntiVisti[i][z] = "0";
      giocoMappa.puntiVistiPrec[i][z] = "0";
    }
  }

  $(".contentQuizMK3").css("display", "block");

  creaContenutiMappa();
}

function scriviPuntiInterattivi() {
  $("#contentMK3 .contentQuizMK3 .contenitorePagine .inserisciPunti").html("");

  for (var z = 0; z < giocoMappa.steps.find("step").length; z++) {
    giocoMappa.strPunti = "";

    giocoMappa.strPunti += "<p class='freccetteIndicatore' id='imgFrecciaT' tabindex='-1'><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"26\" viewBox=\"0 0 12 16\" fill=\"#FFF\"><path fill-rule=\"evenodd\" d=\"M0 5l6 6 6-6H0z\"/></svg></p>";
    giocoMappa.strPunti += "<p class='freccetteIndicatore' id='imgFrecciaS' tabindex='-1'><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"26\" height=\"50\" viewBox=\"0 0 6 16\" fill=\"#FFF\"><path fill-rule=\"evenodd\" d=\"M0 14l6-6-6-6v12z\"/></svg></p>";
    giocoMappa.strPunti += "<p class='freccetteIndicatore' id='imgFrecciaR' tabindex='-1'><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"26\" height=\"50\" viewBox=\"0 0 6 16\" fill=\"#FFF\"><path fill-rule=\"evenodd\" d=\"M6 2L0 8l6 6V2z\"/></svg></p>";
    giocoMappa.strPunti += "<p class='freccetteIndicatore' id='imgFrecciaB' tabindex='-1'><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"26\" viewBox=\"0 0 12 16\" fill=\"#FFF\"><path fill-rule=\"evenodd\" d=\"M12 11L6 5l-6 6h12z\"/></svg></p>";

    for (var i = 0; i < giocoMappa.steps.find("step:eq(" + z + ")").children("punto").length; i++) {
      //giocoMappa.puntiVisti[i] = "0";
      var ariaLabelPunto = giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("img-aria-label");
	  var ariaLabelLivePunto = giocoMappa.steps.attr("aria-new-window");
      giocoMappa.strPunti += "<div class='puntoInterattivo' id='punto" + (z + 1) + "_" + (i + 1) + "'>";
      if (giocoMappa.puntiVistiPrec[z][i] == "1") giocoMappa.strPunti += "<div id='puntoVisto" + (z + 1) + "_" + (i + 1) + "' class='puntoVisto' style='visibility:visible' aria-hidden='true' tabindex='-1'>";else giocoMappa.strPunti += "<div id='puntoVisto" + (z + 1) + "_" + (i + 1) + "' class='puntoVisto' aria-hidden='true' tabindex='-1'>";
      giocoMappa.strPunti += "<svg id='svgSpuntaVerde' width='35' height='35' style='enable-background:new 0 0 128 128;' version='1.1' viewBox='0 0 128 128' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><circle class='st0' cx='64' cy='64' r='64'/></g><g><path class='st1' d='M54.3,97.2L24.8,67.7c-0.4-0.4-0.4-1,0-1.4l8.5-8.5c0.4-0.4,1-0.4,1.4,0L55,78.1l38.2-38.2   c0.4-0.4,1-0.4,1.4,0l8.5,8.5c0.4,0.4,0.4,1,0,1.4L55.7,97.2C55.3,97.6,54.7,97.6,54.3,97.2z'/></g></svg>";
      giocoMappa.strPunti += "</div>";

      if (giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("iconaHotspot") == "1") {
        var nomeImg = giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("imgHtml");
        var altImg = giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("altImg");
        var wImg;
        var hImg; //if(!app.global.IS_SMARTPHONE||($(".ax_current_object_container").width()>768)){

        if ($(".ax_current_object_container").width() > 768) {
          wImg = giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("WareaImg");
          hImg = giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("HareaImg");
        } else {
          //settaggi punto smartphone
          var fattoreRidimensionamento = 1024 / $(".ax_current_object_container").width();

          if ($(".ax_current_object_container").width() == 768) {} //ipad verticale

          var widthTablet = parseInt(giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("WareaImg"));
          var heightTablet = parseInt(giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("HareaImg"));
          wImg = parseInt(giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("WareaImg")) / fattoreRidimensionamento; //larghezza img ridotta rispetto al tablet

          hImg = wImg * heightTablet / widthTablet;
        }
		
		var directLinkPunto = giocoMappa.steps.find("step:eq("+ z +") punto:eq("+ i +") directLink").attr("presenza");
		
        giocoMappa.strPunti += "<div id='cella" + (z + 1) + "_" + (i + 1) + "' align='center'>";
        
		if(giocoMappa.steps.find("step:eq("+ z +") punto:eq("+ i +") directLink")){
			if(directLinkPunto!=0){// apre link
				giocoMappa.strPunti += "<div id='pulsante" + (z + 1) + "_" + (i + 1) + "' class='pulsanteLente' aria-hidden='true' tabindex='-1' aria-label='" + ariaLabelPunto + ", " + ariaLabelLivePunto + "' role='link' style='cursor:pointer;' >";
			}
			else{// apre box
				giocoMappa.strPunti += "<div id='pulsante" + (z + 1) + "_" + (i + 1) + "' class='pulsanteLente' aria-hidden='true' tabindex='-1' aria-label='" + ariaLabelPunto + "' role='button' style='cursor:pointer;' >";
			}
		}
		else{
			giocoMappa.strPunti += "<div id='pulsante" + (z + 1) + "_" + (i + 1) + "' class='pulsanteLente' aria-hidden='true' tabindex='-1' aria-label='" + ariaLabelPunto + "' role='button' style='cursor:pointer;' >";
		}
		
        giocoMappa.strPunti += "<img alt='" + altImg + "' id='imgPlsnt" + (z + 1) + "_" + (i + 1) + "' src='" + giocoMappa.stringaURL + "" + nomeImg + "' width='" + wImg + "' height='" + hImg + "'/>";
        giocoMappa.strPunti += "</div>";
        giocoMappa.strPunti += "</div>";
      } else {
        //var iconaHS = giocoMappa.steps.find("step:eq("+z+")").children("punto:eq("+i+")").attr("iconaHotspot");
        var altLente = giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("altImg");
        giocoMappa.strPunti += "<div id='cella" + (z + 1) + "_" + (i + 1) + "' align='center'><div id='pulsante" + (z + 1) + "_" + (i + 1) + "' aria-hidden='true' tabindex='-1' aria-label='" + giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("chiudi-aria-label") + "' role='button' class='pulsanteLente' style='cursor:pointer;' >"; //giocoMappa.strPunti += "<img alt='"+altImg+"' id='imgPlsnt"+(z+1)+"_"+(i+1)+"' src='"+giocoMappa.stringaURL + "icona"+iconaHS+".png'/>";
        //<style>.mappa_cls-1{fill:none;}.cls-2{opacity:0.5;}.cls-3{clip-path:url(#clip-path);}.cls-4{fill:#d4145a;}.cls-5{fill:#fff;}</style>

        giocoMappa.strPunti += "<svg id='imgPlsnt" + (z + 1) + "_" + (i + 1) + "' alt='" + altLente + "' data-name='imgPlsnt" + (z + 1) + "_" + (i + 1) + "' xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 24 24\"><defs><style>.plsLnt-1{fill:none;}.plsLnt-2{opacity:0.5;}.plsLnt-3{clip-path:url(#clip-path);}.plsLnt-4{fill:#d4145a;}.plsLnt-5{fill:#fff;}</style><clipPath id=\"clip-path\" transform=\"translate(0 0)\"><rect class=\"plsLnt-1\" width=\"24\" height=\"24\"/></clipPath></defs><g class=\"plsLnt-2\"><g class=\"plsLnt-3\"><path class=\"plsLnt-4\" d=\"M12,24A12,12,0,1,0,0,12,12,12,0,0,0,12,24\" transform=\"translate(0 0)\"/></g></g><path class=\"plsLnt-5\" d=\"M5.46,19.64,7.4,17.71l1.54-1.55a6.77,6.77,0,0,0,4,1.27,6.84,6.84,0,1,0-6.84-6.84,6.76,6.76,0,0,0,1.44,4.18L4.84,17.42l-.09.11-.7.7Zm2.2-9a5.24,5.24,0,1,1,2,4.14A5.75,5.75,0,0,1,8.9,14a5.22,5.22,0,0,1-1.24-3.38\" transform=\"translate(0 0)\"/></svg>";
        giocoMappa.strPunti += "</div></div>";
      }

      giocoMappa.strPunti += "</div>";
    }

    $("#contentMK3 .contentQuizMK3 .contenitorePagine #ip" + (z + 1) + "").html(giocoMappa.strPunti);
  } //$("#contentMK3 .contentQuizMK3 .contenitorePagine .inserisciPunti").html(giocoMappa.strPunti);


  var topPunto;
  var leftPunto;
  $(".puntoInterattivo").css("position", "absolute"); //$(".puntoInterattivo").css("z-index","5");

  for (var z = 0; z < giocoMappa.steps.find("step").length; z++) {
    for (var i = 0; i < giocoMappa.steps.find("step:eq(" + z + ")").children("punto").length; i++) {
      topPunto = giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("coordY");
      leftPunto = giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("coordX"); //console.log( $(".cbody").css("height") + " -- " + $(".cbody").css("width") )
      //var altezzaIngombroSmart = parseInt( $(".paginaPunti").css("height") )
      //var altezzaIngombroSmart = $(".ax_current_object_container").height();
      //1024:590=width:x

      var altezzaIngombroSmart = 590 * $(".ax_current_object_container").width() / 1024; //console.log( "immagineSfondo: "+altezzaIngombroSmart+ " - " +$(".ax_current_object_container").height() )

      var margineSmartphone = ($(".ax_current_object_container").height() - altezzaIngombroSmart) / 2;
      var coordinateSmartphoneTop = parseInt(topPunto) * altezzaIngombroSmart / 590 + margineSmartphone;
      var coordinateSmartphoneLeft = parseInt(leftPunto) * giocoMappa.larghezzaTotale / 1024;
      var tuneXsmart = parseInt(giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("smartTuneX"));
      var tuneYsmart = parseInt(giocoMappa.steps.find("step:eq(" + z + ")").children("punto:eq(" + i + ")").attr("smartTuneY"));

      if (app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() <= 768) {

        $("#punto" + (z + 1) + "_" + (i + 1)).css("top", parseInt(coordinateSmartphoneTop) - 10 + tuneYsmart + "px");
        $("#punto" + (z + 1) + "_" + (i + 1)).css("left", parseInt(coordinateSmartphoneLeft) + tuneXsmart + "px");
      } else {
        if (z + 1 > 1) {
          $("#punto" + (z + 1) + "_" + (i + 1)).css("top", parseInt(topPunto) + "px"); //$("#punto"+(z+1)+"_"+(i+1)).css("left",( (parseInt(leftPunto) ) + (giocoMappa.larghezzaTotale*z) )+"px");

          $("#punto" + (z + 1) + "_" + (i + 1)).css("left", parseInt(leftPunto) + "px");
        } else {
          $("#punto" + (z + 1) + "_" + (i + 1)).css("top", parseInt(topPunto) + "px");
          $("#punto" + (z + 1) + "_" + (i + 1)).css("left", parseInt(leftPunto) + "px");
        }
      } //console.log($(".inserisciPunti").css("top") + " #punto"+giocoMappa.nrPallinoAttuale+"_"+(i+1)+ " -- " + $("#punto"+giocoMappa.nrPallinoAttuale+"_"+(i+1)).css("top")+","+$("#punto"+giocoMappa.nrPallinoAttuale+"_"+(i+1)).css("left"))

    }
  }
}

function nascondiFrecce() {
  for (var i = 0; i < giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto").length; i++) {
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaT").css("display", "none");
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaS").css("display", "none");
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaB").css("display", "none");
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #imgFrecciaR").css("display", "none");
  }
}

function indicizzaImgMappa() {
  //aria-hidden
  var indicizzaElementiMap = 30; //indicizzo le istruzioni se presenti

  if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("istruzioni") != "") {
    $("#contentMK3 .contentQuizMK3 .contenitorePagine #stepSec" + giocoMappa.nrPallinoAttuale + " #istruzioniMappa").attr("tabindex", indicizzaElementiMap);
    indicizzaElementiMap++;
  }

  if (giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").attr("sfondoImg") != "") {
    $("#contentMK3 .contentQuizMK3 .contenitorePagine #stepSec" + giocoMappa.nrPallinoAttuale + " .immagineSfondo").attr("tabindex", indicizzaElementiMap);
    indicizzaElementiMap++;
  }

  for (var i = 0; i < giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto").length; i++) {
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #pulsante" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).attr("aria-hidden", "false");
    $("#stepSec" + giocoMappa.nrPallinoAttuale + " #pulsante" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).attr("tabindex", indicizzaElementiMap++); //if(cardsViste[i] == 1)

    document.querySelector("#stepSec" + giocoMappa.nrPallinoAttuale + " #pulsante" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).addEventListener("click", apriBoxMapClick);
    if ($("#stepSec" + giocoMappa.nrPallinoAttuale + " #puntoVisto" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).css("visibility") != "hidden") $("#stepSec" + giocoMappa.nrPallinoAttuale + " #pulsante" + giocoMappa.nrPallinoAttuale + "_" + (i + 1)).attr("aria-label", giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + i + ")").attr("img-aria-label") + " " + giocoMappa.steps.find("step:eq(" + (giocoMappa.nrPallinoAttuale - 1) + ")").children("punto:eq(" + i + ")").attr("aria-label-vista"));
  }

  if ($("#points_rightArrow_nav").is(':visible')) {
    indicizzaElementiMap++;
    $("#points_rightArrow_nav").attr("tabindex", indicizzaElementiMap);
  }

  if ($("#points_leftArrow_nav").is(':visible')) {
    indicizzaElementiMap++;
    $("#points_leftArrow_nav").attr("tabindex", indicizzaElementiMap);
  }

  //console.log($("#points_rightArrow_nav").is(':visible') + " -- " + $("#points_leftArrow_nav").is(':visible'));
}

function inibisciImg() {
  for (var z = 0; z < giocoMappa.steps.find("step").length; z++) {
    $("#contentMK3 .contentQuizMK3 .contenitorePagine #stepSec" + (z + 1) + " #istruzioniMappa").attr("tabindex", "-1");
    $("#contentMK3 .contentQuizMK3 .contenitorePagine #stepSec" + (z + 1) + " .immagineSfondo").attr("tabindex", "-1");

    for (var i = 0; i < giocoMappa.steps.find("step:eq(" + z + ")").children("punto").length; i++) {
      $("#stepSec" + (z + 1) + " #pulsante" + (z + 1) + "_" + (i + 1)).attr("tabindex", "-1");
      $("#stepSec" + (z + 1) + " #pulsante" + (z + 1) + "_" + (i + 1)).blur();
      document.querySelector("#pulsante" + (z + 1) + "_" + (i + 1)).removeEventListener("click", apriBoxMapClick);
    }
  }

  if ($("#points_rightArrow_nav").is(':visible')) {
    $("#points_rightArrow_nav").attr("tabindex", "-1");
  }

  if ($("#points_leftArrow_nav").is(':visible')) {
    $("#points_leftArrow_nav").attr("tabindex", "-1");
  }
}

function apriAudioMappa(quale) {
  quale = giocoMappa.indiceBoxAperta;
  $('#lettoreAudio').attr("src", giocoMappa.stringaURL + "_audio/" + giocoMappa.steps.find("step:eq(" + (nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").children("audio").text());
  var iconaAudio = giocoMappa.steps.find("step:eq(" + (nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").children("audio").attr("iconaAudio");
  var etichettaAudioPause = giocoMappa.steps.find("step:eq(" + (nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").children("audio").attr("etichettaAudioPause");
  var etichettaAudioPlay = giocoMappa.steps.find("step:eq(" + (nrPallinoAttuale - 1) + ")").children("punto:eq(" + (quale - 1) + ")").children("audio").attr("etichettaAudioPlay");

  if (!audioInPlay) {
    audioInPlay = true; //$(".txtaudioboxCard").html(giocoMappa.steps.attr("etichettaAudioPause"))

    $(".audioboxMappa").html("<img src='" + giocoMappa.stringaURL + "" + iconaAudio + "'/>" + " " + etichettaAudioPause);
    $('#lettoreAudio')[0].play();
  } else {
    audioInPlay = false; //$(".txtaudioboxMappa").html(giocoMappa.steps.attr("etichettaAudioPlay"))

    $(".audioboxMappa").html("<img src='" + giocoMappa.stringaURL + "" + iconaAudio + "'/>" + " " + etichettaAudioPlay);
    $('#lettoreAudio')[0].pause();
  }
}