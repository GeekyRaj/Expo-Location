import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet,Button,Linking, } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
//import { IntentLauncherAndroid } from 'expo';
import * as IntentLauncher from 'expo-intent-launcher';
import Modal from 'react-native-modal'

//App to ask for location access
export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    isLocationModalVisible: false,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    try{
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
  
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });
    }
    catch(error){
        let status = Location.getProviderStatusAsync();
        if(!status.locationServicesEnabled){
          this.setState({ isLocationModalVisible:true})
        }
    }
    
  };

  openSetting= ()=>{
    if(Platform.OS == "ios")
    {
      Linking.openURL('app-settings:');
    }
    else{
      IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
      );
    }
    this.setState({ openSetting:false})
  }

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <Modal isVisible={this.state.isLocationModalVisible}
        onModalHide={this.state.openSetting?this.openSetting:undefined}>
              <View style={{height:400,width:350, backgroundColor:'white', alignItems:'center',justifyContent:'center'}}>
                  <Button
                      title='Enable Location Services'
                      onPress={()=> this.setState({ isLocationModalVisible:false,openSetting: true})}
                  />
              </View>
        </Modal>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});