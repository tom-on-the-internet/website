// The server tells where the fish should try to go.
// and how far the fish can move in a second (speed).
// The client tries to move the fish.

interface TickEvent {
    type: "tick";
    detail: { fish_update: FishUpdate };
}

interface Fish {
    id: string;
    x: number;
    y: number;
    goalX: number;
    goalY: number;
    speed: number;
    size:
        | "small"
        | "medium"
        | "large";
}

interface FishUpdate {
    id: string;
    x: number;
    y: number;
    speed: number;
    size:
        | "small"
        | "medium"
        | "large";
}

let canvas = document.querySelector("canvas")!;
let ctx = canvas.getContext("2d")!;

let fishMap: Record<string, Fish> = {};
let lastTickTime = performance.now();

window.addEventListener("phx:tick", (e: TickEvent) => {
    let fishUpdate = e.detail.fish_update;

    if (!fishMap[fishUpdate.id]) {
        let randomX = Math.random() * canvas.width;
        let randomY = Math.random() * canvas.height;

        fishMap[fishUpdate.id] = {
            id: fishUpdate.id,
            x: randomX,
            y: randomY,
            goalX: fishUpdate.x,
            goalY: fishUpdate.y,
            speed: fishUpdate.speed,
            size: fishUpdate.size,
        };
        return;
    }

    fishMap[fishUpdate.id].goalX = fishUpdate.x;
    fishMap[fishUpdate.id].goalY = fishUpdate.y;
    fishMap[fishUpdate.id].speed = fishUpdate.speed;
});

function animateFish() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.values(fishMap).forEach((fish) => {
        let dy = fish.goalY - fish.y;
        let dx = fish.goalX - fish.x;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let ratio = fish.speed / distance;
        if (ratio < 1) {
            let ratio = fish.speed / distance;
            fish.x += ratio * dx;
            fish.y += ratio * dy;
        }

        drawFish(fish.x, fish.y, fish.size);
    });
}

function drawFish(x: number, y: number, size: "small" | "medium" | "large") {
    const sizeMap = {
        small: { width: 10, height: 5 },
        medium: { width: 20, height: 10 },
        large: { width: 30, height: 15 },
    };

    const { width, height } = sizeMap[size] || { width: 0, height: 0 };

    // Fish body (ellipse)
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
    ctx.fillStyle = "lightblue"; // You can change the color here
    ctx.fill();
    ctx.stroke();

    // Fish tail (triangle)
    ctx.beginPath();
    ctx.moveTo(x - width, y); // Left side of the tail
    ctx.lineTo(x - width - width, y - height); // Top point of the tail
    ctx.lineTo(x - width - width, y + height); // Bottom point of the tail
    ctx.closePath();
    ctx.fillStyle = "lightblue"; // Tail color, can be different
    ctx.fill();
    ctx.stroke();

    // Fish eye (circle)
    ctx.beginPath();
    ctx.arc(x + width / 2, y - height / 3, height / 3, 0, Math.PI * 2); // Eye position and size
    ctx.fillStyle = "black"; // Eye color
    ctx.fill();
}

setInterval(animateFish, 100);
