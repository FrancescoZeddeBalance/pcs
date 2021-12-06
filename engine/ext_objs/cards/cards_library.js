"use strict";

var gioco = {
  radice: "",
  cards: "",
  fineGame: "",
  boxHelp: "",
  boxHelpSmart: "",
  primaVolta: true,
  nrPallini: 0,
  nrPallinoAttuale: 1,
  nrPallinoAttualeSmart: 1,
  nrSchermata: 0,
  fattore: 0,
  fattoreIntero: 0,
  stringaURL: "",
  cardsViste: new Array(),
  nrCardsVideata: 0,
  audioInPlay: false,
  strFine: "",
  positionLeftDragSmart: 0,
  contaDragNavigazione: 0,
  istruzioni: "",
  numSchermateTablet: 0,
  paginaCorrente: 0,
  primaCardSchermataCorrente: 0,
  mostrami: "",
  mostraBoxFinale: "",
};

function cards_initFunction(contenuti, folderReference) {
  //app.lib.debugOnConsole("INIT :::cards:::");
  //console.log(" --------------- "+contenuti.find("cards").attr("etichettaAudioPlay"))
  gioco.radice = contenuti;
  gioco.cards = contenuti.find("cards");
  gioco.boxHelp = contenuti.find("boxHelp");
  gioco.boxHelpSmart = contenuti.find("boxHelpSmart");
  gioco.fineGame = contenuti.find("fineGame");
  gioco.stringaURL = folderReference;
  gioco.istruzioni = contenuti.find("istruzioni");
  
   if(contenuti.find("fineGame").attr("mostrami")){
	  //è presente attributo "mostrami"
	  if(contenuti.find("fineGame").attr("mostrami")=="true")
		gioco.mostraBoxFinale="true";
	  else
		gioco.mostraBoxFinale="false";
  }
  else{
	  gioco.mostraBoxFinale="true";
  }
  
  gioco.nrPallini= 0;
  gioco.nrPallinoAttuale= 1;
  gioco.nrPallinoAttualeSmart= 1;
  gioco.nrSchermata= 0;
  gioco.fattore= 0;
  gioco.fattoreIntero= 0;
  //gioco.cardsViste= new Array();
  gioco.nrCardsVideata= 0;
  gioco.audioInPlay= false;
  gioco.strFine= "";
  gioco.positionLeftDragSmart= 0;
  gioco.contaDragNavigazione= 0;
  gioco.numSchermateTablet= 0;
  gioco.paginaCorrente= 0;
  gioco.primaCardSchermataCorrente= 0;
  gioco.mostrami= "";
  //gioco.primaVolta = true;
  
  var objectHtmlContainer = "\n\t\t\t<div id=\"contentMK2\">\n\t\t\t\n\t\t\t<div id=\"sfondoImg\" class=\"sfondoImg\"></div>\n\t\t\t\n\t\t\t\t<div class=\"conclusione\">\n\t\t\t\t<div class='contTxtConclusioni' role='dialog' aria-labelledby='titConclusioni' aria-describedby='txtConclusioni' tabindex='-1'>\n\t\t\t\t\t<div id='titConclusioni' class='titConclusioni' tabindex='-1'></div>\n\t\t\t\t\t<hr class='hrConclusione'>\n\t\t\t\t\t<div id='txtConclusioni' class='txtConclusioni' tabindex='-1'></div>\n\t\t\t\t\t<div class='contPulsRiavvia'>\n\t\t\t\t\t\t<div class='pulsRiavvia' tabindex='-1' role='button' aria-label=''></div>\n\t\t\t\t\t\t<div class='pulsRisSucc' tabindex='-1' role='button' aria-label=''></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\t\t\t\n\t\t\t</div>\t\t\n\t\t\t<div class=\"boxHelp\" role=\"dialog\" aria-labelledby=\"etichettaHelp\" aria-describedby=\"txtboxHelp\"></div>\n\t\n\t\t\t<div class=\"contentQuizMK2\">        \n\t\t\t\t<div class=\"sfondoBox\"><div class=\"objBox\" role=\"dialog\" aria-labelledby=\"titoloBox\" aria-describedby=\"txtboxCard\" tabindex=\"-1\"></div></div>\t\t\n\t\t\t\t<div class=\"contenitorePagine\"></div>\t\t\t\n\t\t\t</div>\n\t\t\t</div>\n\t\t"; /// Adding HTML to object container

  $(".ax_box_pill_container .ax_current_object_container").html(objectHtmlContainer); /// Listen to keyboard navigationsss

  $(document).on("keydown", function (e) {
    /// ESC to exit
    if (e.which == 27) {
      $("#ax_desktop_header_icon_id_" + app.global.CURRENT_OBJECT_INDEX + ".ax_desktop_header_icon").click();
    } //console.log("e.which: "+e.which+" - "+document.activeElement.className)


    if (e.which == 13 || e.which == 32) {
      //console.log("document.activeElement.className: "+document.activeElement.className)
      //console.log("document.activeElement.id: "+document.activeElement.id)
      if (document.activeElement.className == "chiudiBoxHelp") {
        chiudiBoxHelp();
      }

      if (document.activeElement.className == "chiudiBoxCard") {
        chiudiBoxCard();
      }

      if (document.activeElement.className == "pulsRiavvia") {
        if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768 || !app.global.IS_SMARTPHONE && gioco.fattoreIntero > 1) {
          _slideAnim("resetta_slider");
        } else {
          riavviaGioco();
        }
      }

      if (document.activeElement.className == "pulsRisSucc") {
        risorsaSuccessiva();
      }

      if (document.activeElement.className == "cardMK2") {
        var indiceCardSelezionata = parseInt(document.activeElement.id.substring(4)); //console.log(document.activeElement.id+" // "+indiceCardSelezionata);

        apriCard(indiceCardSelezionata);
      }

      if (document.activeElement.className == "contAudioboxCard") {
        apriAudio();
      }

      if (document.activeElement.id == "cards_leftArrow_nav") {
        _slideAnim("keyboard_back");
      }

      if (document.activeElement.id == "cards_rightArrow_nav") {
        _slideAnim("keyboard_forward");
      } //app.lib.debugOnConsole(":::return "+document.activeElement.id );

    }
  });
  caricaContenutiGioco(); /// complete at start
  //app.main.tracer.completeCurrentItem();
  /// start animation
  //cards_animateThisBoxInLibrary(".ext_animated_box");

  //console.log("gioco.fattoreIntero: " + gioco.fattoreIntero); //if( (app.global.IS_SMARTPHONE && ($(".ax_current_object_container").width()<768)) || (!app.global.IS_SMARTPHONE&&(gioco.fattoreIntero>1)) ){

  if (gioco.fattoreIntero > 1) {
    /// main action check which of the 4 types of interaction called the function
    var _slideAnim = function _slideAnim(e) {
      //app.lib.debugOnConsole("this.endX::" + this.endX+ " this.className: "+this.className);
      oldSlide = activeSlide;
	  //console.log("#card" + gioco.primaCardSchermataCorrente);
      //$("#contentMK2 #card" + gioco.primaCardSchermataCorrente).focus(); /// dragging the panels
	
      if (e == "keyboard_back" || e == "keyboard_forward" || e == "resetta_slider") {
        if (e == "keyboard_back") {
          activeSlide -= 1;
        } else {
          activeSlide += 1;
        }

        if (e == "resetta_slider") {
          activeSlide = 0;
          riavviaGioco();
        }
      } else if (this.id === "dragger") {
        activeSlide = offsets.indexOf(this.endX); //console.log("----------------2: "+activeSlide);
      } else {
        if (TweenMax.isTweening(containerMk2)) {
          return;
        } /// arrow clicks


        if (this.id === "cards_leftArrow_nav" || this.id === "cards_rightArrow_nav") {
          activeSlide = this.id === "cards_rightArrow_nav" ? activeSlide += 1 : activeSlide -= 1;
        } else if (this.className === "pulsRiavvia") {
          activeSlide = 0;
          riavviaGioco(); /// click on a dot
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


      $("#contentMK2 .cards_arrow_nav").show();

      if (activeSlide == slides.length - 1) {
        $("#contentMK2 #cards_rightArrow_nav").hide(); //app.main.tracer.completeCurrentItem(); 
      } else if (activeSlide == 0) {
        $("#contentMK2 #cards_leftArrow_nav").hide();
      }

      gioco.paginaCorrente = activeSlide; /// aria-hidden and tab navigation switch
      /// if we're dragging we don't animate the container

      if (typeof this === "undefined" || this.id != "dragger") {
        TweenMax.to(containerMk2, dur, {
          x: offsets[activeSlide],
		  onComplete:indicizzaCards,
          onUpdate: tweenDot
        });
      }

      gioco.nrPallinoAttualeSmart = activeSlide + 1;
      inibisciCards();
      //indicizzaCards();
	  
	  /*console.log("#card" + activeSlide);
	  $("#contentMK2 #card" + activeSlide).focus();*/
    }; // update the draggable element snap points


    var sizeItCard = function sizeItCard() {
      offsets = []; //iw = 1024;

      iw = $(".ax_current_object_container").width(); //console.log("slides: "+slides.length)

      TweenMax.set(".paginaCard", {
        width: slides.length * iw + 100
      });
      TweenMax.set(slides, {
        width: iw
      });

      for (var _i = 0; _i < slides.length; _i++) {
        //offsets.push(-slides[i].offsetLeft);
        offsets.push(-(iw * _i));
      }

      TweenMax.set(containerMk2, {
        x: offsets[activeSlide]
      });

      if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
        dragMeC[0].vars.snap = offsets;
      } //console.log("arrivi qui 2 "+offsets);

    };

    //window.addEventListener("resize", sizeIt);
    // update dot animation when dragger moves
    var tweenDot = function tweenDot() {
      //console.log("tween dot");
      TweenMax.set(dotAnim, {
        time: Math.abs(containerMk2._gsTransform.x / iw) + 1
      });
    };

    //slider gsap
    /// Draggable
    //console.log("--------------------");
    var slides = document.querySelectorAll(".sectionPaginaCard");
    var containerMk2 = document.querySelector(".paginaCard");
    var dur = 0.3;
    var offsets = [];
    var oldSlide = 0;
    var activeSlide = 0;
    var cards_dots = document.querySelector("#contPallini");
    var navcards_dots = []; //var iw = 1024;

    var iw = $(".ax_current_object_container").width();

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      document.querySelector("#cards_leftArrow_nav").addEventListener("click", _slideAnim);
      document.querySelector("#cards_rightArrow_nav").addEventListener("click", _slideAnim);
    } else {
      if (gioco.fattoreIntero > 1) {
        document.querySelector("#cards_leftArrow_nav").addEventListener("click", _slideAnim);
        document.querySelector("#cards_rightArrow_nav").addEventListener("click", _slideAnim);
      }
    }

    document.querySelector(".pulsRiavvia").addEventListener("click", _slideAnim); // set slides background colors and create the nav cards_dots

    for (var i = 0; i < slides.length; i++) {
      //TweenMax.set(slides[i], { backgroundColor: colorArray[i] });
      var newDot = document.createElement("div");
      newDot.className = "cards_dot"; //$(newDot).attr("tabindex", (30+i));

      newDot.id = "pallino" + i;
      newDot.index = i;
      navcards_dots.push(newDot); //newDot.addEventListener("click", slideAnim);

      cards_dots.appendChild(newDot);
    } // get elements positioned
    //TweenMax.set("#contPallini, .cards_titleWrap", {xPercent:-50});


    TweenMax.set(".cards_arrow_nav", {
      yPercent: -50
    });
    TweenMax.set(".cards_title", {
      y: 30
    }); // lower screen animation with nav cards_dots and rotating titles

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
    }, 1); //dotAnim.to(".cards_title", slides.length + 1, {y:-(slides.length*30), rotation:0.01, ease:Linear.easeNone}, 0);

    dotAnim.time(1);

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      // make the whole thing draggable
      var dragMeC = Draggable.create(containerMk2, {
        type: "x",
        edgeResistance: 1,
        snap: offsets,
        throwProps: true,
        bounds: ".contenitorePagine",
        onDrag: tweenDot,
        onThrowUpdate: tweenDot,
        allowContextMenu: true,
        onDragEnd: _slideAnim,
        zIndexBoost: false
      });
      dragMeC[0].id = "dragger";
    }

    sizeItCard();
    TweenMax.set(".contentQuizMK2", {
      opacity: 1
    }); //window.addEventListener("wheel", slideAnim);

    $("#contentMK2 #cards_leftArrow_nav").hide();
  }
}

