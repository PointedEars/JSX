/**
 *  Enable support for HTML5 elements in MSHTML < 9
 */
(function () {
  var elementTypes = ["header", "footer", "section",  "aside",
                      "nav", "article", "hgroup", "time"];

  for (var i = 0, len = elementTypes.length; i < len; ++i)
  {
    jsx.tryThis(function () {
      document.createElement(elementTypes[i]);
    });
  }
}());