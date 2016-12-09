/**
 * Created by Chen on 2016-12-08.
 */

'use strict';

let AWS = require("aws-sdk");

// AWS.config.update({
//   region: "us-east-1",
//   endpoint: "http://localhost:8000"
// });

let docClient = new AWS.DynamoDB.DocumentClient();

module.exports = (event, context, callback) => {
  const timeStamp = new Date().getTime();
  
  console.log("event.body", event.body);
  console.log("typeof event.body", typeof event.body);
  
  const data = JSON.parse(event.body);
  
  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed'); // eslint-disable-line no-console
    callback(new Error('Couldn\'t update the todo item.'));
    return;
  }
  
  const params = {
    TableName: 'todos2',
    Key: {
      "id": event.pathParameters.id
    },
    UpdateExpression: 'set #t = :text, checked = :checked, updatedAt = :date',
    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
      '#t' : 'text'
    },
    ExpressionAttributeValues:{
      ":text": data.text,
      ":checked": true,
      ":date": timeStamp
    },
    ReturnValues: 'UPDATED_NEW'
  };
  
  // write the todo to the database
  docClient.update(params, (err, data) => {
    // handle potential errors
    console.log("data", data);
    if (err) {
      console.log("An error occurred:", err);
      callback(new Error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2)));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    };
    callback(null, response);
  });
};