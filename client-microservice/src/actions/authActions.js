 // Register
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

 export const registerUser = (userData, history) => dispatch =>{

     axios.post('/api/users/register', userData)
         .then(res => {
             history.push('/login')
         })
         .catch(err => {
             dispatch({
                 type: GET_ERRORS,
                 payload: err.response.data
             })
         });

 };

 // Login - GET User Token
 export const loginUser = (userData) => (dispatch) => {
     axios.post('/api/users/login', userData)
         .then(res => {
             // Save to local Storage
             const { token } = res.data;

             //Set Token To Local Storage
             localStorage.setItem("jwtToken", token);

             // Set token Auth Header
             setAuthToken(token);

             //Decode token to get user Data
             const decoded = jwt_decode(token);

             // Set current user
             dispatch(setCurrentUser(decoded));
         })
         .catch(err => {
             dispatch({
                 type: GET_ERRORS,
                 payload: err.response.data
             })
         })
 };

 // Set Logged in user
 export const setCurrentUser = (decoded) => {
     return {
         type: SET_CURRENT_USER,
         payload: decoded
     }
 };

 export const logoutUser = () => dispatch => {
     localStorage.removeItem("jwtToken");

     // Remove Auth Header
     setAuthToken(false);

     // Set current user to {} which will set isAuthenticated to false
     dispatch(setCurrentUser({}))

 };