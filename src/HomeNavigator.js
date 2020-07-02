import React from 'react';
import { View, Text} from 'native-base';
import Globals from './Globals'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'
import CommentsScreen from './CommentsScreen'
import SearchBody from './SearchBody'

const Stack = createStackNavigator();

export default class HomeNavigator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          token: this.props.route.params.token,
          newUser: this.props.route.params.newUser,
          logout: this.props.route.params.logout
          
        };
      }


    render() {
        return( 
            <Stack.Navigator screenOptions={{
                headerShown: false
              }}>
                <Stack.Screen name="Home" component={Home} initialParams={{token : this.state.token, logout: this.state.logout}}/>
                <Stack.Screen name="Comments" component={CommentsScreen} initialParams={{token : this.state.token}}/>
                <Stack.Screen name="SearchBody" component={SearchBody} initialParams={{token : this.state.token}}/>
            </Stack.Navigator>
        )}
}

