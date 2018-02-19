
let users = JSON.parse(localStorage.getItem('users')) || [];
    
export function configureFakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
                    let params = JSON.parse(opts.body);
                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            token: 'fake-jwt-token'
                        };
                        resolve({ ok: true, json: () => responseJson });
                    } else {
                        reject('Username o contraseña es incorrecta');
                    }

                    return;
                }
                if (url.endsWith('/users') && opts.method === 'GET') {
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        resolve({ ok: true, json: () => users });
                    } else {
                        reject('No autorizado');
                    }
                    return;
                }
                if (url.match(/\/users\/\d+$/) && opts.method === 'GET') {
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => { return user.id === id; });
                        let user = matchedUsers.length ? matchedUsers[0] : null;

                        resolve({ ok: true, json: () => user});
                    } else {
                        reject('No autorizado');
                    }

                    return;
                }
                if (url.endsWith('/users/register') && opts.method === 'POST') {
                    let newUser = JSON.parse(opts.body);

                    let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                    if (duplicateUser) {
                        reject('el usuario "' + newUser.username + '" ya existe');
                        return;
                    }
                    newUser.id = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));

                    resolve({ ok: true, json: () => ({}) });

                    return;
                }
                if (url.endsWith('/entrust/register') && opts.method === 'POST') {
                    let newEntrust = JSON.parse(opts.body);
                    newEntrust.id = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
                    users.push(newEntrust);
                    localStorage.setItem('entrust', JSON.stringify(newEntrust));

                    resolve({ ok: true, json: () => ({}) });

                    return;
                }
                realFetch(url, opts).then(response => resolve(response));

            }, 500);
        });
    }
}