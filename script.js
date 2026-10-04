// ==========================================
// VOICENOTE AI
// SMART VOICE NOTES & ORGANIZER
// ==========================================


// ==========================================
// VARIABLES
// ==========================================

let notes =
    JSON.parse(localStorage.getItem("voiceNotes")) || [];

let currentAnalysis = null;


// ==========================================
// HTML ELEMENTS
// ==========================================

const noteInput =
    document.getElementById("noteInput");

const startBtn =
    document.getElementById("startBtn");

const stopBtn =
    document.getElementById("stopBtn");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const saveBtn =
    document.getElementById("saveBtn");

const recordStatus =
    document.getElementById("recordStatus");

const categoryResult =
    document.getElementById("categoryResult");

const priorityResult =
    document.getElementById("priorityResult");

const keywordResult =
    document.getElementById("keywordResult");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const notesContainer =
    document.getElementById("notesContainer");


// ==========================================
// SPEECH RECOGNITION
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;

let isListening = false;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = false;

    recognition.lang = "en-US";


    recognition.onstart = function () {

        isListening = true;

        recordStatus.innerText =
            "Listening...";

        recordStatus.style.background =
            "#fee2e2";

        recordStatus.style.color =
            "#dc2626";

        startBtn.innerText =
            "🎙️ Listening...";

    };


    recognition.onresult =
        function (event) {

            let transcript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0].transcript
                    + " ";

            }

            noteInput.value +=
                transcript;

        };


    recognition.onerror =
        function (event) {

            console.log(
                "Speech recognition error:",
                event.error
            );

            recordStatus.innerText =
                "Speech Error";

            recordStatus.style.background =
                "#fee2e2";

            recordStatus.style.color =
                "#dc2626";

        };


    recognition.onend =
        function () {

            isListening = false;

            recordStatus.innerText =
                "Ready";

            recordStatus.style.background =
                "#dcfce7";

            recordStatus.style.color =
                "#15803d";

            startBtn.innerText =
                "🎤 Start Speaking";

        };

}


// ==========================================
// START SPEAKING
// ==========================================

startBtn.addEventListener(
    "click",
    function () {

        if (!recognition) {

            alert(
                "Speech recognition is not supported in this browser. Please use Google Chrome."
            );

            return;

        }


        if (isListening) {

            return;

        }


        try {

            recognition.start();

        } catch (error) {

            console.log(error);

        }

    }
);


// ==========================================
// STOP SPEAKING
// ==========================================

stopBtn.addEventListener(
    "click",
    function () {

        if (
            recognition &&
            isListening
        ) {

            recognition.stop();

        }

    }
);


// ==========================================
// ANALYZE NOTE
// ==========================================

analyzeBtn.addEventListener(
    "click",
    analyzeNote
);


function analyzeNote() {

    const text =
        noteInput.value.trim();


    if (text === "") {

        alert(
            "Please type or speak a note first."
        );

        return;

    }


    const category =
        detectCategory(text);


    const priority =
        detectPriority(text);


    const keywords =
        extractKeywords(text);


    currentAnalysis = {

        category: category,

        priority: priority,

        keywords: keywords

    };


    categoryResult.innerText =
        category;


    priorityResult.innerText =
        priority;


    if (keywords.length > 0) {

        keywordResult.innerText =
            keywords.join(", ");

    } else {

        keywordResult.innerText =
            "No keywords found";

    }

}


// ==========================================
// CATEGORY DETECTION
// ==========================================

