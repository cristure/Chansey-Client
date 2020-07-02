import React from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Form, Item, Label, Input, Picker, ListItem, CheckBox, Body, List, Left, Right, DatePicker, Spinner, Segment, View, CardItem, Card} from 'native-base';

import { Alert, RefreshControl, FlatList, ScrollView} from 'react-native';
import Globals from './Globals'
import axios from 'axios';


class Consultations extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      token: this.props.token,
      loading: true,
      list: [],
      map: new Map(),
      refreshing: false
    }
  } 

  async componentDidMount () {
    await this.fetchConsultations();
    this.setState({loading : false})
  }

  async fetchConsultations () {
    await axios.get(Globals.BASE_URL + Globals.CONSULTATION + "/" + this.state.token).then((response) => {
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

  getIcon = (index) => {
    console.log(index)
    var status = this.state.list[index].status

    if(status === "Pending")
    {
      return "clock"
    } else if(status === "Confirmed")
    {
      return "check"
    }else if(status === "Rejected"){
      return "cross"
    }else {
      return "edit"
    }
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
                    <Text>{item.specialisationName}</Text>
                   </CardItem>
                     <CardItem>
                    <Body>
                       <Left><Text>
                        {item.specialistName}
                        </Text>
                        </Left>
                        <Right><Icon name={this.getIcon(index)} type="Entypo"></Icon></Right>
                    </Body>
                    </CardItem>
                    <CardItem footer> 
                    <Right><Text>{item.time}</Text></Right>
                    <Text>     {item.status}</Text>
                    
                    </CardItem>
             </Card>
             </ListItem>)}>             
    </FlatList>
    </Content>
    </ScrollView>
      )
      }
    }
  }

export default Consultations;