/* 
https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false

Already imported:
- jQuery 3.4.1
- Greensock GSAP 2.1 (https://greensock.com/docs/v2/)
- Bootstrap 4.3.1

*/

"use strict";
var scrivi =
/*#__PURE__*/
function () {
	
	/* CONSTRUCTOR: chiamata una sola volta all'avvio della pillola */ 
	function scrivi() {
		
		this.menuItemLabel = "Scrivi";
		this.contentFileName = "game_scrivi.xml";
		this.menuItemDefaultIcon = "./engine/icons/rate_review_24px.svg";

	}

	var _proto = scrivi.prototype;

	/* INIT: chiamata ogni volta al click dell'avvio di copertina */ 
	_proto.init = function init() {
		
		/// internal XML definition
		var mainObjRef = this;
		this.currentObjIndex = app.global.CURRENT_OBJECT.menuItemIndex ;
		if((this.contentFileName).toLowerCase() == "internal"){
			var menuItemNode = $(app.global.XHTTP_SETTINGS.responseXML).find("menuItem").eq(this.currentObjIndex);
			scrivi_initFunction($(menuItemNode).find("giocoScrivi"),this.folder);
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
				console.log($(xml).find("giocoScrivi"))
				scrivi_initFunction($(xml).find("giocoScrivi"),folderReference);
			}
		});
		//scrivi_initFunction();
	};

	/* START: chiamata ogni volta al termine dell'animazione dopo il click di avvio di copertina, circa mezzo secondo dopo la init */
	_proto.start = function start() {
		
	};

	return scrivi;
}();