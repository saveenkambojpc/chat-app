export const getNameInitial = (name) =>{
    const splitName = name.toUpperCase().split(" ");

    if(splitName.length > 1){
        return splitName[0][0] + splitName[1][0];
    }
    return splitName[0][0];
}

export const transformToArrayWithId =(snapVal) =>{
    
    // console.log(Object.keys(snapVal)[0]);
    // console.log(snapVal[Object.keys(snapVal)[0]])

    return snapVal ? Object.keys(snapVal).map(roomId=>{
        return {...snapVal[roomId],id:roomId}
    }) : []
}