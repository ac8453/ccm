const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
let requestJSON = '';
exports.handler = async (event, context) => {
    const routeKey = event.httpMethod + " " + event.path;
    if (event.body) {
        requestJSON = JSON.parse(event.body);
    }
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"

    };
    try {
        switch (routeKey) {
            case "POST /appuser/accId":
                await dynamo
                    .update({
                        TableName: "CCMAccounts-dev",
                        Key: {
                            id: requestJSON.id                                                                     // records to be updated by video id
                        },
                        UpdateExpression: "set accountId = :accountId", // Uses UpdateExpression to describe all updates you want to perform on the specified item.
                        ExpressionAttributeValues: {
                            ":accountId": requestJSON.accountId
                        },
                        ReturnValues: "UPDATED_NEW"
                    })
                    .promise();
                body = `Updated accoundId for ${requestJSON.id}`;
                break;
            case 'POST /appuser':
                body = await dynamo
                    .get({
                        TableName: "CCMAccounts-dev",
                        Key: {
                            id: requestJSON.id,
                        }
                    })
                    .promise();
                break;
            default:
                throw new Error(`Unsupported route: "${routeKey}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }
    console.log(body)
    return {
        statusCode,
        body,
        headers
    };
};