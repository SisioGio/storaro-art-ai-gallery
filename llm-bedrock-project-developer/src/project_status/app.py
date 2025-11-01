import json
import boto3
import os
dynamodb = boto3.resource("dynamodb")
TABLE_NAME = os.environ.get('TABLE_NAME',"project-creator-jobs")
table = dynamodb.Table(TABLE_NAME)

def generate_response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": json.dumps(body),
    }

def lambda_handler(event, context):
    job_id = event["queryStringParameters"]["job_id"]

    response = table.get_item(TableName=TABLE_NAME, Key={"job_id": job_id})
    
    if "Item" not in response:
        return generate_response(404, {"error": "Job not found"})
        

    status = response["Item"]["status"]
    output = response["Item"].get("project_url", {})
    return generate_response(200, {"job_id": job_id, "status": status, "project_url": output})
    
