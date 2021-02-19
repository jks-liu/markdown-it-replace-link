# @mbalex99/markdown-it-replace-link

[![TypeScript](https://badges.frapsoft.com/typescript/love/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

This is a fork of [Martin Heidegger](https://github.com/martinheidegger)'s [markdown-it-replace-link](https://github.com/martinheidegger/markdown-it-replace-link) plugin.

However, I needed it for [Ditto](https://www.ditto.live) website with some more customizations that are probably too heavy for a lot of users of the original library. 

## What are the differences?

* Original library only handled links for `a` and `img` tags
* Original will ignore other raw html attributes that may be links.
* This plugin however allows additional specifications 


> markdown-it plugin for replacing links (image & text) in the markdown document.

## Usage

### Installation

```
npm install @mbalex99/markdown-it-replace-link -S
```

#### Enable plugin

```js
var md = require('markdown-it')({
    html: true    
}).use(require('markdown-it-replace-link'), {
    attributes: ['src', 'href']
    replaceLink: function (link, env) {
        return link + "?c=" + Date.now();
    }
}); // <-- this use(package_name) is required
```

#### Example

```md
[Hello](test)
```

and use this

```js
var md = require('markdown-it')({
    html: true
}).use(require('markdown-it-replace-link'), {
    replaceLink: function (link, env) {
        return "http://me.com/" + link;
    }
});
```


This will result in the link prefixed with the `http://me.com/` like:

```html
<p><a href="http://me.com/test">Hello</a></p>
```

Both images and html links will be processed.

If using this in a browser, the script will create a variable 
`window.markdownitReplaceLink` that can be passed to `.use()`.

### Testing

To run the tests use:
```bash
npm run test
```

### License

[MIT](./LICENSE)