function detectCategory(text) {

    const lowerText =
        text.toLowerCase();


    const taskWords = [

        "submit",
        "complete",
        "finish",
        "do",
        "prepare",
        "create",
        "develop",
        "build",
        "write",
        "study",
        "assignment",
        "project",
        "work",
        "task"

    ];


    const reminderWords = [

        "remind",
        "remember",
        "tomorrow",
        "today",
        "buy",
        "call",
        "appointment",
        "meeting",
        "visit",
        "deadline",
        "don't forget"

    ];


    const ideaWords = [

        "idea",
        "think",
        "concept",
        "maybe",
        "design",
        "imagine",
        "suggest",
        "could",
        "innovation",
        "feature"

    ];


    const meetingWords = [

        "meeting",
        "discuss",
        "team",
        "client",
        "presentation",
        "discussion",
        "agenda",
        "manager"

    ];


    if (
        containsAny(
            lowerText,
            meetingWords
        )
    ) {

        return "Meeting";

    }


    if (
        containsAny(
            lowerText,
            reminderWords
        )
    ) {

        return "Reminder";

    }


    if (
        containsAny(
            lowerText,
            ideaWords
        )
    ) {

        return "Idea";

    }


    if (
        containsAny(
            lowerText,
            taskWords
        )
    ) {

        return "Task";

    }


    return "General";

}


// ==========================================
// PRIORITY DETECTION
// ==========================================

function detectPriority(text) {

    const lowerText =
        text.toLowerCase();


    const highPriorityWords = [

        "urgent",
        "emergency",
        "immediately",
        "asap",
        "critical",
        "important",
        "deadline",
        "today",
        "now"

    ];


    const mediumPriorityWords = [

        "tomorrow",
        "soon",
        "this week",
        "prepare",
        "remember",
        "meeting"

    ];


    if (
        containsAny(
            lowerText,
            highPriorityWords
        )
    ) {

        return "High";

    }


    if (
        containsAny(
            lowerText,
            mediumPriorityWords
        )
    ) {

        return "Medium";

    }


    return "Normal";

}


// ==========================================
// CHECK WORDS
// ==========================================

function containsAny(
    text,
    words
) {

    return words.some(
        word =>
            text.includes(word)
    );

}


// ==========================================
// KEYWORD EXTRACTION
// ==========================================

function extractKeywords(text) {

    const stopWords = [

        "the",
        "is",
        "a",
        "an",
        "and",
        "or",
        "of",
        "to",
        "in",
        "on",
        "for",
        "with",
        "this",
        "that",
        "it",
        "i",
        "am",
        "my",
        "me",
        "you",
        "your",
        "we",
        "are",
        "was",
        "were",
        "be",
        "been",
        "have",
        "has",
        "had",
        "do",
        "does",
        "did",
        "can",
        "could",
        "will",
        "would",
        "should",
        "from",
        "as",
        "at",
        "by",
        "about",
        "but",
        "so",
        "very",
        "please",
        "need",
        "want"

    ];


    const words =
        text
            .toLowerCase()
            .replace(
                /[.,!?;:]/g,
                ""
            )
            .split(/\s+/);


    const frequency = {};


    words.forEach(
        word => {

            if (
                word.length > 3 &&
                !stopWords.includes(word)
            ) {

                if (
                    frequency[word]
                ) {

                    frequency[word]++;

                } else {

                    frequency[word] = 1;

                }

            }

        }
    );


    return Object.entries(
        frequency
    )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .slice(0, 5)
        .map(
            item => item[0]
        );

}


// ==========================================
// SAVE NOTE
// ==========================================

