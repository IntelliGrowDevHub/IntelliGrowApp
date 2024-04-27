import {createClient} from '@vercel/postgres'

async function register({id, username, email, api_key, channel_id, password}){
    const client = createClient();
    await client.connect();

    try{
        const query=`
        insert into users(id, username, email, api_key, channel_id, password) values($1, $2, $3, $4,$5, $6);`;

        await client.query(query, [id, username, email, api_key, channel_id, password]);

        console.log('Succesful');
    }
    catch(error){
        console.error('Error inserting data', error);
    }
    finally{
        await client.end();
    }
}

export {register}