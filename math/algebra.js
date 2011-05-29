/**
 * <title>PointedEars' JSX: Math Library: Linear Algebra</title>
 * @requires object.js
 * @requires types.js
 *
 * @section Copyright & Disclaimer
 * 
 * @author
 *   (C) 2000-2011  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 *
 * @partof PointedEars' JavaScript Extensions (JSX)
 * 
 * JSX is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JSX is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSX.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @param A
 * @return number
 *   the row dimension of <code>A</code>;
 *   1 if <code>A</code> is a scalar,
 *   greater than 1 if <code>A</code> is a vector or a matrix.
 *
 * <pre>
 * Term            X           x                 dimRow(x)
 * --------------------------------------------------------
 * scalar          1           1                 1
 * 
 * mX1 col vector (1)
 *                (2)          [1, 2, ..., m]    m
 *                (.)
 *                (m)
 *
 * 1Xn row vector (1 2 ... n)  [[1, 2, ..., n]]  1
 * 
 *                (1 2 ... n)  [[1, 2, ..., n],
 * mXn matrix     (2 . ... .)   [2, ...      ],  m
 *                (. . ... .)   [...         ],
 *                (m . ... .)   [m, ...      ]]
 * </pre>
 */
Math.dimRow = function(A) {
  return (A instanceof Array
    ? A.length
    : 1);
};

/**
 * @param A
 * @return number
 *   The column dimension of <code>A</code>, provided all
 *   rows of <code>A</code> have the same length (as the first one);
 *   0 if <code>A</code> is a scalar,
 *   greater than 0 if <code>A</code> is a vector or a matrix.
 *
 * <pre>
 * Term            X           x                 dimCol(x)
 * --------------------------------------------------------
 * scalar          1           1                 0
 * 
 * mX1 col vector (1)
 *                (2)          [1, 2, ..., m]    1
 *                (.)
 *                (m)
 *
 * 1Xn row vector (1 2 ... n)  [[1, 2, ..., n]]  n
 * 
 *                (1 2 ... n)  [[1, 1, ..., n],
 * mXn matrix     (2 . ... .)   [2, ...      ],  n
 *                (. . ... .)   [...         ],
 *                (m . ... .)   [m, ...      ]]
 * </pre>
 */
Math.dimCol = function(A) {
  return (
    typeof (A = A[0]) != "undefined"
      ? (A[0] instanceof Array ? A[0].length : 1)
      : 0);
};

/**
 * @param A
 * @return the square root of the product of A's row dimension
 * and its column dimension.  The return value indicates
 * whether a matrix A is square or not; for square matrices,
 * the return value is an integer.  It also serves as a
 * means to determine if two matrices are compatible;
 * if their dimensions differ, they cannot be added to
 * one another.
 * @see Math#matrixAdd()
 */
Math.dim = function(A) {
  return Math.sqrt(Math.dimRow(A) * Math.dimCol(A));
};


/** @subsection Matrix Operations */

/**
 * Creates a Matrix object, encapsulating an mXn-dimensional
 * matrix represented by an array of arrays.
 * 
 * @param A : optional Array
 */
Math.Matrix = function(A) {
  this.data = [0];

  if (A)
  {
    if (jsx.object.isMethod(A, "slice"))
    {
      this.data = A.slice(0);
    }
    else
    {
      for (var i = A.length; i--;)
      {
        var row = A[i];
        this.data[i] = [];
        for (var j = row.length; j--;)
        {
          this.data[i][j] = row[j];
        }
      }
    }
  }
};

