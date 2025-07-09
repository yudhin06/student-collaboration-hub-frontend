from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
# NOTE: If you see an import error for cloudinary, run: pip install cloudinary
try:
    import cloudinary
    import cloudinary.api
except ImportError:
    cloudinary = None
from dotenv import load_dotenv
import os
load_dotenv()

if cloudinary is not None:
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )

router = APIRouter(prefix="/api/papers", tags=["papers"])

@router.get("/{filename}")
async def download_paper(filename: str):
    if cloudinary is None:
        raise HTTPException(status_code=500, detail="Cloudinary is not configured")
    try:
        # Try to get the resource details from Cloudinary
        resource = cloudinary.api.resource(f"student_hub/papers/{filename}")
        url = resource.get('secure_url')
        if not url:
            raise Exception('No URL found for file')
        return RedirectResponse(url)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found in Cloudinary") 