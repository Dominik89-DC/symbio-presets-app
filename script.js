
const canvas = new fabric.Canvas('canvas');
const originalCanvas = new fabric.Canvas('originalCanvas');
const upload = document.getElementById('upload');
const presetSelect = document.getElementById('presetSelect');

const presets = {
  softBeige: { brightness: 0.1, contrast: -0.1, saturation: 0.05 },
  warmTone: { brightness: 0.05, contrast: 0.1, saturation: 0.05 },
  orangeGrey: { brightness: 0.03, contrast: 0.2, saturation: 0.05 },
  mutedOrange: { brightness: 0.02, contrast: -0.1, saturation: -0.2 }
};

upload.addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = function (f) {
    const imgSrc = f.target.result;

    // Load and display original
    fabric.Image.fromURL(imgSrc, function (origImg) {
      originalCanvas.clear();
      origImg.set({
        scaleX: 250 / origImg.width,
        scaleY: 250 / origImg.height,
      });
      originalCanvas.setWidth(origImg.getScaledWidth());
      originalCanvas.setHeight(origImg.getScaledHeight());
      originalCanvas.add(origImg);
    });

    // Load and apply preset
    fabric.Image.fromURL(imgSrc, function (editImg) {
      canvas.clear();
      editImg.set({
        scaleX: 250 / editImg.width,
        scaleY: 250 / editImg.height,
      });

      const preset = presets[presetSelect.value];
      editImg.filters = [];
      if (preset.brightness !== undefined)
        editImg.filters.push(new fabric.Image.filters.Brightness({ brightness: preset.brightness }));
      if (preset.contrast !== undefined)
        editImg.filters.push(new fabric.Image.filters.Contrast({ contrast: preset.contrast }));
      if (preset.saturation !== undefined)
        editImg.filters.push(new fabric.Image.filters.Saturation({ saturation: preset.saturation }));

      editImg.applyFilters();
      canvas.setWidth(editImg.getScaledWidth());
      canvas.setHeight(editImg.getScaledHeight());
      canvas.add(editImg);
    });
  };
  reader.readAsDataURL(e.target.files[0]);
});

function downloadImage() {
  const dataURL = canvas.toDataURL({ format: 'png' });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'edited-photo.png';
  link.click();
}