function terminaAnimazioneAvantiIndietro(){
	console.log("-----/////-------");
}

function caricaContenutiGioco() {
  for (var i = 0; i < gioco.cards.find("card").length; i++) {
    gioco.cardsViste[i] = 0; //$("body").append("<div style='display:none' tabindex='-1'><img alt='' aria-hidden='true' src='"+gioco.stringaURL + ""+gioco.cards.find("card:eq("+i+")").children("fronte").attr("pathImg")+"'/></div>");
  }

  $(".contentQuizMK2").css("display", "block");
  creaContenuti();
}

function creaContenuti() {
  $("#contentMK2 .contenitorePagine").html("");
  $("#contentMK2 .boxHelp").css("display", "none");
  $("#contentMK2 .boxHelp").html("");
  
  /*font e dimensione di riferimento*/
  if(gioco.radice.attr("fontFamily")!="")
	$("#contentMK2").css("font-family",gioco.radice.attr("fontFamily"));
  if(gioco.radice.attr("fontSize")!="")
	$("#contentMK2").css("font-size",gioco.radice.attr("fontSize"));

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    //tablet
    gioco.nrCardsVideata = 8;
  } else {
    gioco.nrCardsVideata = 1;
  }

  gioco.fattore = gioco.cards.find("card").length / gioco.nrCardsVideata; //gioco.fattoreIntero = parseInt(gioco.fattore);	

  gioco.fattoreIntero = Math.ceil(gioco.fattore);
  var pagPalliniPieni = gioco.nrCardsVideata * gioco.fattoreIntero; //numero di schermate per tablet/pc

  gioco.numSchermateTablet = gioco.fattoreIntero + 1;
  var strCards = "";
  strCards = "<div class='txtIstruzioni' tabindex='-1' aria-hidden='true'>" + gioco.istruzioni.text() + "</div>";
  var strOggettiCards = "";
  strCards += "<div class='paginaCard'>"; //costruzione oggetti diversa per smartphone e per tablet/pc

  if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
    for (var i = 0; i < gioco.cards.find("card").length; i++) {
      if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) strCards += "<section class='sectionPaginaCard'>";
      strCards += "<div class='cardMK2' id='card" + i + "' tabindex='-1' role='button' aria-hidden='true' aria-label='" + gioco.cards.find("card:eq(" + i + ")").attr("aria-label") + "'>";
      strCards += "<div class='card__face card__face--front'>";
      strCards += "<div id='cardVista" + i + "' class='cardVista' aria-hidden='true' tabindex='-1'>";
      strCards += "<svg id='svgSpuntaVerde' aria-label='"+gioco.cards.find("card:eq(" + i + ")").attr("aria-label-vista")+"' width='26' height='26' style='enable-background:new 0 0 128 128;' version='1.1' viewBox='0 0 128 128' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><circle class='st0' cx='64' cy='64' r='64'/></g><g><path class='st1' d='M54.3,97.2L24.8,67.7c-0.4-0.4-0.4-1,0-1.4l8.5-8.5c0.4-0.4,1-0.4,1.4,0L55,78.1l38.2-38.2   c0.4-0.4,1-0.4,1.4,0l8.5,8.5c0.4,0.4,0.4,1,0,1.4L55.7,97.2C55.3,97.6,54.7,97.6,54.3,97.2z'/></g></svg>";
      strCards += "</div>";

      if (gioco.cards.find("card:eq(" + i + ")").children("fronte").attr("pathImg") != "") {
        strCards += "<div id='dimg" + i + "' class='imgCard'>";
        strCards += "<img id='cimg" + i + "' alt='" + gioco.cards.find("card:eq(" + i + ")").children("fronte").attr("alt") + "' src='" + gioco.stringaURL + "" + gioco.cards.find("card:eq(" + i + ")").children("fronte").attr("pathImg") + "'/>";
        strCards += "</div>";
      } else {
        strCards += "<div id='timg" + i + "' style='width:100%; height:100%; background-color:" + gioco.cards.find("card:eq(" + i + ")").children("fronte").attr("bgColor") + "'>";
        strCards += "</div>";
      }

      if (gioco.cards.find("card:eq(" + i + ")").children("fronte").text() != "") {
        strCards += "<div class='txtCard'><table width='100%' height='100%' border='0'><tr><td valign='middle'>" + gioco.cards.find("card:eq(" + i + ")").children("fronte").text() + "</td></tr></table></div>"; //fronte
      }

      strCards += "</div>";
      strCards += "<div class='card__face card__face--back' tabindex='-1' style='width:100%; height:100%; background-color:" + gioco.cards.find("card:eq(" + i + ")").children("retro").attr("bgColor") + "'></div>"; //retro

      strCards += "</div>";
      if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) strCards += "</section>"; //chiude sectionPaginaCard

      var larghezzaContenitore = $(".ax_current_object_container").width() * (i + 1);
    }
  } else {
    //tablet
    var nrPag = 1;

    for (var i = 0; i < gioco.cards.find("card").length; i++) {
      if (i == 0) {
        strCards += "<section class='sectionPaginaCard'>";
      } else if (i == gioco.nrCardsVideata * nrPag) {
        nrPag++;
        strCards += "<section class='sectionPaginaCard'>";
      }

      strCards += "<div class='cardMK2' id='card" + i + "' tabindex='-1' role='button' aria-hidden='true' aria-label='" + gioco.cards.find("card:eq(" + i + ")").attr("aria-label") + "'>";
      strCards += "<div class='card__face card__face--front'>";
      strCards += "<div id='cardVista" + i + "' class='cardVista' aria-hidden='true' tabindex='-1'>";
      strCards += "<svg id='svgSpuntaVerde' aria-label='"+gioco.cards.find("card:eq(" + i + ")").attr("aria-label-vista")+"' width='26' height='26' style='enable-background:new 0 0 128 128;' version='1.1' viewBox='0 0 128 128' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><circle class='st0' cx='64' cy='64' r='64'/></g><g><path class='st1' d='M54.3,97.2L24.8,67.7c-0.4-0.4-0.4-1,0-1.4l8.5-8.5c0.4-0.4,1-0.4,1.4,0L55,78.1l38.2-38.2   c0.4-0.4,1-0.4,1.4,0l8.5,8.5c0.4,0.4,0.4,1,0,1.4L55.7,97.2C55.3,97.6,54.7,97.6,54.3,97.2z'/></g></svg>";
      strCards += "</div>";

      if (gioco.cards.find("card:eq(" + i + ")").children("fronte").attr("pathImg") != "") {
        strCards += "<div id='dimg" + i + "' class='imgCard'>";
        strCards += "<img alt='" + gioco.cards.find("card:eq(" + i + ")").children("fronte").attr("alt") + "' src='" + gioco.stringaURL + "" + gioco.cards.find("card:eq(" + i + ")").children("fronte").attr("pathImg") + "'/>";
        strCards += "</div>";
      } else {
        strCards += "<div id='timg" + i + "' style='width:100%; height:100%; background-color:" + gioco.cards.find("card:eq(" + i + ")").children("fronte").attr("bgColor") + "'>";
        strCards += "</div>";
      }

      if (gioco.cards.find("card:eq(" + i + ")").children("fronte").text() != "") {
        strCards += "<div class='txtCard'><table width='100%' height='100%' border='0'><tr><td valign='middle'>" + gioco.cards.find("card:eq(" + i + ")").children("fronte").text() + "</td></tr></table></div>"; //fronte
      }

      strCards += "</div>";
      strCards += "<div class='card__face card__face--back' tabindex='-1' style='width:100%; height:100%; background-color:" + gioco.cards.find("card:eq(" + i + ")").children("retro").attr("bgColor") + "'></div>"; //retro
      //strCards += "<div class='card__face card__face--back'></div>";

      strCards += "</div>";
      var larghezzaContenitore = $(".ax_current_object_container").width() * (i + 1);

      if (i == gioco.nrCardsVideata * nrPag - 1) {
        strCards += "</section>"; //chiude sectionPaginaCard
      }
    }
  }

  strCards += "</div>"; //lettore audio

  strCards += "<audio id=\"lettoreAudio\">";
  strCards += "<source src=\"\" type=\"audio/mpeg\">";
  strCards += "Your browser does not support the audio element.";
  strCards += "</audio>";

  if (gioco.fattore > 1) {
    //30
    strCards += "<nav id=\"cards_leftArrow_nav\" class=\"cards_arrow_nav\" aria-label=" + app.labels.nav_backward + " tabindex=\"-1\">";
    //strCards += "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" aria-label=" + app.labels.nav_backward + " id=\"cards_leftArrow\" class=\"ax_desktop_cover_arrows_img svg replaced-svg cards_arrow\" alt=\"prev\" role=\"presentation\"><path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>";
	strCards += "<img src=\"./engine/icons/chevron_left_24px.svg\" id=\"cards_leftArrow\"  />";
    strCards += "</nav>"; //31

    strCards += "<nav id=\"cards_rightArrow_nav\" class=\"cards_arrow_nav\" aria-label=" + app.labels.nav_forward + " tabindex=\"-1\">";
    //strCards += "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" aria-label=" + app.labels.nav_forward + " id=\"cards_rightArrow\" class=\"ax_desktop_cover_arrows_img svg replaced-svg cards_arrow\" alt=\"next\" role=\"presentation\"><path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>";
	strCards += "<img src=\"./engine/icons/chevron_right_24px.svg\" id=\"cards_rightArrow\"/>";
    strCards += "</nav>";
    strCards += "<div id='pulsantieraSmartphone'>";
    strCards += "<table height='100%' align='center'><tr>";
    strCards += "<td><div id='divInserisciPulsSx' aria-disabled=\"true\" aria-label=" + app.labels.nav_backward + "></div></td>";
    strCards += "<td valign='middle'><div id=\"contPallini\"></div></td>";
    strCards += "<td><div id='divInserisciPulsDx' aria-disabled=\"true\" aria-label=" + app.labels.nav_forward + "></div></td>";
    strCards += "</tr></table>";
    strCards += "</div>";
  }

  $("#contentMK2 .contenitorePagine").html(strCards);
  
  //colore di sfondo
  if(gioco.radice.attr("bgcolor")!="")
	$("#contentMK2").css("background-color", gioco.radice.attr("bgcolor"));
  //immagine di sfondo
  if( gioco.radice.attr("bgImage").length > 0 ){
	  $("#contentMK2 #sfondoImg").html("<img alt='" + gioco.radice.attr("altBgImage") + "' tabindex='-1' src=\"" + gioco.stringaURL + "" + gioco.radice.attr("bgImage") + "" + "\"/>");
  }
  
  $("#contentMK2 .sectionPaginaCard").css("height", $(".ax_current_object_container").height() + "px");
  var margine;
  $("#contentMK2 .cardMK2").css("visibility", "visible");

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    if (parseInt(gioco.cards.find("card").length) <= parseInt(gioco.nrCardsVideata / 2)) {
      //margine = parseInt($(".ax_current_object_container").height()) - parseInt($("#contentMK2 .cardMK2").css("height"));
	  margine = parseInt($("#contentMK2").height()) - parseInt($("#contentMK2 .cardMK2").css("height"));
      $("#contentMK2 .contenitorePagine .paginaCard").css("marginTop", margine / 2 + "px");
    } else {
      //margine = parseInt($(".ax_current_object_container").height()) - parseInt($("#contentMK2 .cardMK2").css("height")) * 2;
	  margine = parseInt($("#contentMK2").height()) - parseInt($("#contentMK2 .cardMK2").css("height")) * 2;
      $("#contentMK2 .contenitorePagine .paginaCard").css("marginTop", margine / 2 + "px");
    }
  } else {
    $("#contentMK2 .cardMK2").css("top", "10%");
  }

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() > 768) {
    //manipolo grandezza font e line height delle istruzioni SOLO TABLET PC
	if(gioco.istruzioni.attr("fontSizeTablet")!="")
		$("#contentMK2 .txtIstruzioni").css("fontSize", gioco.istruzioni.attr("fontSizeTablet"));
	if(gioco.istruzioni.attr("lineHeightTablet")!="")
		$("#contentMK2 .txtIstruzioni").css("lineHeight", gioco.istruzioni.attr("lineHeightTablet"));
  }

  if (gioco.cards.find("card").length <= 4) {
    if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() > 768) {
      //tablet
      $("#contentMK2 .contentQuizMK2 .contenitorePagine .paginaCard .cardMK2").css("width", "200px");
      $("#contentMK2 .contentQuizMK2 .contenitorePagine .paginaCard .cardMK2").css("height", "288px");
      $("#contentMK2 .card__face").css("width", "200px");
      $("#contentMK2 .card__face").css("height", "288px");
      $("#contentMK2 .cardRetro").css("width", "200px");
      $("#contentMK2 .cardRetro").css("height", "288px");
      $("#contentMK2 .contentQuizMK2 .contenitorePagine .paginaCard .sectionPaginaCard").css("width", "100%");
      $("#contentMK2 .txtIstruzioni").css("marginTop", "30px");
    }
  }

  if (gioco.cards.find("card").length == 5 || gioco.cards.find("card").length == 6) {
    if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
      //tablet
      $("#contentMK2 .contentQuizMK2 .contenitorePagine .paginaCard .sectionPaginaCard").css("width", "80%");
      $("#contentMK2 .contentQuizMK2 .contenitorePagine .paginaCard").css("margin-left", "10%");
      $("#contentMK2 .contentQuizMK2 .contenitorePagine .paginaCard .cardMK2").css("margin-right", "2.5em");
      $("#contentMK2 .contentQuizMK2 .contenitorePagine .paginaCard .cardMK2").css("margin-left", "2.5em");
    }
  }
  /*help*/


  gioco.mostrami = gioco.boxHelp.attr("mostrami");

  if (gioco.mostrami == "true" && gioco.primaVolta) {
    gioco.primaVolta = false;
    var strBoxHelp = "";
    strBoxHelp += "<div class='muoviBoxHelp'>";
    strBoxHelp += "<div class='contboxHelp'>";
    strBoxHelp += "<div class='titboxHelp'>";
    strBoxHelp += "<table width='100%' border='0'><tr><td id='distanziaEtHelp' style='text-align=center;'></td><td id='cellaIconaHelp' width='30px' style='text-align=center; valign:middle;'>";
    strBoxHelp += "<!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon --><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' xml:space='preserve'><metadata> Svg Vector Icons :http://www.onlinewebfonts.com/icon </metadata><g><path fill='#FFFFFF' d='M500,9.8C229.4,9.8,10,229.3,10,500c0,270.7,219.4,490.2,490,490.2c270.6,0,490-219.5,490-490.2C990,229.3,770.6,9.8,500,9.8z M500,908.5C274.5,908.5,91.7,725.6,91.7,500C91.7,274.4,274.5,91.5,500,91.5c225.5,0,408.3,182.9,408.3,408.5C908.3,725.6,725.5,908.5,500,908.5z M459.2,744.8h81.7v-80.4l-81.9-1L459.2,744.8z M620.5,278.3c-35-25.3-72.7-36.5-125.6-34.1c-28.8,1.3-67.3,10.4-94.3,29.3c-47.7,33-62.1,77.8-64.8,144.5h82.4c0-19.4,5.7-45.9,17-63.9c11.3-18,30.8-30.2,64.1-33.4c34.6-2.9,57,9.2,67.2,18.1c25.5,23,15.2,81.1-6.1,104c-9.1,10.4-48.5,40.8-48.5,40.8c-25.2,19.7-37,37.1-43.1,52.2c-6.1,15.2-8.6,47.6-10,87.2h82.5l0.7-9.6c0,0-8.2-57,21.9-76.4l38.9-25.7c25.2-19.6,32.1-26.9,41-39.6c15.2-20.9,26.6-46.5,26.6-77C670.5,344.9,655.5,303.6,620.5,278.3z'/></g></svg>";
    strBoxHelp += "</td><td><div id='etichettaHelp' tabindex='31'>" + gioco.boxHelp.attr("etichetta") + "</div></td><td width='20px'><div class='chiudiBoxHelp' style='text-align:right; cursor:pointer;' role='button' aria-label='" + gioco.boxHelp.attr("aria-label-help") + "' tabindex='33'>";
    strBoxHelp += "<svg id=\"svgChiudiHelp\" data-name=\"svgChiudiHelp\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.cards_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"cards_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
    strBoxHelp += "</div></td></tr></table>";
    strBoxHelp += "</div>";
    strBoxHelp += "<hr>";
    strBoxHelp += "<div id='txtboxHelp' class='txtboxHelp' tabindex='32'>"; //boxHelpSmart

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      strBoxHelp += gioco.boxHelpSmart.text();
    } else {
      strBoxHelp += gioco.boxHelp.text();
    }

    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    $("#contentMK2 .boxHelp").html(strBoxHelp);
    $("#contentMK2 .boxHelp").css("display", "block");
	var animationDurationFirst = 800;
	if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
    $("#contentMK2 .muoviBoxHelp").fadeIn().css({
      top: -200,
      position: 'absolute'
    }).animate({
      top: 55
    }, animationDurationFirst, function () {
      //callback
      $("#contentMK2 #etichettaHelp").focus();
    });
    document.querySelector(".chiudiBoxHelp").addEventListener("click", chiudiBoxHelp);
  } else {
    if (apertura) apertura = false;
    indicizzaCards(); //se non è presente l'help, metto il focus o sulle istruzioni (se presenti) o sulla prima card

    if ($("#contentMK2 .txtIstruzioni").html().length > 0) $("#contentMK2 .txtIstruzioni").focus();else $("#contentMK2 #card0").focus();
  }
}

