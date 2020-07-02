import React from 'react';
import { View, Text, Footer, Input, Button, Container, Right, Content, Spinner, ListItem, Card, CardItem, Body, Icon} from 'native-base';
import {Dimensions, TextInput, ScrollView, RefreshControl, FlatList, Alert} from 'react-native';
import Globals from './Globals'
import axios from 'axios';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;


class CommentsScreen extends React.Component {

    
    constructor(props) {
        super(props);

        this.state={
            postId: this.props.route.params.postId,
            comments : this.props.route.params.comments,
            text: "",
            placeholder: "   Insert Comment...",
            loading: true,
            refreshing: false,
            token:  this.props.route.params.token

        }
    }

    async componentDidMount () {
        await this.fetchComments();
        this.setState({loading: false})

    }

    async fetchComments (){
        await axios.get(Globals.BASE_URL + Globals.COMMENTS + "/" + this.state.postId).then((response) => {
            this.setState({comments: Object.values(response.data).reverse()})
            console.log(this.state.comments)
          })
          .catch( (error) => {
            console.log(error)
          })
    }

    handleRefresh = () => {
        this.setState({refreshing: true})
        this.fetchComments().then(() => {
          this.setState({refreshing: false})
        })
      }

    postComment = () => {

        var user_data = {
            'id': this.state.postId,
            'message': this.state.text
        }

        if(parseInt(this.state.token) >= 0 && parseInt(this.state.token)<=1000)
        {
          axios.post(Globals.BASE_URL + Globals.MEDIC + "/" + this.state.token, user_data).then( (response) => {
            Alert.alert(
              "Success",
              "Your comment has been added",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );

            this.setState({text : ""})
          })
          .catch((error) => {
            Alert.alert(
              "Failed",
              "Please update your info",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
          })
        }
        else
        {
        axios.post(Globals.BASE_URL + Globals.COMMENT + "/" + this.state.token, user_data).then( (response) => {
            Alert.alert(
              "Success",
              "Your comment has been added",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );

            this.setState({text : ""})
          })
          .catch((error) => {
            Alert.alert(
              "Failed",
              "Please update your info",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
          })
          this.handleRefresh()
        }
    }

    render() {

        var comments = this.state.comments
        if(comments == false){
            return (
                <Container>
                    <ScrollView
            refreshControl={ 
            <RefreshControl 
                      refreshing={this.state.refreshing} 
                     onRefresh={this.handleRefresh} 
                /> 
                } 
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No Comments</Text>
          </View>
          </ScrollView>
           <View>
           <TextInput multiline style={styles.inputStyle} autoCorrect={false} 
             placeholder={this.state.placeholder}
             onChangeText={(text) => this.setState({text})} value={this.state.text}/>
              <Button style={styles.buttonStyle} success onPress={() => this.postComment()}><Text>Post</Text></Button>
           </View>
           </Container>
            )
        }
        else{
        return (
            <Container>
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
            (
            <>
            <FlatList style={{flex: 1}}
                 data={comments}
                 renderItem={({item}) => (
                 <ListItem >
                    <View>
                        <Text>From {item.display_name}</Text>
                        <Text>{item.message}</Text>
                    </View>
                </ListItem>)}>
                 </FlatList>
                 </>)}
                 </Content>
                 </ScrollView>
                 <View>
                 <TextInput multiline style={styles.inputStyle} autoCorrect={false} 
                   placeholder={this.state.placeholder}
                   onChangeText={(text) => this.setState({text})} value={this.state.text}/>
                    <Button style={styles.buttonStyle} success onPress={() => this.postComment()}><Text>Post</Text></Button>
                 </View>
                 </Container>
        )
                 }
             

}
}
export default CommentsScreen;

const styles = {
    inputStyle: {
        position: "absolute", 
        bottom: 0, 
        left: 0,
        width: width*80/100,
        height: height*7/100,
        textAlignVertical: 'center',
        opacity: 1
    },

    buttonStyle: {
        position: "absolute",
        height: height*5/100,
        width: width*20/100,
        bottom: 0, 
        right: 0,
        justifyContent: 'center'
    }
}

