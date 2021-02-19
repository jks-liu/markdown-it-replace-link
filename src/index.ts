import cheerio from "cheerio";
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";

export type Callback = (link: string, env: any) => string;

export interface Options {
  callback?: Callback;
  attributes?: string[];
}

function replaceAttr(
  token: Token,
  attrName: string,
  replace: Callback,
  env: any
) {
  token.attrs?.forEach(function (attr) {
    if (attr[0] === attrName) {
      attr[1] = replace(attr[1], env);
    }
  });
}

export default function (md: MarkdownIt, opts: MarkdownIt.Options & Options) {
  md.core.ruler.after("inline", "replace-link", function (state) {
    var callback: Callback | undefined = opts?.callback;
    var attributes: string[] = opts?.attributes || ["src", "href"];

    if (!callback || typeof callback !== "function") {
      return false;
    }

    state.tokens.forEach(function (blockToken) {
      if (blockToken.type === "inline" && blockToken.children) {
        blockToken.children.forEach(function (token: Token) {
          var type = token.type;
          if (type === "link_open" && attributes.includes("href")) {
            replaceAttr(token, "href", callback!, state.env);
          } else if (type === "image" && attributes.includes("src")) {
            replaceAttr(token, "src", callback!, state.env);
          }
        });
      }
      if (blockToken.type == "html_block" && attributes.length > 0) {
        let $ = cheerio.load(blockToken.content, {
          // used the avoid auto-wrapping
          xmlMode: true,
        });
        attributes.forEach(function (attribute) {
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
