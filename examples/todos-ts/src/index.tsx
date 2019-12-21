import React, { Component, useEffect } from 'react';
import ReactDOM from 'react-dom';
import stores from './stores';
import {TodoStore} from './stores/todos';

const {withStore} = stores;

interface TodoListProps extends TodoStore {
  title: string;
}

class TodoList extends Component<TodoListProps> {
  onRemove = (index) => {
    const {remove} = this.props;
    remove(index);
  }

  onCheck = (index) => {
    const {toggle} = this.props;
    toggle(index);
  }

  render() {
    const {dataSource, title} = this.props;
    return (
      <div>
        <h2>{title}</h2>
        <ul>
          {dataSource.map(({ name, done = false }, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => this.onCheck(index)}
                />
                {done ? <s>{name}</s> : <span>{name}</span>}
              </label>
              <button type="submit" onClick={() => this.onRemove(index)}>-</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const TodoListWidthStore = withStore('todos')(TodoList);

function Todo() {
  const todos = stores.useStore('todos');
  const { dataSource, refresh, add } = todos;

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(name) {
    const todo = await add({ name });
    console.log('Newly added todo is ', todo);
  }

  const noTaskView = <span>no task</span>;
  const loadingView = <span>loading...</span>;
  const taskView = dataSource.length ? <TodoListWidthStore title="Title" /> : (
    noTaskView
  );

  return (
    <div>
      <h2>Todos</h2>
      {!refresh.loading ? taskView : loadingView}
      <div>
        <input
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              onAdd(event.currentTarget.value);
              event.currentTarget.value = '';
            }
          }}
          placeholder="Press Enter"
        />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('ice-container');
ReactDOM.render(<Todo />, rootElement);
