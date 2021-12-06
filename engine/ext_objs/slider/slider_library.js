"use strict";

var giocoSlider = {
  content: "",
  istruzioni: "",
  nodoRighetta: "",
  alphaMiniature: 0,
  slide: "",
  fineGame: "",
  stringaURL: "",
  boxHelp: "",
  boxHelpSmart: "",
  indiceSpostamento: null,
  slideViste: new Array(),
  varInterval: null,
  primaVolta: true,
  mostrami: "",
  posizioneAttuale: 0,
  page: 1,
  totPage: 0,
  isMobile: false,
  slideSelezionata: 0,
  movimentoSlide: 0,
  deltaSlide: 0,
  miniaturePerSchermata: 0,
  cMinStart: 0,
  cMinStop: 0,
  usoTablet: false,
  orientamento: "",
  numMiniaturaSel: 0,
  internetExplorer: 0
};

function slider_initFunction(contenutiSlider, folderReference) {
  giocoSlider.content = contenutiSlider;
  giocoSlider.istruzioni = contenutiSlider.find("istruzioni");
  giocoSlider.alphaMiniature = contenutiSlider.attr("opacitaMiniature");
  giocoSlider.nodoRighetta = contenutiSlider.find("righettaTimeline");
  giocoSlider.stringaURL = folderReference;
  giocoSlider.fineGame = contenutiSlider.find("fineGame");
  giocoSlider.boxHelp = contenutiSlider.find("boxHelp");
  giocoSlider.boxHelpSmart = contenutiSlider.find("boxHelpSmart");
  giocoSlider.indiceSpostamento = null;
  //giocoSlider.primaVolta = true;
  giocoSlider.posizioneAttuale = 0;
  giocoSlider.page = 1;
  giocoSlider.slideSelezionata = 0;
  giocoSlider.deltaSlide = 0;
  giocoSlider.miniaturePerSchermata = 0;
  giocoSlider.cMinStart = 0;
  giocoSlider.cMinStop = 0;
  giocoSlider.usoTablet = false;
  
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {//alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));        
		//internet explorer
		giocoSlider.internetExplorer = 1;
    }
    else  // If another browser, return 0
    {
        //alert('otherbrowser');
		giocoSlider.internetExplorer = 0;
    }

  for (var s = 0; s < giocoSlider.content.children("slide").length; s++) {
    giocoSlider.slideViste[s] = 0;
  }

  if (giocoSlider.content.attr("tracciaSubito") == "true") {
    /// complete at start
    app.main.tracer.completeCurrentItem();
  }

  if (window.innerHeight > window.innerWidth) {
    //portrait
    giocoSlider.orientamento = "portrait";
  }

  if (window.innerWidth > window.innerHeight) {
    //landscape
    giocoSlider.orientamento = "landscape";
  } //var sampleHtml = "\n\t\t\t<div id=\"game_slider\" class=\"game_slider\">\n\t\t\t\n\t\t\t\t<div id=\"sfondoImg\" class=\"sfondoImg\"></div>\n\t\t\t\n\t\t\t\t<div class=\"conclusioneSlider\">\n\t\t\t\t\t<div class='contTxtConclusioni' role='dialog' aria-labelledby='titConclusioni' aria-describedby='txtConclusioni' tabindex='-1'>\n\t\t\t\t\t\t<div class='headerConclusione'>\n\t\t\t\t\t\t\t<div class='pulsChiudiConclusione' tabindex='-1' role='button' aria-label=''></div>\t\t\t\t\t\t\n\t\t\t\t\t\t\t<div id='titConclusioni' class='titConclusioni' tabindex='-1'></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<hr class='hrConclusione'>\n\t\t\t\t\t\t<div id='txtConclusioni' class='txtConclusioni' tabindex='-1'></div>\n\t\t\t\t\t\t<div class='contPulsRiavviaSlider'>\n\t\t\t\t\t\t\t<div class='pulsRisSuccSlider' tabindex='-1' role='button' aria-label=''></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\n\t\t\t\t<div class=\"boxHelp\" role=\"dialog\" aria-labelledby=\"etichettaHelp\" aria-describedby=\"txtboxHelp\"></div>\n\t\t\t\n\t\t\t\t<div class=\"istruzioniSlider\">\" + giocoSlider.istruzioni.text() + "</div>\n\t\t\t\t<div class=\"sliderGroup\">\n\t\t\t\t\n\t\t\t\t\t<div class=\"corniceCentrale\">\n\t\t\t\t\t\t<div class=\"contSection\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"contCarousel\">\n\t\t\t\t\t\t<nav id=\"slider_leftArrow_nav\" tabindex=\"-1\" class=\"slider_arrow_nav\" role=\"link\" aria-label=\"" + app.labels.nav_backward + "\">\n\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"ax_desktop_cover_arrows_img svg replaced-svg\" alt=\"prev\" role=\"presentation\"><path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>\t\t\t\t\t\t\n\t\t\t\t\t\t</nav>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<div class='righettacontMiniature' tabindex='-1'></div>\n\t\t\t\t\t<div class=\"visoreCarousel\"></div>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<nav id=\"slider_rightArrow_nav\" tabindex=\"-1\" class=\"slider_arrow_nav\" role=\"link\" aria-label=\"" + app.labels.nav_forward + "\">\n\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"ax_desktop_cover_arrows_img svg replaced-svg\" alt=\"next\" role=\"presentation\"><path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>\n\t\t\t\t\t\t</nav>\n\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t</div>\n\t\t\t</div>";


  var sampleHtml = "\n\t\t\t<div id=\"game_slider\" class=\"game_slider\">\n\t\t\t\n\t\t\t\t<div id=\"sfondoImg\" class=\"sfondoImg\"></div>\n\t\t\t\n\t\t\t\t<div class=\"conclusioneSlider\">\n\t\t\t\t\t<div class='contTxtConclusioni' role='dialog' aria-labelledby='titConclusioni' aria-describedby='txtConclusioni' tabindex='-1'>\n\t\t\t\t\t\t<div class='headerConclusione'>\n\t\t\t\t\t\t\t<div class='pulsChiudiConclusione' tabindex='-1' role='button' aria-label=''></div>\t\t\t\t\t\t\n\t\t\t\t\t\t\t<div id='titConclusioni' class='titConclusioni' tabindex='-1'></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<hr class='hrConclusione'>\n\t\t\t\t\t\t<div id='txtConclusioni' class='txtConclusioni' tabindex='-1'></div>\n\t\t\t\t\t\t<div class='contPulsRiavviaSlider'>\n\t\t\t\t\t\t\t<div class='pulsRisSuccSlider' tabindex='-1' role='button' aria-label=''></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\n\t\t\t\t<div class=\"boxHelp\" role=\"dialog\" aria-labelledby=\"etichettaHelp\" aria-describedby=\"txtboxHelp\"></div>\n\t\t\t\n\t\t\t\t<div class=\"istruzioniSlider\">" + giocoSlider.istruzioni.text() +"</div>\n\t\t\t\t<div class=\"sliderGroup\">\n\t\t\t\t\n\t\t\t\t\t<div class=\"corniceCentrale\">\n\t\t\t\t\t\t<div class=\"contSection\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"contCarousel\">\n\t\t\t\t\t\t<nav id=\"slider_leftArrow_nav\" tabindex=\"-1\" class=\"slider_arrow_nav\" role=\"link\" aria-label=\"" + app.labels.nav_backward + "\">\n\t\t\t\t\t\t<img src=\"./engine/icons/chevron_left_24px.svg\" />\t\t\t\t\t\t\n\t\t\t\t\t\t</nav>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<div class='righettacontMiniature' tabindex='-1'></div>\n\t\t\t\t\t<div class=\"visoreCarousel\"></div>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<nav id=\"slider_rightArrow_nav\" tabindex=\"-1\" class=\"slider_arrow_nav\" role=\"link\" aria-label=\"" + app.labels.nav_forward + "\">\n\t\t\t\t\t\t<img src=\"./engine/icons/chevron_right_24px.svg\" />\n\t\t\t\t\t\t</nav>\n\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t</div>\n\t\t\t</div>";
  $(".ax_box_pill_container .ax_current_object_container").html(sampleHtml);
  creaContenutiSlider();
  document.querySelector("#slider_leftArrow_nav").addEventListener("click", muoviCarosello);
  document.querySelector("#slider_rightArrow_nav").addEventListener("click", muoviCarosello); /// Listen to keyboard navigationsss

  $(document).on("keydown", function (e) {
    /// ESC to exit
    if (e.which == 27) {
      $("#ax_desktop_header_icon_id_" + app.global.CURRENT_OBJECT_INDEX + ".ax_desktop_header_icon").click();
    } /// return (13) on arrow focus


    if (e.which == 13 || e.which == 32) {
      if (document.activeElement.className == "miniature") {
        giocoSlider.indiceSpostamento = parseInt(document.activeElement.id.substr(2));
        apriSlide();
      }

      if (document.activeElement.className == "chiudiBoxHelpSlider") {
        chiudiBoxHelpSlider();
      }

      if (document.activeElement.className == "pulsChiudiConclusione") {
        chiudiConclusione();
      }

      if (document.activeElement.id == "slider_leftArrow_nav") {
        muoviCarosello();
      }

      if (document.activeElement.id == "slider_rightArrow_nav") {
        muoviCarosello();
      }
    }
  });
  $(document).on("keyup", function (e) {
    if (e.which == 9) {
      if (document.activeElement.className == "miniature") {
        var indiceSelezionato = parseInt(document.activeElement.id.substr(2));
        giocoSlider.numMiniaturaSel = indiceSelezionato;
        selezionaMiniaturaTab();
      }
    }
  });
}

