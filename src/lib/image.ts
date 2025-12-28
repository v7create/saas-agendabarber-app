
/**
 * Comprime uma imagem reduzindo sua resolução e qualidade
 * @param file Arquivo de imagem original
 * @param maxWidth Largura máxima permitida
 * @param maxHeight Altura máxima permitida
 * @param quality Qualidade da compressão (0 a 1)
 * @returns Promise com a string base64 da imagem comprimida
 */
export const compressImage = (
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível obter contexto do canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Se o arquivo original for menor que o comprimido, retorna o original (em base64)
        // Mas para simplificar e garantir o formato, vamos retornar o comprimido
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
