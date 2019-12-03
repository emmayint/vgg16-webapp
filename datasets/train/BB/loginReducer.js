// set intitial state
const INITIAL_STATE = {
    isLoggedIn: false,
    username: '',
    email: ''
}

// define funcion, state and action
const loginReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'SET_LOGIN': 
            return{
                ...state,
                isLoggedIn: action.isLoggedIn
            }

        case 'SET_LOGOUT': 
            return{
                ...state,
                isLoggedIn: action.isLoggedIn
            }
        default: 
            return(
                state
            )
    }
}

// export reducer
export default loginReducer