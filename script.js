function toBoldUnicode(text) {
  const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bold = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭" +
               "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇" +
               "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟯𝟴𝟵";

  return text.split('').map(ch => {
    const i = normal.indexOf(ch);
    return i >= 0 ? bold[i] : ch;
  }).join('');
}

document.getElementById('convertBtn').addEventListener('click', () => {
  const input = document.getElementById('inputText').value.trim();
  const output = toBoldUnicode(input);
  document.getElementById('outputText').textContent = output || "(No text entered)";
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard ✅');
});