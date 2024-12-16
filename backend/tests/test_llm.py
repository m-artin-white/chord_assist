# Importing necessary libraries and modules

# The `unittest` module is a built-in Python library used for writing and running unit tests.
# Documentation: https://docs.python.org/3/library/unittest.html
import unittest  

# The `unittest.mock` module provides support for mocking objects during testing.
# `patch` is used to replace real objects with mock ones, and `mock_open` is used for mocking file operations.
# Documentation: https://docs.python.org/3/library/unittest.mock.html
from unittest.mock import patch, mock_open  

# The PyYAML library is used to handle YAML files, particularly for reading and writing configuration data.
# PyYAML documentation: https://pyyaml.org/wiki/PyYAMLDocumentation
import yaml 

# Importing the LLM class, which contains methods for interacting with the Large Language Model (Llama3.2).
# The implementation of this class is located in `llm.py` and integrates the Ollama API.
# Ollama API documentation: https://ollama.com/docs
from llm import LLM


class TestLLM(unittest.TestCase):
    """
    Unit tests for the LLM class, which handles loading prompts and querying a language model.
    """

    def setUp(self):
        """
        Set up a new instance of the LLM class for testing.
        """
        self.llm = LLM()

    @patch("builtins.open", new_callable=mock_open, read_data="""chord_assist: |
      You are an expert in music theory with comprehensive knowledge of guitar chord structures, chord progressions, and their practical applications.
      Provide responses that are insightful, detailed, and tailored to the user's query, ensuring relevance and depth in your explanations.""")
    def test_load_prompt_valid(self, mock_file):
        """
        Test the `load_prompt` method with a valid prompt name and valid YAML file.
        Verifies that the method correctly retrieves the expected prompt text.
        """
        prompt = self.llm.load_prompt("chord_assist")
        self.assertTrue(prompt.startswith("You are an expert in music theory"))

    @patch("builtins.open", side_effect=FileNotFoundError)
    def test_load_prompt_file_not_found(self, mock_file):
        """
        Test the `load_prompt` method when the YAML file does not exist.
        Verifies that the method returns an empty string.
        """
        prompt = self.llm.load_prompt("chord_assist")
        self.assertEqual(prompt, "")

    @patch("builtins.open", new_callable=mock_open, read_data="not_yaml")
    def test_load_prompt_invalid_yaml(self, mock_file):
        """
        Test the `load_prompt` method with an invalid YAML file.
        Verifies that the method returns an empty string in case of a YAML parsing error.
        """
        with patch("yaml.safe_load", side_effect=yaml.YAMLError):
            prompt = self.llm.load_prompt("chord_assist")
            self.assertEqual(prompt, "")

    @patch("ollama.chat")
    def test_query_with_chord(self, mock_chat):
        """
        Test the `query` method with a valid chord provided.
        Verifies that the method constructs the correct messages and handles the response.
        """
        # Mock the response from ollama.chat
        mock_chat.return_value = {"message": {"content": "Mocked response with chord"}}

        # Call the query method
        response = self.llm.query(query="What is this chord?", chord="C Major")

        # Verify the response matches the mocked response content
        self.assertEqual(response, "Mocked response with chord")

        # Verify that ollama.chat was called with the correct arguments
        mock_chat.assert_called_once_with(
            model="llama3.2",
            messages=[
                {"role": "system", "content": self.llm.load_prompt("chord_assist") + "\nC Major"},
                {"role": "user", "content": "What is this chord?"}
            ]
        )

    @patch("ollama.chat")
    def test_query_without_chord(self, mock_chat):
        """
        Test the `query` method when no chord is provided.
        Verifies that the method appends a fallback message for missing chords.
        """
        # Mock the response from ollama.chat
        mock_chat.return_value = {"message": {"content": "Mocked response without chord"}}

        # Call the query method without a chord
        response = self.llm.query(query="Tell me about this chord", chord="")

        # Verify the response matches the mocked response content
        self.assertEqual(response, "Mocked response without chord")

        # Verify that ollama.chat was called with the correct arguments
        mock_chat.assert_called_once_with(
            model="llama3.2",
            messages=[
                {"role": "system", "content": self.llm.load_prompt("chord_assist") + "\nNo chord was provided in the UI. Please focus on answering the user's question as normal."},
                {"role": "user", "content": "Tell me about this chord"}
            ]
        )

    @patch("ollama.chat")
    def test_query_with_invalid_prompt(self, mock_chat):
        """
        Test the `query` method when the prompt cannot be loaded (invalid or missing).
        Verifies fallback behavior when an empty prompt is used.
        """
        # Mock the response from ollama.chat
        mock_chat.return_value = {"message": {"content": "Mocked fallback response"}}

        # Simulate a missing prompt by mocking `load_prompt` to return an empty string
        with patch.object(self.llm, "load_prompt", return_value=""):
            response = self.llm.query(query="Tell me about this chord", chord="C Major")

        # Verify the fallback behavior
        self.assertEqual(response, "Mocked fallback response")

if __name__ == "__main__":
    unittest.main()
