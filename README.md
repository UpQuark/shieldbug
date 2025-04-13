# Shieldbug

[Chrome Web Store Link](https://chromewebstore.google.com/detail/shieldbug/aeiafdcfiklkbmdfcaobjapljoielcfn)

Shieldbug is a free Chrome extension for blocking distracting websites and keeping you from doomscrolling
I (the author) use it to keep myself from obsessively checking the news, and other doomscrolly-content.

## About

This is a quick hobby project which serves a couple purposes:
* Replacing a Site Blocking extension I paid for that started adding intrusive features (and periodically broke basic features). I use both to intercept distracting websites so I can actually focus on rewarding tasks without falling into the news / infinite-scrolling attention abyss.
* Letting me experiment with generating code templates with GPT-4 (and later other LLMs via CursorAI), which was fun and enlightening.

This is NOT a showcase of enterprisey code, it's hobby / hackathon-level code with pitfalls like multiple styling libraries (originally used bootstrap, switched to Material UI, both are years out of date now), limited tests, etc. I revisit it every once in a while to add minor enhancements or just to try a new thing for self-education. 

## Building and running locally

* This project's `node-sass` version uses Node v19. Using NVM or similar, run `nvm use 19`
* Run `npm build`
* Go to `chrome://extensions/`
* Enable Developer Mode
* Click "Load Unpacked"
* Select the `dist` directory

## Version Notes
### 1.0.12
- Thought to start doing release notes
- Added "Deterrent mode" which lets you have the block page show pictures of giant spiders, to deter you from checking distracting sites
- Added a counter that shows how many distractions ShieldBug has blocked for you since you installed it. Increments once per visit to a blocked website.
- Refactored from blocking sites in a `content.ts` script that loads on page load to blocking sites via a `chrome.runtime.onMessage` listener, so you can't load glimpses of pages before they're blocked, and to fix a bug where opening pages in a new tab showed the block page on the old tab.