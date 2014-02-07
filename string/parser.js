"use strict";
/**
 * Generic parser implementation
 *
 * @author
 * Copyright (c) 2010, 2013 Thomas 'PointedEars' Lahn &lt;js@PointedEars.de&gt;
 * @requires object.js
 */

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
jsx.string.parser = (/** @constructor */ function () {
  /**
   * Returns a global regular expression.
   *
   * Returns a {@link RegExp} that has the same pattern as
   * <var>rx</var>, but has the <code>global</code> flag
   * set and has other flags set according to a property source.
   *
   * @param {RegExp|String} rx
   * @param {Object} propertySource
   * @return {RegExp}
   */
  function _globalize (rx, propertySource)
  {
    return new RegExp(
      rx.source || rx,
      "g"
      + (propertySource.ignoreCase ? 'i' : '')
      + (rx.multiline || propertySource.multiline ? 'm' : '')
    );
  }

  /**
   * A token as recognized by a {@link #Lexer}.
   *
   * @property {RegExp|String} pattern
   *   See the constructor's <var>pattern</var> argument
   * @property type
   *   See the constructor's <var>type</var> argument
   * @property {Array} match
   *   The text and substrings that the token matched last.
   * @method parse({@link #Parser} parser)
   *   When this method is defined, a {@link #Parser} calls it instead of
   *   the parser's {@link #Parser.prototype.parseToken parseToken(Token)} method.
   *   A <code>Token</code> may implement this method to parse the token using
   *   a specialized {@link #Lexer}.  An implementation may
   *   {@link jsx.object#clone clone()} the parser to create a lexer
   *   that can find more or less tokens than the suggested one.
   */
  var _Token =
    /**
     * @constructor
     * @param {RegExp|String} pattern
     *   The pattern to match the token.  <strong>Parenthesized subexpressions
     *   must be marked as <em>non-capturing</em> (<code>(?:&#8230;)</code>) for
     *   the correct token to be returned by the lexer.</strong>
     * @param type (optional)
     *   A value to set the object's <code>type</code> property which can be used
     *   for recognizing the type of the matched token in the parser's
     *   {@link Parser.prototype#parseToken parseToken()} method.  Using
     *   a constant value is recommended.
     * @param {string} nextState (optional)
     *   The state that a lexer should enter after this token
     *   was read.
     */
    function (pattern, type, nextState) {
      if (pattern instanceof RegExp || pattern instanceof String)
      {
        this.pattern = pattern;
        this.type = type;
      }
      else
      {
        /* Parameter object */
        this.pattern = pattern.pattern;
        this.type = pattern.type;
      }

      this.nextState = nextState;
    };

  /**
   * A <code>Lexer</code> (lexical scanner) converts a sequence
   * of characters in an input string into a sequence of
   * {@link #Token Token}s which can be used by a {@link #Parser}.
   *
   * <p>The list of patterns to match the tokens can also be built
   * with calling {@link Lexer.prototype#addToken addToken()},
   * whereas the calls for the preferred matches must come first,
   * or with {@link Lexer.prototype#addTokens addTokens()}, whereas
   * the arguments for the preferred matches must come first.</p>
   *
   * A <code>Lexer</code> has a state that defines the
   * <code>Token</code>s that it recognizes only when it is in
   * that state.  When a <code>Token</code> has been recognized,
   * the <code>Lexer</code>'s state can be changed (see
   * {@link #Token} for details).  Initially, the state is
   * {@link Lexer.STATE_START}.
   */
  var _Lexer = jsx.object.extend(
    /**
     * @constructor
     * @param {Array} tokens
     */
    function (tokens) {
      var _tokens;

      /**
       * <code>true</code> if the tokens have been compiled into a
       * single regular expression.  Always false if the longest match
       * should win.
       *
       * @private
       * @memberOf __jsx.string.parser.Lexer
       * @type Object{int: boolean}
       * @see jsx.string.parser.Lexer.prototype.longestMatchWins
       */
      var _compiled = {};

      this.state = _Lexer.STATE_START;

      /**
       * @protected
       * @memberOf jsx.string.parser.Lexer
       * @param {int} index
       *   Index of the token to be compiled
       * @return {RegExp}
       */
      this._compile = function (index) {
        if (typeof index != "number" || index % 1 !== 0)
        {
          return jsx.throwThis(jsx.InvalidArgumentError, "index must be an integer");
        }

        var expression = _tokens[index].pattern;

        if (!_compiled[index])
        {
          expression = _tokens[index].pattern = _globalize(
           _tokens[index].pattern,
           this);

          _compiled[index] = true;
        }

        return expression;
      };

      /**
       * Appends a {@link #Token} to the list of tokens.
       *
       * @param {jsx.string.parser.Token} token
       * @return {Lexer}
       *   This object
       */
      this.addToken = function (token) {
        if (!_tokens)
        {
          _tokens = [];
        }

        _tokens.push(token);
        _compiled[-1] = false;

        return this;
      };

      /**
       * @return {Array}
       */
      this.getTokens = function () {
         return _tokens;
      };

      if (tokens)
      {
        this.addTokens(tokens);
      }
    },
    {
      /**
       * @memberOf jsx.string.parser.Lexer
       */
      STATE_START: "S"
    }
  ).extend(null, {
    /**
     * <code>true</code> if character case should not matter
     *
     * @memberOf jsx.string.parser.Lexer.prototype
     */
    ignoreCase: false,

    /**
     * <code>true</code> if newline should be included in `.' matches
     */
    dotAll: false,

    /**
     * <code>true</code> if the longest match, not the first one
     * in the list of token expressions, should be used.  This is
     * important where there is ambiguity in token prefixes, but
     * wasteful in runtime complexity where there is not, because
     * the length of the matches for each token need to be compared
     * against one another then. Use with caution.
     */
    longestMatchWins: false,

    /**
     * Text position where to continue scanning
     */
    lastIndex: 0,

    /**
     * Appends one or more {@link #Token Tokens} to the list of tokens.
     *
     * @param {TokenList|Array} tokens
     * @return {Lexer}
     *   This object
     */
    addTokens: function (tokens) {
      for (var i = 0, len = tokens.length; i < len; ++i)
      {
        this.addToken(tokens[i]);
      }

      return this;
    },

    /**
     * Returns the next token in an input string.
     *
     * @param sText
     * @return {#Token}
     *   The next token in <var>sText</var>
     */
    getNextToken: function (sText) {
      if (arguments.length > 0 && typeof this.text == "undefined")
      {
        /**
         * @type string
         */
        this.text = String(sText);
      }

      sText = this.text;

      if (!sText)
      {
        return jsx.throwThis(jsx.InvalidArgumentError, "Nothing to scan");
      }

      var tokens = this.getTokens();
      var longest_match_wins = this.longestMatchWins;
      var last_index = this.lastIndex;
      var used_match = {
        index: Infinity,
        lastIndex: last_index,
        length: 0
      };

//        debugger;

      /*
       * NOTE: Must always use loop in order to find first match
       *       regardless of pattern position
       */
      for (var i = 0, len = tokens.length; i < len; ++i)
      {
        var rx = this._compile(i);
        rx.lastIndex = last_index;

        var matches = rx.exec(sText);
        if (matches)
        {
          var index = matches.index;
          var current_token = tokens[i];

          if (longest_match_wins)
          {
            var match_length = matches[0].length;
            var used_index = used_match.index;
            if (index < used_index
                || (index === used_index && match_length > used_match.length))
            {
              used_match.token = current_token;
              used_match.match = matches[0];
              used_match.length = match_length;
              used_match.index = index;
              used_match.lastIndex = rx.lastIndex;
            }
          }
          else if (index < used_match.index)
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
  });

  /**
   * An Array-like object whose items are {@link #Token}s.
   *
   * @param {Array|jsx.string.parser.Token} list
   *   If an {@link Array}, its elements are used as list
   *   (type conversion).  Otherwise all arguments are used.
   * @throws jsx.InvalidArgumentError
   *   if an item is not a {@link #Token}
   */
  var _TokenList = function (list) {
    var items = jsx.object.isArray(list) ? list : arguments;

    for (var i = 0, len = items.length; i < len; ++i)
    {
      var token = items[i];
      if (!(token instanceof _Token))
      {
        return jsx.throwThis(jsx.InvalidArgumentError,
          "jsx.string.parser.TokenList: saw " + token + ", expected jsx.string.parser.Token");
      }

      this[i] = token;
      this.length = i + 1;
    }
  }.extend(Array);

  return {
    /**
     * @memberOf jsx.string.parser
     * @param {Object[TokenList]} data
     */
    StateCollection: function (data) {
      var keys = jsx.object.getKeys(data);
      for (var i = 0, len = keys.length; i < len; ++i)
      {
        var state = keys[i];

        if (typeof state != "function")
        {
          if (!(state instanceof _TokenList))
          {
            return jsx.throwThis(jsx.InvalidArgumentError,
              "jsx.string.parser.StateCollection: saw " + state
              + ", expected jsx.string.parser.TokenList");
          }

          this[state] = data[state];
        }
      }
    },

    Token: _Token,
    TokenList: _TokenList,
    Lexer: _Lexer,

    /**
     * A <code>Parser</code> handles {@link #Token Tokens} in an input string
     * as provided by a {@link #Lexer}.
     *
     * @function
     * @property {Lexer} _lexer
     *   The lexer used by this parser
     */
    Parser: (
      /**
       * @constructor
       * @param {Lexer} lexer
       *   The lexer to be used by this parser
       */
      function (lexer) {
        if (arguments.length > 0)
        {
          if (!(lexer instanceof _Lexer))
          {
            return jsx.throwThis(jsx.InvalidArgumentError,
              "jsx.string.parser.Parser: saw " + lexer + ", expected jsx.string.parser.Lexer");
          }

          /**
           * @memberOf jsx.string.parser.Parser
           */
          this._lexer = lexer;
        }
      }
    ).extend(null, {
      /**
       * Parses an input string requesting the next token from a {@link #Lexer}.
       *
       * @memberOf jsx.string.parser.Parser.prototype
       * @param {String} sText
       */
      parse: function (sText) {
        var token;
        var lexer = this._lexer;

        /* DEBUG */
        console.log(lexer.getTokens());

        while ((token = lexer.getNextToken(sText)))
        {
          var tokensLeft = this.parseToken(token);

          /* Break if all tokens were consumed or contract was violated */
          if (!tokensLeft)
          {
            break;
          }
        }
      },

      /**
       * Parses an input token as provided by a {@link #Lexer}.
       *
       * @param {jsx.string.parser.Token} token
       * @return A false-value if all tokens have been consumed
       *   or an unrecoverable syntax error has been detected.
       */
      parseToken: function (token)  {
        var result = true;

        if (typeof token.parse == "function")
        {
          result = token.parse(this);
        }

        return result;
      }
    })
  };
}());