function indicizzaCards() {
  var indiceTab;

  if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
    if ($("#contentMK2 .txtIstruzioni").html().length > 0) {
      $("#contentMK2 .txtIstruzioni").attr("aria-hidden", "false");
      $("#contentMK2 .txtIstruzioni").attr("tabindex", 32);
      indiceTab = 33;
    } else {
      indiceTab = 32;
    }
  } else {
    if ($("#contentMK2 .txtIstruzioni").html().length > 0) {
      $("#contentMK2 .txtIstruzioni").attr("aria-hidden", "false");
      $("#contentMK2 .txtIstruzioni").attr("tabindex", 30);
      indiceTab = 31;
    } else {
      indiceTab = 30;
    }
  }

  if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
    for (var i = 0; i < gioco.cards.find("card").length; i++) {
      document.querySelector("#card" + i).addEventListener("click", apriCardClick);
      $("#contentMK2 #card" + i).attr("aria-hidden", "false");
      $("#contentMK2 #card" + i).attr("tabindex", indiceTab + i);
      if ($("#contentMK2 #cardVista" + i).css("visibility") != "hidden") $("#contentMK2 #card" + i).attr("aria-label", gioco.cards.find("card:eq(" + i + ")").attr("aria-label") + " " + gioco.cards.find("card:eq(" + i + ")").attr("aria-label-vista"));
    }

    $("#contentMK2 #cards_leftArrow_nav").attr("tabindex", 30);
    $("#contentMK2 #cards_rightArrow_nav").attr("tabindex", 31);
	$("#contentMK2 #card" + gioco.paginaCorrente).focus();
  } else {
    //tablet
    var inizioConteggio = gioco.nrCardsVideata * gioco.paginaCorrente;
    gioco.primaCardSchermataCorrente = inizioConteggio;
    var fineConteggio = gioco.nrCardsVideata;

    if (gioco.fattoreIntero == 0 && gioco.cards.find("card").length < gioco.nrCardsVideata) {
      fineConteggio = gioco.cards.find("card").length;
    }

    if (gioco.paginaCorrente + 1 > 0 && gioco.paginaCorrente + 1 < gioco.fattoreIntero) {
      fineConteggio = gioco.nrCardsVideata * (gioco.paginaCorrente + 1);
    } else if (gioco.paginaCorrente + 1 > 0 && gioco.paginaCorrente + 1 == gioco.fattoreIntero) {
      fineConteggio = gioco.cards.find("card").length;
    } //console.log( gioco.paginaCorrente + " -- " + gioco.fattoreIntero + " inizioConteggio: " + inizioConteggio + " fineConteggio: "+fineConteggio);


    for (var i = inizioConteggio; i < fineConteggio; i++) {
      document.querySelector("#card" + i).addEventListener("click", apriCardClick);
      $("#contentMK2 #card" + i).attr("aria-hidden", "false");
      $("#contentMK2 #card" + i).attr("tabindex", indiceTab++);
      if ($("#contentMK2 #cardVista" + i).css("visibility") != "hidden") $("#contentMK2 #card" + i).attr("aria-label", gioco.cards.find("card:eq(" + i + ")").attr("aria-label") + " " + gioco.cards.find("card:eq(" + i + ")").attr("aria-label-vista"));
    }

    if (gioco.paginaCorrente == 0) {
      $("#contentMK2 #cards_rightArrow_nav").attr("tabindex", indiceTab++);
    } else if (gioco.paginaCorrente > 0 && gioco.paginaCorrente < gioco.fattoreIntero) {
      $("#contentMK2 #cards_leftArrow_nav").attr("tabindex", indiceTab++);
      $("#contentMK2 #cards_rightArrow_nav").attr("tabindex", indiceTab++);
    } else if (gioco.paginaCorrente == gioco.fattoreIntero) {
      $("#contentMK2 #cards_leftArrow_nav").attr("tabindex", indiceTab++);
    }
  }
}

