import React, { useEffect } from 'react';
import './App.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import { HomePage } from './features/home/components/HomePage';
import { LoginPage } from './features/home/components/LoginPage';
import { BookDetailsPage } from './features/books/components/BookDetailsPage';
import { Role } from './common/role';
import { useDispatch } from 'react-redux';
import { loadAuthorsAsync, loadPublishersAsync } from './common/commonSlice';
import { registerInterceptors } from './api/interceptors';
import { BooksPage } from './features/books/components/BooksPage';
import { BookEditPage } from './features/books/components/BookEditPage';
import { LoansPage } from './features/loans/components/LoansPage';
import { Navigation } from './features/common/components/Navigation';
import { PrivateRoute } from './features/common/components/PrivateRoute';

function App(): JSX.Element {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    registerInterceptors(history);

    dispatch(loadAuthorsAsync());
    dispatch(loadPublishersAsync());    
  }, [history, dispatch]);

  return (
    <div className="App">      
      <div>
        <Navigation />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/home' component={HomePage} />
          <Route path='/login/:redirectUrl?' component={LoginPage} />
          <Route exact path="/books" component={BooksPage} />  
          <Route path="/books/details/:id" component={BookDetailsPage} />
          <PrivateRoute path="/books/edit/:id" component={BookEditPage} roles={[Role.Administrator, Role.Librarian]} />
          <PrivateRoute path="/loans" component={LoansPage} roles={[Role.Administrator, Role.Librarian]} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
