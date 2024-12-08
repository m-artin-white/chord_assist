import unittest
from unittest.mock import patch, mock_open
import yaml
from llm import LLM

class TestLLM(unittest.TestCase):

    def setUp(self):
        self.llm = LLM()

    @patch("builtins.open", new_callable=mock_open, read_data="""chord_assist: |
      You are an expert in music theory with comprehensive knowledge of guitar chord structures, chord progressions, and their practical applications.
      Provide responses that are insightful, detailed, and tailored to the user's query, ensuring relevance and depth in your explanations.""")
    def test_load_prompt_valid(self, mock_file):
        prompt = self.llm.load_prompt("chord_assist")
        self.assertTrue(prompt.startswith("You are an expert in music theory"))

    @patch("builtins.open", side_effect=FileNotFoundError)
    def test_load_prompt_file_not_found(self, mock_file):
        prompt = self.llm.load_prompt("chord_assist")
        self.assertEqual(prompt, "")

    @patch("builtins.open", new_callable=mock_open, read_data="not_yaml")
    def test_load_prompt_invalid_yaml(self, mock_file):
        with patch("yaml.safe_load", side_effect=yaml.YAMLError):
            prompt = self.llm.load_prompt("chord_assist")
            self.assertEqual(prompt, "")

    @patch("ollama.chat")
    def test_query_with_chord(self, mock_chat):
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
        # Mock the response from ollama.chat
        mock_chat.return_value = {"message": {"content": "Mocked fallback response"}}

        # Simulate a missing prompt by mocking `load_prompt` to return an empty string
        with patch.object(self.llm, "load_prompt", return_value=""):
            response = self.llm.query(query="Tell me about this chord", chord="C Major")

        # Verify the fallback behavior
        self.assertEqual(response, "Mocked fallback response")

if __name__ == "__main__":
    unittest.main()
