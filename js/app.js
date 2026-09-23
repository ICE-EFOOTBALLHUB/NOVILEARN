const curriculum = await fetch("./data/curriculum.json")
    .then(response => response.json());

const subjects = await fetch("./data/subjects.json")
    .then(response => response.json());

const lessons = await fetch("./data/lessons.json")
    .then(response => response.json());

const questions = await fetch("./data/questions.json")
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

        card.addEventListener("click", () => {
            showLesson(levelId, classId, subjectId, topicId);
        });

        levelsContainer.appendChild(card);
    });
}


// ==============================
// SHOW LESSON
// ==============================

function showLesson(levelId, classId, subjectId, topicId) {

    const lesson =
        lessons.nigeria?.[levelId]?.[classId]?.[subjectId]?.[topicId];


    if (!lesson) {

        levelsContainer.innerHTML = `
            <p>Lesson not found.</p>
        `;

        return;
    }


    levelsContainer.innerHTML = "";


    const backButton = document.createElement("button");

    backButton.textContent = "← Back";

    backButton.addEventListener("click", () => {
        showTopics(levelId, classId, subjectId);
    });

    levelsContainer.appendChild(backButton);


    const title = document.createElement("h2");

    title.textContent = lesson.title;

    levelsContainer.appendChild(title);


    const description = document.createElement("p");

    description.textContent = lesson.description;

    levelsContainer.appendChild(description);


    lesson.content.forEach(item => {

        const section = document.createElement("div");

        section.className = "lesson-section";


        if (item.type === "text") {

            section.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.body}</p>
            `;

        }


        if (item.type === "example") {

            section.innerHTML = `
                <h3>Example</h3>
                <p>${item.question}</p>
                <strong>Answer: ${item.answer}</strong>
            `;

        }


        levelsContainer.appendChild(section);
    });


    // Practice Questions button

    const practiceButton = document.createElement("button");

    practiceButton.textContent = "Practice Questions";

    practiceButton.addEventListener("click", () => {
        showQuestions(levelId, classId, subjectId, topicId);
    });

    levelsContainer.appendChild(practiceButton);
}


// ==============================
// SHOW PRACTICE QUESTIONS
// ==============================

function showQuestions(levelId, classId, subjectId, topicId) {

    const questionList =
        questions.nigeria?.[levelId]?.[classId]?.[subjectId]?.[topicId];


    if (!questionList || questionList.length === 0) {

        levelsContainer.innerHTML = `
            <p>No practice questions available yet.</p>
        `;

        return;
    }


    levelsContainer.innerHTML = "";


    const backButton = document.createElement("button");

    backButton.textContent = "← Back";

    backButton.addEventListener("click", () => {
        showLesson(levelId, classId, subjectId, topicId);
    });

    levelsContainer.appendChild(backButton);


    const title = document.createElement("h2");

    title.textContent = "Practice Questions";

    levelsContainer.appendChild(title);


    questionList.forEach((question, index) => {

        const questionCard = document.createElement("div");

        questionCard.className = "lesson-section";


        questionCard.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.question}</p>
        `;


        question.options.forEach((option, optionIndex) => {

            const optionButton = document.createElement("button");

            optionButton.textContent = option;


            optionButton.addEventListener("click", () => {

                if (optionIndex === question.answer) {

                    optionButton.textContent = "✓ " + option;

                } else {

                    optionButton.textContent = "✗ " + option;

                }

            });


            questionCard.appendChild(optionButton);
        });


        levelsContainer.appendChild(questionCard);
    });
}