function inibisciCards() {
  if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
    for (var i = 0; i < gioco.cards.find("card").length; i++) {
      document.querySelector("#card" + i).removeEventListener("click", apriCardClick);
      $("#contentMK2 #card" + i).attr("tabindex", "-1");
      $("#contentMK2 #card" + i).blur();
    }
  } else {
    //tablet
    $("#contentMK2 #cards_leftArrow_nav").attr("tabindex", "-1");
    $("#contentMK2 #cards_rightArrow_nav").attr("tabindex", "-1");

    for (var i = 0; i < gioco.cards.find("card").length; i++) {
      document.querySelector("#card" + i).removeEventListener("click", apriCardClick);
      $("#contentMK2 #card" + i).attr("tabindex", "-1");
      $("#contentMK2 #card" + i).blur();
    }
  }
}

function chiudiBoxHelp(e) {
  $("#contentMK2 .boxHelp").fadeOut("slow");
  var animationDurationFirst = 800;
  if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
  $("#contentMK2 .muoviBoxHelp").fadeIn().css({
    top: 5,
    position: 'absolute'
  }).animate({
    top: -200
  }, animationDurationFirst, function () {
    //callback
    $("#contentMK2 .boxHelp").css("display", "none");
    if ($("#contentMK2 .txtIstruzioni").html().length > 0) $("#contentMK2 .txtIstruzioni").focus(); //se presenti le istruzioni
    else $("#contentMK2 #card0").focus(); //se non presenti le istruzioni
  });
  indicizzaCards();
}

