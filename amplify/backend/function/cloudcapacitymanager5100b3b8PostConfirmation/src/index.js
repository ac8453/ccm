var aws = require('aws-sdk');
var ddb = new aws.DynamoDB();
exports.handler = async (event, context, callback) => {
  console.log(event)
  if (event.request.userAttributes.sub) {
    var params = {
      TableName: 'CCMAccounts-dev',
      Item: {
        'id': { S: event.request.userAttributes.sub },
        'email': { S: event.request.userAttributes.email },
        'accountId': { NULL: true },
        'externalId': { S: context.awsRequestId }
      }
    };
    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  }
  callback(null, event);
};