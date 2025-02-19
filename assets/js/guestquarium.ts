// The server tells where the fish should try to go.
// and how far the fish can move in a second (speed).
// The client tries to move the fish.

interface FishUpdateEvent {
    type: "fish_update";
    detail: Fish;
}

interface FishSurveyEvent {
    type: "fish_survey";
    detail: { fish: Array<Fish> };
}

interface Fish {
    id: string;
    x: number;
    y: number;
    goalX: number | undefined;
    goalY: number | undefined;
    speed: number;
    direction: "left" | "right";
    size:
    | "small"
    | "medium"
    | "large";
}

let canvas = document.querySelector("canvas")!;
let ctx = canvas.getContext("2d")!;

let fishMap: Record<string, Fish> = {};
let lastTickTime = performance.now();

// called when a fish wants to go somewhere new
window.addEventListener("phx:fish_update", (e: FishUpdateEvent) => {
    let fishUpdate = e.detail;

    if (!fishMap[fishUpdate.id]) {
        return;
    }
    let fish = fishMap[fishUpdate.id];

    fish.goalX = fishUpdate.x;
    fish.goalY = fishUpdate.y;
    fish.speed = fishUpdate.speed;

    if (fish.goalX > fish.x) {
        fish.direction = "left";
    } else {
        fish.direction = "right";
    }
});

// called to load all the fish
// we only expect this once
window.addEventListener("phx:fish_survey", (e: FishSurveyEvent) => {
    let fish = e.detail.fish;
    fish.map((fish): Fish => {
        fish.goalX = fish.x;
        fish.goalY = fish.y;
        let random = Math.floor(Math.random() * 10);
        let size = "small";
        if (random > 5) size = "medium";
        if (random > 8) size = "large";
        fish.size = size as "small" | "medium" | "large";
        fish.size = "medium"; // for now
        fish.direction = "left";

        return fish;
    }).forEach((fish) => {
        fishMap[fish.id] = fish;
    });
});

function animateFish() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.values(fishMap).forEach((fish) => {
        let dy = (fish.goalY ?? 0) - fish.y;
        let dx = (fish.goalX ?? 0) - fish.x;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let ratio = fish.speed * 0.5 / distance;
        if (ratio < 1) {
            let ratio = fish.speed * 0.5 / distance;
            fish.x += ratio * dx;
            fish.y += ratio * dy;
        }

        drawFish(fish.x, fish.y, fish.size, fish.direction);
    });
}

function drawFish(
    x: number,
    y: number,
    size: "small" | "medium" | "large",
    direction: "left" | "right",
) {
    const sizeMap = {
        small: { width: 10, height: 5 },
        medium: { width: 20, height: 10 },
        large: { width: 30, height: 15 },
    };

    const { width, height } = sizeMap[size] || { width: 0, height: 0 };

    // Fish body (ellipse)
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
    const gradient = ctx.createLinearGradient(
        x - width,
        y - height,
        x + width,
        y + height,
    );
    gradient.addColorStop(0, "#00bcd4"); // Light cyan
    gradient.addColorStop(1, "#309688"); // Dark teal
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();

    // Fish tail (triangle) depending on direction
    ctx.beginPath();
    if (direction === "left") {
        // Left-facing tail (point to the left)
        ctx.moveTo(x - width, y); // Left side of the tail
        ctx.lineTo(x - width - width, y - height); // Top point of the tail
        ctx.lineTo(x - width - width, y + height); // Bottom point of the tail
    } else {
        // Right-facing tail (point to the right)
        ctx.moveTo(x + width, y); // Right side of the tail
        ctx.lineTo(x + width + width, y - height); // Top point of the tail
        ctx.lineTo(x + width + width, y + height); // Bottom point of the tail
    }
    ctx.closePath();
    ctx.fillStyle = "#e30"; // Bright coral
    ctx.fill();
    ctx.stroke();

    // Fish eye (circle)
    ctx.beginPath();
    const eyeX = direction === "right" ? x - width / 2 : x + width / 2; // Eye position based on direction
    ctx.arc(eyeX, y - height / 3, height / 3, 0, Math.PI * 2); // Eye position and size
    ctx.fillStyle = "white"; // White of the eye
    ctx.fill();

    // Eye pupil (small black circle)
    ctx.beginPath();
    const pupilX = direction === "right" ? x - width / 2 : x + width / 2; // Pupil position based on direction
    ctx.arc(pupilX, y - height / 3, height / 6, 0, Math.PI * 2); // Pupil size
    ctx.fillStyle = "black"; // Pupil color
    ctx.fill();
}

setInterval(animateFish, 50);
