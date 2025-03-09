## Common Response Structure

## API Structure
All endpoints in this repository follow these conventions:
- Success responses return an object with `{ "data": {...} }` where the data object contains the specified return values
- Error responses return an object with `{ "error": "Error message" }`
- 🔒 indicates endpoints requiring authentication via token in request headers.


# Resume API

## GET /api/resume/{resumeId} 🔒
Retrieves a specific resume by its ID.


## POST /api/resume/upload 🔒
Initiates a resume upload process by generating a pre-signed URL.


## GET /api/resume/evaluate 🔒
Evaluates a resume and provides feedback.

