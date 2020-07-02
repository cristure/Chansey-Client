import React from 'react';
import {FlatList} from 'react-native';
import { View, Text, Button, Spinner, DatePicker, Content, Container} from 'native-base';
import Globals from './Globals'
import ChatBot from 'react-native-chatbot';
import axios from 'axios';
import PropTypes from 'prop-types';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import MapView, { Marker } from 'react-native-maps';

const bucharest= {
    latitude: 44.4268,
    longitude: 26.1025,
}
const cluj = {
    latitude: 46.770439,
    longitude: 23.591423,
}
const nurse_joy_avatar = "https://www.pngjoy.com/pngm/356/6635378_nurse-joy-nurse-joy-pokemon-sun-and-moon.png"

var symptoms = [] 
var specialist = ""
var time =""

class Consultation extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            token: this.props.step.metadata.token,
            loading: true,
            specialist: {},
            time: time,
            region: 
            {
                    latitude: "",
                    longitude: "",
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
            }
        }
    }

    async componentDidMount(){
        await axios.get(Globals.BASE_URL + Globals.SPECIALIST + "/" + this.state.token + "/" + specialist + "/" + time).then((response) =>
        {
            console.log(response.data.ID)
            this.setState({specialist: response.data})
            if(response.data.Location === "Bucharest"){
                this.state.region.latitude = bucharest.latitude + Math.floor(Math.random() * 10)/100;
                this.state.region.longitude = bucharest.longitude + Math.floor(Math.random() * 10)/100;
            }else{
                this.state.region.latitude = cluj.latitude + Math.floor(Math.random() * 10)/-100;
                this.state.region.longitude = cluj.longitude + Math.floor(Math.random() * 10)/100
            }

        
        })
        .catch( (error) => {
            console.log(error)
        })

        this.setState({loading: false})
    }

    render() {
        if(this.state.loading){
            return(
                <View>
                    <Spinner color='blue'/>
                </View>
            )
        }
        else{
        return(
            <Container>
            
            <Text>Your specialist is here: {this.state.specialist["First Name"]} {this.state.specialist["Last Name"]}</Text>
            <View style={{flex: 1}}>
            <MapView style={{flex: 1}} initialRegion={this.state.region}>
                <Marker coordinate={{latitude: this.state.region.latitude, longitude: this.state.region.longitude}}>

                </Marker>
            </MapView>
            </View>
            </Container>)
        
    }
}
}

class CalendarHandler extends React.Component {

    constructor(props) {
        
        super(props);

        this.state = {
            newTime: "Time",
            isDatePickerVisible: false,
            trigger: false
        }

        this.triggetNext = this.triggetNext.bind(this);
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
        }

    triggetNext() {
        time = this.state.newTime;
        this.setState({ trigger: true }, () => {
          this.props.triggerNextStep();
        });
      }

      render() {
          return(
          <View>
          <Text onPress={this.showDatePicker}>{this.state.newTime}</Text>
          <DateTimePickerModal
          defaultDate={new Date(moment().format('YYYY-MM-DD'))}
          minimumDate={new Date(moment().format('YYYY-MM-DD'))}
          maximumDate={new Date(2021,1,1)}
          isVisible={this.state.isDatePickerVisible}
          mode="datetime"
          onConfirm={(date) => this.handleConfirm(date)}
          onCancel={this.hideDatePicker}
          />
          <Button onPress={this.triggetNext}><Text>Done</Text></Button>
          </View>
          )
      }
}

class Info extends React.Component {

}


class Diagnosis extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            trigger: false,
            token: this.props.step.metadata.token,
            loading: true,
            menu: false,
            specialists: false,
            issues: [],
            specialisations: new Map(),
            treatment: "",
            about: "",
            headerText: "",
            currentId: ""
        }

        this.triggetNext = this.triggetNext.bind(this);
    }

    triggetNext() {
        this.setState({ trigger: true }, () => {
          this.props.triggerNextStep();
        });
      }

    async fetchDiagnosis () {
        await axios.post(Globals.BASE_URL + Globals.DIAGNOSIS + "/" + this.state.token, symptoms).then((response) => {
            for (var item of response.data){
                this.state.issues.push(item.Issue);
                this.state.specialisations.set(item.Issue.ID, item.Specialisation);
            }
        })
        .catch( (error) => {
            console.log(error)
        })

    }

    async fetchIssue (id) {
        await axios.get(Globals.BASE_URL + Globals.ISSUE + "/" + id).then((response) => {
            this.setState({about: response.data.MedicalCondition})
            this.setState({treatment: response.data.TreatmentDescription})
        })
        .catch( (error) => {
            console.log(error)
        })
        this.setState({loading: false})
    }

    async componentDidMount () {
        await this.fetchDiagnosis();
        this.setState({loading: false})
    }

    selectIssue = (id, index) => {
        this.setState({menu: true})
        this.setState({loading: true})
        this.setState({headerText: ""})
        this.fetchIssue(id)
        this.setState({currentId: id})

    }

    handleAbout = () => {
        this.setState({headerText: this.state.about})
    }

    handleTreatment = () => {
        this.setState({headerText: this.state.treatment})
    }

    handleConsult = () => {
        this.setState({specialists: true})
    }

    handleBack = () => {
        this.setState({menu: false})
    }

    backToMenu = () => {
        this.setState({specialists: false})
    }

    selectSpecialist = (id) => {
        specialist = id;
        symptoms = [];
        this.triggetNext();
    }

    renderView() {
        console.log(this.state.specialisations)
        if(this.state.specialists){
            return(
                <>
                <Text>Based on the issue selected</Text>
                    <FlatList 
                    data={this.state.specialisations.get(this.state.currentId)}
                    renderItem={({item, index}) => (
                        <Button onPress={() => {this.selectSpecialist(item.ID)}}><Text>{item.Name}</Text></Button>
                    )}
                >
            </FlatList>
            <Button onPress={this.backToMenu}><Text>Back</Text></Button>
            </>
            )
        }
        else{
        if(!this.state.menu){
        return (
            <>
            <Text>Based on your symptoms these are your results</Text>
                <FlatList 
                data={this.state.issues}
                renderItem={({item, index}) => (
                    <Button onPress={() => {this.selectIssue(item.ID, index)}}><Text>{item.Name}</Text></Button>
                )}
            >
        </FlatList>
        </>
        )
        }else {
            return (
                <View>
                <Text>{this.state.headerText}</Text>
                <Button onPress={this.handleAbout}><Text>About</Text></Button>
                <Button onPress={this.handleTreatment}><Text>Treatment</Text></Button>
                <Button onPress={this.handleConsult}><Text>Consult a specialist</Text></Button>
                <Button onPress={this.handleBack}><Text>Back</Text></Button>
                </View>
            )
        }
    }
    }
    render() {
        return (
            <View>
                {this.state.loading ? (<Spinner color='blue'/>) : 
                (this.renderView())}
            </View>
        )
    }
}

