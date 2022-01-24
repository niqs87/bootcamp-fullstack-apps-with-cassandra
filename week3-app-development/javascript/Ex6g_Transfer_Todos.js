const { client } = require("./connection");

console.log("========================================");
console.log("Start exercise");

(async () => {
    try {
      const result = await client.execute(
        "SELECT * FROM todoitems;"
      );
      for (const row of result.rows) {
        console.log(row.user_id);
        console.log("INSERT INTO todoitems (user_id, item_id, completed, title) VALUES ( 'kamil', %s, false, %s);", row.item_id, row.title);
        await client.execute("INSERT INTO todoitems (user_id, item_id, completed, title) VALUES ( 'kamil', ?, false, ?);", [row.item_id, row.title]);
      }
      console.log("SUCCESS");
    } catch (e) {
      console.log(e);
    }
    console.log("========================================");
    process.exit();
})();