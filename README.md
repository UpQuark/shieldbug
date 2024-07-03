# Shieldbug

[Chrome Web Store Link](https://chromewebstore.google.com/detail/shieldbug/aeiafdcfiklkbmdfcaobjapljoielcfn)

Shieldbug is a free Chrome extension for blocking distracting websites and keeping you from doomscrolling
I (the author) use it to keep myself from obsessively checking the news, and other doomscrolly-content.

## About

This is a quick hobby project which serves a couple purposes:
* Replacing a Site Blocking extension I paid for that started adding intrusive features (and periodically broke basic features). I use both to intercept distracting websites so I can actually focus on rewarding tasks without falling into the news / infinite-scrolling attention abyss.
* Letting me experiment with generating code templates with GPT-4, which was fun and enlightening.

This is NOT a showcase-enterprise-quality codebase, I'd lump it in more with "hackathon-level" code, with pitfalls like multiple styling libraries (originally used bootstrap, switched to Material UI), weak tests, etc. I revisit it every few months to add minor enhancements when I want a feature, fix, or just to try a new thing for self-edification. 

## Building and running locally

* This project's `node-sass` version uses Node v19. Using NVM or similar, run `nvm use 19`
* Run `npm build`
* Go to `chrome://extensions/`
* Enable Developer Mode
* Click "Load Unpacked"
* Select the `dist` directory