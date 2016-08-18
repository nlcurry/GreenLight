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
    alignItems: 'center'
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
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
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
  }
});

var cheerio = require('cheerio-without-node-native');
var qs = require('query-string');

var selectors = {
  err: '#formErrorMessages',
  statusShort: '.main-content-sec .main-row .current-status-sec',
  statusLong: '.main-content-sec .main-row .appointment-sec .rows'
};

var q = -1;

var statusObj = {
  errHtml: undefined,
  statusShortHtml: undefined,
  statusShortText: undefined,
  statusLongHtml: undefined,
  statusLongText: undefined
};

class LookUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      isLoading: false,
      message: ''
    };
  }

  getStatus(receiptNumber, callback) {
  if(this.validNum(receiptNumber)) {
    q = q+1;
    setTimeout(() => {
        this.scrapeStatus(receiptNumber)
      }, q*250);
  } else {
    var err = "ERROR: Receipt number must be 13 digits";
    return callback(err);
    }
  }

  onSearchPressed() {
    this.getStatus('MSC',
    function(err, data) {
      console.log(data);
      console.log('yep')
      console.log(err)
    }
  )}

// similar to _executequery
  scrapeStatus(receiptNumber) {
    fetch('https://egov.uscis.gov/casestatus/mycasestatus.do', {
        method: 'POST',
        headers : {
                  'Content-Type'   : 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
          appReceiptNum: 'MSC1690053756',
        })
      })
      .then((response) => response.text())
      .then((responseData) => this.parseContent(responseData))
      .catch(error =>
       this.setState({
        isLoading: false,
        message: 'Something bad happened ' + error}))
      .done();
  }

// makes data readable
  parseContent(body){
    $ = cheerio.load(body);
    var statusShortHtml = this.cleanText($(selectors.statusShort).html());
    var statusShortText = this.cleanText($(selectors.statusShort).text());

    var statusLongHtml = this.cleanText($(selectors.statusLong).html());
    var statusLongText = this.cleanText($(selectors.statusLong).text());
    // console.log('heyoooooo')
    statusObj.statusShortHtml = statusShortHtml;
    statusObj.statusShortText = statusShortText;
    statusObj.statusLongHtml = statusLongHtml;
    statusObj.statusLongText = statusLongText;
    // console.log(statusObj)
  }

  validNum(receiptNumber) {
    var validity = receiptNumber.length === 13;
    return validity;
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

  onSearchTextChanged(event) {
    console.log('onSearchTextChanged');
    this.setState({ searchString: event.nativeEvent.text });
    console.log(this.state.searchString);
  }

  render() {
    var spinner = this.state.isLoading ?
    ( <ActivityIndicator
        size='large'/> ) :
    ( <View/>);
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Lookup a case!
        </Text>
        <TextInput
          style={styles.searchInput}
          value={this.state.searchString}
          onChange={this.onSearchTextChanged.bind(this)}
          placeholder='Search via name or postcode'/>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onSearchPressed.bind(this)}
          underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>Go</Text>
        {spinner}
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = LookUp;

