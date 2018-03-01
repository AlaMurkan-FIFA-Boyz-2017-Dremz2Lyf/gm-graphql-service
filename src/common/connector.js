import * as Promise from 'bluebird';
import * as aws from 'aws-sdk';
import { merge } from 'lodash';
import { toBase64, fromBase64 } from './utils';

const debug = require('debug')('connector');

aws.config.setPromisesDependency(Promise);

export class Connector {

  constructor(tableName) {
    this.tableName = tableName;
    this.db = new aws.DynamoDB.DocumentClient({
      httpOptions: { timeout: 3000 },
      logger: { log: /* istanbul ignore next */ msg => debug(msg) },
      convertEmptyValues: true,
    });
  }

  save(id, body) {
    const params = {
      TableName: this.tableName,
      Item: merge(
        {
          id,
        },
        body,
      ),
    };

    return this.db.put(params).promise()
      .tap(debug)
      ;
  }

  remove(id) {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };

    return this.db.delete(params).promise()
      .tap(debug)
      ;
  }

  getById(id) {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };

    return this.db.get(params).promise()
      .tap(debug)
      .then(data => data.Item)
      ;
  }

  queryByName(name, cursor, limit = 40) {
    const params = {
      TableName: this.tableName,
      FilterExpression: 'contains(#name, :name)',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': name,
      },
      Limit: limit,
      ExclusiveStartKey: cursor ?
        fromBase64(cursor) :
        undefined,
      ReturnConsumedCapacity: 'TOTAL',
    };

    return this.db.scan(params).promise()
      .tap(debug)
      .then(data => ({
        cursor: data.LastEvaluatedKey ?
          toBase64(data.LastEvaluatedKey) :
          undefined,
        items: data.Items,
      }))
      ;
  }
}
