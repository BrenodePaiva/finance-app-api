import 'dotenv/config.js'
import fs from 'fs'
import path from 'path'
import { pool } from '../helper.js'
import { fileURLToPath } from 'url'

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

const execMigrations = async () => {
    const client = await pool.connect()
    try {
        const filePath = path.join(_dirname, '01-init.sql')
        const script = fs.readFileSync(filePath, 'utf-8')

        await client.query(script)
        console.log('Migrations executed successfully')
    } catch (error) {
        console.error(error)
    } finally {
        await client.release()
    }
}

execMigrations()
