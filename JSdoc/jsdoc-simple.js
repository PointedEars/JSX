"use strict";

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

if (typeof jsx.string == "undefined")
{
  /**
   * @namespace
   */
  jsx.string = {};
}

/**
 * @namespace
 */
jsx.string.parser = (/** constructor */ function () {
  /* Imports */
  var _isString = jsx.object.isString;
  /* Private functions */
  /**
   * Returns a global regular expression.
   *
   * Returns a {@link RegExp} that has the same pattern as
   * <var>rx</var>, but has the <code>global</code> flag
   * set and has other flags set according to a property source.
   *
   * @param {RegExp|String} rx
   * @param {Object} propertySource (optional)
   * @return {RegExp}
   */
  function _globalize (rx, propertySource)
  {
    if (rx.global)
    {
      return rx;
    }

    return new RegExp(
      rx.source || rx,
      "g" + (propertySource && propertySource.ignoreCase ? 'i' : '')
          + (rx.multiline || (propertySource && propertySource.multiline)
              ? 'm'
              : '')
    );
  }

  /**
   * @function
   */
  var _Token = (
    /**
     * @constructor
     * @param {RegExp|String} pattern
     *   The pattern to match the token.  <strong>Parenthesized subexpressions
     *   must be marked as <em>non-capturing</em> (<code>(?:&#8230;)</code>) for
     *   the correct token to be returned by the lexer.</strong>
     * @param {any} type (optional)
     *   A value to set the object's <code>type</code> property which can be used
     *   for recognizing the type of the matched token in the parser's
     *   {@link Parser.prototype#parseToken parseToken()} method.  Using
     *   a constant value is recommended.
     */
    function jsx_string_parser_Token (pattern, type) {
      if (!(this instanceof jsx_string_parser_Token))
      {
        /* Factory/typecast */
        return new jsx_string_parser_Token.construct(arguments);
      }

      if (pattern instanceof RegExp || _isString(pattern))
      {
        /* Separate arguments */
        this.pattern = pattern;
        this.type = type;
      }
      else
      {
        /* Parameter object/typecast */
        this.pattern = pattern.pattern;
        this.type = pattern.type;
      }

      this.pattern = _globalize(this.pattern, this.pattern);
    }
  ).extend(null, {
    /**
     * @memberOf jsx.string.parser.Token.prototype
     * @param {jsx.string.Parser} parser
     */
//    parse: function (parser) {
//      return true;
//    }
  });

  /**
   * @function
   */
  var _Parser = (
    /**
     * @constructor
     */
    function jsx_string_parser_Parser (code) {
      this.code = code;
    }
  ).extend(null, {
    /**
     * @memberOf jsx.string.parser.Parser.prototype
     */
    lastIndex: 0,

    getNextToken: function (sText) {
      var tokens = this.tokens;
      var last_index = this.lastIndex;
      var used_match = {
        index: Infinity,
        lastIndex: last_index,
        length: 0
      };

      for (var i = tokens.length; i--;)
      {
        var token = tokens[i];
        var rx = token.pattern;
        rx.lastIndex = last_index;

        var match = rx.exec(sText);
        if (match)
        {
          var index = match.index;
          var match_length = match[0].length;
          if (index < used_match.index
              || (index == used_match.index && match_length > used_match.length))
          {
            used_match.index = index;
            used_match.match = match;
            used_match.length = match_length;
            used_match.lastIndex = rx.lastIndex;
            used_match.token = token;
          }
        }
      }

      if (used_match.match)
      {
        this.lastIndex = used_match.lastIndex;

        used_match.token.match = used_match.match;

        return used_match.token;
      }

      return null;
    },

    parse: function (source) {
      this.lastIndex = 0;

      var token;
      while ((token = this.getNextToken(source)))
      {
        if (typeof token.parse == "function")
        {
          var result = token.parse(this);
        }
        else
        {
          result = this.parseToken(token);
        }

        if (!result)
        {
          break;
        }
      }
    },

    parseToken: function (token) {
      return true;
    }
  });

  return {
    /**
     * @memberOf jsx.string.parser
     */
    Token: _Token,
    Parser: _Parser
  };
}());

/**
 * @namespace
 */
