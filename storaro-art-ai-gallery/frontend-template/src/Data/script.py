import json
import re
import boto3
import pandas as pd
bedrock = boto3.client('bedrock-runtime')


def generate_short_script(script):
    prompt =f"""
    You're an social media manager for a company that sells art from Vittorio Storaro, a famous cinematographer.
    You are tasked with creating a short script for a social media reel from the given script to fit in 30 seconds:
    {script}
    Return a JSON object {{'short_script':''}}.
    The JSON object must be a valid JSON string without any additional text before or after it AND must be then converted in Python json.loads(string_obj)
    """
    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 30000,
        "messages": [
            
            {"role": "user", "content": [
                {"type": "text", "text": prompt}
            ]},
            {"role": "assistant", "content": "Here is your JSON data without additional text before of after:"}
        ]
    }

    ai_response = bedrock.invoke_model(
        modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
        body=json.dumps(payload)
    )

    ai_output = json.loads(ai_response["body"].read().decode())["content"][0]['text']

    print(ai_output)
    # Ensure the output is a valid JSON string
    try:
        ai_output = json.loads(ai_output)
        return ai_output
    except json.JSONDecodeError as e:
        substring = ai_output[ai_output.index("{"): ai_output.index("}") + 1]
        
        try:
            ai_output = json.loads(substring)
            return ai_output
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON response from AI model: {e}")
    return None
with open(r"C:\Users\Alessio\Documents\Projects\Storaro Art\frontend-template\src\Data\images_analysis.json",'r')as f:
    data = json.load(f)
print(len(data))
data= [d for d in data if d['introduction'] is not None]

for img in data:
    try:
        curr_script = img['script']
        if curr_script is not None:
            short_script = generate_short_script(curr_script)
            img['short_script'] = short_script['short_script']
            print(f"Short script for image generated successfully.")
        
    except Exception as e:
        print(f"Error processing image: {e}")

with open(r"C:\Users\Alessio\Documents\Projects\Storaro Art\frontend-template\src\Data\images_analysis_short_script.json", 'w') as f:
    json.dump(data, f, indent=4)

df = pd.DataFrame(data)

# Write to Excel
df.to_excel(r"C:\Users\Alessio\Documents\Projects\Storaro Art\frontend-template\src\Data\images_analysis.json", index=False) 