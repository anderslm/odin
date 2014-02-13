var Odin = require("../src/odin"),
    bind = require("mout/function/bind"),
    forEach = require("mout/array/forEach");

var TodoModel = Odin.Model.extend({
    properties: {
        what: "What to do?"
    }
});

var TodoView = Odin.Base.extend({
    storage: null,
    todoList: [],
    list: document.querySelector("#list"),

    inject: {
        storage: "localStorage"
    },

    init: function() {
        var self = this;

        document.querySelector("body").removeChild(document.querySelector("#runGulpFirst"));

        this.storage.get("todo", "items", function(items) {
            forEach(items, function(item) {
                item = JSON.parse(item);
                var todo = new TodoModel(item);

                self.add(todo);
                self.todoList.push(todo);
            });
        });

        document.querySelector("#todo").onchange = bind(this.update, this);

        return this;
    },

    add: function(todo) {
        var li = document.createElement("li");

        li.innerText = todo.what;

        this.list.appendChild(li);
    },

    update: function() {
        this.todoList.push(new TodoModel({ what: document.querySelector("#todo").value }));

        this.storage.update(this.todoList, { store: "todo", key: "items" });
    }
});

new TodoView();