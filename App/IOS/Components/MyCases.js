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
  AsyncStorage,
  ListView
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    paddingTop: 64,
    flex: 1,
    alignItems: 'center',
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

class MyCases extends Component {


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
      cases: [],
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
            this.setState({cases: this.state.cases.concat([value])})
            return AsyncStorage.getItem("myKey2")
          }).then( (value) =>
          {
            this.setState({cases: this.state.cases.concat([value])})
            return AsyncStorage.getItem("myKey3")
            return null
          }).then( (value) =>
          {
            this.setState({cases: this.state.cases.concat([value])})
          }
    ).done();
    this.setState({isLoading: false})
  }

  makeRows() {
    console.log('rowdata')
    var out = ''
    var holder = this.state.cases
      for (var i=0; i < holder.length; i++) {
        console.log('inloop')
        out += "<TouchableHighlight><View><View style={styles.rowContainer}><Image style={styles.thumb}/><View  style={styles.textContainer}><Text style={styles.price}>{this.state.cases[i]}</Text><Text style={styles.title}numberOfLines={1}>rowData.case</Text></View></View><View style={styles.separator}/></View></TouchableHighlight>"
    }
    return out
  }

  render() {

    if (this.state.isLoading) {
    return (
        <View style={styles.container}>
        <Text>Is Loading...</Text>
        </View>
    );
  } else {
      const output = this.state.cases.map((number) => {
      return (<TouchableHighlight key={number}>
          <View>
            <View style={styles.rowContainer}>
              <Image style={styles.thumb}/>
              <View style={styles.textContainer}>
                <Text style={styles.price}>
                  {number}
                </Text>
                <Text style={styles.title} numberOfLines={1}>title</Text>
              </View>
            </View>
            <View style={styles.separator}/>
          </View>
        </TouchableHighlight>);
    });

        return (
        <View>
        {output}
        </View>
    );
  }
  }
}

module.exports = MyCases;