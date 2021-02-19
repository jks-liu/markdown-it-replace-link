const cheerio = require("cheerio");

function replaceAttr(token, attrName, replace, env) {
  token.attrs.forEach(function (attr) {
    if (attr[0] === attrName) {
      attr[1] = replace(attr[1], env, token);
    }
  });
}

module.exports = function (md, opts) {
  md.core.ruler.after("inline", "replace-link", function (state) {
    var callback;
    var includeAttrs = [];
    
    if (
      typeof md?.options?.replaceLink?.callback === "function"
    ) {
      // Use markdown options (default so far)
      replace = md.options.replaceLink?.callback;
    } else if (
      typeof opts?.replaceLink?.callback === "function"
    ) {
      // Alternatively use plugin options provided upon .use(..)
      callback = opts.replaceLink.callback;
    } else {
      return false;
    }

    if (typeof replace === "function") {
      state.tokens.forEach(function (blockToken) {
        if (blockToken.type === "inline" && blockToken.children) {
          blockToken.children.forEach(function (token) {
            var type = token.type;
            if (type === "link_open") {
              replaceAttr(token, "href", replace, state.env);
            } else if (type === "image") {
              replaceAttr(token, "src", replace, state.env);
            }
          });
        }
        if (blockToken.type == "html_block" && opts && opts.includeAttrs) {
          let $ = cheerio.load(blockToken.content, {
            // used the avoid auto-wrapping
            xmlMode: true
          });
          opts.includeAttrs.forEach(function (attribute) {

            let attributeValue =  $(`[${attribute}]`).attr(attribute);
            $(`[${attribute}]`).attr(attribute, replace(attributeValue, state.env))
            console.log(attributeValue)
          });
          blockToken.content = $.html();
        }
      });
    }
    return false;
  });
};
