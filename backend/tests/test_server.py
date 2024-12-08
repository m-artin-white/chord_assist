import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

@pytest.fixture
def mock_query(mocker):
    return mocker.patch("llm.LLM.query", return_value="Mocked response")

def test_upload_endpoint_valid(mock_query):
    response = client.post(
        "/upload",
        data={
            "text": "What is this chord?",
            "noteOrChord": "C Major"
        }
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Mocked response"}

def test_upload_endpoint_missing_fields():
    response = client.post("/upload", data={"text": "Missing noteOrChord"})
    assert response.status_code == 422  # Unprocessable Entity due to missing form fields
