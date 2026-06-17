import sys
from pathlib import Path

# Add the api/ directory to the Python path so Vercel can find sibling modules
sys.path.append(str(Path(__file__).parent))

from main import app
