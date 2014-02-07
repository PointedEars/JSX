"use strict";

/**
 * @type de.pointedears.jsdoc
 * @memberOf __de.pointedears.jsdoc
 * @namespace
 */
de.pointedears.jsdoc = (/** @constructor */ function () {
  /**
   * @function
   */
  var _Parser = (
    /**
     * @constructor
     * @extends jsx.string.parser.ecmascript.Parser
     */
    function de_pointedears_jsdoc_Parser () {
      de_pointedears_jsdoc_Parser._super.apply(this, arguments);
    }
  ).extend(jsx.string.parser.ecmascript.Parser, {
    /**
     * @memberOf de.pointedears.jsdoc.Parser.prototype
     * @overrides jsx.string.parser.ecmascript.Parser.prototype.parseToken
     */
    parseToken: function (token) {
      /* Parse ECMAScript */
      _Parser._super.prototype.parseToken.apply(this, arguments);

      console.log("Line " + this.getLine() + ": " + token.type + ": »" + token.match + "«");

      if (token.type == "COMMENT_MULTI" && token.match.charAt(2) == "*")
      {
        /* Parse JSdoc */
        console.log("JSdoc");
      }

      return true;
    }
  });

  return {
    /**
     * @memberOf de.pointedears.jsdoc
     */
    Parser: (function (code) {
      this.code = code;
      this.state = "";
    }).extend(null, {
      tokens: {
        "": [
          {pattern: /\/\*\*/g, nextState: "comment"}
        ],
        "comment": [
          {pattern: /@\w+/g},
          {pattern: /\*\//g, nextState: ""}
        ]
      },

      getNextToken: function () {
        var code = this.code;
        var current_tokens = this.tokens[this.state];
        var longest_match_wins = this.longestMatchWins;
        var last_index = this.lastIndex;
        var used_match = {
          index: Infinity,
          lastIndex: last_index,
          length: 0
        };

        for (var i = 0, len = current_tokens.length; i < len; ++i)
        {
          var current_token = current_tokens[i];
          var rx = current_token.pattern;
          rx.lastIndex = last_index;

          var match = rx.exec(code);
          if (match)
          {
            if (longest_match_wins)
            {
              var match_length = match[0].length;
              if (used_match.length < match_length)
              {
                used_match.token = current_token;
                used_match.match = match;
                used_match.length = match_length;
                used_match.lastIndex = rx.lastIndex;
              }
            }
            else if (match.index < used_match.index)
            {
              used_match.token = current_token;
              used_match.match = match;
              used_match.index = match.index;
              used_match.lastIndex = rx.lastIndex;
            }
          }
        }

        if (used_match.match)
        {
          this.lastIndex = used_match.lastIndex;

          var next_state = used_match.token.nextState;
          if (typeof next_state != "undefined")
          {
            this.state = next_state;
          }

          used_match.token.match = used_match.match;

          return used_match.token;
        }

        return null;
      },

      parse: function () {
        var token;
        while ((token = this.getNextToken()))
        {
          console.log(token);
        }
      }
    }),

    /**
     * @param {String} code
     * @param {String} filename
     */
    generate: function (code, filename) {
      var parser = new this.Parser(code);
      parser.parse();
    }
  };
}());