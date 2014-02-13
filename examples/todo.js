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

                self.doAdd(todo);
            });
        });

        document.querySelector("#todo").onkeypress = bind(this.add, this);

        return this;
    },

    doAdd: function(todo) {
        var li = document.createElement("li");
        var id = document.createAttribute("id");

        todo.id = this.todoList.length;

        id.value = todo.id;
        li.setAttributeNode(id);
        li.innerHTML = todo.what + "<a href='#'>[Delete]</a>";

        this.list.appendChild(li);
        this.todoList.push(todo);
    },

    add: function(event) {
        if(13 === event.keyCode)
        {
            this.doAdd(new TodoModel({ what: document.querySelector("#todo").value }));

            this.storage.update(this.todoList, { store: "todo", key: "items" });

            document.querySelector("#todo").value = "";
        }
    }
});

new TodoView();