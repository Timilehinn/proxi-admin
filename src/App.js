import './App.css';
import Login from './pages/LoginView/LoginView'
import { Route, Switch } from "react-router-dom";
import DashboardHome from './pages/Dashboard/HomeView/home'
import UsersView from './pages/Dashboard/UsersView/users'
import VendorsView from './pages/Dashboard/VendorsView/vendors'
import ProtectedRoute from './components/Protectedroute/protectedRoute';
function App() {
  return (
    <Switch>
      <Route path='/' component={Login} exact />
      <ProtectedRoute path='/dashboard/home' component={DashboardHome} exact />
      <ProtectedRoute path='/dashboard/users' component={UsersView} exact />
      <ProtectedRoute path='/dashboard/vendors' component={VendorsView} exact />
      {/* <ProtectedRoute path='/folder/:name' component={Folder} exact /> */}
      {/* <Route path="*" component={()=>{return (<h1>error page</h1>)}} /> */}
  </Switch>
  );
}

export default App;
