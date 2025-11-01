import json
import boto3
import base64
from io import BytesIO
from PIL import Image
import os
import boto3
from botocore.config import Config
import zipfile
from datetime import datetime, timedelta
s3 = boto3.client('s3')
# AWS Clients
dynamodb = boto3.resource("dynamodb")

bedrock = boto3.client("bedrock-runtime") 
TABLE_NAME = os.environ.get('TABLE_NAME',"ProjectsCreationTask")
table = dynamodb.Table(TABLE_NAME)
BUCKET_NAME = os.environ.get("BUCKET_NAME",'project-creator-33124234223')

BASE_FOLDER = os.environ.get("BASE_FOLDER",'C:\\Users\\Alessio\\Documents\\Projects\\document-processor\\document-processor-backend\\src\\project_process\\tmp\\')
def generate_response(statusCode,body):
    return {"statusCode": statusCode,'headers': {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                        }, "body": json.dumps(body)}


s3 = boto3.client(
        "s3",
        region_name='eu-central-1',
        config=Config(
            region_name='eu-central-1',
            signature_version="s3v4"
        ),
        endpoint_url=f"https://s3.eu-central-1.amazonaws.com"
    )


def parse_answer(ai_text):
    # Already dict
    if isinstance(ai_text, dict):
        return ai_text
    # Step 1: Check if folder_data is valid JSON
    try:
        json_object = json.loads(ai_text)
        return json_object
    except json.JSONDecodeError:
        pass  # Not valid JSON, proceed to extract content

    # Step 2: Extract content between the first '{' and the last '}'
    start = ai_text.find('{')
    end = ai_text.rfind('}')
    
    if start == -1 or end == -1 or start >= end:
        raise ValueError("No valid JSON content found within delimiters.")
    
    json_str = ai_text[start:end + 1]

    # Step 3: Convert the extracted content to JSON
    try:
        json_object = json.loads(json_str)
        return json_object
    except json.JSONDecodeError:
        raise ValueError("Extracted content is not valid JSON.")
def create_project_structure(base_path, folder_data):

    folder_data=parse_answer(folder_data)
    folder_path = os.path.join(base_path, folder_data['folder_name'])
    os.makedirs(folder_path, exist_ok=True)

    # Create files
    for file in folder_data.get('Files', []):
        file_path = os.path.join(folder_path, file['file_name'])
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(file['file_content'])

    # Recursively create subfolders
    for subfolder in folder_data.get('Folders', []):
        create_project_structure(folder_path, subfolder)
    return folder_path

def zip_folder(folder_path, zip_path):
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, os.path.dirname(folder_path))
                zipf.write(full_path, arcname=rel_path)


def upload_to_s3(zip_path, bucket_name, object_name):
    s3.upload_file(zip_path, bucket_name, object_name)


def generate_presigned_url(bucket_name, object_name, expiration=360000):
    return s3.generate_presigned_url('get_object', Params={
        'Bucket': bucket_name,
        'Key': object_name
    }, ExpiresIn=expiration)


def lambda_handler(event, context):
    try:
        job_id = event["job_id"]
        print("Processing: " + job_id)
        # Get job details from DynamoDB
        response = table.get_item(TableName=TABLE_NAME, Key={"job_id":  job_id})
        if "Item" not in response:
            raise Exception("Job not found")
            
        table.update_item(
            TableName=TABLE_NAME,
            Key={"job_id":  job_id},
            UpdateExpression="SET #status = :status",
            ExpressionAttributeNames={"#status": "status"},
            ExpressionAttributeValues={":status":  "PROCESSING"},
        )
        

        prompt = response["Item"]["prompt"]



        
        # Call AI Model (Claude 3.5)
        payload = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "messages": [
                
                {"role": "user", "content": [
                    {"type": "text", "text": prompt},
                  
                ]},
                {"role": "assistant", "content": "Here is your JSON data without additional text before of after:"}
            ]
        }

        ai_response = bedrock.invoke_model(
            modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
            body=json.dumps(payload)
        )
        print("Sending prompt to bedrock")
        ai_output = json.loads(ai_response["body"].read().decode())["content"][0]['text']
        print("Response received from Bedrock")
        print(ai_output)
        
        base_folder = BASE_FOLDER
        zip_name = base_folder+datetime.now().strftime('%Y%m%d%H%M%S')+ ".zip"
        s3_key = os.path.basename(zip_name)
        folder_path = create_project_structure(base_folder,ai_output)
        zip_folder(folder_path, zip_name)
        upload_to_s3(zip_name, BUCKET_NAME, s3_key)
        project_url =generate_presigned_url(BUCKET_NAME, s3_key)
        print(project_url)
        # Save AI Response in DynamoDB
        table.update_item(
            TableName=TABLE_NAME,
            Key={"job_id":  job_id},
            UpdateExpression="SET #status = :status, project_url = :project_url",
            ExpressionAttributeNames={"#status": "status"},
            ExpressionAttributeValues={":status":  "COMPLETED", ":project_url": project_url},
        )

        
        return generate_response(200,{"job_id": job_id, "status": "COMPLETED"})
        

    except Exception as e:
        print(e)
        table.update_item(
            TableName=TABLE_NAME,
            Key={"job_id":  job_id},
            UpdateExpression="SET #status = :status",
            ExpressionAttributeNames={"#status": "status"},
            ExpressionAttributeValues={":status":  "FAILED"},
        )
        return generate_response(500,{"message":"Internal Server Error"})
        