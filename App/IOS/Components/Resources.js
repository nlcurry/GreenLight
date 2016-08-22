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
  Image,
  NavigatorIOS
} from 'react-native';

var styles = StyleSheet.create({
  description: {
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#123456',
  }
});

var AddressChange = require('./AddressChange');

class Resources extends Component {
  goToAddress(){
    this.props.navigator.push({
      title: "Address Change",
      component: AddressChange
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.button}
          onPress={this.goToAddress()}
          underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>Address Change</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = Resources;