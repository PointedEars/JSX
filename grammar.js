function Grammar(aProductions)
{
  this.version = "0.0.1";
  this.productions = aProductions;
}

function Production(source, target)
{
  this.source = source;
  this.target = target;
}

Production.prototype.toString = function() {
  return this.source + '\n  : ' + this.target;
};

function Modifier(expression, type)
{
  this.expression = expression;
  this.type = type;
}

Modifier.prototype.toString = function() {
  return this.expression + this.type;
};

function Group(aItems)
{
  this.items = aItems;
}

Group.prototype.toString = function() {
  var result = "";
  for ( var i = 0; i < this.items.length; i++)
  {
    if (i > 0)
    {
      result += ' ';
    }
    result += this.items[i];
  }
  return result;
};

function Alternative(aExpressions)
{
  this.expressions = aExpressions;
}

Alternative.prototype.toString = function() {
  var result = "";
  for ( var i = 0; i < this.expressions.length; i++)
  {
    if (this.expressions[i] instanceof Group)
    {
      result += "\n";
    }
    if (i > 0)
    {
      result += ' | ';
    }
    result += this.expressions[i];
  }
  
  return result;
};

function Expression(value)
{
  this.value = value;
}

Expression.prototype.toString = function() {
  return this.value;
};

function Literal(sValue)
{
  this.value = sValue;
}

Literal.prototype.toString = function() {
  return "'" + this.value + "'";
};

if (typeof jsx == "undefined")
{
  var jsx = {};
}

jsx.grammar = {
  Grammar2: function (productions, autoResolve) {
    for (var property in productions)
    {
      productions[property] = {
        value: productions[property],
        enumerable: true,
        writable: true
      };
    }
    
    this.productions = Object.create(null, productions);
    if (autoResolve)
    {
      this.resolve();
    }
  }.extend(null, {
    /**
     * @memberOf jsx.grammar.Grammar2.prototype
     */
    resolve: function () {
      var productions = this.productions;
      for (var symbol in productions)
      {
        var production = productions[symbol];
        var rxSymbol = /\\\{|\{([^\}]+)\}/g;
        var resolverStack = [];
        resolverStack.toString = function () {
          return this.join(" --> ");
        };
        
        productions[symbol] = production.replace(rxSymbol,
          function resolver (match, symbolRef) {
            if (!symbolRef)
            {
              return match;
            }
          
            if (resolverStack.indexOf(symbolRef) > -1)
            {
              throw new Error(
                "Grammar is not finite, goal symbol '" + symbolRef
                + "' is cyclically defined: " + resolverStack);
            }
            
            resolverStack.push(symbolRef);
            
            var unresolved = productions[symbolRef];
            
            if (typeof unresolved != "undefined")
            {
              /* Resolve references recursively */
              var rxSymbol = /\\\{|\{([^\}]+)\}/g;
              var resolved = unresolved.replace(rxSymbol, resolver);
            }
            else
            {
              throw new Error(
                "Goal symbol '" + symbolRef
                + "' referenced in definition of goal symbol '" + symbol
                + "' is not defined");
            }
            
            resolverStack.pop();
            
            return resolved;
          });
      }
    }
  })
};