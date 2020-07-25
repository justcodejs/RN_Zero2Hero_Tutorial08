import { combineReducers } from 'redux';
import ui from './uiReducer';
import page from './pageReducer';

// if have a new reducer, add in to the list
export default combineReducers({
  ui,
  page
})