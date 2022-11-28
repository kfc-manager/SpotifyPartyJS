const querystring = require('node:querystring');
const request = require('request');
const express = require('express');
const app = express();

const client_id = '';
const client_secret = '';
const redirect_uri = 'http://localhost:8000/callback';

var token;

const generateRandomString = (myLength) => {
    const chars =
      "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );
  
    const randomString = randomArray.join("");
    return randomString;
};

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
      }));
  });

app.get('/callback', (req, res) => {

    var code = req.query.code || null;
    var state = req.query.state || null;
    if (state === null) {
        res.redirect('/#' +
        querystring.stringify({
            error: 'state_mismatch'
        }));
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
            },
            headers: {
             'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                token = body.access_token;
                console.log(token);
            }
        });
}
});
  

app.get('/search/:query', (req, res) => {
    const getRequest = {
        url: 'https://api.spotify.com/v1/search?q=' + req.params.query + '&type=track',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    request.get(getRequest, (error, response, body) => {
        let arr = [];
        for (let i = 0; i < 20; i++) {
            arr.push(body.tracks.items[i + ""]);
        }
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            newArr.push(
                { 
                    'id': arr[i].id,
                    'title': arr[i].name,
                    'icon': arr[i].album.images["0"].url,
                    'artist': arr[i].artists["0"].name,
                    'duration': arr[i].duration_ms
                })
        }
        res.send(newArr);
    });
});

app.get('/queue/add/:songID', (req, res) => {
    const postRequest = {
        url: 'https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A' + req.params.songID,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    }

    request.post(postRequest, (error, response, body) => {
        res.send(body);
    });
});

app.get('/queue/get', (req, res) => {
    const getRequest = {
        url: 'https://api.spotify.com/v1/me/player/queue',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    request.get(getRequest, (error, response, body) => {
        if (body.queue === []) {
            res.send('Player is not playing and were not able to return queue');
        }
        let arr = [];
        for (let i = 0; i < 20; i++) {
            if (body.queue[i + ""] != undefined) {arr.push(body.queue[i + ""]);}
        }
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            newArr.push(
                { 
                    'id': arr[i].id,
                    'title': arr[i].name,
                    'icon': arr[i].album.images["0"].url,
                    'artist': arr[i].artists["0"].name,
                    'duration': arr[i].duration_ms,
                    'index': i+1
                });
        }
        console.log(newArr);
        res.send(newArr);
    });
});

//TODO
app.get('/delete/:songID', (req, res) => {

});

app.listen(8000);