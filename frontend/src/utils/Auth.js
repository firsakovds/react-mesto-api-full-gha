export class Auth {
    constructor(options) {
        this._baseUrl = options.baseUrl;
       // this._headers = options.headers;
    }
    //сделаем 1 приватный метод для использования во всем классе
    _checkError(res) {
        if (res.ok) {
            return res.json();
        }
        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
    }
    register = (password, email) => {
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(password, email)
        })
            .then(this._checkError)
    };
    authorize = ({password, email}) => {
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password, email})
        })
            .then(this._checkError)
    };
    checkToken = (JWT) => {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWT}`,
            }
        })
            .then(this._checkError)
    }
}

const auth = new Auth({
    baseUrl: 'http://localhost:3001',
   //baseUrl: 'https://auth.nomoreparties.co',
    /*headers: {

        'Content-Type': 'application/json'
    }*/
})
export default auth
