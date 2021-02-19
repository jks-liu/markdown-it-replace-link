import cheerio from "cheerio";
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";

export type Callback = (link: string, env: any, token?: Token) => string;

export interface Options {
  callback?: Callback;
  includeAttrs?: string[];
}

function replaceAttr(
  token: Token,
  attrName: string,
  replace: Callback,
  env: any
) {
  token.attrs?.forEach(function (attr) {
    if (attr[0] === attrName) {
      attr[1] = replace(attr[1], env, token);
    }
  });
}

export default function (md: MarkdownIt, opts: MarkdownIt.Options & Options) {
  md.core.ruler.after("inline", "replace-link", function (state) {
    var callback: Callback | undefined = opts?.callback;
    var includeAttrs: string[] = opts?.includeAttrs || [];

    if (!callback || typeof callback !== "function") {
      return false;
    }

    state.tokens.forEach(function (blockToken) {
      if (blockToken.type === "inline" && blockToken.children) {
        blockToken.children.forEach(function (token) {
          var type = token.type;
          if (type === "link_open") {
            replaceAttr(token, "href", callback!, state.env);
          } else if (type === "image") {
            replaceAttr(token, "src", callback!, state.env);
          }
        });
      }
      if (blockToken.type == "html_block" && includeAttrs.length > 0) {
        let $ = cheerio.load(blockToken.content, {
          // used the avoid auto-wrapping
          xmlMode: true,
        });
        includeAttrs.forEach(function (attribute) {
          let attributeValue = $(`[${attribute}]`).attr(attribute);
          if (!attributeValue) {
            return;
          }
          $(`[${attribute}]`).attr(
            attribute,
            callback!(attributeValue, state.env)
          );
          console.log(attributeValue);
        });
        blockToken.content = $.html();
      }
    });

    return false;
  });
}
