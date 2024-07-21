const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const path =
  "/home/wamae/timiza-logistics/server/uploads/1721535754458-invoice.jpg"; 
// Preprocess the image (optional but can improve OCR accuracy)
sharp(path)
  .grayscale()
  .sharpen()
  .toBuffer()
  .then((data) => {
    // Run Tesseract on the processed image
    Tesseract.recognize(data, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        console.log("Extracted Text:", text);
      })
      .catch((error) => {
        console.error("OCR processing error:", error);
      });
  })
  .catch((err) => {
    console.error("Image processing error:", err);
  });
