function _createElement(data)
{
  if (typeof data == "string")
  {
    return document.createTextNode(data);
  }

  var el = document.createElement(data.type);
  if (!el)
  {
    return null;
  }

  var properties = data.properties;
  if (properties)
  {
    for (var prop in properties)
    {
      if (!properties.hasOwnProperty(prop))
      {
        continue;
      }

      if (prop == "style")
      {
        var style = properties[prop];
        for (var styleProp in style)
        {
          if (!style.hasOwnProperty(styleProp))
          {
            continue;
          }

          var targetProp = styleProp;
          if (targetProp === "float")
          {
            if (typeof style.cssFloat != "undefined")
            {
              var targetProp = "cssFloat";
            }
            else if (typeof style.styleFloat != "undefined")
            {
              targetProp = "styleFloat";
            }

          }

          el.style[targetProp] = style[styleProp];
        }
      }
      else
      {
        el[prop] = properties[prop];
      }
    }
  }

  var nodes = data.childNodes;
  for (var i = 0, len = nodes && nodes.length; i < len; ++i)
  {
    el.appendChild(arguments.callee(nodes[i]));
  }

  return el;
}

function antiSOPA (contentName)
{
  //jsx.tryThis(function () {
  var div = _createElement({
    type: "div",
    properties: {
      id: "antiSOPA",
      style: {
        position: "fixed",
        maxWidth: "none",
        zIndex: "999",
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "black",
      }
    },
    childNodes: [
      {
        type: "div",
        properties: {
          className: "antiSOPA"
        },
        childNodes: [
          {
            type: "blockquote",
            childNodes: [
              {
                type: "p",
                properties: {
                  style: {
                    fontStyle: "italic",
                    marginBottom: "0"
                  }
                },
                childNodes: [
                  "“With the first link, the chain is forged."
                  + " The first speech censured, the first thought forbidden,"
                  + " the first freedom denied, chains us all irrevocably.”"
                ]
              },
              {
                type: "div",
                properties: {
                  style: {
                    textAlign: "right"
                  }
                },
                childNodes: [
                  " – “Captain\xA0Picard”, quoting “Judge\xA0Aaron\xA0Satie”,",
                  {
                    type: "br"
                  },
                  "in “",
                  {
                    type: "a",
                    properties: {
                      href: "http://en.memory-alpha.org/wiki/Star_Trek:_The_Next_Generation"
                    },
                    childNodes: [
                      "Star\xA0Trek: The\xA0Next\xA0Generation",
                    ]
                  },
                  "”, “",
                  {
                    type: "a",
                    properties: {
                      href: "http://en.memory-alpha.org/wiki/The_Drumhead_(episode)"
                    },
                    childNodes: [
                     "The\xA0Drumhead"
                    ]
                  },
                  "”"
                ]
              }
            ]
          },
          {
            type: "p",
            childNodes: [
              "Put simply, the United States of America are currently considering ",
              {
                type: "a",
                properties: {
                  href: "http://en.wikipedia.org/wiki/Wikipedia:SOPA_initiative/Learn_more"
                },
                childNodes: [
                  "Acts\xA0of\xA0Congress"
                ]
              },
              " that, if passed, would allow the Internet to be censored."
            ]
          },
          {
            type: "p",
            childNodes: [
              "Not only this would severely limit the ",
              {
                type: "a",
                properties: {
                  href: "http://www.un.org/en/documents/udhr/"
                },
                childNodes: ["Human Right of the Freedom of Speech"]
              },
              " in the United States; it would also set a bad precedent for other countries."
              + " For example, ",
              {
                type: "a",
                properties: {
                  href: "http://www.regjeringen.no/pages/16468635/Horingsnotat_2011.pdf"
                },
                childNodes: [
                  "Norway is already considering to do the same (PDF, in Norwegian)"
                ]
              },
              "."
            ]
          },
          {
            type: "blockquote",
            childNodes: [
              {
                type: "p",
                properties: {
                  style: {
                    fontStyle: "italic",
                    marginBottom: "0"
                  }
                },
                childNodes: [
                  "“Vigilance, Mister Worf, that is the price we have to continually pay.”"
                ]
              },
              {
                type: "div",
                properties: {
                  style: {
                    textAlign: "right"
                  }
                },
                childNodes: [
                             " – “Captain\xA0Picard”, ibid.",
                             ]
              }
            ]
          },
          {
            type: "p",
            childNodes: [
              "It is up to ",
              {
                type: "em",
                childNodes: [
                  "you"
                ]
              },
              " to not let this happen. An information society"
              + " depends upon information being freely available to everyone."
            ]
          },
          {
            type: "ul",
            childNodes: [
              {
                type: "li",
                properties: {
                  className: "red pill"
                },
                childNodes: [
                  {
                    type: "a",
                    properties: {
                      href: "http://en.wikipedia.org/wiki/Wikipedia:SOPA_initiative/Learn_more"
                    },
                    childNodes: [
                      "Go to Wikipedia to learn more"
                    ]
                  }
                ]
              },
              {
                type: "li",
                properties: {
                  className: "blue pill"
                },
                childNodes: [
                  {
                    type: "a",
                    properties: {
                      href: "#",
                      onclick: function () {
                        div.parentNode.removeChild(div);
                        document.body.style.overflow = "";
                        return false;
                      }
                    },
                    childNodes: [
                      "Hide this text ",
                      {
                        type: "em",
                        childNodes: [
                          "temporarily"
                        ]
                      },
                      ", and proceed to " + (contentName || "site")
                    ]
                  },
                  "."
                ]
              }
            ]
          },
          {
            type: "p",
            childNodes: [
              "This blackout will stay in place until 2012-01-19 (CE) 18:00 UTC."
            ]
          }
        ]
      }
    ]
  });

  document.body.appendChild(div);
  document.body.style.overflow = "hidden";
}
