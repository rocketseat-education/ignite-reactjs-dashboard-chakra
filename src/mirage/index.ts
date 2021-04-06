import { createServer, Model, ActiveModelSerializer, Response } from "miragejs"
import * as factories from './factories'

type User = {
  name: string;
  email: string;
  created_at: Date;
};

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

    environment,

    models: {
      user: Model.extend<Partial<User>>({}),
    },

    factories,

    seeds(server) {
      server.createList("user", 200);
    },

    routes() {
      this.namespace = "api"
      this.timing = 750;

      this.get('/users', function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams

        const total = schema.all('user').length

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const users = this.serialize(schema.all('user')).users
          .slice(pageStart, pageEnd);

        return new Response(
          200,
          { 'x-total-count': String(total) },
          { users }
        )
      });
      this.get('/users/:id');
      this.post('/users');

      this.namespace = ""
      this.passthrough()
    },
  })

  return server
}
