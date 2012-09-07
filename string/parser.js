/**
 * Generic parser implementation
 * 
 * @author
 * Copyright (c) 2010 Thomas 'PointedEars' Lahn &lt;js@PointedEars.de&gt;
 */

if (typeof jsx.string.parser == "undefined")
{
  /**
   * @namespace
   */
  jsx.string.parser = {};
}

/**
 * A token as recognized by a {@link #Lexer}.
 * 
 * @param pattern : RegExp|String
 *   The pattern to match the token.  <strong>Parenthesized subexpressions
 *   must be marked as <em>non-capturing</em> (<code>(?:&#8230;)</code>) for
 *   the correct token to be returned by the lexer.</strong>
 * @param type : optional any
 *   A value to set the object's <code>type</code> property which can be used
 *   for recognizing the type of the matched token in the parser's
 *   {@link Parser.prototype#parseToken parseToken()} method.  Using
 *   a constant value is recommended, the default is the constructor
 *   identifier or <code>"Token"</code> if the identifier is unavailable.
 *   However, whenever a token requires further parsing, it is recommended
 *   to use an object which constructor calls {@link Token Token()}, and
 *   to compare against its <code>constructor</code> property instead.
 * @property pattern : RegExp|String
 *   See the constructor's <var>pattern</var> argument
 * @property type
 *   See the constructor's <var>type</var> argument
 * @property match : Array
 *   The text and substrings that the token matched.  If the {@link #Lexer}'s
 *   {@link #Lexer.keepHistory keepHistory} property is <code>false</code>,
 *   the text and substrings that the token matched last.
 * @method parse(lexer : Lexer)
 *   When this method is defined, a {@link #Parser} calls it instead of
 *   the parser's {@link Parser.prototype#parseToken parseToken(Token)} method.
 *   A <code>Token</code> may implement this method to parse the token using
 *   a specialized {@link #Lexer}.  An implementation may
 *   {@link jsx.object#clone clone()} the referred lexer to create a lexer
 *   that can find more or less tokens than the suggested one.
 */
jsx.string.parser.Token = function (pattern, type) {
  this.pattern = pattern;
  this.type = type || jsx.object.getFunctionName(this.constructor) || "Token";
};

/**
 * A <code>Lexer</code> (lexical analyzer) converts a sequence
 * of characters in an input string into a sequence of
 * {@link #Token Tokens} which can be used by a {@link Parser}.
 * 
 * <p>The list of patterns to match the tokens can be built with calling
 * {@link Lexer.prototype#addToken addToken()}, whereas the calls
 * for the preferred matches must come first, or with
 * {@link Lexer.prototype#addTokens addTokens()}, whereas the arguments
 * for the preferred matches must come first.</p>
 * 
 * @param text : optional String
 *   The text to be analyzed by this lexer; the default is the empty string.
 * @property text : string
 *   The text to be analyzed
 * @property _tokens : Array[Token]
 *   The list of {@link #Token Tokens}
 * @property keepHistory : boolean = false
 *   If <code>true</code>, each match initializes and returns a new {@link #Token};
 *   use this if you need to retain a history of tokens.  Otherwise the
 *   existing {@link #Token Tokens} are reused which requires less memory.
 */
jsx.string.parser.Lexer = function (text) {
  /**
   * @type String
   */
  this.text = text ? String(text) : "";
  
  this._tokens = [];
  this.keepHistory = false;
};

