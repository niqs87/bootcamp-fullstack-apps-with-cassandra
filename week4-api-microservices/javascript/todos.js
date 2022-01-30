require("dotenv").config();
const { client } = require("./connection");
const cassandra = require("cassandra-driver");

let todoMapper = null;

process.on("exit", () => client.shutdown());

module.exports = {
  client,
  todoMapper,
  init: async () => {
    await client.connect();
    await client.execute(`CREATE TABLE IF NOT EXISTS todoitems (
          user_id         TEXT,
          item_id         TIMEUUID,
          title           TEXT,
          url             TEXT,
          completed       BOOLEAN,
          offset          INT,
          PRIMARY KEY ((user_id), item_id)
      ) WITH CLUSTERING ORDER BY (item_id ASC);`);

    const mapper = new cassandra.mapping.Mapper(client, {
      models: {
        Todos: {
          tables: ["todoitems"],
          keyspace: process.env.ASTRA_DB_KEYSPACE,
          columns: {
            offset: "order",
          },
        },
      },
    });
    todoMapper = mapper.forModel("Todos");
  },
  getTodos: async (userId) => {
    const res = await todoMapper.find({ user_id: userId });
    if (res.length) {
      return res
        .toArray()
        .map((item) => ({ ...item, item_id: item.item_id.toString() }));
    }
    return [];
  },
  getCompletedTodos: async (userId) => {
    const res = await todoMapper.find({ user_id: userId });
    if (res.length) {
      return res
        .toArray()
        .filter((item) => item.completed === true)
        .map((item) => ({ ...item, item_id: item.item_id.toString() }));
    }
    return [];
  },
  deleteTodos: async () => {
    await client.execute("TRUNCATE TABLE todoitems");
    return [];
  },
  createTodo: async (todo) => {
    const item_id = cassandra.types.TimeUuid.now().toString();
    const newTodo = {
      item_id,
      completed: false,
      ...todo,
      url: todo.url + "/" + item_id,
    };
    await todoMapper.insert(newTodo);
    return newTodo;
  },
  updateTodo: async (userId, itemId, todo) => {
    const updatedTodo = {
      user_id: userId,
      item_id: itemId,
      ...todo,
    };
    await todoMapper.update(updatedTodo);
    return updatedTodo;
  },
  deleteTodo: async (userId, itemId) => {
    await todoMapper.remove({ user_id: userId, item_id: itemId });
    return {
      userId,
      itemId,
    };
  },
  getTodo: async (userId, itemId) => {
    const res = await todoMapper.get({ user_id: userId, item_id: itemId });
    if (res) {
      return { ...res, item_id: res.item_id.toString() };
    }
    return null;
  },
};
