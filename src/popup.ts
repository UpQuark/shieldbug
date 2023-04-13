const urlForm = document.getElementById("urlForm") as HTMLFormElement;
const urlInput = document.getElementById("urlInput") as HTMLInputElement;
const blockedUrlsList = document.getElementById("blockedUrlsList") as HTMLUListElement;

function updateBlockedUrlsList(blockedUrls: string[]): void {
  blockedUrlsList.innerHTML = "";

  for (const url of blockedUrls) {
    const listItem = document.createElement("li");
    listItem.textContent = url;
    listItem.classList.add("list-group-item");
    blockedUrlsList.appendChild(listItem);
  }
}

urlForm.addEventListener("submit", (event: Event) => {
  event.preventDefault();

  const url = urlInput.value.trim();
  if (!url) return;

  chrome.storage.local.get("blockedUrls", (data: { blockedUrls?: string[] }) => {
    const blockedUrls: string[] = data.blockedUrls || [];
    blockedUrls.push(url);
    chrome.storage.local.set({ blockedUrls }, () => {
      updateBlockedUrlsList(blockedUrls);
      urlInput.value = "";
    });
  });
});

chrome.storage.local.get("blockedUrls", (data: { blockedUrls?: string[] }) => {
  const blockedUrls: string[] = data.blockedUrls || [];
  updateBlockedUrlsList(blockedUrls);
});
