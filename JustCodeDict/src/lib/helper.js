import AsyncStorage from '@react-native-community/async-storage';

export default class Helper {

  static isNotNullAndUndefined(obj, props = []) {
    let bIsNullorUndefined =  obj === null || obj === undefined;
    let curObj = null;

    if(!bIsNullorUndefined) {
      curObj = obj;
      if(props !== null) {
        for(let idx=0; idx < props.length; idx++) {
          bIsNullorUndefined = curObj[props[idx]] === null || curObj[props[idx]] === undefined;
          curObj =  curObj[props[idx]]; // Set the curObj[props[idx]] to curObj so that it will recursive down the depth of the object

          if(bIsNullorUndefined)
            break;
        }
      }
    }
    
    return !bIsNullorUndefined;
  }

  static carefullyGetValue(obj, props = [], defaultValue='') {
    let bIsNullorUndefined =  obj === null || obj === undefined;
    let curObj = null;

    if(!bIsNullorUndefined) {
      curObj = obj;
      if(props !== null) {
        for(let idx=0; idx < props.length; idx++) {
          bIsNullorUndefined = curObj[props[idx]] === null || curObj[props[idx]] === undefined;
          curObj =  curObj[props[idx]]; // Set the curObj[props[idx]] to curObj so that it will recursive down the depth of the object

          if(bIsNullorUndefined)
            break;
        }
      }
    }
    
    if(bIsNullorUndefined)
      return defaultValue;
    else
      return curObj;
  }

  static capitalize(str) {
    if (typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  static async isFav(word) {
    let isFavourited = false;

    try {
      const result = await AsyncStorage.getItem('myFav');
     
      if(Helper.isNotNullAndUndefined(result)) {
        let favList = JSON.parse(result);
        let isExist = favList.filter(item => item.word.toUpperCase() === word.toUpperCase());
        if(Helper.isNotNullAndUndefined(isExist)) {
          isFavourited = isExist.length > 0;
        }
      }
    } catch(error) {
      isFavourited = false;
    }
    return isFavourited;
  }

  static async makeFav(word, sense) {
    // Always insert the new word to the first item in the array
    let favList = [{word: word, sense: sense, addedOn: new Date()}];

    try {
      let existingFav = [];
      let existingFavStr = await AsyncStorage.getItem('myFav');
      if(Helper.isNotNullAndUndefined(existingFavStr)) {
        existingFav = JSON.parse(existingFavStr);
      }

      if(existingFav.length > 0) {
        favList = favList.concat(existingFav);
      }

      const result = await AsyncStorage.setItem('myFav', JSON.stringify(favList));
    } catch(error) {

    }
  }

  static async deleteFav(word, callback=null) {
    let favList = [];

    try {
      let existingFavStr = await AsyncStorage.getItem('myFav');
      if(Helper.isNotNullAndUndefined(existingFavStr)) {
        favList = JSON.parse(existingFavStr);
      }

      if(favList.length > 0) {
        let isExist = favList.filter(item => item.word.toUpperCase() === word.toUpperCase());
        if(Helper.isNotNullAndUndefined(isExist) && isExist.length > 0) {
          const index = favList.indexOf(isExist[0]);
          if (index > -1) {
            favList.splice(index, 1);
            const result = await AsyncStorage.setItem('myFav', JSON.stringify(favList));
            if(callback)
              callback();
          }
        }
      }      
    } catch(error) {

    }
  }

  static async getFavList(search) {
    let favList = [];

    try {
      let favListStr = await AsyncStorage.getItem('myFav');
      if(Helper.isNotNullAndUndefined(favListStr)) {
        favList = JSON.parse(favListStr);
      }

      if(favList.length > 0 && Helper.isNotNullAndUndefined(search) && search.length > 0) {
        let filteredList = favList.filter(item => item.word.toUpperCase().includes(search.toUpperCase()));
        return filteredList;
      }
      else {
        return favList;
      }
    } catch(error) {
      return favList;
    }
  }

  static getSense(def) {
    let defSense = ''
    if(Helper.isNotNullAndUndefined(def, ['results', '0', 'lexicalEntries'])) {
      let lexicalEntries = def.results[0].lexicalEntries;
  
      for(lexicalIndex in lexicalEntries) {
        let lexicalItem = lexicalEntries[lexicalIndex];
        if(this.isNotNullAndUndefined(lexicalItem, ['entries','0','senses'])) {
          let senses = lexicalItem.entries[0].senses;
          if(senses && senses.length > 0) {
            for(senseIndex in senses) {
              let sense = senses[senseIndex];
              if(sense.definitions) { // Only if sense have definition
                let definition = Helper.carefullyGetValue(sense, ['definitions', '0'], '');
                if(definition.length > 0) {
                  defSense = definition;
                  break;
                }
              }
            }
          }
        }

        if(defSense.length > 0)
          break;
      }
    }

    return defSense;
  }

  // 20200529 JustCode: 
  // Get user language setting from AsyncStorage 
  static async getDeviceLanguageFromStorage() {
    try {
      let lang = await AsyncStorage.getItem('lang');
      if(lang && lang.length > 0)
        return lang;
      else
        return 'en'; // No language setting, default it to english
    }
    catch(error) {
      // Can't get the language setting, default it to english
      return 'en';
    }
  }

  static updateDeviceLanguageToStorage(lang) {
    try {
      AsyncStorage.setItem('lang', lang);
    }
    catch(error) { }
  }
}