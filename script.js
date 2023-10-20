function Stack() {
  let items = [],
    index = 0;

  this.push = function (val) {
    items[index++] = val;
  };

  this.pop = function (val) {
    return items[--index];
  };

  this.peek = function () {
    return items[index - 1];
  };
}

function Tag(start, end, tag) {
  this.start = start;
  this.end = end;
  this.tag = tag;
  this.text = "";

  this.getRange = () => {
    this.end - this.start;
  };
}

// works as a priority queue
function addAndSort(track, index, tag) {
  if (!track[index]) track[index] = [];

  track[index] = [...track[index], tag];

  track[index].sort((a, b) => a.getRange() - b.getRange());
}

function parse(str, markups) {
  const track = new Array(str.length).fill(null);

  for (let markup of markups) {
    const [start, end, tag] = markup;
    addAndSort(track, start, new Tag(start, end, tag));
  }

  const html = new Stack();
  html.push(new Tag(0, Number.MAX_VALUE, ""));

  for (let i = 0; i < str.length; i++) {
    while (track[i] && track[i].length > 0) {
      const cur = track[i].shift();
      cur.text = `<${cur.tag}>`;

      if (cur.end > html.peek().end) {
        const split = new Tag(html.peek.end + 1, cur.end, cur.tag);
        cur.end = html.peek().end;
        addAndSort(track, html.peek().end + 1, split);
      }
      html.push(cur);
    }
    html.peek().text += str[i];

    while (html.peek().end === i) {
      html.peek().text += `</${html.peek().tag}>`;
      const temp = html.pop().text;
      html.peek().text += temp;
    }
  }
  return html.pop().text;
}

const encoded = parse("Hello, world", [
  [0, 2, "i"],
  [4, 9, "b"],
  [7, 10, "u"],
]);

console.log(encoded);

if (encoded) {
  document.querySelector("#output").innerHTML = encoded;
}
