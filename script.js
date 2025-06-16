const upload = document.getElementById('upload');
const presetSelect = document.getElementById('presetSelect');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Presety
const presets = {
  soft:      { brightness: 0.5, contrast: -0.1, sat: 0.05 },
  warm:      { brightness: 0.3, contrast: 0.1,  sat: 0.05 },
  minimal:   { brightness: 0.25,contrast: 0.2,  sat: 0.05 },
  muted:     { brightness: 0.15,contrast: -0.1, sat: -0.2 }
};

upload.addEventListener('change', () => {
  const file = upload.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    renderImage(img);
  };
  img.src = URL.createObjectURL(file);
});

presetSelect.addEventListener('change', () => {
  const file = upload.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => renderImage(img);
  img.src = URL.createObjectURL(upload.files[0]);
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'edited.png';
  link.click();
});

function renderImage(img) {
  ctx.drawImage(img, 0, 0);
  const p = presets[presetSelect.value];
  const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    // jas/brightness
    d[i] = d[i] * (1 + p.brightness);
    d[i+1] = d[i+1] * (1 + p.brightness);
    d[i+2] = d[i+2] * (1 + p.brightness);
    // saturace
    const gray = 0.3*d[i]+0.59*d[i+1]+0.11*d[i+2];
    d[i] = gray + (d[i] - gray) * (1 + p.sat);
    d[i+1] = gray + (d[i+1] - gray) * (1 + p.sat);
    d[i+2] = gray + (d[i+2] - gray) * (1 + p.sat);
    // kontrast
    d[i] = ((d[i]-128)*(1+p.contrast))+128;
    d[i+1] = ((d[i+1]-128)*(1+p.contrast))+128;
    d[i+2] = ((d[i+2]-128)*(1+p.contrast))+128;
  }

  ctx.putImageData(imgData, 0, 0);
}