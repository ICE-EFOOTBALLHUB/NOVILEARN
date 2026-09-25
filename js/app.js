// ==============================
// LOAD CORE DATA
// ==============================

const curriculum =
    await fetch("./data/curriculum.json")
        .then(response => response.json());

const subjects =
    await fetch("./data/subjects.json")
        .then(response => response.json());


// ==============================
// GET MAIN ELEMENTS
// ==============================

const levelsContainer =
    document.getElementById("levels");

const progressPage =
    document.getElementById("progress-page");


// ==============================
// CURRENT NAVIGATION
// ==============================

let currentLevelId = null;
let currentClassId = null;
let currentSubjectId = null;
let currentTopicId = null;

// ==============================
// LESSON STATE
// ==============================

let currentLesson = null;
let currentBlockIndex = 0;
let completedBlocks = {};

// ==============================
// SHOW LEVELS
// ==============================

function showLevels() {

    levelsContainer.innerHTML = "";
    progressPage.innerHTML = "";

    const nigeria =
        curriculum.nigeria;

    Object.entries(
        nigeria.levels
    ).forEach(
        ([levelId, level]) => {

            const card =
                document.createElement("div");

            card.className =
                "level-card";

            card.innerHTML = `
                <h3>
                    ${level.name}
                </h3>
            `;

            card.addEventListener(
                "click",
                () => {

                    currentLevelId =
                        levelId;

                    showClasses(
                        levelId
                    );

                }
            );

            levelsContainer.appendChild(
                card
            );

        }
    );

}


// ==============================
// SHOW CLASSES
// ==============================

function showClasses(levelId) {

    levelsContainer.innerHTML = "";

    const level =
        curriculum.nigeria
            .levels[levelId];

    const backButton =
        document.createElement("button");

    backButton.textContent =
        "← Back";

    backButton.addEventListener(
        "click",
        showLevels
    );

    levelsContainer.appendChild(
        backButton
    );

    Object.entries(
        level.classes
    ).forEach(
        ([classId, classData]) => {

            const card =
                document.createElement("div");

            card.className =
                "level-card";

            card.innerHTML = `
                <h3>
                    ${classData.name}
                </h3>
            `;

            card.addEventListener(
                "click",
                () => {

                    currentClassId =
                        classId;

                    showSubjects(
                        levelId,
                        classId
                    );

                }
            );

            levelsContainer.appendChild(
                card
            );

        }
    );

}


// ==============================
// SHOW SUBJECTS
// ==============================

function showSubjects(
    levelId,
    classId
) {

    levelsContainer.innerHTML = "";

    const backButton =
        document.createElement("button");

    backButton.textContent =
        "← Back";

    backButton.addEventListener(
        "click",
        () => {

            showClasses(
                levelId
            );

        }
    );

    levelsContainer.appendChild(
        backButton
    );

    const subjectList =
        subjects[levelId];

    subjectList.forEach(
        subject => {

            const card =
                document.createElement("div");

            card.className =
                "level-card";

            card.innerHTML = `
                <h3>
                    ${subject.name}
                </h3>
            `;

            card.addEventListener(
                "click",
                () => {

                    currentSubjectId =
                        subject.id;

                    showTopics(
                        levelId,
                        classId,
                        subject.id
                    );

                }
            );

            levelsContainer.appendChild(
                card
            );

        }
    );

}


// ==============================
// SHOW TOPICS
// ==============================

async function showTopics(
    levelId,
    classId,
    subjectId
) {

    levelsContainer.innerHTML = "";

    const backButton =
        document.createElement("button");

    backButton.textContent =
        "← Back";

    backButton.addEventListener(
        "click",
        () => {

            showSubjects(
                levelId,
                classId
            );

        }
    );

    levelsContainer.appendChild(
        backButton
    );

    const loading =
        document.createElement("p");

    loading.textContent =
        "Loading topics...";

    levelsContainer.appendChild(
        loading
    );

    try {

        const topicUrl =
    `./data/topics/${currentClassId}/${currentSubjectId}.json`;

        const response =
            await fetch(
                topicUrl
            );

        if (!response.ok) {

            throw new Error(
                "Topic file not found."
            );

        }

        const topics =
            await response.json();

        levelsContainer.innerHTML = "";

        levelsContainer.appendChild(
            backButton
        );

        topics.forEach(
            topic => {

                const card =
                    document.createElement("div");

                card.className =
                    "level-card";

                card.innerHTML = `
                    <h3>
                        ${topic.title}
                    </h3>

                    <p>
                        ${topic.description}
                    </p>
                `;

                card.addEventListener(
                    "click",
                    () => {

                        currentTopicId =
                            topic.id;

                        showLesson(
                            levelId,
                            classId,
                            subjectId,
                            topic.id
                        );

                    }
                );

                levelsContainer.appendChild(
                    card
                );

            }
        );

    } catch (error) {

        levelsContainer.innerHTML = "";

        levelsContainer.appendChild(
            backButton
        );

        const message =
            document.createElement("p");

        message.textContent =
            "Unable to load topics.";

        levelsContainer.appendChild(
            message
        );

        console.error(
            error
        );

    }

}

