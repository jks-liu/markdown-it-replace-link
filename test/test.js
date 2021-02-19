/* eslint-env mocha */
var path = require("path");
var generate = require("markdown-it-testgen");
var expect = require("chai").expect;
var fs = require("fs");
var fixtures = {
  env: fs.readFileSync(path.join(__dirname, "fixtures/env.txt"), "utf-8"),
  tocPath: path.join(__dirname, "fixtures/toc.txt"),
};
var mdReplaceLink = require("../");

function callback(link, env, token) {
  if (token && token.type === "image") {
    return "image/" + link;
  }
  if (link === "a") {
    return env.x + link;
  }
  return "http://me.com/" + link;
}

describe("markdown-it-replace-link", function () {
  var md = require("markdown-it")({
    html: true,
    linkify: true,
    typography: true,
    replaceLink: {
      callback: callback,
      includeAttrs: ['data-custom-attr-a', 'data-custom-attr-b']
    },
  }).use(mdReplaceLink);

  generate(fixtures.tocPath, md);

  // it("Passes on env", function (done) {
  //   var html = md.render(fixtures.env, {
  //     x: "test/",
  //   });
  //   expect(html).to.equal('<p><a href="test/a">Hello</a></p>\n');
  //   done();
  // });
});

// describe("markdown-it-replace-link", function () {
//   var md = require("markdown-it")({
//     html: true,
//     linkify: true,
//     typography: true,
//     replaceLink: replaceLink,
//   }).use(mdReplaceLink);

//   generate(fixtures.tocPath, md);

//   it("Passes on env", function (done) {
//     var html = md.render(fixtures.env, {
//       x: "test/",
//     });
//     expect(html).to.equal('<p><a href="test/a">Hello</a></p>\n');
//     done();
//   });
// });

// describe("markdown-it-replace-link with. plugin options", function () {
//   var md = require("markdown-it")({
//     html: true,
//     linkify: true,
//     typography: true,
//   }).use(mdReplaceLink, {
//     replaceLink: replaceLink,
//     includeAttrs: ["data-custom-attr-a", "data-custom-attr-b"],
//   });
//   generate(fixtures.tocPath, md);

//   it("Passes on env", function (done) {
//     var html = md.render(fixtures.env, {
//       x: "test/",
//     });
//     // expect(html).to.equal('<p><a href="test/a">Hello</a></p>\n')
//     done();
//   });
// });
