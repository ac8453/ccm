const AWS = require("aws-sdk")

const s3 = new AWS.S3({ signatureVersion: "v4", region: process.env.REGION });
let body;
let statusCode = 200;
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
// Change this value to adjust the signed URL"s expiration
const URL_EXPIRATION_SECONDS = 300

// Main Lambda entry point
exports.handler = async (event) => {
  return await getUploadURL(event)
}

const getUploadURL = async function (event) {
  const Key = `${AWS.util.uuid.v4()}.json`

  // Get signed URL from S3
  const s3Params = {
    Bucket: process.env.s3_bucket + '/templates',
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: "application/json",

    // This ACL makes the uploaded object publicly readable. You must also uncomment
    // the extra permission for the Lambda function in the SAM template.

    // ACL: "public-read"
  }

  console.log("Params: ", s3Params)
  const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params)
  body = JSON.stringify({
    uploadURL: uploadURL,
    Key
  })
  const response = { statusCode, headers, body }
  console.log("Response: ", response)
  return response
}