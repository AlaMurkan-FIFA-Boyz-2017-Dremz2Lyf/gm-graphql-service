import * as uuid from 'uuid';
import { merge } from 'lodash';

export class Player {
  constructor(connector) {
    this.connector = connector;
  }

  getPlayerById(id) {
    return this.connector.getPlayerById(id);
  }

  queryByName(name, from, first) {
    return this.connector.queryByName(name, from, first)
      .then((data) => {
        const edges = data.items.map(node => ({
          node,
        }));

        return {
          edges,
          pageInfo: {
            endCursor: data.cursor,
            hasNextPage: first === edges.length,
          },
        };
      })
      ;
  }

  save(id, body) {
    id = id ? id : uuid.v1();
    return this.connector.save(id, body)
      .then(() => merge(
        {
          id,
        },
        body,
      ))
      ;
  }

  delete(id) {
    return this.connector.remove(id)
      .then(() => ({ id }))
      ;
  }
}
