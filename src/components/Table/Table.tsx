import { User } from "../../App";
import "./table.css";

type TableProps = {
  users: User[];
  removeUser: (id: string) => void;
};

// I didn't have the time to refactor this component to be fully reusable
const Table = ({ users, removeUser }: TableProps) => {
  if (users.length === 0) {
    return <div className="no-data">
      <p>No data found</p>
    </div>;
  }

  return (
    <div className="table-container">
      <h2>User details</h2>
      <table role="table" summary="User details: name, email and country">
        <caption>User details</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader">Name</th>
            <th role="columnheader">Email</th>
            <th role="columnheader">Country</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {users.map((item: User) => {
            return (
              <tr key={item.id} role="row">
                <td role="cell">{item.name}</td>
                <td role="cell">{item.email}</td>
                <td role="cell">{item.country}</td>
                <td role="cell">
                  <button className="delete-button" onClick={() => removeUser(item.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
