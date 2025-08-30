document.addEventListener("DOMContentLoaded", () => {
  const isDark = document.documentElement.dataset.scheme === "dark";
  window.mermaid.initialize({
    startOnLoad: true,
    theme: isDark ? 'dark' : 'default',
  });

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof SVGElement) || node.dataset.zoomApplied) return;

        const svg = node;
        svg.dataset.zoomApplied = "true";

        const allContent = svg.innerHTML;
        svg.innerHTML = `<g class="zoom-wrapper">${allContent}</g>`;
        const wrapper = svg.querySelector("g.zoom-wrapper");

        const parent = svg.parentElement;
        if (!parent) return;

        const btn = document.createElement("button");
        btn.classList.add("btn", "reset");
        btn.ariaLabel="Reset view";
        btn.innerHTML = `
            <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-sync" aria-hidden="true">
              <path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z"></path>
            </svg>`;

        parent.style.position = "relative";
        parent.appendChild(btn);

        const zoom = window.d3.zoom().on("zoom", (e) => {
          wrapper.setAttribute("transform", `translate(${e.transform.x},${e.transform.y}) scale(${e.transform.k})`);
        });

        window.d3.select(svg).call(zoom);

        btn.addEventListener("click", () => {
          window.d3.select(svg).transition().duration(200).call(zoom.transform, window.d3.zoomIdentity);
        });
      });
    });
  });

  document.querySelectorAll(".mermaid").forEach((el) => {
    observer.observe(el, {
      childList: true,
      subtree: false,
    });
  });
});
