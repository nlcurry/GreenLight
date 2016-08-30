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
  },
  top: {
    marginTop: 65
  }
});

var cheerio = require('cheerio-without-node-native');
var qs = require('query-string');

var selectors = {
  err: '#formErrorMessages',
  statusShort: '.main-content-sec .main-row .current-status-sec',
  statusLong: '.main-content-sec .main-row .appointment-sec .rows'
};

var StatusPage = require('./StatusPage')

class MyCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cases: [],
      caseData: [],
      caseInfo: {},
      messages: []
    };
  }

  componentDidMount() {
    this._loadInitialState()
    setTimeout(() => {
          this.checkDone()
        }, 2000);
  }

  async _loadInitialState() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
       // get at each store's key/value so you can work with it
       this.setState({cases: this.state.cases.concat([store[i][1]])})
        console.log('inmultiget', store[i][1])
        });
      })
    .then((value) => {
      this.state.cases.map((number) => {
        this.scrapeStatus(number)
        console.log('number', number)
      })})}).done()

  }

  checkDone(){
    // if (this.state.cases.length !== this.state.caseData.length){
    //   setTimeout(this.checkDone(), 0)
    // } else if (this.state.cases.length === this.state.caseData.length && this.state.cases.length > 0) {
    //   console.log(this.state.cases.length, this.state.caseData.length)
      this.setInfo()
      this.setState({isLoading: false})
    // }
  }

  setInfo(){
    var object = {}
    console.log('cases', this.state.cases)
    for(var i = 0; i < this.state.cases.length; i++){
        object[this.state.cases[i]] = this.state.caseData[i]
    console.log('object', object)
    }
    this.setState({caseInfo: object})
  }

  rowPressed(caseNumber){
    this.props.navigator.push({
      title: 'Status',
      component: StatusPage,
      passProps: {number: caseNumber}
    })
  }

// this section grabs information from uscis.gov
  // makes data readable
  parseContent(body){
    $ = cheerio.load(body);
    var statusShortText = this.cleanText($(selectors.statusShort).html());
    console.log('inparse', statusShortText)
    this.setState({caseData: this.state.caseData.concat([statusShortText])})
    // console.log(statusObj.statusShortText)
    console.log('parse',this.state.caseData)
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

  handleResponse(response) {
    this.parseContent(response);
    // this.props.navigator.push({
    //   title: 'Your Result',
    //   component: StatusPage,
    //   passProps: {data: statusObj}
    // })
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
// --------------

  render() {
    if (this.state.isLoading) {
    return (
        <View style={styles.container}>
        <Text>Is Loading...</Text>
        </View>
    );
  } else {
      const output = this.state.cases.map((number) => {
      return (<TouchableHighlight onPress={() => this.rowPressed(number)} key={number} underlayColor='#dddddd'>
          <View>
            <View style={styles.rowContainer}>
              <Image style={styles.thumb}/>
              <View style={styles.textContainer}>
                <Text style={styles.price}>
                  {number}
                </Text>
                <Text style={styles.title} numberOfLines={1}>{this.state.caseInfo[number]}</Text>
              </View>
            </View>
            <View style={styles.separator}/>
          </View>
        </TouchableHighlight>);
    });

        return (
        <View style={styles.top}>
        {output}
        </View>
    );
  }
  }
}

module.exports = MyCases;