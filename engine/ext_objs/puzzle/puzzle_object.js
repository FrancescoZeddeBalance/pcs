/* 
https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false

Already imported:
- jQuery 3.4.1
- Greensock GSAP 2.1 (https://greensock.com/docs/v2/)
- Bootstrap 4.3.1

*/

"use strict";
var puzzle =
/*#__PURE__*/
function () {
	
	/* CONSTRUCTOR: chiamata una sola volta all'avvio della pillola */ 
	function puzzle() {
		this.menuItemLabel = "Puzzle";
		this.contentFileName = "game_puzzle.xml";
		this.menuItemDefaultIcon = "./engine/icons/extension_24px.svg";
	}

	var _proto = puzzle.prototype;

	/* INIT: chiamata ogni volta al click dell'avvio di copertina */ 
	_proto.init = function init() {
		
		/// internal XML definition
		var mainObjRef = this;
		this.currentObjIndex = app.global.CURRENT_OBJECT.menuItemIndex ;
		if((this.contentFileName).toLowerCase() == "internal"){
			var menuItemNode = $(app.global.XHTTP_SETTINGS.responseXML).find("menuItem").eq(this.currentObjIndex);
			puzzle_initFunction($(menuItemNode).find("giocoPuzzle"),this.folder);
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
				puzzle_initFunction($(xml).find("giocoPuzzle"),folderReference);
			}
		});
		//puzzle_initFunction();
	};

	/* START: chiamata ogni volta al termine dell'animazione dopo il click di avvio di copertina, circa mezzo secondo dopo la init */
	_proto.start = function start() {
		
	};

	return puzzle;
}();