class Review extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            name: '',
            id : -1,
            result: '',
            trigger: false
        };

        this.triggetNext = this.triggetNext.bind(this);
    }

    triggetNext() {
        this.setState({ trigger: true }, () => {
          this.props.triggerNextStep();
        });
      }

    async symptomCheck(text) {
        await axios.get(Globals.BASE_URL + Globals.SYMPTOM + "/" + text).then((response) => {
            this.setState({name: response.data.name, id: response.data.id})
        })
        .catch( (error) => {
            console.log(error)
        })

        if(this.state.id === -1){
            this.setState({result: this.state.name})
        }else{
            var result = "Are you experiencing "+ this.state.name + "?"
            this.setState({result: result}); 
        }
    }

    async componentDidMount() {
        await this.symptomCheck(this.props.previousStep.message);
        if(this.state.id !== -1){
           symptoms.push({name: this.state.name, id: this.state.id})
        }
    }

    addSymptom = () => {
        this.triggetNext()
        console.log(symptoms)
    }

    removeSymptom = () => {
        this.triggetNext()
        symptoms.pop();
        console.log(symptoms)
    }



    render() {
        return (
        <View>
        <Text>{this.state.result}</Text>
        {
        !this.state.trigger &&
        <>
        <Button onPress={this.addSymptom}><Text>Yes</Text></Button>
        <Button onPress={this.removeSymptom}><Text>No</Text></Button>
        </>
        }
        </View>
        )
    }


}

Review.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
  };
  
  Review.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
  };

class Nurse extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
            symptoms: new Map(),
            token: this.props.route.params.token
        }
        this.reportSymptom = this.reportSymptom.bind(this);
    }

    async reportSymptom (text) {
       await axios.get(Globals.BASE_URL + Globals.SYMPTOM + "/" + text).then((response) => {
            return response.data
        })
        .catch( (error) => {
            console.log(error)
        })

        return "Processing"
    }

    render() {
        return (
            <ChatBot botAvatar={nurse_joy_avatar} steps={[
                {
                  id: '0',
                  message: 'Hi! I am Nurse Joy. How may I help you today?', 
                  trigger: '1',
                },
                {
                  id: '1',
                  options:
                  [
                      { value: 1, label: 'Diagnose me', trigger: '2' },
                      { value: 3, label: 'Info', trigger: '4' },
                    ],
                },
                {
                    id: '2',
                    message: 'Can you please describe some of your symptoms?',
                    trigger: 'symptom'
                },
                {
                    id: 'symptom',
                    user: true,
                    trigger: '3'
                },
                {
                  id: '4',
                  message : 'I was designed to give you a diagnostic based on your medical concerns. After confirming your symptoms we can proceed on looking for a specialist.',
                  trigger: '2'
                },
                {
                    id: '3',
                    component: <Review/>,
                    trigger: 'confirmSymptom',
                    waitAction: true
                },
                {
                    id: 'confirmSymptom',
                    message: 'Would you like to report another symptom?',
                    trigger: 'addSymptom',
                },
                {
                    id: 'addSymptom',
                    options:  [
                        { value: 1, label: 'Yes', trigger: 'symptom' },
                        { value: 2, label: 'No', trigger: 'proceedDiagnosis' },
                      ],
                },
                {
                    id: 'proceedDiagnosis',
                    component: <Diagnosis/>,
                    waitAction: true,
                    trigger: 'timeSelect',
                    metadata: {
                        token: this.state.token
                    }
                },
                {
                    id: 'viewInfo',
                    component: <Info/>,
                    trigger: '1',
                    waitAction: true
                },
                {
                    id: 'timeSelect',
                    message: 'Please select a date and a time',
                    trigger: 'calendarHandler'
                }
                ,
                {
                    id: 'calendarHandler',
                    component: <CalendarHandler/>,
                    waitAction: true,
                    trigger: 'pending'
                },
                {
                    id: 'pending',
                    message: "Looking for a specialist...",
                    trigger: 'end'
                },
                {
                    id: 'end',
                    component: <Consultation/>,
                    metadata: {
                        token: this.state.token
                    },
                    trigger: '1' 
                }
                
              ]
        } />)

        // <Container style={{flex: 1, position: 'absolute', width: "100%"}}>

        // <MapView style={{flex: 1}} liteMode={true} initialRegion={{
        //     latitude: 46.770439,
        //     longitude: 23.591423,
        //     latitudeDelta: 0.0422,
        //     longitudeDelta: 0.0021

        //   }}>
        // </MapView>
        // </Container>
        // )

}
}
export default Nurse;