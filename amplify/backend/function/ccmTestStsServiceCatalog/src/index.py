import boto3
import json
import datetime
from json import JSONEncoder

class DateTimeEncoder(JSONEncoder):
        #Override the default method
        def default(self, obj):
            if isinstance(obj, (datetime.date, datetime.datetime)):
                return obj.isoformat()

def lambda_handler(event, context):
    event = json.loads(event['body'])
    sts_connection = boto3.client('sts')
    acct_b = sts_connection.assume_role(
        RoleArn=f"arn:aws:iam::{event['accountId']}:role/Cloud-Capacity-Manager-5uWFMs",
        RoleSessionName="cross_acct_lambda",
        ExternalId= event['externalId']
    )
    
    ACCESS_KEY = acct_b['Credentials']['AccessKeyId']
    SECRET_KEY = acct_b['Credentials']['SecretAccessKey']
    SESSION_TOKEN = acct_b['Credentials']['SessionToken']

    # create service client using the assumed role credentials
    client = boto3.client(
        'servicecatalog',
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        aws_session_token=SESSION_TOKEN,
    )
    response = DateTimeEncoder().encode(client.list_portfolios())

    return response