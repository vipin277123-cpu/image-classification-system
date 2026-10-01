
const API_URL = "http://127.0.0.1:8000/api/predict";

/* ================================
   GET HTML ELEMENTS
================================ */

const uploadArea = document.getElementById("uploadArea");
const imageInput = document.getElementById("imageInput");
const chooseButton = document.getElementById("chooseButton");
const fileName = document.getElementById("fileName");

const previewSection = document.getElementById("previewSection");
const previewImage = document.getElementById("previewImage");

const predictButton = document.getElementById("predictButton");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const prediction = document.getElementById("prediction");
const confidence = document.getElementById("confidence");

const confidenceChart = document.getElementById("confidenceChart");
const top5Results = document.getElementById("top5Results");

const history = document.getElementById("history");
const clearHistoryButton = document.getElementById("clearHistoryButton");


/* ================================
   CURRENT FILE
================================ */

let selectedFile = null;


/* ================================
   CHOOSE IMAGE BUTTON
================================ */

chooseButton.addEventListener("click", function () {
    imageInput.click();
});


/* ================================
   FILE INPUT
================================ */

imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    handleFile(file);
});


/* ================================
   DRAG & DROP
================================ */

uploadArea.addEventListener("dragover", function (event) {

    event.preventDefault();

    uploadArea.classList.add("drag-over");
});


uploadArea.addEventListener("dragleave", function () {

    uploadArea.classList.remove("drag-over");
});


uploadArea.addEventListener("drop", function (event) {

    event.preventDefault();

    uploadArea.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];

    if (!file) {
        return;
    }

    handleFile(file);
});


/* ================================
   HANDLE FILE
================================ */

function handleFile(file) {

    /* Check file type */

    const allowedTypes = [
        "image/jpeg",
        "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {

        alert("Please upload a JPG or PNG image.");

        return;
    }


    /* Check file size
       Maximum = 5 MB
    */

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

        alert("Image size must be less than 5 MB.");

        return;
    }


    selectedFile = file;

    fileName.textContent = file.name;


    /* Preview */

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;

    previewSection.style.display = "block";


    /* Hide old result */

    result.style.display = "none";

    confidenceChart.innerHTML = "";
    top5Results.innerHTML = "";
}


/* ================================
   PREDICT IMAGE
================================ */

predictButton.addEventListener("click", async function () {

    if (!selectedFile) {

        alert("Please select an image first.");

        return;
    }


    const formData = new FormData();

    formData.append("file", selectedFile);


    /* UI */

    loading.style.display = "block";

    result.style.display = "none";

    predictButton.disabled = true;


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            body: formData
        });


        /* Handle server errors */

        if (!response.ok) {

            let errorMessage = "Prediction failed.";

            try {

                const errorData = await response.json();

                if (errorData.detail) {
                    errorMessage = errorData.detail;
                }

            } catch (error) {
                console.log("Could not read error response.");
            }

            throw new Error(errorMessage);
        }


        const data = await response.json();


        /* ================================
           MAIN PREDICTION
        ================================= */

        prediction.textContent = formatClassName(data.prediction);

        confidence.textContent =
            Number(data.confidence).toFixed(2) + "%";


        /* ================================
           TOP 5
        ================================= */

        renderTop5(data.top5);


        /* ================================
           CONFIDENCE CHART
        ================================= */

        renderConfidenceChart(data.top5);


        /* ================================
           SHOW RESULT
        ================================= */

        result.style.display = "block";


        /* ================================
           SAVE HISTORY
        ================================= */

        savePredictionHistory({

            imageName: selectedFile.name,

            prediction: data.prediction,

            confidence: Number(data.confidence),

            time: new Date().toLocaleString()

        });


        loadHistory();


    } catch (error) {

        console.error("Prediction error:", error);

        alert("Prediction failed: " + error.message);

    } finally {

        loading.style.display = "none";

        predictButton.disabled = false;
    }

});


/* ================================
   RENDER TOP 5
================================ */

