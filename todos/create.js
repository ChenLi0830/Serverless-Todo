/**
 * Created by Chen on 2016-12-07.
 */
'use strict';

let AWS = require("aws-sdk");

// AWS.config.update({
//   region: "us-east-1",
//   endpoint: "http://localhost:8000"
// });

let uuid = require("uuid");
let docClient = new AWS.DynamoDB.DocumentClient();

module.exports = (event, context, callback) => {
  const timeStamp = new Date().getTime();
  
  // console.log("event.body", event.body);
  // console.log("typeof event.body", typeof event.body);
  
  const data = typeof event.body === "object" ? event.body : JSON.parse(event.body);
  
  // console.log("data", data);
  
  if (typeof data.text !== 'string') {
    console.error("Invalid input: todo must be a string");
    callback(new Error('Couldn\'t create the todo item.'));
    return;
  }
  
  const params = {
    TableName: "todos",
    Item: {
      id: uuid.v4(),
      text: data,
      checked: false,
      createdAt: timeStamp,
      updatedAt: timeStamp,
    }
  };
  
  // write the todo to the database
  docClient.put(params, (err, data) => {
    // handle potential errors
    console.log("data", data);
    if (err) {
      console.log("An error occurred:", err);
      callback(new Error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2)));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    };
    callback(null, response);
  });
};
