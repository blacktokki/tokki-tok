#!/usr/bin/env node

const axios = require('axios')
const WebSocket = require('ws');
require('dotenv').config()
const USER_NUMBER = 2
const channel = 3
const [SCHEMA, DOMAIN] = `${process.env.API_URL}`.split('://')

axios.get('https://baconipsum.com/api/?type=all-meat&paras=20')
const createUser = async()=>{
    const token = (await axios.post(`${process.env.API_URL}/messenger/api-token-auth/`, {username: "guest", password:"guest"})).data
    const user = (await axios.get(`${process.env.API_URL}/messenger/api/v1/users/memberships/?_self=true`, {
        headers:{'Authorization': `JWT ${token}`}})).data[0]
    const websocket = new WebSocket(`${SCHEMA=='https'?'wss':'ws'}://${DOMAIN}/messenger/ws/`, ['Authorization', token])
    websocket.onmessage = (event) => {console.log("onmessage", event.data)}
    return {token, user, websocket}
}
const promise1 = Array(USER_NUMBER).fill().map(createUser)
Promise.all(promise1).then(users=>{
    const promise2 = users.map(user=>axios.post(`${process.env.API_URL}/messenger/api/v1/messengercontents/messages/`, {
        channel,
        content: `${user.user.id}`,
        user: user.user.id
    }, {
        headers:{
            'Authorization': `JWT ${user.token}`
        }
    }))
    Promise.all(promise2).then((responses)=>{
        users.forEach(user=>user.websocket.close())
    })
});
