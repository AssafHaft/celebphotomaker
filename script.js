const form = document.getElementById("prompt-form");
const output = document.getElementById("prompt-output");
const statusText = document.getElementById("status");
const copyButton = document.getElementById("copy-button");

const DESCRIPTION_PREFIX =
  "A cinematic photo where the original person is seamlessly integrated into the scene, high detail, natural composition.";

const template = (values) => ({
  task: "edit_image",
  scene_description: {
    camera_perspective: "third_person",
    action: formatAction(values.action),
    original_person: {
      identity: "the person from the input image",
      pose: "same outfit and facial expression as original photo",
    },
    celebrity: {
      name: `<${values.celebrity}>`,
      position: values.position,
    },
    movie_scene: {
      name: `<${values.movieName}>`,
      location: `<${values.movieLocation}>`,
    },
  },
  visual_style: {
    realism: "photorealistic",
    lighting: "match movie scene as is",
    shadows: "natural and consistent with scene",
    depth_and_scale: "accurate for all people and background",
  },
  result_description: formatResultDescription(values.resultDescription),
});

function ensurePeriod(text) {
  const trimmed = text.trim();
  if (!trimmed.endsWith(".")) {
    return `${trimmed}.`;
  }
  return trimmed;
}

function formatAction(action) {
  const trimmed = action.trim();
  if (!trimmed) return "Person"; // fallback, though required fields should prevent this
  return `Person ${trimmed}`;
}

function formatResultDescription(description) {
  const userPortion = ensurePeriod(description);
  return `${DESCRIPTION_PREFIX} ${userPortion}`;
}

function toJsonPrompt(values) {
  const promptObject = template(values);
  return JSON.stringify(promptObject, null, 2);
}

function gatherValues() {
  return {
    action: document.getElementById("action").value.trim(),
    celebrity: document.getElementById("celebrity").value.trim(),
    position: document.getElementById("position").value.trim(),
    movieName: document.getElementById("movie-name").value.trim(),
    movieLocation: document.getElementById("movie-location").value.trim(),
    resultDescription: document.getElementById("result").value.trim(),
  };
}

function allFieldsFilled(values) {
  return Object.values(values).every((value) => value.length > 0);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = gatherValues();

  if (!allFieldsFilled(values)) {
    statusText.textContent = "Please fill out every field to generate the prompt.";
    copyButton.disabled = true;
    return;
  }

  const promptText = toJsonPrompt(values);
  output.textContent = promptText;
  statusText.textContent = "Prompt generated!";
  copyButton.disabled = false;
});

copyButton.addEventListener("click", async () => {
  const text = output.textContent;
  if (!text || copyButton.disabled) return;

  try {
    await navigator.clipboard.writeText(text);
    statusText.textContent = "Copied to clipboard.";
  } catch (error) {
    console.error("Copy failed", error);
    statusText.textContent = "Copy not available in this browser.";
  }
});
