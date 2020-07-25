/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useNavigation, 
         useRoute  // 20200626 JustCode: FCM implementation
} from '@react-navigation/native';

import Api from '../../lib/api';
import Helper from '../../lib/helper';
import WordDefinition from '../../components/wordDef';
import Header from '../../components/header';
import commonStyles from '../../../commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';

// 20200502 JustCode: Import the camera module
import Camera, { Constants } from "../../components/camera";
import WordSelector from "../../components/wordSelector";

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import LocalizedStrings from 'react-native-localization';
var localeFile = require('./locale.json');
let localizedStrings = new LocalizedStrings(localeFile);

// 20200613 JustCode: Redux implementation
import { connect } from 'react-redux';
import * as pageActions from '../../redux/actions/pageActions';

class Search extends React.Component {
  onUserWordChange(text) {
    // 20200613 JustCode: Redux implementation
    this.props.dispatch(
      pageActions.pageSearchSetUserWord(text)
    );
  }

  async onSearch() {
    // 20200613 JustCode: Redux implementation
    if(this.props.page.get('search').get('userWord').length <= 0) {
      this.props.dispatch(
        pageActions.pageSearchSetError(localizedStrings.Error.EmptyWord)
      );
      return;
    }

    try {
      // 20200613 JustCode: Redux implementation
      this.props.dispatch(
        pageActions.pageSearchSetLoading(true)
      );

      // 20200613 JustCode: Redux implementation
      let lemmas = await Api.getLemmas(this.props.page.get('search').get('userWord'));
      
      console.log('Lemmas: ', lemmas);
      if(lemmas.success) {
        let headWord = Helper.carefullyGetValue(lemmas, ['payload', 'results', '0', 'lexicalEntries', '0', 'inflectionOf', '0', 'id'], '');
        console.log('Headword is: ', headWord);
        if(headWord.length > 0) {
          let wordDefinition = await Api.getDefinition(headWord);
          if(wordDefinition.success) {
            this.props.dispatch(
              pageActions.pageSearchSetState(
                {
                  errorMsg: '', 
                  loading: false, 
                  definition: wordDefinition.payload
                }
              )
            );
          }
          else {
            this.props.dispatch(
              pageActions.pageSearchSetState(
                {
                  errorMsg: localizedStrings.Error.OxfordIssue + wordDefinition.message, 
                  loading: false, 
                  definition: null
                }
              )
            );
          }
        }
        else {
          this.props.dispatch(
            pageActions.pageSearchSetState(
              {
                errorMsg: localizedStrings.Error.InvalidWord, 
                loading: false, 
                definition: null
              }
            )
          );
        }
      }
      else {
        this.props.dispatch(
          pageActions.pageSearchSetState(
            {
              errorMsg: localizedStrings.Error.OxfordIssue + lemmas.message, 
              loading: false, 
              definition: null
            }
          )
        );
      }
    } catch (error) {
      console.log('Error: ', error);
      this.props.dispatch(
        pageActions.pageSearchSetState(
          {
            loading: false, 
            errorMsg: error.message, 
            definition: null
          }
        )
      );
    }
  }

  // 20200502 JustCode:
  // Receive the recogonizedText from the Camera module
  onOCRCapture(recogonizedText) {
    this.props.dispatch(
      pageActions.pageSearchShowCamera(false)
    );

    this.props.dispatch(
      pageActions.pageSearchSetState(
        {
          showWordList: Helper.isNotNullAndUndefined(recogonizedText), 
          recogonizedText: recogonizedText
        }
      )
    );
  }

  // 20200502 JustCode:
  // Receive the word selected by the user via WordSelector component
  onWordSelected(word) {
    this.props.dispatch(
      pageActions.pageSearchSetState(
        {
          showWordList: false, 
          userWord: word
        }
      )
    );

    if(word.length > 0) {
      setTimeout(() => {
        this.onSearch();
      }, 500);
    }
  }

  // 20200626 JustCode: FCM implementation
  componentDidUpdate(prevProps) {
    if(Helper.carefullyGetValue(this.props, 'route.params.autoSearch'.split('.'), false)) {
      this.props.route.params.autoSearch = false; // Set to false to prevent recursive searching
      setTimeout(() => {
        this.onSearch();
      }, 500);
    }
  }

