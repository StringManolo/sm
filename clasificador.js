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
}


console.log("Pega tu JSON y presiona enter.");

let noticiaRaw = std.in.getline();
let noticia = JSON.parse(noticiaRaw);

let fecha = {};

[fecha.año, fecha.mes, fecha.dia] = noticia.fecha.split("-");

let titular = base64("e", noticia.titular);

console.log(`Fecha de la noticia:
Año - ${fecha.año}
Mes - ${fecha.mes}
Dia - ${fecha.dia}
`);

console.log(`Buscando en el sistema de ficheros la ruta news/${fecha.año}/${fecha.mes}/`);



let res = comando(`cat news/${fecha.año}/${fecha.mes}/${fecha.dia}/${titular}`);

if (res === "") {
  console.log("El artículo es nuevo. Almacenándolo.");

  let err = { errno: "dummy" };

  let fd = std.open(`news/${fecha.año}/${fecha.mes}/${fecha.dia}/${titular}`, "w", err)

//  fd.puts(noticiaRaw);
  console.log(err.errno);
}


//console.log(`Noticia: ${noticia.autor}`);
