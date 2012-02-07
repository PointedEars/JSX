/**
 * Arbitrary precision decimal
 * 
 * @param value : Number[optional]
 *   If <var>scale</var> is not provided: Value to be translated to a
 *   <code>BigDecimal</code>; the default is <code>NaN</code>.
 *   If <var>scale</var> is provided: The unscaled internal value of
 *   the <code>BigDecimal</code>.  The value of the <code>BigDecimal</code>
 *   is (<var>value</var> × 10<sup>−<var>scale</var></sup>).
 * @param scale : Number[optional]
 *   The internal scale value, i. e. the number of times that the internal
 *   value must be divided by 10 to compute the number represented by
 *   the <code>BigDecimal</code>.
 */
jsx.math.BigDecimal = function (value, scale) {
  /* null or undefined */
  if (value == null)
  {
    value = NaN;
  }

  var originalValue, unscaledValue;
  
  /* null or undefined */
  if (scale == null)
  {
    this.originalValue = value;
    
    var s = (+value).toString();
    var digits = (s.match(/\.(\d+)$/) || [, ""])[1];
  
    this.scale = digits.length;
    this.unscaledValue = value * Math.pow(10, this.scale);
  }
  else
  {
    this.originalValue = NaN;
    this.unscaledValue = +value;
    this.scale = +scale;
  }
  
  /**
   *  @return Number
   */
  this.getOriginalValue = function () {
    return this.originalValue;
  };

  /**
   *  @return Number
   */
  this.getUnscaledValue = function () {
    return this.unscaledValue;
  };

  /**
   * @param value : Number
   * @return BigDecimal
   */
  this._setUnscaledValue = function (value) {
    this.unscaledValue = value;
    return this;
  };

  /**
   * @return Number
   */
  this.getScale = function () {
    return this.scale;
  };

  /**
   * @param value : Number
   * @return BigDecimal
   */
  this._setScale = function (value) {
    this.scale = value;
    return this;
  };
};

/**
 * Returns the normalization of two <code>BigDecimal</code> values.
 * 
 * The normalization of two <code>BigDecimal</code> values are two
 * <code>BigDecimal</code> values that represent the same values as
 * before but with the same scale.
 * 
 * @param value1 : jsx.math.BigDecimal
 * @param value2 : jsx.math.BigDecimal
 * @returns Array of the normalized values, in the order in which their
 *   corresponding original values were passed.
 */
jsx.math.BigDecimal.normalize = (function () {
  var BigDecimal = jsx.math.BigDecimal;
  
  return function (value1, value2) {
    var scale1 = value1.getScale();
    var scale2 = value2.getScale();
    if (scale1 == scale2)
    {
      return [value1, value2];
    }
    
    var switched = false;
    if (scale1 < scale2)
    {
      switched = true;
      var tmp = value2;
      value2 = value1;
      value1 = tmp;
  
      var tmp = scale2;
      scale2 = scale1;
      scale1 = tmp;
    }
    
    value2 = new BigDecimal(
      value2.getUnscaledValue() * Math.pow(10, scale1 - scale2),
      Math.max(scale1, scale2));
    
    if (switched)
    {
      tmp = value2;
      value2 = value1;
      value1 = tmp;
    }
    
    return [value1, value2];
  };
}());

