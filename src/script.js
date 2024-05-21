class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Notes App</h1>`;
  }
}

class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="noteForm">
        <div>
          <label for="title">Judul:</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label for="body">Isi:</label>
          <textarea id="body" name="body" rows="4" required></textarea>
        </div>
        <button type="submit">Tambah Catatan</button>
      </form>
    `;
  }
}

class NoteList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<ul id="notes-list"></ul>`;
  }
}

customElements.define("app-bar", AppBar);
customElements.define("note-form", NoteForm);
customElements.define("note-list", NoteList);

const noteForm = document.getElementById("noteForm");
const notesList = document.getElementById("notes-list");
const loadingIndicator = document.getElementById("loadingIndicator");

const notesData = [
  {
    id: "notes-jT-jjsyz61J8XKiI",
    title: "Welcome to Notes, Dimas!",
    body: "Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.",
    createdAt: "2022-07-28T10:03:12.594Z",
    archived: false,
  },
  {
    id: "notes-aB-cdefg12345",
    title: "Meeting Agenda",
    body: "Discuss project updates and assign tasks for the upcoming week.",
    createdAt: "2022-08-05T15:30:00.000Z",
    archived: false,
  },
  {
    id: "notes-XyZ-789012345",
    title: "Shopping List",
    body: "Milk, eggs, bread, fruits, and vegetables.",
    createdAt: "2022-08-10T08:45:23.120Z",
    archived: false,
  },
  {
    id: "notes-1a-2b3c4d5e6f",
    title: "Personal Goals",
    body: "Read two books per month, exercise three times a week, learn a new language.",
    createdAt: "2022-08-15T18:12:55.789Z",
    archived: false,
  },
  {
    id: "notes-LMN-456789",
    title: "Recipe: Spaghetti Bolognese",
    body: "Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...",
    createdAt: "2022-08-20T12:30:40.200Z",
    archived: false,
  },
  {
    id: "notes-QwErTyUiOp",
    title: "Workout Routine",
    body: "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.",
    createdAt: "2022-08-25T09:15:17.890Z",
    archived: false,
  },
  {
    id: "notes-abcdef-987654",
    title: "Book Recommendations",
    body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
    createdAt: "2022-09-01T14:20:05.321Z",
    archived: false,
  },
  {
    id: "notes-zyxwv-54321",
    title: "Daily Reflections",
    body: "Write down three positive things that happened today and one thing to improve tomorrow.",
    createdAt: "2022-09-07T20:40:30.150Z",
    archived: false,
  },
  {
    id: "notes-poiuyt-987654",
    title: "Travel Bucket List",
    body: "1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA",
    createdAt: "2022-09-15T11:55:44.678Z",
    archived: false,
  },
  {
    id: "notes-asdfgh-123456",
    title: "Coding Projects",
    body: "1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project",
    createdAt: "2022-09-20T17:10:12.987Z",
    archived: false,
  },
  {
    id: "notes-5678-abcd-efgh",
    title: "Project Deadline",
    body: "Complete project tasks by the deadline on October 1st.",
    createdAt: "2022-09-28T14:00:00.000Z",
    archived: false,
  },
  {
    id: "notes-9876-wxyz-1234",
    title: "Health Checkup",
    body: "Schedule a routine health checkup with the doctor.",
    createdAt: "2022-10-05T09:30:45.600Z",
    archived: false,
  },
  {
    id: "notes-qwerty-8765-4321",
    title: "Financial Goals",
    body: "1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.",
    createdAt: "2022-10-12T12:15:30.890Z",
    archived: false,
  },
  {
    id: "notes-98765-54321-12345",
    title: "Holiday Plans",
    body: "Research and plan for the upcoming holiday destination.",
    createdAt: "2022-10-20T16:45:00.000Z",
    archived: false,
  },
  {
    id: "notes-1234-abcd-5678",
    title: "Language Learning",
    body: "Practice Spanish vocabulary for 30 minutes every day.",
    createdAt: "2022-10-28T08:00:20.120Z",
    archived: false,
  },
];

// Fungsi untuk menampilkan indikator loading
const showLoadingIndicator = () => {
  loadingIndicator.style.display = "block";
};

// Fungsi untuk menyembunyikan indikator loading
const hideLoadingIndicator = () => {
  loadingIndicator.style.display = "none";
};

// Fungsi untuk mengambil data dari API
const fetchData = async () => {
  try {
    showLoadingIndicator();
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
    if (!response.ok) {
      throw new Error("Failed to fetch data from API");
    }
    const data = await response.json();
    hideLoadingIndicator();
    return data.data;
  } catch (error) {
    hideLoadingIndicator();
    console.error("Error fetching data:", error);
    return [];
  }
};

// Fungsi untuk mengirim data ke API
const postData = async (data) => {
  try {
    showLoadingIndicator();
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to submit note to API");
    }
    const responseData = await response.json();
    hideLoadingIndicator();
    return responseData.data;
  } catch (error) {
    hideLoadingIndicator();
    console.error("Error posting data:", error);
    throw error;
  }
};

// Fungsi untuk membuat elemen catatan
const createNoteElement = (note) => {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <h2>${note.title}</h2>
    <p>${note.body}</p>
    <p><em>Created at: ${new Date(note.createdAt).toLocaleString()}</em></p>
    <button class="view-btn" data-id="${note.id}">View</button>
    <button class="delete-btn" data-id="${note.id}">Delete</button>
  `;
  return listItem;
};

// Event listener untuk menangani pengiriman formulir catatan
noteForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  const requestData = Object.fromEntries(formData);
  try {
    const newNote = await postData(requestData);
    alert("Note successfully submitted!");
    noteForm.reset();
    // Tambahkan catatan baru ke daftar catatan
    const listItem = createNoteElement(newNote);
    notesList.appendChild(listItem);
  } catch (error) {
    alert("Failed to submit note: " + error.message);
  }
});

// Event listener untuk menangani klik pada tombol-tombol di dalam daftar catatan
notesList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const noteId = event.target.getAttribute("data-id");
    try {
      showLoadingIndicator();
      await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
        method: "DELETE",
      });
      hideLoadingIndicator();
      // Hapus elemen catatan dari daftar
      event.target.parentElement.remove();
      alert("Note successfully deleted");
    } catch (error) {
      hideLoadingIndicator();
      alert("Failed to delete note: " + error.message);
    }
  } else if (event.target.classList.contains("view-btn")) {
    const noteId = event.target.getAttribute("data-id");
  }
});

// Fungsi untuk memuat dan merender catatan-catatan
const fetchAndRenderNotes = async () => {
  try {
    showLoadingIndicator();
    const apiData = await fetchData();
    const mergedData = [...apiData, ...notesData]; // Gabungkan data dari API dan data dummy
    notesList.innerHTML = "";
    mergedData.forEach((note) => {
      if (!note.archived) {
        const listItem = createNoteElement(note);
        notesList.appendChild(listItem);
      }
    });
    hideLoadingIndicator();
  } catch (error) {
    hideLoadingIndicator();
    console.error("Error fetching and rendering notes:", error);
  }
};

// Panggil fungsi fetchAndRenderNotes saat dokumen telah dimuat
document.addEventListener("DOMContentLoaded", fetchAndRenderNotes);
