const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];

const client = new todoPackage.Todo(
  "localhost:4000",
  grpc.credentials.createInsecure()
);
console.log("Passed text:", text);

client.createTodo(
  {
    id: -1,
    text: text,
  },
  (err, response) => {
    console.log("Recieved from server " + JSON.stringify(response));
  }
);

//one req & res from server
/*
client.readTodos(null, (err, response) => {
    console.log("read the todos from server " + JSON.stringify(response))
    if (!response.items)
        response.items.forEach(a=>console.log(a.text));
})
*/

//for continues stream...
const call = client.readTodosStream();
call.on("data", (item) => {
  console.log("Received from server " + JSON.stringify(item));
});

call.on("end", (e) => console.log("Fetched all!"));
