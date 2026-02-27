import QRCode from 'qrcode';

/**
 * Generates a QR Code as a Base64 Data URL.
 * @param url - The destination link to encode in the QR code.
 * @returns Promise<string> - A string containing the image data (e.g., data:image/png;base64,...)
 */
const generateQRCode = async (url: string): Promise<string> => {
  try {
    // toDataURL returns a Promise<string> by default
    const qrCodeBase64: string = await QRCode.toDataURL(url);
    return qrCodeBase64;
  } catch (err: any) {
    console.error("QR Generation Error:", err);
    throw new Error(`QR Code generation failed: ${err.message}`);
  }
};

export default generateQRCode;