de.pointedears.jsdoc = (/** @constructor */ function () {
  /* Imports */
  var _Parser = jsx.string.parser.Parser;
  var _Token = jsx.string.parser.Token;

//  /**
//   * @function
//   */
//  var _Parser = (
//    /**
//     * @constructor
//     * @extends jsx.string.parser.ecmascript.Parser
//     */
//    function de_pointedears_jsdoc_Parser () {
//      de_pointedears_jsdoc_Parser._super.apply(this, arguments);
//    }
//  ).extend(jsx.string.parser.ecmascript.Parser, {
//    /**
//     * @memberOf de.pointedears.jsdoc.Parser.prototype
//     * @overrides jsx.string.parser.ecmascript.Parser.prototype.parseToken
//     */
//    parseToken: function (token) {
//      /* Parse ECMAScript */
//      _Parser._super.prototype.parseToken.apply(this, arguments);
//
//      console.log("Line " + this.getLine() + ": " + token.type + ": »" + token.match + "«");
//
//      if (token.type == "COMMENT_MULTI" && token.match.charAt(2) == "*")
//      {
//        /* Parse JSdoc */
//        console.log("JSdoc");
//      }
//
//      return true;
//    }
//  });

  var _TOKEN_NEWLINE = "NEWLINE";
  var _TOKEN_COMMENT_SINGLE = "COMMENT_SINGLE";
  var _TOKEN_COMMENT_MULTI = "COMMENT_MULTI";
  var _TOKEN_JSDOC = "JSDOC";
  var _TOKEN_REGEXP = "REGEXP";
  var _TOKEN_STRING = "STRING";
  var _TOKEN_VAR = "VAR";
  var _TOKEN_FUNCTION = "FUNCTION";
  var _TOKEN_BRACE = "BRACE";

  var _token_newline = new _Token(/\r?\n|\r/, _TOKEN_NEWLINE);

  return {
    /**
     * @memberOf de.pointedears.jsdoc
     */
    Parser: (
      function de_pointedears_jsdoc_Parser () {
        de_pointedears_jsdoc_Parser._super.apply(this, arguments);

        this.globalVars = jsx.object.getDataObject();
       }
    ).extend(jsx.string.parser.Parser, {
      /**
       * @memberOf de.pointedears.jsdoc.Parser.prototype
       */
      braceLevel: 0,
      line: 1,
      prevToken: null,

      tokens: [
        _token_newline,
        new _Token(/\/\/.*/, _TOKEN_COMMENT_SINGLE),
        new _Token(/\/\*([^*]|\*[^\/])+\*\//, _TOKEN_COMMENT_MULTI),
        new _Token(/\/([^\r\n\/\\]|\\[^\r\n])+\/'/, _TOKEN_REGEXP),
        new _Token(/"([^\r\n"\\]|\\.)*"|'([^\\']|\\.)*'/, _TOKEN_STRING),
        new _Token(/\bvar\s+(\w+)/, _TOKEN_VAR),
        new _Token(/\bfunction(?:\s+\w+)?\s*\([^)]+\)\s*\{/, _TOKEN_FUNCTION),
        new _Token(/[{}]/, _TOKEN_BRACE)
      ],

      parseToken: function (token) {
        var line = this.line;
        var level = this.braceLevel;

        if (token.type != _TOKEN_NEWLINE)
        {
          console.log(
            "line:", line,
            "\nlevel:", level,
            "\ntype:", token.type,
            "\nmatch:", token.match);
        }

        switch (token.type)
        {
          case _TOKEN_NEWLINE:
            ++line;
            break;

          case _TOKEN_COMMENT_MULTI:
            if (token.match[0].charAt(2) == "*")
            {
              token.type = _TOKEN_JSDOC;
            }
            break;

          case _TOKEN_VAR:
            if (!level)
            {
              this.globalVars[token.match[1]] = {
                doc: (this.prevToken && this.prevToken.type == _TOKEN_JSDOC)
                  ? this.prevToken.match[0]
                  : null
              };
            }
            break;

          case _TOKEN_FUNCTION:
            ++level;
            break;

          case _TOKEN_BRACE:
            if (level)
            {
              switch (token.match[0])
              {
                case "{": ++level; break;
                case "}": --level; break;
              }
            }
        }

        if (token.type != _TOKEN_NEWLINE)
        {
          this.prevToken = token;
          line += (token.match[0].match(_token_newline.pattern) || "").length;
        }

        this.line = line;
        this.braceLevel = level;

        return true;
      }
    }),

    /**
     * @param {String} code
     * @param {String} filename
     */
    generate: function (code, filename) {
      var parser = new de.pointedears.jsdoc.Parser();
      parser.parse(code);
      console.log(parser.globalVars);
    }
  };
}());