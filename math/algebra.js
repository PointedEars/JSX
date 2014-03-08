/**
 * <title>PointedEars' JSX: Math Library: Linear Algebra</title>
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2000-2011, 2013, 2014  Thomas Lahn &lt;js@PointedEars.de&gt;
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

(function () {
  /* Imports */
  var _isArray = jsx.object.isArray;
  var _get = jsx.array.get;
  var _math = jsx.math;
  var _add = _math.add;
  var _sub = _math.sub;
  var _mul = _math.mul;
  var _div = _math.div;
  var _pow = _math.pow;
  var _sqrt = _math.sqrt;

  var _Tensor = (
    /**
     * Creates a <code>Tensor</code> object encapsulating
     * an tensor represented by an array of arrays.
     *
     * A tensor is a generalization of scalars, vectors, and
     * matrices to an arbitrary number of indices.  The rank
     * of a tensor specifies the number of its indices: A scalar
     * is a tensor of rank 0 (no index), a vector of rank 1,
     * a matrix of rank 2, aso.
     *
     * @constructor
     * @param {Array} components
     * @return {jsx.math.Tensor} when called as a factory
     */
    function jsx_math_Tensor (components) {
      if (!(this instanceof _Tensor))
      {
        return new _Tensor(components);
      }

      /**
       * The components of this tensor
       * @type Array
       */
      this.components = components || [0];
    }
  ).extend(null, {
    /* Initialisers */

    /**
     * Fills this tensor with components.
     *
     * @memberOf jsx.math.Tensor.prototype
     * @param {Array} dimensions (optional)
     *   The array containing the dimensions of the tensor.
     *   If not provided, the tensor is the scalar <code>0</code>.
     * @param {Number|Function} fill (optional)
     *   The value the tensor should be filled with.  If a function,
     *   the return value of the function for each component, whereas
     *   the function is passed the indices of the component as
     *   argument list.  The default is <code>0</code>.
     * @todo
     */
    fill: function (dimensions, fill) {
      return jsx.throwThis(_math.NotImplementedError);
    },

    /* Information methods */

    /**
     * Returns a component of this tensor by coordinates,
     * or a copy of of it as an <code>Array</code>.
     *
     * @param {Array} coords (optional)
     * @return {any|Array}
     */
    "get": function (coords) {
      /* TODO: Copy components recursively */
      var data = this.components.map(function (row) {
        return _isArray(row) ? row.slice() : row;
      }).slice();

      if (_isArray(coords))
      {
        for (var i = 0, len = coords.length; i < len; ++i)
        {
          var coord = coords[i];

          data = data[coord];

          if (!data)
          {
            break;
          }
        }
      }

      return data;
    },

    /**
     * Sets a component of this tensor by coordinates.
     *
     * @param {Array} coords
     * @param {any} value
     * @return {any}
     *   The new component value
     */
    "set": function (coords, value) {
      var tmp = this.components;

      var i = 0;
      for (var len = coords.length; i < len - 1; ++i)
      {
        var coord = coords[i];
        if (coord < 0)
        {
          jsx.throwThis("jsx.math.CoordinateError");
          return;
        }

        if (i < len - 1)
        {
          if (!_isArray(tmp[coord]))
          {
            tmp[coord] = [];
          }

          tmp = tmp[coord];
        }
      }

      var last_coord = _get(coords, -1);
      tmp[last_coord] = value;

      return tmp[last_coord];
    },

    /**
     * Returns the size of this tensor, i.e. the
     * maximum of used indexes + 1, per index.
     *
     * @return {Array}
     * @todo
     */
    size: function () {
      return jsx.throwThis(_math.NotImplementedError);

      var components = this.components;
      var sizes = [components.length];
      var index = 1;

      while (_isArray(components = components[0]))
      {
        sizes[i++] = Math.max.apply(components.map(function (e) {
          return e.length;
        }));
      }

      return sizes;
    },

    /**
     * Returns the rank of this tensor, i.e. the
     * maximum number of used indexes.
     *
     * @return {number}
     */
    rank: function () {
      return this.size().length;
    },

    /* Basic operations */

    /**
     * Returns the sum of this tensor and compatible one.
     *
     * <p>Example:</p><pre>
     * [[[[1]], …], …] + [[[[1]], …], …] = [[[[2]], …], …]
     * a_0,0,0,0=1     + b_0,0,0,0=1     = c_0,0,0,0=2</pre>
     * @param {jsx.math.Tensor} tensor2
     * @return {jsx.math.Tensor}
     */
    add: function (tensor2) {
      var components = this.get();
      var components2 = tensor2.get();

      for (var i = components.length; i--;)
      {
        var row = components[i];
        if (typeof row == "number")
        {
          components[i] = _add(components[i], components2[i]);
        }
        else
        {
          for (var j = row.length; j--;)
          {
            if (_isArray(row[j]))
            {
              row[j] = _Tensor(row[j]).add(_Tensor(components2[i][j])).get();
            }
            else
            {
              row[j] = _add(row[j], components2[i][j]);
            }
          }
        }
      }

      return new this.constructor(components);
    },

    /**
     * Returns the difference between this tensor and a compatible one.
     *
     * @param {jsx.math.Tensor|Number} m2
     * @return {jsx.math.Tensor}
     */
    sub: function (tensor2) {
      return this.add(_mul(tensor2, -1));
    }
  });

  var _Vector = (function () {
    /**
     * Returns the result of multiplication of this vector with a value.
     * <p>
     * Returns the result of multiplication of this vector
     * by a scalar, or the cross product of this vector and
     * another vector.
     * </p><p>
     * The cross product is only defined for three-dimensional vectors.
     * It is a vector that is orthogonal to both the operand vectors,
     * considering their direction.
     * </p>
     * @param {Number|jsx.math.Vector} value
     * @return {jsx.math.Vector}
     *   <code>this</code> × <code><var>vector2</var></code>
     * @throws {jsx.InvalidArgumentError}
     *   if the vectors are not compatible
     */
    function _cross (value)
    {
      var components = this.get();

      if (!(value instanceof _Vector))
      {
        /* Scalar multiplication */
        for (var i = components.length; i--;)
        {
          components[i] = _mul(components[i], value);
        }

        return new _Vector(components);
      }

      var components2 = value.get();

      var len = components.length;
      var len2 = components2.length;
      if (len != 3 || len2 != 3 || len != len2)
      {
        return jsx.throwThis(jsx.InvalidArgumentError,
          [null,
           this + " and " + value,
           "two three-dimensional vectors"]);
      }

      return new _Vector([
        _sub(_mul(components[1], components2[2]), _mul(components[2], components2[1])),
        _sub(_mul(components[0], components2[2]), _mul(components[2], components2[0])),
        _sub(_mul(components[0], components2[1]), _mul(components[1], components2[0]))
      ]);
    }

    /**
     * Returns the magnitude (or length) of this vector.
     *
     * @return {number}
     */
    function _mag ()
    {
      var sum = 0;

      var components = this.get();
      for (var i = components.length; i--;)
      {
        /*
         * NOTE: We could do this by dot product instead
         * (||A||^2 = A . A), but exponentiation by 2
         * should be slightly faster than multiplication.
         */
        sum = _add(sum, _pow(components[i], 2));
      }

      return _sqrt(sum);
    }

    var _Vector = (
      /**
       * @constructor
       * @param {Array} components
       *   The components of this vector.
       * @param {Number} size
       *   The number of components of this vector.
       * @param {Number|Function|any} fill (optional)
       *   The value <var>size</var> components should be
       *   filled with.
       *   A <code>Number</code>, or a <code>Function</code>
       *   returning a <code>Number</code>, is preferred (as being
       *   ideal for further computations), but not required.
       *
       *   If a <code>Function</code>, the return value of the
       *   <code>Function</code> for each component is used, where
       *   the <code>Function</code> is passed the index of
       *   the component as only argument, and the <code>this</code>
       *   value is set to the new instance.
       *   The default is <code>undefined</code>.
       */
      function jsx_math_Vector (components, size, fill) {
        if (!(this instanceof _Vector))
        {
          return new _Vector(components, size, fill);
        }

        var components = (components || [0]);

        if (typeof size != "undefined")
        {
          components.length = size;
        }

        if (typeof fill != "undefined")
        {
          for (var i = 0, len = components.length; i < len; ++i)
          {
            components[i] =  (typeof fill == "function"
              ? fill.call(this, i)
              : fill);
          }
        }

        this.components = components;
      }
    ).extend(_Tensor, {
      /* Information methods */

      /**
       * @memberOf jsx.math.Vector.prototype
       */
      abs: _mag,
      mag: _mag,

      /**
       * Returns the angle between this vector and another vector.
       *
       * @param {jsx.math.Vector} vector2
       * @return {number}
       *   Angle between this vector and <code><var>vector2</var></code>
       *   in radians.
       */
      angle: function (vector2) {
        return Math.acos(this.dot(vector2) / (this.mag() * vector2.mag()));
      },

      /* Operations */

      cross: _cross,
      mul: _cross,

      /**
       * Returns the dot product of this vector and another vector.
       * <p>
       * The dot product is defined for two vectors of arbitrary,
       * but equal dimension.  It is a scalar that can be used to
       * determine the angle between the two vectors.
       * </p>
       * @param {jsx.math.Vector} vector2
       * @return {any} <code><var>this</var></code> · <code><var>vector2</var></code>
       * @see #angle(jsx.math.Vector)
       * @throws {jsx.InvalidArgumentErrror}
       *   if the dimensions of the vectors are not equal
       */
      dot: function (vector2) {
        var result = 0;
        var components = this.get();
        var components2 = vector2.get();

        for (var i = components.length; i--;)
        {
          result = _add(result, _mul(components[i], components2[i]));
        }

        return result;
      },

      /**
       * Returns the Hadamard/Schur/entrywise product of two matrices.
       *
       * @param {jsx.math.Vector} vector2
       * @return {jsx.math.Vector}
       */
      mulEntrywise: function (vector2) {
        var components = this.get();
        var components2 = vector2.get();
        for (var i = components.length; i--;)
        {
          components[i] *= components2[i];
        }

        return new _Vector(components);
      },

      toString: function () {
        return "(" + this.components.join(", ") + ")";
      },

      /**
       * Returns the unit vector for this vector.
       *
       * The unit vector for this vector is a vector of
       * the same direction, but unit length.
       */
      unit: function () {
        var mag = this.mag();

        return new _Vector(this.get().map(function (component) {
          return _div(component, mag);
        }));
      }
    });

    return _Vector;
  }());

  /** @subsection Matrix algrebra */

  var _Matrix = jsx.object.extend(
    /**
     * Creates a <code>Matrix</code> encapsulating
     * an m × n matrix and associated operations.
     *
     * <pre> (a<sub>00</sub>    a<sub>01</sub>     .. a<sub>0<var>(n−1)</var></sub>        )
     * (a<sub>10</sub>    a<sub>11</sub>     .. a<sub>0<var>(n−)</var></sub>        )
     * ( :      :      `.  :         )
     * (a<sub><var>(m−1)</var>0</sub> a<sub><var>(m−1)</var>1</sub> .. a<sub><var>(m−1)</var><var>(n−1)</var></sub>)</pre>
     *
     * The matrix components are represented by
     * an <Code>Array</code> of <code>Array</code>s:
     *
     * <pre> <code>[[a<sub>00</sub>, a<sub>01</sub>, ..., a<sub><var>0</var><var>n</var></sub>],
     *  [a<sub>10</sub>, a<sub>11</sub>, ..., a<sub>0<var>n</var></sub>],
     *  ...
     *  [a<sub><var>m</var>0</sub>, a<sub><var>m</var>1</sub>, ..., a<sub><var>m</var><var>n</var></sub>]]</code></pre>
     *
     * @constructor
     * @param {Array|Number|Null|Undefined} rows (optional)
     *   The <code>Array</code> of <code>Arrays</code> containing
     *   the components of the new matrix, or the number of its rows.
     *   The default (used when the argument is a null-value),
     *   or <code>null</code> is <code>1</code>, which creates a
     *   matrix that transforms like a scalar if
     *   <code><var>columns</var></code> is a null-value,
     *   and like a row vector if <code><var>columns</var> > 1</code>.
     * @param {Number|Null|Undefined} columns (optional)
     *   The number of columns of the matrix; ignored if <var>rows</var>
     *   is an <code>Array</code>.  Otherwise, the default is <code>1</code>,
     *   which creates a matrix that transforms like a scalar if
     *   <code><var>rows</var> is a null-value</code>, and like a
     *   column vector if <code><var>rows</var> > 1</code>.
     * @param {Number|Function|any} fill (optional)
     *   The value the matrix should be filled with.  A <code>Number</code>,
     *   or a <code>Function</code> returning a <code>Number</code>,
     *   is preferred (as being ideal for further computations),
     *   but not required.
     *
     *   If a <code>Function</code>, the return value of the
     *   <code>Function</code> for each component is used, where
     *   the <code>Function</code> is passed the indices of
     *   the component as arguments, and the <code>this</code>
     *   value is set to the new instance.  (For example, specify
     *   <code><var>rows</var> === <var>columns</var></code>
     *   and {@link jsx.math.Matrix.KRONECKER_DELTA}
     *   to create an identity/unit matrix.)
     *   The default is <code>undefined</code>.
     * @return {jsx.math.Matrix} when called as a factory
     * @throws {jsx.math.DimensionError}
     *   if the matrix has less than 1 row or a row has less
     *   than 1 column.
     */
    function jsx_math_Matrix (rows, columns, fill) {
      if (!(this instanceof _Matrix))
      {
        return _Matrix.construct(arguments);
      }

      this.components = [];

      if (_isArray(rows))
      {
        if (rows.length < 1)
        {
          return jsx.throwThis(_math.DimensionError);
        }

        /* Set Matrix from Array */
        if (typeof rows.slice == "function")
        {
          for (var i = rows.length; i--;)
          {
            var row = rows[i];
            if (row.length < 1)
            {
              return jsx.throwThis(_math.DimensionError);
            }

            this.components[i] = _isArray(row) ? row.slice() : row;
          }
        }
        else
        {
          for (var i = rows.length; i--;)
          {
            var row = rows[i];
            if (row.length < 1)
            {
              return jsx.throwThis(_math.DimensionError);
            }

            this.components[i] = [];
            for (var j = row.length; j--;)
            {
              this.components[i][j] = row[j];
            }
          }
        }
      }
      else
      {
        /* Build Matrix by dimensions */
        var a = [];

        /* null or undefined */
        if (rows == null)
        {
          rows = 1;
        }

        if (!rows || rows < 1)
        {
          return jsx.throwThis(_math.DimensionError);
        }

        if (columns == null)
        {
          columns = 1;
        }

        if (columns < 1)
        {
          return jsx.throwThis(_math.DimensionError);
        }

        for (var i = 0; i < rows; ++i)
        {
          var tmp = [];
          tmp.length = columns;

          for (var j = 0; j < columns; ++j)
          {
            tmp[j] =  (typeof fill == "function"
              ? fill.call(this, i, j)
              : fill);
          }

          if (tmp.length > 1)
          {
            a.push(tmp);
          }
          else
          {
            a.push(tmp[0]);
          }
        }

        this.components = a;
      }
    },
    {
      /**
       * The Kronecker delta function.
       *
       * Takes two arguments, <var>i</var> and <var>j</var>, and
       * returns <code>1</code> if they are equal after implicit
       * type conversion, <code>0</code> otherwise:
       * <pre>
       * &delta;<sub><var>i</var><var>j</var></sub> := {1 if <var>i</var> == <var>j</var>;
       *        0 otherwise}</pre>
       * Useful for creating identity/unit matrices.
       *
       * @param {Number|any} i
       * @param {Number|any} j
       * @memberOf jsx.math.Matrix
       * @return {number}
       * @see jsx.matrix.Matrix(Number, Number, Function)
       */
      KRONECKER_DELTA: function (i, j) { return +(i == j); }
    }
  ).extend(_Tensor, {
    /* Information methods */

    /**
     * Returns the size of this matrix, i.e. the
     * numbers of rows, and the numbers of columns per row.
     *
     * @memberOf jsx.math.Matrix.prototype
     * @return {Array}
     */
    size: function () {
      var rows = this.components;
      var _size = [rows.length, rows[0].length];
      _size.rows = _size[0];
      _size.columns = _size[1];

      return _size;
    },

    /* Basic operations */

    /**
     * Returns the result of multiplication of this matrix with a value.
     * <p>
     * Returns the result of multiplication of this matrix
     * by a scalar, or of linear algebraic matrix multiplication
     * with another, compatible matrix.
     * </p>
     * @param {Number|jsx.math.Matrix} value
     * @return {jsx.math.Matrix} <code>this</code> × <code><var>value</var></code>
     * @throws {jsx.InvalidArgumentError}
     *   if the matrices are not compatible (the row dimension
     *   of this matrix must equal the column dimension of
     *   the other one).
     */
    mul: function (value) {
      var components = this.get();

      if (!(value instanceof _Tensor))
      {
        /* Scalar multiplication */
        for (var i = components.length; i--;)
        {
          for (var j = components[i].length; j--;)
          {
            components[i][j] = _mul(components[i][j], value);
          }
        }

        return new _Matrix(components);
      }

      var components2 = value.get();
      var m = new _Matrix();
      var num_rows = components.length;
      var num_rows2 = components2.length;

      for (var k = 0, num_cols2 = components2[0].length; k < num_cols2; ++k)
      {
        for (var i = 0; i < num_rows; ++i)
        {
          var this_row = components[i];
          var sum = 0;

          for (var j = 0, num_cols = this_row.length; j < num_cols; ++j)
          {
            if (j > num_rows2 - 1)
            {
              return jsx.throwThis(jsx.InvalidArgumentError,
                ["Incompatible matrices",
                 "m1.size() === [m, n]; m2.size() === [n, x]",
                 this.size() + ", " + value.size()]);
            }

            sum = _add(sum, _mul(components[i][j], components2[j][k]));
          }

          m.set([i, k], sum);
        }
      }

      return m;
    },

    /**
     * Returns the Hadamard/Schur/entrywise product of two matrices.
     *
     * @param {jsx.math.Matrix} m2
     * @return {jsx.math.Matrix}
     */
    mulEntrywise: function (matrix2) {
      var components = this.get();
      var components2 = matrix2.get();

      for (var i = components.length; i--;)
      {
        for (var j = components[i].length; j--;)
        {
          components[i][j] = _mul(components[i][j], components2[i][j]);
        }
      }

      return new _Matrix(components);
    },

    /**
     * Returns the Kronecker product of two matrices.
     *
     * @param {Matrix} matrix2
     * @return {jsx.math.Matrix}
     * @todo
     */
    mulKronecker: function (matrix2) {
      var rows = this.get();
      var rows2 = matrix2.get();
      var size = this.size();
      var size2 = matrix2.size();
      var new_matrix = new _Matrix(size.rows * size2.rows, size.columns * size2.columns);
      var new_data = new_matrix.get();
      var new_size = new_matrix.size();

//      return jsx.throwThis(jsx.math.NotImplementedError);

      var new_row = new_size.rows - 1;

      for (var i = rows.length; i--;)
      {
        var row = rows[i];
        var len2 = row.length;

        for (var m = rows2.length; m--;)
        {
          var new_column = new_size.columns - 1;
          var m2_row = rows2[m];
          var len4 = m2_row.length;

          for (var j = len2; j--;)
          {
            for (var n = len4; n--;)
            {
              new_data[new_row][new_column--] = _mul(row[j], m2_row[n]);
            }
          }

          --new_row;
        }
      }

      return new _Matrix(new_data);
    },

    /**
     * Increases a component of this matrix by 1
     */
    inc: function (coords) {
      var v = +this.get.apply(this, coords);

      return this.set.apply(this, coords.concat((isNaN(v) ? 0 : v) + 1));
    },

    /**
     * Divides each component of this matrix by a value,
     * and returns the resulting matrix.
     *
     * @param {Number} value
     * @return {jsx.math.Matrix}
     */
    div: function (value) {
      if (value instanceof _Matrix)
      {
        return jsx.throwThis(jsx.InvalidArgumentError, [null, "Number", value]);
      }

      return this.mul(1 / value);
    },

    /**
     * Applies a mapping callback to each component of this matrix
     * and returns the result.
     *
     * @param {Function} callback
     *   Called for each component, with the component, its
     *   coordinates as an <code>Array</code>, and this
     *   <code>Matrix</code> as argument list.  Its return value
     *   is used as the returned new component value.
     * @param {Object} thisValue (optional)
     *   The callbacks <code>this</code> value.  The default
     *   is this <code>Matrix</code>.
     * @return {jsx.math.Matrix}
     */
    map: function (callback, thisValue) {
      return new _Matrix(this.get().map(function (row, rowIndex, matrix) {
        return row.map(function (component, columnIndex) {
          return callback.call(thisValue, component, [rowIndex, columnIndex], matrix);
        });
      }));
    },

    /**
     * Computes the square root of each component of this matrix
     * and returns the result.
     *
     * @return {jsx.math.Matrix}
     */
    sqrt: function () {
      return this.map(function (component) {
        return _sqrt(component);
      });
    },

    /**
     * Returns the transpose of this matrix
     *
     * @return {jsx.math.Matrix}
     */
    transpose: function () {
      var size = this.size();
      var transposed = new _Matrix(size.columns, size.rows).get();

      var components = this.get();
      for (var i = components.length; i--;)
      {
        var row = components[i];

        for (var j = row.length; j--;)
        {
          transposed[j][i] = row[j];
        }
      }

      return new _Matrix(transposed);
    },

    /* Row operations */

    /**
     * Switches two rows of a matrix and returns the result.
     *
     * @param {Number} row1
     * @param {Number} row2
     * @return {jsx.math.Matrix}
     */
    switchRows: function (row1, row2) {
      var rows = this.get();

      var tmp = rows[row1];
      rows[row1] = rows[row2];
      rows[row2] = tmp;

      return new _Matrix(rows);
    },

    /**
     * Multiplies each element in a row by a non-zero constant.
     *
     * @param {Number} rowIndex
     * @param {Number} factor
     * @return {jsx.math.Matrix}
     */
    mulRow: function (rowIndex, factor) {
      if (factor == 0)
      {
        return jsx.throwThis(jsx.InvalidArgumentError,
          ["Factor must not be 0"]);
      }

      var rows = this.get();
      var row = rows[rowIndex];

      if (!row)
      {
        return jsx.throwThis(jsx.InvalidArgumentError,
          ["No such row index", rowIndex]);
      }

      for (var j = row.length; j--;)
      {
        row[j] = _mul(row[j], factor);
      }

      return new _Matrix(rows);
    },

    /* Methods for square matrices */

    /* Information methods */

    /**
     * Returns the trace of this matrix.
     *
     * The trace of a matrix is the sum of its main diagonal
     * components.  It is therefore only defined for square
     * matrices.
     *
     * @return {number}
     * @throws {TypeError}
     *   if the matrix has no or broken rows, or is not square
     */
    trace: function () {
      var result;
      var rows = this.components;

      for (var i = 0, len = rows.length; i < len; ++i)
      {
        var row = rows[i];
        if (!row)
        {
          return jsx.throwThis("TypeError", "No or broken rows");
        }

        var component = row[i];
        if (!component)
        {
          return jsx.throwThis("TypeError", "Not a square matrix");
        }

        if (typeof result == "undefined")
        {
          result = component;
        }
        else
        {
          result = _add(result, component);
        }
      }

      return result;
    },

    /**
     * Returns the determinant of this matrix.
     *
     * @return {Number}
     *   <code>NaN</code> if one or more components could not
     *   be converted to <code>Number</code>, or more than one
     *   component was not finite.  <code>Infinity</code> or
     *   <code>-Infinity</code> if one component was not finite.
     * @throws {TypeError} if the Matrix is not square
     */
    det: function () {
      var result = 0;
      var rows = this.components;
      var num_rows = rows.length;
      var first_row = rows[0];
      var num_cols = first_row.length;

      if (num_rows != num_cols)
      {
        return jsx.throwThis("TypeError", "Not a square matrix");
      }

      if (num_cols == 2)
      {
        return rows[0][0] * rows[1][1] - rows[0][1] * rows[1][0];
      }

      for (var col = 0; col < num_cols; ++col)
      {
        var product1 = rows[0][col];
        var product2 = product1;
        var offset = 0;

        for (var row = 1; row < num_cols; ++row)
        {
          ++offset;
          var this_row = rows[row];
          product1 = _mul(product1, this_row[(col + offset) % num_cols]);
          product2 = _mul(product2, _get(this_row, col - offset));
        }

        result = _add(result, _sub(product1, product2));
      }

      return result;
    },

    /**
     * Returns the human-readable string representation of this
     * matrix, i.e. elements of arrays arranged in rows and columns.
     * Makes use of string.js#format() if available.
     *
     * @param {String} prefix (optional)
     *   Prefix for the second, third, aso. row.  <code>" "</code>
     *   is useful in consoles where the output is prefixed by
     *   <kbd>"</kbd>.  The default is the empty string.
     * @return {string}
     * @todo
     */
    toString: function (prefix) {
      var m;
      if ((m = this.get()))
      {
        var
          as = [],
          /* FIXME */
          _sprintf = jsx.object.getFeature(jsx, "string", "sprintf"),
          max_len;

        if (_sprintf)
        {
          /* TODO: Calculate optimum width per column */
          max_len = Math.max.apply(Math, m.map(function (row) {
            return Math.max.apply(Math, row.map(function (component) {
              return component.toString().length;
            }));
          }));
        }

        for (var i = 0, len = m.length; i < len; i++)
        {
          var row = m[i];
          if (_sprintf)
          {
            as[i] = _sprintf("%*a", row, max_len + 1);
          }
          else
          {
            as[i] = row.join(" ");
          }
        }
      }

      return as.join("\n" + (prefix || ""));
    },

    /**
     * Returns the minor of this matrix.
     *
     * @param {Number} column
     * @return {jsx.math.Matrix}
     *   The matrix produced by removing this matrix's first row
     *   and <code><var>column</var></code>-th column (counting
     *   from 0).
     */
    minor: function (column) {
      var rows = this.get().slice(1);

      for (var j = rows.length; j--;)
      {
        rows[j].splice(column, 1);
      }

      return new _Matrix(rows);
    }
  });

  jsx.object.extend(jsx.math, {
    Tensor: _Tensor,
    Vector: _Vector,
    Matrix: _Matrix
  });

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
  _math.intersect = function (orthotope1, orthotope2) {
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

  /**
   * @constructor
   * @extends jsx.InvalidArgumentError
   */
  _math.DimensionError = function () {
    arguments.callee._super.call(this, "Dimension must be 1 or greater");
  };

  _math.DimensionError.extend(jsx.InvalidArgumentError, {
    /**
     * @memberOf jsx.math.DimensionError.prototype
     */
    name: "jsx.math.DimensionError"
  });

  /**
   * @constructor
   * @extends jsx.InvalidArgumentError
   */
  _math.CoordinateError = function () {
    arguments.callee._super.call(this, "Coordinate must be 0 or greater");
  };

  _math.CoordinateError.extend(jsx.InvalidArgumentError, {
    /**
     * @memberOf jsx.math.CoordinateError.prototype
     */
    name: "jsx.math.CoordinateError"
  });

  /**
   * @constructor
   * @extends jsx.Error
   */
  _math.NotImplementedError = function () {
    arguments.callee._super.call(this, "Not implemented");
  };

  _math.NotImplementedError.extend(jsx.Error, {
    /**
     * @memberOf jsx.math.NotImplementedError.prototype
     */
    name: "jsx.math.NotImplementedError"
  });
}());