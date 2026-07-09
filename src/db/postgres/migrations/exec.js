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
        const files = fs
            .readdirSync(_dirname)
            .filter((file) => file.endsWith('.sql'))

        for (const file of files) {
            const filePath = path.join(_dirname, file)
            const script = fs.readFileSync(filePath, 'utf-8')

            await client.query(script)
            console.log(`Migrations for file ${file} executed successfully.`)
        }
        console.log('All migrations executed successfully!')
    } catch (error) {
        console.error(error)
    } finally {
        await client.release()
    }
}

execMigrations()
