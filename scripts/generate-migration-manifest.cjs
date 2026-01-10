const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../db/migrations');
const manifestPath = path.join(migrationsDir, 'manifest.json');
const backendManifestPath = path.join(__dirname, '../backend/src/lib/migrations-manifest.json');

if (!fs.existsSync(migrationsDir)) {
    console.error('Migrations directory not found!');
    process.exit(1);
}

const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

const manifest = {
    migrations: files,
    generated: new Date().toISOString()
};

const manifestJson = JSON.stringify(manifest, null, 2);

fs.writeFileSync(manifestPath, manifestJson);
console.log(`✅ Generated root manifest: ${manifestPath}`);

// Also copy to backend source for Worker access
fs.writeFileSync(backendManifestPath, manifestJson);
console.log(`✅ Mirrored manifest to backend: ${backendManifestPath}`);