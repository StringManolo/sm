import ff from "./ff.js";

ff.activateShortcuts();
ff.defineShortcut("_", alert);

_(1);

let getLastArticles = (number=10) => {
  ff._GET("./availableFiles.json", function(res) {
    let files = JSON.parse(res);
    let fileNames = Object.keys(files);
    let urls =[];
    let aux = [];
    for (let i in fileNames) {
      aux = files[fileNames[i]].date.split("-");
      urls.push(`${aux[0]*365 + aux[1] * 30 + aux[2]}#${files[fileNames[i]].url}`);
    }

    urls = urls.sort();
    urls.length = number;

    for (let i in urls) {
      urls[i] = urls[i].substr(+urls[i].indexOf("#") + 1, urls[i].length);
    }

    _(urls);

    Promise.all(urls.map(url => fetch(url)))
    .then(resp => Promise.all( resp.map(r => r.text()) ))
    .then(result => {
      _(result);
    });

  });
};

getLastArticles(2);



