# CIFAR-10 Image Classification System

A full-stack image classification web application that uses a pre-trained **MobileNetV2** model to classify images into the 10 CIFAR-10 object categories.

The application provides an interactive web interface where users can upload an image, preview it, get predictions with confidence scores, view Top-5 predictions, and maintain recent prediction history in the browser.

## Features

* Image upload using JPEG and PNG formats
* Drag-and-drop image upload
* Image preview before prediction
* MobileNetV2-based image classification
* Prediction confidence score
* Top-5 predictions
* Confidence visualization
* Loading indicator during inference
* Recent prediction history using browser `localStorage`
* FastAPI backend
* REST API endpoints
* Image preprocessing and normalization
* Error handling for invalid uploads
* Confusion matrix and training results

## Supported Classes

The application supports the 10 CIFAR-10 classes:

1. Airplane
2. Automobile
3. Bird
4. Cat
5. Deer
6. Dog
7. Frog
8. Horse
9. Ship
10. Truck

## Tech Stack

### Backend

* Python
* FastAPI
* PyTorch
* Torchvision
* Uvicorn

### Frontend

* HTML
* CSS
* JavaScript
* Browser localStorage

### Model

* MobileNetV2
* PyTorch
* CIFAR-10 dataset

## Project Structure

```text
image-classification-system/
│
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── inference.py
│   └── utils.py
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── models/
│   └── model.pth
│
├── notebooks/
│   └── image_classification_training.ipynb
│
├── results/
│   ├── confusion_matrix.png
│   └── training_curves.png
│
├── screenshots/
│
├── requirements.txt
├── .gitignore
└── README.md
```

## API Endpoints

### POST `/api/predict`

Uploads an image and returns the predicted class, confidence score, and Top-5 predictions.

Example response:

```json
{
  "class": "airplane",
  "confidence": 90.87,
  "top5": [
    {
      "class": "airplane",
      "confidence": 90.87
    },
    {
      "class": "bird",
      "confidence": 3.14
    },
    {
      "class": "cat",
      "confidence": 1.97
    }
  ]
}
```

### GET `/api/classes`

Returns the list of supported CIFAR-10 classes.

### GET `/api/model/info`

Returns model metadata such as architecture and model information.

## Installation

Clone the repository:

```bash
git clone https://github.com/vipin277123-cpu/image-classification-system.git
cd image-classification-system
```

Create a virtual environment:

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Run the Backend

From the project root:

```bash
uvicorn backend.main:app --reload
```

The FastAPI server will run at:

```text
http://127.0.0.1:8000
```

API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## Run the Frontend

Open:

```text
frontend/index.html
```

using VS Code Live Server or another local web server.

The frontend communicates with:

```text
http://127.0.0.1:8000/api/predict
```

## Model Inference Pipeline

The image classification pipeline follows these steps:

```text
Image Upload
     ↓
Image Validation
     ↓
Image Preprocessing
     ↓
Resize & Normalize
     ↓
MobileNetV2
     ↓
Softmax Probabilities
     ↓
Top-5 Predictions
     ↓
Class + Confidence
```

## Model Performance

The project evaluates the model using:

* Top-1 Accuracy
* Top-5 Accuracy
* Confusion Matrix
* Training and validation curves
* Inference time

The generated evaluation results are stored in the `results/` directory.

> Add the exact measured Top-1 accuracy, Top-5 accuracy, and inference time here after final evaluation.

## Frontend Workflow

1. Select or drag-and-drop an image.
2. Preview the uploaded image.
3. Click **Predict Image**.
4. The frontend sends the image to the FastAPI backend.
5. The backend performs preprocessing and inference.
6. The predicted class and confidence are displayed.
7. Top-5 predictions are displayed.
8. The prediction is stored in browser `localStorage`.

## Error Handling

The application handles common image upload problems including:

* No image selected
* Unsupported image format
* Invalid/corrupted image
* Oversized image
* Backend/API errors

## Screenshots

Add screenshots of:

* Image upload interface
* Image preview
* Prediction result
* Top-5 predictions
* Prediction history
* Confidence visualization

Place screenshots inside the `screenshots/` directory.

## Future Improvements

* Deploy the FastAPI backend
* Deploy the frontend
* Add authentication
* Add batch image prediction
* Improve model accuracy through fine-tuning
* Add more visualization options
* Add cloud deployment

## Author

**Vipin Sharma**

GitHub:
https://github.com/vipin277123-cpu

## License

This project is created for educational and portfolio purposes.
