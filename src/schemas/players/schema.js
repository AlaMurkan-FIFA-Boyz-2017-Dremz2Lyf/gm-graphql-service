export const schema = `
  type Player {
    id: String!
    username: String!
  }

  type Query {
    getPlayer(id:String!): Player
  }

  type Mutation {
    savePlayer (
      id: String!
      username: String!
    ): Player
    deletePlayer (
      id: String!
    ): Player
  }
`;
