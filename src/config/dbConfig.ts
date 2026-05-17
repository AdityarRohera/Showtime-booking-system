
import {Pool} from 'pg'

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
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
