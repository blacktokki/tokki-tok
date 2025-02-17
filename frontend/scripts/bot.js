#!/usr/bin/env node

const axios = require('axios')
const WebSocket = require('ws');
require('dotenv').config()

const USER_NUMBER = parseInt(process.env.TEST_USER_NUMBER)
const MESSAGE_NUMBER = parseInt(process.env.TEST_MESSAGE_NUMBER)
const channel = parseInt(process.env.TEST_CHANNEL_ID)

const [SCHEMA, DOMAIN] = `${process.env.API_URL}`.split('://')
const endpoint = `${process.env.API_URL}/messenger`
const createUser = async()=>{
    const token = (await axios.post(`${endpoint}/api-token-auth/`, {username: "guest", password:"guest"})).data
    const options = {headers:{'Authorization': `JWT ${token}`}}
    const user = (await axios.get(`${endpoint}/api/v1/users/?_self=true`, options)).data[0]
    const websocket = new WebSocket(`${SCHEMA=='https'?'wss':'ws'}://${DOMAIN}/messenger/ws/`, ['Authorization', token])
    websocket.onmessage = (event) => {console.log("onmessage", event.data)}
    return {user, websocket, options, cnt:0}
}

(async ()=>{
    const contents = [].concat(...(await axios.get(`https://baconipsum.com/api/?type=all-meat&paras=20`)).data.map(v=>v.split('  ')))
    const users = await Promise.all(Array(USER_NUMBER).fill().map(createUser))
    await axios.post(`${endpoint}/api/v1/messengermembers/bulk/`, {channel, user_ids:users.map(user=>user.user.id)}, users[0].options)
    await Array(MESSAGE_NUMBER).fill(users).map(async users=>await Promise.all(users.map(async user=>await axios.post(`${endpoint}/api/v1/messengercontents/messages/`, {
        channel,
        content: contents[user.user.id % contents.length],
        user: user.user.id
    }, user.options))))
    const userToMember = {}
    const members = (await axios.get(`${endpoint}/api/v1/messengermembers/?channel=${channel}`, users[0].options)).data.forEach(v=>{userToMember[v.user]=v.id})
    await Promise.all(users.map(user=>axios.delete(`${endpoint}/api/v1/messengermembers/${userToMember[user.user.id]}/`, user.options)))
    // axios.delete(`${process.env.API_URL}/messenger/api/v1/messengercontents/${messages[0].data.content}/`, users[0].options)
    await Promise.all(users.map(user=>user.websocket.close()))
})()
