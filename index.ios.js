/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  NavigatorIOS
} from 'react-native';

var LookUp = require('./App/IOS/Components/LookUp');
var MyCases = require('./App/IOS/Components/MyCases');
var Resources = require('./App/IOS/Components/Resources');

class GreenLight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'lookup'
    };
  }

  render() {
    return (
      <TabBarIOS selectedTab={this.state.selectedTab}>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'lookup'}
          icon={require('./App/IOS/Resources/lookup.png')}
          onPress={() => {
              this.setState({
                  selectedTab: 'lookup',
              });
          }}>
            <LookUp />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'mycases'}
          icon={require('./App/IOS/Resources/mycases.png')}
          onPress={() => {
                this.setState({
                    selectedTab: 'mycases',
                });
          }}>
          <MyCases />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'resources'}
          icon={require('./App/IOS/Resources/resources.png')}
          onPress={() => {
                this.setState({
                    selectedTab: 'resources',
                });
          }}>
          <Resources />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

var styles = StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('GreenLight', () => GreenLight);
