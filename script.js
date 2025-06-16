
const canvas = new fabric.Canvas('canvas');
const upload = document.getElementById('upload');
const presetSelect = document.getElementById('presetSelect');

const presets = {
  softBeige: {
    brightness: 0.1,
    contrast: -0.1,
    saturation: 0.05
  },
  warmTone: {
    brightness: 0.05,
    contrast: 0.1,
    saturation: 0.05
  },
  orangeGrey: {
    brightness: 0.03,
    contrast: 0.2,
    saturation: 0.05
  },
  mutedOrange: {
    brightness: 0.02,
    contrast: -0.1,
    saturation: -0.2
  }
};

upload.addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      canvas.clear();
      img.set({
        left: 0,
        top: 0,
        scaleX: 500 / img.width,
        scaleY: 500 / img.height,
      });

      const preset = presets[presetSelect.value];
      img.filters = [];
      if (preset.brightness !== undefined)
        img.filters.push(new fabric.Image.filters.Brightness({ brightness: preset.brightness }));
      if (preset.contrast !== undefined)
        img.filters.push(new fabric.Image.filters.Contrast({ contrast: preset.contrast }));
      if (preset.saturation !== undefined)
        img.filters.push(new fabric.Image.filters.Saturation({ saturation: preset.saturation }));

      img.applyFilters();
      canvas.setWidth(img.getScaledWidth());
      canvas.setHeight(img.getScaledHeight());
      canvas.add(img);
    });
  };
  reader.readAsDataURL(e.target.files[0]);
});

function downloadImage() {
  const dataURL = canvas.toDataURL({
    format: 'png'
  });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'edited-photo.png';
  link.click();
}
