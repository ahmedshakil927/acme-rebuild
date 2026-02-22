// Get references to the search input field and the results container
var searchInput = document.getElementById("searchInput");
var resultsBox = document.getElementById("searchResults");

// Searchable data: internal pages + external links
var DATA = [
  { title: "Home", desc: "Main page", url: "index.html", tags: ["home"] },
  { title: "Labs", desc: "Tools, servers, and experiments", url: "labs.html", tags: ["labs","tools","server","utilities","experiments"] },
  { title: "Tutorials", desc: "Learning pages and demos", url: "tutorials.html", tags: ["tutorials","learning","canvas","web api","unicode","resources"] },
  { title: "Toys", desc: "Fun generators and amusements", url: "toys.html", tags: ["toys","fun","license","heart","chocolate"] },
  { title: "News", desc: "Updates and announcements", url: "news.html", tags: ["news","updates","announcements"] },
  { title: "About", desc: "Information about ACME", url: "about.html", tags: ["about","info"] },

  // External links
  { title: "ACME Mapper", desc: "Interactive mapping tool collection", url: "https://acme.com/mapper/", external: true, tags: ["mapper","maps","mapping"] },
  { title: "HTML5 Canvas", desc: "Learning resources and demos", url: "https://acme.com/canvas/", external: true, tags: ["canvas","html5","tutorial","demos"] },
  { title: "ACME Planimeter", desc: "Measure areas and paths", url: "https://acme.com/planimeter/", external: true, tags: ["planimeter","area","measure"] },
  { title: "micro_httpd", desc: "Minimal HTTP server utility", url: "https://acme.com/micro_httpd/", external: true, tags: ["micro_httpd","http","server"] },
];

// Normalize text: lowercase only
function norm(s) {
  if (!s) {
    s = "";
  }
  s = s.toLowerCase();
  return s;
}

// Hide results and clear the box
function closeResults() {
  resultsBox.style.display = "none";
  resultsBox.innerHTML = "";
}

// Show results and insert HTML
function openResults(html) {
  resultsBox.innerHTML = html;
  resultsBox.style.display = "block";
}

// Main search function
function search(qRaw) {
  var q = norm(qRaw);

  if (!q) {
    closeResults();
    return;
  }

  var matches = [];
  var i = 0;
  while (i < DATA.length) {
    if (matches.length >= 8) {
      break;
    }
    var item = DATA[i];
    var tagsStr = "";
    var j = 0;
    while (j < item.tags.length) {
      tagsStr = tagsStr + " " + item.tags[j];
      j = j + 1;
    }
    var hay = norm(item.title + " " + item.desc + tagsStr);
    if (hay.indexOf(q) !== -1) {
      matches.push(item);
    }
    i = i + 1;
  }

  if (matches.length === 0) {
    openResults('<div class="resultEmpty">No results for "' + qRaw + '"</div>');
    return;
  }

  var html = "";
  var k = 0;
  while (k < matches.length) {
    var it = matches[k];
    var target = "";
    if (it.external) {
      target = 'target="_blank" rel="noopener noreferrer"';
    }
    html = html + '<a class="resultItem" href="' + it.url + '" ' + target + '>';
    html = html + '<div class="resultTitle">' + it.title + '</div>';
    html = html + '<div class="resultDesc">' + it.desc + '</div>';
    html = html + '</a>';
    k = k + 1;
  }

  openResults(html);
}

// Handle input changes
function handleInput() {
  search(searchInput.value);
}

// Handle focus
function handleFocus() {
  search(searchInput.value);
}

// Handle key press (27 = Escape)
function handleKeyDown(e) {
  if (e.keyCode === 27) {
    searchInput.value = "";
    closeResults();
  }
}

// Handle click outside
function handleClick(e) {
  if (e.target === searchInput) {
    return;
  }
  var parent = e.target;
  while (parent !== null) {
    if (parent === resultsBox) {
      return;
    }
    parent = parent.parentNode;
  }
  closeResults();
}

// Attach events using basic properties
searchInput.onkeyup = handleInput;
searchInput.onfocus = handleFocus;
document.onkeydown = handleKeyDown;
document.onclick = handleClick;
