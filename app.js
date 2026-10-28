
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";

const type = document.querySelector("#projectType");
const promptBox = document.querySelector("#prompt");
const output = document.querySelector("#output");
const sendButton = document.querySelector("#send");

const labels = {
  fabric: "Minecraft Fabric Mod (JAR)",
  android: "Android-App (APK)",
  web: "Web-App"
};

let generator = null;

async function loadLocalAI() {
  if (generator) return generator;

  output.textContent =
    "LachsAI lädt das KI-Modell herunter. " +
    "Beim ersten Start kann das etwas dauern …";

  generator = await pipeline(
    "text-generation",
    "onnx-community/Qwen2.5-0.5B-Instruct",
    { dtype: "q4" }
  );

  return generator;
}

sendButton.addEventListener("click", async () => {
  const task = promptBox.value.trim();

  if (!task) {
    output.textContent = "Bitte beschreibe zuerst deine Aufgabe.";
    return;
  }

  sendButton.disabled = true;

  try {
    output.textContent = "LachsAI startet die lokale KI …";

    const ai = await loadLocalAI();
    const projectType = labels[type.value] || type.value;

    const messages = [
      {
        role: "system",
        content:
          "Du bist LachsAI, ein hilfreicher Programmierassistent. " +
          "Antworte auf Deutsch. Erkläre Code verständlich. " +
          "Nenne bei Programmieraufgaben die passenden Dateinamen. " +
          "Erfinde keine angeblich getesteten Ergebnisse."
      },
      {
        role: "user",
        content:
          "Projekttyp: " + projectType +
          "\nAufgabe: " + task
      }
    ];

    output.textContent = "LachsAI generiert eine Antwort …";

    const result = await ai(messages, {
      max_new_tokens: 256,
      do_sample: true,
      temperature: 0.7
    });

    const generated = result?.[0]?.generated_text;
    const answer = Array.isArray(generated)
      ? generated[generated.length - 1]?.content
      : generated;

    output.textContent =
      typeof answer === "string" && answer.trim()
        ? answer
        : "Die lokale KI hat keine lesbare Antwort geliefert.";
  } catch (error) {
    generator = null;
    output.textContent =
      "Die lokale KI konnte nicht gestartet werden.\n\n" +
      "Fehler: " + (error?.message || String(error)) +
      "\n\nPrüfe deine Internetverbindung und lade die Seite neu. " +
      "Der Browser muss das Modell und die KI-Bibliothek laden können.";
  } finally {
    sendButton.disabled = false;
  }
});
