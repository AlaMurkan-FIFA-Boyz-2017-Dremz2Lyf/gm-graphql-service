import { graphqlLambda } from 'graphql-server-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { cors, maxAge3, noCache } from '../common/utils';
import { Connector } from '../common/connector';
import { Thing } from '../schema/thing';
import schema from '../schema';

const debug = require('debug')('handler');

export const handle = (event, context, cb) => {
  debug('event: %j', event);
  debug('context: %j', context);

  const callbackFilter = (error, output) => {
    cb(error, merge(
      {},
      output,
      cors,
      event.httpMethod === 'GET' ? maxAge3 : noCache,
    ));
  };

  graphqlLambda(
    (event, context) => {
      const headers = event.headers;
      const functionName = context.functionName;

      return {
        schema,
        context: {
          headers,
          functionName,
          event,
          context,
          models: {
            Player: new Player(new Connector(process.env.TABLE_NAME)),
          },
        },
      };
    },
  )(event, context, callbackFilter);
};
