const Jimp = require("jimp");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

async function preprocessImage(imagePath) {
  const image = await Jimp.read(imagePath);
  image
    .grayscale() // Convert to grayscale
    .contrast(0.5) // Increase contrast
    .write("preprocessed_image.png"); // Save the preprocessed image
}

async function performOCR(imagePath) {
  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, "eng", {
    logger: (m) => console.log(m),
  });
  return text;
}

const extractFields = (text) => {
  const vehicleRegistration = text.match(
    /Vehicle Registration No:\s*([A-Z0-9\s]+)/i
  );
  const driverName = text.match(/Driver Name:\s*([A-Z\s]+)/i);
  const date = text.match(/Date:\s*([\d/]+)/i);
  const transporterName = text.match(/Transporter Name:\s*([A-Z\s]+)/i);

  return {
    vehicleRegistration: vehicleRegistration
      ? vehicleRegistration[1].trim()
      : null,
    driverName: driverName ? driverName[1].trim() : null,
    date: date ? date[1].trim() : null,
    transporterName: transporterName ? transporterName[1].trim() : null,
  };
};

async function processImage(imagePath) {
  await preprocessImage(imagePath);
  const text = await performOCR("preprocessed_image.png");
  const extractedFields = extractFields(text);
  console.log(extractedFields);
}

processImage("/home/wamae/timiza-logistics/server/test-delivery-note.jpeg");
