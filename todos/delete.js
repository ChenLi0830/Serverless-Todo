/**
 * Created by Chen on 2016-12-09.
 */

'use strict';

let AWS = require("aws-sdk");

// AWS.config.update({
//   region: "us-east-1",
//   endpoint: "http://localhost:8000"
// });

let docClient = new AWS.DynamoDB.DocumentClient();


module.exports = (event, context, callback) => {
  console.log("event.pathParameters.id", event.pathParameters.id);
  let params =  {
    "TableName": "todos2",
    "Key": {
      "id": event.pathParameters.id
    },
    "ReturnValues": "ALL_OLD"
  };
  
  docClient.delete(params, (err, data) => {
    if (err) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(err));
    }
    
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    };
    callback(null, response);
  });
};
