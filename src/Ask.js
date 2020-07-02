import React from 'react';
import {Image, Dimensions, Keyboard,Alert} from 'react-native';
import {Text, Form, Item, Label, Input, Textarea, Container, Content, Header, Picker, Icon, Left, Button, Right} from 'native-base';
import Globals from './Globals';
import axios from 'axios';



var image = require('../assets/question_mark.png')
var doctor = require('../assets/doctor_oak.png')
const width = Dimensions.get('window').width;
class Ask extends React.Component {

    
    constructor(props) {
        super(props);
        
        this.state = {
            title : "",
            category : "General Medicine",
            value : "",
            token: this.props.route.params.token,
            categories : [
                "General practice",
                "Internal medicine",
                "Gastroenterology",
                "Urology",
                "Gynecology",
                "Surgery",
                "Psychiatry",
                "Orthopedics",
                "Rheumatology",
                "Allergology",
                "Otolaryngology",
                "Cardiology",
                "Pulmonology",
                "Neurology",
                "Dentistry",
                "Ophthalmology",
                "Infectiology",
                "Endocrinology",
                "Nephrology",
                "Dermatology"
            ],

            keyboardOpen: false,
            validTitle: true,
            validContent: true
        }
        this.keyboardDidShow = this.keyboardDidShow.bind(this);
        this.keyboardDidHide = this.keyboardDidHide.bind(this);
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this.keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this.keyboardDidHide,
        );
      }
    
      componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }
    
      keyboardDidShow() {
        this.setState({keyboardOpen: true});
      }
    
      keyboardDidHide() {
        this.setState({keyboardOpen: false});
      }
    
    


    categoryChange = (category) => {
        this.setState({category})
    }

    postQuestion = () => {

        var validTitle = false;
        var validContent = false;

        if(this.state.title === ""){
            this.setState({validTitle})
        }else{
            validTitle = true;
        }

        if(this.state.value === ""){
            this.setState({validContent})
        }else{
            validContent = true;
        }

        if(validTitle && validContent){

        var user_data = {
            'message' : this.state.value,
            'title' : this.state.title,
            'category': this.state.category,
        }

        axios.post(Globals.BASE_URL + Globals.POST + "/" + this.state.token, user_data).then( (response) => {
            Alert.alert(
              "Success",
              "Your question has been posted",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
            console.log(response.data)
            this.setState({title : "", value: ""})
          })
          .catch((error) => {
            Alert.alert(
              "Failed",
              "Please update your profile info",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
          })

       }else{
        Alert.alert(
          "Failed",
          "Please fill in the mandatory fields",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      }

     }


    render() {
        return (
            <Container style={{flex: 1}}>
                <Header></Header>
                <Content padder>
                <Form>
                <Item fixedLabel>
                <Label>Title</Label>
                    <Input autoCorrect={false} textAlign='center' onChangeText={(title) => this.setState({title})} value={this.state.title} style={!this.state.validTitle ? styles.error : null}/>
                </Item>
                <Item fixedLabel>
                <Left>
                <Label>Category</Label>
                </Left>
                    <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    selectedValue={this.state.category}
                    onValueChange={this.categoryChange.bind(this)}
                    >  
                    {this.state.categories.map((item) => {
                        return (<Picker.Item label = {item} value = {item} />);
                    })}
                </Picker>
                </Item>
                <Item style={{paddingTop: 10}}>
                <Textarea rowSpan={5} bordered placeholder="Your question goes here..."onChangeText={(value) => this.setState({value})} style={!this.state.validContent ? styles.textAreaError : {width: width*91/100}} value={this.state.value} onSubmitEditing={Keyboard.dismiss} />
                </Item>
                <Right>
                <Button success style={{marginTop: 50, }} onPress={this.postQuestion}><Text>Post Question</Text>
                </Button>
                </Right>
                </Form>
                </Content>
                {this.state.keyboardOpen ? null : 
                (<>
                <Image source={image} style={styles.image} />
                <Image source={doctor} style={styles.doctor} />
                </>)
                }     
            </Container>
          
          )

}
}

const styles = {
    image: {
        position: "absolute", 
        bottom: 0, 
        right: 0,
    },

    doctor: {
        position: "absolute", 
        bottom: 0, 
        left: 0,
    },

    error: {
        borderWidth: 1,
        borderColor: 'red'
      },
    
    textAreaError: {
        width: width*91/100,
        borderWidth: 1,
        borderColor: 'red'
    }
  };
export default Ask;