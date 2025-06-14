from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import torch
import torchvision.transforms as transforms
import io

from model import get_model

app = FastAPI()
model = get_model()
model.load_state_dict(torch.load("model.pth", map_location="cpu"))
model.eval()

classes = ['bkl', 'nv', 'df', 'mel', 'vasc', 'bcc', 'akiec']

mean = [0.7644, 0.5472, 0.5715]
std = [0.1406, 0.1526, 0.1698]

def preprocess(image):
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])
    return transform(image)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img_bytes = await file.read()
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    image = preprocess(image) 
    with torch.no_grad():
        outputs = model(image.unsqueeze(0))
        _, predicted = torch.max(outputs, 1)
    result = classes[predicted.item()]
    return JSONResponse(content={"prediction": result})
