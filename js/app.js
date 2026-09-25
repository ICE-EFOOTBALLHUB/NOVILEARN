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
let renderCurrentLessonBlock = null;

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

renderCurrentLessonBlock = function() {

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
    // KEY POINT
    // ==============================

    if (
        block.type === "keyPoint"
    ) {

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Key Point"}
            </h3>

            <p>
                ${block.content}
            </p>
        `;

    }


    // ==============================
    // FORMULA
    // ==============================

    if (
        block.type === "formula"
    ) {

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Formula"}
            </h3>

            <p class="lesson-formula">
                ${block.content}
            </p>
        `;

    }


    // ==============================
    // TABLE
    // ==============================

    if (
        block.type === "table"
    ) {

        let tableHTML = "";

        if (
            block.content &&
            Array.isArray(block.content.headers) &&
            Array.isArray(block.content.rows)
        ) {

            const headersHTML =
                block.content.headers
                    .map(header => `<th>${header}</th>`)
                    .join("");

            const rowsHTML =
                block.content.rows
                    .map(row => `
                        <tr>
                            ${row
                                .map(cell => `<td>${cell}</td>`)
                                .join("")}
                        </tr>
                    `)
                    .join("");

            tableHTML = `
                <table class="lesson-table">
                    <thead>
                        <tr>${headersHTML}</tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>
            `;

        }

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Table"}
            </h3>

            ${tableHTML}
        `;

    }


    // ==============================
    // COMPARISON
    // ==============================

    if (
        block.type === "comparison"
    ) {

        let comparisonHTML = "";

        if (
            block.content &&
            Array.isArray(block.content.items)
        ) {

            comparisonHTML = block.content.items
                .map(item => `
                    <div class="lesson-comparison-item">
                        <h4>${item.title || ""}</h4>
                        <p>${item.content || ""}</p>
                    </div>
                `)
                .join("");

        }

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Comparison"}
            </h3>

            <div class="lesson-comparison">
                ${comparisonHTML}
            </div>
        `;

    }


    // ==============================
    // IMAGE
    // ==============================

    if (
        block.type === "image"
    ) {

        const imageContent =
            block.content || {};

        const captionHTML =
            imageContent.caption
                ? `<figcaption>${imageContent.caption}</figcaption>`
                : "";

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Image"}
            </h3>

            <figure class="lesson-image">
                <img
                    src="${imageContent.src || ""}"
                    alt="${imageContent.alt || ""}"
                >
                ${captionHTML}
            </figure>
        `;

    }


    // ==============================
    // DIAGRAM
    // ==============================

    if (
        block.type === "diagram"
    ) {

        const diagramContent =
            block.content || {};

        const captionHTML =
            diagramContent.caption
                ? `<figcaption>${diagramContent.caption}</figcaption>`
                : "";

        const descriptionHTML =
            diagramContent.description
                ? `<p class="lesson-diagram-description">${diagramContent.description}</p>`
                : "";

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Diagram"}
            </h3>

            <figure class="lesson-diagram">
                <img
                    src="${diagramContent.src || ""}"
                    alt="${diagramContent.alt || ""}"
                >
                ${captionHTML}
            </figure>

            ${descriptionHTML}
        `;

    }


    // ==============================
    // VIDEO
    // ==============================

    if (
        block.type === "video"
    ) {

        const videoContent =
            block.content || {};

        const descriptionHTML =
            videoContent.description
                ? `<p class="lesson-video-description">${videoContent.description}</p>`
                : "";

        const downloadHTML =
            videoContent.downloadable !== false && videoContent.src
                ? `<a class="lesson-video-download" href="${videoContent.src}" download target="_blank" rel="noopener">Download Video</a>`
                : "";

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Video"}
            </h3>

            ${descriptionHTML}

            <div class="lesson-video" data-video-src="${videoContent.src || ""}" data-video-type="${videoContent.mimeType || "video/mp4"}">
                <p class="lesson-video-data-note">
                    This video will not load until you choose to play it.
                </p>
                <button type="button" class="lesson-video-load">
                    Play Video
                </button>
                ${downloadHTML}
            </div>
        `;

        const videoContainer =
            blockElement.querySelector(".lesson-video");

        const loadVideoButton =
            blockElement.querySelector(".lesson-video-load");

        if (loadVideoButton && videoContent.src) {
            loadVideoButton.addEventListener("click", () => {
                videoContainer.innerHTML = `
                    <video class="lesson-video-player" controls preload="metadata">
                        <source src="${videoContent.src}" type="${videoContent.mimeType || "video/mp4"}">
                        Your browser does not support HTML video.
                    </video>
                    ${downloadHTML}
                `;
            });
        }

    }


    // ==============================
    // AUDIO
    // ==============================

    if (
        block.type === "audio"
    ) {

        const audioContent =
            block.content || {};

        const descriptionHTML =
            audioContent.description
                ? `<p class="lesson-audio-description">${audioContent.description}</p>`
                : "";

        const transcriptHTML =
            audioContent.transcript
                ? `<details class="lesson-audio-transcript"><summary>Transcript</summary><p>${audioContent.transcript}</p></details>`
                : "";

        const downloadHTML =
            audioContent.downloadable !== false && audioContent.src
                ? `<a class="lesson-audio-download" href="${audioContent.src}" download target="_blank" rel="noopener">Download Audio</a>`
                : "";

        blockElement.innerHTML = `
            <h3>
                ${block.title || "Audio"}
            </h3>

            ${descriptionHTML}

            <div class="lesson-audio">
                <p class="lesson-audio-data-note">
                    This audio will not load until you choose to play it.
                </p>
                <button type="button" class="lesson-audio-load">
                    Play Audio
                </button>
                ${downloadHTML}
            </div>

            ${transcriptHTML}
        `;

        const audioContainer =
            blockElement.querySelector(".lesson-audio");

        const loadAudioButton =
            blockElement.querySelector(".lesson-audio-load");

        if (loadAudioButton && audioContent.src) {
            loadAudioButton.addEventListener("click", () => {
                audioContainer.innerHTML = `
                    <audio class="lesson-audio-player" controls preload="metadata">
                        <source src="${audioContent.src}" type="${audioContent.mimeType || "audio/mpeg"}">
                        Your browser does not support HTML audio.
                    </audio>
                    ${downloadHTML}
                `;
            });
        }

    }


    // ==============================
    // ANIMATION
    // ==============================

    if (
        block.type === "animation"
    ) {

        const animationContent = block.content || {};
        const startValue = Number.isFinite(Number(animationContent.startValue))
            ? Number(animationContent.startValue)
            : 2;
        const changeValue = Number.isFinite(Number(animationContent.changeValue))
            ? Number(animationContent.changeValue)
            : 3;
        const resultValue = startValue + changeValue;

        // Always include 0 and leave a little room around the values used.
        const minimum = Math.min(0, startValue, resultValue) - (resultValue < 0 ? 1 : 0);
        const maximum = Math.max(0, startValue, resultValue) + 1;
        const lineValues = [];
        for (let value = minimum; value <= maximum; value++) {
            lineValues.push(value);
        }

        const descriptionHTML = animationContent.description
            ? `<p class="lesson-animation-description">${animationContent.description}</p>`
            : "";

        blockElement.innerHTML = `
            <h3>${block.title || "Animation"}</h3>
            ${descriptionHTML}

            <div class="lesson-animation">
                <div class="lesson-animation-stage" aria-label="${animationContent.alt || "Educational animation"}">
                    <div class="lesson-animation-operation" aria-live="polite"></div>
                    <div class="lesson-animation-number-line">
                        ${lineValues.map(value => `<span class="lesson-animation-tick" data-value="${value}">${value}</span>`).join("")}
                        <div class="lesson-animation-marker" aria-hidden="true">●</div>
                    </div>
                    <p class="lesson-animation-equation" aria-live="polite"></p>
                </div>

                <div class="lesson-animation-controls">
                    <button type="button" class="lesson-animation-play">Play</button>
                    <button type="button" class="lesson-animation-pause">Pause</button>
                    <button type="button" class="lesson-animation-restart">Restart</button>
                </div>
            </div>
        `;

        const line = blockElement.querySelector(".lesson-animation-number-line");
        const marker = blockElement.querySelector(".lesson-animation-marker");
        const operation = blockElement.querySelector(".lesson-animation-operation");
        const equation = blockElement.querySelector(".lesson-animation-equation");
        const playButton = blockElement.querySelector(".lesson-animation-play");
        const pauseButton = blockElement.querySelector(".lesson-animation-pause");
        const restartButton = blockElement.querySelector(".lesson-animation-restart");

        if (line && marker && operation && equation && playButton && pauseButton && restartButton) {
            let animationFrame = null;
            let running = false;
            let paused = false;
            let segmentIndex = 0;
            let segmentProgress = 0;
            let lastTimestamp = null;

            const movementSegments = [];

            // Treat reaching the starting value and applying the operation as
            // two visibly separate mathematical phases. Every movement is one
            // number-line unit so the marker demonstrates the count itself.
            if (startValue !== 0) {
                const startDirection = startValue > 0 ? 1 : -1;
                for (let step = 0; step < Math.abs(startValue); step++) {
                    movementSegments.push({
                        type: "move",
                        from: step * startDirection,
                        to: (step + 1) * startDirection,
                        label: `${startValue >= 0 ? "+" : ""}${startValue}`,
                        duration: 550
                    });
                }

                // Hold on the starting value so the learner can see that the
                // first operation has finished before the next one begins.
                movementSegments.push({
                    type: "wait",
                    at: startValue,
                    label: `${startValue >= 0 ? "+" : ""}${startValue}`,
                    duration: 850
                });
            }

            const direction = changeValue >= 0 ? 1 : -1;
            if (changeValue !== 0) {
                // Briefly introduce the second operation before its jumps.
                movementSegments.push({
                    type: "wait",
                    at: startValue,
                    label: `${changeValue >= 0 ? "+" : ""}${changeValue}`,
                    duration: 450
                });

                for (let step = 0; step < Math.abs(changeValue); step++) {
                    movementSegments.push({
                        type: "move",
                        from: startValue + (step * direction),
                        to: startValue + ((step + 1) * direction),
                        label: `${changeValue >= 0 ? "+" : ""}${changeValue}`,
                        duration: 550
                    });
                }
            }

            const getTickCenter = value => {
                const tick = line.querySelector(`[data-value="${value}"]`);
                if (!tick) return 0;
                return tick.offsetLeft + (tick.offsetWidth / 2);
            };

            const placeMarker = (from, to, progress) => {
                const fromX = getTickCenter(from);
                const toX = getTickCenter(to);
                const x = fromX + ((toX - fromX) * progress);
                const jumpHeight = Math.sin(Math.PI * progress) * 24;
                marker.style.left = `${x}px`;
                marker.style.transform = `translate(-50%, ${-jumpHeight}px)`;
            };

            const showSegmentLabel = segment => {
                operation.textContent = segment ? segment.label : "";
            };

            const resetAnimation = () => {
                if (animationFrame) cancelAnimationFrame(animationFrame);
                animationFrame = null;
                running = false;
                paused = false;
                segmentIndex = 0;
                segmentProgress = 0;
                lastTimestamp = null;
                operation.textContent = "";
                equation.textContent = "";
                marker.style.left = `${getTickCenter(0)}px`;
                marker.style.transform = "translate(-50%, 0)";
            };

            const finishAnimation = () => {
                running = false;
                paused = false;
                animationFrame = null;
                operation.textContent = "";
                equation.textContent = `${startValue} ${changeValue >= 0 ? "+" : "-"} ${Math.abs(changeValue)} = ${resultValue}`;
                marker.style.left = `${getTickCenter(resultValue)}px`;
                marker.style.transform = "translate(-50%, 0)";
            };

            const stepAnimation = timestamp => {
                if (!running || paused) return;

                if (segmentIndex >= movementSegments.length) {
                    finishAnimation();
                    return;
                }

                const segment = movementSegments[segmentIndex];
                if (lastTimestamp === null) {
                    lastTimestamp = timestamp;
                    showSegmentLabel(segment);
                }

                const elapsed = timestamp - lastTimestamp;
                segmentProgress = Math.min(1, elapsed / segment.duration);

                if (segment.type === "wait") {
                    marker.style.left = `${getTickCenter(segment.at)}px`;
                    marker.style.transform = "translate(-50%, 0)";
                } else {
                    placeMarker(segment.from, segment.to, segmentProgress);
                }

                if (segmentProgress >= 1) {
                    segmentIndex++;
                    segmentProgress = 0;
                    lastTimestamp = null;
                }

                animationFrame = requestAnimationFrame(stepAnimation);
            };

            playButton.addEventListener("click", () => {
                if (!movementSegments.length) {
                    finishAnimation();
                    return;
                }

                if (!running) {
                    running = true;
                    paused = false;
                    lastTimestamp = null;
                    animationFrame = requestAnimationFrame(stepAnimation);
                    return;
                }

                if (paused) {
                    paused = false;
                    lastTimestamp = null;
                    animationFrame = requestAnimationFrame(stepAnimation);
                }
            });

            pauseButton.addEventListener("click", () => {
                if (!running || paused) return;
                paused = true;
                if (animationFrame) cancelAnimationFrame(animationFrame);
                animationFrame = null;
            });

            restartButton.addEventListener("click", () => {
                resetAnimation();
                running = true;
                animationFrame = requestAnimationFrame(stepAnimation);
            });

            window.addEventListener("resize", () => {
                if (!running) {
                    marker.style.left = `${getTickCenter(segmentIndex >= movementSegments.length ? resultValue : 0)}px`;
                }
            });

            requestAnimationFrame(resetAnimation);
        }
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
    blockElement.querySelector(
        "#lesson-quiz-start"
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
// MARK NON-REQUIRED BLOCK AS COMPLETED
// ==============================

if (
    block.requiredToContinue !== true
) {

    completedBlocks[block.id] = true;

}

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


    const isLastBlock =
        currentBlockIndex ===
        currentLesson.blocks.length - 1;

    if (isLastBlock) {
        nextButton.textContent =
            "Finish Lesson";
    }


    nextButton.addEventListener(
    "click",
    () => {

        const block =
            currentLesson.blocks[
                currentBlockIndex
            ];


        // ==============================
        // CHECK REQUIRED BLOCK
        // ==============================

        if (
            block.requiredToContinue === true &&
            completedBlocks[block.id] !== true
        ) {

            alert(
                "Please complete this activity before continuing."
            );

            return;

        }


        // ==============================
        // MOVE TO NEXT BLOCK
        // ==============================

        if (
            currentBlockIndex <
            currentLesson.blocks.length - 1
        ) {

            currentBlockIndex++;

            renderCurrentLessonBlock();

            return;

        }


        // ==============================
        // COMPLETE LESSON
        // ==============================

        levelsContainer.innerHTML = "";

        const completion =
            document.createElement("div");

        completion.classList.add(
            "lesson-complete"
        );

        completion.innerHTML = `
            <h2>🎉 Lesson Complete!</h2>
            <p>
                You completed
                <strong>${currentLesson.title}</strong>.
            </p>
            <button id="back-to-topic">
                Back to Topic
            </button>
        `;

        levelsContainer.appendChild(
            completion
        );

        const backToTopicButton =
            completion.querySelector(
                "#back-to-topic"
            );

        backToTopicButton.addEventListener(
            "click",
            () => {

                showTopics(
                    currentLevelId,
                    currentClassId,
                    currentSubjectId
                );

            }
        );

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

                };

// ==============================
// START LESSON ENGINE
// ==============================

renderCurrentLessonBlock();

return;

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

        if (
            !Array.isArray(
                quiz.questions
            )
        ) {

            throw new Error(
                "Quiz questions are missing or invalid."
            );

        }

        const questions =
            quiz.questions;

        let currentQuestion = 0;
        let score = 0;
        let answered = false;


        function showQuestion() {

            levelsContainer.innerHTML = "";


            // ==============================
            // QUIZ COMPLETE
            // ==============================

            if (
                currentQuestion >=
                questions.length
            ) {

                completedBlocks[
                    currentLesson.blocks[
                        currentBlockIndex
                    ].id
                ] = true;

                renderCurrentLessonBlock();

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
                        document.createElement(
                            "button"
                        );

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
                                    `✓ ${
                                        question.options[
                                            question.answer
                                        ]
                                    }`;

                            }


                            const nextButton =
                                document.createElement(
                                    "button"
                                );


                            nextButton.textContent =
                                currentQuestion ===
                                questions.length - 1
                                    ? "Finish Quiz"
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
                Unable to load quiz.
            </p>

            <p>
                ${error.message}
            </p>
        `;

        console.error(
            "Lesson quiz error:",
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
