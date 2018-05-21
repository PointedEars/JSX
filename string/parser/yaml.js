function parseYAML (input)
{
  let lines = Array.isArray(input)
    ? input
    : String(input).split(/\r?\n|\r/);
  
  let root = Object.create(null);
  let currentObj = root;
  let objects = Object.create(null);
  let wasListItem = false;
  let prev_indent_size = 0;
  let references = [];
  /* Ignore single-line comments */
  lines
    .filter((line) => !/^(\s*#|\s*$)/.test(line))
    .forEach((line, line_idx) => {
      let [match, indent, prefix, key, key_str, value, value_str] = line
        .match(
          new jsx.regexp.RegExp(
              '^(?<indent> *)(?:(?<prefix>-)\\s*)?'
            + '(?:(?<key>"(?<key_str>(?:[^"]|\\\\.)*)"|[^:]+)\\s*:)?'
            + '\\s*(?<value>"(?<value_str>(?:[^"]|\\\\.)*)"|.*)?\\s*$'));

      let isListItem = (prefix === "-");
      if (typeof key_str != "undefined") key = key_str;
      let indent_size = indent.length;
      if (indent_size > prev_indent_size)
      {
        /* FIXME: Indented key should augment object as list item */
        // if (!wasListItem)
        // {
          objects[prev_indent_size] = currentObj;
          currentObj = currentObj[prev_key] = (isListItem ? [] : Object.create(null));
        // }
      }
      else if (indent_size < prev_indent_size)
      {
        currentObj = objects[indent_size];
        if (!currentObj)
        {
          throw new SyntaxError(`JSX:yaml.js: Bad indentation in line ${line_idx + 1}`);
        }
        wasListItem = false;
      }
      prev_indent_size = indent_size;
      prev_key = key;

      if (typeof value != "undefined")
      {
        let m;
        /* Value is a list given as literal */
        if ((m = value.match(/^\[(.*)\]$/)))
        {
          let content = m[1];
          if (content.length > 0)
          {
            if (!/"([^"]|\\.)*"|'([^']|\\.)*'/.test(content))
            {
              value = content.split(/\s*,\s*/);
            }
            else
            {
              value = [].concat(content.match(/"([^",]|\\.)*"|'([^',]|\\.)*'|[^,]+/g)
                .map((s) => {
                  let m;
                  return (m = s.match(/"([^",]|\\.)*"|'([^',]|\\.)*'/))
                    ? m[1] + m[2]
                    : s;
                }));
            }
          }
          else
          {
            value = [];
          }
        }
        /* Value is a reference */
        else if ((m = value.match(/\*(.+)/)))
        {
          references.push(Object.assign(Object.create(null), {
            owner: currentObj,
            key: key,
            referencedKey: m[1]
          }));
        }
        /* Value is a string or a number */
        else
        {
          if (typeof value_str != "undefined")
          {
            value = value_str;
          }
          else
          {
            if (!isNaN(value)) value = +value;
          }
        }

        /* Handle lists */
        if (isListItem)
        {
          /* FIXME: Is there better way for top-level lists? */
          if (!Array.isArray(currentObj)) currentObj = [];
          if (indent_size === 0) root = currentObj;
          
          if (typeof key != "undefined")
          {
            let obj = Object.create(null);
            obj[key] = value;
            
            currentObj.push(obj);
          }
          else
          {
            currentObj.push(value)
          }
        }
        else
        {
          /* FIXME: Indented key should augment object as list item */
          if (wasListItem)
          {
            jsx.array.get(currentObj, -1)[key] = value;
          }
          else
          {
            currentObj[key] = value;
          }
        }
      }
      
      wasListItem = isListItem;
    });

  /* Resolve references */
  for (let reference of references)
  {
    reference.owner[reference.key] = root[reference.referencedKey];
  }

  return root;
}

// parseYAML(`foo:bar
//   baz: *bla
// bla:
//   trans:
//     en: haha
//     de: hihi`)
