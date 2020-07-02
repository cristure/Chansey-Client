import SignIn from '../src/SignIn';
import Dashboard from '../src/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNavigationContainer } from 'react-navigation';

const Navigator = createStackNavigator({
    Dashboard: Dashboard,
    SignIn: SignIn 
});

export default createNavigationContainer(Navigator);