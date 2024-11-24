import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para excluir uma imagem
export function excluirImagem(caminhoImagem) {
    const caminhoCompleto = path.join(__dirname, caminhoImagem);
  
    fs.unlink(caminhoCompleto, (erro) => {
      if (erro) {
        console.error('Erro ao excluir a imagem:', erro);
      } else {
        console.log('Imagem excluída com sucesso!');
      }
    });
  }