import { ActionType } from 'redux-promise-middleware';

export const actionType = {
  ui: {
    setLanguage:                  'UI_SETLANGUAGE',
    showCamera:                   'UI_SHOWCAMERA',
    setProfilePhoto:              'UI_SETPROFILEPHOTO',
  },
  page: {
    pageSearchSetUserWord:        'PAGESEARCH_SETUSERWORD',
    pageSearchSetError:           'PAGESEARCH_SETERROR',
    pageSearchSetLoading:         'PAGESEARCH_SETLOADING',
    pageSearchShowCamera:         'PAGESEARCH_SHOWCAMERA',
    pageSearchSetState:           'PAGESEARCH_SETSTATE',

    pageFavLoadListPending:       `PAGEFAV_LOADLIST${ActionType.Pending}`,
    pageFavLoadListFulfilled:     `PAGEFAV_LOADLIST${ActionType.Fulfilled}`,
    pageFavLoadListRejected:      `PAGEFAV_LOADLIST${ActionType.Rejected}`,

    pageFavDetailSetError:        'PAGEFAVDETAIL_SETERROR',
    pageFavDetailSetLoading:      'PAGEFAVDETAIL_SETLOADING',
    pageFavDetailSetState:        'PAGEFAVDETAIL_SETSTATE',

    
  }
}