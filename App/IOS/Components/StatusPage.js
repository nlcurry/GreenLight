import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ActivityIndicator,
  TabBarIOS,
  Image,
  AsyncStorage
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    marginTop: 65
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 400,
    height: 300
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  }
});

var cheerio = require('cheerio-without-node-native');
var qs = require('query-string');

var selectors = {
  err: '#formErrorMessages',
  statusShort: '.main-content-sec .main-row .current-status-sec',
  statusLong: '.main-content-sec .main-row .appointment-sec .rows'
};

var Tracking = require('../WebComponent/Tracking')

class StatusPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      number: this.props.number,
      isLoading: true,
      tracking: false
    };
  }

  componentDidMount() {
    this.scrapeStatus(this.state.number)
  }

  scrapeStatus(receiptNumber) {
    fetch('https://egov.uscis.gov/casestatus/mycasestatus.do', {
        method: 'POST',
        headers : {
                  'Content-Type'   : 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
          appReceiptNum: receiptNumber
        })
      })
      .then((response) => response.text())
      .then((responseData) => this.parseContent(responseData))
      .catch(error =>
       this.setState({
        message: 'Something bad happened ' + error}))
      .done();
  }

  parseContent(body){
    $ = cheerio.load(body);
    var statusLongText = this.cleanText($(selectors.statusLong).text());
    var statusLongHtml = this.cleanText($(selectors.statusLong).html());
    if (statusLongHtml.includes('tracking number')){
      var track = statusLongHtml.match(/href="[^"]+"/g)[0].replace("href=",'').replace(/['"]+/g, '')
        this.setState({tracking: track })
    }
    this.setState({data: statusLongText, isLoading: false})

    console.log('parse',this.state.data)
  }

  cleanText(text) {
    // http://stackoverflow.com/questions/10805125/how-to-remove-all-line-breaks-from-a-string
    try {
      // remove the returns, new line breaks & tabs
      var b = text.replace(/\r|\n|\t/g,"");
      b = b.replace(/\s+/g,' ').trim();   // remove duplicate spaces
      b = b.replace(/\+$/,'').trim();  // remove '+' from end of string
      b = b ? b : text;
      return b;
    }catch (e) {
      return text; // don't fail if can't clean it
    }
  }

  goToTracking() {
    this.props.navigator.push({
      title: "Tracking",
      component: Tracking,
      passProps: {link: this.state.tracking}
    });
  }

  render() {
    var spinner = this.state.isLoading ?
    ( <ActivityIndicator
        size='large'/> ) :
    ( <View/>);

    var url = this.state.tracking ? <View><TouchableHighlight
          style={styles.button}
          onPress={this.goToTracking.bind(this)}
          underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>USPS Tracking</Text>
        </TouchableHighlight></View> :
        <View/>

    if (this.state.isLoading) {
      return(
      <View style={styles.container}>
        {spinner}
        <Text>Loading...</Text>
      </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.heading}>
            <Text style={styles.price}>{this.state.number}</Text>
            <Text style={styles.title}> </Text>
            <View style={styles.separator}/>
          </View>
          <Text style={styles.description}>{this.state.data}</Text>
          {url}
        </View>
      );
    }
  }
}


module.exports = StatusPage