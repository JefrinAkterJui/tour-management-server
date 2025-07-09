import {Server} from 'http'
import { connectDB } from './app/config/db';
import app from './app';

const PORT = 5000
let server : Server;

async function main(){
    try {
        connectDB()
        server = app.listen(PORT, ()=>{
            console.log(`App Listening on PORT ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

main()

