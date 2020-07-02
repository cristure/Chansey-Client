import React from 'react';
import { View, Text, Footer, Input, Button, Container, Right, Content, Spinner, ListItem, Card, CardItem, Body, Icon, Form, Item, Label, Thumbnail} from 'native-base';
import {Dimensions, TextInput, ScrollView, RefreshControl, FlatList, Alert, Image} from 'react-native';
import Globals from './Globals'
import axios from 'axios';
import Emoji from 'react-native-emoji';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var photo = require("../assets/pngguru.png")
var user_photo = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/613.png"

class SearchBody extends React.Component {

    constructor(props) {
        super(props);

        this.state={
            search : this.props.route.params.search,
            loading: true,
            specialist: {},
            specialisations : new Map([
                ["General practice", 15],
                ["Internal medicine", 19],
                ["Gastroenterology", 14],
                ["Urology", 42],
                ["Gynecology", 18],
                ["Surgery", 39],
                ["Psychiatry", 36],
                ["Orthopedics", 31],
                ["Rheumatology", 41],
                ["Allergology", 5],
                ["Otolaryngology", 32],
                ["Cardiology", 1],
                ["Pulmonology", 35],
                ["Neurology", 27],
                ["Dentistry", 43],
                ["Ophthalmology", 30],
                ["Infectiology", 23],
                ["Endocrinology", 12],
                ["Nephrology", 26],
                ["Dermatology", 11]
            ]
            ),
            notFound: false,
            isDatePickerVisible: false,
            newTime: null,
            token: this.props.route.params.token
        }

        
    }

    async componentDidMount () {

        await this.searchQuery();
        this.setState({loading: false})

    }

    async searchQuery() {
        if(parseInt(this.state.token) >= 0 && parseInt(this.state.token)<=1000){
            await axios.get(Globals.BASE_URL + Globals.USERS + "/" + this.state.search.replace(/ /g,'')).then((response) => {
                this.setState({specialist: response.data})
                console.log(this.state.specialist)
            })
            .catch((error) => {
                console.log(error)
                this.setState({notFound: true})
            })
        
        }
        else {
        await axios.get(Globals.BASE_URL + Globals.SPECIALISTS + "/" + this.state.search.replace(/ /g,'')).then((response) => {
            this.setState({specialist: response.data})
            console.log(this.state.specialist)
        })
        .catch((error) => {
            console.log(error)
            this.setState({notFound: true})
        })
    }
    
    }

    lookupSpecialisation = (id) => {
        for (const [key, val] of this.state.specialisations.entries()){
            if(val === id){
                return key
            }
        }
    }

    lookupLanguages = (languages) => {
        
        return(
            <View style={{flexDirection: 'row'}}>
            {languages.includes("Deutsch") ? <Emoji name="de" style={{paddingRight: 10}}></Emoji> : null}
            {languages.includes("English") ? <Emoji name="gb"></Emoji> : null}
            </View>
        )

    
    }

    showDatePicker = () => {
        this.setState({isDatePickerVisible: true})
    }

    hideDatePicker = () => {
        this.setState({isDatePickerVisible: false})
    }

    handleConfirm = (date) => {
        this.hideDatePicker();
        this.setState({newTime: moment(date).format('MMMM Do YYYY, H:mm')})

        var user_data = {
            "time" : this.state.newTime,
            "id" : this.state.specialist["ID"],
            "name" : this.state.specialist["First Name"] + " " + this.state.specialist["Last Name"],
            "specialisation_name" : this.lookupSpecialisation(this.state.specialist["Specialisation"])
        }

        axios.post(Globals.BASE_URL + Globals.POSTCONSULTATION + "/" + this.state.token, user_data).then( (response) => {
            Alert.alert(
                "Success",
                "Your request has been sent",
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
              );
        })
        .catch((error) => {
            Alert.alert(
                "Failed",
                "Something went wrong",
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
              );
            })

        
        }



    render() {
        
        if(this.state.loading) 
        {
            return(<Spinner color="blue"/>)
        }else{
            if(this.state.notFound){
                return(
                <View>
                    <Text>Specialist not found. Please try again</Text>
                </View>
                )
            }else{
                if(parseInt(this.state.token) >= 0 && parseInt(this.state.token)<=1000){
                    return(
                        <View style={{flex: 1}}>
                 <Thumbnail large source={{uri : user_photo}} style={{marginLeft: 'auto', marginRight: 'auto', padding: 50, marginTop: 50}}/>
                <Form style={{flex: 1}}> 
                    <Item fixedLabel style={{padding: 10}}>
                        <Label>Full Name</Label>
                        <Text>{this.state.specialist["first_name"]} {this.state.specialist["last_name"]} </Text>
                    </Item>
                    <Item fixedLabel style={{padding: 10}}>
                        <Label>Gender</Label>
                        <Text>{this.state.specialist["gender"]}</Text>
                    </Item>
                    <Item fixedLabel style={{padding: 10}}>
                        <Label>Location</Label>
                        <Text>{this.state.specialist["location"]}</Text>
                    </Item>
                    <Item fixedLabel style={{padding: 10}}>
                        <Label>Phone Number</Label>
                        <Text>{this.state.specialist["phone_number"]}</Text>
                    </Item>
                    <Item fixedLabel style={{padding: 10}}>
                        <Label>Languages</Label>
                        {this.lookupLanguages(this.state.specialist["languages"])}
                    </Item>
                </Form>
            </View>)
                    
                }

            else{
            return (
            <View style={{flex: 1}}>
                 <Thumbnail large source={photo} style={{marginLeft: 'auto', marginRight: 'auto', padding: 50, marginTop: 50}}/>
                <Form style={{flex: 1}}> 
                    <Item fixedLabel style={{padding: 10}}>
                        <Label>Full Name</Label>
                        <Text>{this.state.specialist["First Name"]} {this.state.specialist["Last Name"]} </Text>
                    </Item>
                    <Item fixedLabel style={{padding: 10}}>
                        <Label>Location</Label>
                        <Text>{this.state.specialist["Location"]}</Text>
                    </Item>
                    <Item fixedLabel style={{padding: 10}}>
                        <Label>Specialisation</Label>
                        <Text>{this.lookupSpecialisation(this.state.specialist["Specialisation"])}</Text>
                    </Item>
                    <Item fixedLabel style={{padding: 10}}>
                        <Label>Languages</Label>
                        {this.lookupLanguages(this.state.specialist["Language"])}
                    </Item>
                </Form>
                <Right>
                <Button success onPress={this.showDatePicker}><Text>Book Consultation</Text>
                </Button>
                </Right>
                <DateTimePickerModal
                    defaultDate={new Date(moment().format('YYYY-MM-DD'))}
                    minimumDate={new Date(moment().format('YYYY-MM-DD'))}
                    maximumDate={new Date(2021,1,1)}
                    isVisible={this.state.isDatePickerVisible}
                    mode="datetime"
                    onConfirm={(date) => this.handleConfirm(date)}
                    onCancel={this.hideDatePicker}
                    />
            </View>)
        }
    }
    }

    }


}
export default SearchBody;