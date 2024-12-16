# Importing necessary libraries and modules for testing

# Pytest is a testing framework for Python, used for writing simple as well as complex test cases.
# Documentation: https://docs.pytest.org/en/stable/
import pytest  

# The `TestClient` class from FastAPI is used to create a test client for simulating HTTP requests
# to the FastAPI application during testing.
# Documentation: https://fastapi.tiangolo.com/tutorial/testing/
from fastapi.testclient import TestClient  

# Importing the FastAPI application instance from the `server.py` file.
# This allows the test client to send requests to the application for testing endpoints.
from server import app


# Create a test client instance to interact with the FastAPI application
client = TestClient(app)

@pytest.fixture
def mock_query(mocker):
    """
    Fixture to mock the `query` method of the LLM class.

    Args:
        mocker: The pytest-mock fixture for creating mocks.

    Returns:
        Mocked function: The mocked `query` method returning a fixed value.
    """
    # Patch the `query` method of the LLM class to return a mock response
    return mocker.patch("llm.LLM.query", return_value="Mocked response")

def test_upload_endpoint_valid(mock_query):
    """
    Test the /upload endpoint with valid input data.

    Args:
        mock_query: The mocked version of the LLM.query method.
    """
    # Send a POST request with valid data
    response = client.post(
        "/upload",
        data={
            "text": "What is this chord?",  # Example user query
            "noteOrChord": "C Major"       # Example chord provided by the user
        }
    )
    # Assert that the response status code is 200 (success)
    assert response.status_code == 200
    # Assert that the response JSON matches the mocked response
    assert response.json() == {"message": "Mocked response"}

def test_upload_endpoint_missing_fields():
    """
    Test the /upload endpoint with missing required fields in the input data.
    """
    # Send a POST request with incomplete data (missing noteOrChord field)
    response = client.post("/upload", data={"text": "Missing noteOrChord"})
    # Assert that the response status code is 422 (Unprocessable Entity)
    assert response.status_code == 422
