/* 
https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false

Already imported:
- jQuery 3.4.1
- Greensock GSAP 2.1 (https://greensock.com/docs/v2/)
- Bootstrap 4.3.1

*/

"use strict";
var cards =
/*#__PURE__*/
function () {
	
	//var myXml;
	
	/*var gioco = {
	
	cards:"",
	fineGame:"",
	boxHelp:"",
	
	}*/
	
	/* CONSTRUCTOR: chiamata una sola volta all'avvio della pillola */ 
	function cards() {
		
		/// All settings can be OVERIDDEN via settings XML
		//app.lib.debugOnConsole("CONSTRUCT :::game sample:::");
		this.menuItemLabel = "Cards";
		this.contentFileName = "game_cards.xml";
		this.menuItemDefaultIcon = "./engine/icons/style_24px.svg";

	}

	var _proto = cards.prototype;

	/* INIT: chiamata ogni volta al click dell'avvio di copertina */ 
	_proto.init = function init() {
		
		/// internal XML definition
		var mainObjRef = this;
		this.currentObjIndex = app.global.CURRENT_OBJECT.menuItemIndex ;
		if((this.contentFileName).toLowerCase() == "internal"){
			var menuItemNode = $(app.global.XHTTP_SETTINGS.responseXML).find("menuItem").eq(this.currentObjIndex);
			cards_initFunction($(menuItemNode).find("gioco"),this.folder);
			return;
		}		
		
		var xmlToLoad = this.folder+"/"+this.contentFileName;
		xmlToLoad = xmlToLoad.replace(/([^:]\/)\/+/g, "$1");
		var folderReference = this.folder;
		
		$.ajax({
			type: "GET",
			url: xmlToLoad,
			dataType: "xml",
			success: function(xml) {
				//game_sample_main_script($(xml).find("gioco"), folderReference);
				//myXml = $(xml);
				//gioco.cards = myXml.find("cards")
				
				//game_sample_main_script($(xml).find("fumetto"), folderReference);
				cards_initFunction($(xml).find("gioco"),folderReference);
			}
		});
		
		
		
		
		
		
	};

	/* START: chiamata ogni volta al termine dell'animazione dopo il click di avvio di copertina, circa mezzo secondo dopo la init */
	_proto.start = function start() {
		
	};

	return cards;
}();