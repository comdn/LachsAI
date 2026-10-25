
const type = document.querySelector("#projectType");
const promptBox = document.querySelector("#prompt");
const output = document.querySelector("#output");
const sendButton = document.querySelector("#send");

const BACKEND_URL =
  "https://lachsai-backend.konstantin-schuenemann.workers.dev/";

const labels = {
  fabric: "Minecraft Fabric Mod (JAR)",
  android: "Android-App (APK)",
  web: "Web-App"
};

sendButton.addEventListener("click", async () => {
  const task = promptBox.value.trim();

  if (!task) {
    output.textContent = "Bitte beschreibe zuerst deine Aufgabe.";
    promptBox.focus();
    return;
  }

  const projectType = labels[type.value] || type.value;

  output.textContent = "LachsAI denkt nach ...";
  sendButton.disabled = true;

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt:
          "Projekttyp: " + projectType +
          "\nAufgabe: " + task +
          "\nAntworte auf Deutsch. Bei Programmieraufgaben liefere " +
          "passenden Code und erkläre, in welche Datei er gehört."
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "HTTP-Fehler " + response.status);
    }

    if (!data.response) {
      throw new Error("Die KI hat keine Textantwort geliefert.");
    }

    output.textContent = data.response;
  } catch (error) {
    output.textContent =
      "LachsAI konnte die Anfrage nicht bearbeiten.\n\n" +
      "Fehler: " + error.message +
      "\n\nPrüfe, ob dein Cloudflare-Worker deployed ist " +
      "und die Workers-AI-Bindung AI eingerichtet wurde.";
  } finally {
    sendButton.disabled = false;
  }
});
