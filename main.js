import ff from "./ff.js";

ff.activateShortcuts();
ff.defineShortcut("_", alert);

_(1);

let getLastArticles = (callback, callbackAll, number=10) => {
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
    if (urls.length > number) {
      urls.length = number;
    }

    let promis = [];

    for (let i in urls) {
      urls[i] = urls[i].substr(+urls[i].indexOf("#") + 1, urls[i].length);
      //_(`Requesting ${urls[i]}`);
      ff._GET(urls[i], function(res) {
        promis.push(res);
	if (promis.length === urls.length) {
          callbackAll(promis);
        } else {
          //_(`Not end ${res}`);
	  //_(`Promis = ${promis.length} && Urls = ${urls.length}`);
          callback(res);
	}
      });
    }
  });
};


function addArticle(article) {
  article = JSON.parse(article);
  let sect = $("#lastArticles");
  let art = document.createElement("article");

  let titular = document.createElement("h2");
  titular.className = "titular";
  titular.innerText = article.titular;
  art.appendChild(titular);

  let autor = document.createElement("span");
  autor.innerText = article.autor;
  art.appendChild(autor);

  let fecha = document.createElement("time");
  fecha.className = "fecha";
  fecha.innerText = article.fecha;
  art.appendChild(fecha);

  let resumen = document.createElement("p");
  resumen.innerText = article.resumen;
  art.appendChild(resumen);

  let introduccion = document.createElement("p");
  introduccion.innerText = article.introduccion;
  art.appendChild(introduccion);

  let contenido = document.createElement("p");
  contenido.innerText = article.contenido;
  art.appendChild(contenido);

  let categorias = document.createElement("span");
  categorias.innerText = article.categorias;
  art.appendChild(categorias);

  let fuentes = document.createElement("cite");
  fuentes.innerText = article.fuentes;
  art.appendChild(fuentes);

  sect.appendChild(art);
  
}


function main() {
  getLastArticles( function(article) {
    //_(article);
    addArticle(article);
  }, function(articles) {
    //_(`Articles: ${articles}`);
  });
}

main();