jsx.math.BigDecimal.extend(null, {
  /**
   * Adds a number to the <code>BigDecimal</code> and returns the result.
   * The original internal value remains unchanged.
   * 
   * @memberOf jsx.math.BigDecimal.prototype
   * @param summand2 : jsx.math.BigDecimal|number
   *   The <code>BigDecimal</code> or <code>Number</code> to be added.
   *   If a <code>Number</code>, <var>summand2</var> is converted to a
   *   <code>BigDecimal</code> first.
   * @returns {jsx.math.BigDecimal}
   */
  add: (function () {
    var BigDecimal = jsx.math.BigDecimal;

    return function (summand2) {
      if (!(summand2 instanceof BigDecimal))
      {
        summand2 = new BigDecimal(summand2);
      }
      
      var normalized = BigDecimal.normalize(this, summand2);
      
      var summand1 = normalized[0].getUnscaledValue();
      var summand2 = normalized[1].getUnscaledValue();
      
      /* Improve precision by using the smaller summand first */
      if (summand2 < summand1)
      {
        var tmp = summand1;
        summand1 = summand2;
        summand2 = tmp;
      }
      
      var d = new BigDecimal(summand1 + summand2, normalized[0].getScale());
      
      return d;
    };
  }()),
  
  /**
   * Subtracts a number from the <code>BigDecimal</code> and returns the result.
   * The original internal value remains unchanged.
   * 
   * @memberOf jsx.math.BigDecimal.prototype
   * @param subtrahend : jsx.math.BigDecimal|number
   *   The <code>BigDecimal</code> or <code>Number</code> to be subtracted.
   *   If a <code>Number</code>, <var>summand2</var> is converted to a
   *   <code>jsx.math.BigDecimal</code> first.
   * @returns {jsx.math.BigDecimal}
   * @see jsx.math.BigDecimal.prototype#add
   */
  subtract: function (subtrahend) {
    return this.add(-subtrahend);
  },
  
  /**
   * Multiplies the <code>jsx.math.BigDecimal</code> with a number and returns the result.
   * The original internal value remains unchanged.
   * 
   * @param factor2 : jsx.math.BigDecimal|number
   *   The <code>jsx.math.BigDecimal</code> or <code>Number</code> to be multiplied by.
   *   If a <code>Number</code>, <var>summand2</var> is converted to a
   *   <code>jsx.math.BigDecimal</code> first.
   * @returns {jsx.math.BigDecimal}
   */
  multiply: (function () {
    var BigDecimal = jsx.math.BigDecimal;
    
    return function (factor2) {
      if (!(factor2 instanceof BigDecimal))
      {
        factor2 = new BigDecimal(factor2);
      }
      
      var normalized = BigDecimal.normalize(this, factor2);
      
      var factor1_value = normalized[0].getUnscaledValue();
      var factor2_value = normalized[1].getUnscaledValue();
      
      var d = new BigDecimal(factor1_value * factor2_value, 2 * normalized[0].getScale());
      
      return d;
    };
  }()),
  
  /**
   * Compares this <code>BigDecimal</code> with the specified BigDecimal.
   * 
   * @param d : jsx.math.BigDecimal
   * @return Number
   *   <code>&lt; -1</code> if this <code>BigDecimal</code> is smaller than <var>d</var>,
   *   <code>&gt; 1</code> if it is greater than <var>d</var>,
   *   <code>0</code> if they are equal.
   */
  compareTo: (function () {
    var BigDecimal = jsx.math.BigDecimal;
    
    return function (d) {
      if (!(d instanceof BigDecimal))
      {
        d = new BigDecimal(d);
      }
      
      var normalized = BigDecimal.normalize(this, d);
      
      return normalized[0].getUnscaledValue() - normalized[1].getUnscaledValue();
    };
  }()),
  
  equals: (function () {
    var BigDecimal = jsx.math.BigDecimal;
    
    return function (d) {
      if (!(d instanceof BigDecimal))
      {
        d = new BigDecimal(d);
      }
      
      return this.getUnscaledValue() == d.getUnscaledValue()
        && this.getScale() == d.getScale();
    };
  }()),
  
  /**
   * Returns a <code>BigDecimal</code> which is numerically equal to
   * this one but with any trailing zeros removed from the representation.
   * 
   * @return jsx.math.BigDecimal
   */
  stripTrailingZeros: (function () {
    var BigDecimal = jsx.math.BigDecimal;
    
    return function () {
      var unscaledString = this.getUnscaledValue().toString();
      /* FIXME: new BigDecimal(2, 21) */
      var parts = unscaledString.match(/(0+)$/) || ["", ""];
      var insignificantLength = parts[1].length;
      if (insignificantLength > 0)
      {
        return new BigDecimal(
          unscaledString.substring(0, unscaledString.length - insignificantLength),
          -insignificantLength);
      }
      
      return this;
    };
  }()),

  /**
   * Returns the <code>Number</code> value represented by the
   * <code>BigDecimal</code>.
   * 
   * @returns {Number}
   */
  valueOf: function () {
    return this.getUnscaledValue() * Math.pow(10, -this.getScale());
  },
  
  /**
   * Returns the JSON representation of the <code>BigDecimal</code>
   * 
   * @returns {String}
   */
  toJSON: function () {
    return "{" + [
        "'originalValue': " + this.getOriginalValue(),
        "'unscaledValue': " + this.getUnscaledValue(),
        "'scale': " + this.getScale()
      ].join(", ")
      + "}";
  },

  /**
   * Returns the string representation of value represented by the
   * <code>BigDecimal</code>, without using exponent notation.
   * 
   * @returns {String}
   */
  toPlainString: function () {
    var unscaledValue = this.getUnscaledValue();
    var unscaledString = unscaledValue.toString();
    var unscaledLength = unscaledString.length;
    var scale = this.getScale();
    var result;
    var a = [];
    
    if (scale - unscaledLength > 0)
    {
      a.length = scale - unscaledLength + 1;
      result = "0." + a.join("0") + unscaledString;
    }
    else if (scale - unscaledLength < 0)
    {
      a.length = -scale + 1;
      
      var decimals = unscaledString.substring(unscaledLength - scale);
      result = unscaledString.slice(0, unscaledLength - scale)
        + a.join("0")
        + (decimals ? "." + decimals : "");
    }
    
    return result;
  }
});