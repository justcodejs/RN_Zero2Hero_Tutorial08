import { actionType } from './actionType';
import Helper from '../../lib/helper';

export function pageSearchSetUserWord(userWord) {
  return {
    type: actionType.page.pageSearchSetUserWord,
    payload: userWord
  }
}

export function pageSearchSetError(error) {
  return {
    type: actionType.page.pageSearchSetError,
    payload: error
  }
}

export function pageSearchSetLoading(loading) {
  return {
    type: actionType.page.pageSearchSetLoading,
    payload: loading
  }
}

export function pageSearchShowCamera(show) {
  return {
    type: actionType.page.pageSearchShowCamera,
    payload: show
  }
}

export function pageSearchSetState(state) {
  return {
    type: actionType.page.pageSearchSetState,
    payload: state
  }
}

export function pageFavLoadList() {
  return function(dispatch) {
    dispatch({type: actionType.page.pageFavLoadListPending, payload: null});

    Helper.getFavList('')
    .then(result => {
      dispatch({
        type: actionType.page.pageFavLoadListFulfilled,
        payload: result
      });
    })
    .catch(err => {
      dispatch({
        type: actionType.page.pageFavLoadListRejected,
        payload: err
      });
    });
  }
}

export function pageFavDetailSetError(error) {
  return {
    type: actionType.page.pageFavDetailSetError,
    payload: error
  }
}

export function pageFavDetailSetLoading(loading) {
  return {
    type: actionType.page.pageFavDetailSetLoading,
    payload: loading
  }
}

export function pageFavDetailSetState(state) {
  return {
    type: actionType.page.pageFavDetailSetState,
    payload: state
  }
}