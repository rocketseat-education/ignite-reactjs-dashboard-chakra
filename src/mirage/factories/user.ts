import faker from "faker";
import { Factory } from "miragejs";

export const user = Factory.extend({
  name(i: number) {
    return `User ${i + 1}`;
  },
  email() {
    return faker.internet.email().toLocaleLowerCase();
  },
  createdAt() {
    return faker.date.recent(5, new Date());
  },
})