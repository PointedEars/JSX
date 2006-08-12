function FuzzySort(aSelect) {
	var i = 0;
	while ( i < aSelect.options.length - 2 ) {
		var value1 = aSelect.options[i].text.substr(0, aSelect.options[i].text.toLowerCase().indexOf("=") - 1);
		var value2 = aSelect.options[i + 1].text.substr(0, aSelect.options[i].text.toLowerCase().indexOf("=") - 1);
      		if( value1 > value2 ) {
			var Save;
			Save = aSelect.options[i].text;
			aSelect.options[i].text = aSelect.options[i + 1].text;
			aSelect.options[i + 1].text = Save
			Save = null;
			if( i > 1 )
				i--;
        	} else
			i++;
	}
}

function blurStartCtrl(aStartCtrl) {
	if(blurStartCtrl.arguments.length > 0)
		if(aStartCtrl != null)
			aStartCtrl.blur();
}

function getObjProp(sObject, aStartCtrl, aSelect) {
	var ident = getObjProp;
	var aObject = eval(sObject);
	var bValidTarget = (aSelect != null);
	if(bValidTarget) bValidTarget = (aSelect.tagName.toLowerCase() == "select");
	if(! bValidTarget) {
		alert("Unable to continue without valid SELECT object as third argument.");
		blurStartCtrl(aStartCtrl);
		return(true);
	} 
	removeOptions(aSelect);
	if(aObject == null) {
		addOption(aSelect, "[no object]");
		return(true);
	}
/*	if(sObject.indexOf("document.all") >= 0) {
		addOption(aSelect, "[Unable to retrieve document.all because it accesses its caller]");
		blurStartCtrl(aStartCtrl);
		return(true);
	} */
	aSelect.style.cursor = "wait";
	var sCondition = false;
	for(var Item in aObject) {
		var sCondition = ( String(aObject[Item]).toLowerCase().substr(0, 9) != "function " );
		if(sCondition) {
			var propValue = aObject[Item];
			var s = ( ( isNaN(propValue) || String(propValue) == "" ) 
				&& ( String(propValue).indexOf("object") < 0 ) ) ? "\"" : "";
			var sText = Item + " = " + s + propValue + s;
			addOption(aSelect, sText);
		}
	}
	FuzzySort(aSelect);
	blurStartCtrl(aStartCtrl);
	aSelect.style.cursor = "auto";
	return(false);
}

function checkProps(aWindow) {
	var wndProps = window.open();
	wndProps.document.open("text/html");
	wndProps.document.write('<html>\n<head>\n' +
		'<link href="../styles/lcars.css" rel="stylesheet" type="text/css">\n' +
		'<style type="text/css"><!--\n' +
		'\ta.button, a.button:visited {\n' +
		'\tfont-size: 20px;\n' +
		'}\n' +
		'a.button:hover  { color: #000000; }\n' +
		'a.button:active { color: #000000; }\n' +
		'//--></style>\n' +
		'\t<script language="JavaScript1.1" src="../scripts/props.js" type="text/javascript"></script>\n' +
		'</head>\n<body>\n' +
		'Object from which to retrieve properties:<br>\n' +
		'<input type="text" style="width: 96%;" id="edObject">' +
		'<a href="JavaScript:void(0)" class="button" style="position:relative; top:-3px;" id="btGo" onClick=\'getObjProp(edObject.value, this, document.all.props);\'>&nbsp;<u>G</u>O&nbsp;</a><br>\n' +
		'<select size=10 style="width: 100%;" id="props">' +
		'</select></body></html>'
	);
	wndProps.document.close();
}