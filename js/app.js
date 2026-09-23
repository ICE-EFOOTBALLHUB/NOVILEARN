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
        startPractice(levelId, classId, subjectId, topicId);
    });

    levelsContainer.appendChild(practiceButton);
}


// ==============================
// START PRACTICE
// ==============================

function startPractice(levelId, classId, subjectId, topicId) {

    const questionList =
        questions.nigeria?.[levelId]?.[classId]?.[subjectId]?.[topicId];


    if (!questionList || questionList.length === 0) {

        levelsContainer.innerHTML = `
            <p>No practice questions available yet.</p>
        `;

        return;
    }


    const practiceState = {
        questions: questionList,
        currentQuestion: 0,
        score: 0
    };


    showQuestion(
        levelId,
        classId,
        subjectId,
        topicId,
        practiceState
    );
}


// ==============================
// SHOW CURRENT QUESTION
// ==============================

function showQuestion(
    levelId,
    classId,
    subjectId,
    topicId,
    practiceState
) {

    const question =
        practiceState.questions[practiceState.currentQuestion];


    levelsContainer.innerHTML = "";


    // Back button

    const backButton = document.createElement("button");

    backButton.textContent = "← Back";

    backButton.addEventListener("click", () => {
        showLesson(levelId, classId, subjectId, topicId);
    });

    levelsContainer.appendChild(backButton);


    // Progress

    const progress = document.createElement("p");

    progress.textContent =
        `Question ${practiceState.currentQuestion + 1} of ${practiceState.questions.length}`;

    levelsContainer.appendChild(progress);


    // Question

    const questionTitle = document.createElement("h2");

    questionTitle.textContent = question.question;

    levelsContainer.appendChild(questionTitle);


    // Container for options

    const optionsContainer = document.createElement("div");

    levelsContainer.appendChild(optionsContainer);


    let answered = false;


    question.options.forEach((option, optionIndex) => {

        const optionButton = document.createElement("button");

        optionButton.textContent = option;

        optionsContainer.appendChild(optionButton);


        optionButton.addEventListener("click", () => {

            if (answered) {
                return;
            }


            answered = true;


            // Disable every option

            const allOptions =
                optionsContainer.querySelectorAll("button");

            allOptions.forEach(button => {
                button.disabled = true;
            });


            // Check answer

            if (optionIndex === question.answer) {

                practiceState.score++;

                optionButton.textContent =
                    "✓ " + option;

                const resultMessage =
                    document.createElement("p");

                resultMessage.textContent =
                    "Correct! 🎉";

                optionsContainer.appendChild(resultMessage);

            } else {

                optionButton.textContent =
                    "✗ " + option;


                const correctOption =
                    question.options[question.answer];


                const resultMessage =
                    document.createElement("p");

                resultMessage.textContent =
                    `Correct answer: ${correctOption}`;

                optionsContainer.appendChild(resultMessage);
            }


            // Next button

            const nextButton =
                document.createElement("button");

            if (
                practiceState.currentQuestion ===
                practiceState.questions.length - 1
            ) {

                nextButton.textContent =
                    "Finish Practice";

            } else {

                nextButton.textContent =
                    "Next Question →";
            }


            nextButton.addEventListener("click", () => {

                practiceState.currentQuestion++;


                if (
                    practiceState.currentQuestion >=
                    practiceState.questions.length
                ) {

                    showResults(practiceState);

                    return;
                }


                showQuestion(
                    levelId,
                    classId,
                    subjectId,
                    topicId,
                    practiceState
                );
            });


            levelsContainer.appendChild(nextButton);
        });
    });
}


// ==============================
// SHOW RESULTS
// ==============================

function showResults(practiceState) {

    levelsContainer.innerHTML = "";


    const title = document.createElement("h2");

    title.textContent = "Practice Complete 🎉";

    levelsContainer.appendChild(title);


    const score = document.createElement("p");

    score.textContent =
        `Score: ${practiceState.score} / ${practiceState.questions.length}`;

    levelsContainer.appendChild(score);


    const percentage = Math.round(
        (practiceState.score /
            practiceState.questions.length) * 100
    );


    const accuracy = document.createElement("p");

    accuracy.textContent =
        `Accuracy: ${percentage}%`;

    levelsContainer.appendChild(accuracy);


    // Try Again button

    const retryButton = document.createElement("button");

    retryButton.textContent = "Try Again";

    retryButton.addEventListener("click", () => {

        startPractice(
            "primary",
            "primary_1",
            "mathematics",
            "addition"
        );

    });

    levelsContainer.appendChild(retryButton);


    // Back to home

    const homeButton = document.createElement("button");

    homeButton.textContent = "Back to Home";

    homeButton.addEventListener("click", () => {

        location.reload();

    });

    levelsContainer.appendChild(homeButton);
}