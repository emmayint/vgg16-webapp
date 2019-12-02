// import axios from 'axios';

// export const setLogin = () => ({
//     type: "SET_LOGIN",
//     isLoggedIn: true
// })

export const setUser = (payload) => ({
    type: "SET_USER", 
    username: payload.username,
    email: payload.email,
    password: payload.password
})

export const setLogout = () => ({
    type: "SET_LOGOUT",
    isLoggedIn: false
})

const verifyLogin = (email) => {
    if (email === "email@email.com") {
        return true
    }  
}

export const setLogin = (email, dispatch) => (
    verifyLogin(email)?
        dispatch({
        type: "SET_LOGIN",
        isLoggedIn: true
        })
    :
        alert('error')
    )
    // if (email === "email@email.com") {
    //     return true
    // }

    // simple way to verify email that was demo'ed in class
    // {verified? (


    //     // setIsLoggedIn(true);
    //     alert('yo');
    //     dispatch(
    //         type: 'SET_LOGIN',
    //         isLoggedIn: true
    //     )
    // )    
    // }

    // return axios({
    //     // what is our new endpoint?
    //     url: `https://web-api-ashu.staging.brilliant.tech/ramjet/users/${email}`,
    //     method: 'get',
    //     responseType: 'json'
    // })
    // .then((res, dispatch) => {
    //     let status = 'OK';
    //     // let result = res
    //     let result = res.data || 'Error getting data';

    //     dispatch({
    //         type: 'SET_LOGIN',
    //         isLoggedIn: true
    //     });

    //     return {
    //         status: status,
    //         result: result
    //     };
    // })
    // .catch((err) => {
    //     let status = 'ERROR';
    //     let result = err.message;
    //     return {
    //         status: status,
    //         result: result
    //     };
    // });
