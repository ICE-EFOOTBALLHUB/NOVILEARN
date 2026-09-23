const curriculum = await fetch("./data/curriculum.json")
    .then(response => response.json());

const subjects = await fetch("./data/subjects.json")
    .then(response => response.json());

const lessons = await fetch("./data/lessons.json")
    .then(response => response.json());


const levelsContainer = document.getElementById("levels");

const nigeria = curriculum.nigeria;


// ==============================
// SHOW EDUCATION LEVELS
// ==============================

Object.entries(nigeria.levels).forEach(([levelId, level]) => {

    const card = document.createElement("div");

    card.className = "level-card";

    card.innerHTML = `
        <h3>${level.name}</h3>
        <p>Select this level to continue</p>
    `;

    card.addEventListener("click", () => {
        showClasses(levelId, level);
    });

    levelsContainer.appendChild(card);
});


// ==============================
// SHOW CLASSES
// ==============================

function showClasses(levelId, level) {

    levelsContainer.innerHTML = "";

    const backButton = document.createElement("button");

    backButton.textContent = "← Back";

    backButton.addEventListener("click", () => {
        location.reload();
    });

    levelsContainer.appendChild(backButton);


    const title = document.createElement("h2");

    title.textContent = level.name;

    levelsContainer.appendChild(title);


    Object.entries(level.classes).forEach(([classId, schoolClass]) => {

        const card = document.createElement("div");

        card.className = "level-card";

        card.innerHTML = `
            <h3>${schoolClass.name}</h3>
            <p>Select this class to continue</p>
        `;

        card.addEventListener("click", () => {
            showSubjects(levelId, classId, schoolClass);
        });

        levelsContainer.appendChild(card);
    });
}


// ==============================
// SHOW SUBJECTS
// ==============================

function showSubjects(levelId, classId, schoolClass) {

    levelsContainer.innerHTML = "";

    const backButton = document.createElement("button");

    backButton.textContent = "← Back";

    backButton.addEventListener("click", () => {
        showClasses(levelId, nigeria.levels[levelId]);
    });

    levelsContainer.appendChild(backButton);


    const title = document.createElement("h2");

    title.textContent = schoolClass.name;

    levelsContainer.appendChild(title);


    const levelSubjects = subjects[levelId];


    if (!levelSubjects) {

        const message = document.createElement("p");

        message.textContent = "No subjects found for this level.";

        levelsContainer.appendChild(message);

        return;
    }


    levelSubjects.forEach(subject => {

        const card = document.createElement("div");

        card.className = "level-card";

        card.innerHTML = `
            <h3>${subject.name}</h3>
            <p>View lessons</p>
        `;

        card.addEventListener("click", () => {
            showTopics(levelId, classId, subject.id);
        });

        levelsContainer.appendChild(card);
    });
}


// ==============================
// SHOW TOPICS
// ==============================

function showTopics(levelId, classId, subjectId) {

    levelsContainer.innerHTML = "";

    const backButton = document.createElement("button");

    backButton.textContent = "← Back";

    backButton.addEventListener("click", () => {

        const schoolClass =
            nigeria.levels[levelId].classes[classId];

        showSubjects(levelId, classId, schoolClass);
    });

    levelsContainer.appendChild(backButton);


    const title = document.createElement("h2");

    title.textContent = "Topics";

    levelsContainer.appendChild(title);


    const subjectLessons =
        lessons.nigeria?.[levelId]?.[classId]?.[subjectId];


    if (!subjectLessons) {

        const message = document.createElement("p");

        message.textContent = "No lessons available yet.";

        levelsContainer.appendChild(message);

        return;
    }


    Object.entries(subjectLessons).forEach(([topicId, topic]) => {

        const card = document.createElement("div");

        card.className = "level-card";

        card.innerHTML = `
            <h3>${topic.title}</h3>
            <p>${topic.description}</p>
        `;

        levelsContainer.appendChild(card);
    });
}