export const resolvers = {
  Query: {
    getPlayer(_, {id}, ctx) {
      return ctx.models.Players.getPlayer(id);
    }
  },
  Mutations: {
    savePlayer(_, args, ctx) {
      return ctx.models.Players.createPlayer(args);
    },
    deletePlayer(_, {id}, ctx) {
      return ctx.models.Players.deletePlayer(id);
    }
  }
}