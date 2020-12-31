import ff from "./ff.js";

ff.activateShortcuts();
ff.defineShortcut("_", alert);

_("test");

let getLastArticles = number => {
  ff._GET("./availableFiles.json", function(res) {
    _(JSON.parse(res));
  });
};

getLastArticles();

_(1);
i
