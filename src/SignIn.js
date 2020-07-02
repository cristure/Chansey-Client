import React, { useContext } from 'react';
import {View, Text, Dimensions, Image, ImageBackground} from 'react-native';
import {Form, Item, Label, Input, Button, ListItem, Content, Radio, Right, Left, Container} from 'native-base';
import axios from 'axios';
import Globals from './Globals'
import AsyncStorage from '@react-native-community/async-storage';

var myBackground = require('../assets/landing.png');
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;



class SignIn extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
          username: "",
          password: "",
          warning: false,
          register: false,
          confirmPass: '',
          passwordMatch: true
        };

        
      }

    logIn = () => {
        var user = this.state.username;
        var password= this.state.password;
        var credentials = {
            username: user,
            password: password
        }

        const regex = /^([0-9][0-9]{0,2}|1000)$/

        if(parseInt(user) != undefined && parseInt(user) >= 0 && parseInt(user) <= 1000 && password==="medic"){
            this.props.route.params.authenticate(parseInt(user))
            return
        }
        
        axios.post(Globals.BASE_URL + Globals.AUTH, credentials).then( (response) => {
            var myToken = response.data.idToken;
            console.log(myToken)
            this.props.route.params.authenticate(myToken)
        })
        .catch((error) => {
            console.log(error);
            this.setState({warning: true})
        });
        
    }

    signUp = () => {
        if(this.state.password !== this.state.confirmPass){
            this.setState({passwordMatch: false})
        }

        var user = this.state.username;
        var password= this.state.password;
        var credentials = {
            username: user,
            password: password
        }

        axios.post(Globals.BASE_URL + Globals.REGISTER, credentials).then( (response) => {
            var myToken = response.data.idToken;
            this.props.route.params.register(myToken)
        })
        .catch((error) => {
            console.log(credentials)
            console.log(error);
            this.setState({warning: true})
        });




    }

    flipRegister = () => {
        this.setState(previousState => ({register: !previousState.register}))
    }


    renderButtons = () => {
        return(
        <View style={{marginTop: 10}}>
            <Button style={{margin:10}} primary block onPress={this.logIn}>
                <Text style={styles.inputSyle}>Sign In</Text>
            </Button>
            <Button style={{margin:10}} primary block onPress={this.flipRegister}>
                <Text style={styles.inputSyle}>Register</Text>
            </Button>
        </View>
        )
    }

    renderRegister = () => {
        return(
            <View style={{marginTop: 10}}>
            <Button style={{margin:10}} primary block onPress={this.signUp}>
                <Text style={styles.inputSyle}>Sign Up</Text>
            </Button>
            <Label style={styles.warningStyle}>Already have an account?</Label>
            <Button style={{margin:10}} primary block onPress={this.flipRegister}>
                <Text style={styles.inputSyle}>Log In</Text>
            </Button>
            </View>
        )

    }

    render(){
        return(
            <View style={{flex: 1}}>
                <ImageBackground source={myBackground} style={styles.backgroundImage}>
                    <View style={styles.viewStyle}>
                        <Form>
                            <Form>
                                <Item floatingLabel>
                                    <Label style={styles.inputSyle}>Email</Label>
                                    <Input
                                        autoCorrect={false}
                                        onChangeText={(username) => this.setState({username})}
                                        style={styles.inputSyle}
                                    >
                                    </Input>
                                </Item>
                                <Item floatingLabel >
                                <Label style={styles.inputSyle}>Password</Label>
                                    <Input
                                        autoCorrect={false}
                                        onChangeText={(password) => this.setState({password})}
                                        style={styles.inputSyle}
                                        secureTextEntry>
                                    </Input>
                                </Item>
                                {this.state.register ?
                                                        <Item floatingLabel >
                                                        <Label style={styles.inputSyle}>Confirm Password</Label>
                                                        <Input
                                                             autoCorrect={false}
                                                             onChangeText={(confirmPass) => this.setState({confirmPass})}
                                                             style={styles.inputSyle}
                                                             secureTextEntry>
                                                        </Input>
                                                    </Item>
                                                     : null}
                            </Form>
                            <View style={{marginTop: 10}}>
                                {
                                    !this.state.register ? this.renderButtons() : this.renderRegister()
                                }
                                
                                {
                                    this.state.warning ? <Text style={styles.warningStyle}>Username/password are incorrect! Please register or try again</Text> : null
                                }
                            </View>
                        </Form>
                    </View>
            </ImageBackground>
        </View>
        );
    }
}
        

const styles = {
    backgroundImage : {
        flex: 1,
        width: width,
        height: height
    },

    viewStyle: {
        flex: 1,
        flexDirection : 'column',
        justifyContent : 'center',
        margin: 10,
    },

    inputSyle: {
        color: 'white'
    },

    warningStyle: {
        color: 'red', 
        textAlign: 'center',
        fontSize: 13
    }


}
export default SignIn;
