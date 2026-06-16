import os
import sys
from pathlib import Path

# Add the parent directory to the Python path so Vercel can find the backend package
sys.path.append(str(Path(__file__).parent.parent))

from backend.main import app
