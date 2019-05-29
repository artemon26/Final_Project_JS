class Question {
    giveQuestion() {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', 'http://localhost:3000/api/questions', true);

            xhr.onload = () => resolve(JSON.parse(xhr.response));

            xhr.send();


        });
    }

    addUser(newUser) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', 'http://localhost:3000/api/users', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = () => resolve(JSON.parse(xhr.response));

            xhr.send(JSON.stringify(newUser));
        });
    }
}

export default Question;