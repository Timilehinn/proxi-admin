import './App.css';
import Login from './pages/LoginView/LoginView'
import Register from './pages/RegistrationView/register'
import { Route, Switch } from "react-router-dom";
import DashboardHome from './pages/Dashboard/HomeView/home'
import UsersView from './pages/Dashboard/UsersView/users'
import VendorsView from './pages/Dashboard/VendorsView/vendors'
import AdminsView from './pages/Dashboard/AdminsView/admins'
import ReportView from './pages/Dashboard/ReportView/reports'
import PlansView from './pages/Dashboard/PlansView/plans'
import CategoryView from './pages/Dashboard/CategoryView/category'
import AdvertView from './pages/Dashboard/AdvertView'
import ProtectedRoute from './components/Protectedroute/protectedRoute';
import Errorpage from './pages/404.js'


function App() {
  return (
    <Switch>
      <Route path='/' component={Login} exact />
      <Route path='/admin/register/:token' component={Register} exact />
      <ProtectedRoute path='/dashboard/home' component={DashboardHome} exact />
      <ProtectedRoute path='/dashboard/users' component={UsersView} exact />
      <ProtectedRoute path='/dashboard/vendors' component={VendorsView} exact />
      <ProtectedRoute path='/dashboard/admins' component={AdminsView} exact />
      <ProtectedRoute path='/dashboard/reports' component={ReportView} exact />
      <ProtectedRoute path='/dashboard/adverts' component={AdvertView} exact />
      <ProtectedRoute path='/dashboard/plans' component={PlansView} exact />
      <ProtectedRoute path='/dashboard/categories' component={CategoryView} exact />
      <Route path="*" component={Errorpage} />
    </Switch>
  );
}

export default App;
