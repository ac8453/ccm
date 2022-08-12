

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const sts = new AWS.STS({ region: 'eu-west-2' });
const timestamp = Date.now();

exports.handler = async (event, context) => {
    const routeKey = event.httpMethod + " " + event.path;
    if (event.body) {
        requestJSON = JSON.parse(event.body);
    };
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"

    };
    const requestBody = JSON.parse(event.body);
    const sts_params = {
        RoleArn: `arn:aws:iam::${requestBody.accountId}:role/Cloud-Capacity-Manager-5uWFMs`,
        RoleSessionName: `ccm_role_assumption-${timestamp}`,
        ExternalId: requestBody.externalId
    };
    const user_acc = await sts.assumeRole(sts_params).promise();
    const ACCESS_KEY = user_acc.Credentials.AccessKeyId;
    const SECRET_KEY = user_acc.Credentials.SecretAccessKey;
    const SESSION_TOKEN = user_acc.Credentials.SessionToken;
    try {
        switch (routeKey) {
            case "POST /listusers/org":
                const org = new AWS.Organizations({
                    accessKeyId: ACCESS_KEY,
                    secretAccessKey: SECRET_KEY,
                    sessionToken: SESSION_TOKEN,
                    region: 'us-east-1'
                });
                body = await org.listAccounts().promise();
                break;
            case "POST /listusers/iam":
                const iam = new AWS.IAM({
                    accessKeyId: ACCESS_KEY,
                    secretAccessKey: SECRET_KEY,
                    sessionToken: SESSION_TOKEN,
                    region: 'eu-west-2'
                });
                body = await iam.listUsers().promise();
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
    var response = { statusCode, headers, body }

    return response;
};
