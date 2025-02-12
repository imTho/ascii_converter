const ASCII_CHARS = "@%#*+=-:. ";
let mode = "grayscale"; // Modes: grayscale, color
let resolution = 200;
let storedImg = null;

document.getElementById("imageInput").addEventListener("change", function(event) {
    storedImg = null
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            processImage(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function processImage(img) {
    storedImg = img;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const width = resolution;
    const aspectRatio = img.height / img.width;
    const height = Math.floor(width * aspectRatio * 0.55);

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height).data;
    let asciiArt = "";

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = imageData[index];
            const g = imageData[index + 1];
            const b = imageData[index + 2];
            
            let char = " ";
            if (mode === "grayscale") {
                const grayscale = (r + g + b) / 3;
                const charIndex = Math.floor((grayscale / 255) * (ASCII_CHARS.length - 1));
                char = ASCII_CHARS[charIndex];
                asciiArt += char;
            } else if (mode === "color") {
                const grayscale = (r + g + b) / 3;
                const charIndex = Math.floor((grayscale / 255) * (ASCII_CHARS.length - 1));
                char = ASCII_CHARS[charIndex];
                asciiArt += `<span style="color: rgb(${r},${g},${b})">${char}</span>`;
            }
        }
        asciiArt += mode === "color" ? "<br>" : "\n";
    }

    const asciiOutput = document.getElementById("asciiOutput");
    if (mode === "color") {
        asciiOutput.innerHTML = asciiArt; 
    } else {
        asciiOutput.textContent = asciiArt;
    }
    updateColors();
    updateTextareSize();
}

function updateColors() {
    const output = document.getElementById("asciiOutput");

    if (mode === "grayscale") {
        const textColor = document.getElementById("colorPicker").value;
        const bgColor = document.getElementById("bgColorPicker").value;

        output.style.color = textColor;
        output.style.backgroundColor = bgColor;
    } else {
        output.style.backgroundColor = "white";
    }
}

function updateTextareSize() {
    const output = document.getElementById("asciiOutput");

    // Create a temporary span element
    const tempSpan = document.createElement("span");
    tempSpan.style.fontFamily = output.style.fontFamily;
    tempSpan.style.fontSize = output.style.fontSize;
    tempSpan.style.whiteSpace = "pre";
    tempSpan.textContent = "@"; // Use a single character

    // Append it to the body to measure its width
    document.body.appendChild(tempSpan);
    const charWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    // Calculate the width and height of the output
    const height = output.scrollHeight;
    output.style.height = `${height}px`;
    output.style.width = `${charWidth * resolution}px`;
}

document.getElementById("colorPicker").addEventListener("input", updateColors);
document.getElementById("bgColorPicker").addEventListener("input", updateColors);
document.getElementById("toggleGrayscale").addEventListener("click", function() {
    const colorPickers = document.getElementById("colorPickers");
    if (mode === "grayscale") {
        mode = "color";
        this.textContent = "Color";
        colorPickers.style.display = "none";
    } else {
        mode = "grayscale";
        this.textContent = "Monochrome";
        colorPickers.style.display = "block";
    }
    processImage(storedImg);
});