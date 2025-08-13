const img = document.getElementById('source');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startPic = document.getElementById('start');

// Получение цвета пикселя
function getColorAt(x, y) {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
}

// Создание одного круга (четверти)
function createQuarter(x, y, size, depth = 0) {
  const color = getColorAt(Math.floor(x), Math.floor(y));
  const div = document.createElement('div');
  div.classList.add('quarter');
  div.style.background = color;
  div.style.width = `${size}px`;
  div.style.height = `${size}px`;
  div.style.borderRadius = `${size / 4}px`;
  div.style.position = 'absolute';
  div.style.left = `${x - size / 2}px`;
  div.style.top = `${y - size / 2}px`;
  div.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  div.style.zIndex = depth; // чтобы потомки были выше

  if (depth < 8) {

    div.addEventListener('pointerenter', (event) => {
      console.log(event)
      if (div.dataset.split === 'true') return;
      div.dataset.split = 'true';

      const half = size / 2;
      const offset = half / 2;

      const coords = [
        { x: x - offset, y: y - offset },
        { x: x + offset, y: y - offset },
        { x: x - offset, y: y + offset },
        { x: x + offset, y: y + offset }
      ];

      coords.forEach(({ x, y }) => {
        const child = createQuarter(x, y, half, depth + 1);
        // 👇 добавляем потомков в startPic, а не внутрь родителя
        startPic.appendChild(child);
      });

      // 👇 исчезновение только родителя
      div.style.opacity = '0';
      div.style.transform = 'scale(0)';
      setTimeout(() => {
        div.remove(); // можно удалить совсем
      }, 300);
    });
  }

  return div;
}


// Обработка изображения
function processImage() {
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const root = createQuarter(centerX, centerY, 550, 0);
  startPic.innerHTML = '';
  startPic.appendChild(root);
}

// Запуск после загрузки изображения
if (img.complete) {
  processImage();
} else {
  img.onload = processImage;
}
