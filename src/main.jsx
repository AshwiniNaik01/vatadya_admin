// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import "./index.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </>
// );
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // ← add
import { store } from "./app/store"; // ← add (adjust path to your store)
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContest.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Provider store={store}>
        {" "}
        {/* ← wrap */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </>,
);
