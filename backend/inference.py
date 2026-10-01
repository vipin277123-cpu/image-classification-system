import torch

from .model import model, device
from .utils import CLASS_NAMES, preprocess_image


def predict_image(image):
    """
    Run image classification using the trained MobileNetV2 model.
    Returns top-5 predictions with confidence scores.
    """

    # Preprocess image
    image_tensor = preprocess_image(image)

    # Move image to same device as model
    image_tensor = image_tensor.to(device)

    # Disable gradient calculation
    with torch.no_grad():
        outputs = model(image_tensor)

        # Convert logits to probabilities
        probabilities = torch.softmax(outputs, dim=1)

        # Get top-5 predictions
        top5_probabilities, top5_indices = torch.topk(
            probabilities, k=5, dim=1
        )

    # Build top-5 results
    top5_predictions = []

    for probability, index in zip(
        top5_probabilities[0],
        top5_indices[0]
    ):
        top5_predictions.append({
            "class": CLASS_NAMES[index.item()],
            "confidence": round(probability.item() * 100, 2)
        })

    # First prediction = top prediction
    predicted_class = top5_predictions[0]["class"]
    confidence = top5_predictions[0]["confidence"]

    return {
        "class": predicted_class,
        "confidence": confidence,
        "top5": top5_predictions
    }