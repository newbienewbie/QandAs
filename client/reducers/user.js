import { TOKEN_NAME } from '../../configs/config';
import {
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
  REMOVE_USER_INFO
} from '../actions';

const initialState = {};

export default function user (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_USER_INFO:
      if (!action.verify) {
        action.replace && action.replace({ pathname: '/signIn' });
        return state;
      }
      return action.user;
    case REMOVE_USER_INFO:
      window.localStorage.removeItem(TOKEN_NAME);
      return {};
    default:
      return state;
  }
};
