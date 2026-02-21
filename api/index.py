import sys
import os

# Make backend package importable from the Vercel serverless function context
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app  # noqa: E402  (import after sys.path manipulation)
from mangum import Mangum  # noqa: E402

handler = Mangum(app, lifespan="auto")
