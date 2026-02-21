// Wait until the entire HTML document has loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

  // Get references to the search input field and the results container
  const searchInput = document.getElementById("searchInput");
  const resultsBox = document.getElementById("searchResults");

  // If the page doesn't contain search elements, stop the script
  if (!searchInput || !resultsBox) return;

  // Searchable data: internal pages + external links
  const DATA = [
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

  // Normalize text: lowercase, collapse spaces, trim
  const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

  // Hide results and clear the box
  function closeResults() {
    resultsBox.classList.remove("open");
    resultsBox.innerHTML = "";
  }

  // Show results and insert HTML
  function openResults(html) {
    resultsBox.innerHTML = html;
    resultsBox.classList.add("open");
  }

  // Main search function
  function search(qRaw) {
    const q = norm(qRaw); // Normalize the query

    // If the query is empty, close results
    if (!q) {
      closeResults();
      return;
    }

    // Filter DATA for matches based on title, description, and tags
    const matches = DATA.filter((it) => {
      const hay = norm(`${it.title} ${it.desc} ${(it.tags || []).join(" ")}`);
      return hay.includes(q); // Check if search term exists in the combined text
    }).slice(0, 8); // Limit to first 8 results

    // If nothing matches, show "no results"
    if (matches.length === 0) {
      openResults(`<div class="resultEmpty">No results for “${qRaw}”</div>`);
      return;
    }

    // Build HTML for each result
    const html = matches.map((it) => {
      const target = it.external ? `target="_blank" rel="noopener noreferrer"` : "";
      return `
        <a class="resultItem" href="${it.url}" ${target}>
          <div class="resultTitle">${it.title}</div>
          <div class="resultDesc">${it.desc}</div>
        </a>
      `;
    }).join("");

    // Display the results
    openResults(html);
  }

  // Trigger search whenever the user types
  searchInput.addEventListener("input", () => search(searchInput.value.trim()));

  // Also trigger search when the input gains focus
  searchInput.addEventListener("focus", () => search(searchInput.value.trim()));

  // Close results when pressing Escape
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = ""; // Clear input
      closeResults();         // Hide results
      searchInput.blur();     // Remove focus
    }
  });

  // Close results when clicking outside the search area
  document.addEventListener("click", (e) => {
    if (e.target === searchInput) return;          // Clicked inside input → ignore
    if (resultsBox.contains(e.target)) return;     // Clicked inside results → ignore
    closeResults();                                // Otherwise close
  });
});