import json
import uuid
import boto3
import base64
import time
import os
dynamodb = boto3.resource("dynamodb")
lambda_client = boto3.client("lambda")

TABLE_NAME = os.environ.get("TABLE_PROJECTS_TASKS","ProjectsCreationTask")
LAMBDA_PROCESS = os.getenv("LAMBDA_PROCESS_PROJECTS",'document-processor-backen-BedrockBackgroundFunctio-gGwUccMFRyI8')
table = dynamodb.Table(TABLE_NAME)


USERS_TABLE_NAME = os.getenv("USERS_TABLE_NAME", "UsersTableDocumentExtractor")
table_users = dynamodb.Table(USERS_TABLE_NAME)

def lambda_handler(event, context):
    try:
        print(event)
        body = json.loads(event["body"])
        email = event['requestContext']['authorizer']['principalId']
        
        response = table_users.get_item(
            Key={'email': email},
            ProjectionExpression='projects_available, projects_processed'
        )
        
        if 'Item' not in response:
            raise Exception(f"User with email '{email}' not found.")
        
        user_data = response['Item']
        projects_available = user_data.get('projects_available', 10)
        projects_processed = user_data.get('projects_processed', 0)

        new_total = projects_processed + 1

        # Step 2: Check if usage exceeds quota
        if new_total > projects_available:
            raise Exception(
                f"Project limit exceeded.Projects available: {projects_available}. Projects processed: {projects_processed}"
            )

        # Step 3: Update pages_processed
        update_response = table_users.update_item(
            Key={'email': email},
            UpdateExpression='SET projects_processed = :new_total',
            ExpressionAttributeValues={':new_total': new_total},
            ReturnValues='UPDATED_NEW'
        )




        language = body["language"]
        name = body['name']
        description = body['description']
        libraries= body['libraries']
        preferences = body['preferences']
        # Construct the prompt for creating the software
        prompt = f"""
    You are a software engineer tasked with creating a software project. Below are the project specifications:
    
    - Language: {language}
    - Name: {name}
    - Description: {description}
    - Libraries: {', '.join(libraries) if libraries else 'None'}
    - Preferences: {preferences if preferences else 'None'}

    Based on the information provided, create a project structure that includes folders and files. The structure should follow this format:
    {{
      "folder_name": "<Folder Name>",
      "Files": [
        {{
          "file_name": "<File Name>",
          "file_content": "<File Content>"
        }}
      ],
      "Folders": [
        {{
          "folder_name": "<Subfolder Name>",
          "Files": [
            {{
              "file_name": "<File Name>",
              "file_content": "<File Content>"
            }}
          ],
          "Folders": []
        }}
      ]
    }}

    The goal is to create the software package by writing the files and folders as per the above structure.
    """
        print(prompt)
        job_id = str(uuid.uuid4())
        print("Job created:"+job_id)
        delete_at = int(time.time()) + (7 * 86400)
        # Save to DynamoDB
        table.put_item(
           
            Item={
                "job_id": job_id,
                'prompt':prompt,
                "status": "NEW",
                
                "deleteAt":delete_at
            },
        )

        # # Trigger Background Lambda (async)
        # lambda_client.invoke(
            
        #     FunctionName="document-processor-backen-BedrockBackgroundFunctio-gGwUccMFRyI8",
        #     InvocationType="Event",  # Async
        #     Payload=json.dumps({"job_id": job_id}),
        # )

        return {
            "statusCode": 200,
            'headers': {
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'OPTIONS,POST'
                            },
            "body": json.dumps({"job_id": job_id, "status": "NEW",'prompt':prompt}),
        }
    except Exception as e:
        print(e)
        return {
            "statusCode": 500,
            "headers": {
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'OPTIONS,POST'
                            },
            "body": json.dumps({"error": str(e)}),
        }
