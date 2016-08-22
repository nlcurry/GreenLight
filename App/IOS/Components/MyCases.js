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
  AsyncStorage
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

class MyCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
      messages: []
    };
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    AsyncStorage.getItem("myKey1")
    .then( (value) =>
          {
            this.setState({v1:value})
            return AsyncStorage.getItem("myKey2")
          }
    )
    .then( (value) =>
          {
            this.setState({v2: value})
            return AsyncStorage.getItem("myKey3")
            return null
          }
    )
    .then( (value) =>
          {
            this.setState({v3:value})
          }
    ).done();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          v1:{this.state.v1}
          v2:{this.state.v2}
          v3:{this.state.v3}
        </Text>
      </View>
    );
  }
}

module.exports = MyCases;