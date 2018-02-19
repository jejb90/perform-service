
export const entrustService = {
    register,
    google
    };

function register(entrust) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entrust)
    };

    return fetch('/entrust/register', requestOptions).then(handleResponse);
}

function google(entrust) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entrust)
    };

    return fetch('/entrust/google', requestOptions).then(handleResponse);
}

function handleResponse(response) {
    if (!response.ok) { 
        return Promise.reject(response.statusText);
    }

    return response.json();
}