import * as std from "std";
import base64 from "./modules/b64.mjs";

let comando = args => {
  let aux = `${args}`;
  let prog = std.popen(aux, "r");
  let r, msg = "";
  while ((r = prog.getline()) != null) {
    msg += r + "\n";
  }
  return msg;
};

let actualizarEstructura = () => {
  let aux = comando(`find news -type f`);
  console.log("Haciendo split");
  let files = aux.split("\n");
console.log(`Files: ${files}!!!`);
  let auxObj = {};

  console.log("Recorriendo los " + files.length + " archivos encontrados");
  for (let i in files) {
    if(files[i] !== "") {
      console.log(i);
      auxObj[`file${i+1}`] = {
        url: `https://github.com/StringManolo/sm/raw/main/${files[i]}`,
        date: JSON.parse(comando(`cat ${files[i]}`)).fecha	    
      };
    }
  }

  console.log("Abriendo...");
  let fd = std.open("./availableFiles.ff", "w");
  console.log("Escribiendo");
  fd.puts(JSON.stringify(auxObj));
  console.log("Cerrando");
  fd.close();
};

/*actualizarEstructura();

throw "debug.";*/

console.log("Pega tu JSON y presiona enter.");

let noticiaRaw = std.in.getline();
let noticia = JSON.parse(noticiaRaw);

let fecha = {};

[fecha.año, fecha.mes, fecha.dia] = noticia.fecha.split("-");

let titular = base64("e", noticia.titular).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, ",");

if (titular.length > 90) {
  titular.length = 90; /* Max filesystem name chars */
}

titular = titular + ".json";

console.log(`Fecha de la noticia:
Año - ${fecha.año}
Mes - ${fecha.mes}
Dia - ${fecha.dia}
`);

console.log(`Buscando en el sistema de ficheros la ruta news/${fecha.año}/${fecha.mes}/`);

let cambiosRepo = false;

let res = comando(`cat news/${fecha.año}/${fecha.mes}/${fecha.dia}/${titular}`);

if (res === "") {
  console.log("El artículo es nuevo. Almacenándolo.");
  comando(`mkdir -p news/${fecha.año}/${fecha.mes}/${fecha.dia}/`);
  let fd = std.open(`news/${fecha.año}/${fecha.mes}/${fecha.dia}/${titular}`, "w");
  fd.puts(noticiaRaw);
  fd.close();
  cambiosRepo = true;
} else {
  /* Leer archivo y comparar ultimaModif */
  let ultModAlm = (JSON.parse(res).ultimaModificacion || 0);

  if (ultModAlm === noticia.ultimaModificacion) {
    console.log("El artículo ya existe y no presenta cambios");
    cambiosRepo = false;
  } else if(ultModAlm < noticia.ultimaModificacion) {
    console.log("El articulo introducido contiene cambios con respecto al almacenado. Introduce Si para sobrescribir.");
    res = std.in.getline();
    if (/s/gi.test(res)) {
      let fd = std.open(`news/${fecha.año}/${fecha.mes}/${fecha.dia}/${titular}`, "w");
      fd.puts(noticiaRaw);
      fd.close();
      cambiosRepo = true;
    }
  } else {
    console.log("Estás introducciendo un artículo más antiguo que el almacenado. Introduce Si para sobrescribirlo de todas maneras.");
    res = std.in.getline();
    if (/s/gi.test(res)) {
      let fd = std.open(`news/${fecha.año}/${fecha.mes}/${fecha.dia}/${titular}`, "w");
      fd.puts(noticiaRaw);
      fd.close();
      cambiosRepo = true;
    }
  }
}

if (cambiosRepo) {
  console.log("Actualizando estructura");
  actualizarEstructura();
  console.log("Listo");
  console.log("Actualizar repo? S/N");
  if (/s/gi.test(std.in.getline())) {
    comando(`git add --all && git commit -m "automated pushed by clasificador.js" && git push`);
  }
}

//console.log(`Noticia: ${noticia.autor}`);
