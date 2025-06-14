import torch.nn as nn
import torch

def get_model():
    return nn.Sequential(
    #block 1
    nn.Conv2d(3,32,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(32),
    nn.Conv2d(32,32,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(32),
    nn.MaxPool2d(2,2),
    nn.Dropout(0.3),
    #block 2
    nn.Conv2d(32,64,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(64),
    nn.Conv2d(64,64,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(64),
    nn.MaxPool2d(2,2),
    nn.Dropout(0.3),
    #block 3
    nn.Conv2d(64,128,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(128),
    nn.Conv2d(128,128,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(128),
    nn.Conv2d(128,128,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(128),
    nn.MaxPool2d(2,2),
    nn.Dropout(0.3),
    #block 4
    nn.Conv2d(128,256,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(256),
    nn.Conv2d(256,256,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(256),
    nn.Conv2d(256,256,3,stride=1,padding='same'),
    nn.SiLU(),
    nn.BatchNorm2d(256),
    nn.MaxPool2d(2,2),
    nn.Dropout(0.3),
    #Block 5
    nn.AdaptiveAvgPool2d((1, 1)),
    nn.Flatten(),
    nn.Dropout(0.3),
    nn.Linear(256, 128),
    nn.SiLU(),
    nn.Dropout(0.3),
    nn.Linear(128, 7),
)