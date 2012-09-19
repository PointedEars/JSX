if (typeof de.pointedears.jsdoc == "undefined")
{
  /**
   * @namespace
   */
  de.pointedears.jsdoc = {};
}

de.pointedears.jsdoc.generate = function (code) {
  var rx = /\/\*\*(([^*]|\*[^\/])+)\*\//g, m;
  
  while ((m = rx.exec(code)))
  {
    var comment = m[1].replace(/(<pre>[\S\s]+?<\/pre>)|^\s*\*\s*/gm, "$1");
    
    comment = comment.replace(
      /<title>([\S\s]+?)<\/title>/gi,
      function (match, title) {
        var newTitle = title + " – " + document.title;
        document.title = newTitle;
        window.top.document.title = newTitle;
        return "";
      });
    
    comment = comment.replace(
      /@filename\s+(\S+)/,
      function (match, filename) {
        var title = document.getElementById("title");
        jsx.dom.removeChildren(title, title.childNodes);
        title.appendChild(jsx.dom.createElementFromObj({
          type: "tt",
          childNodes: [
            filename
          ]
        }));
        
        return "";
      });
    
    comment = comment.replace(
      /@version\s+(.+)/,
      function (match, version) {
        document.body.appendChild(jsx.dom.createElementFromObj({
          type: "p",
          childNodes: [
            {
              type: "b",
              childNodes: [
                "Version: "
              ]
            }, " " + version
          ]
        }));
        
        return "";
      });
    
    comment = comment.replace(
      /@section\s+(.+)|@author\s+(.*)|@partof\s+(.*)/g,
      function (match, section, author, partof)
      {
        if (section)
        {
          return "<h2>" + section + "<\/h2>";
        }
        
        if (author)
        {
          return "<p>" + author + "<\/p>";
        }
        
        if (partof)
        {
          return "<p>Part of " + partof + "<\/p>";
        }
        
        return match;
      });

    var div = document.createElement("div");
    div.innerHTML = comment;
    document.body.appendChild(div);
  }
};