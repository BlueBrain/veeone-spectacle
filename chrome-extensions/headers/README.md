This browser extension removes some iframe specific headers from requests.
It's supposed to omit browser security to allow loading external websites into the iframes.

In order to load this extension in a browser, use `--load-extension` flag for Chrome
and pass it the path to the *folder* where the extension is stored.
It should be `/nfs4/bbp.epfl.ch/user/bbpvizuser/VeeOne/chrome_extensions/headers/`
so the final command would be something like this:

```
google-chrome --load-extension=/nfs4/bbp.epfl.ch/user/bbpvizuser/VeeOne/chrome_extensions/headers/
```
