var /*: string :*/ version = "0.1.1.2006100820";

function /*: void :*/ onError(/*: Error :*/ errorObj)
{
   //TODO:
}

function /*: String :*/ assert(/*: boolean :*/ condition)
{
   if (!condition)
   {
      throw new Error();
   }
}

// print("Starting at " + (new Date())); 

/**
 * @depends dhtml.js
 */

function InvalidTargetException(s)
{
  // Error.call(this);
  this.name = "InvalidTargetException";
  this.message = "Invalid target: " + s;
}
// InvalidTargetException.extend(Error);

function InvalidActionException(s)
{
  // Error.call(this);
  this.name = "InvalidActionException";
  this.message = "Invalid action: " + s;
}
// InvalidActionException.extend(Error);

function InvalidTimeOffsetException(s)
{
  // Error.call(this);
  this.name = "InvalidTimeOffsetException";
  this.message = "Invalid time offset: " + s;
}
// InvalidTimeOffsetException.extend(Error);

/**
 * Creates a new Coords object with the coordinates <code>x</code>
 * and <code>y</code>.
 * 
 * @constructor
 * @param x: number
 * @param y: number
 */
function Coords(x, y)
{
  this.x = x || 0;
  this.y = y || 0;
}

function AnimationTarget()
{
  this.position = this.getPosition();
}

AnimationTarget.prototype = {
  constructor: AnimationTarget,

  getPosition: function()
  {
    return new Coords(
      parseInt(dhtml.getStyleProperty(this, 'left'), 10),
      parseInt(dhtml.getStyleProperty('top'), 10));
  },

  setPosition: function(x, y, unit)
  {
    if (dhtml.setStyleProperty(this, 'left', x + unit) &&
        dhtml.setStyleProperty(this, 'top', y + unit))
    {
      this.position.x = x;
      this.position.y = y;
    }
  }
};

/**
 * With this animation framework, an <code>Animation</code>
 * consists of <code>Tween</code>s (a common abbreviation for
 * "in-between").  Tweens consist of delays, <code>Action</code>s,
 * and subtweens (subordered tweens).  The time offset of an
 * item in one tween depends on the previous item in that tween.
 * Different tweens are supposed to affect different target
 * objects (although that is not required) and their time
 * offset is independent of the other tween in the animation:
 * 
 * <pre>
 * Animation ---.
 * Tween a:     '--Action0------Action1------Action2-----Action3->
 * Tween b:     '----------Action0------Action1-------Action2---->
 * </pre>
 * 
 * An item can also be a subtween, in which case the time offset
 * of that subtween depends on the previous action in the
 * supertween (superordered tween), however the time offset of
 * the next action in the supertween is independent of that
 * subtween.  In that case, the subtween affects the same target
 * object as the supertween unless specified otherwise.
 * 
 * <pre>
 * Animation ---.
 * Tween a:     :---Action0------+----------Action1a------------->
 * Subtween 1b: |                '---Action1b:0---Action1b:1----->
 * Tween b:     '-------Action0------Action1-------Action2------->
 * </pre>
 * 
 * There is no limit as to how deep tweens may be nested.
 */

/**
 * Creates a new <code>Animation</code> object for the default
 * target object <code>oTarget</code> and the actions specified
 * by <code>actions</code>.  An <code>Animation</code> is also
 * the main tween, and all other tweens are subtweens of it.
 * 
 * An action may be either a number, specifying a pause in
 * milliseconds, an <code>Action</code> object or a
 * <code>Tween</code> object.  See above.
 * 
 * @constructor
 * @param oTarget: object
 * @params number|Tween|Action
 *   List consisting of delays in milliseconds,
 *   <code>Tween</code>s and <code>Action</code>s.
 *   Use a initial delay to define the time offset
 *   of the animation, tween or action.
 * 
 * @property target: object
 *   Reference to the default target object
 * @property actions: Array
 *   Array of the actions of the animation.
 * @property timeOffset: number
 *   Internal time offset value that is increased with each action
 *   that is not a subtween.
 */
function Animation(oTarget, actions)
{
  this.target = new AnimationTarget(oTarget) || null;
  this.actions = [];
  this.timeOffset = 0;

  // call compile() method of each action, creating tweens
  for (var i = 1, len = arguments.length; i < len; i++)
  {
    var arg = arguments[i];
    
    if (typeof arg == "number")
    {
      this.timeOffset += arg;
    }
    else if (arg instanceof Action || arg instanceof Tween)
    {
      arg.compile(this);
    }
    else
    {
      throw new InvalidActionException(arg);
    }
  }
}

