const urlForm = document.getElementById("urlForm") as HTMLFormElement;
const urlInput = document.getElementById("urlInput") as HTMLInputElement;
const blockedUrlsList = document.getElementById("blockedUrlsList") as HTMLUListElement;

function updateBlockedUrlsList(blockedUrls: string[]): void {
  blockedUrlsList.innerHTML = "";

  for (const url of blockedUrls) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    listItem.textContent = url;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-outline-danger", "btn-sm");
    deleteButton.innerHTML = '<i class="bi bi-x"></i>';
    deleteButton.addEventListener("click", () => {
      deleteUrl(url);
    });

    listItem.appendChild(deleteButton);
    blockedUrlsList.appendChild(listItem);
  }
}

function deleteUrl(urlToDelete: string): void {
  chrome.storage.local.get("blockedUrls", (data) => {
    const blockedUrls: string[] = data.blockedUrls;
    const updatedBlockedUrls = blockedUrls.filter((url) => url !== urlToDelete);

    chrome.storage.local.set({blockedUrls: updatedBlockedUrls}, () => {
      updateBlockedUrlsList(updatedBlockedUrls);
    });
  });
}

urlForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let url = urlInput.value;
  // https prefix when missing, so it can be parsed as a url
  if (!url.startsWith("http://") && !url.startsWith("https://"))  url = "https://" + url;
  const mainDomain = new URL(url).hostname.split('.').slice(-2).join('.');
  chrome.storage.local.get("blockedUrls", (data) => {
    const blockedUrls: string[] = data.blockedUrls || [];
    if (!blockedUrls.includes(mainDomain)) {
      blockedUrls.push(mainDomain);
      chrome.storage.local.set({ blockedUrls }, () => {
        updateBlockedUrlsList(blockedUrls);
      });
    }
    urlInput.value = "";
  });
});

chrome.storage.local.get("blockedUrls", (data: { blockedUrls?: string[] }) => {
  const blockedUrls: string[] = data.blockedUrls || [];
  updateBlockedUrlsList(blockedUrls);
});
