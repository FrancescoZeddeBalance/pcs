/* 
https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false

Already imported:
- jQuery 3.4.1
- Greensock GSAP 2.1 (https://greensock.com/docs/v2/)
- Bootstrap 4.3.1

*/

"use strict";
var slider =
/*#__PURE__*/
function () {
	
	/* CONSTRUCTOR: chiamata una sola volta all'avvio della pillola */ 
	function slider() {
		
		/// All settings can be OVERIDDEN via settings XML
		//app.lib.debugOnConsole("CONSTRUCT :::game sample:::");
		this.menuItemLabel = "Slider";
		this.contentFileName = "game_slider.xml";
		this.menuItemDefaultIcon = "./engine/icons/table_chart_24px.svg";

	}

	var _proto = slider.prototype;

	/* INIT: chiamata ogni volta al click dell'avvio di copertina */ 
	_proto.init = function init() {
		
		/// internal XML definition
		var mainObjRef = this;
		this.currentObjIndex = app.global.CURRENT_OBJECT.menuItemIndex ;
		if((this.contentFileName).toLowerCase() == "internal"){
			var menuItemNode = $(app.global.XHTTP_SETTINGS.responseXML).find("menuItem").eq(this.currentObjIndex);
			slider_initFunction($(menuItemNode).find("giocoslider"),this.folder);
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
				console.log("giocoslider: "+$(xml).find("giocoslider"))
				slider_initFunction($(xml).find("giocoslider"),folderReference);
			}
		});
	};

	/* START: chiamata ogni volta al termine dell'animazione dopo il click di avvio di copertina, circa mezzo secondo dopo la init */
	_proto.start = function start() {
		
	};

	return slider;
}();