Animation.prototype = {
  constructor: Animation,
  run: function()
  {
    // call run() method of each (sub)tween
  }
};

/**
 * A <code>Tween</code> object is an <code>Animation</code>
 * object with independent time offset.
 * 
 * @param oTarget
 *   Target object of the tween.  Specify <code>null</code>
 *   or a non-object value to use the target object of the
 *   calling supertween.  If there is no supertween,
 *   <code>oTarget</code> must not be <code>null</code>.
 */
function Tween(oSuperTween, oTarget, actions)
{
  Animation.apply(this, Array.prototype.slice.call(arguments, 1));
  this.supertween = oSuperTween;
  if (!(this.target = oTarget || (oSuperTween && oSuperTween.target)))
  {
    throw new InvalidTargetException(this.target);
  }
}

Tween.extend(Animation);
addProperties(
  {
	  compile: function()
	  {
	  }
	},
  Object.ADD_OVERWRITE,
  Tween.prototype);

/**
 * @param x: number
 * @param y: number
 * @param delay: number
 * @param steps: number
 */
function Action(x, y, delay, steps)
{
  this.x = x || 0;
  this.y = y || 0;
  this.delay = delay || 10;
  this.steps = steps || 1;
}

function PositionalAction(x, y, delay, steps, unit)
{
  Action.call(this, x, y, delay, steps);
  this.unit = unit || "px";
}

function Move(x, y, delay, steps)
{
  PositionalAction.call(this, x, y, delay, steps);
}
Move.extend(PositionalAction);

addProperties(
  {
	  compile: function(oTween)
	  {
	    // compile tween (list of timeouts) here
	  },
	  
	  execute: function(oTarget)
	  {
	    oTarget.setPosition(this.x, this.y, this.unit);
	  },
	  
	  toString: function()
	  {
	    return "[object Move]";
	  }
	},
  Object.ADD_OVERWRITE,
  Move.prototype);

// example code
var target = dhtml.getElemById('foo');

var a = new Tween(target, 0,
  new Move(100, 100, 500, 10),  // move to 100,100 in 500 ms and 10 steps
  100,                          // wait 100 ms
  new Move(100, 200, 250, 5));  // move to 200,200 in 250 ms and 5 steps

/*
 * Provided the element was at 0,100 before, the above should create the
 * following sequence:
 *
 *    0 ms: x=  0, y=100 -.
 *   50 ms: x= 10, y=100  |
 *  100 ms: x= 20, y=100  |
 *  150 ms: x= 30, y=100  |
 *  200 ms: x= 40, y=100  |
 *  250 ms: x= 50, y=100   ) first Move()
 *  300 ms: x= 60, y=100  |
 *  350 ms: x= 70, y=100  |
 *  400 ms: x= 80, y=100  |
 *  450 ms: x= 90, y=100  |
 *  500 ms: x=100, y=100 -: 
 *  550 ms: x=100, y=100   ) Pause
 *  600 ms: x=100, y=120 -:
 *  650 ms: x=100, y=140  |
 *  700 ms: x=100, y=160   ) second Move()
 *  750 ms: x=100, y=180  |
 *  800 ms: x=100, y=200 -'
 * 
 * Graphically:
 * 
 *  \x|  0 10  20  30  40  50  60  70  80  90 100
 *  y\|
 * ---+----------------------------------------------
 *  90|
 * 100|  0 50 100 150 200 250 300 350 400 450 500-600
 * 110|                                           
 * 120|                                       600
 * 130|                                           
 * 140|                                       650
 * 150|                                        
 * 160|                                       700
 * 170|                                           
 * 180|                                       750
 * 190|                                           
 * 200|                                       800
 * 
 * Programmatically:
 *  
 * var f = function(oTarget)
 * {
 *   if (oTarget.position.x < 100)
 *   {
 *     oTarget.setPosition(oTarget.position.x += 10, 100);
 *   }
 *   else
 *   {
 *     window.clearInterval(arguments.callee.i);
 *   }
 * };
 * 
 * f.i = window.setInterval(f, 50, oTarget);
 */