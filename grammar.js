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