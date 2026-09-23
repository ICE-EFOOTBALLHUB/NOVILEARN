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

        startPractice(
            levelId,
            classId,
            subjectId,
            topicId
        );

    });

    levelsContainer.appendChild(practiceButton);
}


// ==============================
// START PRACTICE
// ==============================

async function startPractice(
    levelId,
    classId,
    subjectId,
    topicId
) {

    try {

        const response = await fetch(
            `./data/questions/${classId}/${subjectId}/${topicId}.json`
        );


        if (!response.ok) {

            throw new Error(
                "Questions could not be loaded."
            );

        }


        const questionList =
            await response.json();


        if (
            !questionList ||
            questionList.length === 0
        ) {

            levelsContainer.innerHTML = `
                <p>No practice questions available yet.</p>
            `;

            return;
        }


        const practiceState = {

            levelId: levelId,

            classId: classId,

            subjectId: subjectId,

            topicId: topicId,

            questions: questionList,

            currentQuestion: 0,

            score: 0

        };


        showQuestion(practiceState);


    } catch (error) {

        console.error(error);


        levelsContainer.innerHTML = `
            <p>
                Unable to load practice questions.
                Please try again.
            </p>
        `;

    }

}


// ==============================
// SHOW CURRENT QUESTION
// ==============================

function showQuestion(practiceState) {

    const question =
        practiceState.questions[
            practiceState.currentQuestion
        ];


    levelsContainer.innerHTML = "";


    // Back button

    const backButton = document.createElement("button");

    backButton.textContent = "← Back";

    backButton.addEventListener("click", () => {

        showLesson(
            practiceState.levelId,
            practiceState.classId,
            practiceState.subjectId,
            practiceState.topicId
        );

    });

    levelsContainer.appendChild(backButton);


    // Progress

    const progress = document.createElement("p");

    progress.textContent =
        `Question ${
            practiceState.currentQuestion + 1
        } of ${
            practiceState.questions.length
        }`;

    levelsContainer.appendChild(progress);


    // Question

    const questionTitle = document.createElement("h2");

    questionTitle.textContent = question.question;

    levelsContainer.appendChild(questionTitle);


    // Options

    const optionsContainer = document.createElement("div");

    levelsContainer.appendChild(optionsContainer);


    let answered = false;


    question.options.forEach((option, optionIndex) => {

        const optionButton =
            document.createElement("button");

        optionButton.textContent = option;

        optionsContainer.appendChild(optionButton);


        optionButton.addEventListener("click", () => {

            if (answered) {
                return;
            }


            answered = true;


            // Disable all options

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

                optionsContainer.appendChild(
                    resultMessage
                );

            } else {

                optionButton.textContent =
                    "✗ " + option;


                const correctOption =
                    question.options[
                        question.answer
                    ];


                const resultMessage =
                    document.createElement("p");

                resultMessage.textContent =
                    `Correct answer: ${correctOption}`;

                optionsContainer.appendChild(
                    resultMessage
                );

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


                showQuestion(practiceState);

            });


            levelsContainer.appendChild(nextButton);

        });

    });

}


// ==============================
// SAVE PROGRESS
// ==============================

function saveProgress(practiceState) {

    const progressKey =
        "novilearn_progress";


    const savedProgress =
        JSON.parse(
            localStorage.getItem(progressKey)
        ) || {};


    const topicKey =
        `${practiceState.levelId}_${practiceState.classId}_${practiceState.subjectId}_${practiceState.topicId}`;


    const totalQuestions =
        practiceState.questions.length;


    const score =
        practiceState.score;


    const percentage =
        Math.round(
            (score / totalQuestions) * 100
        );


    const existing =
        savedProgress[topicKey];


    if (!existing) {

        savedProgress[topicKey] = {

            levelId:
                practiceState.levelId,

            classId:
                practiceState.classId,

            subjectId:
                practiceState.subjectId,

            topicId:
                practiceState.topicId,

            attempts: 1,

            lastScore:
                score,

            bestScore:
                score,

            totalQuestions:
                totalQuestions,

            lastAccuracy:
                percentage,

            bestAccuracy:
                percentage

        };

    } else {

        existing.attempts++;

        existing.lastScore =
            score;

        existing.lastAccuracy =
            percentage;


        if (
            score >
            existing.bestScore
        ) {

            existing.bestScore =
                score;

        }


        if (
            percentage >
            existing.bestAccuracy
        ) {

            existing.bestAccuracy =
                percentage;

        }

    }


    localStorage.setItem(
        progressKey,
        JSON.stringify(savedProgress)
    );

}


// ==============================
// SHOW RESULTS
// ==============================

