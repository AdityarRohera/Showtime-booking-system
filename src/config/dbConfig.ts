
import dotenv from 'dotenv'
import {Pool} from 'pg'
dotenv.config();

const pool = new Pool({
  user: process.env.USER as string,
  host: process.env.HOST as string,
  database: process.env.DATABASE as string,
  password: process.env.PASSWORD as string,
  port: Number(process.env.DATABASE_PORT)
});


const dbConnection = async() => {
    try {
		await pool.connect();
		console.log("✅ Connected to PostgreSQL (pgAdmin)");
	} catch (err) {
		console.error("❌ PostgreSQL Connection Failed:", err);
	}
}

export {dbConnection , pool};
