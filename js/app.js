const curriculum = await fetch("./data/curriculum.json")
    .then(response => response.json());

const subjects = await fetch("./data/subjects.json")
    .then(response => response.json());

const lessons = await fetch("./data/lessons.json")
    .then(response => response.json());


const levelsContainer = document.getElementById("levels");

const nigeria = curriculum.nigeria;

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

        levelsContainer.appendChild(card);
    });
}
