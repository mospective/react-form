import useLocalStorage from "./utils/useLocalStorage";
import Form, { FormData } from "./components/Form/Form";
import Table from "./components/Table/Table";
import "./App.css";

export type User = {
  id: string;
  name: string;
  email: string;
  country: string;
};

function App() {
  // Using a custom hook to convert json to string and vice-versa the push or retrieve from the browser's localStorage (behaviour similar to useState hook)
  const [users, setUsers] = useLocalStorage<User[]>("users", []);
  const addUser = (newUser: User) => setUsers([...users, newUser]);
  const removeUser = (id: string) => setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  const handleFormSubmit = (formData: FormData) => {
    const { name, email, country } = formData;
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      country,
    };

    addUser(newUser);
  }

  return (
    <>
      <main className="main layout">
        <div className="layout-child">
          <div className="form-interface">
            <Form onSubmit={handleFormSubmit} />
            <Table users={users} removeUser={removeUser} />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
