import React from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Form, Item, Label, Input, Picker, ListItem, CheckBox, Body, List, Left, Right, DatePicker, Spinner, Segment, View, CardItem, Card} from 'native-base';

import { Alert, RefreshControl, FlatList, ScrollView} from 'react-native';
import Globals from './Globals'
import axios from 'axios';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';


class MedicConsultations extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      token: this.props.token,
      loading: true,
      list: [],
      map: new Map(),
      refreshing: false,
      newTime: null,
      isDatePickerVisible: false,
      index: null
    }
  } 

 showDatePicker = (index) => {
    this.setState({index})
    this.setState({isDatePickerVisible: true})
}

 hideDatePicker = () => {
    this.setState({isDatePickerVisible: false})
}

  async componentDidMount () {
    await this.fetchConsultations();
    this.setState({loading : false})
  }

  async fetchConsultations () {
    await axios.get(Globals.BASE_URL + Globals.MEDICCONSULTATION + "/" + this.state.token).then((response) => {
      this.setState({list: Object.values(response.data).reverse()})
      var i=Object.keys(response.data).length-1;
      for(const postId of Object.keys(response.data)){
        this.state.map.set(i, postId);
        i-=1;
      }

      console.log(this.state.map)
    })
    .catch( (error) => {
      console.log(error)
    })
  }

  handleRefresh = () => {
    this.setState({refreshing: true})
    this.fetchConsultations().then(() => {
      this.setState({refreshing: false})
    })
  }


  confirm = (index) => {

    var Object = this.state.list[index]
    console.log(this.state.map.get(index))

    var user_data = {
        "time" : Object["time"],
        "id" : this.state.map.get(index),
        "specialistId" : Object["specialistId"],
        "name" : Object["specialistName"],
        "specialisation_name" : Object["specialisationName"],
        "iconName" : "check",
        "status" : "Confirmed"
      }

      axios.put(Globals.BASE_URL + Globals.MEDICCONSULTATION + "/" + this.state.token, user_data).then( (respone) => {
        Alert.alert(
          "Success",
          "Your data has been updated",
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

  handleEdit = (date) => {
    

    var Object = this.state.list[this.state.index]
    console.log(this.state.map.get(this.state.index))

    var user_data = {
        "time" : moment(date).format('MMMM Do YYYY, H:mm'),
        "id" : this.state.map.get(this.state.index),
        "specialistId" : Object["specialistId"],
        "name" : Object["specialistName"],
        "specialisation_name" : Object["specialisationName"],
        "iconName" : "edit",
        "status" : "Modified"
      }

      axios.put(Globals.BASE_URL + Globals.MEDICCONSULTATION + "/" + this.state.token, user_data).then( (respone) => {
        Alert.alert(
          "Success",
          "Your data has been updated",
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

  reject = (index) => {
    var Object = this.state.list[index]
    console.log(this.state.map.get(index))

    var user_data = {
        "time" : Object["time"],
        "id" : this.state.map.get(index),
        "specialistId" : Object["specialistId"],
        "name" : Object["specialistName"],
        "specialisation_name" : Object["specialisationName"],
        "iconName" : "cross",
        "status" : "Rejected"
      }

      axios.put(Globals.BASE_URL + Globals.MEDICCONSULTATION + "/" + this.state.token, user_data).then( (respone) => {
        Alert.alert(
          "Success",
          "Your data has been updated",
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
      if(this.state.loading){
        return(<Spinner color='blue'/>)
      }
      else{
      return (
        <ScrollView
      refreshControl={ 
        <RefreshControl 
        refreshing={this.state.refreshing} 
        onRefresh={this.handleRefresh} 
        /> 
        } 
      >
      <Content>
        <FlatList style={{flex: 1}}
                data={this.state.list}
                keyExtractor={(index) => this.state.map.get(index)}
                renderItem={({item, index}) => (
                <ListItem >
                 <Card style={{flex: 1, textAlign: 'justify'}}>
                    <CardItem header>
                    <Icon active name="ios-medical"></Icon>
                    <Text>{item.patientName}</Text>
                   </CardItem>
                     <CardItem>
                    <Body style={{flexDirection: "row"}}>
                       
                           <Icon name="check" type="Entypo" onPress={() => this.confirm(index)}></Icon>
                            <Text>Confirm</Text>
                       
                     
                           <Icon name="edit" type="Entypo" onPress={() => this.showDatePicker(index)}></Icon>
                           <Text>Edit</Text>

                           <Icon name="cross" type="Entypo" onPress={() => this.reject(index)}></Icon>
                           <Text>Reject</Text>
                       
                    </Body>
                    </CardItem>
                    <CardItem footer> 
                    <Right><Text>{item.time}</Text></Right>
                    <Text>     {item.status}</Text>
                    
                    </CardItem>
             </Card>
             </ListItem>)}>             
    </FlatList>
    <DateTimePickerModal
                    defaultDate={new Date(moment().format('YYYY-MM-DD'))}
                    minimumDate={new Date(moment().format('YYYY-MM-DD'))}
                    maximumDate={new Date(2021,1,1)}
                    isVisible={this.state.isDatePickerVisible}
                    mode="datetime"
                    onConfirm={(date) => this.handleEdit(date)}
                    onCancel={this.hideDatePicker}
                    />
    </Content>
    </ScrollView>
      )
      }
    }
  }

export default MedicConsultations;