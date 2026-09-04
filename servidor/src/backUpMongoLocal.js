const { exec } = require("child_process");
const path = require("path");

const backUpMongoLocal = () => {

const mongodumpPath = `"C:\\Program Files\\MongoDB\\Tools\\100\\bin\\mongodump.exe"`;

const backupPath = path.join(
  __dirname,
  "backups",
  "gestion"
);

const comando = `${mongodumpPath} --db gestion --out "${backupPath}"`;

console.log(comando);

exec(comando, (error, stdout, stderr) => {
  if (error) {
    console.error("Error haciendo el backup:", error.message);
    return;
  }

  if (stderr) {
    console.error("MongoDB:", stderr);
  }

  console.log("Backup realizado correctamente:", stdout);
});

}
module.exports = backUpMongoLocal;