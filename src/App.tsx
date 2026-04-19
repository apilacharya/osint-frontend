import { AppProviders } from "./app/providers";
import { AppShell } from "./app/appShell";
import { BrowserRouter } from "react-router-dom";

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </AppProviders>
);

export default App;
