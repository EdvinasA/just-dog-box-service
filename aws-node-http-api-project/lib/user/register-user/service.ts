import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs-then';

export const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
}

export const checkIfInputIsValid = (eventBody) => {
    if (
        !(eventBody.name &&
            eventBody.name.length > 5 &&
            typeof eventBody.name === 'string')
    ) return Promise.reject(new Error('Username error. Username needs to longer than 5 characters'));

    if (
        !(eventBody.email &&
            typeof eventBody.name === 'string')
    ) return Promise.reject(new Error('Email error. Email must have valid characters.'));

    return Promise.resolve();
}

// export const register = (eventBody) => {
//     return checkIfInputIsValid(eventBody) // validate input
//         .then(() =>
//             User.findOne({ email: eventBody.email }) // check if user exists
//         )
//         .then(user =>
//             user
//                 ? Promise.reject(new Error('User with that email exists.'))
//                 : bcrypt.hash(eventBody.password, 8)
//         )
//         .then(hash =>
//             User.create({ name: eventBody.name, email: eventBody.email, password: hash }) // create the new user
//         )
//         .then(user => ({ auth: true, token: signToken(user._id) })); // sign the token and send it back
// }

// function login(eventBody) {
//     return User.findOne({ email: eventBody.email })
//         .then(user =>
//             !user
//                 ? Promise.reject(new Error('User with that email does not exits.'))
//                 : comparePassword(eventBody.password, user.password, user._id)
//         )
//         .then(token => ({ auth: true, token: token }));
// }

export const comparePassword = (eventPassword, userPassword, userId) => {
    return bcrypt.compare(eventPassword, userPassword)
        .then(passwordIsValid =>
            !passwordIsValid
                ? Promise.reject(new Error('The credentials do not match.'))
                : signToken(userId)
        );
}

// export const me = (userId) => {
//     return User.findById(userId, { password: 0 })
//         .then(user =>
//             !user
//                 ? Promise.reject('No user found.')
//                 : user
//         )
//         .catch(err => Promise.reject(new Error(err)));
// }