function renderTop5(top5) {

    top5Results.innerHTML = "";

    if (!Array.isArray(top5)) {
        return;
    }


    top5.forEach(function (item, index) {

        const div = document.createElement("div");

        div.className = "top5-item";


        const className = document.createElement("span");

        className.className = "top5-class";

        className.textContent =
            `${index + 1}. ${formatClassName(item.class)}`;


        const score = document.createElement("span");

        score.className = "top5-confidence";

        score.textContent =
            Number(item.confidence).toFixed(2) + "%";


        div.appendChild(className);

        div.appendChild(score);

        top5Results.appendChild(div);

    });
}


/* ================================
   CONFIDENCE BAR CHART
================================ */

function renderConfidenceChart(top5) {

    confidenceChart.innerHTML = "";

    if (!Array.isArray(top5)) {
        return;
    }


    top5.forEach(function (item) {

        const row = document.createElement("div");

        row.className = "chart-row";


        /* Label */

        const label = document.createElement("div");

        label.className = "chart-label";

        label.textContent =
            formatClassName(item.class);


        /* Bar container */

        const barContainer = document.createElement("div");

        barContainer.className = "bar-container";


        /* Bar */

        const bar = document.createElement("div");

        bar.className = "confidence-bar";


        const score = Number(item.confidence);

        bar.style.width = Math.max(0, Math.min(score, 100)) + "%";


        /* Percentage */

        const value = document.createElement("span");

        value.className = "chart-value";

        value.textContent =
            score.toFixed(2) + "%";


        barContainer.appendChild(bar);

        barContainer.appendChild(value);


        row.appendChild(label);

        row.appendChild(barContainer);

        confidenceChart.appendChild(row);

    });
}


/* ================================
   FORMAT CLASS NAME
================================ */

function formatClassName(name) {

    if (!name) {
        return "-";
    }

    return String(name)
        .charAt(0)
        .toUpperCase()
        + String(name).slice(1);
}


/* ================================
   LOCAL STORAGE
================================ */

function savePredictionHistory(item) {

    let records = [];

    try {

        const stored =
            localStorage.getItem("cifar10_prediction_history");

        if (stored) {

            records = JSON.parse(stored);

            if (!Array.isArray(records)) {
                records = [];
            }
        }

    } catch (error) {

        console.error(
            "Could not read prediction history:",
            error
        );

        records = [];
    }


    /* Add newest prediction first */

    records.unshift(item);


    /* Keep only latest 10 */

    records = records.slice(0, 10);


    localStorage.setItem(
        "cifar10_prediction_history",
        JSON.stringify(records)
    );
}


/* ================================
   LOAD HISTORY
================================ */

function loadHistory() {

    history.innerHTML = "";


    let records = [];

    try {

        const stored =
            localStorage.getItem("cifar10_prediction_history");

        if (stored) {

            records = JSON.parse(stored);

            if (!Array.isArray(records)) {
                records = [];
            }
        }

    } catch (error) {

        console.error(
            "Could not load history:",
            error
        );

        records = [];
    }


    if (records.length === 0) {

        const empty = document.createElement("p");

        empty.className = "empty-history";

        empty.textContent = "No predictions yet.";

        history.appendChild(empty);

        return;
    }


    records.forEach(function (item) {

        const div = document.createElement("div");

        div.className = "history-item";


        const left = document.createElement("div");

        left.className = "history-left";


        const className = document.createElement("strong");

        className.textContent =
            formatClassName(item.prediction);


        const imageName = document.createElement("span");

        imageName.textContent =
            item.imageName || "Image";


        left.appendChild(className);

        left.appendChild(imageName);


        const right = document.createElement("div");

        right.className = "history-right";


        const score = document.createElement("strong");

        score.textContent =
            Number(item.confidence).toFixed(2) + "%";


        const time = document.createElement("span");

        time.textContent =
            item.time || "";


        right.appendChild(score);

        right.appendChild(time);


        div.appendChild(left);

        div.appendChild(right);


        history.appendChild(div);

    });
}


/* ================================
   CLEAR HISTORY
================================ */

clearHistoryButton.addEventListener("click", function () {

    const confirmed =
        confirm("Clear all prediction history?");

    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "cifar10_prediction_history"
    );


    loadHistory();
});


/* ================================
   LOAD HISTORY WHEN PAGE OPENS
================================ */
