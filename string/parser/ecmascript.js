/**
 * @namespace
 */
jsx.string.parser.ecmascript = (function () {
  var _jsx_string_parser = jsx.string.parser;
  var _Lexer = _jsx_string_parser.Lexer;
  var _Parser = _jsx_string_parser.Parser;
  var _Token = _jsx_string_parser.Token;
  var _TokenList = _jsx_string_parser.TokenList;

  var _NewlineToken = (
    function jsx_string_parser_ecmascript_NewlineToken () {
      jsx_string_parser_ecmascript_NewlineToken._super.call(
        this, /\r?\n|\r/, "NEWLINE");
    }
  ).extend(_Token, {
    /**
     * @memberOf jsx.string.parser.ecmascript.NewlineToken.prototype
     */
    parse: function (parser) {
      parser.incLine();
      return true;
    }
  });

  var _BraceToken = (
    /**
     * @constructor
     */
    function jsx_string_parser_ecmascript_BraceToken () {
      jsx_string_parser_ecmascript_BraceToken._super.call(this, /[{}]/, "BRACE");
    }
  ).extend(_Token, {
    /**
     * @memberOf jsx.string.parser.ecmascript.BraceToken.prototype
     */
    parse: function (parser) {
      switch (this.match)
      {
        case "}": parser.incLevel(); break;
        case "{": parser.decLevel(); break;
      }

      console.log(parser.getLevel());

      return true;
    }
  });

  return {
    /**
     * @memberOf jsx.string.parser.ecmascript
     * @version
     */
    version: "$Rev$",

    Parser: (
      /**
       * @constructor
       */
      function jsx_string_parser_ecmascript_Parser () {
        var lexer = new _Lexer(this.tokens);
        lexer.longestMatchWins = true;

        jsx_string_parser_ecmascript_Parser._super.call(this, lexer);

        var _line = 1;
        var _level = 0;

        this.getLine = function () {
          return _line;
        };

        this.incLine = function () {
          ++_line;
        };

        this.getLevel = function () {
          return _level;
        };

        this.incLevel = function () {
          ++_level;
        };

        this.decLevel = function () {
          --_level;
        };
      }
    ).extend(_Parser, {
      longestMatchWins: true,

      /**
       * @memberOf jsx.string.parser.ecmascript.Parser.prototype
       */
      tokens: new _TokenList(
        new _NewlineToken(),
        new _Token(/"(?:[^\\"\n\r]|\\[\s\S])*"|'(?:[^\\'\n\r]|\\[\s\S])*'/, "STRING"),
        new _Token(/\/\*(?:[^*]|\*[^\/])*\*\//, "COMMENT_MULTI"),
        new _Token(/^\s*\/\/.*/m, "COMMENT_SINGLE"),
        new _Token(/\/([^\/\\\n\r]|\\[^\n\r])+\//, "REGEXP"),
        new _BraceToken()
      )
    })
  };
}());