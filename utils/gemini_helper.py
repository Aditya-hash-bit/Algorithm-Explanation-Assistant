import os
import ollama

def generate_explanation(prompt):
    try:
        response = ollama.chat(
            model='llama3',
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return {
            "success": True,
            "data": response['message']['content']
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }