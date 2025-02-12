// The server tells where the fish should try to go.
// and how far the fish can move in a second (speed).
// The client tries to move the fish.

interface MyEvent {
    type: "tick";
    detail: { fish: Array<ServerFish> };
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

interface ServerFish {
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

window.addEventListener("phx:tick", (e: MyEvent) => {
    e.detail.fish.forEach((serverFish) => {
        if (!fishMap[serverFish.id]) {
            let randomX = Math.random() * canvas.width;
            let randomY = Math.random() * canvas.height;

            fishMap[serverFish.id] = {
                ...serverFish,
                x: randomX,
                y: randomY,
                goalX: serverFish.x,
                goalY: serverFish.y,
            };
        } else {
            fishMap[serverFish.id].goalX = serverFish.x;
            fishMap[serverFish.id].goalY = serverFish.y;
        }
    });
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
