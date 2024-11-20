const express = require('express');
const crypto = require('crypto');
let sessionID=[];


function createSession(email){
    
let sessionkey=crypto.randomBytes(16).toString('hex');
let newsessionID = {
    key: sessionkey,
    value: email
};
sessionID.push(newsessionID);


}

function destroySession(key){
 let sessionID = sessionID.filter(sessionID => sessionID.key !== keyToDelete);


}

module.exports={ createSession, destroySession}