jsx.string.parser.Lexer.extend(null, {
  /**
   * <code>true</code> if the tokens have been compiled into a
   * single regular expression.  Always false if the longest match
   * should win.
   * 
   * @see _longestMatchWins
   */
  _compiled: false,
  
  /**
   * <code>true</code> if character case should not matter
   */
  _ignoreCase: false,

  /**
   * <code>true</code> if newline should be included in `.' matches
   */
  _dotAll: false,

  /**
   * <code>true</code> if the longest match, not the first one
   * in the list of token expressions, should be used.  This is
   * important where there is ambiguity in token prefixes, but
   * wasteful in runtime complexity where there is not, because
   * the length of the matches for each token need to be compared
   * against one another then. Use with caution.
   */
  _longestMatchWins: false,
  
  /**
   * Text position where to continue scanning
   */
  _offset: 0,
  
  /**
   * Appends a {@link #Token} to the list of tokens.
   *
   * @memberOf jsx.string.parser.Lexer#prototype
   * @param token : RegExp|String|Token
   *   If a reference to a <code>RegExp</code> or a <code>String</code>,
   *   the value is used for the token pattern;<br>
   *   if a reference to a <code>Token</code>, the reference is used and
   *   <var>tokenType</var> is ignored.
   * 
   *   <p><strong>NOTE: Parenthesized subexpressions must be marked as
   *   <em>non-capturing</em> (<code>(?:&#8230;)</code>) for the correct
   *   token to be returned by the lexer.</strong></p>
   * @param tokenType : optional String|Function
   *   If a <code>String</code>, passed for the the type name to {@link #Token Token()};<br>
   *   if a reference to a <code>Function</code>, the function is used as
   *   constructor to which <var>token</var> is passed.
   * @return {Array}
   *   The new list of alternative tokens
   */
  addToken: function (token, tokenType) {
    if (!token)
    {
      jsx.throwThis("jsx.InvalidArgumentError",
        ["Invalid token", token + " : " + typeof token
           + (token ? "[" + token.constructor + "]" : ""),
         "(token: RegExp|String)"]);
    }
      
    if (token.constructor == RegExp
        || typeof token == "string")
    {
      if (typeof tokenType == "function")
      {
        token = new tokenType(token);
      }
      else
      {
        token = new jsx.string.parser.Token(token, tokenType);
      }
    }
    
    this._tokens.push(token);
    this._compiled = false;
  
    return this;
  },

  /**
   * Appends one or more {@link #Token Tokens} to the list of tokens.
   * 
   * @params : [RegExp|String|Token, optional String|Function]
   * @return Array
   *   The new list of alternative tokens
   */
  addTokens: function () {
    for (var i = 0, len = arguments.length; i < len; ++i)
    {
      var arg = arguments[i];
      this.addToken(arg[0], arg[1]);
    }
    
    return this;
  },
    
  /**
   * Compiles <code>_expression</code> from token patterns
   * 
   * @protected
   */
  _compile: (function () {
    var _jsx_RegExp;
    var _RegExp;
    
    return function () {
      var pattern = this._tokens.map(function (e) {
        return e.pattern.source ? e.pattern.source : e.pattern;
      });
  
      if (!_RegExp)
      {
        _jsx_RegExp = jsx.object.getFeature(jsx, "regexp", "RegExp");
        _RegExp = _jsx_RegExp || RegExp;
      }
      
      this._expression = new _RegExp(
        "(" + pattern.join(")|(") + ")",
        "g" + (this._ignoreCase ? 'i' : '')
            + ((_RegExp == _jsx_RegExp && this._dotAll) ? 's' : ''));
      this._compiled = true;
  
      return this._expression;
    };
  }()),
  
  /**
   * Returns the next token in an input string.
   * 
   * @return Token
   *   The next token in the text assigned with this lexer
   */
  nextToken: function () {
    var tokens = this._tokens;
    var keepHistory = this.keepHistory;

    if (this._longestMatchWins)
    {
      var token_matches = [];
      var max_match_len = 0;
      var max_index = -1;
      for (var index = 0, len = tokens.length; i < len; ++i)
      {
        var token = tokens[index];
        var matches = token.exec(this._text.substring(0, this._offset));
        
        if (matches)
        {
          var token_match = token_matches[index] = matches[0];
          var token_match_len = token_match.length;
          if (token_match_len > max_match_len)
          {
            max_match_len = token_match_len;
            max_index = index;
          }
        }
      }
    
      if (max_index > -1)
      {
        token = token_matches[max_index];
        
        if (token.match && keepHistory)
        {
          token = new token.constructor(token.pattern, token.type);
        }
        
        token.match = match;
      }
    }
    else
    {
      var expression = this._expression;
      
      if (!this._compiled)
      {
        expression = this._compile();
      }
      
      if (expression.source == "()")
      {
        jsx.throwThis(jsx.Error, "No tokens added");
        return null;
      }
      
      var match = expression.exec(this.text);
      if (match)
      {
        for (var i = 1, len = match.length; i < len; ++i)
        {
          if (match[i])
          {
            token = tokens[i - 1];
            
            if (token.match && keepHistory)
            {
              token = new token.constructor(token.pattern, token.type);
            }
            
            token.match = match;
            break;
          }
        }
      }
    }
    
    if (match)
    {
      this._offset += match.length;
    }
    
    return token;
  },
  
  getIgnoreCase: function () {
    return this._ignoreCase;
  },
  
  setIgnoreCase: function (value) {
    value = !!value;
    if (value !== this._ignoreCase)
    {
      this._compiled = false;
    }
  
    this._ignoreCase = value;
  },
  
  getDotAll: function () {
    return this._dotAll;
  },
  
  setDotAll: function (value) {
    value = !!value;
    if (value !== this._dotAll)
    {
      this._compiled = false;
    }
  
    this._dotAll = value;
  },
  
  getExpression: function () {
    return this._expression;
  },
  
  getOffset: function () {
    return this._offset;
  },
  
  getTokens: function () {
    return this._tokens;
  }
});

/**
 * A <code>Parser</code> handles {@link #Token Tokens} in an input string
 * as provided by a {@link #Lexer}.
 * 
 * @param lexer : Lexer
 *   The lexer to be used by this parser
 * @property _lexer : Lexer
 *   The lexer used by this parser
 */
jsx.string.parser.Parser = function (lexer) {
  this._lexer = lexer;
};

jsx.string.parser.Parser.extend(null, {
  /**
   * Parses an input string requesting the next token from a {@link #Lexer}.
   * @memberOf jsx.string.parser.Parser#prototype
   */
  nextToken: function () {
    return this._lexer.nextToken();
  },

  /**
   * Parses an input string requesting the next token from a {@link #Lexer}.
   */
  parse: function () {
    var
      token,
      oLexer = this._lexer;
    
    while ((token = oLexer.nextToken()))
    {
      if (typeof token.parse == "function")
      {
        token.parse(oLexer);
      }
      else
      {
        this.parseToken(token);
      }
    }
  },

  /**
   * Parses an input token as provided by a {@link #Lexer}.
   * 
   * @param token : Token
   */
  parseToken: function (token)  {
    /* stub */
  }
});