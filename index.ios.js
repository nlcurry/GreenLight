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
  NavigatorIOS,
  AsyncStorage
} from 'react-native';

var LookUp = require('./App/IOS/Components/LookUp');
var MyCases = require('./App/IOS/Components/MyCases');
var Resources = require('./App/IOS/Components/Resources');

class GreenLight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'lookup',
      v1: '',
      v2: '',
      v3: '',
      list: []
    };
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    console.log('loadstate')
    AsyncStorage.getItem("myKey1")
    .then( (value) =>
          {
            this.setState({list: this.state.list.concat([{case: value}])})
            return AsyncStorage.getItem("myKey2")
          }
    )
    .then( (value) =>
          {
            this.setState({list: this.state.list.concat([{case: value}])})
            return AsyncStorage.getItem("myKey3")
            return null
          }
    )
    .then( (value) =>
          {
            this.setState({list: this.state.list.concat([{case: value}])})
          }
    ).done();
    console.log('v1', this.state.v1)
    this.setState({list: [{case: this.state.v1},{case: this.state.v2}]})
    console.log('yep', this.state.list)
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
            <NavigatorIOS style={styles.nav}
              initialRoute={{
                  title : 'Search Case',
                  component: LookUp
                 }}/>

        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'mycases'}
          icon={require('./App/IOS/Resources/mycases.png')}
          onPress={() => {
                this.setState({
                    selectedTab: 'mycases',
                });
          }}>
          <NavigatorIOS style={styles.nav}
              initialRoute={{
                  title : 'My Cases',
                  component: MyCases,
                  passProps: {cases: this.state.list}
                 }}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'resources'}
          icon={require('./App/IOS/Resources/resources.png')}
          onPress={() => {
                this.setState({
                    selectedTab: 'resources'
                });
          }}>
          <NavigatorIOS style={styles.nav}
              initialRoute={{
                  title : 'Resources',
                  component: Resources
                 }}/>
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
  },
  nav: {
    flex: 1
  }
});

AppRegistry.registerComponent('GreenLight', () => GreenLight);