function selezionaMiniaturaTab() {
  //giocoSlider.alphaMiniature = 
  for (var i = 0; i < giocoSlider.content.children("slide").length; i++) {
    //$("#game_slider #dm" + i).css("opacity", giocoSlider.alphaMiniature);
    $("#game_slider #mi" + i).css("opacity", giocoSlider.alphaMiniature);
  }
//console.log("////////////////// dm" + giocoSlider.numMiniaturaSel)
  var miniatura = document.getElementById("dm" + giocoSlider.numMiniaturaSel);
  TweenLite.to(miniatura, 0.3, {
    scaleX: 1,
    scaleY: 1,
    opacity: 1
  });
}

function creaContenutiSlider() {
  //console.log("giocoSlider.orientamento: " + giocoSlider.orientamento); //if (!app.global.IS_SMARTPHONE || $(".ax_current_object_container").width() >= 768) {
	  // window.innerWidth

  if (giocoSlider.orientamento == "landscape" && $(".ax_current_object_container").width() >= 860 || giocoSlider.orientamento == "portrait" && $(".ax_current_object_container").width() >= 768) {
    giocoSlider.usoTablet = true;
  } else {
    giocoSlider.usoTablet = false;
  }
  /*font e dimensione di riferimento*/

  if(giocoSlider.content.attr("fontFamily")!="")
	$("#game_slider").css("font-family", giocoSlider.content.attr("fontFamily"));
  if(giocoSlider.content.attr("fontSize")!="")
	$("#game_slider").css("font-size", giocoSlider.content.attr("fontSize")); //colore di sfondo
  if(giocoSlider.content.attr("bgColor")!="")
	$(".game_slider").css("background-color", giocoSlider.content.attr("bgColor")); //colore righettacontMiniature
  //var nodoRighetta = contenutiSlider.find("righettaTimeline");

  var presenzaRighetta = giocoSlider.nodoRighetta.attr("presenza");

  if (presenzaRighetta == "1") {
	  
    $("#game_slider .righettacontMiniature").css("display", "block");
	//console.log($("#game_slider .righettacontMiniature").css("top"));
    var coloreSX = giocoSlider.nodoRighetta.attr("coloreSX");
    var coloreCC = giocoSlider.nodoRighetta.attr("coloreCC");
    var coloreDX = giocoSlider.nodoRighetta.attr("coloreDX");
	if( (coloreSX!="")||(coloreCC!="")||(coloreDX!="") ){
		if(giocoSlider.internetExplorer==0){
		$("#game_slider .righettacontMiniature").css("background", "-webkit-linear-gradient(left, " + coloreSX + " 0%, " + coloreCC + " 6%, " + coloreCC + " 94%, " + coloreDX + " 100%)");}
		else{
			$("#game_slider .righettacontMiniature").css("background",coloreCC);
		}
	}
  } else {
    $("#game_slider .righettacontMiniature").css("display", "none");
  } //immagine di sfondo


  if (giocoSlider.content.attr("bgImage").length > 0) {
    $(".game_slider #sfondoImg").html("<img alt='" + giocoSlider.content.attr("altBgImage") + "' tabindex='-1' src=\"" + giocoSlider.stringaURL + giocoSlider.content.attr("bgImage") + "" + "\"/>");
  }

  var strSection = "";
  strSection += "";
  strSection += "";
  var strMiniature = ""; //strMiniature += "<div class='righettacontMiniature'></div>";

  strMiniature += "<div class='contMiniature'>";

  for (var i = 0; i < giocoSlider.content.children("slide").length; i++) {
    //parte centrale//
    strSection += "<section>";
    strSection += "<div id='slide" + i + "' class='contenitoreOggetti'>";

    if (giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").text() != "") {
      strSection += "<div id='slTit" + i + "' class='titSlide' role='heading' aria-level='2' tabindex='-1' aria-label='" + giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").attr("aria-label-titolo") + "'>";
      strSection += giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").text();
      strSection += "</div>";
    } //console.log("----------: "+giocoSlider.orientamento+ " ////: "+giocoSlider.usoTablet)


    if (giocoSlider.content.find("slide:eq(" + i + ")").children("img").attr("presenzaImg") != "0") {
      //if (giocoSlider.content.find("slide:eq(" + i + ")").children("testo").text() != "" && giocoSlider.usoTablet) {
      if (giocoSlider.content.find("slide:eq(" + i + ")").children("testo").text() != "") {
        if (giocoSlider.orientamento == "landscape" || giocoSlider.usoTablet) strSection += "<div class='imgSlide' style='float:left; width:60%'>";else strSection += "<div class='imgSlide'>";
      } else {
        strSection += "<div class='imgSlide'>";
      }

      strSection += "<img id='slImg" + i + "' alt='" + giocoSlider.content.find("slide:eq(" + i + ")").children("img").attr("alt") + "' tabindex='-1' src=\"" + giocoSlider.stringaURL + giocoSlider.content.find("slide:eq(" + i + ")").children("img").text() + "" + "\"/>";
      strSection += "</div>";
    } else {
      //c'è il video

      /*video*/
      if (giocoSlider.content.find("slide:eq(" + i + ")").children("testo").text() != "") {
		  //console.log("**********************")
        if (giocoSlider.orientamento == "landscape" || giocoSlider.usoTablet) strSection += "<div class='videoboxCard' style='float:left; width:60%'>";else strSection += "<div class='videoboxCard'>";
        strSection += "<table width='100%' height='100%' border='0' align=\"center\"><tr><td valign='top' align='center'>";
        strSection += "<video id='slVideo" + i + "' tabindex='-1' aria-label='" + giocoSlider.content.find("slide:eq(" + i + ")").children("video").attr("aria-label-video") + "' width=\"auto\" controls poster='"+giocoSlider.stringaURL + "/poster.jpg'>";
      } else {
        strSection += "<div class='videoboxCard'>";
        strSection += "<table width='100%' height='100%' border='0' align=\"center\"><tr><td valign='top' align='center'>";
        strSection += "<video id='slVideo" + i + "' tabindex='-1' aria-label='" + giocoSlider.content.find("slide:eq(" + i + ")").children("video").attr("aria-label-video") + "' height=\"auto\" controls poster='"+giocoSlider.stringaURL + "/poster.jpg'>";
      }

      strSection += "<source src='" + giocoSlider.stringaURL + giocoSlider.content.find("slide:eq(" + i + ")").children("video").text() + "' type='video/mp4'>";
      strSection += "Your browser does not support the video tag.";
      strSection += "</video>";
      strSection += "</td></tr></table></div>";
      /*video*/
    }

    if (giocoSlider.content.find("slide:eq(" + i + ")").children("testo").text() != "") {
      if (giocoSlider.usoTablet) {
        strSection += "<div id='slTxt" + i + "' class='txtSlide' tabindex='-1' style='float:left; width:38%'>";
      } else {
        if (giocoSlider.orientamento == "landscape" || giocoSlider.usoTablet) strSection += "<div id='slTxt" + i + "' class='txtSlide' tabindex='-1' style='float:left; width:38%'>";else strSection += "<div id='slTxt" + i + "' class='txtSlide' tabindex='-1'>";
      }

      strSection += giocoSlider.content.find("slide:eq(" + i + ")").children("testo").text();
      strSection += "</div>";
    }
    /*pulsante download risorse*/


    if (giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").text() != "") {
      if (giocoSlider.content.find("slide:eq(" + i + ")").children("testo").text() != "") {
        strSection += "<div class='contDownloadRisorse contDownloadRisorseHalf'>";
      } else {
        strSection += "<div class='contDownloadRisorse contDownloadRisorseFull'>";
      }

      strSection += "<div class='pulsanteDownloadRisorsa'>";
      strSection += "<a id='pulsDwnl" + i + "' aria-label='" + giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("aria-label-materiale") + "' href='" + giocoSlider.stringaURL + giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").text() + "' class='collegamentoDownload' tabindex='-1' target='_blank'>";
      strSection += giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("etichetta");
      strSection += "</a>";
      strSection += "</div>";
      strSection += "</div>";
    }
    /*pulsante download risorse*/


    strSection += "</div>";
    strSection += "</section>"; //parte centrale//
    //miniature//

    strMiniature += "<div class='miniature' id='dm" + i + "' role='button' tabindex='-1' aria-label='" + giocoSlider.content.find("slide:eq(" + i + ")").children("miniatura").attr("aria-label-miniatura") + "'>";
    var spuntaVerde = "<svg id='svgSpuntaVerde' aria-label='"+giocoSlider.content.attr("aria-label-vista")+"' width='18' height='18' style='enable-background:new 0 0 138 138;' version='1.1' viewBox='0 0 138 138' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><circle class='st0' cx='64' cy='64' r='64'/></g><g><path class='st1' d='M54.3,97.2L24.8,67.7c-0.4-0.4-0.4-1,0-1.4l8.5-8.5c0.4-0.4,1-0.4,1.4,0L55,78.1l38.2-38.2   c0.4-0.4,1-0.4,1.4,0l8.5,8.5c0.4,0.4,0.4,1,0,1.4L55.7,97.2C55.3,97.6,54.7,97.6,54.3,97.2z'/></g></svg>"; //titoletto		

    strMiniature += "<div id='tm" + i + "' class='titoletto'>";

    if (giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").attr("presenzaInMiniatura") == "1") {
      strMiniature += "<table width='100%' height='100%' alifn='center'><tr><td height='100%' valign='middle'>" + giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").text() + "</td></tr></table>";
    }

    strMiniature += "</div>";
    strMiniature += "<div aria-hidden='true' style='width:100%;'>";
    strMiniature += "<div class='contenitoreMiniatura'>";
    strMiniature += "<img id='mi" + i + "' alt='" + giocoSlider.content.find("slide:eq(" + i + ")").children("miniatura").attr("alt") + "' src=\"" + giocoSlider.stringaURL + giocoSlider.content.find("slide:eq(" + i + ")").children("miniatura").text() + "" + "\"/>";
    strMiniature += "</div>";
	strMiniature += "<div class='sfdContenitoreMiniatura'></div>";
    strMiniature += "<div id='minVista" + i + "' class='minVista' aria-hidden='true' tabindex='-1'>";
    strMiniature += spuntaVerde;
    strMiniature += "</div>";
    strMiniature += "</div>";
    strMiniature += "</div>";
    strMiniature += "";
    strMiniature += "";
    strMiniature += ""; //miniature//
  }

  strMiniature += "</div>";
  $("#game_slider .corniceCentrale .contSection").html(strSection);
  $("#game_slider .visoreCarousel").html(strMiniature);
  $("#game_slider .contSection").css("width", $(".ax_current_object_container").width() * giocoSlider.content.find("slide").length);
  $("#game_slider .contMiniature").css("width", ($("#game_slider .miniature").outerWidth() + 10) * giocoSlider.content.find("slide").length);
  $("#game_slider .corniceCentrale .contSection section").css("width", $(".ax_current_object_container").width());
  var scarto;
  if (giocoSlider.usoTablet) scarto = $(".ax_object_container").width() * 0.05 * 2; //0.05 è il 5% di mascheratura del carosello
  else scarto = $(".ax_object_container").width() * 0.10 * 2; //0.10 è il 10% di mascheratura del carosello smartphone

  /*if (giocoSlider.usoTablet) {
    giocoSlider.totPage = Math.floor($("#game_slider .contMiniature").width() / ($(".ax_current_object_container").width() / 2));
  } else {
    giocoSlider.totPage = Math.ceil($("#game_slider .contMiniature").width() / (($(".ax_current_object_container").width() - scarto / 2) / 2));
  }*/
  giocoSlider.totPage = Math.floor($("#game_slider .contMiniature").width() / ($("#game_slider .visoreCarousel").width() / 2));

  if (giocoSlider.totPage <= 1) {
    $("#game_slider #slider_rightArrow_nav").hide();
    $("#game_slider #slider_leftArrow_nav").hide();
    $("#game_slider .contMiniature").css("margin", "0 auto");
  } else {
    if (giocoSlider.page == 1) {
      $("#game_slider #slider_rightArrow_nav").show();
      $("#game_slider #slider_leftArrow_nav").hide();
    }

    //if (giocoSlider.usoTablet) $("#game_slider .contMiniature").css("margin-left", "5%");else $("#game_slider .contMiniature").css("margin-left", "10%");
  }

  var slider = "";

  for (var i = 0; i < giocoSlider.content.children("slide").length; i++) {
    slider = document.getElementById("slide" + i);
    TweenLite.to(slider, 0.5, {
      scaleX: 0.9,
      scaleY: 0.9,
      opacity: 1
    });
    document.querySelector("#dm" + i).addEventListener("click", indiceSlide); //TITOLO SLIDE
	
	
	//var indiceSelezionato = parseInt(event.target.id.substr(2));
		var miniatura = document.getElementById("dm" + i);
		var miniaturaFoto = document.getElementById("mi" + i);
		TweenLite.to(miniatura, 0.3, {
		  scaleX: 1,
		  scaleY: 1,
		  opacity: 1
		});
		if(i!=0){
			TweenLite.to(miniaturaFoto, 0.3, {
			  scaleX: 1,
			  scaleY: 1,
			  opacity: 0.5
			});
		}
	
	

    if (giocoSlider.usoTablet) {
	  if(giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").attr("txtboxSize")!="")
		$("#game_slider #slTit" + i).css("fontSize", giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").attr("txtboxSize"));
	  if(giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").attr("txtboxLineHeight")!="")
		$("#game_slider #slTit" + i).css("lineHeight", giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").attr("txtboxLineHeight"));
    }
	if(giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").attr("textColor")!="")
		$("#game_slider #slTit" + i).css("color", giocoSlider.content.find("slide:eq(" + i + ")").children("titolo").attr("textColor")); //TESTO SLIDE

    if (giocoSlider.usoTablet) {
	  if(giocoSlider.content.find("slide:eq(" + i + ")").children("testo").attr("txtboxSize")!="")
		$("#game_slider #slTxt" + i).css("fontSize", giocoSlider.content.find("slide:eq(" + i + ")").children("testo").attr("txtboxSize"));
	  if(giocoSlider.content.find("slide:eq(" + i + ")").children("testo").attr("txtboxLineHeight")!="")
		$("#game_slider #slTxt" + i).css("lineHeight", giocoSlider.content.find("slide:eq(" + i + ")").children("testo").attr("txtboxLineHeight"));
    }
	if(giocoSlider.content.find("slide:eq(" + i + ")").children("testo").attr("textColor")!="")
		$("#game_slider #slTxt" + i).css("color", giocoSlider.content.find("slide:eq(" + i + ")").children("testo").attr("textColor")); //PULSANTE DOWNLOAD RISORSE

    if (giocoSlider.usoTablet) {
		
	  if(giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("txtboxSize")!="")
		$("#game_slider .contDownloadRisorse .pulsanteDownloadRisorsa:eq(" + i + ")").css("fontSize", giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("txtboxSize"));
	
	  if(giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("txtboxLineHeight")!="")
		$("#game_slider .contDownloadRisorse .pulsanteDownloadRisorsa:eq(" + i + ")").css("lineHeight", giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("txtboxLineHeight"));
    } //colore miniature


    var coloresfondoMiniatura = giocoSlider.content.find("slide:eq(" + i + ")").children("miniatura").attr("bgcolor");
	if(coloresfondoMiniatura!="")
		$("#game_slider .miniature:eq(" + i + ")").css("background-color", coloresfondoMiniatura);
	if(giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("textColor")!="")
		$("#game_slider .contDownloadRisorse .pulsanteDownloadRisorsa a:eq(" + i + ")").css("color", giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("textColor"));
	if(giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("bgColor")!="")
		$("#game_slider .contDownloadRisorse .pulsanteDownloadRisorsa:eq(" + i + ")").css("background-color", giocoSlider.content.find("slide:eq(" + i + ")").children("materiale").attr("bgColor"));
	if(giocoSlider.content.find("slide:eq(" + i + ")").attr("contenitoreOggettiBgColor")!="")
		$("#game_slider .contenitoreOggetti:eq(" + i + ")").css("background-color", giocoSlider.content.find("slide:eq(" + i + ")").attr("contenitoreOggettiBgColor")); //#game_slider .contenitoreOggetti
  } //$("#game_slider .miniature").css("opacity", giocoSlider.alphaMiniature);


  $("#game_slider .miniature img").css("opacity", giocoSlider.alphaMiniature);
  $("#game_slider #dm0").css("opacity", 1);
  $("#game_slider #mi0").css("opacity", 1);
  var labelSlideVista = giocoSlider.content.attr("aria-label-vista");
  var labelSlide = giocoSlider.content.find("slide:eq(0)").children("miniatura").attr("aria-label-miniatura");
  $("#game_slider #dm0").attr("aria-label", labelSlideVista + ", " + labelSlide);
  var primaSlide = document.getElementById("slide0");
  TweenLite.to(primaSlide, 0.5, {
    scaleX: 1.1,
    scaleY: 1.1,
    opacity: 1
  });
  /*manipolo css*/
  //ISTRUZIONI

  if (giocoSlider.usoTablet) {
    $("#game_slider .istruzioniSlider").css("top", giocoSlider.istruzioni.attr("topIstruzioni"));
	if(giocoSlider.istruzioni.attr("sizeIstruzioni")!="")
		$("#game_slider .istruzioniSlider").css("fontSize", giocoSlider.istruzioni.attr("sizeIstruzioni"));
	if(giocoSlider.istruzioni.attr("lineHeight")!="")
		$("#game_slider .istruzioniSlider").css("lineHeight", giocoSlider.istruzioni.attr("lineHeight"));
  }
  /*help*/


  giocoSlider.mostrami = giocoSlider.boxHelp.attr("mostrami");

giocoSlider.miniaturePerSchermata = Math.floor(($(".ax_object_container").width() - scarto) / $("#game_slider .miniature").outerWidth());
  giocoSlider.cMinStop = giocoSlider.miniaturePerSchermata; 

  giocoSlider.slideViste[0] = 1;//la prima slide è subito visibile, quindi la metto subito come vista
  $("#game_slider #minVista0").css("visibility", "visible");
  
  if (giocoSlider.mostrami == "true" && giocoSlider.primaVolta) {
    giocoSlider.primaVolta = false;
    var strBoxHelp = "";
    strBoxHelp += "<div class='muoviBoxHelp'>";
    strBoxHelp += "<div class='contboxHelp'>";
    strBoxHelp += "<div class='titboxHelp'>";
    strBoxHelp += "<table width='100%' border='0'><tr><td id='distanziaEtHelp' style='text-align=center;'></td><td id='cellaIconaHelp' width='30px' style='text-align=center; valign:middle;'>";
    strBoxHelp += "<!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon --><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' xml:space='preserve'><metadata> Svg Vector Icons :http://www.onlinewebfonts.com/icon </metadata><g><path fill='#FFFFFF' d='M500,9.8C229.4,9.8,10,229.3,10,500c0,270.7,219.4,490.2,490,490.2c270.6,0,490-219.5,490-490.2C990,229.3,770.6,9.8,500,9.8z M500,908.5C274.5,908.5,91.7,725.6,91.7,500C91.7,274.4,274.5,91.5,500,91.5c225.5,0,408.3,182.9,408.3,408.5C908.3,725.6,725.5,908.5,500,908.5z M459.2,744.8h81.7v-80.4l-81.9-1L459.2,744.8z M620.5,278.3c-35-25.3-72.7-36.5-125.6-34.1c-28.8,1.3-67.3,10.4-94.3,29.3c-47.7,33-62.1,77.8-64.8,144.5h82.4c0-19.4,5.7-45.9,17-63.9c11.3-18,30.8-30.2,64.1-33.4c34.6-2.9,57,9.2,67.2,18.1c25.5,23,15.2,81.1-6.1,104c-9.1,10.4-48.5,40.8-48.5,40.8c-25.2,19.7-37,37.1-43.1,52.2c-6.1,15.2-8.6,47.6-10,87.2h82.5l0.7-9.6c0,0-8.2-57,21.9-76.4l38.9-25.7c25.2-19.6,32.1-26.9,41-39.6c15.2-20.9,26.6-46.5,26.6-77C670.5,344.9,655.5,303.6,620.5,278.3z'/></g></svg>";
    strBoxHelp += "</td><td><div id='etichettaHelp' tabindex='31'>" + giocoSlider.boxHelp.attr("etichetta") + "</div></td><td width='20px'><div class='chiudiBoxHelpSlider' style='text-align:right; cursor:pointer;' role='button' aria-label='" + giocoSlider.boxHelp.attr("aria-label-help") + "' tabindex='33'>";
    strBoxHelp += "<svg id=\"svgChiudiHelp\" data-name=\"svgChiudiHelp\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.slider_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"slider_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
    strBoxHelp += "</div></td></tr></table>";
    strBoxHelp += "</div>";
    strBoxHelp += "<hr>";
    strBoxHelp += "<div id='txtboxHelp' class='txtboxHelp' tabindex='32'>"; //boxHelpSmart

    if (app.global.IS_SMARTPHONE && $(".ax_current_object_container").width() < 768) {
      strBoxHelp += giocoSlider.boxHelpSmart.text();
    } else {
      strBoxHelp += giocoSlider.boxHelp.text();
    }

    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    strBoxHelp += "</div>";
    $("#game_slider .boxHelp").html(strBoxHelp);
    $("#game_slider .boxHelp").css("display", "block");
	var animationDurationFirst = 800;
    if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
    $("#game_slider .muoviBoxHelp").fadeIn().css({
      top: -200,
      position: 'absolute'
    }).animate({
      top: 5
    }, animationDurationFirst, function () {
      //callback
      $("#game_slider #etichettaHelp").focus();
    });
    document.querySelector(".chiudiBoxHelpSlider").addEventListener("click", chiudiBoxHelpSlider);
  } else {
	  indicizzaSlide();
    //if (giocoSlider.istruzioni.text().length > 0) $("#game_slider .istruzioniSlider:eq(" + giocoSlider.slideSelezionata + ")").focus();else $("#game_slider .titSlide:eq(" + giocoSlider.slideSelezionata + ")").focus();
	  
	  
	  
    //se non è presente l'help, inserire il focus sul primo oggetto
    if (giocoSlider.istruzioni.text().length > 0) $("#game_slider .istruzioniSlider:eq(" + giocoSlider.slideSelezionata + ")").focus();else $("#game_slider #slTit" + giocoSlider.slideSelezionata).focus();
  } // device detection


  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
    giocoSlider.isMobile = true;
  } // device detection end


  if (!giocoSlider.isMobile) {
    for (var m = 0; m < giocoSlider.content.children("slide").length; m++) {
      document.querySelector("#dm" + m).addEventListener("mouseover", miniatureOver);
      document.querySelector("#dm" + m).addEventListener("mouseout", miniatureOut);
    }
  }

  
}

function miniatureOver(event) {
  //$("#game_slider .miniature").css("opacity", giocoSlider.content.attr("opacitaMiniature"));
  
  if (event.target.id.length > 0) {
	  //console.log( event.target.id.indexOf("minVista")+ " ******************: "+event.target.id )
	if( (event.target.id.indexOf("minVista")!=0)&&(event.target.id.indexOf("svgSpuntaVerde")!=0) ){
		  //console.log("******************: "+event.target.id)
	  
		var indiceSelezionato = parseInt(event.target.id.substr(2));
		var miniatura = document.getElementById("dm" + indiceSelezionato);
		var miniaturaFoto = document.getElementById("mi" + indiceSelezionato);
		TweenLite.to(miniatura, 0.3, {
		  scaleX: 1,
		  scaleY: 1,
		  opacity: 1
		});
		TweenLite.to(miniaturaFoto, 0.3, {
		  scaleX: 1.1,
		  scaleY: 1.1,
		  opacity: 1
		});
	}
  }
}

function miniatureOut(event) {
  var miniatura;
  var miniaturaFoto;
  var miniaturaSelezionata = document.getElementById("dm" + giocoSlider.slideSelezionata);
  var miniaturaImgSelezionata = document.getElementById("mi" + giocoSlider.slideSelezionata);

  for (var m = 0; m < giocoSlider.content.children("slide").length; m++) {
    miniatura = document.getElementById("dm" + m);
    miniaturaFoto = document.getElementById("mi" + m);
    TweenLite.to(miniatura, 0.2, {
      scaleX: 1,
      scaleY: 1 //opacity: giocoSlider.alphaMiniature

    });
    TweenLite.to(miniaturaFoto, 0.2, {
      scaleX: 1,
      scaleY: 1,
      opacity: giocoSlider.alphaMiniature
    });
  }

  TweenLite.to(miniaturaSelezionata, 0.2, {
    scaleX: 1,
    scaleY: 1,
    opacity: 1
  });
  TweenLite.to(miniaturaImgSelezionata, 0.2, {
    scaleX: 1,
    scaleY: 1,
    opacity: 1
  });
}

function indiceSlide(event) {
  //giocoSlider.indiceSpostamento = parseInt(document.activeElement.id.substr(2));
  if (event.target.id.length > 0) {
	  //console.log( event.target.id.indexOf("minVista")+ " ******************: "+event.target.id )
	if( (event.target.id.indexOf("minVista")!=0)&&(event.target.id.indexOf("svgSpuntaVerde")!=0) ){
	  giocoSlider.indiceSpostamento = parseInt(event.target.id.substr(2));
	  apriSlide();
	}
  }
}

function apriSlide(event) {
	//console.log(event.target.id)
  inibisciSlide();
  giocoSlider.slideSelezionata = giocoSlider.indiceSpostamento;
  //console.log("giocoSlider.slideSelezionata: "+giocoSlider.slideSelezionata);
  $("#game_slider video").each(function () {
    $(this).get(0).pause();
  }); //blocco tutti i video in esecuzione

  var strCompletato = "";
  giocoSlider.slideViste[giocoSlider.indiceSpostamento] = 1;
  $("#game_slider #minVista" + giocoSlider.indiceSpostamento).css("visibility", "visible");
  var labelSlideVista = giocoSlider.content.attr("aria-label-vista");
  var labelSlide = giocoSlider.content.find("slide:eq(" + giocoSlider.indiceSpostamento + ")").children("miniatura").attr("aria-label-miniatura");

  if ($("#game_slider #dm" + giocoSlider.indiceSpostamento).is(":visible")) {
    $("#game_slider #dm" + giocoSlider.indiceSpostamento).attr("aria-label", labelSlideVista + ", " + labelSlide);
  }

  for (var s = 0; s < giocoSlider.content.children("slide").length; s++) {
    document.querySelector("#dm" + s).removeEventListener("click", indiceSlide);

    if (giocoSlider.slideViste[s] == 1) {
      strCompletato += "1";
    } else {
      strCompletato += "0";
    }
  }

  if (strCompletato.indexOf("0") == "-1") {
    //completato
    if (giocoSlider.content.attr("tracciaSubito") != "true") {
      app.main.tracer.completeCurrentItem();
    }

    var indiceElementi = 30;
    $("#game_slider .contTxtConclusioni").attr("tabindex", indiceElementi);

    if (giocoSlider.fineGame.attr("etichetta") != "") {
      indiceElementi++;
      $("#game_slider #titConclusioni").html(giocoSlider.fineGame.attr("etichetta"));
      $("#game_slider #titConclusioni").attr("tabindex", indiceElementi);
    }

    indiceElementi++;
    $("#game_slider #txtConclusioni").html(giocoSlider.fineGame.text());
    $("#game_slider #txtConclusioni").attr("tabindex", indiceElementi);
    indiceElementi++;
    var svgChiudiConclusione = "<svg id=\"svgChiudiConclusione\" data-name=\"svgChiudiConclusione\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21.6 35.48\"><defs><style>.slider_cls-1{font-size:30.64px;fill:#fff;font-family:Nexa, Nexa Bold;}</style></defs><title>chiudi</title><text class=\"slider_cls-1\" transform=\"translate(0 26.04)\">X</text></svg>";
    $("#game_slider .pulsChiudiConclusione").html(svgChiudiConclusione);
    $("#game_slider .pulsChiudiConclusione").attr("tabindex", indiceElementi);
    $("#game_slider .pulsChiudiConclusione").attr("aria-label", giocoSlider.fineGame.attr("aria-label-pulsante-chiudi-box"));
    indiceElementi++;
    $("#game_slider .pulsRisSuccSlider").html(giocoSlider.fineGame.attr("pulsanteRisSucc"));
    $("#game_slider .pulsRisSuccSlider").attr("tabindex", indiceElementi);
    $("#game_slider .pulsRisSuccSlider").attr("aria-label", giocoSlider.fineGame.attr("aria-label-pulsanteRisSucc"));
    if (giocoSlider.fineGame.attr("mostrami") == "true") setTimeout(apriBoxConclusioneSlider, giocoSlider.fineGame.attr("tempoAvvio"));
  } //$("#game_slider .miniature").css("opacity", 0.5);
  //$("#game_slider .miniature").css("opacity", giocoSlider.alphaMiniature);

  $("#game_slider .miniature img").css("opacity", 0.5);
  $("#game_slider #dm" + giocoSlider.indiceSpostamento).css("opacity", 1);
  $("#game_slider #mi" + giocoSlider.indiceSpostamento).css("opacity", 1);
  var spostamento = 0;
  spostamento = $(".ax_current_object_container").width() * giocoSlider.indiceSpostamento + giocoSlider.posizioneAttuale + "px";
  $("#game_slider .contenitoreOggetti").css("opacity", 0.25);
  var slider = document.getElementsByClassName("contenitoreOggetti");
  var animationDurationSection = 500;
  if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationSection=0;}
  TweenLite.to(slider, 0.5, {
    scaleX: 1,
    scaleY: 1
  });
  //console.log("spostamento: "+spostamento)
  $("#game_slider .contSection").animate({
    marginLeft: "-=" + spostamento
  }, animationDurationSection, function () {
    // Animation complete.
    giocoSlider.posizioneAttuale = parseInt($("#game_slider .contSection").css("margin-left"));
    $("#game_slider #slide" + giocoSlider.indiceSpostamento).css("opacity", 1);
    var slider = document.getElementById("slide" + giocoSlider.indiceSpostamento);
    TweenLite.to(slider, 0.5, {
      scaleX: 1.1,
      scaleY: 1.1,
      opacity: 1,
      onComplete: abilitaMiniature
    });
    indicizzaSlide();
    $("#game_slider #slTit" + giocoSlider.indiceSpostamento).focus();
  });
}

function apriBoxConclusioneSlider() {
  //formattazione da xml
  if(giocoSlider.fineGame.attr("sfondoPulsante")!="")
	$("#game_slider .pulsRisSuccSlider").css("background-color", giocoSlider.fineGame.attr("sfondoPulsante"));
  if(giocoSlider.fineGame.attr("coloreTestoPulsante")!="")
	$("#game_slider .pulsRisSuccSlider").css("color", giocoSlider.fineGame.attr("coloreTestoPulsante"));
  if(giocoSlider.fineGame.attr("coloreTestoContenuti")!=""){
	$("#game_slider .titConclusioni").css("color", giocoSlider.fineGame.attr("coloreTestoContenuti"));
	$("#game_slider .txtConclusioni").css("color", giocoSlider.fineGame.attr("coloreTestoContenuti"));
  }
  if(giocoSlider.fineGame.attr("sfondoBox")!="")
	$("#game_slider .contTxtConclusioni").css("background-color", giocoSlider.fineGame.attr("sfondoBox"));
  $("#game_slider .conclusioneSlider").fadeIn("slow", function () {
    // Animation complete
    inibisciSlide(); //tolgo i tabindex e gli eventi da tutte le img

    if (giocoSlider.fineGame.attr("etichetta") != "") $("#game_slider .titConclusioni").focus();else $("#game_slider .txtConclusioni").focus();
    document.querySelector(".pulsChiudiConclusione").addEventListener("click", chiudiConclusione);
    document.querySelector("#game_slider .pulsRisSuccSlider").addEventListener("click", risorsaSuccessivaSlider);
  });
}

function abilitaMiniature() {
  for (var s = 0; s < giocoSlider.content.children("slide").length; s++) {
    document.querySelector("#dm" + s).addEventListener("click", indiceSlide);
  }
}

function muoviCarosello(event) {
  
  $(this).focus();
  //console.log("muoviCarosello: "+event.target+ " -- " +document.activeElement.id)
  inibisciSlide();
  var spostamentoMiniature = 0;
  var mezzaSchermata;
  var scarto;
  if (giocoSlider.usoTablet) scarto = $(".ax_object_container").width() * 0.05 * 2; //0.05 è il 5% di mascheratura del carosello
  else scarto = $(".ax_object_container").width() * 0.10 * 2; //0.10 è il 10% di mascheratura del carosello smartphone
  //if( giocoSlider.usoTablet ){

  //mezzaSchermata = ($(".ax_current_object_container").width() - scarto) / 2; 
  //console.log($("#game_slider .miniature").outerWidth())
  mezzaSchermata = $("#game_slider .visoreCarousel").width() / 2;
  
  //mezzaSchermata = $(".ax_current_object_container").width()/2;
  //}
  //else{
  //mezzaSchermata = ( ($("#game_slider .visoreCarousel").width()-scarto) / 2 );
  //}

  var verso = "";

  if (document.activeElement.id == "slider_rightArrow_nav") {
    //verso destra
    giocoSlider.page++;
    verso = "dx";

    if (giocoSlider.page == giocoSlider.totPage) {
      if (giocoSlider.usoTablet) {
        var avanzoSlide = giocoSlider.content.children("slide").length - giocoSlider.miniaturePerSchermata / 2 * giocoSlider.page;
        spostamentoMiniature = avanzoSlide * ($("#game_slider .miniature").outerWidth() + 10);
      } else {
        spostamentoMiniature = mezzaSchermata;
      }
    } else {
		//console.log("1----- spostamentoMiniature: "+spostamentoMiniature);
      spostamentoMiniature = mezzaSchermata;
    }
	

    giocoSlider.deltaSlide = Math.floor(spostamentoMiniature / $("#game_slider .miniature").outerWidth()); //di quante slide mi muovo
  }

  if (document.activeElement.id == "slider_leftArrow_nav") {
    //verso sinistra
    if (giocoSlider.page == giocoSlider.totPage) {
      if (giocoSlider.usoTablet) {
        var avanzoSlide = giocoSlider.content.children("slide").length - giocoSlider.miniaturePerSchermata / 2 * giocoSlider.page;
        spostamentoMiniature = -(avanzoSlide * ($("#game_slider .miniature").outerWidth() + 10));
      } else {
        spostamentoMiniature = -mezzaSchermata;
      }
    } else spostamentoMiniature = -mezzaSchermata;

    giocoSlider.deltaSlide = Math.ceil(spostamentoMiniature / $("#game_slider .miniature").outerWidth()); //di quante slide mi muovo

    giocoSlider.page--;
    verso = "sx";
  }

  if (giocoSlider.page == 1) {
    $("#game_slider #slider_rightArrow_nav").show();
    $("#game_slider #slider_leftArrow_nav").hide();
  } else {
    if (giocoSlider.page == giocoSlider.totPage) {
      $("#game_slider #slider_rightArrow_nav").hide();
      $("#game_slider #slider_leftArrow_nav").show();
    } else {
      $("#game_slider #slider_rightArrow_nav").show();
      $("#game_slider #slider_leftArrow_nav").show();
    }
  }
//console.log("2 spostamentoMiniature: "+spostamentoMiniature);
  var animationDurationMiniature = 500;
  if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationMiniature=0;}
  $("#game_slider .contMiniature").animate({
    marginLeft: "-=" + spostamentoMiniature + "px"
  }, animationDurationMiniature, function () {// Animation complete.
	  giocoSlider.cMinStart = giocoSlider.cMinStart + giocoSlider.deltaSlide;
	  giocoSlider.cMinStop = giocoSlider.cMinStop + giocoSlider.deltaSlide;

	  if (verso == "dx") {
		$("#game_slider #dm" + giocoSlider.numMiniaturaSel).focus();
	  } else {
		$("#game_slider #dm" + (giocoSlider.cMinStop - 1)).focus();
		giocoSlider.numMiniaturaSel = giocoSlider.cMinStop - 1;
	  }

	  selezionaMiniaturaTab();
	  indicizzaSlide();
	  $("#game_slider #mi" + giocoSlider.indiceSpostamento).css("opacity", 1);
  });
  
}

function chiudiConclusione() {
  $(".conclusioneSlider").fadeOut("slow");
  $("#game_slider .contTxtConclusioni").attr("tabindex", "-1");
  $("#game_slider #titConclusioni").attr("tabindex", "-1");
  $("#game_slider #txtConclusioni").attr("tabindex", "-1");
  $("#game_slider .pulsChiudiConclusione").attr("tabindex", "-1");
  $("#game_slider .pulsRisSuccSlider").attr("tabindex", "-1");
  indicizzaSlide();
  $("#game_slider .titSlide:eq(" + giocoSlider.slideSelezionata + ")").focus();
}

function chiudiBoxHelpSlider(e) {
  $("#game_slider .boxHelp").fadeOut("slow");
  inibisciSlide();
  var animationDurationFirst = 800;
  if(!app.global.GLOBAL_PILL_ANIMATION){animationDurationFirst=0;}
  $("#game_slider .muoviBoxHelp").fadeIn().css({
    top: 5,
    position: 'absolute'
  }).animate({
    top: -200
  }, animationDurationFirst, function () {
    //callback
    $("#game_slider .boxHelp").css("display", "none");
    indicizzaSlide();
    if (giocoSlider.istruzioni.text().length > 0) $("#game_slider .istruzioniSlider:eq(" + giocoSlider.slideSelezionata + ")").focus();else $("#game_slider .titSlide:eq(" + giocoSlider.slideSelezionata + ")").focus();
  });
} //risorsa successiva


function risorsaSuccessivaSlider() {
  app.pillnavigator.tryToGoToNextItemCover();
}

function indicizzaSlide() {
  var quanteSchermate = Math.ceil(giocoSlider.content.children("slide").length / giocoSlider.miniaturePerSchermata);
  var numeroMiniatureAttuali = 0;
  var indiceTab = 29;
  var stringaIstruzioni = giocoSlider.istruzioni.text();

  if (stringaIstruzioni.length > 0) {
    indiceTab++;
    $("#game_slider .istruzioniSlider:eq(" + giocoSlider.slideSelezionata + ")").attr("tabindex", indiceTab);
  }

  indiceTab++;
  $("#game_slider #slTit" + giocoSlider.slideSelezionata).attr("tabindex", indiceTab);

  if (giocoSlider.content.find("slide:eq(" + giocoSlider.slideSelezionata + ")").children("img").attr("presenzaImg") != "0") {
    indiceTab++;
    $("#game_slider #slImg" + giocoSlider.slideSelezionata).attr("tabindex", indiceTab);
  } else {
    indiceTab++;
    $("#game_slider #slVideo" + giocoSlider.slideSelezionata).attr("tabindex", indiceTab);
  }

  if (giocoSlider.content.find("slide:eq(" + giocoSlider.slideSelezionata + ")").children("testo").text() != "") {
    indiceTab++;
    $("#game_slider #slTxt" + giocoSlider.slideSelezionata).attr("tabindex", indiceTab);
  }

  if (giocoSlider.content.find("slide:eq(" + giocoSlider.slideSelezionata + ")").children("materiale").text() != "") {
    indiceTab++;
    $("#game_slider #pulsDwnl" + giocoSlider.slideSelezionata).attr("tabindex", indiceTab);
  }

  for (var s = giocoSlider.cMinStart; s < giocoSlider.cMinStop; s++) {
    indiceTab++;
    $("#game_slider #dm" + s).attr("tabindex", indiceTab);
  }

  if ($("#game_slider #slider_rightArrow_nav").is(":visible")) {
    indiceTab++;
    $("#game_slider #slider_rightArrow_nav").attr("tabindex", indiceTab);
  }

  if ($("#game_slider #slider_leftArrow_nav").is(":visible")) {
    indiceTab++;
    $("#game_slider #slider_leftArrow_nav").attr("tabindex", indiceTab);
  }
}

function inibisciSlide() {
  for (var s = 0; s < giocoSlider.content.children("slide").length; s++) {
    $("#game_slider .istruzioniSlider:eq(" + s + ")").attr("tabindex", "-1");
    $("#game_slider #slTit" + s).attr("tabindex", "-1");
    $("#game_slider #slImg" + s).attr("tabindex", "-1");
    $("#game_slider #slVideo" + s).attr("tabindex", "-1");
    $("#game_slider #slTxt" + s).attr("tabindex", "-1");
    $("#game_slider #pulsDwnl" + s).attr("tabindex", "-1");
    $("#game_slider #dm" + s).attr("tabindex", "-1");
  }

  $("#game_slider #slider_rightArrow_nav").attr("tabindex", "-1");
  $("#game_slider #slider_leftArrow_nav").attr("tabindex", "-1");
}