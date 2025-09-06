const input = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const output = document.getElementById("output");
const progressBar = document.getElementById("progress");
const statusText = document.getElementById("status");

input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    statusText.textContent = "Image loaded. Ready for OCR.";
  }
});

async function startOCR() {
  const file = input.files[0];
  if (!file) {
    alert("Please upload an image first!");
    return;
  }

  statusText.textContent = "Loading Santali OCR model...";
  progressBar.value = 0;

  const worker = await Tesseract.createWorker("sat", 1, {
    langPath: "./tessdata", // IMPORTANT: sat.traineddata must be in tessdata/
    logger: (m) => {
      if (m.status === "recognizing text") {
        statusText.textContent = `Recognizing... ${Math.round(m.progress * 100)}%`;
        progressBar.value = m.progress * 100;
      }
    },
  });

  const { data: { text } } = await worker.recognize(file);
  output.value = text;
  statusText.textContent = "✅ OCR Completed!";
  await worker.terminate();
}
