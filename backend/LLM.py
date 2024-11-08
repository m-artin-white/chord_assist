import ollama
import yaml

class LLM():
    def __init__(self):
        self.model = "llama3.2"

    def load_prompt(self, prompt: str, filepath: str = "./prompts/prompts.yaml") -> str:
        try:
            with open(filepath, 'r') as file:
                data = yaml.safe_load(file)
                prompt_text = data.get(prompt, "")
                if not prompt_text:
                    raise ValueError(f"No text found for the prompt '{prompt}' in the YAML file.")
                return prompt_text
        except FileNotFoundError:
            print(f"File not found: {filepath}")
        except yaml.YAMLError as e:
            print(f"Error parsing YAML file: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
        return ""


    def query(self, query:str, chord: str, prompt: str = "chord_assist") -> str:

        if not chord:
            prompt = self.load_prompt(prompt=prompt) 
            prompt = prompt + "\nNo chord was provided in the UI. Please focus on answering the user's question as normal."
        else:
            prompt = self.load_prompt(prompt=prompt) 
            prompt = prompt + f"\n{chord}"
        
        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": query}
        ]

        response = ollama.chat(model='llama3.2', messages=messages)
        output = response['message']['content']
        return output
    
