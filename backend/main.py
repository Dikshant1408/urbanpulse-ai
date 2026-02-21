from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from models import load_models, predict_traffic, predict_aqi, predict_energy

_state: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    traffic_model, aqi_model, energy_model = load_models()
    _state["traffic"] = traffic_model
    _state["aqi"] = aqi_model
    _state["energy"] = energy_model
    yield
    _state.clear()


app = FastAPI(title="UrbanPulse AI", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/predict/traffic")
def get_traffic(hour: int = Query(..., ge=0, le=23, description="Hour of day (0-23)")):
    try:
        value = predict_traffic(_state["traffic"], hour)
        return {"hour": hour, "predicted_traffic_volume": value}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/predict/aqi")
def get_aqi(day: int = Query(..., ge=1, le=365, description="Day of year (1-365)")):
    try:
        value = predict_aqi(_state["aqi"], day)
        return {"day": day, "predicted_AQI": value}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/predict/energy")
def get_energy(hour: int = Query(..., ge=0, le=23, description="Hour of day (0-23)")):
    try:
        value = predict_energy(_state["energy"], hour)
        return {"hour": hour, "predicted_energy_usage": value}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/recommend")
def get_recommendations():
    try:
        traffic_val = predict_traffic(_state["traffic"], 8)
        aqi_val = predict_aqi(_state["aqi"], 15)
        energy_val = predict_energy(_state["energy"], 18)

        recommendations = []

        if traffic_val > 700:
            recommendations.append(
                "High traffic detected – suggest rerouting via alternate corridors."
            )
        elif traffic_val > 400:
            recommendations.append(
                "Moderate traffic volume – monitor peak-hour flow."
            )
        else:
            recommendations.append("Traffic levels are normal. No action required.")

        if aqi_val > 150:
            recommendations.append(
                "Poor air quality – issue health alert and restrict outdoor activities."
            )
        elif aqi_val > 100:
            recommendations.append(
                "Unhealthy AQI for sensitive groups – advise precautionary measures."
            )
        else:
            recommendations.append("Air quality is satisfactory. No advisory needed.")

        if energy_val > 600:
            recommendations.append(
                "Energy spike detected – recommend conservation and load shedding."
            )
        elif energy_val > 450:
            recommendations.append(
                "Elevated energy usage – consider demand-response actions."
            )
        else:
            recommendations.append(
                "Energy consumption within normal range. System stable."
            )

        return {
            "traffic_prediction": traffic_val,
            "aqi_prediction": aqi_val,
            "energy_prediction": energy_val,
            "recommendations": recommendations,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
