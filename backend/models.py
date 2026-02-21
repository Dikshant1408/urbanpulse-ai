import os
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np


DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def _train(csv_file: str, x_col: str, y_col: str) -> LinearRegression:
    df = pd.read_csv(os.path.join(DATA_DIR, csv_file))
    X = df[[x_col]].values
    y = df[y_col].values
    model = LinearRegression()
    model.fit(X, y)
    return model


def load_models():
    traffic_model = _train("traffic.csv", "hour", "traffic_volume")
    aqi_model = _train("pollution.csv", "day", "AQI")
    energy_model = _train("energy.csv", "hour", "usage")
    return traffic_model, aqi_model, energy_model


def predict_traffic(model: LinearRegression, hour: int) -> float:
    value = float(model.predict([[hour]])[0])
    return round(max(value, 0), 2)


def predict_aqi(model: LinearRegression, day: int) -> float:
    value = float(model.predict([[day]])[0])
    return round(max(value, 0), 2)


def predict_energy(model: LinearRegression, hour: int) -> float:
    value = float(model.predict([[hour]])[0])
    return round(max(value, 0), 2)
