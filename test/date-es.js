/**
 * The specification of the built-in Date object in edition 3 of the ECMAScript
 * standard is quite complex.  This library is an attempt of an implementation
 * of some methods of this object.  It should be used for test and educational
 * purposes only.
 *
 * @requires
 *   types.js v2004060607 and later,
 *   math.js v2004060607 and later
 */
    
function DateImplementation()
{
}

DateImplementation.addPrototypeProperties(
  {
    msPerDay: 86400000,
    
    Day: function(t)
    {
      return Math.floor(t, this.msPerDay);
    },
    
    TimeWithinDay: function(t)
    {
      return t % this.msPerDay;
    },
    
    DaysInYear: function(y)
    {
      var result = 365;
      if (y % 4 && !(y % 100))
      {
        result = 366;
      }

      return result;
    },
    
    DayFromYear: function(y)
    {
      return 365 * (y-1970)
        + Math.floor((y-1969)/4)
        - Math.floor((y-1901)/100)
        + Math.floor((y-1601)/400);
    },
    
    TimeFromYear: function(y)
    {
      return msPerDay * this.DayFromYear(y);
    },
    
    YearFromTime: function(t)
    {
      // TODO
      // returns the largest integer y (closest to positive
      // infinity) such that TimeFromYear(y) &le; t
    },
    
    InLeapYear: function(t)
    { 
      return Number(this.DaysInYear(this.YearFromTime(t)) == 366);
    },

    MonthFromTime: function(t)
    {
      var result = 0;
      var d = DayWithinYear(t);
      var leap = InLeapYear(t);
      result =
        getIntervalIndex(
          d, 
          getRightOpenIntervals(
            0, 31, 59+leap, 90+leap, 120+leap, 151+leap, 181+leap, 212+leap,
            243+leap, 273+leap, 304+leap, 334+leap, 365+leap));
      
      return result;
    }
    
    // TODO: 2Bcont'd
  }
);