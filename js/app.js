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

function showTopics(
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

    const topicData =
        lessons.nigeria
            ?.[levelId]
            ?.[classId]
            ?.[subjectId];

    if (!topicData) {

        const message =
            document.createElement("p");

        message.textContent =
            "No topics available yet.";

        levelsContainer.appendChild(
            message
        );

        return;

    }

    Object.entries(
        topicData
    ).forEach(
        ([topicId, topic]) => {

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
                        topicId;

                    showLesson(
                        levelId,
                        classId,
                        subjectId,
                        topicId
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

        lesson.content.forEach(
            section => {

                const sectionElement =
                    document.createElement(
                        "div"
                    );

                sectionElement.className =
                    "lesson-section";

                if (
                    section.type ===
                    "text"
                ) {

                    sectionElement.innerHTML = `
                        <h3>
                            ${section.title}
                        </h3>

                        <p>
                            ${section.body}
                        </p>
                    `;

                }

                if (
                    section.type ===
                    "example"
                ) {

                    sectionElement.innerHTML = `
                        <h3>
                            Example
                        </h3>

                        <p>
                            ${section.question}
                        </p>

                        <strong>
                            Answer:
                            ${section.answer}
                        </strong>
                    `;

                }

                levelsContainer.appendChild(
                    sectionElement
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