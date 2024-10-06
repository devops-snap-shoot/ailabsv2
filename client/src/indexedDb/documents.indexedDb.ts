const init = () => {
    const indexedDb: IDBFactory = window.indexedDB
    const conexion = indexedDb.open('Documents', 1)
    return new Promise<any>(resolve => {
        conexion.onsuccess = () =>{
            const db: IDBDatabase = conexion.result
            resolve(
                {
                    message: "Database open",
                    database: db,
                    error: null,
                    state: 'open'
                }
            )
        }
    
        conexion.onupgradeneeded = (e) =>{
            const db = (e.target as IDBOpenDBRequest).result
            const coleccionObjetos = db.createObjectStore('File',{
                keyPath: 'id'
            })
            coleccionObjetos.transaction.oncomplete = (event) => {
                resolve(
                    {
                        message: "Database created / updated",
                        database: db,
                        error: null,
                        state: 'updated'
                    }
                )
            }
            
        }
    
        conexion.onerror = (error) =>{
            resolve(
                {
                    message: "Error",
                    error: error,
                    state: 'error'
                }
            )
        }
    })
}

const update = (data: any, database: IDBDatabase) => {
    return new Promise<any>(resolve => {
        try {
            const trasaccion = database.transaction(['File'],'readwrite')
            const coleccionObjetos = trasaccion.objectStore('File')
            const conexion = coleccionObjetos.put(data)

            conexion.onsuccess = (ev) =>{
                resolve({
                    data: ev,
                    state: true,
                    err: null
                })
            }

            conexion.onerror = (ev) =>{
                resolve({
                    data: ev,
                    state: false,
                    err: null
                })
            }

        } catch (err) {
            resolve({
                err: err,
                state: false
            })
        }
    }) 
}

const deleteDb = (clave: string | number, database: IDBDatabase) =>{      
    return new Promise(resolve => {
        const trasaccion = database.transaction(['File'],'readwrite')
        const coleccionObjetos = trasaccion.objectStore('File')
        const conexion = coleccionObjetos.delete(clave)

        conexion.onsuccess = (ev) =>{
            resolve({
                data: ev,
                state: true
            })
        }

        conexion.onerror = (ev) =>{
            resolve({
                data: ev,
                state: false
            })
        }
    })
}

const readById = (id: string, database: IDBDatabase) => {
    return new Promise(resolve => {
        const trasaccion = database.transaction(['File'],'readonly')
        const coleccionObjetos = trasaccion.objectStore('File')
        const conexion = coleccionObjetos.openCursor()
    
        conexion.onsuccess = () =>{
            const objectResponse: IDBRequest = coleccionObjetos.get(id)
            objectResponse.onsuccess = (ev) => {
                resolve({
                    data: (ev.target as IDBRequest).result,
                    state: true,
                    error: null
                })
            }
            objectResponse.onerror = (err) => {
                resolve({
                    error: err,
                    state: false
                })
            }
        }
    
        conexion.onerror = (err) =>{
            resolve({
                error: err,
                state: false
            })
        }
    })
}


const readAll = (database: IDBDatabase) => {
    return new Promise<any>(resolve => {
        const trasaccion = database.transaction(['File'],'readonly')
        const coleccionObjetos = trasaccion.objectStore('File')
        const conexion = coleccionObjetos.openCursor()
    
        conexion.onsuccess = () =>{
            const allObject: IDBRequest = coleccionObjetos.getAll()
            allObject.onsuccess = (ev) => {
                resolve({
                    data: (ev.target as IDBRequest).result,
                    state: true,
                    error: null
                })
            }
            allObject.onerror = (err) => {
                resolve({
                    error: err,
                    state: false
                })
            }
        }
    
        conexion.onerror = (err) =>{
            resolve({
                error: err,
                state: false
            })
        }
    })
}

export default {
    init,
    update,
    deleteDb,
    readById,
    readAll
}