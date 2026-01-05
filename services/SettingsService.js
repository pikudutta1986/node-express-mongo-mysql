// IMPORT MYSQL DB CONNECTION POOL
import {connectToMySql} from "../database/mysqldb.js";

// SETTINGS SERVICE TO HANDLE GLOBAL SETTINGS OPERATIONS
export class SettingsService {
    constructor() {
        // MYSQL CONNECTION POOL
        this.mysqlConnectionPool = connectToMySql();
    }

    // ================================================
    // FUNCTION TO GET ALL SETTINGS
    // ================================================
    async getAllSettings() {
        try {
            const pool = await this.mysqlConnectionPool;
            const sqlString = "SELECT `key`, `value`, `type`, `description` FROM settings ORDER BY `key`";
            const [rows] = await pool.execute(sqlString);

            // Convert settings array to object with proper type conversion
            const settings = {};
            rows.forEach(row => {
                let value = row.value;
                
                // Convert value based on type
                if (row.type === 'number') {
                    value = parseFloat(row.value) || 0;
                } else if (row.type === 'boolean') {
                    value = row.value === 'true' || row.value === '1';
                } else if (row.type === 'json') {
                    try {
                        value = JSON.parse(row.value);
                    } catch (e) {
                        value = row.value;
                    }
                }
                
                settings[row.key] = {
                    value: value,
                    type: row.type,
                    description: row.description
                };
            });

            return {
                success: true,
                data: settings,
                message: "Settings fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching settings:", error);
            throw new Error("Failed to fetch settings: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET SINGLE SETTING BY KEY
    // ================================================
    async getSetting(key) {
        try {
            const pool = await this.mysqlConnectionPool;
            const sqlString = "SELECT `key`, `value`, `type`, `description` FROM settings WHERE `key` = ?";
            const [rows] = await pool.execute(sqlString, [key]);

            if (rows.length === 0) {
                throw new Error("Setting not found");
            }

            const row = rows[0];
            let value = row.value;
            
            // Convert value based on type
            if (row.type === 'number') {
                value = parseFloat(row.value) || 0;
            } else if (row.type === 'boolean') {
                value = row.value === 'true' || row.value === '1';
            } else if (row.type === 'json') {
                try {
                    value = JSON.parse(row.value);
                } catch (e) {
                    value = row.value;
                }
            }

            return {
                success: true,
                data: {
                    key: row.key,
                    value: value,
                    type: row.type,
                    description: row.description
                },
                message: "Setting fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching setting:", error);
            throw new Error("Failed to fetch setting: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO UPDATE SETTINGS (BULK UPDATE)
    // ================================================
    async updateSettings(settingsData) {
        try {
            const pool = await this.mysqlConnectionPool;
            
            // Start transaction
            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                const updates = [];
                
                for (const [key, setting] of Object.entries(settingsData)) {
                    let value = setting.value;
                    
                    // Convert value to string based on type
                    if (setting.type === 'json') {
                        value = JSON.stringify(value);
                    } else {
                        value = String(value);
                    }

                    const sqlString = `
                        INSERT INTO settings (\`key\`, \`value\`, \`type\`, \`description\`) 
                        VALUES (?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE 
                            \`value\` = VALUES(\`value\`),
                            \`type\` = VALUES(\`type\`),
                            \`description\` = VALUES(\`description\`)
                    `;
                    
                    await connection.execute(sqlString, [
                        key,
                        value,
                        setting.type || 'string',
                        setting.description || null
                    ]);
                }

                await connection.commit();
                
                return {
                    success: true,
                    message: "Settings updated successfully"
                };
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            throw new Error("Failed to update settings: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO UPDATE SINGLE SETTING
    // ================================================
    async updateSetting(key, value, type = 'string', description = null) {
        try {
            const pool = await this.mysqlConnectionPool;
            
            // Convert value to string based on type
            let stringValue = String(value);
            if (type === 'json') {
                stringValue = JSON.stringify(value);
            }

            const sqlString = `
                INSERT INTO settings (\`key\`, \`value\`, \`type\`, \`description\`) 
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    \`value\` = VALUES(\`value\`),
                    \`type\` = VALUES(\`type\`),
                    \`description\` = VALUES(\`description\`)
            `;
            
            const [result] = await pool.execute(sqlString, [
                key,
                stringValue,
                type,
                description
            ]);

            return {
                success: true,
                message: "Setting updated successfully"
            };
        } catch (error) {
            console.error("Error updating setting:", error);
            throw new Error("Failed to update setting: " + error.message);
        }
    }
}

