import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
} from 'react-router-dom';

import { useDispatch } from 'react-redux';

import { firebase } from '../firebase/firebaseConfig';
import { AuthRouter } from './AuthRouter';

import { PrivateRoute } from '../routers/PrivateRoute';
import { PublicRoute } from '../routers/PublicRoute';

import { JournalScreen } from '../components/journal/JournalScreen';
import { login } from '../actions/auth';
import { startLoadingNotes } from '../actions/notes';

export const AppRouter = () => {
    
    const dispatch = useDispatch();

    const [checking, setChecking] = useState(true)
    const [ isLoggedIn , setisLoggedIn ] = useState(false)

    useEffect(() => {
        
        firebase.auth().onAuthStateChanged( async (user) => {
            if ( user?.uid ) {
                dispatch( login( user.uid, user.displayName ) );
                setisLoggedIn ( true );

                dispatch( startLoadingNotes( user.uid ) );
            }else {
                setisLoggedIn( false );
            }

            setChecking(false);

        });

    }, [ dispatch, setChecking, setisLoggedIn ])

    if ( checking) {
        return(
            <h1>Wait...</h1>
        )
    }
    
    return(
        <Router>
            <div>
                <Switch>
                    <PublicRoute
                        path='/auth'
                        component={ AuthRouter }
                        isAuthenticated={ isLoggedIn }
                    />
                    <PrivateRoute
                        exact
                        path='/'
                        isAuthenticated={ isLoggedIn }
                        component={ JournalScreen }
                    />

                    <Redirect to="/auth/login" />
                </Switch>
            </div>
        </Router>
    )
}
