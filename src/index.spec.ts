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
const tocPath = path.join(__dirname, "fixtures.txt");

describe("basic test with callback only", () => {
  const md = markdownIt({
    html: true,
    linkify: true,
  }).use(mdReplaceLink, {
    callback: function (link: string, env: any, token?: Token) {
      return "http://me.com/" + link;
    },
  });

  it("should replace link for src and href by default", function () {
    const html = md.render(`[Hello](test)`);
    expect(html).to.eql(`<p><a href="http://me.com/test">Hello</a></p>\n`);
  });

});

describe("basic test with attributes", () => {
  const md = markdownIt({
    html: true,
    linkify: true,
  }).use(mdReplaceLink, {
    callback: function (link: string, env: any, token?: Token) {
      return "http://me.com/" + link;
    },
    attributes: ['href', "data-custom-attr-a"],
  });

  it('should replace data attribute', function() {
    const html = md.render(dedent(`
    [Hello](test)
    <div data-custom-attr-a="test">
    </div>
    `));
    expect(html).to.eql(`<p><a href="http://me.com/test">Hello</a></p>\n<div data-custom-attr-a="http://me.com/test">\n</div>`);
  })

});