function chiudiBoxCard() {
  var card = document.querySelector('#card' + cardAperta);
  $('#card' + cardAperta).animate({
    opacity: 1
  }, 1000);
  card.classList.toggle('is-flipped');
  $("#contentMK2 .card__face--back").css("display", "none");
  $("#contentMK2 .objBox .contboxCard").removeClass("animazioneApriCard");
  $("#contentMK2 .objBox .contboxCard").addClass("animazioneChiudiCard");
  $(".sfondoBox").fadeOut("slow", function () {
    // Animation complete.
    gioco.cardsViste[cardAperta] = 1;
    $("#contentMK2 #card" + cardAperta).focus();
    apertura = false;
    controllaConclusione();
    $("#contentMK2 #cardVista" + cardAperta).css("visibility", "visible");
    indicizzaCards();

    if (gioco.cards.find("card:eq(" + cardAperta + ")").children("video").text() != "") {
      $('video')[0].pause();
    }

    if (gioco.cards.find("card:eq(" + cardAperta + ")").children("audio").text() != "") {
      gioco.audioInPlay = false;
      $('#lettoreAudio')[0].pause();
    }
  });
} //costruzione della box aperta


function apriBox(quale) {
  if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) quale = gioco.nrPallinoAttualeSmart - 1;
  $("#contentMK2 .sfondoBox").css("display", "block");
  var indexOggetto = 30;
  var strBoxCard = "";
  strBoxCard += "<div class='contboxCard'>"; //titolo

  strBoxCard += "<div class='titboxCard'>";
  strBoxCard += "<table width='100%' border='0'><tr><td style='text-align=center;'>";

  if (gioco.cards.find("card:eq(" + quale + ")").attr("titolo") != "") {
    indexOggetto++;
    strBoxCard += "<div id='titoloBox' role='heading' aria-level='2' tabindex='" + indexOggetto + "'>" + gioco.cards.find("card:eq(" + quale + ")").attr("titolo") + "</div>";
  }

  strBoxCard += "</td><td width='25px' valign='top'><div class='chiudiBoxCard' style='text-align:right; cursor:pointer;' role='button' aria-label='" + gioco.cards.attr("aria-label-chiudiBoxCard") + "' tabindex='-1'>";
  strBoxCard += "<svg version=\"1.1\" id=\"svgChiudiBox\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 24 24\" style=\"enable-background:new 0 0 24 24;\" xml:space=\"preserve\"><g><rect x=\"2.4\" y=\"3.4\" class=\"stCB0\" width=\"18.7\" height=\"17.8\"/><g><path class=\"stCB1\" d=\"M21.3,0.1H2.7C1.2,0.1,0,1.3,0,2.7v18.7c0,1.5,1.2,2.7,2.7,2.7h18.7c1.5,0,2.7-1.2,2.7-2.7V2.7			C24,1.3,22.8,0.1,21.3,0.1z M18.7,16.9l-1.9,1.9L12,13.9l-4.8,4.8l-1.9-1.9l4.8-4.8L5.3,7.3l1.9-1.9l4.8,4.8l4.8-4.8l1.9,1.9			l-4.8,4.8L18.7,16.9z\"/></g></g></svg>";
  strBoxCard += "</div></td></tr></table>";
  strBoxCard += "";
  strBoxCard += "</div>"; //presenza immagine

  if (gioco.cards.find("card:eq(" + quale + ")").children("video").text() == "") {
    if (gioco.cards.find("card:eq(" + quale + ")").children("immagine").text() != "") {
      indexOggetto++;
      strBoxCard += "<div class='imgboxCard' tabindex='" + indexOggetto + "'>";
      strBoxCard += "<img alt='" + gioco.cards.find("card:eq(" + quale + ")").children("immagine").attr("alt") + "' src='" + gioco.stringaURL + "" + gioco.cards.find("card:eq(" + quale + ")").children("immagine").text() + "'/>";
      strBoxCard += "</div>";
    }
  } //testo


  if (gioco.cards.find("card:eq(" + quale + ")").children("testo").text() != "") {
    indexOggetto++;
    strBoxCard += "<div id='txtboxCard' class='txtboxCard' tabindex='" + indexOggetto + "'>";
    strBoxCard += gioco.cards.find("card:eq(" + quale + ")").children("testo").text();
    strBoxCard += "</div>";
  } //presenza video


  if (gioco.cards.find("card:eq(" + quale + ")").children("video").text() != "") {
    indexOggetto++;
    strBoxCard += "<div class='videoboxCard' tabindex='" + indexOggetto + "' aria-label='" + gioco.cards.find("card:eq(" + quale + ")").children("video").attr("aria-label") + "'><table width='100%' height='100%' border='0'><tr><td valign='top'>";
    strBoxCard += "<video width=\"320\" controls poster='"+gioco.stringaURL + "/poster.jpg'>";
    strBoxCard += "<source src='" + gioco.stringaURL + "" + gioco.cards.find("card:eq(" + quale + ")").children("video").text() + "' type='video/mp4'>";
    strBoxCard += "Your browser does not support the video tag.";
    strBoxCard += "</video>";
    strBoxCard += "</td></tr></table></div>";
  }

  var puntoSelezionato = gioco.cards.find("card:eq(" + quale + ")");

  if (puntoSelezionato.children("audio").text() != "" || puntoSelezionato.children("dispensa").text() != "") {
    strBoxCard += "<div class='contAudioPdfboxCard'>"; //presenza pulsante audio

    if (puntoSelezionato.children("audio").text() != "") {
      indexOggetto++;
      strBoxCard += "<div class='contAudioboxCard' role='button' tabindex='" + indexOggetto + "' aria-label='" + gioco.cards.find("card:eq(" + quale + ")").children("audio").attr("aria-label") + "'>";
      strBoxCard += "<table width='100%' height='100%' border='0'><tr><td valign='middle' align='center'>";
      strBoxCard += "<div class='audioboxCard'>";
      strBoxCard += "<div class='imgaudioboxCard'><img alt='" + gioco.stringaURL + "" + gioco.cards.attr("altIconaAudio") + "' src='" + gioco.stringaURL + "" + gioco.cards.attr("iconaAudio") + "'/></div><div class='txtaudioboxCard'>" + " " + gioco.cards.attr("etichettaAudioPlay") + "</div>";
      strBoxCard += "</div>";
      strBoxCard += "</td></tr></table>";
      strBoxCard += "</div>";
    } //presenza pulsante dispensa


    if (puntoSelezionato.children("dispensa").text() != "") {
      indexOggetto++;
      strBoxCard += "<div class='contPdfboxCard'><a class='collegamentoPdf' aria-label='" + gioco.cards.find("card:eq(" + quale + ")").children("dispensa").attr("aria-label") + "' tabindex='" + indexOggetto + "' href='" + gioco.stringaURL + "" + puntoSelezionato.children("dispensa").text() + "' target='_blank'>";
      strBoxCard += "<table width='100%' height='100%' border='0'><tr><td valign='middle' align='center'>";
      strBoxCard += "<div class='pdfboxCard'>";
      strBoxCard += "<img alt='" + gioco.cards.attr("altIconaDispensa") + "' src='" + gioco.stringaURL + "" + gioco.cards.attr("iconaDispensa") + "'/>  " + gioco.cards.attr("etichettaDispensa");
      strBoxCard += "</div>";
      strBoxCard += "</td></tr></table>";
      strBoxCard += "</a></div>";
    }

    strBoxCard += "</div>";
  }

  strBoxCard += "</div>";
  $("#contentMK2 .objBox").html(strBoxCard);
  $("#contentMK2 .chiudiBoxCard").attr("tabindex", indexOggetto + 1); //assegno ultimo index disponibile

  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
    //manipolo grandezza font e line height del titolo e testo della box SOLO TABLET PC
	if(gioco.cards.find("card:eq(" + quale + ")").attr("titoloSize")!="")
		$("#contentMK2 #titoloBox").css("fontSize", gioco.cards.find("card:eq(" + quale + ")").attr("titoloSize"));
	if(gioco.cards.find("card:eq(" + quale + ")").attr("titoloLineHeight")!="")
		$("#contentMK2 #titoloBox").css("lineHeight", gioco.cards.find("card:eq(" + quale + ")").attr("titoloLineHeight"));
	if(gioco.cards.find("card:eq(" + quale + ")").attr("titoloMarginTop")!="")
		$("#contentMK2 #titoloBox").css("marginTop", gioco.cards.find("card:eq(" + quale + ")").attr("titoloMarginTop"));
	if(gioco.cards.find("card:eq(" + quale + ")").children("testo").attr("txtboxSize")!="")
		$("#contentMK2 .objBox .txtboxCard").css("fontSize", gioco.cards.find("card:eq(" + quale + ")").children("testo").attr("txtboxSize"));
	if(gioco.cards.find("card:eq(" + quale + ")").children("testo").attr("txtboxLineHeight")!="")
		$("#contentMK2 .objBox .txtboxCard").css("lineHeight", gioco.cards.find("card:eq(" + quale + ")").children("testo").attr("txtboxLineHeight"));
  }

  var lengthVideo = gioco.cards.find("card:eq(" + quale + ")").children("video").text().length;
  var lengthImmagine = gioco.cards.find("card:eq(" + quale + ")").children("immagine").text().length;
  var lengthAudio = gioco.cards.find("card:eq(" + quale + ")").children("audio").text().length;
  var lengthDispensa = gioco.cards.find("card:eq(" + quale + ")").children("dispensa").text().length;

  if (lengthVideo == 0 && lengthImmagine == 0) {
    $("#contentMK2 .txtboxCard").css("maxHeight", "70%");

    if (lengthAudio == 0 && lengthDispensa == 0) {
      $("#contentMK2 .txtboxCard").css("maxHeight", "75%");
    }
  }
  if(gioco.cards.attr("bgetichettaAudio")!="")
	$("#contentMK2 .contAudioboxCard").css("background-color", gioco.cards.attr("bgetichettaAudio"));
  if(gioco.cards.attr("bgetichettaDispensa")!="")
	$("#contentMK2 .contPdfboxCard").css("background-color", gioco.cards.attr("bgetichettaDispensa"));
  $("#contentMK2 .objBox").css("display", "block");
  $("#contentMK2 .objBox .contboxCard").removeClass("animazioneChiudiCard");
  $("#contentMK2 .objBox .contboxCard").addClass("animazioneApriCard");
  document.querySelector(".chiudiBoxCard").addEventListener("click", chiudiBoxCard);
  if (puntoSelezionato.children("audio").text() != "") document.querySelector(".contAudioboxCard").addEventListener("click", apriAudio);
}

