export const resizeImage = (file: File, maxWidth = 1024): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
    reader.readAsDataURL(file);
  });
};

export const downloadQR = (canvas: HTMLCanvasElement | null, name: string) => {
  if (!canvas) return;
  const imageUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `qr-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
  link.click();
};

export const shareQR = async (canvas: HTMLCanvasElement | null, name: string, title: string = 'QR Kód') => {
  if (canvas && navigator.share) {
    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `qr-${name}.png`, { type: 'image/png' });
          await navigator.share({
            title: title,
            text: name,
            files: [file]
          });
        }
      });
    } catch (err) {
      console.error("Sharing failed", err);
    }
  }
};
