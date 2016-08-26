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
      message: '',
      data: '',
      results: false,
      cases: [],
      allKeys: []
    };
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    AsyncStorage.getAllKeys((err, keys) => {
      this.setState({allKeys: keys})
    }).done()
  }

  // makes data readable
  parseContent(body){
    $ = cheerio.load(body);
    var statusShortHtml = this.cleanText($(selectors.statusShort).html());
    var statusShortText = this.cleanText($(selectors.statusShort).text());

    var statusLongHtml = this.cleanText($(selectors.statusLong).html());
    var statusLongText = this.cleanText($(selectors.statusLong).text());
    console.log('heyoooooo')
    statusObj.statusShortHtml = statusShortHtml;
    statusObj.statusShortText = statusShortText;
    statusObj.statusLongHtml = statusLongHtml;
    statusObj.statusLongText = statusLongText;
    this.setState({data: statusObj.statusLongHtml, results: true})
    // console.log(statusObj.statusShortText)
    // console.log(this.state.data)
  }

  getStatus(receiptNumber, callback) {
  console.log(receiptNumber)
  if(this.validNum(receiptNumber)) {
    q = q+1;
    setTimeout(() => {
        this.scrapeStatus(receiptNumber)
      }, q*250);
  } else {
    var err = "ERROR: Receipt number must be 13 digits";
    this.setState({data: err, results: true, isLoading: false});
    return callback(err);
    }
  }

  onSearchPressed() {
    this.setState({data: '', results: false, isLoading: true});
    this.getStatus(this.state.searchString,
    function(err, data) {
      if (err) {
        console.log('error')
      } else {
        console.log('yerrr')
        console.log(data)
      }
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
          appReceiptNum: receiptNumber,
        })
      })
      .then((response) => response.text())
      .then((responseData) => this.handleResponse(responseData))
      .catch(error =>
       this.setState({
        isLoading: false,
        message: 'Something bad happened ' + error}))
      .done();
  }

  handleResponse(response) {
    this.setState({ isLoading: false , message: '' });
    this.parseContent(response);
    this.props.navigator.push({
      title: 'Your Result',
      component: StatusPage,
      passProps: {data: statusObj}
    })
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
    this.setState({ searchString: event.nativeEvent.text, results: false });
    console.log(this.state.searchString);
  }

  onSavePressed(event) {
    var v = this.state.searchString
    console.log('onSavePressed', v)
    var keyname = "myKey" + this.state.allKeys.length
    console.log('keyname', keyname)
    AsyncStorage.setItem(keyname, v).done();
    this.setState(({cases: this.state.cases.concat([v])}));

  }

  render() {
    var spinner = this.state.isLoading ?
    ( <ActivityIndicator
        size='large'/> ) :
    ( <View/>);
    console.log('imrender')
    console.log(this.state.data)
    var search = this.state.results ? (<Text>You entered: {this.state.searchString}</Text>) :
      ( <View/>);
    var output = this.state.results ?
    (<View><Text>{this.state.data}</Text><TouchableHighlight
          style={styles.button}
          value={this.state.searchString}
          onPress={this.onSavePressed.bind(this)}
          underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight></View> ) :
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
          placeholder='Starts with 3 ltrs (ex: MSC, EAC)'/>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onSearchPressed.bind(this)}
          underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>Go</Text>
        </TouchableHighlight>
        {spinner}
        {search}
        {output}
        <Text>cases:{this.state.cases}</Text>
        <Text>all:{this.state.allKeys}</Text>
      </View>
    );
  }
}

module.exports = LookUp;

