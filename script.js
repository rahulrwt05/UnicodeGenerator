// Improved Unicode conversion with correct mappings and multiple styles
(() => {
  // canonical characters we will map from
  const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Bold (Mathematical Sans-Serif Bold / Bold-style characters)
  const bold = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭" +
               "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇" +
               "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";

  // Italic (Mathematical Italic)
  const italic = "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍" +
                 "𝑎𝑏𝑐𝑑𝑒𝑓𝑔𝑕𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧" +
                 "0123456789"; // digits not changed for this set

  // Bold Italic (Mathematical Bold Italic)
  const boldItalic = "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁" +
                     "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛" +
                     "0123456789";

  // Monospace (Mathematical Monospace)
  const mono = "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉" +
               "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣" +
               "0123456789";

  // Create mapping tables
  function makeMap(from, to) {
    const map = new Map();
    for (let i = 0; i < from.length; i++) {
      if (to[i]) map.set(from[i], to[i]);
    }
    return map;
  }

  const maps = {
    bold: makeMap(normal, bold),
    italic: makeMap(normal, italic),
    "bold-italic": makeMap(normal, boldItalic),
    monospace: makeMap(normal, mono)
  };

  // Convert function - preserves characters not in 'normal'
  function convertText(text, style) {
    if (!text) return "";
    const map = maps[style] || null;
    if (!map) return text;
    // Map each char; preserve characters not in map
    const out = Array.from(text).map(ch => {
      // handle uppercase/lowercase for characters present in normal string
      if (map.has(ch)) return map.get(ch);
      // If character not in our mapping, try uppercase/lowercase fallback
      const up = ch.toUpperCase();
      if (map.has(up) && ch === up) return map.get(up);
      if (map.has(up) && ch !== up) {
        // if original was lowercase but map only has uppercase, try to map lowercase index
        // (we have separate lowercase in the mapping, so this should not be needed normally)
        return map.get(ch) || ch;
      }
      return ch;
    }).join("");
    return out;
  }

  // DOM helpers
  const inputEl = document.getElementById("inputText");
  const convertBtn = document.getElementById("convertBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyBtn = document.getElementById("copyBtn");
  const copyBtnTop = document.getElementById("copyBtnTop");
  const outputEl = document.getElementById("outputText");
  const styleSelect = document.getElementById("styleSelect");

  // Convert when button clicked or Ctrl+Enter
  function doConvert() {
    const text = inputEl.value || "";
    const style = styleSelect.value || "bold";
    const converted = style === "none" ? text : convertText(text, style);
    outputEl.textContent = converted || "(No text entered)";
  }

  convertBtn.addEventListener("click", doConvert);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      doConvert();
    }
  });
  styleSelect.addEventListener("change", doConvert);

  clearBtn.addEventListener("click", () => {
    inputEl.value = "";
    outputEl.textContent = "(Converted text appears here)";
    inputEl.focus();
  });

  async function copyOutput() {
    const text = outputEl.textContent || "";
    if (!text || text.startsWith("(")) {
      alert("Nothing to copy — convert some text first.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      // small visual feedback
      const old = copyBtn.textContent;
      copyBtn.textContent = "Copied ✓";
      copyBtnTop.textContent = "Copied ✓";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtnTop.textContent = "Copy";
      }, 1400);
    } catch (err) {
      // fallback: select text and execCommand (legacy)
      try {
        const range = document.createRange();
        range.selectNodeContents(outputEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand("copy");
        alert("Copied to clipboard (fallback).");
      } catch (ex) {
        alert("Copy failed — please select and copy manually.");
      }
    }
  }

  copyBtn.addEventListener("click", copyOutput);
  copyBtnTop.addEventListener("click", copyOutput);

  // init with example
  inputEl.value = "Limited Offer Today! 🔥";
  doConvert();
})();
