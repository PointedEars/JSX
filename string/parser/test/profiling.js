
function profile (algorithm, profileName)
{
  var s = "bazbarfoo";

  console.profile(profileName);

  for (var i = 1000; i--;)
  {
    algorithm(s);
  }

  console.profileEnd(profileName);
}

var tokens = [
  {pattern: /foo/},
  {pattern: /bar/, state: "bar"},
  {pattern: /baz/, state: "S"}
];
var rx = new RegExp("(" + tokens.map(function (e) { return e.pattern.source; }).join(")|(") + ")", "g");
var global_tokens = tokens.map(function (e) {
  return {pattern: new RegExp(e.pattern.source, "g"), state: e.state};
});
var l = tokens.length;

function compiled (s)
{
  var state = null;
  var m;
  while ((m = rx.exec(s)))
  {
    for (var i = 0; i < l; ++i)
    {
      if (m[i + 1])
      {
      }
    }
  }
}

function iterative (s)
{
  var last_index = 0;

  do
  {
    var index = Infinity;
    var used_m = null;
    var used_rx = null;

    for (var i = 0; i < l; ++i)
    {
      var rx = global_tokens[i].pattern;
      rx.lastIndex = last_index;
      var m = rx.exec(s);

      if (m && m.index < index)
      {
        used_rx = rx;
        used_m = m;
        index = used_m.index;
      }
    }

    if (used_m)
    {
      last_index = used_rx.lastIndex;
    }
  } while (used_m);
}

profile(compiled, "compiled");
profile(iterative, "iterative");