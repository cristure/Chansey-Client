import React from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Form, Item, Label, Input, Picker, ListItem, CheckBox, Body, List, Left, Right, DatePicker, Spinner, Segment, View} from 'native-base';
import Emoji from 'react-native-emoji';
import { Alert, RefreshControl, FlatList, ScrollView} from 'react-native';
import Globals from './Globals'
import axios from 'axios';
import moment from 'moment';
import Consultations from './Consultations'

class Profile extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
          first_name: "",
          last_name: "",
          phone_number: "",
          gender: "Male",
          languages: "",
          birth_date: new Date(),
          location: "Bucharest",
          token: this.props.route.params.token,
          newUser: this.props.route.params.newUser,
          checkedEnglish: false,
          checkedDeutsch: false,
          validFirstName: true,
          validLastName: true,
          validPhone: true,
          validLanguages: true,
          loading: true,
          profileActive:  true,
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
        console.log(location)
        this.setState({location: location})
      };

      async fetchInfo () {
        await axios.get(Globals.BASE_URL + Globals.USER + "/" + this.state.token).then((response) => {
          this.state.checkedEnglish = response.data.languages.includes('English');
          this.state.checkedDeutsch = response.data.languages.includes('Deutsch');
          this.setState({
            birth_date : response.data.birth_date,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            gender: response.data.gender,
            languages: response.data.languages,
            location: response.data.location,
            phone_number: response.data.phone_number
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
         var valid3 = false
         var valid4 = false

         if(this.state.first_name != ""){valid1=true;this.setState({validFirstName: true})}else{this.setState({validFirstName: false})}
         if(this.state.last_name != ""){valid2=true;this.setState({validLastName: true})}else{this.setState({validLastName: false})}
         if(!regex.test(this.state.phone_number)){this.setState({validPhone: false})}else{valid3=true;this.setState({validPhone: true})}
         this.setState({languages: this.syncLanguages()})

         if(valid1 && valid2 && valid3){

            var user_data = {
              birth_date : this.state.birth_date,
              first_name: this.state.first_name,
              gender: this.state.gender,
              languages: this.syncLanguages(),
              last_name: this.state.last_name,
              location: this.state.location,
              phone_number: this.state.phone_number
            }

            console.log(user_data);

            axios.put(Globals.BASE_URL + Globals.USER + "/" + this.state.token, user_data).then( (respone) => {
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
              <Item fixedLabel>
                <Label>Phone Number</Label>
                <Input autoCorrect={false} style={!this.state.validPhone ? styles.error : null}
                  onChangeText={(phone_number) => this.setState({phone_number})} value={this.state.phone_number} />
              </Item>
              <Item inlineLabel>
              <Left>
              <Label>Gender</Label>
              </Left>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                selectedValue={this.state.gender}
                onValueChange={this.genderChange.bind(this)}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
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
              <Item fixedLabel>
              <Label>Birth Date</Label>
              
              <DatePicker
              defaultDate={new Date(moment(this.state.birth_date).format('YYYY-MM-DD'))}
              minimumDate={new Date(1920, 1, 1)}
              maximumDate={new Date(2020, 1, 1)}
              locale={"en"}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText={moment(this.state.birth_date).format('DD-MM-YYYY')}
              textStyle={{ color: "blue" }}
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              onDateChange={(newDate) => this.setDate(newDate)}
              disabled={false}
              />
              </Item>
            </Form>
            <Right>
                <Button success style={{marginTop: 50}} onPress={this.updateInfo}><Text>Save Changes</Text>
                </Button>
                </Right>
            </>)
        }else{
          return (
            <Consultations token={this.state.token}></Consultations>
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
  
export default Profile;