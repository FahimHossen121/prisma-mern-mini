import { useState } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="App">
      <h1>Prisma + React Demo</h1>
      <UserForm onUserAdded={() => setRefresh((r) => !r)} />
      <UserList key={refresh} />
    </div>
  );
}

export default App;
