const type = document.querySelector("#projectType");
const promptBox = document.querySelector("#prompt");
const output = document.querySelector("#output");
document.querySelector("#send").addEventListener("click", () => {
  const task = promptBox.value.trim();
  if (!task) {
    output.textContent = "Bitte beschreibe zuerst deine Aufgabe.";
    promptBox.focus();
    return;
  }
  const labels = {
    fabric: "Minecraft Fabric Mod (JAR)",
    android: "Android-App (APK)",
    web: "Web-App"
  };
  output.textContent =
    "Anfrage vorbereitet – Demo-Modus

" +
    "Projekttyp: " + labels[type.value] + "
" +
    "Aufgabe: " + task + "

" +
    "Nächster Schritt: Verbinde ein sicheres Backend, damit eine KI die Aufgabe bearbeiten kann. " +
    "Für eine JAR oder APK muss zusätzlich ein passendes Quellprojekt mit Build-Konfiguration vorhanden sein. " +
    "Dieser Demo-Bildschirm sendet deine Anfrage noch nicht an einen KI-Dienst und erstellt keine Datei.";
});