  render() {
    localizedStrings.setLanguage(this.props.ui.get('lang'));

    return (
      <>
        <SafeAreaView
          style={commonStyles.content}>
          {/* 20200529 JustCode - Change the hard coded string to localized string */}
          <Header navigation={this.props.navigation} Title={localizedStrings.Title} isAtRoot={true} />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
          >
            
            <View style={[commonStyles.column, commonStyles.header]}>
              <Image style={commonStyles.logo} source={require('../../../assets/icon.png')} />
              {/* 20200529 JustCode - Change the hard coded string to localized string */}
              <Text style={commonStyles.sectionTitle}>{localizedStrings.SubTitle}</Text>
            </View>
            
            {/* 
              20200430 - JustCode:
                Add camera button to allow user to use camera to capture word. Both the 
                TextInput & TouchableOpacity will be wrapped with a new View.
            */}
            <View style={styles.searchBox}>
              <TextInput style={styles.searchInput}
                onChangeText={text => this.onUserWordChange(text)}
                // 20200529 JustCode - Change the hard coded string to localized string
                placeholder={localizedStrings.PlaceHolder}
                value={this.props.page.get('search').get('userWord')}
              />
              <TouchableOpacity style={styles.searchCamera} onPress={() => {
                // 20200613 JustCode: Redux implementation
                this.props.dispatch(
                  pageActions.pageSearchShowCamera(true)
                );
              }}>
                <Icon name="ios-camera" size={25} color="#22222288"  />
              </TouchableOpacity>
            </View>

            <View style={{minHeight: 10, maxHeight: 10}}></View>

            <Button
              // 20200529 JustCode - Change the hard coded string to localized string
              title={localizedStrings.BtnSearch}
              onPress={() => this.onSearch()}
            />

            {
              // 20200613 JustCode: Redux implementation
              this.props.page.get('search').get('errorMsg').length > 0 &&
              <Text style={commonStyles.errMsg}>{this.props.page.get('search').get('errorMsg')}</Text>
            }

            {/* 
              Display word definition as custom component 
              // 20200613 JustCode: Redux implementation
            */}
            <WordDefinition def={this.props.page.get('search').get('definition')} />
          </ScrollView>
        </SafeAreaView>
        {
          // 20200613 JustCode: Redux implementation
          this.props.page.get('search').get('showCamera') &&
          <Camera
            cameraType={Constants.Type.back}
            flashMode={Constants.FlashMode.off}
            autoFocus={Constants.AutoFocus.on}
            whiteBalance={Constants.WhiteBalance.auto}
            ratio={'4:3'}
            quality={0.5}
            imageWidth={800}
            enabledOCR={true}
            onCapture={(data, recogonizedText) => this.onOCRCapture(recogonizedText)} 
            onClose={_ => {
              // 20200613 JustCode: Redux implementation
              this.props.dispatch(
                pageActions.pageSearchShowCamera(false)
              );
            }}
          />
        }
        {
          // 20200613 JustCode: Redux implementation
          this.props.page.get('search').get('showWordList') &&
          <WordSelector wordBlock={this.props.page.get('search').get('recogonizedText')} onWordSelected={(word) => this.onWordSelected(word)} />
        }
        {
          // 20200613 JustCode: Redux implementation
          this.props.page.get('search').get('loading') &&
          <ActivityIndicator style={commonStyles.loading} size="large" color={'#219bd9'} />
        }
      </>
    );
  }
}

// 20200613 JustCode: Redux implementation
const ReduxSearch = connect((state) => {
  return {
    ui: state.ui,
    page: state.page
  };
})(Search);

export default (props) => {
  const navigation = useNavigation();
  const route = useRoute(); // 20200626 JustCode: FCM implementation

  return (
    // 20200626 JustCode: FCM implementation
    <ReduxSearch {...props} navigation={navigation} route={route} />
  )
}

const styles = StyleSheet.create({
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    paddingLeft: 4, 
    paddingRight: 4, 
    paddingTop: 2, 
    paddingBottom: 2
  },
  searchInput: {
    padding: 0,
    flex: 1
  },
  // 20200502 - JustCode:
  // Camera icon style
  searchCamera: {
    maxWidth: 50,
    marginLeft: 5,
    padding: 0,
    alignSelf: 'center'
  }
});