Math.Matrix.prototype = {
  constructor: Math.Matrix,
  
  putValue: function (x, y, value) {
    var tmp = this.data;

    for (var i = 0, len = arguments.length; i < len - 2; ++i)
    {
      var arg = arguments[i];
      if (typeof tmp[arg] == "undefined")
      {
        tmp[arg] = [];
      }

      tmp = tmp[arg];
    }
    
    var lastArgs = Array.prototype.slice.call(arguments, i);
    tmp[lastArgs[0]] = lastArgs[1];

    return lastArgs[1];
  },

  getValue: function (x, y) {
    var tmp = this.data;

    for (var i = 0, len = arguments.length; i < len; ++i)
    {
      var arg = arguments[i];
      tmp = tmp[arg];

      if (typeof tmp == "undefined")
      {
        break;
      }
    }

    return tmp;
  },

  inc: function (x, y) {
    var
      coords = Array.prototype.slice.call(arguments, 0),
      v = +this.getValue.apply(this, coords);

    return this.putValue.apply(
      this, coords.concat((isNaN(v) ? 0 : +v) + 1));
  },
  
  toString:
    /**
     * Returns the matrix converted to string, i.e.
     * elements of arrays arranged in rows and columns.
     * Makes use of string.js#format() if available.
     * 
     * @param m : optional Matrix
     * @return string
     * @todo
     */
    function(m) {
      if (!m)
      {
        m = this;
      }
  
      if ((m = m.data))
      {
        var
          as = [],
          bHasFormat = (typeof format != "undefined"),
          maxLen;
        
        if (bHasFormat)
        {
          maxLen = Math.max(m);
        }
  
        for (var i = 0, len = m.length; i < len; i++)
        {
          var row = m[i];
          if (bHasFormat)
          {
            as[i] = format("%*$s", row, maxLen + 1);
          }
          else
          {
            as[i] = row.join(" ");
          }
        }
      }
  
      return as.join("\n");
    },

  minor:
    /**
     * Returns the minor of the matrix, i.e. the matrix produced
     * by removing the original's first row and i-th column.
     * 
     * @param i : number
     * @param m : optional Matrix
     * @return string
     * @todo
     */
    function(i, m) {
      if (!m)
      {
        m = this;
      }
  
      if ((m = m.data))
      {
        m = new Math.Matrix(m);
        m.data = m.data.slice(1);
        var j;
        for (m, j = (m = m.data).length; j--;)
        {
          m[j].splice(i, 1);
        }
      }
  
      return m;
    }
};

/**
 * @param a
 * @param b
 * @return Array
 *   The sum of the matrixes <var>a</var> and <var>b</var>
 */
Math.matrixAdd = function(a, b) {
  /*
   * x00 x01 x02   y00 y01 y02   x00+y00 x01+y01 x02+y02
   * x10 x11 x12 + y10 y11 y12 = x10+y10 x11+y11 x12+y12
   * x20 x21 x22   y20 y21 y22   x20+y20 x21+y21 x22+y22
   */
  var result = new Array();

  var dimA, dimB;
  if ((dimA = Math.dim(a)) == (dimB = Math.dim(b)))
  {
    for (var i = 0, a_len = Math.dimRow(a); i < a_len; i++)
    {
      result[i] = new Array();
      for (var j = 0, ai_len = Math.dimCol(a); j < ai_len; j++)
      {
        result[i][j] = a[i][j] + b[i][j];
      }
    }
  }
  else
  {
    throwException(new Math.InvalidOperandError(
        "First matrix's dimension (" + dimA
      + ") != second matrix's dimension (" + dimB + ")"));
    return null;
  }
  
  return result;
};

/**
 * This routine uses the dimensions of <var>a</var> and <var>b</var>
 * to choose the corresponding multiplication routine.  The argument
 * dimensions, the dimension of the corresponding result,  and the
 * multiplication routine that is called are shown in the following
 * table.
 <pre>
               B

   A           qXn                   1Xn                         qX1
               Matrix                row Vector                  col Vector            scalar

   mXq         mXn Matrix            ERROR                       mX1 col Vector        mXq Matrix
   Matrix      MatrixMatrixMultiply                              MatrixVectorMultiply  MatrixScalarMultiply

   1Xq         1Xn row Vector        ERROR                       scalar                1Xq Vector
   row Vector  VectorMatrixMultiply                                                    VectorScalarMultiply

   mX1         ERROR                 mXn Matrix (outer product)  ERROR                 mX1  Vector
   col Vector                        OuterProductMatrix                                VectorScalarMultiply

               qXn Matrix            1Xn row Vector              qX1 col Vector        scalar
   scalar      MatrixScalarMultiply  VectorScalarMultiply        VectorScalarMultiply  standard multipliction
 </pre>

 * @param a
 * @param b
 * @return number|Array
 * @throws Math#InvalidOperandError
 */
