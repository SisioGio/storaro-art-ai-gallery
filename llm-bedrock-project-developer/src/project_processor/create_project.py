import os
import json
import shutil
import zipfile
import boto3
from datetime import datetime, timedelta
from botocore.config import Config
import requests

s3 = boto3.client(
        "s3",
        region_name='eu-central-1',
        config=Config(
            region_name='eu-central-1',
            signature_version="s3v4"
        ),
        endpoint_url=f"https://s3.eu-central-1.amazonaws.com"
    )



def create_project_structure(base_path, folder_data):
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


def handle_software_package(json_data: dict, bucket_name: str):
    base_folder = "C:\\Users\\Alessio\\Documents\\Projects\\document-processor\\document-processor-backend\\src\\project_process\\tmp\\project_" + datetime.now().strftime('%Y%m%d%H%M%S')
    zip_name = base_folder + ".zip"
    s3_key = os.path.basename(zip_name)
    print(s3_key)

    try:
        # Step 1: Create folder/files
        folder_path = create_project_structure("C:\\Users\\Alessio\\Documents\\Projects\\document-processor\\document-processor-backend\\src\\project_process\\tmp\\", json_data)

        # Step 2: Zip it
        zip_folder(folder_path, zip_name)

        # Step 3: Upload to S3
        upload_to_s3(zip_name, bucket_name, s3_key)

        # Step 4: Generate download URL
        project_url =generate_presigned_url(bucket_name, s3_key)
        print(project_url)
        return project_url
    except Exception as e:
        print(e)
    


file_path ='C:\\Users\\Alessio\\Documents\\Projects\\document-processor\\document-processor-backend\\src\\project_process\\0ec5413e-edb7-4f52-94f6-10aa6026570d.txt'

with open(file_path,'r') as file:
    content = file.read()

content = json.loads(content)

share_url = handle_software_package(content,'project-creator-3123123')



print(f'"{share_url}"')

http_response = requests.get(share_url)

print(http_response.status_code)


