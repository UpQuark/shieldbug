function replaceWithCat(): void {

  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
      <img src="https://cdn.discordapp.com/attachments/1086536195762302986/1095955456456933376/Sambags_a_flat_vectorized_2d_one-flat-color_orange_logo_of_a_sh_5cd5bd46-9225-4a18-87c9-46da23c30fab.png" alt="A shieldbug logo image">
    </div>
  `;
}

chrome.storage.local.get("blockedUrls", (data: { blockedUrls?: string[] }) => {
  const currentUrl: string = window.location.href;
  const blockedUrls: string[] = data.blockedUrls || [];

  for (const url of blockedUrls) {
    if (currentUrl.startsWith(url)) {
      replaceWithCat();
      break;
    }
  }
});
