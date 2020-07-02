import * as React from 'react';
import {View} from 'react-native';
import { AppLoading } from 'expo';
import { Container, Text } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import SignIn from './src/SignIn';
import Dashboard from './src/Dashboard';
import Globals from './src/Globals'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();
export const AuthContext = React.createContext({dude: "light"});


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      token: null,
      loggedIn: false,
      newUser: false
    };
  }

  async componentDidMount() {
    console.disableYellowBox = true;
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  handleLogin = (authorizationToken) => {
    this.state.token = authorizationToken;
    this.flipLogin(true);
    console.log(authorizationToken)

  }

  handleSignup = (authorizationToken) => {
    this.state.token = authorizationToken;
    this.flipRegister(true);
    this.flipLogin(true);
  }

  flipLogin = (x) => {
    this.setState({loggedIn : x});
  }

  flipRegister = (x) => {
    this.setState({newUser : x});
  }

  render(){

    return (
      <View style={styles.container}>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
              headerShown: false
            }}>
              {this.state.token == null ? (
            <Stack.Screen name="SignIn" component={SignIn} initialParams={{authenticate : this.handleLogin, register: this.handleSignup}}/>)
            :
            (
            <Stack.Screen name="Dashboard" component={Dashboard} initialParams={{token : this.state.token, logout: this.handleLogin}}/>
            )
            }
            </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
   }
  }
  
  const styles = {
    container: {
      flex: 1
    },
  };