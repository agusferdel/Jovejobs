import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true 
});

export const executeQuery = async(sql, values=[]) => {
  let connection;
  try {
   
    connection = await dbPool.getConnection()

    let [result] = await connection.query(sql,values);
    return result;

  } catch (error) {
    console.log(error);
    throw error;
    
  }finally {

    if(connection){
      connection.release();
    }
  } 
}