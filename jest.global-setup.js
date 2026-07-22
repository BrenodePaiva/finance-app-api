import { execSync } from 'child_process'

function waitForPostgres() {
    let ready = false
    let attempts = 0

    while (!ready && attempts < 10) {
        try {
            // roda o pg_isready dentro do container
            execSync(
                'docker exec finance-app-test pg_isready -U root -h localhost -p 5432'
            )
            ready = true
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            attempts++
            console.log(`Postgres ainda não está pronto, tentativa ${attempts}`)
            // espera 2 segundos antes de tentar de novo
            execSync('sleep 2')
        }
    }

    if (!ready) {
        throw new Error('Postgres não ficou pronto a tempo')
    }
}

async function init() {
    execSync('docker compose up -d --wait postgres-test')
    waitForPostgres()
    execSync('npx prisma db push')
}

export default init
