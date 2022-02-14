import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_LISTS_QUERY = gql`
  query {
    lists {
      id
      name
      status
      tasks {
        id
        name
        description
        status
      }
    }
  }
  `;

const CREATE_TASK_QUERY = gql`
  mutation($listId: Int!, $name: String!, $description: String!){
    createTask(listId: $listId, name: $name, description: $description) {
      id
    }
  }
`;

const DELETE_TASK_QUERY = gql`
  mutation($id: Int!){
    deleteTask(id: $id)
  }
`;

const CREATE_LIST_QUERY = gql`
mutation($name: String!){
  createList(name: $name) {
      id
    }
  }
`;

const DELETE_LIST_QUERY = gql`
  mutation($id: Int!){
    deleteList(id: $id)
  }
`;

function Task(props) {
  return (
    <div>
      <div>
        <input type='text' placeholder='Title' value={props.name} />
      </div>
      <div>
        <textarea placeholder='Description' value={props.description} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Dashboard />
  );
}

function createTask(listId, mutation, refetch) {
  const nameEl = document.getElementById('Title' + listId);
  const name = nameEl.value;
  const descEl = document.getElementById('Description' + listId);
  const description = descEl.value;
  mutation({ variables: { listId: listId, name: name, description: description } });
  nameEl.value = '';
  descEl.value = '';
  setTimeout(() => {
    refetch();
  }, 500);
}

function createList(mutation, refetch) {
  const nameEl = document.getElementById('ListTitle');
  const name = nameEl.value;
  mutation({ variables: { name: name } });
  nameEl.value = '';
  setTimeout(() => {
    refetch();
  }, 500);
}

function deleteTask(taskId, mutation, refetch) {
  mutation({ variables: { id: taskId } });
  setTimeout(() => {
    refetch();
  }, 500);
}

function deleteList(listId, mutation, refetch) {
  mutation({ variables: { id: listId } });
  setTimeout(() => {
    refetch();
  }, 500);
}

function Dashboard() {

  const { loading, error, data, refetch } = useQuery(GET_LISTS_QUERY);
  const [ createTaskMutation ] = useMutation(CREATE_TASK_QUERY);
  const [ createListMutation ] = useMutation(CREATE_LIST_QUERY);
  const [ deleteTaskMutation ] = useMutation(DELETE_TASK_QUERY);
  const [ deleteListMutation ] = useMutation(DELETE_LIST_QUERY);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const toDoLists = data.lists.map((toDoList) => {
    const tasks = toDoList.tasks.map((t) => {
      return (
        <div class="task">
          <input value={t.name} placeholder="Task title" />
          <textarea value={t.description} placeholder="Task description" />
          <button onClick={e => deleteTask(t.id, deleteTaskMutation, refetch)}>Delete</button>
        </div>
      );
    });
    return (
      <div class="to-do-list">
        <input value={toDoList.name} placeholder="ToDo list title" />
        <div>
          {tasks}
          <div class="task">
            <input placeholder="Task title" id={'Title' + toDoList.id} />
            <textarea placeholder="Task description" id={'Description' + toDoList.id} />
            <button onClick={e => createTask(toDoList.id, createTaskMutation, refetch)}>Save new</button>
          </div>
        </div>
        <button onClick={e => deleteList(toDoList.id, deleteListMutation, refetch)}>Delete list</button>
      </div>
    );
  });
  return (
    <div>
      <h1>ToDo List App</h1>
      <div>{toDoLists}</div>
      <div class="to-do-list new">
        <input id="ListTitle" placeholder="ToDo list title" />
        <button onClick={e => createList(createListMutation, refetch)}>Create a new list</button>
      </div>
    </div>
  );
}

export default App;
