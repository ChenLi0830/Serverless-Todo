/**
 * Created by Chen on 2016-12-07.
 */
'use strict';

let AWS = require("aws-sdk");
let uuid = require("uuid");
let docClient = new AWS.DynamoDB.DocumentClient();

module.exports = (event, context, callback) => {
  const timeStamp = new Date().getTime();
  const data = JSON.parse(event.body);
  
  console.log("data", data);
  
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
  
  docClient.put(params, (err, data) => {
    // handle potential errors
    console.log("err", err);
    console.log("data", data);
    if (err) {
      callback(new Error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2)));
      return;
    }
    // item added Successfully
    console.log("Added item:", JSON.stringify(data, null, 2));
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    };
    callback(null, response);
  });
};
