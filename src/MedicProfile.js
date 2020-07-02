import React from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Form, Item, Label, Input, Picker, ListItem, CheckBox, Body, List, Left, Right, DatePicker, Spinner, Segment, View} from 'native-base';
import Emoji from 'react-native-emoji';
import { Alert, RefreshControl, FlatList, ScrollView} from 'react-native';
import Globals from './Globals'
import axios from 'axios';
import moment from 'moment';
import MedicConsultations from './MedicConsultations'

export default class MedicProfile extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
          first_name: "",
          last_name: "",
          gender: "Male",
          languages: "",
          location: "Bucharest",
          checkedEnglish: false,
          checkedDeutsch: false,
          validFirstName: true,
          validLastName: true,
          validLanguages: true,
          loading: true,
          profileActive:  true,
          token: this.props.route.params.token
        };

        this.setDate = this.setDate.bind(this);
      
      }
      async componentDidMount() {
        await this.fetchInfo();
        this.setState({loading: false})

      }

      setDate = (newDate) => {
        this.setState({birth_date : newDate})
      }

      genderChange = (gender) => {
        this.setState({gender: gender})
      };

      locationChange = (location) => {
        this.setState({location: location})
      };

      async fetchInfo () {
        await axios.get(Globals.BASE_URL + Globals.MEDIC + "/" + this.state.token).then((response) => {
          console.log(response.data)
          this.state.checkedEnglish = response.data.Language.includes('English');
          this.state.checkedDeutsch = response.data.Language.includes('Deutsch');
          console.log(response.data["First Name"])
          this.setState({
            first_name: response.data["First Name"],
            last_name: response.data["Last Name"],
            languages: response.data.languages,
            location: response.data.location,
          })
          
        })
        .catch( (error) => {
          console.log(error)
        })
        
        
      }


      renderFlags = () => {
          return(
            <Right style={{flexDirection: 'row'}}>
              {this.state.checkedEnglish ? <Emoji name="gb" style={{paddingRight: 10}}></Emoji>: null}
              {this.state.checkedDeutsch ? <Emoji name="de"></Emoji> : null}
            </Right>
          );
      }

      syncLanguages = () => {
        var German =  "Deutsch";
        var English = "English";
        var myLanguages = ""
        
        this.state.checkedEnglish ? myLanguages=myLanguages+English : null;
        this.state.checkedDeutsch ? myLanguages=myLanguages+German : null;
        return myLanguages;
      }
    

      updateInfo = () => {
        
         const regex = /^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/

         var valid1 = false
         var valid2 = false

         if(this.state.first_name != ""){valid1=true;this.setState({validFirstName: true})}else{this.setState({validFirstName: false})}
         if(this.state.last_name != ""){valid2=true;this.setState({validLastName: true})}else{this.setState({validLastName: false})}
         this.setState({languages: this.syncLanguages()})

         if(valid1 && valid2){

            var user_data = {
              "First Name": this.state.first_name,
              "Language": this.syncLanguages(),
              "Last Name": this.state.last_name,
              "Location": this.state.location,
            }

            console.log(user_data);

            axios.put(Globals.BASE_URL + Globals.MEDIC + "/" + this.state.token, user_data).then( (respone) => {
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

         }else{
          Alert.alert(
            "Failed",
            "Something went wrong",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
        }

       }

       handleSwitchToProfile = () => {
         this.setState({profileActive: true})
       }

       handleSwitchToConsultation = () => {
         this.setState({profileActive: false})
       }

       renderView = () => {
         
        if(this.state.profileActive){
          return (
            <>
            <Form>
              <Item fixedLabel>
                <Label>First Name</Label>
                <Input autoCorrect={false} style={!this.state.validFirstName ? styles.error : null}
                  onChangeText={(first_name) => this.setState({first_name})} value={this.state.first_name}/>
              </Item>
              <Item fixedLabel>
                <Label>Last Name</Label>
                <Input autoCorrect={false} style={!this.state.validLastName ? styles.error : null}
                  onChangeText={(last_name) => this.setState({last_name})} value={this.state.last_name}/>
              </Item>
              <Item inlineLabel>
              <Left>
              <Label>Location</Label>
              </Left>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                selectedValue={this.state.location}
                onValueChange={this.locationChange.bind(this)}
              >
                <Picker.Item label="Bucharest" value="Bucharest" />
                <Picker.Item label="Cluj-Napoca" value="Cluj-Napoca" />
              </Picker>
              </Item>
              <List style={!this.state.validLanguages ? styles.error : null}>
              <ListItem fixedLabel>
              <Left>
              <Label>Languages</Label>
              </Left>
              {this.renderFlags()}
              </ListItem>
              <ListItem>
              <CheckBox checked={this.state.checkedEnglish} onPress={() => this.setState({checkedEnglish: !this.state.checkedEnglish})}/>
              <Body>
                <Text>English</Text>
              </Body>
              </ListItem>
              <ListItem>
              <CheckBox checked={this.state.checkedDeutsch} onPress={() => this.setState({checkedDeutsch: !this.state.checkedDeutsch})}/>
              <Body>
                <Text>Deutsch</Text>
              </Body>
              </ListItem>
              </List>
            </Form>
            <Right>
                <Button success style={{marginTop: 50}} onPress={this.updateInfo}><Text>Save Changes</Text>
                </Button>
                </Right>
            </>)
        }else{
          return (
            <MedicConsultations token={this.state.token}></MedicConsultations>
          )
        }
        }



    render() {
      return(
        <Container>
        <Header hasSegment>
          <Body>
          <Segment>
            <Button first active={this.state.profileActive} onPress={this.handleSwitchToProfile}><Text>Profile</Text></Button>
            <Button last active={!this.state.profileActive} onPress={this.handleSwitchToConsultation}><Text>Consultations</Text></Button>
          </Segment>
          </Body>
        </Header>
            <Content padder>
            {this.state.loading ? (<Spinner color='blue'/>) : 
            this.renderView()}
            </Content>
            </Container>
      );
    }
}
const styles = {
    container: {
      flex: 1
    },

    error: {
      borderWidth: 1,
      borderColor: 'red'
    }
  };
  