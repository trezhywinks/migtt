const express = require('express');
const { createCanvas } = require('canvas');

const app = express();
const PORT = 9595;

app.get('/', (req, res) => {
  const text = req.query.api || 'Erro :(';

  const width = 512;
  const height = 512;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000';
  ctx.font = 'bold 50px Arial';
  ctx.textAlign = 'center';

  const maxWidth = width - 40; // margem lateral
  const lineHeight = 60;
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + word + ' ';
    const { width: testWidth } = ctx.measureText(testLine);

    if (testWidth > maxWidth && currentLine !== '') {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim());
  }

  // Centraliza verticalmente
  const startY = height / 2 - (lines.length * lineHeight) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  res.setHeader('Content-Type', 'image/png');
  canvas.pngStream().pipe(res);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/?api=texto`);
});
