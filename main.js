// ローカルストレージAPI
const STORAGE_KEY = 'todos-vuejs-demo'
const todoStorage = {
  fetch: function() {
    const todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const app = new Vue({
  el: "#app",
  data: {
    todos: [],
    options: [
      { value: -1, label: '全て' },
      { value: 0, label: '作業中' },
      { value: 1, label: '完了' }
    ],
    current: -1,
  },
  watch: {
    // todosを監視, データの内容が変わるとストレージへ保存
    todos: {
      handler: function(todos) {
        todoStorage.save(todos)
      },
      deep: true  // ネストしてるデータも監視
    }
  },
  computed: {
    computedTodos: function() {
      return this.todos.filter(function(el) {
        return this.current < 0 ? true: this.current === el.state
      }, this)
    },
    labels() {
      return this.options.reduce(function(a, b) {
        return Object.assign(a, { [b.value]: b.label })
      }, {})
    }
  },
  created() {
    // インスタンス作成時に自動的にfetch()する
    this.todos = todoStorage.fetch()
  },
  methods: {
    doAdd: function(event, value) {
      const comment = this.$refs.comment
      if (!comment.value.length) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      })
      comment.value = ''
    },
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1
    },
    doRemove: function(item) {
      const index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }
  }
})

