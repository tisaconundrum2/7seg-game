const SEGMENTS = {
    0: 0b1111110,
    1: 0b0110000,
    2: 0b1101101,
    3: 0b1111001,
    4: 0b0110011,
    5: 0b1011011,
    6: 0b1011111,
    7: 0b1110000,
    8: 0b1111111,
    9: 0b1111011,
};

function zeroFill(str, len) {
    while (str.length < len) str = "0" + str;
    return str;
}

function setDisplays() {
    const d = new Date();
    const h = zeroFill(d.getHours().toString(), 2);
    const m = zeroFill(d.getMinutes().toString(), 2);

    document.getElementById("display-1").className =
        "display-container display-size-12 display-no-" + h[0];
    document.getElementById("display-2").className =
        "display-container display-size-12 display-no-" + h[1];
    document.getElementById("display-3").className =
        "display-container display-size-12 display-no-" + m[0];
    document.getElementById("display-4").className =
        "display-container display-size-12 display-no-" + m[1];

    return h + m;
}

function computeSegmentXOR(timeStr) {
    const digits = timeStr.split("").map(Number);
    return digits.reduce((acc, d) => acc ^ SEGMENTS[d], 0);
}

function getUserPattern() {
    let value = 0;
    document.querySelectorAll("#userGuess [data-bit]").forEach((seg) => {
        if (seg.classList.contains("on")) {
            const bit = parseInt(seg.dataset.bit, 10);
            value |= 1 << bit;
        }
    });
    return value;
}

function checkGuess() {
    if (gameOver) return;
    const correctXor = computeSegmentXOR(currentTime);
    const guess = getUserPattern();
    const result = document.getElementById("result");

    if (guess === correctXor) {
        result.textContent = "✅ Correct!";
        result.style.color = "lightgreen";
    } else {
        result.textContent =
            "❌ Wrong! Correct pattern was " +
            correctXor.toString(2).padStart(7, "0");
        result.style.color = "red";
    }
    gameOver = true;
}

// Toggle user guess segments
document.querySelectorAll("#userGuess [data-bit]").forEach((seg) => {
    seg.addEventListener("click", () => {
        if (!gameOver) seg.classList.toggle("on");
    });
});

// Game loop
let currentTime = setDisplays();
let gameOver = false;

setInterval(() => {
    const now = new Date();
    const sec = now.getSeconds();
    document.getElementById("countdown").textContent = 60 - sec;

    if (sec === 0) {
        currentTime = setDisplays();
        gameOver = false;
        document.getElementById("result").textContent = "";
        document
            .querySelectorAll("#userGuess [data-bit]")
            .forEach((seg) => seg.classList.remove("on"));
    }
}, 1000);

setDisplays();