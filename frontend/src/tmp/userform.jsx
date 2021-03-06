import React, {useState}  from 'react';
import { withCookies } from 'react-cookie';
import axios from 'axios';
import { Button } from '@material-ui/core';


const UserForm = (props) => {

  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [email, setEmail] = useState('');
  const [ loginFunction, setLoginFunction ] = useState(true);
  const [ errorMessage, setError ] = useState("");

  const auth = (event) => {
    event.preventDefault();
    let form_data = new FormData();

    form_data.append('username', username);
    form_data.append('password', password);
    form_data.append('email', email);

    const postUri = loginFunction ? `http://localhost:8000/api/token/` : `http://localhost:8000/api/user/`;

    axios.post(postUri, form_data, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then( res => {
        props.cookies.set('access-token', res.data.token,{sameSite: 1, secure: 1});
        window.location.href = "/login";
        console.log(res.data)
        console.log(props.cookies)
    })
    .catch( error => {
      setError(error.response.data)
    });
  }

  const changeFunction = () => {
    setLoginFunction(!loginFunction)
    setUsername("")
    setPassword("")
    setEmail('')
    setError("")
  }

  return(
    <div className="form central-placement">
      <form onSubmit={auth}>

        <div>
          <h3>{loginFunction ? 'ログイン' : 'サインイン'}</h3>
        </div>
        
        { errorMessage.non_field_errors ? <p className="red">{errorMessage.non_field_errors}</p> : null }

        <div className="form-element">
          <input type="text" name="username" value={username}
              className="form-element--username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名" />
          { errorMessage.username ? <p className="red">{errorMessage.username}</p> : null }
        </div>

        <div className="form-element">
          <input type="password" name="password" value={password}
              className="form-element--password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード" />
          { errorMessage.password ? <p className="red">{errorMessage.password}</p> : null }
        </div>

        <div className='form-element'>
            <input type='text' name='email' value={email} className='form-elemnt-email' onChange={(e) => setEmail(e.target.value)} placeholder='メールアドレス'/>
            {errorMessage.email ? <p className='red'>{errorMessage.email}</p>:null}
        </div>

        <div className="form-element right-placement">
          <Button variant="contained" color="primary" type="submit" >{loginFunction ? 'ログイン' : 'サインイン'} </Button>
        </div>

        <div className="center-placement">
          <Button variant="contained" type="button" onClick={changeFunction}>{loginFunction ? 'アカウントを作成する' : 'ログインする'} </Button>
        </div>

      </form>
    </div>
   )

 }

export default withCookies(UserForm)