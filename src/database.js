import { openDatabase } from "react-native-sqlite-storage";

const db = openDatabase({
    name: "rn_sqlite"
})
export const createTable = (tableName, tableColumns) => {
    return new Promise((resolve, reject) => {
        // tableColumns: id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(1024)
        db.transaction(txn => {
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS '${tableName}' (${tableColumns})`,
                [],
                (sqlTxn, resultSet) => {
                    resolve(true);
                },
                error => {
                    console.log("Table Create Failed: ", error.message);
                    resolve(false);
                }
            )
        });
    });
};

// TODO extras: (name) VALUES ('value')
export const addToTable = (tableName, extras) => {
    return new Promise(function (resolve, reject) {
        db.transaction(txn => {
            txn.executeSql(
                `INSERT OR REPLACE INTO '${tableName}' ${extras}`,
                [],
                (sqlTxn, resultSet) => {
                    resolve(true);
                },
                error => {
                    console.log("Error on add: ", error.message);
                    resolve(false);
                }
            )
        })

    });
}

export const deleteFromTable = (tableName, extras) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                // TODO extras: WHERE id = (?)
                `DELETE FROM '${tableName}' WHERE ${extras}`,
                [],
                (sqlTxn, resultSet) => {
                    resolve(true);
                },
                error => {
                    console.log("Error on delete: ", error.message);
                    resolve(false);
                }
            )
        })
    });
}

export const getDataFromTable = (tableName, extrasBeforeOrderByDesk) => {
    return new Promise(function (resolve, reject) {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM '${tableName}' ${extrasBeforeOrderByDesk} ORDER BY id DESC`,
                [],
                (transaction, resultSet) => {
                    let len = resultSet.rows.length;
                    if (len > 0) {
                        // let results = [];
                        // for (let i = 0; i < len; i++) {
                        //     let item= resultSet.rows.item(i);
                        //     results.push({ id: item.id, name: item.name });
                        // }
                        resolve(resultSet.rows.raw());
                    } else {
                        resolve(false);
                    }
                },
                error => {
                    console.log("error on getting cat: " + error.message);
                    resolve(false);
                }
            )
        })
    });
}
