/**
 * Created by Chen on 2016-12-07.
 */
'use strict';

let AWS = require("aws-sdk");

let docClient = new AWS.DynamoDB.DocumentClient();

module.exports = (event, context, callback) => {
  const timeStamp = new Date().getTime();
  const data = JSON.parse(event.body);
  
  console.log("data", data);
  
  if (typeof data.text !== 'string') {
    console.error("Invalid input: todo must be a string");
    callback(new Error('Couldn\'t create the todo item.'));
  }
  
  const response = {
    statusCode: 200,
    // body: JSON.stringify(event.body)
    body: JSON.stringify(data)
  };
  
  callback(null, response);
  // const params = {
  //   TableName: "todos",
  //   Item: {
  //     text: data
  //   }
  // }
  
};
