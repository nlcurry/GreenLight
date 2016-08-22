import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  TabBarIOS,
  Image
} from 'react-native';

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    paddingTop: 64,
    flex: 1,
    alignItems: 'center',
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  }
});

var AddressChange = require('../WebComponent/AddressChange');

var ProcessTime = require('../WebComponent/ProcessTime');


class Resources extends Component {
  goToAddress(){
    this.props.navigator.push({
      title: "Address Change",
      component: AddressChange
    });
  }

  goToProcess(){
    this.props.navigator.push({
      title: "Processing Time",
      component: ProcessTime
    });
  }

  render() {
    console.log('inrender')
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.button}
          onPress={this.goToAddress.bind(this)}
          underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>Change Address</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={this.goToProcess.bind(this)}
          underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>Check Processing Time</Text>
        </TouchableHighlight>
        </View>
    );
  }
}

module.exports = Resources;