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
}

interface ServerFish {
    id: string;
    x: number;
    y: number;
    speed: number;
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

        drawFish(fish.x, fish.y);
    });
}

function drawFish(x: number, y: number) {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
}

setInterval(animateFish, 100);