function showResults(practiceState) {

    // Save completed practice

    saveProgress(practiceState);


    levelsContainer.innerHTML = "";


    const totalQuestions =
        practiceState.questions.length;


    const score =
        practiceState.score;


    const percentage =
        Math.round(
            (score / totalQuestions) * 100
        );


    // Title

    const title =
        document.createElement("h2");

    title.textContent =
        "Practice Complete 🎉";

    levelsContainer.appendChild(title);


    // Score

    const scoreText =
        document.createElement("p");

    scoreText.textContent =
        `Score: ${score} / ${totalQuestions}`;

    levelsContainer.appendChild(scoreText);


    // Accuracy

    const accuracyText =
        document.createElement("p");

    accuracyText.textContent =
        `Accuracy: ${percentage}%`;

    levelsContainer.appendChild(
        accuracyText
    );


    // Performance message

    const performance =
        document.createElement("p");


    if (percentage === 100) {

        performance.textContent =
            "Perfect score! Excellent work! 🌟";

    } else if (percentage >= 70) {

        performance.textContent =
            "Great work! Keep it up! 👏";

    } else if (percentage >= 50) {

        performance.textContent =
            "Good attempt! A little more practice will help.";

    } else {

        performance.textContent =
            "Keep practicing. You’ll get there! 💪";

    }


    levelsContainer.appendChild(
        performance
    );


    // Try Again

    const retryButton =
        document.createElement("button");

    retryButton.textContent =
        "Try Again";


    retryButton.addEventListener("click", () => {

        startPractice(
            practiceState.levelId,
            practiceState.classId,
            practiceState.subjectId,
            practiceState.topicId
        );

    });


    levelsContainer.appendChild(
        retryButton
    );


    // Back to Lesson

    const lessonButton =
        document.createElement("button");

    lessonButton.textContent =
        "Back to Lesson";


    lessonButton.addEventListener("click", () => {

        showLesson(
            practiceState.levelId,
            practiceState.classId,
            practiceState.subjectId,
            practiceState.topicId
        );

    });


    levelsContainer.appendChild(
        lessonButton
    );


    // Back to Home

    const homeButton =
        document.createElement("button");

    homeButton.textContent =
        "Back to Home";


    homeButton.addEventListener("click", () => {

        location.reload();

    });


    levelsContainer.appendChild(
        homeButton
    );

}


// ==============================
// SHOW PROGRESS
// ==============================

function showProgress() {

    levelsContainer.innerHTML = "";


    const progressPage =
        document.getElementById("progress-page");

    progressPage.innerHTML = "";


    const backButton =
        document.createElement("button");

    backButton.textContent =
        "← Back";


    backButton.addEventListener("click", () => {

        progressPage.innerHTML = "";

        location.reload();

    });


    progressPage.appendChild(
        backButton
    );


    const title =
        document.createElement("h2");

    title.textContent =
        "My Progress";


    progressPage.appendChild(
        title
    );


    const savedProgress =
        JSON.parse(
            localStorage.getItem(
                "novilearn_progress"
            )
        ) || {};


    const progressEntries =
        Object.values(savedProgress);


    // No progress

    if (progressEntries.length === 0) {

        const message =
            document.createElement("p");

        message.textContent =
            "You haven't completed any practice yet.";

        progressPage.appendChild(
            message
        );

        return;
    }


    // ==============================
    // SUMMARY
    // ==============================

    let totalAttempts = 0;

    let highestAccuracy = 0;


    progressEntries.forEach(progress => {

        totalAttempts +=
            progress.attempts;


        if (
            progress.bestAccuracy >
            highestAccuracy
        ) {

            highestAccuracy =
                progress.bestAccuracy;

        }

    });


    const summary =
        document.createElement("div");

    summary.className =
        "lesson-section";


    summary.innerHTML = `
        <h3>Overview</h3>

        <p>
            Topics Practiced:
            <strong>
                ${progressEntries.length}
            </strong>
        </p>

        <p>
            Total Attempts:
            <strong>
                ${totalAttempts}
            </strong>
        </p>

        <p>
            Best Accuracy:
            <strong>
                ${highestAccuracy}%
            </strong>
        </p>
    `;


    progressPage.appendChild(
        summary
    );


    // ==============================
    // TOPIC PROGRESS
    // ==============================

    progressEntries.forEach(progress => {

        const card =
            document.createElement("div");

        card.className =
            "lesson-section";


        const subjectName =
            getSubjectName(
                progress.subjectId
            );


        const className =
            nigeria.levels[
                progress.levelId
            ]?.classes[
                progress.classId
            ]?.name ||
            progress.classId;


        const topicName =
            getTopicName(
                progress.levelId,
                progress.classId,
                progress.subjectId,
                progress.topicId
            );


        card.innerHTML = `
            <h3>${topicName}</h3>

            <p>
                ${subjectName} • ${className}
            </p>

            <p>
                Best Score:
                <strong>
                    ${progress.bestScore}
                    /
                    ${progress.totalQuestions}
                </strong>
            </p>

            <p>
                Best Accuracy:
                <strong>
                    ${progress.bestAccuracy}%
                </strong>
            </p>

            <p>
                Attempts:
                <strong>
                                        ${progress.attempts}
                </strong>
            </p>
        `;


        progressPage.appendChild(
            card
        );

    });

}


// ==============================
// GET SUBJECT NAME
// ==============================

function getSubjectName(subjectId) {

    const allSubjects =
        subjects.primary
            .concat(
                subjects.junior_secondary
            )
            .concat(
                subjects.senior_secondary
            );


    const subject =
        allSubjects.find(
            item =>
                item.id === subjectId
        );


    return subject
        ? subject.name
        : subjectId;

}


// ==============================
// GET TOPIC NAME
// ==============================

function getTopicName(
    levelId,
    classId,
    subjectId,
    topicId
) {

    const topic =
        lessons.nigeria
            ?.[levelId]
            ?.[classId]
            ?.[subjectId]
            ?.[topicId];


    return topic
        ? topic.title
        : topicId;

}


// ==============================
// PROGRESS BUTTON
// ==============================

document
    .getElementById("progress-button")
    .addEventListener(
        "click",
        () => {

            showProgress();

        }
    );


// ==============================
// TEMPORARY PROGRESS TEST
// ==============================

const testProgressButton =
    document.getElementById(
        "test-progress"
    );


if (testProgressButton) {

    testProgressButton.addEventListener(
        "click",
        () => {

            const progress =
                localStorage.getItem(
                    "novilearn_progress"
                );


            document.getElementById(
                "progress-output"
            ).textContent =
                progress ||
                "No progress saved yet.";

        }
    );

}