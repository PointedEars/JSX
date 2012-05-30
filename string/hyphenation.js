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
};
  
jsx.string.hyphenation = (function () {
  var _dictionary = Object.create(null);
  var _hyphenateAll = false;
  var _rxWord = /(^|\s)(\S+)([\s,;:.?!\)\]]|$)/g;
  var _rxWords;
  var _rxHyphen = /[-·]/g;
  var _chShy = "\u00ad";
  
  var _compile = function () {
    _rxWords = new RegExp("(^|\\s)("
      + Object.keys(_dictionary).join("|")
      + ")([\\s,;:.?!\\)\\]]|$)", "g");
    _compiled = true;
  };
    
  return {
    /**
     * @memberOf jsx.string.hyphenation
     * @param rule
     * @returns
     */
    addRule: function (rule) {
      _dictionary[rule.replace(_rxHyphen, "")] = rule.replace(_rxHyphen, _chShy);
      _compiled = false;
    },
    
    addRules: function (rules) {
      for (var i = 0, len = rules.length; i < len; ++i)
      {
        this.addRule(rules[i]);
      }
    },
    
    removeRule: function (rule) {
      delete _dictionary[rule];
     _compiled = false;
    },
    
    reset: function () {
      _dictionary = Object.create(null);
      _compiled = false;
    },

    getHyphenateAll: function () {
      return _hyphenateAll;
    },
    
    setHyphenateAll: function (hyphenateAll) {
      _hyphenateAll = !!hyphenateAll;
    },
    
    hyphenate: function (s) {
      if (!_compiled)
      {
        _compile();
      }
      
      return s.replace(_hyphenateAll ? _rxWord : _rxWords,
        function (match, wsp1, word, wsp2) {
          if (_hyphenateAll && !_dictionary[word])
          {
            return match;
          }
            
          return wsp1 + _dictionary[word] + wsp2;
        });
    }
  };
}());