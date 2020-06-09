// feature 1
import React from "react";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Link } from "react-router-dom";
import AdminScreen from "./screens/AdminScreen";
import HomeScreen from "./screens/HomeScreen";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
        <div className="grid-container">
          <header>
            <Link to="/">React Shopping Cart</Link>
            <Link to="/admin">Admin</Link>
          </header>
          <main>
            <Route path="/admin" component={AdminScreen} exact />
            <Route path="/" component={HomeScreen} exact />

          </main>
          <footer>All rights are reserved.</footer>
        </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
