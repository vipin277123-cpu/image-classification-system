import torch
import torch.nn as nn
from pathlib import Path
from torchvision.models import mobilenet_v2


# Project root
BASE_DIR = Path(__file__).resolve().parent.parent

# Model path
MODEL_PATH = BASE_DIR / "models" / "mobilenetv2_cifar10.pth"

# Device
device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

# Create MobileNetV2
model = mobilenet_v2(weights=None)

# Replace classifier for CIFAR-10
model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    10
)

# Load checkpoint
checkpoint = torch.load(
    MODEL_PATH,
    map_location=device,
    weights_only=False
)

# Extract trained weights
model.load_state_dict(
    checkpoint["model_state_dict"]
)

# Move model to device
model = model.to(device)

# Evaluation mode
model.eval()

print(f"Model loaded successfully on: {device}")
print(f"Test accuracy: {checkpoint['test_accuracy']:.2f}%")