function playSound(sSoundFile, Loop, sAttrib)
{
  var b = document.body, o;
  if (b
      && jsx.object.isMethod(b, "appendChild")
      && (o = b.appendChild(jsx.dom.createElement("object"))))
  {
    o.data = sSoundFile;
/*
    var p = dhtml.createElement("param");
    if (p)
    {
      p.name = "FileName";
      p.value = sSoundFile;
      o.appendChild(p);
    }
    
    p = dhtml.createElement("param");
    if (p)
    {
      p.name = "AutoPlay";
      p.value = "1";
      o.appendChild(p);
    }
    
    p = dhtml.createElement("param");
    if (p)
    {
      p.name = "EnableJavaScript";
      p.value = "true";
      o.appendChild(p);
    }
*/
    var me = arguments.callee;
    
    if (typeof me.sounds == "undefined")
    {
      me.sounds = new Array();
    }
    
    me.sounds.push(o);

    if (typeof me.handlerAdded == "undefined")
    {
      jsx.dom.addEventListener(
        b,
        "unload",
        function() {
          for (var i = me.sounds && me.sounds.length; i--;)
          {
            b.removeChild(me.sounds[i]);
          }

          b = null;
        });
      
      me.handlerAdded = true;
    }
  }
/*
  if (document.all)
  {
    var sAdjacent = "<bgsound ";
    if ((playSound.arguments.length == 3) && (sAttrib.length != ""))
    {
      sAdjacent += sAttrib;
      sAdjacent += " ";
    }
    sAdjacent += "src=\"";
    sAdjacent += sSoundFile;
    sAdjacent += "\" loop=\"";
    if (isNaN(Loop))
      sAdjacent += Loop;
    else
      sAdjacent += String(Loop);
    sAdjacent += "\">";
    document.all.tags("head")[0].insertAdjacentHTML("BeforeEnd", sAdjacent);
  }
*/
}