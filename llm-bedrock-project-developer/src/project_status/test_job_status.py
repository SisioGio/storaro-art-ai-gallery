import json

import pytest

from app import lambda_handler


job_id = '4bcc9c65-e839-4e17-a3c7-21f85c4d0fb4'
def test_lambda_handler():
    event = {'queryStringParameters':{'job_id':'b46e5540-7695-4738-8e63-df5564c68fdf'}}



    ret = lambda_handler(event, "")
    data = json.loads(ret["body"])
    print(data)
    return data

test_lambda_handler()