saveBtn.addEventListener(
    "click",
    function () {

        const text =
            noteInput.value.trim();


        if (text === "") {

            alert(
                "Please enter or speak a note first."
            );

            return;

        }


        if (!currentAnalysis) {

            analyzeNote();

        }


        if (!currentAnalysis) {

            return;

        }


        const note = {

            id: Date.now(),

            text: text,

            category:
                currentAnalysis.category,

            priority:
                currentAnalysis.priority,

            keywords:
                currentAnalysis.keywords,

            date:
                new Date()
                    .toLocaleDateString()

        };


        notes.unshift(note);


        saveNotes();


        noteInput.value = "";


        currentAnalysis = null;


        categoryResult.innerText =
            "Not analyzed";


        priorityResult.innerText =
            "Not analyzed";


        keywordResult.innerText =
            "Not analyzed";


        displayNotes();


        alert(
            "Note saved successfully!"
        );


        document
            .getElementById("notes")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// ==========================================
// LOCAL STORAGE
// ==========================================

function saveNotes() {

    localStorage.setItem(
        "voiceNotes",
        JSON.stringify(notes)
    );

}


// ==========================================
// DISPLAY NOTES
// ==========================================

function displayNotes() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const category =
        categoryFilter.value;


    const filteredNotes =
        notes.filter(
            note => {

                const matchesSearch =
                    note.text
                        .toLowerCase()
                        .includes(search) ||
                    note.keywords
                        .join(" ")
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "All" ||
                    note.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    notesContainer.innerHTML = "";


    if (
        filteredNotes.length === 0
    ) {

        notesContainer.innerHTML = `

            <div class="empty-message">

                <h3>No notes found</h3>

                <p>
                    Create your first smart voice note.
                </p>

            </div>

        `;

        updateStats();

        return;

    }


    filteredNotes.forEach(
        note => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "note-card";


            let priorityClass =
                "normal";


            if (
                note.priority === "High"
            ) {

                priorityClass =
                    "high";

            }


            if (
                note.priority === "Medium"
            ) {

                priorityClass =
                    "medium";

            }


            const keywords =
                note.keywords.length > 0
                    ? note.keywords.join(", ")
                    : "No keywords";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(
                        getTitle(note.text)
                    )}
                </h3>


                <p class="note-text">
                    ${escapeHTML(note.text)}
                </p>


                <div class="note-meta">

                    <span
                        class="badge category-badge"
                    >
                        ${note.category}
                    </span>


                    <span
                        class="badge ${priorityClass}"
                    >
                        ${note.priority} Priority
                    </span>

                </div>


                <div class="note-keywords">

                    Keywords:
                    ${escapeHTML(keywords)}

                </div>


                <small>
                    Created: ${note.date}
                </small>


                <div class="note-actions">

                    <button
                        class="listen-btn"
                        onclick="listenNote(${note.id})"
                    >
                        🔊 Listen
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteNote(${note.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            notesContainer.appendChild(
                card
            );

        }
    );


    updateStats();

}


// ==========================================
// NOTE TITLE
// ==========================================

function getTitle(text) {

    const words =
        text.split(/\s+/);


    if (words.length <= 6) {

        return text;

    }


    return (
        words
            .slice(0, 6)
            .join(" ") +
        "..."
    );

}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(text) {

    return text
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// LISTEN TO NOTE
// ==========================================

function listenNote(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) {

        return;

    }


    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Text-to-speech is not supported in this browser."
        );

        return;

    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            note.text
        );


    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;


    window.speechSynthesis.speak(
        speech
    );

}


// ==========================================
// DELETE NOTE
// ==========================================

function deleteNote(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this note?"
        );


    if (!confirmDelete) {

        return;

    }


    notes =
        notes.filter(
            note =>
                note.id !== id
        );


    saveNotes();

    displayNotes();

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    displayNotes
);


// ==========================================
// CATEGORY FILTER
// ==========================================

categoryFilter.addEventListener(
    "change",
    displayNotes
);


// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function updateStats() {

    document.getElementById(
        "totalNotes"
    ).innerText =
        notes.length;


    document.getElementById(
        "taskNotes"
    ).innerText =
        notes.filter(
            note =>
                note.category === "Task"
        ).length;


    document.getElementById(
        "reminderNotes"
    ).innerText =
        notes.filter(
            note =>
                note.category === "Reminder"
        ).length;


    document.getElementById(
        "ideaNotes"
    ).innerText =
        notes.filter(
            note =>
                note.category === "Idea"
        ).length;

}


// ==========================================
// INITIAL LOAD
// ==========================================

displayNotes();