Math.multiply = function(a, b) {
  /*
   * x00 x01 ...   y00 y01 ...
   * x10 x11 ... * y10 y11 ...
   * ... ... ...   ... ... ...
   *
   *   x00*y00+x01*y10+...*... x00*y01+x01*y11+...*... x00*...+x01*...+...*...
   * = x10*y10+x11*y10+...*... x10*y01+x11*y11+...*... x00*...+x01*...+...*...
   *   ...*...+...*...+...+... ...*y01+...*y11+...*... x00*...+x01*...+...*...
   */
  
  var dimRowX = Math.dimRow(a);
  var dimColX = Math.dimCol(a);
  var dimRowY = Math.dimCol(b);
  var dimColY = Math.dimCol(b);
  if ((dimRowX && dimColX) || (dimRowY && dimColY))
  {
    if (dimRowX || dimRowY)
    {
//      if (dimRowX && d
      var result = matrixMatrixMultiply(a, b);
    }
    else if (isArray(a) && !isArray(b))
    {
      if (isArray(a[0]))
      {
        // ...
      }
      result = matrix;
    }
    
    result = new Array();
    // matrixMultiply
  }
  else
  {
    result = a * b;
  }
  
  var x_len = a.length;
  var y_len = b.length;
  for (var i = 0, j, xi_len, sum = 0, k;
       i < x_len;
       i++)
  {
    result[i] = new Array();
    xi_len = a[i].length;
    for (j = 0;
         j < xi_len;
         j++, sum = 0)
    {
      if (y_len != xi_len)
      {
        throwException(new Math.InvalidOperandError(
            "First matrix's column dimension (" + xi_len
          + ") != second matrix's row dimension (" + y_len + ")"));
        return null;
      }
      sum += a[i][k] + b[k][i];
    }
    result[i][j] = sum;
  }
  
  if (result.length == 1 && result[i].length == 1)
  {
    result = result[0][0];
  }
  
  return result;
};

/**
 * Computes the intersection of two orthotopes (intervals, rectangles,
 * rectangular cuboids, etc.)
 * <pre>
 * ,------------------.
 * |             ,----+------.
 * |             |/ / |      |
 * |             | / /|      |
 * |             `----+------'
 * `------------------'
 * </pre>
 * <p>
 * Each orthotope is given as a list of Arrays of numbers (which may
 * be encapsulated in a Vector), where each Array or Vector consists
 * of the coordinates of the adjacent vertices of the orthotope
 * (for a rectangle, the x and y coordinates of the left top and
 * right bottom corners).  FIXME: Not reliable in 3D+!
 * </p><p>
 * If you need to compute the intersection of more than two
 * orthotopes, you can compute the intersection of their
 * intersections.
 * </p>
 * @param orthotope1 : Array[Array[double]|Math.Vector]
 *   First orthotope
 * @param orthotope2 : Array[Array[double]|Math.Vector]
 *   Second orthotope
 * @return Array[Array|Vector]
 *   An Array of two Arrays or Vectors of, each of which holds one
 *   vector pointing to an adjacent vertex of the resulting orthotope
 *   that includes all points that the input orthotopes have in common.
 */
Math.intersect = function (orthotope1, orthotope2) {
  var result = [[], []];
  
  var ortho1LeftTop = orthotope1[0];
  for (var i = ortho1LeftTop.length; i--;)
  {
    result[0][i] = (ortho1LeftTop[i] < orthotope2[0][i])
                 ? orthotope2[0][i]
                 : ortho1LeftTop[i];
  }
  
  var ortho1RightBottom = orthotope1[1];
  for (i = ortho1RightBottom.length; i--;)
  {
    result[1][i] = (ortho1RightBottom[i] > orthotope2[1][i])
                 ? orthotope2[1][i]
                 : ortho1RightBottom[i];
  }

  return result;
};
