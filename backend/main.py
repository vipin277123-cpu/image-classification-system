from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image
from io import BytesIO

from .inference import predict_image


app = FastAPI(
    title="CIFAR-10 Image Classification API",
    description="MobileNetV2-based image classification API",
    version="1.0.0"
)


# ==============================
# CORS CONFIGURATION
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# CIFAR-10 CLASSES
# ==============================

CLASSES = [
    "airplane",
    "automobile",
    "bird",
    "cat",
    "deer",
    "dog",
    "frog",
    "horse",
    "ship",
    "truck"
]


# ==============================
# ROOT
# ==============================

@app.get("/")
def root():
    return {
        "message": "CIFAR-10 Image Classification API is running"
    }


# ==============================
# HEALTH CHECK
# ==============================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==============================
# CLASSES
# ==============================

@app.get("/api/classes")
def get_classes():
    return {
        "classes": CLASSES,
        "count": len(CLASSES)
    }


# ==============================
# MODEL INFORMATION
# ==============================

@app.get("/api/model/info")
def model_info():
    return {
        "architecture": "MobileNetV2",
        "dataset": "CIFAR-10",
        "num_classes": 10,
        "top1_accuracy": 94.89,
        "top5_accuracy": 99.89
    }


# ==============================
# IMAGE PREDICTION
# ==============================

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):

    # Check whether uploaded file is an image
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    try:

        # Read uploaded image
        contents = await file.read()

        # Convert bytes to PIL Image
        image = Image.open(BytesIO(contents)).convert("RGB")

        # Run model prediction
        result = predict_image(image)

        # Return prediction
        return {
            "filename": file.filename,
            "prediction": result["class"],
            "confidence": float(result["confidence"]),
            "top5": result["top5"]
        }

    except Exception as e:

        print("Prediction error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )