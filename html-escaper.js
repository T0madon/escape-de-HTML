const fs = require("node:fs");
const readline = require("node:readline");
const path = require("node:path");

run();

function transformHTML(text) {
  return text.replace(/[<>&]/g, (match) => {
    switch (match) {
      case "<":
        return "&lt;";

      case ">":
        return "&gt;";

      case "&":
        return "&amp;";

      default:
        return match;
    }
  });
}

function escapeHTML(inputFilePath, outPutFilePath) {
  try {
    const fileContent = fs.readFileSync(inputFilePath, "utf-8");
    const escapedContent = transformHTML(fileContent);
    fs.writeFileSync(outPutFilePath, escapedContent, "utf-8");
    console.log("Arquivo escapado com sucesso:" + outPutFilePath);
  } catch (error) {
    console.log("Erro:", error.message);
    process.exit(1);
  }
}

function aksFilePath(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

async function userInteraction() {
  let inputPath = process.argv[2];
  if (!inputPath) {
    inputPath = await aksFilePath("Informe o caminho do arquivo de entrada:");
  }
  inputPath = path.resolve(inputPath);

  const defaultName = `T0madon_${path.basename(inputPath)}.txt`;
  const answer = await aksFilePath(
    `Informe o caminho do arquivo de saída (padrão: ${defaultName}): `
  );

  let outputPath = answer.length > 0 ? answer : defaultName;
  outputPath = path.resolve(outputPath);

  escapeHTML(inputPath, outputPath);
}

function run() {
  if (process.argv.length >= 4) {
    escapeHTML(path.resolve(process.argv[2]), path.resolve(process.argv[3]));
  } else {
    console.log("---------------------");
    console.log("HTML Tag Escaper v1.0");
    console.log("---------------------\n");
    console.log(
      "Argumentos não informados! Por favor, informe os caminhos dos arquivos para realizar o escape."
    );
    userInteraction();
  }
}
