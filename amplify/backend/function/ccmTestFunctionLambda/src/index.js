const AWS = require('aws-sdk');
const sts = new AWS.STS({ region: 'eu-west-2' });
const timestamp = Date.now();

exports.handler = async (event, context) => {
    const routeKey = event.httpMethod + " " + event.path;
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
    const sc_client = new AWS.ServiceCatalog({ accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY, sessionToken: SESSION_TOKEN, region: 'eu-west-2' });
    let res
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        switch (routeKey) {
            case "POST /portfolios":
                res = await sc_client.listPortfolios().promise();
                body = res
                break;
            case 'POST /products/list':
                res = await sc_client.searchProductsAsAdmin().promise();
                body = res
                break;
            case 'POST /products/all':
                res = await sc_client.searchProducts().promise();
                body = res
                break;
            case 'POST /products/create':
                const s3_client = new AWS.S3({accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY, sessionToken: SESSION_TOKEN, region: 'eu-west-2'})
                var params = {
                    Body: requestBody.file,
                    Bucket: 'cloudcapacitymanagerfc07548e99a644038a003b0d566141456-dev',
                    Key: 'templates/'+requestBody.fileKey
                   };

                   s3.putObject(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(data);           // successful response
                  });
                  const templateUrl = s3_client.getResourceUrl(params.Bucket, params.Key)
                  var product_params = {
                    IdempotencyToken: AWS.util.uuid.v4(), 
                    Name: requestBody.name, 
                    Owner: requestBody.owner, 
                    ProductType: "CLOUD_FORMATION_TEMPLATE", 
                    ProvisioningArtifactParameters: { 
                      Info: { 
                        "LoadTemplateFromURL": templateUrl
                      },
                      Type: "CLOUD_FORMATION_TEMPLATE"
                    },
                    Description: requestBody.desc,
                    SupportDescription: requestBody.supDesc,
                    SupportEmail: requestBody.email,
                    Tags: [
                      {
                        Key: 'uploadedWith', 
                        Value: 'ccm' 
                      }
                    ]
                  };
                  sc_client.createProduct(product_params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(data);           // successful response
                  });
                res = await sc_client
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