const { ocrSpace } = require("ocr-space-api-wrapper");

async function main() {
  try {
    // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
    const res1 = await ocrSpace(
      "/home/wamae/timiza-logistics/server/uploads/1721535754458-invoice.jpg"
    );

    console.log(res1);

    // // Using your personal API key + local file
    // const res2 = await ocrSpace("/path/to/file.pdf", {
    //   apiKey: "<API_KEY_HERE>",
    // });

    // // Using your personal API key + base64 image + custom language
    // const res3 = await ocrSpace("data:image/png;base64...", {
    //   apiKey: "<API_KEY_HERE>",
    //   language: "ita",
    // });
  } catch (error) {
    console.error(error);
  }
}

main()
