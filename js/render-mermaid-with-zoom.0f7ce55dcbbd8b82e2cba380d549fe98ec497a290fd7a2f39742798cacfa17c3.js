(() => {
  // <stdin>
  document.addEventListener("DOMContentLoaded", () => {
    const isDark = document.documentElement.dataset.scheme === "dark";
    window.mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? "dark" : "default"
    });
    function createIconButton({ className, ariaLabel, svg, onClick, style = {} }) {
      const btn = document.createElement("button");
      btn.className = className;
      btn.ariaLabel = ariaLabel;
      btn.innerHTML = svg;
      Object.assign(btn.style, style);
      if (onClick) btn.onclick = onClick;
      return btn;
    }
    function resetZoom(svg, zoom) {
      window.d3.select(svg).transition().duration(200).call(zoom.transform, window.d3.zoomIdentity);
    }
    function createModal(svg) {
      const oldModal = document.getElementById("mermaid-zoom-modal");
      if (oldModal) oldModal.remove();
      const modal = document.createElement("div");
      modal.id = "mermaid-zoom-modal";
      modal.addEventListener("mousedown", (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      Object.assign(modal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "9999"
      });
      const modalContent = document.createElement("div");
      Object.assign(modalContent.style, {
        background: isDark ? "#222" : "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        position: "relative",
        maxWidth: "90vw",
        maxHeight: "80vh",
        overflow: "auto"
      });
      const btnWrapper = document.createElement("div");
      btnWrapper.className = "mermaid-btn-wrapper";
      Object.assign(btnWrapper.style, {
        position: "absolute",
        top: "12px",
        right: "12px",
        display: "flex",
        gap: "8px",
        zIndex: "10"
      });
      const resetBtn = createIconButton({
        className: "btn reset",
        ariaLabel: "\uCD08\uAE30\uD654",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>`
      });
      btnWrapper.appendChild(resetBtn);
      const closeBtn = createIconButton({
        className: "btn reset",
        ariaLabel: "\uB2EB\uAE30",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" height="16"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>`,
        onClick: () => modal.remove()
      });
      btnWrapper.appendChild(closeBtn);
      modalContent.appendChild(btnWrapper);
      const svgClone = svg.cloneNode(true);
      svgClone.style.width = "100%";
      svgClone.style.height = "60vh";
      svgClone.removeAttribute("data-zoomapplied");
      setTimeout(() => {
        const wrapper = svgClone.querySelector("g.zoom-wrapper");
        if (wrapper) {
          const zoom = window.d3.zoom().on("zoom", (e) => {
            wrapper.setAttribute("transform", `translate(${e.transform.x},${e.transform.y}) scale(${e.transform.k})`);
          });
          window.d3.select(svgClone).call(zoom);
          resetBtn.onclick = () => resetZoom(svgClone, zoom);
        }
      }, 100);
      modalContent.appendChild(svgClone);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
    }
    function createButtonGroup(parent, svg, wrapper, zoom) {
      let btnWrapper = parent.querySelector(".mermaid-btn-wrapper");
      if (!btnWrapper) {
        btnWrapper = document.createElement("div");
        btnWrapper.className = "mermaid-btn-wrapper";
        Object.assign(btnWrapper.style, {
          position: "absolute",
          top: "12px",
          right: "12px",
          display: "flex",
          gap: "8px",
          zIndex: "5"
        });
        parent.appendChild(btnWrapper);
      }
      const resetBtn = createIconButton({
        className: "btn reset",
        ariaLabel: "\uCD08\uAE30\uD654",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>`,
        onClick: () => resetZoom(svg, zoom)
      });
      btnWrapper.appendChild(resetBtn);
      const modalBtn = createIconButton({
        className: "btn modal",
        ariaLabel: "\uD31D\uC5C5\uC73C\uB85C \uD06C\uAC8C \uBCF4\uAE30",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32S0 334.3 0 352l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"/></svg>`,
        onClick: () => createModal(svg)
      });
      btnWrapper.appendChild(modalBtn);
    }
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
          parent.style.position = "relative";
          const zoom = window.d3.zoom().on("zoom", (e) => {
            wrapper.setAttribute("transform", `translate(${e.transform.x},${e.transform.y}) scale(${e.transform.k})`);
          });
          window.d3.select(svg).call(zoom);
          createButtonGroup(parent, svg, wrapper, zoom);
        });
      });
    });
    document.querySelectorAll(".mermaid").forEach((el) => {
      observer.observe(el, {
        childList: true,
        subtree: false
      });
    });
  });
})();