var cardAperta;
var apertura = false;
var posTop;
var posLeft;

function apriCardClick() {
  var indiceCardSelezionata = document.activeElement.id.substring(4);
  
  //console.log(document.activeElement.className+ " indiceCardSelezionata: "+indiceCardSelezionata);

  if (document.activeElement.className == "cardMK2" || document.activeElement.className == "imgCard") {
    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) apriCard(gioco.nrPallinoAttualeSmart - 1);else apriCard(indiceCardSelezionata);
  }
}

function apriCard(quale) {
  cardAperta = quale;
  var card = document.querySelector('#card' + quale);
  card.classList.toggle('is-flipped');

  if (!apertura) {
    apertura = true;
    $("#contentMK2 #cardVista" + cardAperta).css("visibility", "hidden");
    inibisciCards();
    apriBox(quale);
    if (gioco.cards.find("card:eq(" + quale + ")").attr("titolo") != "") $("#contentMK2 #titoloBox").focus();else $("#contentMK2 #txtboxCard").focus();
  }

  $("#contentMK2 .card__face--back").css("display", "block");
  $('#contentMK2 #card' + cardAperta).animate({
    opacity: 0
  }, 1000);
}

function controllaConclusione() {
  gioco.strFine = "";

  for (var i = 0; i < gioco.cards.find("card").length; i++) {
    gioco.strFine += gioco.cardsViste[i];
  }

  if (gioco.strFine.indexOf("0") == -1) {
    app.main.tracer.completeCurrentItem();
	
	
	
	if(gioco.mostraBoxFinale=="true"){
	
		var indiceElementi = 30;

		if (gioco.fineGame.attr("etichetta") != "") {
		  indiceElementi++;
		  $("#contentMK2 #titConclusioni").html(gioco.fineGame.attr("etichetta"));
		  $("#contentMK2 #titConclusioni").attr("tabindex", indiceElementi);
		}

		indiceElementi++;
		$("#contentMK2 #txtConclusioni").html(gioco.fineGame.text());
		$("#contentMK2 #txtConclusioni").attr("tabindex", indiceElementi);
		indiceElementi++;
		$("#contentMK2 .pulsRiavvia").html(gioco.fineGame.attr("pulsanteRiavvia"));
		$("#contentMK2 .pulsRiavvia").attr("tabindex", indiceElementi);
		$("#contentMK2 .pulsRiavvia").attr("aria-label", gioco.fineGame.attr("aria-label-pulsante"));
		if( gioco.fineGame.attr("presenzaPulsanteRisSucc")=="1" ){
			indiceElementi++;
			$(".pulsRisSucc").css("display","inline");
			$(".pulsRisSucc").html(gioco.fineGame.attr("pulsanteRisSucc"));
			$(".pulsRisSucc").attr("tabindex", indiceElementi);
			$(".pulsRisSucc").attr("aria-label", gioco.fineGame.attr("aria-label-pulsanteRisSucc"));
		}
		else{
			$(".pulsRisSucc").css("display","none");
		}
		$("#contentMK2 .conclusione").fadeIn("slow", function () {
		  // Animation complete
		  inibisciCards(); //tolgo i tabindex e gli eventi da tutte le card
		  //formattazione da xml
		  if(gioco.fineGame.attr("sfondoPulsante")!="")
			$("#contentMK2 .pulsRiavvia").css("background-color", gioco.fineGame.attr("sfondoPulsante"));
		  if(gioco.fineGame.attr("coloreTestoPulsante")!="")
			$("#contentMK2 .pulsRiavvia").css("color", gioco.fineGame.attr("coloreTestoPulsante"));
		  if( gioco.fineGame.attr("presenzaPulsanteRisSucc")=="1" ){
			  if(gioco.fineGame.attr("sfondoPulsante")!="")
				$("#contentMK2 .pulsRisSucc").css("background-color", gioco.fineGame.attr("sfondoPulsante"));
			  if(gioco.fineGame.attr("coloreTestoPulsante")!="")
				$("#contentMK2 .pulsRisSucc").css("color", gioco.fineGame.attr("coloreTestoPulsante"));
		  }
		  if(gioco.fineGame.attr("coloreTestoContenuti")!="")
			$("#contentMK2 .titConclusioni").css("color", gioco.fineGame.attr("coloreTestoContenuti"));
		  if(gioco.fineGame.attr("coloreTestoContenuti")!="")
			$("#contentMK2 .txtConclusioni").css("color", gioco.fineGame.attr("coloreTestoContenuti"));
		  if(gioco.fineGame.attr("sfondoBox")!="")
			$("#contentMK2 .contTxtConclusioni").css("background-color", gioco.fineGame.attr("sfondoBox"));

		  if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
			//tablet
			if(gioco.fineGame.attr("txtboxLineHeight")!="")
				$("#contentMK2 .txtConclusioni").css("line-height", gioco.fineGame.attr("txtboxLineHeight"));
			if(gioco.fineGame.attr("txtboxSize")!="")
				$("#contentMK2 .txtConclusioni").css("font-size", gioco.fineGame.attr("txtboxSize"));
		  }

		  if (gioco.fineGame.attr("etichetta") != "") $("#contentMK2 .titConclusioni").focus();else $("#contentMK2 .txtConclusioni").focus();
		  document.querySelector("#contentMK2 .pulsRiavvia").addEventListener("click", riavviaGioco);
		  if( gioco.fineGame.attr("presenzaPulsanteRisSucc")=="1" ){
			document.querySelector("#contentMK2 .pulsRisSucc").addEventListener("click", risorsaSuccessiva);
		  }
		});
	
	
	}
	
	
  }
} //risorsa successiva


