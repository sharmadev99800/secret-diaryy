const SUPABASE_URL = "https://bceqcjlijqtbnzjksyex.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZXFjamxpanF0Ym56amtzeWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTg1OTYsImV4cCI6MjA4MjE3NDU5Nn0.n3GcwTUaPDnJYFdUuTfADXQ7JlxtBLROILTcoIsliTs";

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// QUIZ QUESTIONS
const quizQuestions = [
  { question: "What is my favorite color?", options: ["Red","Blue","Green","Yellow"], answer: "Blue" },
  { question: "What is my favorite food?", options: ["Pizza","Burger","Pasta","Sushi"], answer: "Pizza" },
  { question: "Where was I born?", options: ["City A","City B","City C","City D"], answer: "City B" },
  { question: "My favorite animal?", options: ["Dog","Cat","Bird","Fish"], answer: "Dog" },
  { question: "My favorite hobby?", options: ["Reading","Gaming","Traveling","Drawing"], answer: "Gaming" }
];

function showQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  quizQuestions.forEach((q, index) => {
    container.innerHTML += `
      <p>${q.question}</p>
      ${q.options.map(opt => `
        <label>
          <input type="radio" name="q${index}" value="${opt}"> ${opt}
        </label><br>
      `).join("")}
    `;
  });

  container.innerHTML += `<button onclick="checkQuiz()">Submit Quiz</button>`;
}

function checkQuiz() {
  let correct = 0;
  quizQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name=q${i}]:checked`);
    if (selected && selected.value === q.answer) correct++;
  });

  if (correct >= 3) {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("diary-container").style.display = "block";
  } else {
    alert("Wrong answers. Try again!");
  }
}

showQuiz();

async function saveNote() {
  const note = document.getElementById("note").value;
  const voiceFile = document.getElementById("voiceUpload").files[0];
  let voiceUrl = null;

  if (voiceFile) {
    const { data, error } = await supabase.storage
      .from("voices")
      .upload(`${Date.now()}-${voiceFile.name}`, voiceFile);

    if (error) return alert("Voice upload failed");

    const { data: publicData } = supabase.storage
      .from("voices")
      .getPublicUrl(data.path);

    voiceUrl = publicData.publicUrl;
  }

  const { error } = await supabase
    .from("notes")
    .insert([{ text: note, voice: voiceUrl }]);

  if (error) alert("Save failed");
  else alert("Saved ❤️");
}