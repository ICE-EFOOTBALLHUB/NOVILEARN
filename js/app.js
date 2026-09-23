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