import React from 'react';
import {Footer, FooterTab, Button, Icon, Text} from 'native-base';
import HomeNavigator from './HomeNavigator';
import Profile from './Profile';
import Ask from './Ask';
import Nurse from './Nurse';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MedicProfile from './MedicProfile'



const Tab = createBottomTabNavigator();

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.route.params.token,
      logout: this.props.route.params.logout
    };
  }

  render(){
    if(parseInt(this.state.token) >= 0 && parseInt(this.state.token)<=1000){
      return(
        
        <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;

                  if(route.name === 'Home') {
                    iconName = "home";
                  }else if (route.name === 'Profile'){
                    iconName = "person";
                  }
                  return <Icon name={iconName} size={size} color={color}/>;
                }})}
                tabBarOptions={{
                  activeTintColor: 'blue',
                  inactiveTintColor: 'gray',
                }}
                >
                  <Tab.Screen name="Home" component = {HomeNavigator} initialParams={{token : this.state.token, logout: this.state.logout}}/>
                  <Tab.Screen name="Profile" component = {MedicProfile} initialParams={{token : this.state.token}} />
                </Tab.Navigator>
              )
      
    }else{
    return(
      
        <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;

                  if(route.name === 'Home') {
                    iconName = "home";
                  }else if (route.name === 'Profile'){
                    iconName = "person";
                  }else if (route.name === 'Ask'){
                    iconName = "question";
                  }else if (route.name === 'Nurse Joy'){
                    iconName = "user-nurse";
                  }

                  if(route.name === "Ask" || route.name === "Nurse Joy"){
                    return <Icon name={iconName} type="FontAwesome5" size={size} color={color}/>;
                  }else{
                    return <Icon name={iconName} size={size} color={color}/>;
                  }
                }})}
                tabBarOptions={{
                  activeTintColor: 'blue',
                  inactiveTintColor: 'gray',
                }}
                >
                  <Tab.Screen name="Home" component = {HomeNavigator} initialParams={{token : this.state.token, logout: this.state.logout}}/>
                  <Tab.Screen name="Profile" component = {Profile} initialParams={{token : this.state.token}} />
                  <Tab.Screen name="Ask" component = {Ask} initialParams={{token : this.state.token}}/>
                  <Tab.Screen name="Nurse Joy" component = {Nurse} initialParams={{token : this.state.token}}/>
                </Tab.Navigator>
              )
            
            
            
            }
          }
        }