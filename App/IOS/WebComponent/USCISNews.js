import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  WebView
} from 'react-native';

class USCISNews extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://www.uscis.gov/news'}}
        style={{marginTop: 20, flex: 1}}
        scalesPageToFit = {true}
      />
    );
  }
}

module.exports = USCISNews