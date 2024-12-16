# Importing necessary libraries

# The Ollama library is used to integrate and interact with the Llama3.2 language model.
# Ollama documentation: https://ollama.com/docs
import ollama  

# The PyYAML library is used to handle YAML files, which are commonly used for configuration.
# PyYAML documentation: https://pyyaml.org/wiki/PyYAMLDocumentation
import yaml

class LLM():
    def __init__(self):
        # Initialize the LLM class with a default model name
        self.model = "llama3.2"

    def load_prompt(self, prompt: str, filepath: str = "./prompts/prompts.yaml") -> str:
        """
        Load a specific prompt's text from a YAML file.

        Args:
            prompt (str): The name of the prompt to load.
            filepath (str): The path to the YAML file containing the prompts.

        Returns:
            str: The text of the specified prompt if found; otherwise, an empty string.
        """
        try:
            with open(filepath, 'r') as file:
                # Load the YAML file content
                data = yaml.safe_load(file)
                # Retrieve the text for the specified prompt
                prompt_text = data.get(prompt, "")
                if not prompt_text:
                    # Raise an error if the prompt is not found
                    raise ValueError(f"No text found for the prompt '{prompt}' in the YAML file.")
                return prompt_text
        except FileNotFoundError:
            # Handle the case where the YAML file does not exist
            print(f"File not found: {filepath}")
        except yaml.YAMLError as e:
            # Handle parsing errors in the YAML file
            print(f"Error parsing YAML file: {e}")
        except Exception as e:
            # Handle any other unexpected errors
            print(f"Unexpected error: {e}")
        return ""

    def query(self, query: str, chord: str, prompt: str = "chord_assist") -> str:
        """
        Generate a response from the language model based on a user query, chord, and a predefined prompt.

        Args:
            query (str): The user's query or question.
            chord (str): The chord information provided by the user.
            prompt (str): The name of the predefined prompt to use (default: "chord_assist").

        Returns:
            str: The language model's response to the query.
        """
        if not chord:
            # Load the default prompt and append a message if no chord is provided
            prompt = self.load_prompt(prompt=prompt) 
            prompt = prompt + "\nNo chord was provided in the UI. Please focus on answering the user's question as normal."
        else:
            # Load the default prompt and append the provided chord information
            prompt = self.load_prompt(prompt=prompt) 
            prompt = prompt + f"\n{chord}"
        
        # Construct the messages to send to the language model
        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": query}
        ]

        # Query the language model and retrieve the response
        response = ollama.chat(model='llama3.2', messages=messages)
        # Extract the content of the response
        output = response['message']['content']
        return output
