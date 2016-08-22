import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  WebView
} from 'react-native';

class ProcessTime extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://egov.uscis.gov/cris/processTimesDisplayInit.do'}}
        style={{marginTop: 20, flex: 1}}
        scalesPageToFit = {true}
      />
    );
  }
}

module.exports = ProcessTime