function risorsaSuccessiva() {
  app.pillnavigator.tryToGoToNextItemCover();
}

function riavviaGioco() {
  $("#contentMK2 .conclusione").fadeOut("slow");

  if (gioco.fattoreIntero <= 1) {
    gioco.strFine = "";
    gioco.nrPallinoAttuale = 1;
    gioco.nrPallinoAttualeSmart = 1;
    gioco.nrSchermata = 0;
    gioco.contaDragNavigazione = 0;
    caricaContenutiGioco();
  }

  for (var i = 0; i < gioco.cards.find("card").length; i++) {
    gioco.cardsViste[i] = 0;
    //$("#contentMK2 #cardVista" + i).css("visibility", "visible");
	$("#contentMK2 #cardVista" + i).css("visibility", "hidden");
  }
}

function apriAudio() {
  $('#lettoreAudio').attr("src", gioco.stringaURL + "" + gioco.cards.find("card:eq(" + cardAperta + ")").children("audio").text());

  if (!gioco.audioInPlay) {
    gioco.audioInPlay = true;
    $("#contentMK2 .txtaudioboxCard").html(gioco.cards.attr("etichettaAudioPause"));
    $('#contentMK2 #lettoreAudio')[0].play();
  } else {
    gioco.audioInPlay = false;
    $("#contentMK2 .txtaudioboxCard").html(gioco.cards.attr("etichettaAudioPlay"));
    $('#contentMK2 #lettoreAudio')[0].pause();
  }
}