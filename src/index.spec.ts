/* eslint-env mocha */
import path from "path";
import { expect } from "chai";
import dedent from "dedent-js";
var generate = require("markdown-it-testgen");
import fs from "fs";
// var fixtures = {
//   env: fs.readFileSync(path.join(__dirname, "fixtures/env.txt"), "utf-8"),
//   tocPath: path.join(__dirname, "fixtures/toc.txt"),
// };
import mdReplaceLink from "./";
import markdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
const tocPath = path.join(__dirname, "fixtures.txt")

describe("basic test", () => {
  const md = markdownIt({
    html: true,
    linkify: true,
  }).use(mdReplaceLink, {
    callback: function (link: string, env: any, token?: Token) {
      if (token && token.type === "image") {
        return "image/" + link;
      }
      if (link === "a") {
        return env.x + link;
      }
      return "http://me.com/" + link;
    },
    includeAttrs: ['data-*']
  });
  const html = md.render(dedent(`
  [Hello](test)
  `))
  expect(html).to.eq(`<p><a href="http://me.com/test">Hello</a></p>`)
});
