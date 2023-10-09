import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CNavbar from './components/CNavbar';
import LoginSign from './components/LoginSignup';
import { useGenerationStore } from './utils/zustand';
import { Suspense, lazy, useEffect, useState } from 'react';
import { getLUsers, getToken } from './utils/common';
const UserList = lazy(() => import('./components/UserList'));

function App() {
  const{setLogin, isLogin} = useGenerationStore()
  const[susers, setSusers] = useState(JSON.parse(getLUsers()) )
  // const[susers, setSusers] = useState(JSON.parse(getLUsers()) || users)


  useEffect(()=>{
    if(getToken()){
      setLogin(true)
    }
  }, [])

  return (
    <div className="">
      <div className="">
        <CNavbar susers={susers} setSusers={setSusers} />
        {
          isLogin ?
          <>
          <Suspense fallback={<div>Loading...</div>}>
            <UserList susers={susers} setSusers={setSusers} />
          </Suspense>
          </>
          :
          <LoginSign />
        }
      </div>
    </div>
  );
}

export default App;
