import React from 'react';
import { View, Text, Spinner, Container, Header, Content, Card, CardItem, Body, ListItem, Left, Right, Icon, Item, Input, Button} from 'native-base';
import {ScrollView, Image, StyleSheet, FlatList, Dimensions, ImageBackground, RefreshControl} from 'react-native';
import Globals from './Globals'
import axios from 'axios';
import { StackActions } from 'react-navigation';


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

class Home extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
            posts : [],
            map: new Map(),
            loading: true,
            refreshing: false,
            token: this.props.route.params.token,
            search: null,
            placeholder : null
        }
    }

    async componentDidMount() {
        await this.fetchInfo();
        this.setState({loading: false})
        if(parseInt(this.state.token) >= 0 && parseInt(this.state.token)<=1000){
          this.setState({placeholder : "Search for a user"})
        }else{
          this.setState({placeholder : "Search for a specialist"})
        }

      }

    async fetchInfo () {
        await axios.get(Globals.BASE_URL + Globals.POSTS).then((response) => {
            this.setState({posts: Object.values(response.data).reverse()})
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
      this.fetchInfo().then(() => {
        this.setState({refreshing: false})
      })
    }

    logout = () => {
      this.props.route.params.logout(null)
    }

    search = () => {
      console.log("as")
      this.props.navigation.push('SearchBody', {search: this.state.search})
    }



    render() {

        var posts= this.state.posts;

        return (
    <Container>
    <Header searchBar
    rounded>
       <Item>
                    <Icon name="search" onPress={this.search}/>
                    <Input 
                        value = {this.state.search}
                        placeholder = {this.state.placeholder}
                        onChangeText = { (search) => this.setState({search})}
                        
                    />
                    <Button transparent onPress={this.logout}>
                            <Icon name="power"/>
                        </Button>
                    </Item>
                        
      </Header>
    <ScrollView
      refreshControl={ 
        <RefreshControl 
        refreshing={this.state.refreshing} 
        onRefresh={this.handleRefresh} 
        /> 
        } 
      >
    <Content>
    {this.state.loading ? (<Spinner color='blue'/>) :
    (<>
    <FlatList style={{flex: 1}}
                data={posts}
                keyExtractor={(index) => this.state.map.get(index)}
                renderItem={({item, index}) => (
                <ListItem >
                 <Card style={{flex: 1, width: width, textAlign: 'justify'}}>
                    <CardItem header>
                    <Left><Text>{item.title}</Text></Left>
                    <Right><Text>({item.category})</Text></Right>
                   </CardItem>
                     <CardItem>
                    <Body>
                       <Text>
                        {item.message}
                        </Text>
                    </Body>
                    </CardItem>
                    <CardItem footer>
                    <Body style={{flex: 1, flexDirection: 'row', right: 0}}>
                    <Icon active id={item.id} style={{padding: 10}} name="ios-arrow-dropup-circle" type="Ionicons"></Icon>
                      <Text style={{padding: 10}}>{item.votes}</Text>
                      <Icon style={{padding: 10}} name="comment-medical" onPress={() => {this.props.navigation.push('Comments', {postId: this.state.map.get(index),comments: item.comments})}} type="FontAwesome5"></Icon>
                    </Body>
                    <Right><Text>From {item.display_name}</Text></Right>
                    </CardItem>
             </Card>
             </ListItem>)}>
    </FlatList>
    </>)}
    </Content>
    </ScrollView>
  </Container>
        )

}
}
export default Home;