// ==============================
// SHOW LESSON
// ==============================

async function showLesson(
    levelId,
    classId,
    subjectId,
    topicId
) {

    levelsContainer.innerHTML = "";

    const backButton =
        document.createElement("button");

    backButton.textContent =
        "← Back";

    backButton.addEventListener(
        "click",
        () => {

            showTopics(
                levelId,
                classId,
                subjectId
            );

        }
    );

    levelsContainer.appendChild(
        backButton
    );

    const loading =
        document.createElement("p");

    loading.textContent =
        "Loading lesson...";

    levelsContainer.appendChild(
        loading
    );

    try {

        const lessonUrl =
            `./data/lessons/${classId}/${subjectId}/${topicId}.json`;

        const response =
            await fetch(
                lessonUrl
            );

        if (!response.ok) {

            throw new Error(
                "Lesson file not found."
            );

        }

        const lesson =
            await response.json();

// ==============================
// INITIALIZE LESSON ENGINE
// ==============================

currentLesson = lesson;
currentBlockIndex = 0;
        completedBlocks = {};
        
        levelsContainer.innerHTML = "";

        levelsContainer.appendChild(
            backButton
        );

        const title =
            document.createElement("h2");

        title.textContent =
            lesson.title;

        levelsContainer.appendChild(
            title
        );

        const description =
            document.createElement("p");

        description.textContent =
            lesson.description;

        levelsContainer.appendChild(
            description
        );

// ==============================
// RENDER CURRENT LESSON BLOCK
// ==============================

function renderCurrentLessonBlock() {

    const block =
        currentLesson.blocks[
            currentBlockIndex
        ];

    levelsContainer.innerHTML = "";

    const blockElement =
        document.createElement("div");

    blockElement.className =
        "lesson-section";


    // ==============================
    // HEADING
    // ==============================

    if (
        block.type === "heading"
    ) {

        blockElement.innerHTML = `
            <h3>
                ${block.content}
            </h3>
        `;

    }


    // ==============================
    // TEXT
    // ==============================

    if (
        block.type === "text"
    ) {

        blockElement.innerHTML = `
            <p>
                ${block.content}
            </p>
        `;

    }


    // ==============================
    // EXAMPLE
    // ==============================

    if (
        block.type === "example"
    ) {

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Example"}
            </h3>

            <p>
                ${block.content}
            </p>
        `;

    }


    // ==============================
    // WORKED EXAMPLE
    // ==============================

    if (
        block.type === "workedExample"
    ) {

        let stepsHTML = "";

        block.content.steps.forEach(
            step => {

                stepsHTML += `
                    <p>
                        <strong>
                            Step ${step.step}:
                        </strong>

                        ${step.content}
                    </p>
                `;

            }
        );

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Worked Example"}
            </h3>

            ${stepsHTML}
        `;

    }

    // ==============================
// QUIZ
// ==============================

if (
    block.type === "quiz"
) {

    blockElement.innerHTML = `
        <h3>
            ${block.title || "Quiz"}
        </h3>

        <button id="lesson-quiz-start">
            Start Quiz
        </button>
    `;

    const quizButton =
        document.getElementById(
            "lesson-quiz-start"
        );

    quizButton.addEventListener(
        "click",
        () => {

            startQuiz(
                block.content.quizId,
                currentLevelId,
                currentClassId,
                currentSubjectId,
                currentTopicId
            );

        }
    );

}

    // ==============================
    // SUMMARY
    // ==============================

    if (
        block.type === "summary"
    ) {

        let summaryHTML = "";

        block.content.forEach(
            point => {

                summaryHTML += `
                    <li>
                        ${point}
                    </li>
                `;

            }
        );

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Summary"}
            </h3>

            <ul>
                ${summaryHTML}
            </ul>
        `;

    }


    levelsContainer.appendChild(
        blockElement
    );


    // ==============================
    // NAVIGATION
    // ==============================

    const navigation =
        document.createElement("div");

    navigation.innerHTML = `
        <button id="lesson-back">
            Back
        </button>

        <button id="lesson-next">
            Next
        </button>
    `;

    levelsContainer.appendChild(
        navigation
    );


    const backButton =
        document.getElementById(
            "lesson-back"
        );

    const nextButton =
        document.getElementById(
            "lesson-next"
        );


    backButton.disabled =
        currentBlockIndex === 0;


    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentBlockIndex <
                currentLesson.blocks.length - 1
            ) {

                currentBlockIndex++;

                renderCurrentLessonBlock();

            }

        }
    );


    backButton.addEventListener(
        "click",
        () => {

            if (
                currentBlockIndex > 0
            ) {

                currentBlockIndex--;

                renderCurrentLessonBlock();

            }

        }
    );

                }

// ==============================
// START LESSON ENGINE
// ==============================

renderCurrentLessonBlock();

return;
        
        lesson.blocks.forEach(
    block => {

        const blockElement =
            document.createElement("div");

        blockElement.className =
            "lesson-section";


        // ==============================
        // HEADING
        // ==============================

        if (
            block.type === "heading"
        ) {

            blockElement.innerHTML = `
                <h3>
                    ${block.content}
                </h3>
            `;

        }


        // ==============================
        // TEXT
        // ==============================

        if (
            block.type === "text"
        ) {

            blockElement.innerHTML = `
                <p>
                    ${block.content}
                </p>
            `;

        }


        // ==============================
        // EXAMPLE
        // ==============================

        if (
            block.type === "example"
        ) {

            blockElement.innerHTML = `
                <h3>
                    ${block.title || "Example"}
                </h3>

                <p>
                    ${block.content}
                </p>
            `;

        }


        // ==============================
        // WORKED EXAMPLE
        // ==============================

        if (
            block.type === "workedExample"
        ) {

            let stepsHTML = "";

            block.content.steps.forEach(
                step => {

                    stepsHTML += `
                        <p>
                            <strong>
                                Step ${step.step}:
                            </strong>

                            ${step.content}
                        </p>
                    `;

                }
            );

            blockElement.innerHTML = `
                <h3>
                    ${block.title || "Worked Example"}
                </h3>

                ${stepsHTML}
            `;

        }


        // ==============================
        // SUMMARY
        // ==============================

        if (
            block.type === "summary"
        ) {

            let summaryHTML = "";

            block.content.forEach(
                point => {

                    summaryHTML += `
                        <li>
                            ${point}
                        </li>
                    `;

                }
            );

            blockElement.innerHTML = `
                <h3>
                    ${block.title || "Summary"}
                </h3>

                <ul>
                    ${summaryHTML}
                </ul>
            `;

        }

        // ==============================
// QUIZ
// ==============================

if (
    block.type === "quiz"
) {

    blockElement.innerHTML = `
        <h3>
            ${block.title || "Quiz"}
        </h3>

        <button>
            Start Quiz
        </button>
    `;

    const quizButton =
        blockElement.querySelector("button");

    quizButton.addEventListener(
        "click",
        () => {

            startQuiz(
                block.content.quizId,
                levelId,
                classId,
                subjectId,
                topicId
            );

        }
    );

}

        levelsContainer.appendChild(
            blockElement
        );

    }
);
        const practiceButton =
            document.createElement(
                "button"
            );

        practiceButton.textContent =
            "Practice Questions";

        practiceButton.addEventListener(
            "click",
            () => {

                startPractice(
                    levelId,
                    classId,
                    subjectId,
                    topicId
                );

            }
        );

        levelsContainer.appendChild(
            practiceButton
        );

    } catch (error) {

        levelsContainer.innerHTML = `
            <p>
                Unable to load lesson.
            </p>
        `;

        console.error(
            error
        );

    }

}

// ==============================
// START PRACTICE
// ==============================

// ==============================
// START LESSON QUIZ
// ==============================

async function startQuiz(
    quizId,
    levelId,
    classId,
    subjectId,
    topicId
) {

    levelsContainer.innerHTML = "";

    const loading =
        document.createElement("p");

    loading.textContent =
        "Loading quiz...";

    levelsContainer.appendChild(
        loading
    );

    try {

        const quizUrl =
            `./data/questions/${classId}/${subjectId}/${topicId}.json`;

        const response =
            await fetch(
                quizUrl
            );

        if (!response.ok) {

            throw new Error(
                "Quiz file not found."
            );

        }

        const quiz =
            await response.json();

        if (
            quiz.quizId !== quizId
        ) {

            throw new Error(
                "Quiz ID does not match."
            );

        }

        levelsContainer.innerHTML = "";

        const title =
            document.createElement("h2");

        title.textContent =
            quiz.title;

        levelsContainer.appendChild(
            title
        );

        const info =
            document.createElement("p");

        info.textContent =
            `${quiz.questions.length} questions`;

        levelsContainer.appendChild(
            info
        );

        quiz.questions.forEach(
            (question, index) => {

                const questionElement =
                    document.createElement("div");

                questionElement.className =
                    "lesson-section";

                questionElement.innerHTML = `
                    <h3>
                        Question ${index + 1}
                    </h3>

                    <p>
                        ${question.question}
                    </p>
                `;

                levelsContainer.appendChild(
                    questionElement
                );

            }
        );

    } catch (error) {

        levelsContainer.innerHTML = `
            <p>
                Unable to load quiz.
            </p>
        `;

        console.error(
            error
        );

    }

}

async function startPractice(
    levelId,
    classId,
    subjectId,
    topicId
) {

    levelsContainer.innerHTML = "";

    const loading =
        document.createElement("p");

    loading.textContent =
        "Loading questions...";

    levelsContainer.appendChild(
        loading
    );

    try {

        const questionUrl =
            `./data/questions/${classId}/${subjectId}/${topicId}.json`;

        const response =
            await fetch(
                questionUrl
            );

        if (!response.ok) {

            throw new Error(
                "Question file not found."
            );

        }

        const questions =
            await response.json();

        let currentQuestion = 0;
        let score = 0;
        let answered = false;

        function showQuestion() {

            levelsContainer.innerHTML = "";

            if (
                currentQuestion >=
                questions.length
            ) {

                showResults(
                    levelId,
                    classId,
                    subjectId,
                    topicId,
                    score,
                    questions.length
                );

                return;

            }

            const question =
                questions[
                    currentQuestion
                ];

            const questionNumber =
                document.createElement("p");

            questionNumber.textContent =
                `Question ${
                    currentQuestion + 1
                } of ${
                    questions.length
                }`;

            levelsContainer.appendChild(
                questionNumber
            );

            const questionTitle =
                document.createElement("h2");

            questionTitle.textContent =
                question.question;

            levelsContainer.appendChild(
                questionTitle
            );

            const optionsContainer =
                document.createElement("div");

            question.options.forEach(
                (option, index) => {

                    const button =
                        document.createElement("button");

                    button.textContent =
                        option;

                    button.addEventListener(
                        "click",
                        () => {

                            if (answered) {
                                return;
                            }

                            answered = true;

                            const buttons =
                                optionsContainer
                                    .querySelectorAll(
                                        "button"
                                    );

                            buttons.forEach(
                                btn => {
                                    btn.disabled =
                                        true;
                                }
                            );

                            if (
                                index ===
                                question.answer
                            ) {

                                score++;

                                button.textContent =
                                    `✓ ${option}`;

                            } else {

                                button.textContent =
                                    `✗ ${option}`;

                                buttons[
                                    question.answer
                                ].textContent =
                                    `✓ ${question.options[
                                        question.answer
                                    ]}`;

                            }

                            const nextButton =
                                document.createElement(
                                    "button"
                                );

                            nextButton.textContent =
                                currentQuestion ===
                                questions.length - 1
                                    ? "See Results"
                                    : "Next Question";

                            nextButton.addEventListener(
                                "click",
                                () => {

                                    currentQuestion++;

                                    answered =
                                        false;

                                    showQuestion();

                                }
                            );

                            levelsContainer.appendChild(
                                nextButton
                            );

                        }
                    );

                    optionsContainer.appendChild(
                        button
                    );

                }
            );

            levelsContainer.appendChild(
                optionsContainer
            );

        }

        showQuestion();

    } catch (error) {

        levelsContainer.innerHTML = `
            <p>
                Unable to load questions.
            </p>
        `;

        console.error(
            error
        );

    }

}


// ==============================
// SAVE PROGRESS
// ==============================

function saveProgress(
    levelId,
    classId,
    subjectId,
    topicId,
    score,
    totalQuestions
) {

    const storageKey =
        "novilearn_progress";

    const existing =
        JSON.parse(
            localStorage.getItem(
                storageKey
            )
        ) || {};

    const topicKey =
        `${levelId}_${classId}_${subjectId}_${topicId}`;

    const accuracy =
        Math.round(
            (score / totalQuestions) *
            100
        );

    if (!existing[topicKey]) {

        existing[topicKey] = {
            levelId,
            classId,
            subjectId,
            topicId,
            attempts: 0,
            lastScore: 0,
            bestScore: 0,
            totalQuestions,
            lastAccuracy: 0,
            bestAccuracy: 0
        };

    }

    const progress =
        existing[topicKey];

    progress.attempts++;

    progress.lastScore =
        score;

    progress.lastAccuracy =
        accuracy;

    progress.bestScore =
        Math.max(
            progress.bestScore,
            score
        );

    progress.bestAccuracy =
        Math.max(
            progress.bestAccuracy,
            accuracy
        );

    progress.totalQuestions =
        totalQuestions;

    localStorage.setItem(
        storageKey,
        JSON.stringify(existing)
    );

}


// ==============================
// SHOW RESULTS
// ==============================

function showResults(
    levelId,
    classId,
    subjectId,
    topicId,
    score,
    totalQuestions
) {

    saveProgress(
        levelId,
        classId,
        subjectId,
        topicId,
        score,
        totalQuestions
    );

    levelsContainer.innerHTML = "";

    const accuracy =
        Math.round(
            (score / totalQuestions) *
            100
        );

    const result =
        document.createElement("div");

    result.innerHTML = `
        <h2>
            Practice Complete!
        </h2>

        <p>
            Score:
            <strong>
                ${score}/${totalQuestions}
            </strong>
        </p>

        <p>
            Accuracy:
            <strong>
                ${accuracy}%
            </strong>
        </p>
    `;

    levelsContainer.appendChild(
        result
    );

    const retryButton =
        document.createElement("button");

    retryButton.textContent =
        "Try Again";

    retryButton.addEventListener(
        "click",
        () => {

            startPractice(
                levelId,
                classId,
                subjectId,
                topicId
            );

        }
    );

    levelsContainer.appendChild(
        retryButton
    );

    const backButton =
        document.createElement("button");

    backButton.textContent =
        "Back to Lesson";

    backButton.addEventListener(
        "click",
        () => {

            showLesson(
                levelId,
                classId,
                subjectId,
                topicId
            );

        }
    );

    levelsContainer.appendChild(
        backButton
    );

}


// ==============================
// SHOW PROGRESS
// ==============================

function showProgress() {

    levelsContainer.innerHTML = "";

    progressPage.innerHTML = "";

    const progress =
        JSON.parse(
            localStorage.getItem(
                "novilearn_progress"
            )
        ) || {};

    const entries =
        Object.values(
            progress
        );

    const title =
        document.createElement("h2");

    title.textContent =
        "My Progress";

    progressPage.appendChild(
        title
    );

    if (
        entries.length === 0
    ) {

        progressPage.innerHTML += `
            <p>
                You haven't practiced any topics yet.
            </p>
        `;

        return;

    }

    const totalAttempts =
        entries.reduce(
            (sum, item) =>
                sum + item.attempts,
            0
        );

    const bestAccuracy =
        Math.max(
            ...entries.map(
                item =>
                    item.bestAccuracy
            )
        );

    progressPage.innerHTML += `
        <div class="lesson-section">

            <h3>
                Overview
            </h3>

            <p>
                Topics practiced:
                <strong>
                    ${entries.length}
                </strong>
            </p>

            <p>
                Total attempts:
                <strong>
                    ${totalAttempts}
                </strong>
            </p>

            <p>
                Best accuracy:
                <strong>
                    ${bestAccuracy}%
                </strong>
            </p>

        </div>
    `;

    entries.forEach(
        progress => {

            const card =
                document.createElement("div");

            card.className =
                "lesson-section";

            card.innerHTML = `
                <h3>
                    ${getTopicName(
                        progress.levelId,
                        progress.classId,
                        progress.subjectId,
                        progress.topicId
                    )}
                </h3>

                <p>
                    Subject:
                    <strong>
                        ${getSubjectName(
                            progress.subjectId
                        )}
                    </strong>
                </p>

                <p>
                    Best score:
                    <strong>
                        ${progress.bestScore}/${
                            progress.totalQuestions
                        }
                    </strong>
                </p>

                <p>
                    Best accuracy:
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

        }
    );

}


// ==============================
// GET SUBJECT NAME
// ==============================

function getSubjectName(
    subjectId
) {

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

    if (
        classId === "primary_1" &&
        subjectId === "mathematics" &&
        topicId === "addition"
    ) {

        return "Introduction to Addition";

    }

    return topicId;

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


// ==============================
// START APP
// ==============================

showLevels();
